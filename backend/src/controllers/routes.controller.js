// src/controllers/routes.controller.js
const { rebuildRoutes } = require("../services/graphBuilder");
const Routes = require("../models/routes.models");

const RoutesController = {
  rebuild: async (req, res) => {
    try {
      const result = await rebuildRoutes();
      res.json(result);
    } catch (error) {
      console.error("Error al reconstruir rutas:", error);
      res.status(500).json({ error: "Error al reconstruir rutas" });
    }
  },

  list: async (req, res) => {
    try {
      const routes = await Routes.getAll();
      res.json(routes);
    } catch (error) {
      console.error("Error al listar rutas:", error);
      res.status(500).json({ error: "Error al listar rutas" });
    }
  }
};

module.exports = RoutesController;
