require("dotenv").config();

const app = require("./config/app");
const sequelize = require("./config/database");

const models = require("./models");

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Connection to database has been established successfully.");

    // et conserver les données existantes
    await sequelize.sync({ force: false, alter: false });
    console.log("Database synchronization check completed");
    return true;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    console.log("Database initialization error, but continuing...");
    return false;
  }
}

app.get("/api/status", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

if (process.env.NODE_ENV !== "production") {
  initializeDatabase().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
} else {
  initializeDatabase().catch((err) => {
    console.error("Database initialization failed in production:", err);
  });
}

module.exports = app;
