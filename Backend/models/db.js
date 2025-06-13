const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Admin@123',
  database: 'car_db'
});

module.exports = pool.promise();
