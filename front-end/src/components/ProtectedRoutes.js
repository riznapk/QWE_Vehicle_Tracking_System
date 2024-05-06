import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Signin from "../pages/SignIn";

function ProtectedRoutes() {
  const user = useSelector((state) => state?.user?.user);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (user?.userID) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [user, isLoggedIn]);

  return isLoggedIn ?? false ? <Outlet /> : <Signin />;
}

export default ProtectedRoutes;
