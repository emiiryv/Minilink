const express = require('express');
const router = express.Router();
const { redirectToOriginalUrl } = require('../controllers/linkController');

// Public redirect route for short links
router.get('/:shortCode', redirectToOriginalUrl);

module.exports = router;
