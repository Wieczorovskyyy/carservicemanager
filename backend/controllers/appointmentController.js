const db = require("../config/db");

exports.getAll = (req, res) => {
  const sql = `
    SELECT a.*, u.first_name, u.last_name, u.email, u.phone 
    FROM appointments a
    JOIN users u ON a.user_id = u.id
    ORDER BY a.created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.getCalendar = (req, res) => {
  const sql = `
    SELECT a.*, u.first_name, u.last_name, u.email, u.phone 
    FROM appointments a
    JOIN users u ON a.user_id = u.id
    WHERE a.appointment_date IS NOT NULL
    AND a.status NOT IN ('cancelled', 'rejected', 'error')
    ORDER BY a.appointment_date ASC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.getStats = (req, res) => {
  const sql = `
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
      SUM(CASE WHEN status = 'error' THEN 1 ELSE 0 END) as error,
      SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as done
    FROM appointments
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
};

exports.getMine = (req, res) => {
  db.query(
    "SELECT * FROM appointments WHERE user_id = ?",
    [req.user.id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

exports.getOne = (req, res) => {
  const sql =
    req.user.role === "admin" || req.user.role === "mechanic"
      ? "SELECT * FROM appointments WHERE id = ?"
      : "SELECT * FROM appointments WHERE id = ? AND user_id = ?";

  const params =
    req.user.role === "admin" || req.user.role === "mechanic"
      ? [req.params.id]
      : [req.params.id, req.user.id];

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json(err);
    if (!result[0]) return res.status(404).json({ message: "Not found" });
    res.json(result[0]);
  });
};

exports.create = (req, res) => {
  const { car_model, mileage, service_type, description, appointment_date } = req.body;
  const normalizedMileage = mileage === undefined || mileage === null || mileage === "" ? null : Number(mileage);

  if (normalizedMileage !== null && (!Number.isInteger(normalizedMileage) || normalizedMileage < 0)) {
    return res.status(400).json({ message: "Nieprawidlowy przebieg pojazdu." });
  }

  const sql = `
    INSERT INTO appointments (user_id, car_model, mileage, service_type, description, appointment_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [req.user.id, car_model, normalizedMileage, service_type, description || null, appointment_date || null],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Appointment created" });
    }
  );
};

exports.update = (req, res) => {
  const { status, appointment_date, description, notes } = req.body;
  const validStatuses = ["new", "accepted", "in_progress", "done", "error", "rejected", "cancelled", "change_requested"];
  const normalizedStatus = status || "new";
  const normalizedDate = appointment_date ? appointment_date.replace("T", " ") + ":00" : null;

  if (!validStatuses.includes(normalizedStatus)) {
    return res.status(400).json({ message: "Nieprawidlowy status zgloszenia." });
  }

  db.query(
    "UPDATE appointments SET status = ?, appointment_date = ?, description = COALESCE(?, description), notes = ? WHERE id = ?",
    [normalizedStatus, normalizedDate, description || null, notes || null, req.params.id],
    (err, result) => {
      if (err) {
        if (err.code === "ER_LOCK_WAIT_TIMEOUT") {
          return res.status(409).json({ message: "Rekord jest aktualnie zablokowany. Sprobuj ponownie za chwile." });
        }
        return res.status(500).json(err);
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Nie znaleziono zgloszenia." });
      }
      res.json({ message: "Updated" });
    }
  );
};

exports.userAction = (req, res) => {
  const { action } = req.body;
  const { id } = req.params;

  let newStatus = "";
  if (action === "cancel") newStatus = "cancelled";
  else if (action === "request_change") newStatus = "change_requested";
  else return res.status(400).json({ message: "Invalid action" });

  db.query(
    "UPDATE appointments SET status = ? WHERE id = ? AND user_id = ?",
    [newStatus, id, req.user.id],
    (err, result) => {
      if (err) {
        if (err.code === "ER_LOCK_WAIT_TIMEOUT") {
          return res.status(409).json({ message: "Nie udalo sie zaktualizowac statusu. Sprobuj ponownie za chwile." });
        }
        return res.status(500).json(err);
      }
      if (result.affectedRows === 0) return res.status(404).json({ message: "Appointment not found" });
      res.json({ message: `Status updated to ${newStatus}` });
    }
  );
};

exports.delete = (req, res) => {
  const isStaff = req.user.role === "admin" || req.user.role === "mechanic";
  const sql =
    isStaff
      ? "DELETE FROM appointments WHERE id = ?"
      : "DELETE FROM appointments WHERE id = ? AND user_id = ?";
  const params = isStaff ? [req.params.id] : [req.params.id, req.user.id];

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Not found or forbidden" });
    }
    res.json({ message: "Deleted" });
  });
};
