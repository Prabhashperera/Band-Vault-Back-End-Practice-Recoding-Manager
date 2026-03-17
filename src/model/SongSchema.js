import mongoose from "mongoose";

const recordingSchema = new mongoose.Schema({
  title: { type: String, required: true },           // e.g. Main Arrangement
  singer: { type: String },
  key: { type: String },
  cloudUrl: { type: String, required: true },
  date: { type: Date, default: Date.now },
  notes: { type: String },
  isFinalVersion: { type: Boolean, default: false }
});

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },           // Song name
  composer: { type: String },
  imageUrl: {type: String},
  recordings: [recordingSchema],
  createdAt: { type: Date, default: Date.now }
});

export const Song = mongoose.model("Song", songSchema);