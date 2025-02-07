import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Card, CardContent, Grid, MenuItem, Typography } from "@mui/material";
import { VideoPlayer } from "@/pages/dashboard/components/liveoccupancytracker/VideoPlayer";
import { CameraSetup } from "../../models/liveoccupanytracker";

interface IProps {
  videoSources: CameraSetup[];
}

const VideoFeeds: React.FC<IProps> = ({ videoSources }) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [entranceNames, setEntranceNames] = useState<string[]>([])
  const [videoSource,setVideoSource]= useState<string>('')

  useEffect(() => {
    const entranceNames = videoSources.map(video=> video.entranceName)
    setEntranceNames(entranceNames);
    setSelectedOption(entranceNames[0])
    setVideoSource(videoSources[0].videoSource)
  }, [])

  const handleChange = (event: SelectChangeEvent) => {    
    setSelectedOption(event.target.value as string);
    setVideoSource(videoSources.find((video)=>video.entranceName === event.target.value as string)?.videoSource as string)
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
          margin: 2
        }}
      >
        <Grid container rowSpacing={1} spacing={3}>
          <Grid item xs={6} md={6} >
            <Typography
              sx={{ fontWeight: "bold", color: "#1C214F", ml: 1 }}
              variant="h6"
            >
              Video Feeds
            </Typography>
          </Grid>

          <Grid item xs={6} md={6} >
            <Select
              value={selectedOption}
              onChange={handleChange}
              sx={{ ml: "auto", width: 190, mr: 3 }}
            >
             {entranceNames.map((entranceName,index)=>(
              <MenuItem value={entranceName} key={index}>{entranceName}</MenuItem>
             ))} 
            </Select>
          </Grid>        
            <Grid item xs={12} sm={12} md={12}>
              <Card>
                <CardContent>                  
                  <VideoPlayer
                    source={videoSource}                   
                  />
                </CardContent>
              </Card>
            </Grid>         

        </Grid>
      </Box>
    </Box>
  );
};

export default VideoFeeds;
