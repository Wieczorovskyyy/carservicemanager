const mysql = require("mysql2");

const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  port: Number(process.env.MYSQLPORT || 3306),
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("DB pool error:", err);
    return;
  }

  connection.query("SET SESSION innodb_lock_wait_timeout = 5", (lockErr) => {
    if (lockErr) {
      console.error("Failed to set lock wait timeout:", lockErr);
    }
    connection.release();
  });

  console.log("Connected to MySQL");
});

db.on("connection", (connection) => {
  connection.query("SET SESSION innodb_lock_wait_timeout = 5");
});

module.exports = db;