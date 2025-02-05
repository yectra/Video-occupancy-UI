import React from "react";
import Box from "@mui/material/Box";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Typography } from "@mui/material";

const VideoFeeds: React.FC = () => {
  const [selectedOption, setSelectedOption] = React.useState<string>("10"); 

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
        </Select>
      </Box>
    </Box>
  );
};

export default VideoFeeds;
