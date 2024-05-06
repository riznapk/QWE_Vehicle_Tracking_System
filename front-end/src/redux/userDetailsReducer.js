import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  user: {},
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUserInfo(state, action) {
      state.user = { ...action?.payload };
    },
    clearUserInfo(state, action) {
      state.user = {};
    },
  },
});

export const { addUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;
