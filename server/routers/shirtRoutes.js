import express from "express";
import {
  getshirts,
  getshirtsById,
  createshirts,
  updateshirts,
  deleteshirts,
} from "../controllers/shirtController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Specific routes first
router.get("/get-all-shirts", getshirts);
router.post("/add-shirts", upload.single("image"), createshirts);

// ID-based routes last
router.get("/:id", getshirtsById);
router.put("/:id", upload.single("image"), updateshirts);
router.delete("/:id", deleteshirts);

export default router;