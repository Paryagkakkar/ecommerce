import express from "express";
import {
    gethoodies,
    gethoodiesById,
    createhoodies,
    updatehoodies,
    deletehoodies,
} from "../controllers/hoodiesController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/get-all-hoodies", gethoodies);
router.get("/:id", gethoodiesById);
router.post("/add-hoodies", upload.single("image"), createhoodies);
router.put("/:id", upload.single("image"), updatehoodies);
router.delete("/:id", deletehoodies);

export default router;
