const express = require('express');
const router = express.Router();

const linkRoutes = require('./linkRoutes');
const authRoutes = require('./authRoutes');

router.use('/links', linkRoutes);
router.use('/auth', authRoutes);

module.exports = router;