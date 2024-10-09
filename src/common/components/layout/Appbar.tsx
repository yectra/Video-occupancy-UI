import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, ListItemIcon } from "@mui/material";
import { LightModeOutlined, NotificationsOutlined, AccountCircle, Logout } from "@mui/icons-material";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { getUserDetailsFromMsal } from "@/common/services/AuthHelper";

const Appbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { instance,accounts} = useMsal(); 
  const isAuthenticated=useIsAuthenticated();
  const [email, setEmail] = useState<string>("");


  useEffect(() => {
    if(isAuthenticated){
    const userDetails = getUserDetailsFromMsal(accounts);
    setEmail(userDetails.email || "");
    }
  }, [accounts,isAuthenticated]);


  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: "/dashboard", 
    });
  };

  return (
    <AppBar sx={{ bgcolor: "#1C214F" }} position="fixed">
      <Toolbar sx={{ justifyContent: "flex-end" }}>
        <IconButton color="inherit">
          <LightModeOutlined />
        </IconButton>
        <IconButton color="inherit">
          <NotificationsOutlined />
        </IconButton>
        <IconButton color="inherit" onClick={handleMenuClick}>
          <AccountCircle sx={{ color: "#00D1A3" }} />
        </IconButton>
        <Typography sx={{ alignSelf: "center" }} variant="subtitle1">
          {email}
        </Typography>
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
