// src/routes/search.routes.js
const express = require("express");
const router = express.Router();
const SearchController = require("../controllers/search.controller");

// GET /api/search?query=texto
router.get("/", SearchController.searchScenes);

module.exports = router;
