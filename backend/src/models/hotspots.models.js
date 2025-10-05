// src/models/hotspots.models.js
const pool = require("../services/db");

const Hotspots = {
  getAllDirectional: async () => {
    const query = `
      SELECT h.id_hotspots, h.scene_id, h.link_scene_id, h.title, h.icon_id,
             s1.tower_id AS from_tower, s1.floor_id AS from_floor, s1.orientation_id AS from_orientation,
             s2.tower_id AS to_tower, s2.floor_id AS to_floor, s2.orientation_id AS to_orientation
      FROM public.hotspots h
      JOIN public.scenes s1 ON s1.id_scene = h.scene_id
      JOIN public.scenes s2 ON s2.id_scene = h.link_scene_id
      WHERE h.icon_id = 2;
    `;
    const { rows } = await pool.query(query);
    return rows;
  }
};

module.exports = Hotspots;
