import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userDetailsReducer from "./userDetailsReducer";
import vehicleDetailsReducer from "./vehicleReducer";
import teamDetailsReducer from "./securityTeamReducer";
import logisticReducer from "./logisticReducer";
import routeReducer from "./routeReducer";
import notificationReducer from "./notificationReducer";

const rootReducer = combineReducers({
  user: userDetailsReducer,
  vehicle: vehicleDetailsReducer,
  team: teamDetailsReducer,
  logistic: logisticReducer,
  route: routeReducer,
  notification: notificationReducer,
});

export default configureStore({
  reducer: rootReducer,
});
