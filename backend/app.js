const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Error handler
app.use(errorHandler);

module.exports = app;