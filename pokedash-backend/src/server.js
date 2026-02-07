const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("./helpers/logger");
const createTables = require("./seed/createTables");

// CONFIGURATIONS
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:3000",
  process.env.VERCEL_URL,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  }),
);

// IMPORT ROUTES
const authRoutes = require("./routes/authRoutes");
const favoritesRoutes = require("./routes/favoritesRoutes");
const teamsRoutes = require("./routes/teamsRoutes");

// ROUTES
app.use("/auth", authRoutes);
app.use("/favorites", favoritesRoutes);
app.use("/teams", teamsRoutes);

// HEALTH CHECK
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// SERVER
const PORT = process.env.PORT || 3000;

// CREATE TABLES
(async () => {
  try {
    await createTables.seedAllTables();
    logger.info("Database tables are ready.");

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    logger.error("Error initializing database tables:", err);
    process.exit(1);
  }
})();
