const express = require('express');
const router = express.Router();
const { getScenes } = require('../controllers/scenes.controller');

router.get('/', getScenes);

module.exports = router;
