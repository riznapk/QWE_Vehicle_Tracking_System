import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  routes: [],
};
const routeSlice = createSlice({
  name: "route",
  initialState,
  reducers: {
    addRouteInfo(state, action) {
      state.routes = action.payload;
    },
    clearRouteInfo(state, action) {
      state.routes = [];
    },
  },
});

export const { addRouteInfo, clearRouteInfo } = routeSlice.actions;
export default routeSlice.reducer;
