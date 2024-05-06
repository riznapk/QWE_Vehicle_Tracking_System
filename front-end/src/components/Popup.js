import { Alert, Snackbar, Stack } from "@mui/material";
import React from "react";

const Popup = (props) => {
  const { handleOpen, handleClose, severity, message } = props;

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        open={handleOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default Popup;
