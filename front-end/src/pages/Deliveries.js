import React, { useEffect, useState } from "react";
import { DataGrid, GridOverlay, GridColDef } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
} from "@mui/material";
import Header from "../components/Header";
import AddNewDeliveryForm from "./AddNewDeliveryForm";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import { initialValues } from "./initialValues";
import { validationSchema } from "./validation";
import { addLogisticsDetails } from "../services/getDataService";
import { addLogisticsInfo } from "../redux/logisticReducer";
import api from "../api/axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import Popup from "../components/Popup";
import { formatDataVehicleStatus, vehicleStatusList } from "../utils/routeData";

const Deliveries = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState({});
  const [rows, setRows] = useState([]);
  const [isAddNew, setIsAddNew] = useState(false);
  const [isErrorOnAdd, setIsErrorOnAdd] = useState(false);
  const tableContent = useSelector((state) => state?.logistic?.logistics);
  // const uuid = uuidv4();

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,

    onSubmit: (values) => {
      handleAdd();
    },
  });

  const handleStatusChange = (event, row) => {
    const newRows = rows.map((r) => {
      if (r.id === row.id) {
        return { ...r, vehicleStatus: event.target.value };
      }
      return r;
    });
    setRows(newRows);
  };
  const columns = [
    { field: "vehicleID", headerName: "Vehicle ID", width: 150 },
    { field: "routeName", headerName: "Route", width: 150 },
    { field: "securityTeamName", headerName: "Security Team", width: 150 },
    // {
    //   field: "teamContactPerson",
    //   headerName: "Team Contact",
    //   width: 150,
    // },
    {
      field: "vehicleStatus",
      headerName: "Status",
      width: 150,
      editable: user?.userProfile == "admin" ? false : true,
      renderCell: (params) =>
        user?.userProfile === "admin" ? (
          <span>{formatDataVehicleStatus(params.value)}</span>
        ) : (
          <FormControl sx={{ minWidth: 120 }}>
            <Select
              value={params.value}
              onChange={(e) => handleStatusChange(e, params.row)}
              inputProps={{ "aria-label": "Select status" }}
            >
              <MenuItem value="" disabled>
                Select status
              </MenuItem>
              {vehicleStatusList.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ),
    },

    {
      field: "updateStatus",
      headerName: "Update Status",

      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            //handleDelete(params.row.vehicleID);
            handleEditCellChange(params);
          }}
        >
          UPDATE STATUS
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",

      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            handleDelete(params.row.vehicleID);
          }}
        >
          Delete
        </Button>
      ),
    },

    {
      field: "update",
      headerName: "Update",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleUpdate(params.row)}
        >
          Update
        </Button>
      ),
    },
  ];

  const handleUpdate = (row) => {
    setSelectedDelivery(row);
    setOpenUpdateDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.delete("/logistics", {
        data: {
          vehicleID: id,
        },
      });

      if (response?.data?.message == "success") {
        getLogisticsDetails();
        alert("Delivery deleted");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = () => {
    const uuid = uuidv4();
    addLogisticsDetails({ ...formik?.values, logisticsID: uuid });
  };

  const handleUpdateSubmit = () => {
    updateLogisticsDetails({
      ...formik?.values,
      //logisticsID: selectedDelivery?.logisticsID,
    });
  };

  const addLogisticsDetails = async (data) => {
    try {
      const response = await api.post("/logistics", { ...data });

      if (response?.data?.message == "success") {
        getLogisticsDetails();
        setIsAddNew(false);
        //formik?.setValues(initialValues);
      } else if (response?.data?.message == "failure") setIsErrorOnAdd(true);
    } catch (err) {
      console.log(err);
    }
  };

  const updateLogisticsDetails = async (data) => {
    try {
      const response = await api.put("/logistics", { ...data });

      // setPackageList(response?.data);
      if (response?.data?.message == "success") {
        getLogisticsDetails();

        alert("Delivery Details Updated");
        setOpenUpdateDialog(false);
        //formik?.setValues(initialValues);
        // setIsAddNew(false);
        //navigate("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setRows(tableContent);
  }, [tableContent]);

  const handleEditCellChange = async (params) => {
    const { id, field, value, row } = params;

    const newRows = rows.map((r) => {
      if (r.id === row.id) {
        return { ...r, [field]: value };
      }
      return r;
    });
    setRows(newRows);

    try {
      const response = await api.put("/logistics", { ...row, [field]: value });
      if (response?.data?.message == "success") {
        getLogisticsDetails();
        alert("Status updated");
      }
    } catch (err) {
      console.error(err);
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

  return (
    <div>
      <Header />
      {user?.userProfile == "admin" && (
        <Grid
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "100px",
          }}
        >
          <Button variant="contained" onClick={() => setIsAddNew(true)}>
            ADD NEW DELIVERY
          </Button>
        </Grid>
      )}

      <div
        style={{
          height: 400,
          width: "65%",
          margin: "0 auto",
          marginTop: "100px",
          maxWidth: "65%",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          components={{
            //Toolbar: GridToolbarCustom,
            NoRowsOverlay: () => <GridOverlay>No rows found</GridOverlay>,
          }}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection={false}
          style={{ backgroundColor: "#F8EFE4" }}
          initialState={{
            columns: {
              columnVisibilityModel: {
                delete: user?.userProfile == "admin" ? true : false,
                update: user?.userProfile == "admin" ? true : false,
                updateStatus: user?.userProfile == "admin" ? false : true,
              },
            },
          }}
        />
      </div>
      <Dialog open={isAddNew} onClose={() => setIsAddNew(false)}>
        <DialogTitle id="alert-dialog-title">
          {"Add New Delivery Here"}
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
          <AddNewDeliveryForm formik={formik} />
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
          {"Update Existing Delivery"}
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
          <Button variant="contained" onClick={handleUpdateSubmit} autoFocus>
            UPDATE
          </Button>
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
        handleOpen={isErrorOnAdd}
        handleClose={() => {
          setIsErrorOnAdd(false);
        }}
        severity="error"
        message="The vehicle already been assigned! Please check the vehicleID!"
      />
    </div>
  );
};

export default Deliveries;
