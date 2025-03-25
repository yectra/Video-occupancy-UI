// React Dependancies
import React, { useState } from "react";

import { Box, Grid, Toolbar, Hidden, Drawer } from "@mui/material";

// Router
import { Outlet } from "react-router-dom";

// Layouts
import Appbar from "@/common/components/layout/Appbar";
import Sidebar from "@/common/components/layout/Sidebar";

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Appbar onMenuClick={handleDrawerToggle} />
      <Toolbar />

      <Grid container>
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, 
            }}
            sx={{
              "& .MuiDrawer-paper": { boxSizing: "border-box", width: 220 },
            }}
          >
            <Sidebar />
          </Drawer>
        </Hidden>

        <Hidden mdDown>
          <Grid item md={4} lg={2}>
            <Sidebar />
          </Grid>
        </Hidden>

        <Grid item xs={12} md={8} lg={10}>
            <Outlet />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Layout;
