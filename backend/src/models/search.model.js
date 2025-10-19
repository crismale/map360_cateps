// src/models/search.model.js
const pool = require("../services/db");

const Search = {
  async findExactMatch(query) {
    const sql = `
      SELECT id_scene, description AS scene_description
      FROM public.scenes
      WHERE LOWER(description) = LOWER($1)
      LIMIT 1;
    `;
    const { rows } = await pool.query(sql, [query]);
    return rows[0] || null;
  },

  async findSimilarScenes(query) {
    const sql = `
        SELECT s.id_scene,
            s.description AS scene_description,
            similarity(LOWER(k.keyword), LOWER($1)) AS score
        FROM public.scene_keywords k
        JOIN public.scenes s ON s.id_scene = k.scene_id
        WHERE similarity(LOWER(k.keyword), LOWER($1)) > 0.2
        ORDER BY score DESC
        LIMIT 10;
    `;
    const { rows } = await pool.query(sql, [query]);
    return rows;
  }
};

module.exports = Search;