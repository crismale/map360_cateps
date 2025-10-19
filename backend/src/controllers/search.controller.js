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
        return res.json({
          exact: exactMatch,
          similar: []
        });
      }

      // 🔍 2️⃣ Si no hay exacta, buscar similares con pg_trgm
      const similarMatches = await Search.findSimilarScenes(normalizedQuery);

      if (!similarMatches || similarMatches.length === 0) {
        return res.json({
          exact: null,
          similar: [],
          message: `❌ No se encontraron coincidencias para "${normalizedQuery}".`
        });
      }

      // 🔹 Hay coincidencias similares
      return res.json({
        exact: null,
        similar: similarMatches,
        message: `⚙️ Se encontraron ${similarMatches.length} coincidencias similares.`
      });

    } catch (error) {
      console.error("Error en búsqueda avanzada:", error);
      res.status(500).json({
        message: "Error interno del servidor al realizar la búsqueda."
      });
    }
  }
};

module.exports = SearchController;
