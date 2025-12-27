const { Router } = require("express");
const favoritesController = require("../controllers/favoritesController");
const { authenticate } = require("../middleware/authMiddleware");

const router = Router();

router.post("/:pokemonId", authenticate, favoritesController.addFavorite);
router.get("/", authenticate, favoritesController.getFavorites);
router.delete("/:pokemonId", authenticate, favoritesController.removeFavorite);

module.exports = router;
