import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  vehicles: [],
};
const vehicleSlice = createSlice({
  name: "vehicle",
  initialState,
  reducers: {
    addVehicleInfo(state, action) {
      state.vehicles = action.payload;
    },
    clearVehicleInfo(state, action) {
      state.vehicles = [];
    },
  },
});

export const { addVehicleInfo, clearVehicleInfo } = vehicleSlice.actions;
export default vehicleSlice.reducer;
