import {
  FormControl,
  FormHelperText,
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
import { vehicleStatusList } from "../utils/routeData";

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

const AddNewDeliveryForm = (props) => {
  const { formik, selectedDelivery } = props;
  const vehicles = useSelector((state) => state?.vehicle?.vehicles);
  const teams = useSelector((state) => state?.team?.teams);
  const [selectedVehicle, setSelectedVehicle] = useState({});
  const routeList = useSelector((state) => state?.route?.routes);
  // const classes = useStyles();
  const user = useSelector((state) => state?.user?.user);

  useEffect(() => {
    formik?.setFieldValue("vehicleID", selectedVehicle?.vehicleID);
    formik?.setFieldValue("vehicleStatus", selectedVehicle?.vehicleStatus);
  }, [formik?.vehicleID, selectedVehicle]);

  useEffect(() => {
    if (selectedDelivery) {
      formik?.setFieldValue("logisticsID", selectedDelivery?.logisticsID);
      formik?.setFieldValue("vehicleID", selectedDelivery?.vehicleID);
      formik?.setFieldValue("vehicleStatus", selectedDelivery?.vehicleStatus);
      formik?.setFieldValue("routeName", selectedDelivery?.routeName);
      formik?.setFieldValue(
        "securityTeamName",
        selectedDelivery?.securityTeamName
      );
    }
  }, [selectedDelivery]);

  return (
    <div>
      {" "}
      <form onSubmit={formik.handleSubmit} className={classes.form}>
        <Grid container spacing={2}>
          <Grid item xs={12} className={classes.textField} fullwidth>
            <FormControl fullwidth sx={{ m: 1, minWidth: 450 }}>
              <InputLabel id="demo-simple-select-standard-label">
                Vehicle ID
              </InputLabel>
              <Select
                name="vehicleID"
                value={formik?.values?.vehicleID}
                onChange={(e) => {
                  formik.handleChange("vehicleID")(e);
                  const selectedVehicleID = vehicles.find(
                    (item) => item.vehicleID === e.target.value
                  );

                  setSelectedVehicle(selectedVehicleID);
                }}
                label="Vehicle ID"
                onBlur={formik.handleBlur}
                error={formik.touched.vehicleID && formik.errors.vehicleID}
              >
                {vehicles?.map((item) => {
                  return (
                    <MenuItem value={item?.vehicleID}>
                      {item?.vehicleID}
                    </MenuItem>
                  );
                })}
              </Select>
              {formik.touched.vehicleID && formik.errors.vehicleID ? (
                <FormHelperText sx={{ color: "#d32f2f" }}>
                  {formik?.errors?.vehicleID}
                </FormHelperText>
              ) : null}
            </FormControl>
          </Grid>

          <Grid item xs={12} className={classes.textField} fullwidth>
            <FormControl fullwidth sx={{ m: 1, minWidth: 450 }}>
              <InputLabel id="demo-simple-select-standard-label">
                Route
              </InputLabel>
              <Select
                name="routeName"
                value={formik?.values?.routeName}
                onChange={formik.handleChange}
                label="Route"
                onBlur={formik.handleBlur}
                error={formik?.errors.routeName && formik?.touched.routeName}
              >
                {routeList?.map((item) => {
                  return (
                    <MenuItem value={item?.routeName}>
                      {item?.routeName}
                    </MenuItem>
                  );
                })}
              </Select>
              {formik?.errors.routeName && formik?.touched.routeName ? (
                <FormHelperText sx={{ color: "#d32f2f" }}>
                  {formik?.errors?.routeName}
                </FormHelperText>
              ) : null}
            </FormControl>
          </Grid>

          <Grid item xs={12} className={classes.textField} fullwidth>
            <FormControl fullwidth sx={{ m: 1, minWidth: 450 }}>
              <InputLabel id="demo-simple-select-standard-label">
                Security Team
              </InputLabel>
              <Select
                name="securityTeamName"
                value={formik?.values?.securityTeamName}
                onChange={formik.handleChange}
                label="Security Team"
                onBlur={formik.handleBlur}
                error={
                  formik?.errors.securityTeamName &&
                  formik?.touched.securityTeamName
                }
              >
                {teams?.map((item) => {
                  return (
                    <MenuItem value={item?.teamName}>{item?.teamName}</MenuItem>
                  );
                })}
              </Select>
              {formik?.errors.securityTeamName &&
              formik?.touched.securityTeamName ? (
                <FormHelperText sx={{ color: "#d32f2f" }}>
                  {formik?.errors?.securityTeamName}
                </FormHelperText>
              ) : null}
            </FormControl>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AddNewDeliveryForm;
