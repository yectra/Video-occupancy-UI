// React Dependancies
import React, { useState } from "react";

import { Box, Grid, Toolbar } from "@mui/material";

// Router
import { Outlet } from "react-router-dom";

// Layouts
import Appbar from "@/common/components/layout/Appbar";

const UserLayout: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <Appbar onMenuClick={handleDrawerToggle} />
            <Toolbar />

            <Grid container>
                <Grid item xs={12} md={12} lg={12}>
                    <Outlet />
                </Grid>
            </Grid>
        </Box>
    )

}

export default UserLayout;