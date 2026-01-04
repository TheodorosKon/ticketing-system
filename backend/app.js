const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const auth = require('./middleware/auth');
const adminOnly = require('./middleware/adminOnly');
const audit = require('./utils/audit');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const ACCESS_TOKEN_EXP = '15m';
const REFRESH_TOKEN_DAYS = 30;

const JWT_SECRET = 'dev_secret_change_later';


let con = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "root",
    database: "TicketingSystem"
});

con.connect(err => {
  if (err) {
    console.error('DB connection failed:', err);
    process.exit(1);
  }
  console.log('Connected to Database successfully');
});

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.get('/tickets/:id/comments', auth, (req, res) => {
  con.query(
    'SELECT * FROM COMMENTS WHERE ticket_id = ? ORDER BY created_at',
    [req.params.id],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
    }
  );
});

app.post('/tickets/:id/comments', express.json(), auth, (req, res) => {
  const { body, user_id } = req.body;
  const ticketId = req.params.id;

  if (!body || !user_id) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  con.query(
    `INSERT INTO COMMENTS (ticket_id, user_id, body, created_at)
     VALUES (?, ?, ?, NOW())`,
    [ticketId, user_id, body],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'DB error' });
      }
      res.status(201).json({ success: true });
    }
  );
});

app.get('/tickets', (req, res) => {
  con.query('SELECT * FROM TICKETS', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.get('/tickets/:id', auth, (req, res) => {
  const ticketId = req.params.id;

  con.query(
    'SELECT * FROM TICKETS WHERE ticket_id = ?',
    [ticketId],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      res.json(results[0]);
    }
  );
});

app.post('/auth/login', express.json(), (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: 'Missing credentials' });

  con.query(
    'SELECT user_id, username, password_hash, role_id, force_password_change FROM USERS WHERE username = ? AND is_active = 1',
    [username],
    async (err, rows) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (rows.length === 0)
        return res.status(401).json({ error: 'Invalid credentials' });

      const user = rows[0];
      const match = await bcrypt.compare(password, user.password_hash);

      if (!match)
        return res.status(401).json({ error: 'Invalid credentials' });

      const accessToken = jwt.sign(
        { user_id: user.user_id, role_id: user.role_id },
        JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXP }
      );

      const refreshToken = crypto.randomBytes(64).toString('hex');

      con.query(
        `INSERT INTO REFRESH_TOKENS (user_id, token, expires_at)
        VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? DAY))`,
        [user.user_id, refreshToken, REFRESH_TOKEN_DAYS]
      );

      res.json({
        accessToken,
        refreshToken,
        force_password_change: user.force_password_change === 1
      });
    }
  );
});

app.post('/auth/refresh', express.json(), (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(400).json({ error: 'Missing refresh token' });

  con.query(
    `SELECT rt.user_id, u.role_id
     FROM REFRESH_TOKENS rt
     JOIN USERS u ON rt.user_id = u.user_id
     WHERE rt.token = ? AND rt.revoked = 0 AND rt.expires_at > NOW()`,
    [refreshToken],
    (err, rows) => {
      if (err || rows.length === 0)
        return res.status(401).json({ error: 'Invalid refresh token' });

      const user = rows[0];

      const newAccessToken = jwt.sign(
        { user_id: user.user_id, role_id: user.role_id },
        JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXP }
      );

      res.json({ accessToken: newAccessToken });
    }
  );
});

app.post('/auth/logout', auth, (req, res) => {
  con.query(
    'UPDATE REFRESH_TOKENS SET revoked = 1 WHERE user_id = ?',
    [req.user.user_id],
    () => res.json({ message: 'Logged out' })
  );
});

app.post('/admin/users', auth, adminOnly, express.json(), async (req, res) => {
  const {
    username,
    email,
    password,
    first_name,
    last_name,
    role_id
  } = req.body;

  if (!username || !email || !password || !role_id) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const hash = await bcrypt.hash(password, 10);

  con.query(
    `INSERT INTO USERS 
     (username, email, password_hash, first_name, last_name, role_id, is_active, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 1, NOW())`,
    [username, email, hash, first_name, last_name, role_id],
    (err) => {
      if (err) return res.status(500).json({ error: 'User creation failed' });

      audit.log(
        con,
        req.user.user_id,
        'CREATE_USER',
        null,
        { username, email, role_id }
      );

      res.json({ message: 'User created' });
    }
  );
});

app.get('/admin/users', auth, adminOnly, (req, res) => {
  con.query(
    `SELECT user_id, username, email, first_name, last_name, is_active, role_id
     FROM USERS
     ORDER BY created_at DESC`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      res.json(rows);
    }
  );
});

app.patch('/admin/users/:id/status', auth, adminOnly, express.json(), (req, res) => {
  const targetId = req.params.id;
  const is_active = req.body.is_active;

  if (req.user.user_id == req.params.id) {
    return res.status(400).json({ error: 'Cannot disable yourself' });
  }

  con.query(
    'UPDATE USERS SET is_active = ? WHERE user_id = ?',
    [req.body.is_active, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Update failed' });

      audit.log(
        con,
        req.user.user_id,
        is_active ? 'ENABLE_USER' : 'DISABLE_USER',
        targetId
      );

      res.json({ message: 'User updated' });
    }
  );
});


app.get('/admin/roles', auth, adminOnly, (req, res) => {
  con.query(
    'SELECT role_id, role_name FROM ROLES',
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      res.json(rows);
    }
  );
});

app.get('/roles', auth, adminOnly, (req, res) => {
  con.query(
    'SELECT role_id, role_name, description FROM ROLES',
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      res.json(rows);
    }
  );
});

app.patch('/admin/users/:id/role', auth, adminOnly, express.json(), (req, res) => {
  const { role_id } = req.body;
  const targetId = req.params.id;

  con.query(
    'UPDATE USERS SET role_id = ? WHERE user_id = ?',
    [role_id, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Update failed' });

      audit.log(
        con,
        req.user.user_id,
        'CHANGE_USER_ROLE',
        targetId,
        { new_role_id: role_id }
      );

      res.json({ message: 'Role updated' });
    }
  );
});

app.get('/admin/audit', auth, adminOnly, (req, res) => {
  con.query(
    `SELECT 
        a.audit_id,
        a.action,
        a.created_at,
        u1.username AS actor,
        u2.username AS target
     FROM AUDIT_LOGS a
     LEFT JOIN USERS u1 ON a.actor_user_id = u1.user_id
     LEFT JOIN USERS u2 ON a.target_user_id = u2.user_id
     ORDER BY a.created_at DESC
     LIMIT 200`,
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'DB error' });
      }
      res.json(rows);
    }
  );
});

app.patch(
  '/admin/users/:id/password-reset',
  auth,
  adminOnly,
  express.json(),
  async (req, res) => {
    const targetId = req.params.id;
    const { new_password } = req.body;

    if (!new_password)
      return res.status(400).json({ error: 'Password required' });

    const hash = await bcrypt.hash(new_password, 10);

    con.query(
      'UPDATE USERS SET password_hash = ?, password_updated_at = NOW() WHERE user_id = ?',
      [hash, targetId],
      (err) => {
        if (err) return res.status(500).json({ error: 'Update failed' });

        audit.log(
          con,
          req.user.user_id,
          'RESET_USER_PASSWORD',
          targetId
        );

        res.json({ message: 'Password reset' });
      }
    );
  }
);

app.patch('/admin/users/:id/force-password-change', auth, adminOnly, (req, res) => {
  const targetId = req.params.id;

  con.query(
    'UPDATE USERS SET force_password_change = 1 WHERE user_id = ?',
    [targetId],
    (err) => {
      if (err) return res.status(500).json({ error: 'Update failed' });

      audit.log(
        con,
        req.user.user_id,
        'FORCE_PASSWORD_CHANGE',
        targetId
      );

      res.json({ message: 'Password change forced' });
    }
  );
});

app.post('/auth/change-password', auth, express.json(), async (req, res) => {
  const { old_password, new_password } = req.body;

  if (!old_password || !new_password)
    return res.status(400).json({ error: 'Missing fields' });

  con.query(
    'SELECT password_hash FROM USERS WHERE user_id = ?',
    [req.user.user_id],
    async (err, rows) => {
      if (err || rows.length === 0)
        return res.status(500).json({ error: 'DB error' });

      const valid = await bcrypt.compare(old_password, rows[0].password_hash);
      if (!valid)
        return res.status(401).json({ error: 'Wrong password' });

      const hash = await bcrypt.hash(new_password, 10);

      con.query(
        'UPDATE USERS SET password_hash = ?, force_password_change = 0 WHERE user_id = ?',
        [hash, req.user.user_id],
        (err) => {
          if (err) return res.status(500).json({ error: 'Update failed' });
          res.json({ message: 'Password changed' });
        }
      );
    }
  );
});

app.listen(3000, () => {
  console.log('Backend running on port 3000');
});
