import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  teams: [],
};
const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    addTeamInfo(state, action) {
      state.teams = action.payload;
    },
    clearTeamInfo(state, action) {
      state.teams = [];
    },
  },
});

export const { addTeamInfo, clearTeamInfo } = teamSlice.actions;
export default teamSlice.reducer;
