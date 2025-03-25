// React Dependancies
import React, { useEffect, useState } from "react";

import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, ListItemIcon, Box } from "@mui/material";
import { NotificationsOutlined, AccountCircle, Logout, Menu as MenuIcon } from "@mui/icons-material";

// Azure
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { getUserDetailsFromMsal } from "@/common/services/AuthHelper";

// Hooks
import { useAuth } from "@/common/hooks/AuthContext";

interface AppbarProps {
  onMenuClick: () => void;
}

const Appbar: React.FC<AppbarProps> = ({ onMenuClick }) => {
  const { signOutUser, jobTitle } = useAuth();
  const { accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [email, setEmail] = useState<string>("");

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (isAuthenticated) {
      const userDetails = getUserDetailsFromMsal(accounts);
      setEmail(userDetails.email || "");
    }
  }, [accounts, isAuthenticated]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    signOutUser()
  };

  return (
    <AppBar sx={{ bgcolor: "#1C214F" }} position="fixed">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <IconButton color="inherit" onClick={onMenuClick} edge="start" sx={{ display: { md: "none" } }}>
          <MenuIcon />
        </IconButton>

        {jobTitle === 'employee' ?
          <Box sx={{ flexGrow: 1 }}>
            <Typography sx={{ fontSize: 24 }} variant="h6">
              User Attendance Details
            </Typography>
          </Box> :
          <Box sx={{ flexGrow: 1 }} />
        }

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* <IconButton color="inherit">
            <LightModeOutlined />
          </IconButton> */}
          <IconButton color="inherit">
            <NotificationsOutlined />
          </IconButton>
          <IconButton color="inherit" onClick={handleMenuClick}>
            <AccountCircle sx={{ color: "#00D1A3" }} />
          </IconButton>
          <Typography sx={{ ml: 1 }} variant="subtitle1">
            {email}
          </Typography>
        </Box>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <AccountCircle fontSize="medium" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="medium" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Appbar;
