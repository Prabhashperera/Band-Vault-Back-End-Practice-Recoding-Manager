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

// Edit Song Details
export const editSong = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, composer } = req.body;

        const song = await Song.findById(id);

        if (!song) {
            return res.status(404).json({ message: "Song not found" });
        }

        // Update basic fields if they are provided
        if (title) song.title = title;
        if (composer) song.composer = composer;

        // If a new image is uploaded, send it to Cloudinary and update the URL
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, {
                folder: "bandvault_songs"
            });
            song.imageUrl = result.secure_url;
        }

        await song.save();

        res.status(200).json({
            message: "Song updated successfully",
            song
        });

    } catch (error) {
        console.error("Edit Song Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Edit Recording Details
export const editRecording = async (req, res) => {
    try {
        // We need both the song's ID and the specific recording's ID
        const { songId, recordingId } = req.params;
        const { title, singer, key, notes, isFinalVersion } = req.body;

        const song = await Song.findById(songId);

        if (!song) {
            return res.status(404).json({ message: "Song not found" });
        }

        // Find the specific recording inside the song's recordings array
        const recording = song.recordings.id(recordingId);

        if (!recording) {
            return res.status(404).json({ message: "Recording not found" });
        }

        // Update text fields if they are provided
        if (title) recording.title = title;
        if (singer !== undefined) recording.singer = singer;
        if (key !== undefined) recording.key = key;
        if (notes !== undefined) recording.notes = notes;

        // Handle the Final Version flag logic
        if (isFinalVersion !== undefined) {
            const finalFlag = isFinalVersion === true || isFinalVersion === "true";
            if (finalFlag) {
                // Set all other recordings to false
                song.recordings.forEach(r => r.isFinalVersion = false);
            }
            recording.isFinalVersion = finalFlag;
        }

        // If a new audio file is uploaded, replace the old Cloudinary URL
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, {
                resource_type: "video" // Cloudinary uses 'video' for audio files
            });
            recording.cloudUrl = result.secure_url;
        }

        await song.save();

        res.status(200).json({
            message: "Recording updated successfully",
            song
        });

    } catch (error) {
        console.error("Edit Recording Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};