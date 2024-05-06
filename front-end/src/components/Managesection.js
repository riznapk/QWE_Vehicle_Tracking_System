import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Managesection = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user?.user);
  return (
    <Box sx={{ flexGrow: 1, margin: 30 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card sx={{ backgroundColor: "#F8EFE4" }}>
            <CardHeader
              title="Manage Deliveries Here"
              titleTypographyProps={{
                align: "center",
                marginBottom: "50px",
                marginTop: "30px",
              }}
            />
            <CardContent sx={{ textAlign: "center", display: "flex" }}>
              <Card
                sx={{
                  maxWidth: "200px",
                  height: "150px",
                  margin: "auto",
                  cursor: "pointer",
                }}
                onClick={() => {
                  navigate("/deliveries");
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <AirportShuttleIcon fontSize="large" />
                  <Typography sx={{ textAlign: "center" }}>
                    Track and Update Deliveries
                  </Typography>
                </CardContent>
              </Card>
              {user?.userProfile == "admin" && (
                <Card
                  sx={{
                    maxWidth: "200px",
                    height: "150px",
                    margin: "auto",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigate("/routes");
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <LocalShippingIcon fontSize="large" />
                    <Typography sx={{ textAlign: "center" }}>
                      Manage Routes
                    </Typography>
                  </CardContent>
                </Card>
              )}
              {user?.userProfile == "admin" && (
                <Card
                  sx={{
                    maxWidth: "200px",
                    height: "150px",
                    margin: "auto",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigate("/approvals");
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <AccountBoxIcon fontSize="large" />
                    <Typography sx={{ textAlign: "center" }}>
                      Manage Approvals
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Managesection;
