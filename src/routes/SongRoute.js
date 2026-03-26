import express from "express";
import { 
    addRecording, deleteRecording, deleteSong, 
    editRecording, editSong, getAllSongs, 
    getRecordings, saveSong 
} from "../controller/SongController.js";
import { upload } from "../config/Multer.js";
import connectDB from "../db/ConnectDB.js"; //

const SongRoute = express.Router();

// --- Global Database Middleware for this Route ---
const ensureDbConnected = async (req, res, next) => {
    try {
        // This uses your cached connection logic
        await connectDB(process.env.DB_URL); 
        next(); // Proceed to the controller
    } catch (error) {
        console.error("Database Middleware Error:", error);
        res.status(500).json({ message: "Initial database connection failed" });
    }
};

// Apply it to ALL routes defined in this router
SongRoute.use(ensureDbConnected);

// --- Your Routes ---
SongRoute.post('/save-song', upload.single("image"), saveSong);
SongRoute.post('/save-record/:songId/recordings', upload.single("audio"), addRecording);
SongRoute.get('/get-songs', getAllSongs);
SongRoute.get('/get-recordings/:songId/recordings', getRecordings);
SongRoute.delete('/delete-song/:id', deleteSong);
SongRoute.put('/edit-song/:id', upload.single("image"), editSong);
SongRoute.put('/edit-record/:songId/recordings/:recordingId', upload.single("audio"), editRecording);
SongRoute.delete('/delete-record/:songId/recordings/:recordingId', deleteRecording);

export default SongRoute;