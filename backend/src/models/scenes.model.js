const db = require('../services/db');

async function getAllScenesWithHotspots() {
  const query = `
    SELECT 
      s.id_scene,
      s.imagen_url,
      s.kind_id,
      s.floor_id,
      s.tower_id,
      s.orientation_id,
      s.description AS scene_description,
      json_agg(
        json_build_object(
          'id_hotspots', h.id_hotspots,
          'kind', h.kind,
          'yaw', h.yaw,
          'pitch', h.pitch,
          'description', h.description,
          'link_scene_id', h.link_scene_id,
          'icon_url', h.icon_url
        )
      ) FILTER (WHERE h.id_hotspots IS NOT NULL) AS hotspots
    FROM scenes s
    LEFT JOIN hotspots h ON s.id_scene = h.scene_id
    GROUP BY s.id_scene;
  `;

  const res = await db.query(query);
  return res.rows;
}

module.exports = { getAllScenesWithHotspots };
