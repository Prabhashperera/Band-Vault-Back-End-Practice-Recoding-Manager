import express from "express";
import { addRecording, saveSong } from "../controller/SongController.js";


const SongRoute = express.Router();

SongRoute.post('/save-song', saveSong)
SongRoute.post('/save-record', addRecording)

export default SongRoute;