const path = require('path');
const dotenv = require('dotenv');

const dotenvPath = path.resolve(__dirname, '../.env');

dotenv.config({ path: dotenvPath });

const mysql = require('mysql2/promise');

// const pool = mysql.createPool({
//   host: process.env.MYSQL_HOST,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DATABASE,
//   connectionLimit: 20,
// });

const pool = mysql.createPool(process.env.CLEARDB_DATABASE_URL);

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
