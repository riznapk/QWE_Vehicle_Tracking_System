import {
  Autocomplete,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { initialValues } from "./initialValues";
import { validationSchema } from "./validation";

import { useSelector } from "react-redux";
import { routeList } from "../utils/routeData";
import DOMPurify from "dompurify";

const classes = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },
  form: {
    padding: 4,
    backgroundColor: "#fff",
    borderRadius: 2,
    maxWidth: "600px",
    width: "100%",
  },
  textField: {
    marginBottom: 2,
  },
};

const AddNewRouteForm = (props) => {
  const { formik, selectedDelivery } = props;
  const vehicles = useSelector((state) => state?.vehicle?.vehicles);
  const [selectedVehicle, setSelectedVehicle] = useState({});

  useEffect(() => {
    formik?.setFieldValue("vehicleID", selectedVehicle?.vehicleID);
    formik?.setFieldValue("vehicleStatus", selectedVehicle?.vehicleStatus);
  }, [formik?.vehicleID, selectedVehicle]);

  useEffect(() => {
    if (selectedDelivery) {
      formik?.setFieldValue("logisticsID", selectedDelivery?.logisticsID);
      formik?.setFieldValue("vehicleID", selectedDelivery?.vehicleID);
      formik?.setFieldValue("vehicleStatus", selectedDelivery?.vehicleStatus);
      formik?.setFieldValue("route", selectedDelivery?.route);
      formik?.setFieldValue(
        "securityTeamName",
        selectedDelivery?.securityTeamName
      );
    }
  }, [selectedDelivery]);

  return (
    <div>
      <form onSubmit={formik.handleSubmit} className={classes.form}>
        <Grid container spacing={2}>
          {/* <Typography variant="h5" sx={{ py: 1 }}>
            Route Details
          </Typography> */}

          <Grid item xs={12} className={classes.textField} fullwidth>
            <TextField
              name="routeName"
              label="Route Name"
              variant="outlined"
              sx={{ m: 1, minWidth: 450 }}
              value={DOMPurify.sanitize(formik.values.routeName)}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik?.errors.routeName && formik?.touched.routeName}
              helperText={
                formik?.errors.routeName && formik?.touched.routeName ? (
                  <span>{formik?.errors.routeName}</span>
                ) : null
              }
            />
          </Grid>

          <Grid item xs={12} className={classes.textField} fullwidth>
            <TextField
              name="startLoc"
              label="Start Location"
              variant="outlined"
              sx={{ m: 1, minWidth: 450 }}
              value={DOMPurify.sanitize(formik.values.startLoc)}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik?.errors.startLoc && formik?.touched.startLoc}
              helperText={
                formik?.errors.startLoc && formik?.touched.startLoc ? (
                  <span>{formik?.errors.startLoc}</span>
                ) : null
              }
            />
          </Grid>
          <Grid item xs={12} className={classes.textField} fullwidth>
            <TextField
              name="endLoc"
              label="End Location"
              variant="outlined"
              sx={{ m: 1, minWidth: 450 }}
              value={DOMPurify.sanitize(formik.values.endLoc)}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik?.errors.endLoc && formik?.touched.endLoc}
              helperText={
                formik?.errors.endLoc && formik?.touched.endLoc ? (
                  <span>{formik?.errors.endLoc}</span>
                ) : null
              }
            />
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AddNewRouteForm;
