const viewerElement = document.getElementById('viewer');
const sceneInfo = document.getElementById('scene-info');
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
const arrowLeft = document.getElementById('arrow-left');
const arrowRight = document.getElementById('arrow-right');

// Inicializar Marzipano
const viewer = new Marzipano.Viewer(viewerElement);

let allScenes = [];
let currentScene = null;
let currentView = null;
let currentIndex = 0;

// Fetch escenas desde backend
async function loadScenes() {
  try {
    const response = await fetch('http://localhost:5000/api/scenes');
    allScenes = await response.json();

    if (!allScenes.length) {
      sceneInfo.innerHTML = '<p>No hay escenas disponibles.</p>';
      return;
    }

    loadScene(allScenes[currentIndex]);
  } catch (err) {
    console.error('Error cargando escenas:', err);
    sceneInfo.innerHTML = '<p>Error cargando escenas</p>';
  }
}

// Render panel lateral
function renderSidebar(scene) {
  sceneInfo.innerHTML = `
    <h3>${scene.scene_description}</h3>
    <p><strong>ID:</strong> ${scene.id_scene}</p>
    <p><strong>Tipo:</strong> ${scene.name_kind}</p>
    <p><strong>Piso:</strong> ${scene.name_floor}</p>
    <p><strong>Torre:</strong> ${scene.name_tower}</p>
    <p><strong>Orientación:</strong> ${scene.name_orientation}</p>
    <h4>Hotspots:</h4>
    <ul>${scene.hotspots.map(h => `<li>${h.description}</li>`).join('')}</ul>
  `;
}

// Cargar y renderizar escena con hotspots
function loadScene(scene) {
  renderSidebar(scene);

  // Crear source y geometría
  const source = Marzipano.ImageUrlSource.fromString(scene.imagen_url);
  const geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);
  const limiter = Marzipano.RectilinearView.limit.traditional(1024, 120 * Math.PI / 180);
  currentView = new Marzipano.RectilinearView(null, limiter);

  if (currentScene) currentScene.destroy();

  currentScene = viewer.createScene({
    source: source,
    geometry: geometry,
    view: currentView,
    pinFirstLevel: true
  });

  currentScene.switchTo();

  // Hotspots dinámicos
  scene.hotspots.forEach(h => {
    const el = document.createElement('img');
    el.src = h.icon_url; // icono desde Cloudinary
    el.className = 'hotspot-icon';
    el.title = h.description;

    el.addEventListener('click', () => {
      if (h.link_scene_id) {
        const nextScene = allScenes.find(s => s.id_scene === h.link_scene_id);
        if (nextScene) {
          currentIndex = allScenes.indexOf(nextScene);
          loadScene(nextScene);
        }
      }
    });

    currentScene.hotspotContainer().createHotspot(el, { yaw: h.yaw, pitch: h.pitch });
  });
}

// Controles de zoom
zoomInBtn.addEventListener('click', () => {
  if (!currentView) return;
  currentView.setFov(Math.max(currentView.fov() - 0.1, 0.1));
});

zoomOutBtn.addEventListener('click', () => {
  if (!currentView) return;
  currentView.setFov(Math.min(currentView.fov() + 0.1, 3.0));
});

// Navegación HUD
arrowLeft.addEventListener('click', () => {
  if (!allScenes.length) return;
  currentIndex = (currentIndex - 1 + allScenes.length) % allScenes.length;
  loadScene(allScenes[currentIndex]);
});

arrowRight.addEventListener('click', () => {
  if (!allScenes.length) return;
  currentIndex = (currentIndex + 1) % allScenes.length;
  loadScene(allScenes[currentIndex]);
});

// Inicializar
loadScenes();