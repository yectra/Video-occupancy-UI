import React from "react";
import { Box, Container } from "@mui/material";
import OccupancyMeter from "@/pages/dashboard/components/liveoccupancytracker/OccupancyMeter";
import UtilizationGraph from "@/pages/dashboard/components/liveoccupancytracker/UtilizationGraph";
import VideoFeeds from "@/pages/dashboard/components/liveoccupancytracker/VideoFeeds";

const TrackerOverview: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ overflow: 'hidden' }}>
      <Box sx={{ display: "flex", mb: 2, gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <VideoFeeds />
        </Box>
        <Box sx={{ flex: 1 }}>
          <OccupancyMeter />
        </Box>
      </Box>
      <Box sx={{ mb: 2 }}>
        <UtilizationGraph />
      </Box>
    </Container>
  );
};

export default TrackerOverview;
