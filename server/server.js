import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express';
import connectDB from './config/db.js';

// import your routes
import companyRoutes from './routes/companyRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';

dotenv.config();
const app = express();

// ✅ CORS must be at the very top
// Allow all origins temporarily for testing
app.use(cors({
  origin: '*', // later change to your frontend domain
}));

// parse JSON body
app.use(express.json());

// Clerk middleware
app.use(clerkMiddleware());

// DB Connection
connectDB();

// ✅ Routes
app.use('/api/company', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});

// ✅ Error handler fallback
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Start the server locally only
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
