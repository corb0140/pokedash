const pool = require("../config/db");

// ADD A FAVORITE POKEMON
const addFavorite = async (userId, pokemonId) => {
  const query = `
    INSERT INTO favorites (user_id, pokemon_id)
    VALUES ($1, $2)
    RETURNING *
  `;
  const values = [userId, pokemonId];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

// REMOVE A FAVORITE POKEMON
const removeFavorite = async (userId, pokemonId) => {
  const query = `
    DELETE FROM favorites
    WHERE user_id = $1 AND pokemon_id = $2
    RETURNING *
  `;
  const values = [userId, pokemonId];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

// GET ALL FAVORITE POKEMON FOR A USER
const getUserFavorites = async (userId) => {
  const query = `
    SELECT pokemon_id, created_at
    FROM favorites
    WHERE user_id = $1
    ORDER BY created_at DESC
  `;

  const { rows } = await pool.query(query, [userId]);
  return rows;
};

module.exports = {
  addFavorite,
  removeFavorite,
  getUserFavorites,
};
