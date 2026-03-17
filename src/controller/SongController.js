import { Song } from "../model/SongSchema.js";

export const saveSong = async (req, res) => {
    try {
        const { title, composer, imageUrl } = req.body;

        // Validation
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        // Check if song already exists
        const existingSong = await Song.findOne({ title });
        if (existingSong) {
            return res.status(400).json({ message: "Song already exists" });
        }

        // Create new song
        const newSong = new Song({
            title,
            composer,
            imageUrl,
            recordings: [] // initially empty
        });

        await newSong.save();

        res.status(201).json({
            message: "Song saved successfully 🎵",
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