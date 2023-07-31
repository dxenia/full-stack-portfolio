const express = require('express');
const session = require('express-session');
const app = express();
const PORT = 3000;
const cors = require('cors');

app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static('public'));

module.exports = app;
