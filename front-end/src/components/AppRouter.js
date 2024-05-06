import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Signin from "../pages/SignIn";
import Register from "../pages/Register";
import HomePage from "../pages/HomePage";
import Deliveries from "../pages/Deliveries";
import RouteList from "../pages/Route";
import Approvals from "../pages/Approvals";
import ProtectedRoutes from "./ProtectedRoutes";
import PageNotFound from "./PageNotFound";

const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route path={"/signin"} element={<Signin />}></Route>
        <Route path={"/register"} element={<Register />}></Route>
        <Route element={<ProtectedRoutes />}>
          <Route path={"/routes"} element={<RouteList />}></Route>
          <Route path={"/deliveries"} element={<Deliveries />}></Route>
          <Route path={"/approvals"} element={<Approvals />}></Route>
          <Route path={"/"} element={<HomePage />}></Route>
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default AppRouter;
