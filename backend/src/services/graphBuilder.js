// src/services/graphBuilder.js
const Hotspots = require("../models/hotspots.models");
const Routes = require("../models/routes.models");

function calculateWeight(h, s1, s2) {
  let weight = 1;
  let reasons = [];

  if (s1.tower_id !== s2.tower_id) {
    weight += 5;
    reasons.push("cambio de torre");
  }
  if (s1.floor_id !== s2.floor_id) {
    weight += 3;
    reasons.push("cambio de piso");
  }
  if (s1.orientation_id !== s2.orientation_id) {
    weight += 1;
    reasons.push("cambio de orientación");
  }
  if (/ascensor/i.test(h.title)) {
    weight += 2;
    reasons.push("uso ascensor");
  }
  if (/escalera/i.test(h.title)) {
    weight += 3;
    reasons.push("uso escaleras");
  }
  if (weight === 1) {
    reasons.push("continuar caminando");
  }

  return { weight, reason: reasons.join(", ") };
}

async function rebuildRoutes() {
  // 1. Limpiar tabla
  await Routes.clear();

  // 2. Leer hotspots de navegación
  const hotspots = await Hotspots.getAllDirectional();

  // 3. Insertar en routes
  for (const h of hotspots) {
    const { weight, reason } = calculateWeight(h, {
      tower_id: h.from_tower,
      floor_id: h.from_floor,
      orientation_id: h.from_orientation
    }, {
      tower_id: h.to_tower,
      floor_id: h.to_floor,
      orientation_id: h.to_orientation
    });

    await Routes.insert(h.scene_id, h.link_scene_id, h.id_hotspots, weight, reason);
  }

  return { message: `Se reconstruyeron ${hotspots.length} rutas.` };
}

module.exports = { rebuildRoutes };
