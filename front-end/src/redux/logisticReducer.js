import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  logistics: [],
};
const logisticSlice = createSlice({
  name: "logistic",
  initialState,
  reducers: {
    addLogisticsInfo(state, action) {
      state.logistics = action.payload;
    },
    clearLogisticsInfo(state, action) {
      state.logistics = [];
    },
  },
});

export const { addLogisticsInfo, clearLogisticsInfo } = logisticSlice.actions;
export default logisticSlice.reducer;
