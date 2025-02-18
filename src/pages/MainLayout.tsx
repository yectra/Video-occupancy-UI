import { useAuth } from "@/common/hooks/AuthContext";

import { Box } from "@mui/material";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { useMsal } from "@azure/msal-react";

const MainLayout = () => {
  const { isAuthenticated ,signInUser, signOutUser} = useAuth();
  const { instance } = useMsal();

  if (!isAuthenticated) {
    signInUser();
    return; 
  }

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
console.log('checkTokenExpiryAndLogout decodedToken',decodedToken)
    if (decodedToken) {
      const expiryTime = decodedToken.exp * 1000;
      const currentTime = Date.now();

      const logoutThresholdTime = expiryTime - 60000;
      const timeDifference = logoutThresholdTime - currentTime;
      console.log('checkTokenExpiryAndLogout inside if',timeDifference)
      if (timeDifference <= 0) {
        signOutUser();
      }
    }
  };


  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const response = await instance.handleRedirectPromise();
        if (response) {
          const accessToken = response.accessToken;

          localStorage.setItem("accessToken", accessToken);

          checkTokenExpiryAndLogout(accessToken);

          const intervalId = setInterval(() => {
            checkTokenExpiryAndLogout(accessToken);
          }, 60000);

          return () => clearInterval(intervalId);
        }
      } catch (error) {
        console.error("Error handling redirect response", error);
      }
    };

    // Call the function to handle the redirect response
    handleRedirect();
  });


  return (
    <Box>
      <Outlet />
    </Box>
  );
};

export default MainLayout;
