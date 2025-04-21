import express from "express";
import {
    getsweaters,
    getsweatersById,
    createsweaters,
    updatesweaters,
    deletesweaters,
} from "../controllers/sweatersController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/get-all-sweaters", getsweaters);
router.get("/:id", getsweatersById);
router.post("/add-sweaters", upload.single("image"), createsweaters);
router.put("/:id", upload.single("image"), updatesweaters);
router.delete("/:id", deletesweaters);

export default router;
