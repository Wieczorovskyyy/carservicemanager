const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
  const { first_name, last_name, email, phone, password } = req.body;
  if (!first_name || !last_name || !email || !phone || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const hashed = bcrypt.hashSync(password, 10);

  const sql = `
    INSERT INTO users (first_name, last_name, email, phone, password, role)
    VALUES (?, ?, ?, ?, ?, 'user')
  `;

  db.query(sql, [first_name, last_name, email, phone, hashed], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "User registered" });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = results[0];

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch)
      return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  });
};

exports.getMe = (req, res) => {
  db.query(
    "SELECT id, first_name, last_name, email, phone, role, created_at FROM users WHERE id = ?",
    [req.user.id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length === 0) return res.status(404).json({ message: "User not found" });
      
      const user = results[0];
      const fullName = `${user.first_name} ${user.last_name}`.trim();
      const initials = user.first_name ? user.first_name.charAt(0).toUpperCase() : "U";
      
      res.json({
        ...user,
        fullName,
        initials
      });
    }
  );
};

exports.updateMe = (req, res) => {
  const { first_name, last_name, email, phone } = req.body;
  if (!first_name || !last_name || !email) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  db.query(
    "UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE id = ?",
    [first_name, last_name, email, phone || null, req.user.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Profile updated" });
    }
  );
};

exports.getAllUsers = (req, res) => {
  const sql = `
    SELECT 
      u.id, u.first_name, u.last_name, u.email, u.phone, u.role, u.created_at,
      COUNT(a.id) as orders_count
    FROM users u
    LEFT JOIN appointments a ON u.id = a.user_id
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.getUserById = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT 
      u.id, u.first_name, u.last_name, u.email, u.phone, u.role, u.created_at,
      COUNT(a.id) as orders_count
    FROM users u
    LEFT JOIN appointments a ON u.id = a.user_id
    WHERE u.id = ?
    GROUP BY u.id
  `;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(results[0]);
  });
};

exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, phone } = req.body;

  const sql = `
    UPDATE users 
    SET first_name = ?, last_name = ?, email = ?, phone = ? 
    WHERE id = ?
  `;

  db.query(sql, [first_name, last_name, email, phone || null, id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated successfully" });
  });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  });
};

exports.updateUserRole = (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const validRoles = ['user', 'mechanic', 'admin'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  db.query("UPDATE users SET role = ? WHERE id = ?", [role, id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Role updated successfully" });
  });
};

exports.changePassword = (req, res) => {
  const { current_password, new_password } = req.body;
  if (!current_password || !new_password) {
    return res.status(400).json({ message: "Missing passwords" });
  }

  db.query("SELECT password FROM users WHERE id = ?", [req.user.id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).json({ message: "User not found" });

    const isMatch = bcrypt.compareSync(current_password, results[0].password);
    if (!isMatch) return res.status(401).json({ message: "Current password is invalid" });

    const hashed = bcrypt.hashSync(new_password, 10);
    db.query("UPDATE users SET password = ? WHERE id = ?", [hashed, req.user.id], (updateErr) => {
      if (updateErr) return res.status(500).json(updateErr);
      res.json({ message: "Password updated" });
    });
  });
};
