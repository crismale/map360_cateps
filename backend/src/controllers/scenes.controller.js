const Scenes = require('../models/scenes.model');

async function getScenes(req, res) {
  try {
    const scenes = await Scenes.getAllScenes();

    const scenesWithHotspots = await Promise.all(
      scenes.map(async scene => {
        const hotspots = await Scenes.getHotspotsByScene(scene.id);
        return { ...scene, hotspots };
      })
    );

    res.json(scenesWithHotspots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { getScenes };
