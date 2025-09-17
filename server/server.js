// import './config/instrument.js'
// import express from 'express'
// import cors from 'cors'
// import 'dotenv/config'
// import connectDB from './config/db.js'
// import * as Sentry from "@sentry/node";
// import { clerkWebhooks } from './controllers/webhooks.js'
// import companyRoutes from './routes/companyRoutes.js'
// import connectCloudinary from './config/cloudinary.js'
// import jobRoutes from './routes/jobRoutes.js'
// import userRoutes from './routes/userRoutes.js'
// import { clerkMiddleware } from '@clerk/express'


// const allowedOrigins = [
//   'https://job-portal-6exd.vercel.app', // your frontend domain
//   'http://localhost:3000'               // for local Next.js dev
// ]



// // Initialize Express
// const app = express()

// // Connect to database
// connectDB()
// await connectCloudinary()

// // Middlewares
// app.use(cors(allowedOrigins))
// app.use(express.json())
// app.use(clerkMiddleware())

// // Routes
// app.get('/', (req, res) => res.send("API Working"))
// app.get("/debug-sentry", function mainHandler(req, res) {
//   throw new Error("My first Sentry error!");
// });
// app.post('/webhooks', clerkWebhooks)
// app.use('/api/company', companyRoutes)
// app.use('/api/jobs', jobRoutes)
// app.use('/api/users', userRoutes)

// // Port
// const PORT = process.env.PORT || 5000

// Sentry.setupExpressErrorHandler(app);

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// })



// server.js
import './config/instrument.js';
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

// Allowed Origins
const allowedOrigins = [
  'https://job-portal-6exd.vercel.app', // frontend domain
  'http://localhost:3000'               // for local dev
];

// Initialize Express
const app = express();

// Middlewares
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(clerkMiddleware());

// Connect to MongoDB Atlas & Cloudinary BEFORE starting the server
await connectDB();
await connectCloudinary();

// Routes
app.get('/', (req, res) => res.send("API Working"));

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.post('/webhooks', clerkWebhooks);
app.use('/api/company', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);

// Error handling with Sentry
Sentry.setupExpressErrorHandler(app);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
