const mysql = require('mysql2');

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

module.exports = connection;
