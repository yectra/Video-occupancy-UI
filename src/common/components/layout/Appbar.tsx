// React Dependancies
import React, { useEffect, useState } from "react";

import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, ListItemIcon, Box, Paper, Stack, Drawer, Badge } from "@mui/material";
import { NotificationsOutlined, AccountCircle, Logout, Menu as MenuIcon } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";

// Azure
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { getUserDetailsFromMsal } from "@/common/services/AuthHelper";

// Hooks
import { useAuth } from "@/common/hooks/AuthContext";
import { CameraStatusModel } from "@/pages/dashboard/models/attendancetracker";
import { AttendanceTracker } from "@/pages/dashboard/services/attendancetracker";

interface AppbarProps {
  onMenuClick: () => void;
}

const Appbar: React.FC<AppbarProps> = ({ onMenuClick }) => {
  const { signOutUser, jobTitle } = useAuth();
  const { accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [email, setEmail] = useState<string>("");
  const [cameraStatus, setCameraStatus] = useState<CameraStatusModel[]>([]);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const unreadCount = cameraStatus.length;
  const open = Boolean(anchorEl);

  const attendanceTracker = new AttendanceTracker();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isAuthenticated) {
      const userDetails = getUserDetailsFromMsal(accounts);
      setEmail(userDetails.email || "");

      const fetchCameraStatus = () => {
        attendanceTracker.getAllCameraStatus().then((response: any) => {
          setCameraStatus(response.data.camera_statuses);
        });
      };

      fetchCameraStatus();
      intervalId = setInterval(fetchCameraStatus, 60000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [accounts, isAuthenticated]);

  const toggleDrawer = () => setDrawerOpen((prev) => !prev);

  const removeNotification = (id: string) => {
    setCameraStatus((prev: any) => prev.filter((n: any) => n.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prevId: string | null) => (prevId === id ? null : id));
  };

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
        {jobTitle !== "employee" && (
          <IconButton
            color="inherit"
            onClick={onMenuClick}
            edge="start"
            sx={{ display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>)}

        {jobTitle === "employee" ? (
          <Box sx={{ flexGrow: 1, px: 2 }}>
            <Typography sx={{ fontSize: 24 }} variant="h6">
              User Attendance Details
            </Typography>
          </Box>
        ) : (
          <Box sx={{ flexGrow: 1, px: 2 }}>
            <Typography sx={{ fontSize: 24 }} variant="h6">
              Dashboard
            </Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mr: 2 }} >
          <IconButton color="inherit" onClick={toggleDrawer}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsOutlined />
            </Badge>
          </IconButton>
          <IconButton color="inherit" onClick={handleMenuClick}>
            <AccountCircle sx={{ color: "#00D1A3" }} />
          </IconButton>
          <Typography variant="subtitle1">
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

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            top: "64px",
            height: "calc(100% - 64px)",
          },
        }}
      >
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Notifications
          </Typography>
          {cameraStatus.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No notifications
            </Typography>
          ) : (
            <Stack spacing={2}>
              {cameraStatus.map((notif: CameraStatusModel) => (
                <Paper
                  key={notif.id}
                  elevation={3}
                  sx={{
                    p: 2,
                    cursor: "pointer",
                  }}
                  onClick={() => toggleExpand(notif.id)}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body1" fontWeight="bold">
                      Camera Id- {notif.camera_id} - Failed
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notif.id);
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  {expandedId === notif.id && (
                    <Box mt={1}>
                      <Typography variant="body2" color="text.secondary">
                        {`Failure at Camera Id- ${notif.camera_id} (${notif.camera_type}) recorded on:`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {notif.date} - {notif.time}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {`View footage at ${notif.videoUrl}`}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              ))}
            </Stack>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Appbar;
