import { useState, useEffect } from "react";
import { Box } from "@mui/material";

//Router
import { Outlet, useLocation, useNavigate } from "react-router-dom";

//Azure
import { useMsal } from "@azure/msal-react";

//Hooks
import { useAuth } from "@/common/hooks/AuthContext";

//Services
import { AttendanceTracker } from "@/pages/dashboard/services/attendancetracker";

const MainLayout = () => {
  const [attendanceSetup, setattendanceSetup] = useState<boolean | undefined>(undefined);
  const [isRoutingComplete, setIsRoutingComplete] = useState(false);

  const { isAuthenticated, signInUser, signOutUser } = useAuth();
  const { instance } = useMsal();
  const { jobTitle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const attendanceTracker = new AttendanceTracker();

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

  const fetchUserRole = async () => {
    attendanceTracker.checkUserExists().then((response) => {
      setattendanceSetup(response.data.attendance);
    })
  };

  useEffect(() => {
    if (!isAuthenticated) {
      signInUser();
      return;
    }
    fetchUserRole();
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

  useEffect(() => {
    if (!isAuthenticated || jobTitle === undefined || attendanceSetup === undefined) return;

    if (location.pathname === "/dashboard" || location.pathname === "/") {
      if (jobTitle === 'Employee') {
        navigate("/dashboard/attendance/user-details", { replace: true });
      } else if (jobTitle === "Admin" && attendanceSetup) {
        navigate("/dashboard/attendance/emp-attendance");
      } else {
        navigate("/dashboard/attendance");
      }
    }
    setIsRoutingComplete(true);
  }, [jobTitle, attendanceSetup, isAuthenticated, location.pathname]);

  return (
    <Box>
      {isAuthenticated && isRoutingComplete && <Outlet />}
    </Box>
  );
};

export default MainLayout;
