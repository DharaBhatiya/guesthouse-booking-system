const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
const adminController = require("../controllers/adminController");

router.post(
  "/rooms/create",
  verifyToken,
  isAdmin,
  adminController.createRoom
);
router.put(
  "/rooms/update/:id",
  verifyToken,
  isAdmin,
  adminController.updateRoom
);
router.delete(
  "/rooms/delete/:id",
  verifyToken,
  isAdmin,
  adminController.deleteRoom
);
router.post(
  "/rooms/set-price",
  verifyToken,
  isAdmin,
  adminController.setRoomPrice
);
router.post(
  "/bookings/create-walkin",
  verifyToken,
  isAdmin,
  adminController.createWalkinBooking
);
router.get(
  "/customers/history",
  verifyToken,
  isAdmin,
  adminController.customerHistory
);
router.post(
  "/users/create-staff",
  verifyToken,
  isAdmin,
  adminController.createStaff
);
router.get(
  "/users/list",
  verifyToken,
  isAdmin,
  adminController.listStaff
);

module.exports = router;
