const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const linkRoutes = require('./routes/linkRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/links', linkRoutes);

module.exports = app;