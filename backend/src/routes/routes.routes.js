// src/routes/routes.routes.js
const express = require("express");
const router = express.Router();
const RoutesController = require("../controllers/routes.controller");

// POST /api/routes/rebuild-edges
router.post("/rebuild-edges", RoutesController.rebuild);
router.get("/routes", RoutesController.list);

module.exports = router;
