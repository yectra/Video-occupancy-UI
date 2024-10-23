import { useRoutes } from "react-router-dom";

import { Suspense } from "react";

import route from "@/providers/Routers";

import { Box } from "@mui/material";

import BaseSpinner from "@/common/components/UI/BaseSpinner";
import { AuthProvider } from "./common/hooks/AuthContext";

const App = () => {
  const routes = useRoutes(route);

  return (
    <Suspense fallback={<BaseSpinner />}>
      <AuthProvider>
      <Box>{routes}</Box>
      </AuthProvider>
    </Suspense>
  );
};

export default App;
