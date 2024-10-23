import { useAuth } from "@/common/hooks/AuthContext";

import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const { isAuthenticated ,signInUser} = useAuth();

  if (!isAuthenticated) {
    signInUser();
    return; 
  }


  return (
    <Box>
      <Outlet />
    </Box>
  );
};

export default MainLayout;
