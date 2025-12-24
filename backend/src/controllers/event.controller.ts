import Event from "../models/Event.model";
import mongoose from "mongoose";

/**
 * 1️⃣ Vendor Check-In
 * - Upload arrival photo
 * - Store latitude, longitude, timestamp
 */
export const vendorCheckIn = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Arrival photo is required" });
    }

    const event = await Event.create({
      vendor: req.user.userId,
      checkIn: {
        photo: req.file.path, // ✅ REAL uploaded photo
        latitude,
        longitude,
        time: new Date()
      },
      status: "CHECKED_IN"
    });

    res.status(201).json({
      message: "Vendor checked in successfully",
      event
    });
  } catch (error) {
    res.status(500).json({ message: "Check-in failed" });
  }
};

/**
 * 2️⃣ Trigger Customer OTP (Mocked)
 */
export const triggerCustomerOTP = async (req, res) => {
  try {
    const { eventId } = req.body;
    const vendorId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid eventId" });
    }

    const event = await Event.findOne({
      _id: eventId,
      vendor: vendorId
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.status !== "CHECKED_IN") {
      return res.status(400).json({
        message: "Event not ready for OTP"
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    event.customerOTP = otp;
    await event.save();

    res.json({
      message: "OTP triggered (mocked)",
      otp
    });
  } catch (error) {
    res.status(500).json({ message: "OTP trigger failed" });
  }
};

/**
 * 3️⃣ Verify Customer OTP (Start Event)
 */
export const verifyCustomerOTP = async (req, res) => {
  try {
    const { eventId, otp } = req.body;
    const vendorId = req.user.userId;

    const event = await Event.findOne({
      _id: eventId,
      vendor: vendorId
    });

    if (!event || event.customerOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    event.isOTPVerified = true;
    event.status = "STARTED";
    await event.save();

    res.json({
      message: "Event started successfully",
      event
    });
  } catch (error) {
    res.status(500).json({ message: "OTP verification failed" });
  }
};

/**
 * 4️⃣ Upload Pre/Post Setup
 * - Upload photos
 * - Optional notes
 */
export const uploadSetup = async (req, res) => {
  try {
    const { eventId, type, note } = req.body;
    const vendorId = req.user.userId;

    if (!req.file) {
      return res.status(400).json({ message: "Setup photo is required" });
    }

    const event = await Event.findOne({
      _id: eventId,
      vendor: vendorId
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.status !== "STARTED") {
      return res.status(400).json({
        message: "Event not started yet"
      });
    }

    if (type === "PRE") {
      event.setup.preSetupPhoto = req.file.path;
      event.setup.preSetupNote = note;
    }

    if (type === "POST") {
      event.setup.postSetupPhoto = req.file.path;
      event.setup.postSetupNote = note;
      event.status = "SETUP_DONE";
    }

    await event.save();

    res.json({
      message: `${type} setup uploaded successfully`,
      event
    });
  } catch (error) {
    res.status(500).json({ message: "Setup upload failed" });
  }
};

/**
 * 5️⃣ Trigger Final OTP (Mocked)
 */
export const triggerFinalOTP = async (req, res) => {
  try {
    const { eventId } = req.body;
    const vendorId = req.user.userId;

    const event = await Event.findOne({
      _id: eventId,
      vendor: vendorId
    });

    if (!event || event.status !== "SETUP_DONE") {
      return res.status(400).json({
        message: "Event not ready for closure"
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    event.finalOTP = otp;
    await event.save();

    res.json({
      message: "Final OTP triggered (mocked)",
      otp
    });
  } catch (error) {
    res.status(500).json({ message: "Final OTP failed" });
  }
};

/**
 * 6️⃣ Close Event
 */
export const closeEvent = async (req, res) => {
  try {
    const { eventId, otp } = req.body;
    const vendorId = req.user.userId;

    const event = await Event.findOne({
      _id: eventId,
      vendor: vendorId
    });

    if (!event || event.finalOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    event.isFinalOTPVerified = true;
    event.status = "COMPLETED";
    await event.save();

    res.json({
      message: "Event completed successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Event close failed" });
  }
};
