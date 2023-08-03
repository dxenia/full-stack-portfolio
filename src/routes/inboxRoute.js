const express = require('express');
const router = express.Router();
const app = require('../server.js');
const pool = require('../database.js');

// Contact Form

app.post('/inbox', async (request, response) => {
  const { name, email, number, message, date } = request.body;

  const query =
    'INSERT INTO message (name, email, number, content, date) VALUES (?, ?, ?, ?, NOW())';
  const values = [name, email, number, message, date];

  if (name && email && number && message) {
    try {
      const connection = await pool.getConnection();
      const [results] = await connection.query(query, values);
      connection.release();

      response
        .status(201)
        .json({ message: 'New message successfully submitted!', results });
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: 'Internal Server Error.' });
    }
  } else {
    response
      .status(400)
      .json({ error: 'Bad request. All fields must be filled in.' });
  }
});

// Admin Inbox: GET and DELETE
app.get('/inbox', async (request, response) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query('SELECT * FROM message');
    connection.release();

    response.status(200).json(results);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/inbox/:id', async (request, response) => {
  const { id } = request.params;
  const query = 'DELETE FROM message WHERE message_id = ?';

  if (id) {
    try {
      const connection = await pool.getConnection();
      const [results] = await connection.query(query, [id]);
      connection.release();

      response.status(200).json(results);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: 'Internal Server Error.' });
    }
  } else {
    console.error(error);
    response.status(400).json({ error: 'Bad request. Insert valid id.' });
  }
});

module.exports = router;
