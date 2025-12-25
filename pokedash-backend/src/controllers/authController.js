const authService = require("../services/authService");
const logger = require(`../helpers/logger`);

// SIGNUP
const signup = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const { user, accessToken, refreshToken } = await authService.signup(
      email,
      password,
      username
    );

    // Set cookies for access and refresh tokens
    res.cookie(`accessToken`, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === `production`,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    res.cookie(`refreshToken`, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === `production`,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    res.status(201).json({
      message: `Signup successfully`,
      user,
    });
  } catch (error) {
    logger.error(`Error in signup: ${error.message}`);
    res.status(500).json({ message: `Internal server error ${error}` });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.login(
      identifier,
      password
    );

    // Set cookies for access and refresh tokens
    res.cookie(`accessToken`, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === `production`,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    res.cookie(`refreshToken`, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === `production`,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    res.status(200).json({
      message: `Login successful`,
      user,
    });
  } catch (error) {
    logger.error(`Error in login: ${error.message}`);
    res.status(500).json({ message: `Internal server error` });
  }
};

// REFRESH
const refresh = require("../middleware/validateToken").validateRefreshToken;

// LOGOUT
const logout = (req, res) => {
  res.clearCookie(`accessToken`);
  res.clearCookie(`refreshToken`);
  res.status(200).json({ message: `Logout successful` });
};

// DELETE ACCOUNT
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    await authService.deleteAccount(userId);
    res.clearCookie(`accessToken`);
    res.clearCookie(`refreshToken`);
    res.status(200).json({ message: `Account deleted successfully` });
  } catch (error) {
    logger.error(`Error in deleteAccount: ${error.message}`);
    res.status(500).json({ message: `Internal server error` });
  }
};

// CHANGE USERNAME
const changeUsername = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const updatedUser = await authService.changeUsername(userId, username);

    res.status(200).json({
      message: "Username updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    logger.error(`Error in changeUsername: ${error.message}`);

    if (error.message === "Username already taken") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

// CHANGE PASSWORD
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(userId, currentPassword, newPassword);
    res.status(200).json({ message: `Password changed successfully` });
  } catch (error) {
    logger.error(`Error in changePassword: ${error.message}`);
    res.status(500).json({ message: `Internal server error` });
  }
};

module.exports = {
  signup,
  login,
  refresh,
  logout,
  deleteAccount,
  changeUsername,
  changePassword,
};
