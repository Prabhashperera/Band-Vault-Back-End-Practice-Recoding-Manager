import cloudinary from "../config/Cloudinary.js";
import { Song } from "../model/SongSchema.js";
import streamifier from "streamifier";

const uploadToCloudinary = (fileBuffer, options) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            options,
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        streamifier.createReadStream(fileBuffer).pipe(stream);
    });
};


export const saveSong = async (req, res) => {
    try {
        const { title, composer } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        let imageUrl = "";

        // If image exists → upload to cloudinary
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, {
                folder: "bandvault_songs"
            });

            imageUrl = result.secure_url;
        }

        const newSong = new Song({
            title,
            composer,
            imageUrl
        });

        await newSong.save();

        res.status(201).json({
            message: "Song created with image",
            song: newSong
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const deleteSong = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedSong = await Song.findByIdAndDelete(id);

        if (!deletedSong) {
            return res.status(404).json({ message: "Song not found" });
        }

        res.status(200).json({ message: "Song deleted successfully" });
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};



export const addRecording = async (req, res) => {
    try {
        const { songId } = req.params;
        const { title, singer, key, notes, isFinalVersion } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Recording title required" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Audio file is required" });
        }

        const song = await Song.findById(songId);
        if (!song) {
            return res.status(404).json({ message: "Song not found" });
        }

        const result = await uploadToCloudinary(req.file.buffer, {
            resource_type: "video"
        });

        const audioUrl = result.secure_url;

        const finalFlag = isFinalVersion === true || isFinalVersion === "true";

        if (finalFlag) {
            song.recordings.forEach(r => r.isFinalVersion = false);
        }

        const newRecording = {
            title,
            singer,
            key,
            cloudUrl: audioUrl,
            notes,
            isFinalVersion: finalFlag
        };

        song.recordings.push(newRecording);

        await song.save();

        res.status(200).json({
            message: "Recording added with audio 🎧",
            song
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};


// Get All Songs
export const getAllSongs = async (req, res) => {
    try {
        const songs = await Song.find()
            .select("title imageUrl createdAt") // only needed fields
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: songs.length,
            songs
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};



export const getRecordings = async (req, res) => {
    try {
        const { songId } = req.params;

        // ADDED 'imageUrl' to the select statement!
        const song = await Song.findById(songId).select("title imageUrl recordings");

        if (!song) {
            return res.status(404).json({ message: "Song not found" });
        }

        res.status(200).json({
            songId: song._id,
            title: song.title,
            imageUrl: song.imageUrl, // Send it to the frontend
            recordings: song.recordings
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};