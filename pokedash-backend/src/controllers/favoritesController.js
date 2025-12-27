const favoritesService = require("../services/favoritesService");

// ADD A FAVORITE POKEMON
const addFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pokemonId } = req.params;

    if (!pokemonId) {
      return res.status(400).json({ message: "pokemonId is required" });
    }

    const favorite = await favoritesService.addFavorite(userId, pokemonId);
    res.status(201).json(favorite);
  } catch (error) {
    if (error.code === "23505") {
      // unique constraint violation
      return res.status(409).json({ message: "Pokemon already in favorites" });
    }
    res.status(500).json({ message: "Failed to add favorite" });
  }
};

// REMOVE A FAVORITE POKEMON
const removeFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pokemonId } = req.params;

    const removed = await favoritesService.removeFavorite(userId, pokemonId);

    if (!removed) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    res.json({ message: "Favorite removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove favorite" });
  }
};

// GET ALL FAVORITE POKEMON FOR A USER
const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const favorites = await favoritesService.getUserFavorites(userId);
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getFavorites,
};
