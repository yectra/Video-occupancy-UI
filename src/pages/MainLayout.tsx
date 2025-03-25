import { useEffect } from "react";
import { Box } from "@mui/material";

//Router
import { Outlet } from "react-router-dom";

import { useMsal } from "@azure/msal-react";

//Hooks
import { useAuth } from "@/common/hooks/AuthContext";

//Services
// import { OccupancyTracker } from "@/pages/dashboard/services/liveoccupancytracker";

const MainLayout = () => {
  const { isAuthenticated, signInUser, signOutUser } = useAuth();
  const { instance } = useMsal();

  // const occupancyTracker = new OccupancyTracker();

  const decodeTokenManually = (token: string) => {
    try {
      const payload = token.split(".")[1]; // Get the payload (second part)
      const decoded = JSON.parse(atob(payload)); // Base64 decode
      return decoded;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const checkTokenExpiryAndLogout = (token: string) => {
    const decodedToken = decodeTokenManually(token);

    if (decodedToken) {
      const expiryTime = decodedToken.exp * 1000;
      const currentTime = Date.now();

      const logoutThresholdTime = expiryTime - 60000;
      const timeDifference = logoutThresholdTime - currentTime;

      if (timeDifference <= 0) {
        signOutUser();
      }
    }
  };

  // const fetchUserRole = async () => {
  //   occupancyTracker.checkUserExists().then((response) => {
  //     localStorage.setItem("existUser", response.data.exists);
  //   })
  // };

  useEffect(() => {
    if (!isAuthenticated) {
      signInUser();
      return;
    }
    // fetchUserRole();
  }, [isAuthenticated]);


  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const response = await instance.handleRedirectPromise();
        let accessToken: any
        if (response) {
          accessToken = response.accessToken;

          localStorage.setItem("accessToken", accessToken);
        } else if (localStorage.getItem("accessToken")) {
          accessToken = localStorage.getItem("accessToken");
        }
        checkTokenExpiryAndLogout(accessToken);

        const intervalId = setInterval(() => {
          checkTokenExpiryAndLogout(accessToken);
        }, 60000);

        return () => clearInterval(intervalId);
      } catch (error) {
        console.error("Error handling redirect response", error);
      }
    };

    // Call the function to handle the redirect response
    handleRedirect();
  });

  return (
    <Box>
      {isAuthenticated && <Outlet />}
    </Box>
  );
};

export default MainLayout;
