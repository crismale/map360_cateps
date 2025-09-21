const panoElement = document.getElementById('pano');
const sceneInfo = document.getElementById('scene-info');
let sceneObjects = [];

async function fetchScenes() {
  const res = await fetch('http://localhost:5000/api/scenes');
  return await res.json();
}

function createHotspot(hotspot, scene, sceneObjects) {
  const el = document.createElement('img');
  el.src = `img/${hotspot.type}.png`;
  el.className = 'hotspot';
  el.style.position = 'absolute';
  el.style.left = `${hotspot.x}%`;
  el.style.top = `${hotspot.y}%`;
  el.title = hotspot.title;

  el.addEventListener('click', () => {
    if (hotspot.target_scene_id) {
      const targetSceneObj = sceneObjects.find(s => s.id === hotspot.target_scene_id);
      if (targetSceneObj) targetSceneObj.scene.switchTo();
    }
  });

  scene.hotspotLayer = scene.hotspotLayer || document.createElement('div');
  scene.hotspotLayer.className = 'hotspot-layer';
  scene.hotspotLayer.style.position = 'absolute';
  scene.hotspotLayer.style.top = '0';
  scene.hotspotLayer.style.left = '0';
  scene.hotspotLayer.style.width = '100%';
  scene.hotspotLayer.style.height = '100%';
  scene.hotspotLayer.style.pointerEvents = 'none';

  el.style.pointerEvents = 'auto';
  scene.hotspotLayer.appendChild(el);

  if (!scene.hotspotLayer.parentNode) {
    panoElement.appendChild(scene.hotspotLayer);
  }
}

async function init() {
  const scenesData = await fetchScenes();
  const viewer = new Marzipano.Viewer(panoElement);

  sceneObjects = scenesData.map(s => {
    const source = Marzipano.ImageUrlSource.fromString(s.image_url);
    const geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);
    const limiter = Marzipano.RectilinearView.limit.traditional(1024, 100*Math.PI/180);
    const view = new Marzipano.RectilinearView(null, limiter);
    const scene = viewer.createScene({ source, geometry, view });

    s.hotspots.forEach(hs => createHotspot(hs, scene, sceneObjects));
    return { id: s.id, scene, hotspots: s.hotspots };
  });

  viewer.addEventListener('sceneChange', activeScene => {
    sceneObjects.forEach(obj => {
      obj.scene.hotspotLayer.style.display = obj.scene === activeScene ? 'block' : 'none';
    });
  });

  if (sceneObjects.length > 0) {
    sceneObjects[0].scene.switchTo();
    sceneObjects[0].scene.hotspotLayer.style.display = 'block';
  }

  sceneInfo.innerHTML = scenesData.map(s => `
    <div class="scene-title">${s.name}</div>
    <div>${s.description}</div>
  `).join('');
}

init();
