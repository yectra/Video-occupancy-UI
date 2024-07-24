import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const Dashboard: React.FC = () => {
  return (
    <Box>
      <Outlet />
    </Box>
  );
};

export default Dashboard;
