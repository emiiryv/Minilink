const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const redirectRoute = require('./routes/redirectRoute');

dotenv.config();
const rateLimiter = require('./middleware/rateLimiter');

const app = express();

// Middleware
// app.use(cors());
app.use(express.json());
app.use(helmet());

const corsOptions = {
  origin: ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
};
app.use(cors(corsOptions));

app.use(rateLimiter);

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));


app.use('/links', redirectRoute);

// Allow short links like http://localhost:3001/XJq01l to redirect
app.get('/:shortCode', require('./controllers/linkController').redirectToOriginalUrl);

// Routes
app.use('/api', routes);

// Error handler
app.use(errorHandler);

module.exports = app;