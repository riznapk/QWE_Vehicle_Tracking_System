import axios from "axios";

let authApiCall = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    // "Referrer-Policy": "strict-origin-when-cross-origin",
  },
  withCredentials: true,
});

export default authApiCall;
