const { Router } = require("express");
const controller = require("../controllers/teamsController");
const { authenticate } = require("../middleware/authMiddleware");

const router = Router();

router.get("/", authenticate, controller.getTeams);
router.post("/", authenticate, controller.createTeam);
router.delete("/:teamId", authenticate, controller.deleteTeam);

module.exports = router;
