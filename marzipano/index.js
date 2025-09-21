const viewerElement = document.getElementById('viewer');
const sceneInfo = document.getElementById('scene-info');
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
const arrowLeft = document.getElementById('arrow-left');
const arrowRight = document.getElementById('arrow-right');

const viewer = new Marzipano.Viewer(viewerElement);

let currentScene, allScenes, currentView;
let currentIndex = 0;

// Cargar todas las escenas desde backend
async function loadScenes() {
  try {
    const response = await fetch('http://localhost:5000/api/scenes');
    allScenes = await response.json();

    if (!allScenes.length) {
      sceneInfo.innerHTML = '<p>No hay escenas disponibles.</p>';
      return;
    }

    loadScene(allScenes[currentIndex]);
  } catch (error) {
    console.error('Error cargando escenas:', error);
    sceneInfo.innerHTML = '<p>Error cargando escenas</p>';
  }
}

// Renderizar panel lateral
function renderSidebar(sceneData) {
  sceneInfo.innerHTML = `
    <h3>${sceneData.description}</h3>
    <p><strong>ID:</strong> ${sceneData.id_scene}</p>
    <p><strong>Tipo:</strong> ${sceneData.kind_id}</p>
    <p><strong>Piso:</strong> ${sceneData.floor_id}</p>
    <p><strong>Torre:</strong> ${sceneData.tower_id}</p>
    <p><strong>Orientación:</strong> ${sceneData.orientation_id}</p>
    <h4>Hotspots:</h4>
    <ul>${sceneData.hotspots.map(h => `<li>${h.description}</li>`).join('')}</ul>
  `;
}

// Cargar escena con hotspots
function loadScene(sceneData) {
  renderSidebar(sceneData);

  const source = Marzipano.ImageUrlSource.fromString(sceneData.imagen_url);
  const geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);
  const limiter = Marzipano.RectilinearView.limit.traditional(1024, 120 * Math.PI/180);
  currentView = new Marzipano.RectilinearView(null, limiter);

  if (currentScene) currentScene.destroy();

  currentScene = viewer.createScene({
    source: source,
    geometry: geometry,
    view: currentView,
    pinFirstLevel: true
  });

  currentScene.switchTo();

  // Hotspots
  sceneData.hotspots.forEach(hs => {
    const el = document.createElement('img');
    el.src = `img/${hs.icon_url}`;
    el.className = 'hotspot-icon';
    el.title = hs.description;

    el.addEventListener('click', () => {
      if (hs.link_scene_id) {
        const nextScene = allScenes.find(s => s.id_scene === hs.link_scene_id);
        if (nextScene) {
          currentIndex = allScenes.indexOf(nextScene);
          loadScene(nextScene);
        }
      }
    });

    currentScene.hotspotContainer().createHotspot(el, { yaw: hs.yaw, pitch: hs.pitch });
  });
}

// Controles de zoom
zoomInBtn.addEventListener('click', () => {
  const fov = currentView.fov();
  currentView.setFov(Math.max(fov - 0.1, 0.1));
});

zoomOutBtn.addEventListener('click', () => {
  const fov = currentView.fov();
  currentView.setFov(Math.min(fov + 0.1, 3.0));
});

// Navegación HUD
arrowLeft.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + allScenes.length) % allScenes.length;
  loadScene(allScenes[currentIndex]);
});

arrowRight.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % allScenes.length;
  loadScene(allScenes[currentIndex]);
});

// Inicializar
loadScenes();