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
import { Link, useLocation } from "react-router-dom";

import GroupsIcon from "@mui/icons-material/Groups";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import PreviewIcon from "@mui/icons-material/Preview";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PersonIcon from "@mui/icons-material/Person";


const Sidebar: React.FC = () => {
  const [openUserManagement, setOpenUserManagement] = useState(false);
  const location = useLocation();

  const toggleUserManagement = () => {
    setOpenUserManagement(!openUserManagement);
  };

  const isActive = (path: string) => location.pathname === path;
  const isUserDetailsPage = location.pathname === "/user-details";

  return (
    <Drawer
      sx={{
        width: "220px",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: "220px",
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
        {isUserDetailsPage ? (
          <>

            <ListItem
              sx={{
                cursor: "pointer",
                backgroundColor: "#00D1A3",
              }}
            >
              <Box sx={{ display: "flex" }}>
                <EventAvailableIcon sx={{ mt: 1 }} />
                <ListItemText sx={{ ml: 2 }}>
                  <Typography sx={{ fontSize: 19 }} variant="h6">
                    User Attendance
                  </Typography>
                </ListItemText>
              </Box>
            </ListItem>
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
                backgroundColor: location.pathname.startsWith(
                  "/dashboard/occupancy-tracker/overview/"
                )
                  ? "#00D1A3"
                  : "inherit",
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
                <ListItem sx={{ ml: 4 }}>
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
                          Add Employee
                        </Typography>
                      </Box>
                    </ListItemText>
                  </Link>
                </ListItem>
                <ListItem sx={{ ml: 4 }}>
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
                          Manage Employee
                        </Typography>
                      </Box>
                    </ListItemText>
                  </Link>
                </ListItem>
              </List>
            </Collapse>

            <Link
              to="/dashboard/occupancy-tracker"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItem
                sx={{
                  cursor: "pointer",
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
              to="/dashboard/attendance"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItem
                sx={{
                  cursor: "pointer",
                  backgroundColor: isActive("/dashboard/attendance")
                    ? "#00D1A3"
                    : "inherit",
                }}
              >
                <Box sx={{ display: "flex" }}>
                  <EventAvailableIcon sx={{ mt: 1 }} />
                  <ListItemText sx={{ ml: 2 }}>
                    <Typography sx={{ fontSize: 19 }} variant="h6">
                      Attendance
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
