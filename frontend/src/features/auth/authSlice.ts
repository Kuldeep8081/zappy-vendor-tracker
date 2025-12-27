import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

/**
 * User type (based on backend response)
 */
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

/**
 * Auth state type
 */
interface AuthState {
  user: User | null;
  token: string | null;
}

const tokenFromStorage = localStorage.getItem("token");

const initialState: AuthState = {
  user: null,
  token: tokenFromStorage
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    }
  }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
