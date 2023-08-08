import 'dotenv/config'
import connectToMongo from './db.mjs';
import express from 'express';
import cors from 'cors';
// Import individual functions from 'express'
import { json } from 'express';

// Connect to MongoDB
connectToMongo();

// Create Express app
const app = express();
const port = process.env.PORT || 8000;
const host = process.env.BASE_URL;
// Enable CORS
app.use(cors());

// Parse incoming requests with JSON payloads
app.use(json());

// Available Routes
import authRoutes from './routes/auth.mjs';
import notesRoutes from './routes/notes.mjs';
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at ${host}${port}`);
});
