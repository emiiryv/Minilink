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
if (!process.env.CORS_ORIGIN) {
  console.warn('⚠️ Warning: CORS_ORIGIN not set in .env. Defaulting to http://localhost:3000');
}

const app = express();

// Middleware: JSON parsing, security headers, CORS, rate limiting
app.use(express.json());
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  referrerPolicy: { policy: 'no-referrer' }
}));

const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
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