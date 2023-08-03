const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'thisisthePasswordforrootuser1995o7o9',
  database: 'portfolio',
  connectionLimit: 20,
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to the MySQL server.');
    connection.release();
  } catch (error) {
    console.error('Error connecting to the MySQL server:', error);
  }
})();

module.exports = pool;
