const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');

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

app.get('/tickets', (req, res) => {
  con.query('SELECT * FROM TICKETS', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.get('/tickets/:id', (req, res) => {
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


app.listen(3000, () => {
  console.log('Backend running on port 3000');
});
