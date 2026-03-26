import express from "express";
import { addRecording, deleteSong, editRecording, editSong, getAllSongs, getRecordings, saveSong } from "../controller/SongController.js";
import { upload } from "../config/Multer.js";


const SongRoute = express.Router();

SongRoute.post('/save-song', upload.single("image"), saveSong)
SongRoute.post('/save-record/:songId/recordings', upload.single("audio"),  addRecording)
SongRoute.get('/get-songs', getAllSongs)
SongRoute.get('/get-recordings/:songId/recordings', getRecordings)
SongRoute.delete('/delete-song/:id', deleteSong);
SongRoute.put('/edit-song/:id', upload.single("image"), editSong);
SongRoute.put('/edit-record/:songId/recordings/:recordingId', upload.single("audio"), editRecording);

export default SongRoute;