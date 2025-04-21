import express from "express";
import {
    getjackets,
    getjacketsById,
    createjackets,
    updatejackets,
    deletejackets,
} from "../controllers/jacketsController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/get-all-jackets", getjackets);
router.get("/:id", getjacketsById);
router.post("/add-jackets", upload.single("image"), createjackets);
router.put("/:id", upload.single("image"), updatejackets);
router.delete("/:id", deletejackets);

export default router;
