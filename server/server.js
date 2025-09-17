import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from './controllers/webhooks.js';
import companyRoutes from './routes/companyRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import jobRoutes from './routes/jobRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { clerkMiddleware } from '@clerk/express';

const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ Connect to Cloudinary
await connectCloudinary();

// ✅ CORS Middleware — allow all origins for now
app.use(cors({
  origin: '*',
  credentials: true,
}));

// ✅ Parse JSON
app.use(express.json());

// ✅ Clerk middleware
app.use(clerkMiddleware());

// ✅ Routes
app.get('/', (req, res) => res.send("API Working"));

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.post('/webhooks', clerkWebhooks);
app.use('/api/company', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);

// ✅ Sentry error handler
Sentry.setupExpressErrorHandler(app);

// ✅ Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
