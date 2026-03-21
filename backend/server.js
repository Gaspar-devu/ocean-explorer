require("dotenv").config();
const express = require("express");
const cors = require("cors");

const oceansRouter = require("./routes/oceans");
const speciesRouter = require("./routes/species");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Ocean Explorer API opérationnelle",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    team: ["Gaspar Le Forestier", "Marwane Chafi", "Stanislas Prigent"]
  });
});

app.use("/api/oceans", oceansRouter);
app.use("/api/species", speciesRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.url} introuvable` });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: "Erreur interne du serveur" });
});

app.listen(PORT, () => {
  console.log(`🌊 Ocean Explorer API démarrée sur le port ${PORT}`);
  console.log(`📍 Environnement : ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 http://localhost:${PORT}/api/health`);
});

module.exports = app; // Export pour les tests Jest
