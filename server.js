const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Database setup
const db = new sqlite3.Database('./appointments.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the appointments database.');
});



// Create appointments table
db.run(`CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  service TEXT NOT NULL,
  budget TEXT NOT NULL,
  event_date TEXT NOT NULL,
  event_location TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// API endpoint to save appointment
app.post('/api/appointments', (req, res) => {
  const { name, email, phone, address, service, budget, event_date, event_location } = req.body;
  
  db.run(`INSERT INTO appointments (name, email, phone, address, service, budget, event_date, event_location) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
          [name, email, phone, address, service, budget, event_date, event_location], 
          function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
});

// API endpoint to get all appointments
app.get('/api/appointments', (req, res) => {
    console.log('GET request received for /api/appointments');
    db.all(`SELECT * FROM appointments ORDER BY created_at DESC`, [], (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: err.message });
      }
      console.log('Sending appointments:', rows);
      res.json(rows);
    });
  });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.get('/api/check', (req, res) => {
    db.all(`SELECT * FROM appointments`, [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ count: rows.length, appointments: rows });
    });
  });