import React from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import Container from "@mui/material/Container";
import "./DashboardLayout.css";

const DashboardLayout = ({ children }) => (
  <div className="dashboard-wrap">
    <Navbar />
    <div className="dashboard-inner">
      <Container maxWidth="md">{children}</Container>
    </div>
    <Footer />
  </div>
);

export default DashboardLayout;
