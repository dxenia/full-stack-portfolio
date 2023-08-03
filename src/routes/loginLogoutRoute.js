const express = require('express');
const router = express.Router();
const pool = require('../database.js');
const path = require('path');
const session = require('express-session');

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

router.get('/dashboard', authenticateUser, async (request, response) => {
  response.sendFile(path.resolve(__dirname, '../../public/dashboard.html'));
});

router.post('/login', async (request, response) => {
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

router.post('/logout', async (request, response) => {
  request.session.loggedIn = false;
  response
    .status(200)
    .json({ message: 'User has been successfully logged out.' });
});

module.exports = router;
