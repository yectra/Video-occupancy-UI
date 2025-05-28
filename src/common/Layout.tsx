// React Dependancies
import React, { useState } from "react";

import { Box, Drawer, useMediaQuery, useTheme } from "@mui/material";

// Router
import { Outlet } from "react-router-dom";

// Layouts
import Appbar from "@/common/components/layout/Appbar";
import Sidebar from "@/common/components/layout/Sidebar";

const drawerWidth = 240;

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Appbar onMenuClick={handleDrawerToggle} />

      {!isDesktop && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          container={typeof window !== "undefined" ? () => window.document.body : undefined}
          sx={{
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              height: "calc(100% - 64px)",
              boxSizing: "border-box",
              top: "64px",
              bgcolor: "#1C214F",
            },
          }}
        >
          <Sidebar onItemClick={handleDrawerToggle} />
        </Drawer>
      )}
      {isDesktop && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              height: "calc(100% - 64px)",
              boxSizing: "border-box",
              top: "64px",
              bgcolor: "#1C214F",
              position: "fixed",
            },
          }}
        >
          <Sidebar />
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          marginTop: "64px",
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;