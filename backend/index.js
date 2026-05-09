require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("../routes/auth");
const appointmentRoutes = require("../routes/appointments");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://carservicemanager-zojs-git-main-wieczorovskyyys-projects.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Backend działa"
  });
});

app.get("/api/test", (req, res) => {
  res.json({
    message: "API działa poprawnie"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);

module.exports = app;