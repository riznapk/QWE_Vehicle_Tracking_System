import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import React from "react";
import Header from "../components/Header";
import api from "../api/axiosConfig";
import { addNotificationInfo } from "../redux/notificationReducer";
import { useDispatch } from "react-redux";

function ApprovalItem(props) {
  const dispatch = useDispatch();
  const handleApprove = async () => {
    try {
      const response = await api.put("/users", {
        ...data,
        accessPermission: true,
      });

      if (response?.data?.message == "success") {
        alert("User approved!");
        deleteNotificationItem(data?.userID);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotificationItem = async (id) => {
    try {
      const response = await api.delete("/notifications", {
        // headers: {
        //   "Content-Type": "application/json",
        //   // "Referrer-Policy": "strict-origin-when-cross-origin",
        // },
        data: {
          userID: id,
        },
      });

      if (response?.data?.message == "success") {
        getNotificationDetails();
      }
    } catch (err) {
      console.error(err);
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
  const { data } = props;
  return (
    <>
      <Card
        sx={{
          maxWidth: 700,
          //   minWidth: 275,
          m: 4,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          p: 2,
          ml: 10,
          mr: 10,
          display: "flex",
          flexDirection: "row",
        }}
      >
        <CardContent>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "400px auto",
              gap: "16px",
              alignItems: "center",
            }}
          >
            <div>
              <Typography sx={{ mb: 1.5, mt: 1 }} color="text.secondary">
                First Name: {data?.userFirstName}
              </Typography>
              <Typography sx={{ mb: 1.5, mt: 1 }} color="text.secondary">
                Last Name: {data?.userLastName}
              </Typography>
              <Typography sx={{ mb: 1.5, mt: 1 }} color="text.secondary">
                Email: {data?.userEmail}
              </Typography>
              <Typography sx={{ mb: 1.5, mt: 1 }} color="text.secondary">
                Phone Number: {data?.userPhoneNumber}
              </Typography>
            </div>
          </div>
        </CardContent>

        <CardActions>
          <Button variant="contained" color="primary" onClick={handleApprove}>
            APPROVE
          </Button>
        </CardActions>
      </Card>
    </>
  );
}

export default ApprovalItem;
