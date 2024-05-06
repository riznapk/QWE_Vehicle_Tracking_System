import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const TimeOut = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let timeout = null;

  const goBackToLogin = () => {
    navigate("/signin");
  };

  const autoAppReset = () => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      goBackToLogin();
    }, 1000 * 60 * 5);
  };

  const onMouseMove = () => {
    autoAppReset();
  };

  useEffect(() => {
    let preventReset = false;
    for (const path of ["/login", "/register"]) {
      if (path === location.pathname) {
        preventReset = true;
      }
    }
    if (preventReset) {
      return;
    }

    autoAppReset();

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
        window.removeEventListener("mousemove", onMouseMove);
      }
    };
  }, [location.pathname]);
  return <div />;
};
