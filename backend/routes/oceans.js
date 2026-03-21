const express = require("express");
const router = express.Router();
const db = require("../middleware/db");

router.get("/", async (req, res) => {
  try {
    const oceans = await db.getAllOceans();
    res.json({ success: true, count: oceans.length, data: oceans });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const ocean = await db.getOceanById(req.params.id);
    if (!ocean) {
      return res.status(404).json({ success: false, error: "Océan introuvable" });
    }
    res.json({ success: true, data: ocean });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, type, area_km2, max_depth_m, avg_temp_celsius, location, description, fun_fact, image_url } = req.body;

    if (!name || !type || !area_km2) {
      return res.status(400).json({
        success: false,
        error: "Les champs name, type et area_km2 sont obligatoires"
      });
    }

    if (!["ocean", "mer"].includes(type)) {
      return res.status(400).json({
        success: false,
        error: "Le type doit être 'ocean' ou 'mer'"
      });
    }

    const newOcean = await db.createOcean({
      name,
      type,
      area_km2: Number(area_km2),
      max_depth_m: max_depth_m ? Number(max_depth_m) : null,
      avg_temp_celsius: avg_temp_celsius ? Number(avg_temp_celsius) : null,
      location: location || "",
      description: description || "",
      fun_fact: fun_fact || "",
      image_url: image_url || ""
    });

    res.status(201).json({ success: true, data: newOcean });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const ocean = await db.getOceanById(req.params.id);
    if (!ocean) {
      return res.status(404).json({ success: false, error: "Océan introuvable" });
    }
    await db.deleteOcean(req.params.id);
    res.json({ success: true, message: `"${ocean.name}" supprimé avec succès` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
