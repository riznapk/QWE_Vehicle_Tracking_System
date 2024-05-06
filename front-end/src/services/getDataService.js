import api from "../api/axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { addVehicleInfo } from "../redux/vehicleReducer";
import { useEffect } from "react";
import { addTeamInfo } from "../redux/securityTeamReducer";
import { addLogisticsInfo } from "../redux/logisticReducer";
import { addRouteInfo } from "../redux/routeReducer";
import { addNotificationInfo } from "../redux/notificationReducer";

export const GetDataService = () => {
  const dispatch = useDispatch();
  const vehicles = useSelector((state) => state?.vehicle?.vehicles);
  const teams = useSelector((state) => state?.team?.teams);
  const logistics = useSelector((state) => state?.logistic?.logistics);

  useEffect(() => {
    if (vehicles == "" || teams == "" || logistics == "") {
      getVehicleDetails();
      getSecurityTeamDetails();
      getLogisticsDetails();
      getRouteDetails();
      getNotificationDetails();
    }
  }, []);

  const getVehicleDetails = async () => {
    try {
      const response = await api.get("/vehicles");
      if (response?.data) dispatch(addVehicleInfo(response?.data));
    } catch (err) {
      console.log(err);
    }
  };

  const getSecurityTeamDetails = async () => {
    try {
      const response = await api.get("/teams");
      if (response?.data) dispatch(addTeamInfo(response?.data));
    } catch (err) {
      console.log(err);
    }
  };

  const getLogisticsDetails = async () => {
    try {
      const response = await api.get("/logistics");
      if (response?.data) dispatch(addLogisticsInfo(response?.data));
    } catch (err) {
      console.log(err);
    }
  };

  const getRouteDetails = async () => {
    try {
      const response = await api.get("/routes");
      if (response?.data) dispatch(addRouteInfo(response?.data));
    } catch (err) {
      console.log(err);
    }
  };

  const getNotificationDetails = async () => {
    try {
      const response = await api.get("/notifications");
      if (response?.data) dispatch(addNotificationInfo(response?.data));
    } catch (err) {
      console.log(err);
    }
  };
  return "";
};

export default GetDataService;
