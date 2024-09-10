import React from "react";
import { Box, Grid, Toolbar } from "@mui/material";
import Appbar from "@/common/components/layout/Appbar";
import Sidebar from "@/common/components/layout/Sidebar";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>

      <Appbar />
      <Toolbar />


      <Grid container >
        <Grid item xs={0} md={2} lg={2}>
          <Sidebar />
        </Grid>

    
        <Grid item xs={12} md={10} lg={10}>
          <Box >
            <Outlet />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Layout;
