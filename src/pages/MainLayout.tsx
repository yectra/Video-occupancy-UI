import { Box } from "@mui/material";

import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <Box>
      {/* {location.pathname === "dashboard" && <Appbar />}
      
      <Grid container>
        <Grid item md={2} xs={false}>
      {location.pathname === "dashboard" && <Sidebar />}
          
        </Grid>
        <Grid item md={10} xs={12}>
          <Box sx={{ mt: 12 }}>
            <Outlet />
          </Box>
        </Grid>
      </Grid> */}
      <Outlet />
    </Box>
  );
};

export default MainLayout;
