import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

/**
 * Event type (matches backend Event model)
 */
export interface Event {
  _id: string;
  status:
    | "CREATED"
    | "CHECKED_IN"
    | "STARTED"
    | "SETUP_DONE"
    | "COMPLETED";

  vendor?: string;

  checkIn?: {
    latitude: number;
    longitude: number;
    photo: string;
    time: string;
  };

  // OTP to start event
  customerOTP?: string;
  isOTPVerified?: boolean;

  // Setup details
  setup?: {
    preSetupPhoto?: string;
    preSetupNote?: string;
    postSetupPhoto?: string;
    postSetupNote?: string;
  };

  // OTP to close event
  finalOTP?: string;
  isFinalOTPVerified?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

/**
 * Slice state type
 */
interface EventState {
  currentEvent: Event | null;
}

const initialState: EventState = {
  currentEvent: null
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    setEvent: (state, action: PayloadAction<Event>) => {
      state.currentEvent = action.payload;
    },
    clearEvent: (state) => {
      state.currentEvent = null;
    }
  }
});

export const { setEvent, clearEvent } = eventSlice.actions;
export default eventSlice.reducer;
