import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ApprovalItem from "./ApprovalItem";
import Header from "../components/Header";
import { Grid, Typography } from "@mui/material";
import { addNotificationInfo } from "../redux/notificationReducer";
import api from "../api/axiosConfig";

const Approvals = () => {
  const dispatch = useDispatch();
  const notificationList = useSelector(
    (state) => state?.notification?.notifications
  );

  useEffect(() => {
    getNotificationDetails();
  }, []);

  const getNotificationDetails = async () => {
    try {
      const response = await api.get("/notifications");
      if (response?.data) dispatch(addNotificationInfo(response?.data));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Header />
      <Grid container sx={{ m: 2 }}>
        <Typography variant="h5">Approval List</Typography>
      </Grid>

      {notificationList.length === 0 && (
        <Grid container sx={{ m: 2 }}>
          <Typography variant="body">No approval requests found</Typography>
        </Grid>
      )}

      {notificationList?.map((item) => (
        <ApprovalItem
          key={item?.userEmail}
          data={{
            userID: item?.userID,
            userEmail: item?.userEmail,
            userPhoneNumber: item?.userPhoneNumber,
            accessPermission: item?.accessPermission,
            userFirstName: item?.userFirstName,
            userLastName: item?.userLastName,
          }}
        />
      ))}
    </div>
  );
};

export default Approvals;
