const express = require("express");
const router = express.Router();
const controller = require("../controllers/appointmentController");
const { verifyToken, isAdmin, isStaff } = require("../middleware/auth");

router.get("/my", verifyToken, controller.getMine);
router.get("/calendar", verifyToken, isStaff, controller.getCalendar);
router.post("/", verifyToken, controller.create);
router.patch("/:id/action", verifyToken, controller.userAction);

router.get("/", verifyToken, isStaff, controller.getAll);
router.get("/stats", verifyToken, isStaff, controller.getStats);
router.put("/:id", verifyToken, isStaff, controller.update);

router.get("/:id", verifyToken, controller.getOne);
router.delete("/:id", verifyToken, controller.delete);

module.exports = router;