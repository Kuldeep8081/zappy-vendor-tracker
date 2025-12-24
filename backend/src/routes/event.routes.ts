import { Router } from "express";
import {
  vendorCheckIn,
  triggerCustomerOTP,
  verifyCustomerOTP,
  uploadSetup,
  triggerFinalOTP,
  closeEvent
} from "../controllers/event.controller";
import { protect } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

/**
 * 1️⃣ Vendor Check-In
 * - Photo upload
 * - Geo-location
 */
router.post(
  "/check-in",
  protect,
  upload.single("photo"), // ✅ REQUIRED for arrival photo
  vendorCheckIn
);

/**
 * 2️⃣ Start Event (Customer OTP)
 */
router.post("/trigger-otp", protect, triggerCustomerOTP);
router.post("/verify-otp", protect, verifyCustomerOTP);

/**
 * 3️⃣ Event Setup (Pre / Post)
 * - Photo upload
 * - Optional notes
 */
router.post(
  "/upload-setup",
  protect,
  upload.single("photo"), // ✅ REQUIRED for setup photos
  uploadSetup
);

/**
 * 4️⃣ Close Event (Final OTP)
 */
router.post("/trigger-final-otp", protect, triggerFinalOTP);
router.post("/close-event", protect, closeEvent);

export default router;
