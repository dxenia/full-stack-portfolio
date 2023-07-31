const express = require('express');
const { join } = require('path');
const path = require('path');
const router = express.Router();
const multer = require('multer');
const app = require('./server.js');
const connection = require('./database.js');

// Contact form
app.post('/submit', (request, response) => {
  const { name, email, number, message, date } = request.body;

  const query =
    'INSERT INTO message (name, email, number, content, date) VALUES (?, ?, ?, ?, NOW())';
  const values = [name, email, number, message, date];

  connection.query(query, values, (error, results) => {
    if (error) {
      console.error(error);
      return response.status(500).json({ error: 'Error submitting message' });
    }
    response.status(201).json({ message: 'New message submitted', results });
  });
});

// Login

const authenticateUser = (request, response, next) => {
  if (request.session.loggedIn) {
    next();
  } else {
    response.status(401).json({ error: 'Unauthorized' });
  }
};

app.get('/dashboard', authenticateUser, (request, response) => {
  response.sendFile(path.resolve(__dirname, '../public/dashboard.html'));
});

app.post('/login', (request, response) => {
  const { username, password } = request.body;

  const query = 'SELECT * FROM admin WHERE username = ? AND password = ?';
  const values = [username, password];

  if (username && password) {
    connection.query(query, values, function (error, results) {
      if (error) {
        throw error;
      } else if (results.length > 0) {
        request.session.loggedIn = true;
        request.session.username = username;
        response.status(200).json({ loggedIn: false });
      } else {
        response.status(401).json({ loggedIn: false });
      }
    });
  } else {
    response.status(400).json({
      loggedIn: false,
    });
  }
});

// Admin Personal Details
app.get('/admin', (request, response) => {
  connection.query('SELECT * FROM admin', (error, results) => {
    if (error) {
      console.error(error);
      response
        .status(500)
        .json({ error: 'Error displaying admin information' });
      return;
    }
    response.status(200).json(results);
  });
});

// Admin Inbox
app.get('/inbox', (request, response) => {
  connection.query('SELECT * FROM message', (error, results) => {
    if (error) {
      console.error(error);
      response.status(500).json({ error: 'Error displaying messages' });
      return;
    }
    response.status(200).json(results);
  });
});

app.delete('/inbox/:id', (request, response) => {
  const { id } = request.params;
  connection.query(
    'DELETE FROM message WHERE message_id = ?',
    [id],
    (error, results) => {
      if (error) {
        console.error(error);
        response.status(500).json({ error: 'Error deleting message' });
        return;
      }
      response.status(200).json(results);
    }
  );
});

// Admin Media Library

const upload = multer({ dest: 'uploads/' });

// Route to handle media upload
app.post('/upload', upload.single('media'), (req, res) => {
  const file = req.file; // Uploaded media file
  // Process the file, save the file path, and other relevant metadata to the database.
  // For simplicity, this example just logs the file path.
  console.log('File path:', file.path);
  res.sendStatus(200);
});

// Admin Career

app.get('/career', (request, response) => {
  connection.query('SELECT * FROM experience', (error, results) => {
    if (error) {
      console.error(error);
      response.status(500).json({ error: 'Error displaying messages' });
      return;
    }
    response.status(200).json(results);
  });
});

app.delete('/career/:id', (request, response) => {
  const { id } = request.params;
  connection.query(
    'DELETE FROM experience WHERE experience_id = ?',
    [id],
    (error, results) => {
      if (error) {
        console.error(error);
        response.status(500).json({ error: 'Error deleting message' });
        return;
      }
      response.status(200).json(results);
    }
  );
});

app.put('/career/:id', (request, response) => {
  const { id } = request.params;
  const { position, company, year } = request.body;

  connection.query(
    'UPDATE experience SET position = ?, company = ?, year = ? WHERE experience_id = ?',
    [position, company, year, id],
    (error, results) => {
      if (error) {
        console.error(error);
        response.status(500).json({ error: 'Error updating item' });
        return;
      }
      response.status(200).json(results);
    }
  );
});

app.post('/career', (request, response) => {
  const { position, company, year } = request.body;

  connection.query(
    'INSERT INTO experience (position, company, year) VALUES (?, ?, ?)',
    [position, company, year],
    (error, results) => {
      if (error) {
        console.error(error);
        response.status(500).json({ error: 'Error updating item' });
        return;
      }
      response.status(200).json(results);
    }
  );
});

module.exports = router;
