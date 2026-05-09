require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://carservicemanager.vercel.app",
  "https://carservicemanager-zojs.vercel.app",
  "https://carservicemanager-zojs-git-main-wieczorovskyyys-projects.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
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

app.use("/api/auth", require("./routes/auth"));
app.use("/api/appointments", require("./routes/appointments"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});