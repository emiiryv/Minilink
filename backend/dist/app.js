"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const redirectRoute_1 = __importDefault(require("./routes/redirectRoute"));
const rateLimiter_1 = __importDefault(require("./middleware/rateLimiter"));
const linkController_1 = require("./controllers/linkController");
dotenv_1.default.config();
if (!process.env.CORS_ORIGIN) {
    console.warn('⚠️ Warning: CORS_ORIGIN not set in .env. Defaulting to http://localhost:3000');
}
const app = (0, express_1.default)();
// Middleware: JSON parsing, security headers, CORS, rate limiting
app.use(express_1.default.json());
app.use((0, helmet_1.default)({
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
app.use((0, cors_1.default)(corsOptions));
app.use(rateLimiter_1.default);
// Serve static files from the frontend directory
app.use(express_1.default.static(path_1.default.join(__dirname, '../frontend')));
app.use('/links', redirectRoute_1.default);
// Allow short links like http://localhost:3001/XJq01l to redirect
app.get('/:shortCode', linkController_1.redirectToOriginalUrl);
// Routes
app.use('/api', routes_1.default);
// Error handler
app.use(errorHandler_1.default);
exports.default = app;
