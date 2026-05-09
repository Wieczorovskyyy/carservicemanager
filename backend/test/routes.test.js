const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.join(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("appointments API exposes required CRUD endpoints", () => {
  const routes = read("routes/appointments.js");

  assert.match(routes, /router\.get\("\/"/);
  assert.match(routes, /router\.get\("\/:id"/);
  assert.match(routes, /router\.post\("\/"/);
  assert.match(routes, /router\.put\("\/:id"/);
  assert.match(routes, /router\.delete\("\/:id"/);
});

test("users API exposes list, details, update and delete endpoints", () => {
  const routes = read("routes/auth.js");

  assert.match(routes, /router\.get\("\/users"/);
  assert.match(routes, /router\.get\("\/users\/:id"/);
  assert.match(routes, /router\.put\("\/users\/:id"/);
  assert.match(routes, /router\.delete\("\/users\/:id"/);
});

test("database schema has auto-increment ids and more than four fields", () => {
  const schema = read("sql/init.sql");

  assert.match(schema, /CREATE TABLE users \([\s\S]*id INT AUTO_INCREMENT PRIMARY KEY/);
  assert.match(schema, /phone VARCHAR\(30\) NOT NULL/);
  assert.match(schema, /CREATE TABLE appointments \([\s\S]*id INT AUTO_INCREMENT PRIMARY KEY/);
  assert.match(schema, /car_model VARCHAR\(120\) NOT NULL/);
  assert.match(schema, /mileage INT UNSIGNED NULL/);
  assert.match(schema, /service_type VARCHAR\(120\) NOT NULL/);
  assert.match(schema, /status ENUM/);
});
