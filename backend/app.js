const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const auth = require('./middleware/auth');
const adminOnly = require('./middleware/adminOnly');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    'SELECT user_id, username, password_hash, role_id FROM USERS WHERE username = ? AND is_active = 1',
    [username],
    async (err, rows) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (rows.length === 0)
        return res.status(401).json({ error: 'Invalid credentials' });

      const user = rows[0];
      const match = await bcrypt.compare(password, user.password_hash);

      if (!match)
        return res.status(401).json({ error: 'Invalid credentials' });

      const token = jwt.sign(
        { user_id: user.user_id, role_id: user.role_id },
        JWT_SECRET,
        { expiresIn: '8h' }
      );

      res.json({ token });
    }
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
      res.json({ message: 'User created' });
    }
  );
});

app.listen(3000, () => {
  console.log('Backend running on port 3000');
});
