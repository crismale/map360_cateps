const Scenes = require('../models/scenes.model');

async function getScenes(req, res) {
  try {
    const scenes = await Scenes.getAllScenesWithHotspots();
    res.json(scenes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving scenes' });
  }
}

module.exports = { getScenes };
