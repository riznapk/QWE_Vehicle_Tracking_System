import React, { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "../styles/Header.css";

import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { clearUserInfo } from "../redux/userDetailsReducer";
import { clearLogisticsInfo } from "../redux/logisticReducer";
import { clearNotificationInfo } from "../redux/notificationReducer";
import { clearRouteInfo } from "../redux/routeReducer";
import { clearVehicleInfo } from "../redux/vehicleReducer";
import { clearTeamInfo } from "../redux/securityTeamReducer";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state?.user?.user);

  const handleLogout = () => {
    // Handle logout functionality here
    navigate("/signin");
    dispatch(clearUserInfo());
    dispatch(clearLogisticsInfo());
    dispatch(clearNotificationInfo());
    dispatch(clearRouteInfo());
    dispatch(clearVehicleInfo());
    dispatch(clearTeamInfo());
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  return (
    <nav className="header">
      <>
        <Link to="/" className="no-link">
          <span>
            <strong>QWE Logistics: Shipment Solutions</strong>
          </span>
        </Link>

        <div className="header-nav">
          <div className="header-tabs">
            <div className="header-tab-container">
              <Link to="/deliveries" className="header-tab">
                Logistics Info
              </Link>
            </div>
            {user?.userProfile == "admin" && (
              <>
                <div className="header-tab-container">
                  <Link to="/routes" className="header-tab">
                    Manage Routes
                  </Link>
                </div>
                <div className="header-tab-container">
                  <Link to="/approvals" className="header-tab">
                    Manage Approvals
                  </Link>
                </div>
              </>
            )}
          </div>
          <div className="header-user">
            <Link className="header-user" onClick={toggleDropdown}>
              <AccountCircleIcon fontSize="large" />
            </Link>
            {showDropdown && (
              <div className="dropdown">
                <Button onClick={handleLogout}>Logout</Button>
              </div>
            )}
          </div>
        </div>
      </>
    </nav>
  );
};

export default Header;
