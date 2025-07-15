

const express = require('express');
const router = express.Router();

const linkRoutes = require('./linkRoutes');

router.use('/links', linkRoutes);

module.exports = router;