const { Router } = require("express");
const {
  signup,
  login,
  refresh,
  logout,
  deleteAccount,
} = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.delete("/delete-account", authenticate, deleteAccount);

module.exports = router;
