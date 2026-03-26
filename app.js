import express from 'express';
import { connect } from 'mongoose';
import { config } from 'dotenv';
import SongRoute from './src/routes/SongRoute.js';
import cors from "cors";

config();
const app = express();

// 1. Middleware
app.use(cors());
app.use(express.json());

// 3. Database Connection
const connectDB = async () => {
  try {
    await connect(process.env.DB_URL);
    console.log("DB Connected");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
  }
};
connectDB();

// 2. Routes (MUST be outside of the connectDB function)
app.use('/api/songs', SongRoute);

app.get("/", (_req, res) => {
  res.send("API is Running....");
});


// 4. Export for Vercel
export default app;

// 5. Local Listen
if (process.env.NODE_ENV !== 'production') {
  app.listen(3000, () => console.log(`Server running on port 3000`));
}