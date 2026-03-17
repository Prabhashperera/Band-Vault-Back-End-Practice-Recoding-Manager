import cloudinary from "../config/Cloudinary.js";
import { Song } from "../model/SongSchema.js";


export const saveSong = async (req, res) => {
    try {
        const { title, composer } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        let imageUrl = "";

        // If image exists → upload to cloudinary
        if (req.file) {
            const result = await cloudinary.uploader.upload_stream(
                { folder: "bandvault_songs" },
                (error, result) => {
                    if (error) throw error;
                    return result;
                }
            );

            // Convert buffer to stream
            const stream = result;
            stream.end(req.file.buffer);

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



export const addRecording = async (req, res) => {
    try {
        const { songId } = req.params;

        const {
            title,
            singer,
            key,
            cloudUrl,
            notes,
            isFinalVersion
        } = req.body;

        const song = await Song.findById(songId);

        if (!song) {
            return res.status(404).json({ message: "Song not found" });
        }

        const newRecording = {
            title,
            singer,
            key,
            cloudUrl,
            notes,
            isFinalVersion
        };

        song.recordings.push(newRecording);

        await song.save();

        res.status(200).json({
            message: "Recording added 🎧",
            song
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};