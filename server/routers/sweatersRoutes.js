import express from "express";
import multer from "multer";
import {
  getSweaters,
  getSweaterById,
  createSweater,
  updateSweater,
  deleteSweater,
} from "../controllers/sweatersController.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/Uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Define routes
router.get("/", getSweaters);
router.get("/:id", getSweaterById);
router.post("/", upload.single("image"), createSweater);
router.put("/:id", upload.single("image"), updateSweater);
router.delete("/:id", deleteSweater);

export default router;