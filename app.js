import express from 'express';
import { connect } from 'mongoose';
import { config } from 'dotenv';
config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// MongoDB Connection
const connectDB = async () => {
  try {
    const db = await connect(process.env.DB_URL);
    console.log("DB Connected : " + db.connection.name);
  } catch (error) {
    console.error("MongoDB Connection Failed:");
    console.error(error);
  }
};

connectDB();

app.get('/', (req, res) => {
  res.send('BandVault Backend Running 🎸');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));