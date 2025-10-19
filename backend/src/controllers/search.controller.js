// src/controllers/search.controller.js
const Search = require("../models/search.model");

const SearchController = {
  async searchScenes(req, res) {
    try {
      const { query } = req.query; // ejemplo: /api/search?query=pasillo azul

      if (!query || query.trim() === "") {
        return res.status(400).json({ message: "⚠️ Debe proporcionar un texto de búsqueda." });
      }

      const normalizedQuery = query.trim().toLowerCase();

      // 🔍 1️⃣ Intentar coincidencia exacta
      const exactMatch = await Search.findExactMatch(normalizedQuery);

      if (exactMatch) {
        return res.json([{
          ...exactMatch,
          match_type: "exact"
        }]);
      }

      // 🔍 2️⃣ Si no hay exacta, buscar similares con pg_trgm
      const similarMatches = await Search.findSimilarScenes(normalizedQuery);

      if (similarMatches.length === 0) {
        return res.status(404).json({
          message: "❌ No se encontraron coincidencias similares.",
          query: normalizedQuery
        });
      }

      return res.json(similarMatches.map(r => ({
        ...r,
        match_type: "similar"
      })));

    } catch (error) {
      console.error("Error en búsqueda avanzada:", error);
      res.status(500).json({
        message: "Error interno del servidor al realizar la búsqueda."
      });
    }
  }
};

module.exports = SearchController;
