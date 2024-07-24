import { useRoutes } from "react-router-dom";

import { Suspense } from "react";

import route from "@/providers/Routers";

import { Box } from "@mui/material";

import BaseSpinner from "@/components/UI/BaseSpinner";

const App = () => {
  const routes = useRoutes(route);

  return (
    <Suspense fallback={<BaseSpinner />}>
      <Box>{routes}</Box>
    </Suspense>
  );
};

export default App;
