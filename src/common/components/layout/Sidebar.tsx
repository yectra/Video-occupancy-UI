// React Dependancies
import React, { useState } from "react";

import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Typography,
  Box,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import PreviewIcon from "@mui/icons-material/Preview";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PersonIcon from "@mui/icons-material/Person";

// Router
import { Link, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const location = useLocation();

  const [openUserManagement, setOpenUserManagement] = useState(false);
  const isActive = (path: string) => location.pathname === path;
  const isAttendanceTracker = location.pathname.startsWith("/dashboard/attendance");

  const toggleUserManagement = () => {
    setOpenUserManagement(!openUserManagement);
  };

  return (
    <Drawer
      sx={{
        width: "15%",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: "15%",
          bgcolor: "#1C214F",
          color: "white",
          overflow: "hidden",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <List>
        <ListItem>
          <ListItemText>
            <Typography sx={{ fontSize: 24 }} variant="h6">
              Dashboard
            </Typography>
          </ListItemText>
        </ListItem>
        <ListItem />
        {isAttendanceTracker ? (
          <>
            <Link
              to="/dashboard/attendance/emp-attendance"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItem
                sx={{
                  cursor: "pointer",
                  backgroundColor: isActive(
                    "/dashboard/attendance/emp-attendance"
                  )
                    ? "#00D1A3"
                    : "inherit",
                }}
              >
                <Box sx={{ display: "flex" }}>
                  <PreviewIcon sx={{ mt: 1 }} />
                  <ListItemText sx={{ ml: 2 }}>
                    <Typography sx={{ fontSize: 19 }} variant="h6">
                      Attendace
                    </Typography>
                  </ListItemText>
                </Box>
              </ListItem>
            </Link>
            {/* <Link
              to="/dashboard/attendance/user-details"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItem
                sx={{
                  cursor: "pointer",
                  backgroundColor: isActive("/dashboard/attendance/user-details")
                    ? "#00D1A3"
                    : "inherit",
                }}
              >
                <SettingsIcon />
                <ListItemText sx={{ ml: 2 }}>
                  <Typography sx={{ fontSize: 19 }} variant="h6">
                    User Details
                  </Typography>
                </ListItemText>
              </ListItem>
            </Link> */}
            <ListItem
              onClick={toggleUserManagement}
              sx={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <PersonIcon />
                <ListItemText sx={{ ml: 2 }}>
                  <Typography sx={{ fontSize: 19 }} variant="h6">
                    Employee Management
                  </Typography>
                </ListItemText>
              </div>
            </ListItem>
            <Collapse in={openUserManagement} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem sx={{
                  ml: 4,
                  backgroundColor: isActive(
                    "/dashboard/attendance/add-emp"
                  )
                    ? "#00D1A3"
                    : "inherit",
                }}>
                  <Link
                    to="/dashboard/attendance/add-emp"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <ListItemText
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Box sx={{ display: "flex" }}>
                        <GroupsIcon sx={{ marginRight: 1, fontSize: 23 }} />
                        <Typography variant="subtitle1" sx={{ fontSize: 16 }}>
                          Add Employee
                        </Typography>
                      </Box>
                    </ListItemText>
                  </Link>
                </ListItem>
                <ListItem sx={{
                  ml: 4,
                  backgroundColor: isActive(
                    "/dashboard/attendance/emp-form"
                  )
                    ? "#00D1A3"
                    : "inherit",
                }}>
                  <Link
                    to="/dashboard/attendance/emp-form"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <ListItemText
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Box sx={{ display: "flex" }}>
                        <PeopleAltIcon sx={{ marginRight: 1, fontSize: 21 }} />
                        <Typography variant="subtitle1" sx={{ fontSize: 16 }}>
                          Manage Employee
                        </Typography>
                      </Box>
                    </ListItemText>
                  </Link>
                </ListItem>
              </List>
            </Collapse>
            <Link
              to="/dashboard/attendance/attendance-update"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItem
                sx={{
                  cursor: "pointer",
                  backgroundColor: isActive("/dashboard/attendance/attendance-update")
                    ? "#00D1A3"
                    : "inherit",
                }}
              >
                <SettingsIcon />
                <ListItemText sx={{ ml: 2 }}>
                  <Typography sx={{ fontSize: 19 }} variant="h6">
                    Setup Details
                  </Typography>
                </ListItemText>
              </ListItem>
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/dashboard/occupancy-tracker/overview"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItem
                sx={{
                  cursor: "pointer",
                  backgroundColor: isActive(
                    "/dashboard/occupancy-tracker/overview"
                  )
                    ? "#00D1A3"
                    : "inherit",
                }}
              >
                <Box sx={{ display: "flex" }}>
                  <PreviewIcon sx={{ mt: 1 }} />
                  <ListItemText sx={{ ml: 2 }}>
                    <Typography sx={{ fontSize: 19 }} variant="h6">
                      Overview
                    </Typography>
                  </ListItemText>
                </Box>
              </ListItem>
            </Link>

            <ListItem
              onClick={toggleUserManagement}
              sx={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <PersonIcon />
                <ListItemText sx={{ ml: 2 }}>
                  <Typography sx={{ fontSize: 19 }} variant="h6">
                    User Management
                  </Typography>
                </ListItemText>
              </div>
            </ListItem>
            <Collapse in={openUserManagement} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem sx={{
                  ml: 4,
                  backgroundColor: isActive(
                    "/dashboard/occupancy-tracker/add-emp"
                  )
                    ? "#00D1A3"
                    : "inherit",
                }}>
                  <Link
                    to="/dashboard/occupancy-tracker/add-emp"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <ListItemText
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Box sx={{ display: "flex" }}>
                        <GroupsIcon sx={{ marginRight: 1, fontSize: 23 }} />
                        <Typography variant="subtitle1" sx={{ fontSize: 16 }}>
                          Add User
                        </Typography>
                      </Box>
                    </ListItemText>
                  </Link>
                </ListItem>
                <ListItem sx={{
                  ml: 4,
                  backgroundColor: isActive(
                    "/dashboard/occupancy-tracker/emp-form"
                  )
                    ? "#00D1A3"
                    : "inherit",
                }}>
                  <Link
                    to="/dashboard/occupancy-tracker/emp-form"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <ListItemText
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Box sx={{ display: "flex" }}>
                        <PeopleAltIcon sx={{ marginRight: 1, fontSize: 21 }} />
                        <Typography variant="subtitle1" sx={{ fontSize: 16 }}>
                          Manage User
                        </Typography>
                      </Box>
                    </ListItemText>
                  </Link>
                </ListItem>
              </List>
            </Collapse>

            <Link
              to="/dashboard/occupancy-tracker/tracker-setup"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItem
                sx={{
                  cursor: "pointer",
                  backgroundColor: isActive("/dashboard/occupancy-tracker/tracker-setup")
                    ? "#00D1A3"
                    : "inherit",
                }}
              >
                <SettingsIcon />
                <ListItemText sx={{ ml: 2 }}>
                  <Typography sx={{ fontSize: 19 }} variant="h6">
                    Setup Details
                  </Typography>
                </ListItemText>
              </ListItem>
            </Link>
            <Link
              to="/dashboard/occupancy-tracker/occupancy"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItem
                sx={{
                  cursor: "pointer",
                  backgroundColor: isActive("/dashboard/occupancy-tracker/occupancy")
                    ? "#00D1A3"
                    : "inherit",
                }}
              >
                <Box sx={{ display: "flex" }}>
                  <EventAvailableIcon sx={{ mt: 1 }} />
                  <ListItemText sx={{ ml: 2 }}>
                    <Typography sx={{ fontSize: 19 }} variant="h6">
                      Occupancy
                    </Typography>
                  </ListItemText>
                </Box>
              </ListItem>
            </Link>
          </>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
