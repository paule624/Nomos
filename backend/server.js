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

// Gestionnaire pour les routes 404 qui renvoie les routes disponibles
// Doit être défini après toutes les autres routes
app.use((req, res) => {
  // Collecte de toutes les routes disponibles
  const routes = [];

  // Parcourir les routes d'Express
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Routes directement attachées à l'application
      routes.push(middleware.route.path);
    } else if (middleware.name === "router") {
      // Routes des routeurs (comme articleRoutes, userRoutes, etc.)
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          let path = "";
          // Reconstruire le chemin complet en combinant le préfixe du routeur et le chemin de la route
          if (middleware.regexp && middleware.regexp.source) {
            const match = middleware.regexp.source.match(/^\\\/([^\\\/]+)/);
            if (match) {
              path = "/" + match[1];
            }
          }
          routes.push(path + handler.route.path);
        }
      });
    }
  });

  // Trier et filtrer les doublons
  const availableRoutes = [...new Set(routes)].sort();

  res.status(404).json({
    message: `Route ${req.path} not found`,
    availableRoutes,
  });
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
