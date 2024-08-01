import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { Box, Container, IconButton, Typography} from "@mui/material";
import VideocamIcon from '@mui/icons-material/Videocam';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import { signInUser } from "@/common/services/AuthHelper";
import BaseSpinner from "@/components/UI/BaseSpinner";

const DashboardSetupView: React.FC = () => {
  const navigate = useNavigate();

  const isAuthenticated = useIsAuthenticated();
  const { instance, inProgress } = useMsal();

  useEffect(() => {
    signInUser(instance, inProgress, isAuthenticated);
  }, [isAuthenticated]);

  const handleVideocamClick = () => {
    navigate("/dashboard/occupancy-tracker");
  };

  const handleGroupClick = () => {
    navigate("/dashboard/attendance");
  };

  const Card = ({ to, onClick, icon, label, description }: { to: string, onClick: () => void, icon: React.ReactNode, label: string, description: string }) => (
    <Box sx={{ display: "flex", flexDirection: "column", borderRadius: 3, boxShadow: 3, justifyContent: "center", alignItems: "center", width: { xs: "200px", sm: "240px", md: "280px" }, height: { xs: "280px", sm: "320px", md: "360px" }, gap: 3, p: 3,"&:hover":{boxShadow:20},cursor:"pointer" }}>
      <Box sx={{ borderRadius: "50%", p: 3,backgroundColor:"#00D1A3" }}>
        <Link to={to}>
          <IconButton onClick={onClick}>
            {icon}
          </IconButton>
        </Link>
      </Box>
      <Typography sx={{ color: "#1C214F ", textAlign: "center", fontWeight: "bold" }} variant="h6">{label}</Typography>
      <Typography sx={{ color: "#7D7D7D", textAlign: "center" }} variant="body2">{description}</Typography>
    </Box>
  );


  if(!isAuthenticated)
  {
    return(
      <BaseSpinner/>
    )
  }

  return (
    <Container sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", mt: 10, gap: 12 }}>
      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <Typography sx={{ fontWeight: "bold", color: "#252C58" }} variant="h4">Admin Dashboard Setup</Typography>
        <Typography sx={{ color: "#7D7D7D", mt: 2, textAlign: "center" }} variant="subtitle1">
           Choose the desired tracking feature to get started with monitoring and managing key organizational metrics.
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 5 }}>
        <Card 
          to="/dashboard/occupancy-tracker"
          onClick={handleVideocamClick}
          icon={<VideocamIcon sx={{ color: "white", fontSize: 60 }} />}
          label="Live Occupancy Tracker"
          description="Monitor real-time occupancy data to ensure safety compliance and efficient space utilization."
        />
        <Card
          to="/dashboard/attendance"  
          onClick={handleGroupClick}
          icon={<GroupsRoundedIcon sx={{ color: "white", fontSize: 60 }} />}
          label="Attendance Tracker"
          description="Access detailed employee attendance records, helping you track and manage workforce attendance effectively."
        />
      </Box>
    </Container>
  );
};

export default DashboardSetupView;
