const { Router } = require("express");
const {
  signup,
  login,
  refresh,
  logout,
} = require("../controllers/authController");

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

module.exports = router;
