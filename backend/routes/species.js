const express = require("express");
const router = express.Router();
const db = require("../middleware/db");

router.get("/", async (req, res) => {
  try {
    const species = await db.getAllSpecies();

    const { category } = req.query;
    const result = category
      ? species.filter((s) => s.category.toLowerCase() === category.toLowerCase())
      : species;

    res.json({ success: true, count: result.length, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const species = await db.getSpeciesById(req.params.id);
    if (!species) {
      return res.status(404).json({ success: false, error: "Espèce introuvable" });
    }
    res.json({ success: true, data: species });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, scientific_name, category, conservation_status, max_length_m, max_weight_kg, description, ocean_ids, image_url } = req.body;

    if (!name || !scientific_name || !category) {
      return res.status(400).json({
        success: false,
        error: "Les champs name, scientific_name et category sont obligatoires"
      });
    }

    const newSpecies = await db.createSpecies({
      name,
      scientific_name,
      category,
      conservation_status: conservation_status || "Non évalué",
      max_length_m: max_length_m ? Number(max_length_m) : null,
      max_weight_kg: max_weight_kg ? Number(max_weight_kg) : null,
      description: description || "",
      ocean_ids: ocean_ids || [],
      image_url: image_url || ""
    });

    res.status(201).json({ success: true, data: newSpecies });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const species = await db.getSpeciesById(req.params.id);
    if (!species) {
      return res.status(404).json({ success: false, error: "Espèce introuvable" });
    }
    await db.deleteSpecies(req.params.id);
    res.json({ success: true, message: `"${species.name}" supprimé avec succès` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
