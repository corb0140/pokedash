const pool = require("../config/db");

const getUserTeamCount = async (userId) => {
  const { rows } = await pool.query(
    `SELECT COUNT(*) FROM teams WHERE user_id = $1`,
    [userId]
  );
  return parseInt(rows[0].count);
};

const getTeamsByUser = async (userId) => {
  const { rows } = await pool.query(
    `
    SELECT t.id, t.name,
      ARRAY_AGG(tp.pokemon_id ORDER BY tp.created_at) AS pokemon
    FROM teams t
    LEFT JOIN team_pokemon tp ON tp.team_id = t.id
    WHERE t.user_id = $1
    GROUP BY t.id
    `,
    [userId]
  );

  return rows;
};

const createTeam = async (userId, name, pokemonIds) => {
  if (!Array.isArray(pokemonIds) || pokemonIds.length !== 6) {
    throw new Error("A team must have exactly 6 Pokémon");
  }

  const teamCount = await getUserTeamCount(userId);
  if (teamCount >= 10) {
    throw new Error("Maximum of 10 teams allowed");
  }

  const { rows } = await pool.query(
    `INSERT INTO teams (user_id, name)
     VALUES ($1, $2)
     RETURNING id`,
    [userId, name]
  );

  const teamId = rows[0].id;

  for (const pokemonId of pokemonIds) {
    await pool.query(
      `INSERT INTO team_pokemon (team_id, pokemon_id)
       VALUES ($1, $2)`,
      [teamId, pokemonId]
    );
  }

  return { teamId };
};

const deleteTeam = async (userId, teamId) => {
  await pool.query(
    `DELETE FROM teams
     WHERE id = $1 AND user_id = $2`,
    [teamId, userId]
  );
};

module.exports = {
  getTeamsByUser,
  createTeam,
  deleteTeam,
};
