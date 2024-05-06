import React, { useEffect } from "react";
import Header from "../components/Header";
import Managesection from "../components/Managesection";
import GetDataService from "../services/getDataService";

const HomePage = () => {
  return (
    <div>
      <Header />
      <Managesection />
      <GetDataService />
    </div>
  );
};

export default HomePage;
