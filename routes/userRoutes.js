import express from "express";
import { registerUser, loginUser, getUsers } from "../controllers/userControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/all", authMiddleware, roleMiddleware(["supplier", "supermarket"]), getUsers);

export default router;
