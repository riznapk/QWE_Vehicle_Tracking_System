import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  notifications: [],
};
const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotificationInfo(state, action) {
      state.notifications = action.payload;
    },
    clearNotificationInfo(state, action) {
      state.notifications = [];
    },
  },
});

export const { addNotificationInfo, clearNotificationInfo } =
  notificationSlice.actions;
export default notificationSlice.reducer;
