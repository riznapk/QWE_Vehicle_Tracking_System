import { Button, TextField, Typography, Grid } from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import * as yup from "yup";

import api from "../api/axiosConfig";
import { addUserInfo } from "../redux/userDetailsReducer";
import Popup from "../components/Popup";

const initialValues = {
  userEmail: "",
  userPassword: "",
};

const EmailRegEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const schema = yup.object().shape({
  userEmail: yup
    .string()
    .required("Email is Required")
    .matches(EmailRegEx, "Invalid Email"),
  userPassword: yup
    .string()
    .required("Password is Required")
    .min(6, "Password must be at least 6 characters"),
});

const Signin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState(false);
  const [approvalError, setApprovalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Formik Implementation
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      loginExistingUser();
    },
    validationSchema: schema,
  });

  // axios call to the backend to check for authenticated user
  const loginExistingUser = async () => {
    try {
      const response = await api.post("/users/signin", {
        userEmail: formik?.values?.userEmail,
        userPassword: formik?.values?.userPassword,
      });

      if (response?.data?.message == "success") {
        const userData = await api.get(`/users/${formik?.values?.userEmail}`);
        dispatch(addUserInfo(userData?.data));
        navigate("/");
      } else if (response?.data?.message == "failure") {
        setError(true);
        setErrorMessage(response?.data?.status);
      } else if (response?.data?.message == "approval-waiting") {
        setApprovalError(true);
      }
    } catch (err) {
      if (err?.response?.data?.message == "failure") {
        setError(true);
        setErrorMessage(err?.response?.data?.status);
      } else if (err?.response?.data?.message == "approval-waiting") {
        setApprovalError(true);
      }
      console.log(err);
    }
  };

  return (
    <>
      <Grid container sx={styles.container}>
        <form onSubmit={formik.handleSubmit} style={styles.form}>
          <TextField
            type="email"
            name="userEmail"
            label="User Email"
            variant="outlined"
            value={formik.values.userEmail}
            onChange={formik.handleChange}
            style={styles.input}
            onBlur={formik.handleBlur}
            error={formik?.errors.userEmail && formik?.touched.userEmail}
            helperText={
              formik?.errors.userEmail && formik?.touched.userEmail ? (
                <span style={styles.error}>{formik?.errors.userEmail}</span>
              ) : null
            }
          />
          <TextField
            type="password"
            name="userPassword"
            value={formik.values.userPassword}
            label="Password"
            variant="outlined"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik?.errors?.userPassword && formik?.touched?.userPassword
            }
            helperText={
              formik?.errors?.userPassword && formik?.touched?.userPassword ? (
                <span style={styles.error}>{formik?.errors.userPassword}</span>
              ) : null
            }
            style={styles.input}
          />
          <Button
            type="submit"
            style={styles.button}
            onClick={formik?.handleSubmit}
          >
            Login
          </Button>
          <div style={styles.text}>
            <Typography>Don't have an account?</Typography>
            <Link to="/register" style={styles.link}>
              Register Here
            </Link>
          </div>
        </form>
      </Grid>
      {error ? (
        <Popup
          handleOpen={error}
          handleClose={() => {
            setError(false);
          }}
          severity="error"
          message={errorMessage}
        />
      ) : (
        ""
      )}
      <Popup
        handleOpen={approvalError}
        handleClose={() => {
          setApprovalError(false);
        }}
        severity="error"
        message="Waiting for Admin approval! Please try after sometime"
      />
    </>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "32px",
    borderRadius: "10px",
    boxShadow: "0 3px 6px rgba(0,0,0,0.16)",
    minWidth: "500px",
  },
  input: {
    margin: "8px",
    width: "100%",
  },
  error: {
    color: "red",
  },
  button: {
    margin: "16px 0",
    backgroundColor: "#FFB52E",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#AA7575",
    },
  },
  text: {
    display: "flex",
    alignItems: "center",
    marginTop: "16px",
  },
  link: {
    marginLeft: "8px",
    textDecoration: "none",
    color: "#0070f3",
    "&:hover": {
      textDecoration: "underline",
    },
  },
};

export default Signin;
