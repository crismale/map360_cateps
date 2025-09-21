const db = require('../services/db');

async function getAllScenes() {
  const res = await db.query('SELECT * FROM scenes');
  return res.rows;
}

async function getHotspotsByScene(sceneId) {
  const res = await db.query('SELECT * FROM hotspots WHERE scene_id = $1', [sceneId]);
  return res.rows;
}

module.exports = { getAllScenes, getHotspotsByScene };
