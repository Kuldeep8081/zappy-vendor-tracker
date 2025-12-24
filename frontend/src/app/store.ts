import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import eventReducer from "../features/event/eventSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    event: eventReducer
  }
});

// 🔥 Infer the `RootState` and `AppDispatch` types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
