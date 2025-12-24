import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setEvent } from "../features/event/eventSlice";
import LogoutButton from "../pages/LogoutButton";
import { useNavigate } from "react-router-dom";

const CheckIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheckIn = () => {
    if (loading) return;

    if (!photo) {
      alert("Please upload arrival photo");
      return;
    }

    if (!navigator.geolocation) {
      alert("Geolocation is not supported in this browser");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            alert("Session expired. Please login again.");
            setLoading(false);
            return;
          }

          const formData = new FormData();
          formData.append("photo", photo);
          formData.append("latitude", pos.coords.latitude.toString());
          formData.append("longitude", pos.coords.longitude.toString());

          const res = await axios.post(
            "http://localhost:5000/api/events/check-in",
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          // ✅ Save event in Redux
          dispatch(setEvent(res.data.event));

          alert("Check-in successful");
          navigate("/start-event");
        } catch (error: any) {
          alert(
            error.response?.data?.message ||
              "Check-in failed. Please try again."
          );
        } finally {
          setLoading(false);
        }
      },
      () => {
        alert("Location permission denied");
        setLoading(false);
      }
    );
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
          Vendor Check-In
        </h2>

        <p
          style={{
            fontSize: "14px",
            color: "#6b7280",
            marginBottom: "20px"
          }}
        >
          Upload arrival photo and confirm your location to proceed.
        </p>

        {/* 📸 Arrival Photo Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setPhoto(e.target.files ? e.target.files[0] : null)
          }
          style={{ marginBottom: "20px" }}
        />

        <button
          onClick={handleCheckIn}
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
          {loading ? "Checking in..." : "Check In"}
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

export default CheckIn;
