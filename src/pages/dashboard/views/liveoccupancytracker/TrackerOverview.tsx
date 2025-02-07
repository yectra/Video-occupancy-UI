import React from "react";
import { Grid, Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import OccupancyMeter from "@/pages/dashboard/components/liveoccupancytracker/OccupancyMeter";
import UtilizationGraph from "@/pages/dashboard/components/liveoccupancytracker/UtilizationGraph";
import VideoFeeds from "@/pages/dashboard/components/liveoccupancytracker/VideoFeeds";

const TrackerOverview: React.FC = () => {
   const location = useLocation();
  
  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6} >
          <VideoFeeds videoSources={location.state.videoSources}/>
        </Grid>

        <Grid item xs={12} md={6} >
          <OccupancyMeter capacity={location.state.capacityOfPeople}/>
        </Grid>
      </Grid>

      <Grid container sx={{ mb: 2 }}>
        <Grid item xs={12} >
          <UtilizationGraph />
        </Grid>
      </Grid>
    </Box>
  );
};

export default TrackerOverview;
