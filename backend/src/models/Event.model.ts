import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    checkIn: {
      photo: String,
      latitude: Number,
      longitude: Number,
      time: Date
    },

    // OTP to START event
    customerOTP: String,
    isOTPVerified: {
      type: Boolean,
      default: false
    },

    // Setup details
    setup: {
      preSetupPhoto: String,
      preSetupNote: String,
      postSetupPhoto: String,
      postSetupNote: String
    },

    // OTP to CLOSE event
    finalOTP: String,
    isFinalOTPVerified: {
      type: Boolean,
      default: false
    },

    status: {
      type: String,
      enum: [
        "CREATED",
        "CHECKED_IN",
        "STARTED",
        "SETUP_DONE",
        "COMPLETED"
      ],
      default: "CREATED"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
