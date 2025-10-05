// src/models/routes.models.js
const pool = require("../services/db");

const Routes = {
  insert: async (fromSceneId, toSceneId, hotspotId, weight, reason) => {
    const query = `
      INSERT INTO public.routes (from_scene_id, to_scene_id, hotspot_id, weight, penalty_reason)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (from_scene_id, to_scene_id, hotspot_id) DO NOTHING
      RETURNING *;
    `;
    const values = [fromSceneId, toSceneId, hotspotId, weight, reason];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  clear: async () => {
    await pool.query("TRUNCATE public.routes RESTART IDENTITY CASCADE");
  },

  getAll: async () => {
    const query = `
      SELECT r.id_routes, r.from_scene_id, r.to_scene_id, r.hotspot_id, 
             r.weight, r.penalty_reason,
             s1.description AS from_scene_desc,
             s2.description AS to_scene_desc,
             h.title AS hotspot_title
      FROM public.routes r
      JOIN public.scenes s1 ON r.from_scene_id = s1.id_scene
      JOIN public.scenes s2 ON r.to_scene_id = s2.id_scene
      JOIN public.hotspots h ON r.hotspot_id = h.id_hotspots
      ORDER BY r.id_routes;
    `;
    const { rows } = await pool.query(query);
    return rows;
  }
};

module.exports = Routes;
