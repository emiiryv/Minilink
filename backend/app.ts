import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import routes from './routes';
import errorHandler from './middleware/errorHandler';
import redirectRoute from './routes/redirectRoute';
import rateLimiter from './middleware/rateLimiter';
import { redirectToOriginalUrl } from './controllers/linkController';

dotenv.config();

const app = express();

// Middleware
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
app.get('/:shortCode', redirectToOriginalUrl);

// Routes
app.use('/api', routes);

// Error handler
app.use(errorHandler);

export default app;