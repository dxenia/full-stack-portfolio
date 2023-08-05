const express = require('express');
const router = express.Router();
const pool = require('../database.js');

router.get('/admin', async (request, response) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query('SELECT * FROM admin');
    connection.release();

    response.status(200).json(results);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal Server Error.' });
  }
});

module.exports = router;
