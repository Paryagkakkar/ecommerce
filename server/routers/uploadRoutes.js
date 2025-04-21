import express from "express";
import upload from "../middleware/uploadMiddleware.js"; // ✅ Import the upload middleware

const router = express.Router();

// Image upload route
router.post("/", upload.single("image"), (req, res) => {
  if (req.file) {
    return res.json({ imagePath: `/uploads/${req.file.filename}` });
  }
  res.status(400).json({ error: "Image upload failed" });
});

export default router;
