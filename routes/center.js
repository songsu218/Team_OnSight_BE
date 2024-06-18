const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

router.get('/center', searchController.getCenters);

module.exports = router;
