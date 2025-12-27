# 🟢 Zappy Vendor Tracker

A full-stack event workflow tracking system built to manage **vendor check-in, customer OTP verification, setup progress, and event closure** with photo proof and location tracking.

This project is developed as part of the **Zappy Full-Stack Intern Assessment**.

---

## 🚀 Tech Stack

### Frontend
- React.js
- TypeScript
- Redux Toolkit
- React Router DOM
- Axios
- Inline CSS

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB (Mongoose)
- JWT Authentication
- Multer (Photo Uploads)

---

## 📌 Features

### 1️⃣ Vendor Check-In
- Vendor login with JWT authentication
- Upload arrival photo
- Capture geo-location (latitude & longitude)
- Store timestamp
- Event status → **CHECKED_IN**

---

### 2️⃣ Customer OTP Verification (Start Event)
- Vendor triggers customer OTP (mocked for demo)
- Customer shares OTP with vendor
- OTP verification required to start event
- Event status → **STARTED**

---

### 3️⃣ Event Setup Progress
- Upload **Pre-Setup photo** with optional notes
- Upload **Post-Setup photo** with optional notes
- Ensures visual proof and transparency
- Event status → **SETUP_DONE**

---

### 4️⃣ Closing Confirmation
- Vendor triggers final customer OTP
- OTP verification required to close event
- Event status → **COMPLETED**

---

## 🧭 Application Flow

```
Login
↓
Vendor Check-In (Photo + Location)
↓
Trigger Customer OTP
↓
Verify OTP → Start Event
↓
Pre-Setup Photo Upload
↓
Post-Setup Photo Upload
↓
Trigger Final OTP
↓
Verify OTP → Event Completed
```

---

## 🖥️ Pages / Screens

- Login
- Register
- Vendor Check-In
- Start Event (Customer OTP)
- Setup (Pre / Post)
- Close Event (Final OTP)

---

## 🔐 Authentication

- JWT-based authentication
- Token stored in localStorage
- Protected routes for vendor operations
- Customer interaction via OTP only (no login required)

---

## 📂 Folder Structure

### Frontend
```
src/
├─ pages/
├─ routes/
├─ features/
│ ├─ auth/
│ └─ event/
├─ utils/
└─ app/
```

### Backend
```
└─ uploads
src/
├─ controllers/
├─ models/
├─ routes/
├─ middleware/
└─ app.ts
└─ server.ts
```

---

## ⚙️ How to Run Locally

### Backend
```
cd backend
npm install
npm run dev
```

Create a .env file:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```
Frontend
```
cd frontend
npm install
npm start
```
📷 Photo Uploads

Photos are uploaded using Multer

Stored in /uploads directory

Accessible via:
```
http://localhost:5000/uploads/<filename>
```
🧪 Notes for Evaluation

OTPs are mocked and shown via alerts for demo/testing

In production, OTPs can be sent via SMS or WhatsApp

UI is intentionally simple as per assignment scope

Focus is on functionality, logic, and workflow clarity


