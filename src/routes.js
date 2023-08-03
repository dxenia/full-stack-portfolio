const express = require('express');
const session = require('express-session');
const { join } = require('path');
const path = require('path');
const router = express.Router();
const multer = require('multer');
const app = require('./server.js');
const pool = require('./database.js');
const cors = require('cors');
const crypto = require('crypto');

const generateSecretKey = () => {
  return crypto.randomBytes(64).toString('hex');
};

const secretKey = generateSecretKey();
app.use(cors());
app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Contact form
app.post('/submit', async (request, response) => {
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

// Login

const authenticateUser = (request, response, next) => {
  if (request.session.loggedIn) {
    next();
  } else {
    response
      .status(401)
      .json({ error: 'Access to admin dashboard not authorized.' });
  }
};

app.get('/dashboard', authenticateUser, async (request, response) => {
  response.sendFile(path.resolve(__dirname, '../public/dashboard.html'));
});

app.post('/login', async (request, response) => {
  const { username, password } = request.body;

  const query = 'SELECT * FROM admin WHERE username = ? AND password = ?';
  const values = [username, password];

  if (username && password) {
    try {
      const [result] = await pool.query(query, values);

      if (result.length > 0) {
        request.session.loggedIn = true;
        request.session.username = username;
        response
          .status(200)
          .json({ loggedIn: true, message: 'Welcome to the admin dashboard.' });
      } else {
        response.status(401).json({
          loggedIn: false,
          error:
            'Access to admin dashboard not authorized. Check your credentials.',
        });
      }
    } catch (error) {
      console.error(error);
      response
        .status(500)
        .json({ loggedIn: false, error: 'Internal Server Error.' });
    }
  } else {
    response.status(400).json({
      loggedIn: false,
      error: 'Bad Request. Please insert both username and password.',
    });
  }
});

// Logout

app.post('/logout', async (request, response) => {
  request.session.loggedIn = false;
  response
    .status(200)
    .json({ message: 'User has been successfully logged out.' });
});

// Admin Personal Details: GET
app.get('/admin', async (request, response) => {
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

// // Admin Media Library

// Admin Career: GET, POST, DELETE, PUT

app.get('/career', async (request, response) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query('SELECT * FROM experience');
    connection.release();

    response.status(200).json(results);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Error displaying messages' });
  }
});

app.delete('/career/:id', async (request, response) => {
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
      response.status(500).json({ error: 'Error deleting item.' });
    }
  } else {
    console.error(error);
    response.status(400).json({ error: 'Bad request. Insert valid id.' });
  }
});

app.put('/career/:id', async (request, response) => {
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
      response.status(500).json({ error: 'Error updating item.' });
    }
  } else {
    console.error(error);
    response.status(400).json({ error: 'Bad request. Insert valid id.' });
  }
});

app.post('/career', async (request, response) => {
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
