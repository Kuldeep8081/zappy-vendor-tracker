import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearEvent } from "../features/event/eventSlice";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const EventClose = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpTriggered, setOtpTriggered] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Get event from Redux
  const event = useSelector((state: any) => state.event.currentEvent);
  const eventId = event?._id;

  const token = localStorage.getItem("token");

  /**
   * 1️⃣ Trigger Final OTP (Mocked)
   */
  const triggerFinalOTP = async () => {
    if (loading) return;

    if (!eventId) {
      setError("No active event found. Please restart the flow.");
      return;
    }

    if (!token) {
      setError("Session expired. Please login again.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        "http://localhost:5000/api/events/trigger-final-otp",
        { eventId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // 🔔 Mock OTP shown for demo/testing
      alert(`Final OTP (for demo): ${res.data.otp}`);
      setOtpTriggered(true);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to trigger final OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * 2️⃣ Verify OTP & Close Event
   */
  const closeEvent = async () => {
    if (loading) return;

    if (!otp || otp.length !== 4) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }

    if (!eventId || !token) {
      setError("Invalid session. Please login again.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.post(
        "http://localhost:5000/api/events/close-event",
        {
          eventId,
          otp
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Event completed successfully 🎉");

      // 🧹 Clear event from Redux
      dispatch(clearEvent());

      // Reset local state
      setOtp("");
      setOtpTriggered(false);

      // Ready for next event
      navigate("/check-in");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f4f6f8",
        position: "relative"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#ffffff",
          padding: "30px",
          borderRadius: "8px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          textAlign: "center"
        }}
      >
        <h2 style={{ marginBottom: "12px", color: "#111827" }}>
          Close Event
        </h2>

        <p
          style={{
            fontSize: "14px",
            color: "#6b7280",
            marginBottom: "20px"
          }}
        >
          Final customer OTP is required to complete the event.
        </p>

        {error && (
          <div
            style={{
              backgroundColor: "#fee2e2",
              color: "#b91c1c",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "15px"
            }}
          >
            {error}
          </div>
        )}

        {/* 🔐 Trigger Final OTP */}
        {!otpTriggered && (
          <button
            onClick={triggerFinalOTP}
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
              marginBottom: "15px"
            }}
          >
            {loading ? "Triggering..." : "Trigger Final OTP"}
          </button>
        )}

        {/* 🔢 Verify Final OTP */}
        {otpTriggered && (
          <>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 4-digit OTP"
              maxLength={4}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #d1d5db",
                marginBottom: "15px",
                outline: "none",
                textAlign: "center",
                fontSize: "16px"
              }}
            />

            <button
              onClick={closeEvent}
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: loading ? "#9ca3af" : "#16a34a",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                fontSize: "16px",
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Closing..." : "Verify OTP & Close Event"}
            </button>
          </>
        )}
      </div>

      {/* Logout */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px"
        }}
      >
        <LogoutButton />
      </div>
    </div>
  );
};

export default EventClose;
