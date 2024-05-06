import React, { useEffect, useState } from "react";
import { DataGrid, GridOverlay, GridColDef } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";
import Header from "../components/Header";
import AddNewDeliveryForm from "./AddNewDeliveryForm";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import api from "../api/axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import * as Yup from "yup";
import AddNewRouteForm from "./AddNewRouteForm";
import { addRouteInfo } from "../redux/routeReducer";
import Popup from "../components/Popup";

const Route = () => {
  const dispatch = useDispatch();
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState({});
  const [rows, setRows] = useState([]);
  const [isFailureOnAdd, setIsFailureOnAdd] = useState(false);
  const [failureMessage, setFailureMessage] = useState("");
  const [isAddNew, setIsAddNew] = useState(false);
  const tableContent = useSelector((state) => state?.route?.routes);
  const uuid = uuidv4();
  const currentUser = useSelector((state) => state?.user?.user);

  const initialValues = {
    routeName: "",
    startLoc: "",
    endLoc: "",
  };

  const validationSchema = Yup.object({
    routeName: Yup.string()
      .required("Route name is required")
      .matches(
        /^[a-zA-Z\s\-]+$/,
        "Route name must only contain letters, spaces, and hyphens"
      ),
    startLoc: Yup.string()
      .required("Start location is required")
      .matches(
        /^[a-zA-Z\s]+$/,
        "Start location must only contain letters and spaces"
      ),
    endLoc: Yup.string()
      .required("End location is required")
      .matches(
        /^[a-zA-Z\s]+$/,
        "End location must only contain letters and spaces"
      ),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,

    onSubmit: (values) => {
      handleAdd();
    },
  });

  const columns = [
    { field: "routeName", headerName: "Route Name", width: 150 },
    { field: "startLoc", headerName: "Start Location", width: 150 },
    { field: "endLoc", headerName: "End Location", width: 150 },

    {
      field: "delete",
      headerName: "Delete",

      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            handleDelete(params.row.id);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  const handleDelete = async (id) => {
    try {
      const response = await api.delete("/routes", {
        // headers: {
        //   "Content-Type": "application/json",
        //   // "Referrer-Policy": "strict-origin-when-cross-origin",
        // },
        data: {
          routeID: id,
        },
      });

      if (response?.data?.message == "success") {
        getRouteDetails();
        alert("route deleted");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = () => {
    addRouteDetails({ ...formik?.values, routeID: uuid });
  };

  const addRouteDetails = async (data) => {
    try {
      const response = await api.post("/routes", { ...data });
      if (response?.data?.message == "success") {
        getRouteDetails();
        setIsAddNew(false);
      } else if (response?.data?.message == "failure") {
        setIsFailureOnAdd(true);
        setFailureMessage(response?.data?.status);
      }
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

  return (
    <div>
      <Header />
      <Grid
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "100px",
        }}
      >
        <Button variant="contained" onClick={() => setIsAddNew(true)}>
          ADD NEW ROUTE
        </Button>
      </Grid>

      <div
        style={{
          height: 400,
          width: "70%",
          margin: "0 auto",
          marginTop: "100px",
          maxWidth: "40%",
        }}
      >
        <DataGrid
          rows={tableContent}
          columns={columns}
          components={{
            //Toolbar: GridToolbarCustom,
            NoRowsOverlay: () => <GridOverlay>No rows found</GridOverlay>,
          }}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection={false}
          style={{ backgroundColor: "#F8EFE4" }}
        />
      </div>
      <Dialog open={isAddNew} onClose={() => setIsAddNew(false)}>
        <DialogTitle id="alert-dialog-title">
          {"Add New Route"}
          <IconButton
            onClick={() => setIsAddNew(false)}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <AddNewRouteForm formik={formik} />
        </DialogContent>
        <DialogActions
          style={{ justifyContent: "center", marginBottom: "30px" }}
        >
          <Button
            variant="contained"
            onClick={formik?.handleSubmit}
            autoFocus
            type="submit"
          >
            ADD
          </Button>
          <Button
            variant="contained"
            onClick={() => setIsAddNew(false)}
            autoFocus
          >
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openUpdateDialog}
        onClose={() => setOpenUpdateDialog(false)}
      >
        <DialogTitle id="alert-dialog-title">
          {"Add New Route"}
          <IconButton
            onClick={() => setOpenUpdateDialog(false)}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <AddNewDeliveryForm
            formik={formik}
            selectedDelivery={selectedDelivery}
          />
        </DialogContent>
        <DialogActions
          style={{ justifyContent: "center", marginBottom: "30px" }}
        >
          <Button
            variant="contained"
            onClick={() => setOpenUpdateDialog(false)}
            autoFocus
          >
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>
      <Popup
        handleOpen={isFailureOnAdd}
        handleClose={() => {
          setIsFailureOnAdd(false);
        }}
        severity="error"
        message={failureMessage}
      />
    </div>
  );
};

export default Route;
