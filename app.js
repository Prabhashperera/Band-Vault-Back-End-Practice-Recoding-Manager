import express from 'express';
import { connect } from 'mongoose';
import { config } from 'dotenv';
import SongRoute from './src/routes/SongRoute.js';
config();
import cors from "cors";



const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// MongoDB Connection
const connectDB = async () => {
  try {
    const db = await connect(process.env.DB_URL);
    console.log("DB Connected : " + db.connection.name);


    app.use('/api/songs', SongRoute);


  } catch (error) {
    console.error("MongoDB Connection Failed:");
    console.error(error);
  }
};

connectDB();

  server.get("/", (_req, res) => {
    res.send("API is Running....");
  });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));