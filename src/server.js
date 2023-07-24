const express = require('express');
const app = express();
const PORT = 3000;
const mysql = require('mysql2');
const cors = require('cors');
const { join } = require('path');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'thisisthePasswordforrootuser1995o7o9',
  database: 'portfolio',
});

connection.connect((error) => {
  if (error) {
    console.error(error);
  } else {
    console.log('Successful connection to the database!');
  }
});

app.use(express.static('public'));

app.post('/', (req, res) => {
  const { name, email, number, message, date } = req.body;

  const query =
    'INSERT INTO messages (contact_name, contact_email, contact_number, content, date) VALUES (?, ?, ?, ?, NOW())';
  const values = [name, email, number, message, date];

  connection.query(query, values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Error submitting message' });
      return;
    }
    res.status(201).json({ message: 'New message submitted', results });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
