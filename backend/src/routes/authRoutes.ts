import {
  registerUser,
  loginUser,
  getUsers,
  updateUserProfile,
} from "../controllers/authControllers.js";
import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

console.log("✅ Auth routes loaded");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUsers);
router.put("/profile", protect, updateUserProfile);
export default router;