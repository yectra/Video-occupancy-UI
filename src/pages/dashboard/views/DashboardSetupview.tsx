import React, { useEffect } from "react";
import { Box, Container, IconButton, Typography, Grid } from "@mui/material";
import VideocamIcon from '@mui/icons-material/Videocam';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';

//Router
import { Link, useNavigate } from "react-router-dom";

//Hooks
import { useAuth } from "@/common/hooks/AuthContext";

const DashboardSetupView: React.FC = () => {
  const { jobTitle, newUser } = useAuth();
  // const jobTitle: any = 'user'
  const navigate = useNavigate();

  const handleVideocamClick = () => {
    if ((jobTitle === 'admin' && !newUser) || jobTitle === 'user')
      navigate("/dashboard/occupancy-tracker/overview");
    else
      navigate("/dashboard/occupancy-tracker");
  };

  const handleGroupClick = () => {
    if ((jobTitle === 'admin' && !newUser) || jobTitle === 'user')
      navigate("/dashboard/attendance/emp-attendance");
    else
      navigate("/dashboard/attendance");
  };

  const Card = ({ to, onClick, icon, label, description }: { to: string, onClick: () => void, icon: React.ReactNode, label: string, description: string }) => (
    <Box onClick={onClick} sx={{ display: "flex", flexDirection: "column", borderRadius: 3, boxShadow: 3, justifyContent: "center", alignItems: "center", width: "80%", height: { xs: "280px", sm: "320px", md: "360px" }, gap: 3, p: 3, "&:hover": { boxShadow: 20 }, cursor: "pointer" }}>
      <Box sx={{ borderRadius: "50%", p: 3, backgroundColor: "#00D1A3" }}>
        <Link to={to}>
          <IconButton>
            {icon}
          </IconButton>
        </Link>
      </Box>
      <Typography sx={{ color: "#1C214F", textAlign: "center", fontWeight: "bold" }} variant="h5">{label}</Typography>
      <Typography sx={{ color: "#7D7D7D", textAlign: "center" }} variant="subtitle1">{description}</Typography>
    </Box>
  );

  useEffect(() => {    
    if (jobTitle === 'employee') {
      navigate("/dashboard/attendance/user-details", { replace: true });
    }
  }, [jobTitle, navigate]);

  return (
    <>
      {jobTitle != 'employee' ?
        <Container sx={{ mt: 10 }}>
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Typography sx={{ fontWeight: "bold", color: "#252C58" }} variant="h4">Admin Dashboard Setup</Typography>
            <Typography sx={{ color: "#7D7D7D", mt: 2 }} variant="h6">
              Choose the desired tracking feature to get started with monitoring and managing key organizational metrics.
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <Card
                to="/dashboard/occupancy-tracker"
                onClick={handleVideocamClick}
                icon={<VideocamIcon sx={{ color: "white", fontSize: 40 }} />}
                label="Live Occupancy Tracker"
                description="Monitor real-time occupancy data to ensure safety compliance and efficient space utilization."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card
                to="/dashboard/attendance"
                onClick={handleGroupClick}
                icon={<GroupsRoundedIcon sx={{ color: "white", fontSize: 40 }} />}
                label="Attendance Tracker"
                description="Access detailed employee attendance records, helping you track and manage workforce attendance effectively."
              />
            </Grid>
          </Grid>
        </Container> : null}
    </>
  );
};

export default DashboardSetupView;
