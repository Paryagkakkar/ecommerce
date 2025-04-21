import express from "express";
import {
    getblazers,
    getblazersById,
    createblazers,
    updateblazers,
    deleteblazers,
} from "../controllers/blazersController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/get-all-blazers", getblazers);
router.get("/:id", getblazersById);
router.post("/add-blazers", upload.single("image"), createblazers);
router.put("/:id", upload.single("image"), updateblazers);
router.delete("/:id", deleteblazers);

export default router;
