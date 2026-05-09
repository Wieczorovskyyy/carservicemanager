const mysql = require("mysql2");

const db = mysql.createPool({
  host: process.env.MYSQLHOST || process.env.DB_HOST,
  port: Number(process.env.MYSQLPORT || process.env.DB_PORT || 3306),
  user: process.env.MYSQLUSER || process.env.DB_USER,
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
  database: process.env.MYSQLDATABASE || process.env.DB_NAME,
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