const express = require('express');
const router = express.Router();
const pool = require('../database.js');

// Admin Career: GET, POST, DELETE, PUT

router.get('/career', async (request, response) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query('SELECT * FROM experience');
    connection.release();

    response.status(200).json(results);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal server error.' });
  }
});

router.delete('/career/:id', async (request, response) => {
  const { id } = request.params;
  const query = 'DELETE FROM experience WHERE experience_id = ?';

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

router.put('/career/:id', async (request, response) => {
  const { id } = request.params;
  const { position, company, year } = request.body;
  const query =
    'UPDATE experience SET position = ?, company = ?, year = ? WHERE experience_id = ?';

  if (id && position && company && year) {
    try {
      const connection = await pool.getConnection();
      const [results] = await connection.query(query, [
        position,
        company,
        year,
        id,
      ]);
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

router.post('/career', async (request, response) => {
  const { position, company, year } = request.body;
  const query =
    'INSERT INTO experience (position, company, year) VALUES (?, ?, ?)';
  const values = [position, company, year];

  if (position && company && year) {
    try {
      const connection = await pool.getConnection();
      const [results] = await connection.query(query, values);
      connection.release();

      response
        .status(201)
        .json({ message: 'New item successfully submitted!', results });
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

module.exports = router;
