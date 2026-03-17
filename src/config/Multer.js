import multer from "multer";

const storage = multer.memoryStorage(); // store in memory (we send to cloudinary)

export const upload = multer({ storage });