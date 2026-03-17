import express from "express";
import { addRecording, saveSong } from "../controller/SongController.js";
import { upload } from "../config/Multer.js";


const SongRoute = express.Router();

SongRoute.post('/save-song', upload.single("image"), saveSong)
SongRoute.post('/save-record', addRecording)

export default SongRoute;