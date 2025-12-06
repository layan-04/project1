const express = require('express');
const router = express.Router();
const { scanUrl } = require('../controllers/scannerController');

// POST /api/tools/url-scanner
router.post('/', scanUrl);

module.exports = router;
