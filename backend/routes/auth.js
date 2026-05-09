const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");
const { verifyToken, isStaff } = require("../middleware/auth");

router.post("/register", auth.register);
router.post("/login", auth.login);
router.get("/me", verifyToken, auth.getMe);
router.put("/me", verifyToken, auth.updateMe);
router.get("/users", verifyToken, isStaff, auth.getAllUsers);
router.get("/users/:id", verifyToken, isStaff, auth.getUserById);
router.put("/users/:id", verifyToken, isStaff, auth.updateUser);
router.patch("/users/:id/role", verifyToken, isStaff, auth.updateUserRole);
router.delete("/users/:id", verifyToken, isStaff, auth.deleteUser);
router.put("/change-password", verifyToken, auth.changePassword);

module.exports = router;