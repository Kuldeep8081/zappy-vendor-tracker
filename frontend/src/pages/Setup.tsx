import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const Setup = () => {
  const [note, setNote] = useState("");
  const [type, setType] = useState<"PRE" | "POST">("PRE");
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ✅ Get event from Redux
  const event = useSelector((state: any) => state.event.currentEvent);
  const eventId = event?._id;

  const uploadSetup = async () => {
    if (loading) return;

    if (!eventId) {
      setError("No active event found. Please start event again.");
      return;
    }

    if (!photo) {
      setError("Please upload setup photo.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Session expired. Please login again.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("eventId", eventId);
      formData.append("type", type);
      formData.append("photo", photo);
      formData.append("note", note);

      await axios.post(
        "https://zappy-vendor-tracker.onrender.com/api/events/upload-setup",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(
        `${type === "PRE" ? "Pre" : "Post"} setup uploaded successfully`
      );

      // Reset local state
      setNote("");
      setPhoto(null);

      // 🔁 If POST setup is done → go to Close Event
      if (type === "POST") {
        navigate("/close-event");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Upload failed");
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
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "10px",
            color: "#111827"
          }}
        >
          {type === "PRE" ? "Pre-Setup" : "Post-Setup"}
        </h2>

        <p
          style={{
            textAlign: "center",
            fontSize: "14px",
            color: "#6b7280",
            marginBottom: "20px"
          }}
        >
          Upload setup photo and optional notes.
        </p>

        {error && (
          <div
            style={{
              backgroundColor: "#fee2e2",
              color: "#b91c1c",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "15px",
              textAlign: "center"
            }}
          >
            {error}
          </div>
        )}

        {/* 📸 Setup Photo */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setPhoto(e.target.files ? e.target.files[0] : null)
          }
          style={{ marginBottom: "15px" }}
        />

        {/* 📝 Optional Notes */}
        <textarea
          placeholder="Optional notes"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #d1d5db",
            marginBottom: "15px",
            outline: "none",
            resize: "none"
          }}
        />

        {/* PRE / POST Toggle */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px"
          }}
        >
          <button
            onClick={() => setType("PRE")}
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: type === "PRE" ? "#2563eb" : "#e5e7eb",
              color: type === "PRE" ? "#ffffff" : "#111827",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Pre Setup
          </button>

          <button
            onClick={() => setType("POST")}
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: type === "POST" ? "#2563eb" : "#e5e7eb",
              color: type === "POST" ? "#ffffff" : "#111827",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Post Setup
          </button>
        </div>

        <button
          onClick={uploadSetup}
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
          {loading ? "Uploading..." : "Upload Setup"}
        </button>
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

export default Setup;
