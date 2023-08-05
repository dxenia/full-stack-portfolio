const express = require('express');
const router = express.Router();
const pool = require('../database.js');
const Joi = require('joi');

router.post('/inbox', async (request, response) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    number: Joi.number().integer().required(),
    message: Joi.string().required(),
  });

  const { name, email, number, message, date } = request.body;

  const query =
    'INSERT INTO message (name, email, number, content, date) VALUES (?, ?, ?, ?, NOW())';
  const values = [name, email, number, message, date];

  const { error } = schema.validate(request.body);
  if (error) {
    response.status(400).json({ error: error.details[0].message });
    return;
  }

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
});

router.get('/inbox', async (request, response) => {
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

router.delete('/inbox/:id', async (request, response) => {
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
