const teamService = require("../services/teamsServices");

const getTeams = async (req, res) => {
  try {
    const teams = await teamService.getTeamsByUser(req.user.id);
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTeam = async (req, res) => {
  try {
    const { name, pokemonIds } = req.body;

    const team = await teamService.createTeam(req.user.id, name, pokemonIds);

    res.status(201).json(team);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteTeam = async (req, res) => {
  try {
    await teamService.deleteTeam(req.user.id, req.params.teamId);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getTeams,
  createTeam,
  deleteTeam,
};
