import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import VideocamIcon from '@mui/icons-material/Videocam';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';

const DashboardSetupView: React.FC = () => {
  const navigate = useNavigate();
  const { instance, accounts } = useMsal();
  const theme = useTheme();

  useEffect(() => {
    const login = async () => {
      if (accounts.length === 0) {
        try {
          await instance.loginRedirect({
            scopes: [
              "https://roosYectraStore.onmicrosoft.com/2fdca491-6f4f-4019-b204-62d74dae646a/occupanytracker/tasks.write",
              "openid",
              "profile",
              "offline_access",
            ],
          });
        } catch (error) {
          console.error("Login error: ", error);
        }
      }
    };

    login();
  }, [instance, accounts]);

  const handleVideocamClick = () => {
    navigate("/dashboard/occupancy-tracker");
  };

  const handleGroupClick = () => {
    navigate("/dashboard/attendance");
  };

  const Card = ({ to, onClick, icon, label }: { to: string, onClick: () => void, icon: React.ReactNode, label: string }) => (
    <Box sx={{ display: "flex", flexDirection: "column", borderRadius: 3, boxShadow: 3, justifyContent: "center", alignItems: "center", width: "280px", height: "290px", gap: 3 }}>
      <Box sx={{ borderRadius: "50%", bgcolor: theme.palette.primary.main, p: 3 }}>
        <Link to={to}>
          <IconButton onClick={onClick}>
            {icon}
          </IconButton>
        </Link>
      </Box>
      <Typography sx={{ color: "#7D7D7D" }} variant="h6">{label}</Typography>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", mt: 15, gap: 12 }}>
      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <Typography sx={{ fontWeight: "bold", color: "#252C58" }} variant="h4">Choose Your Account Type</Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 5 }}>
        <Card
          to="/dashboard/occupancy-tracker"
          onClick={handleVideocamClick}
          icon={<VideocamIcon sx={{ color: "white", fontSize: 50 }} />}
          label="Live Occupancy Tracker"
        />
        <Card
          to="/dashboard/attendance"
          onClick={handleGroupClick}
          icon={<GroupsRoundedIcon sx={{ color: "white", fontSize: 50 }} />}
          label="Attendance Tracker"
        />
      </Box>
    </Box>
  );
};

export default DashboardSetupView;
