import express from "express";
import { addRecording, getAllSongs, getRecordings, saveSong } from "../controller/SongController.js";
import { upload } from "../config/Multer.js";


const SongRoute = express.Router();

SongRoute.post('/save-song', upload.single("image"), saveSong)
SongRoute.post('/save-record/:songId/recordings', upload.single("audio"),  addRecording)
SongRoute.get('/get-songs', getAllSongs)
SongRoute.get('/get-recordings/:songId/recordings', getRecordings)

export default SongRoute;