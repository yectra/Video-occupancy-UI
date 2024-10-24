import React from "react";
import Box from "@mui/material/Box";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Typography } from "@mui/material";

const VideoFeeds: React.FC = () => {
  const [selectedOption, setSelectedOption] = React.useState<string>("10"); 

  const cameraUrls: Record<string, string> = {
    "10": "https://www.kapwing.com/videos/66dfe6304b798b2daa670e8e",
    "20": "https://www.kapwing.com/videos/66dfe6304b798b2daa670e8e",
  };

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedOption(event.target.value as string);
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
        <Typography
          sx={{ fontWeight: "bold", color: "#1C214F",ml:1 }}
          variant="h6"
        >
          Video Feeds
        </Typography>
        <Select
          value={selectedOption}
          onChange={handleChange}
          displayEmpty
          sx={{ ml: "auto", width: 190, mr: 3 }}
        >
          <MenuItem value="10">Location 1</MenuItem>
          <MenuItem value="20">Location 2</MenuItem>
        </Select>
      </Box>

      {selectedOption && (
        <video width="100%" height="100%" controls autoPlay>
          <source src={cameraUrls[selectedOption]} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </Box>
  );
};

export default VideoFeeds;
