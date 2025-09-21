const db = require('../services/db');

async function getAllScenesWithHotspots() {
  const query = `
   SELECT 
  s.id_scene,
  s.imagen_url,
  s.description AS scene_description,

  -- 🔹 Kind
  s.kind_id,
  k.name_kind,

  -- 🔹 Floor
  s.floor_id,
  f.name_floor,

  -- 🔹 Tower
  s.tower_id,
  t.name_tower,

  -- 🔹 Orientation
  s.orientation_id,
  o.name_orientation,

  -- 🔹 Hotspots agregados
  json_agg(
    json_build_object(
      'id_hotspots', h.id_hotspots,
      'kind', h.kind,
      'yaw', h.yaw,
      'pitch', h.pitch,
      'description', h.description,
      'link_scene_id', h.link_scene_id,
      'icon_id', h.icon_id,
      'icon_url', i.icon_url,
      'name_icon', i.name_icon
    )
  ) FILTER (WHERE h.id_hotspots IS NOT NULL) AS hotspots

FROM scenes s
LEFT JOIN hotspots h ON s.id_scene = h.scene_id
LEFT JOIN kind k ON s.kind_id = k.id_kind
LEFT JOIN floor f ON s.floor_id = f.id_floor
LEFT JOIN tower t ON s.tower_id = t.id_tower
LEFT JOIN orientation o ON s.orientation_id = o.id_orientation
LEFT JOIN icons i ON h.icon_id = i.id_icon
GROUP BY 
  s.id_scene, s.imagen_url, s.description,
  s.kind_id, k.name_kind,
  s.floor_id, f.name_floor,
  s.tower_id, t.name_tower,
  s.orientation_id, o.name_orientation;
  `;

  const res = await db.query(query);
  return res.rows;
}

module.exports = { getAllScenesWithHotspots };
