import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Card, CardContent, Grid, MenuItem, Typography } from "@mui/material";
import { VideoPlayer } from "@/pages/dashboard/components/liveoccupancytracker/VideoPlayer";

// Services
import { OccupancyTracker } from "@/pages/dashboard/services/liveoccupancytracker";

const VideoFeeds: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [entranceNames, setEntranceNames] = useState<string[]>([])
  const [videoSource, setVideoSource] = useState<string>('')
  const [cameraDetails, setCameraDetails] = useState<any[]>([])

  const occupancyTracker = new OccupancyTracker();

  useEffect(() => {
    occupancyTracker.getCameraUrls().then((response: any) => {
      setCameraDetails(response.cameraDetails)
      const entranceNames = response.cameraDetails.map((video: any) => video.entranceName)
      setEntranceNames(entranceNames);
      setSelectedOption(entranceNames[0])
      setVideoSource(response.cameraDetails[0].videoUrl)
    })
  }, [])

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedOption(event.target.value as string);
    setVideoSource(cameraDetails.find((video) => video.entranceName === event.target.value as string)?.videoUrl as string)
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "390px",
        width: "100%",
        borderRadius: 2,
        boxShadow: 3,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: "auto",
          display: "flex",
          alignItems: "center",
          padding: 0.3,
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={6} md={6}>
            <Typography
              sx={{ fontWeight: "bold", color: "#1C214F", p: 2 }}
              variant="h6"
            >
              Video Feeds
            </Typography>
          </Grid>

          <Grid item xs={6} md={6}>
            <Select
              value={selectedOption}
              onChange={handleChange}
              sx={{ ml: "auto", width: 190, mr: 3 }}
            >
              {entranceNames.map((entranceName, index) => (
                <MenuItem value={entranceName} key={index}>
                  {entranceName}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={12} sm={12} md={12} sx={{ p: 4, ml: 10 }}>
            <Card>
              <CardContent>
                <VideoPlayer source={videoSource} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );

};

export default VideoFeeds;
