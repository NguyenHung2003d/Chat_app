import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
  forgotPassword,
  resetPassword,
  verifyResetToken,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/verify-reset-token/:token", verifyResetToken);

export default router;
