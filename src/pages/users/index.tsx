import Appbar from "@/common/components/layout/Appbar";
import Sidebar from "@/common/components/layout/Sidebar";
import { Box, Toolbar } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";

const Users: React.FC = () => {
  return <Box sx={{ display: "flex", height: "100vh" }}>
  <Sidebar />
  <Box sx={{ flexGrow: 1 }}>
    <Appbar />
    <Toolbar />
  
      <Outlet />

  </Box>
</Box>;
};

export default Users;
