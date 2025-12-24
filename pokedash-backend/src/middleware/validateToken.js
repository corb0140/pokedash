const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const validateRefreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(200).json({ user: null });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      decoded.id,
    ]);

    if (!rows.length) {
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      return res.status(200).json({ user: null });
    }

    const user = rows[0];

    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "60m" }
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    res.status(200).json({
      user: { id: user.id, email: user.email, username: user.username },
      accessToken: newAccessToken,
    });
  } catch (err) {
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    return res.status(200).json({ user: null });
  }
};

module.exports = {
  validateRefreshToken,
};
