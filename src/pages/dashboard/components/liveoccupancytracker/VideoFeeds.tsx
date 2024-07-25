import React from "react";
import Box from "@mui/material/Box";

import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Typography } from "@mui/material";
import vidMall from "@/assets/Frontvideo.mp4"

const VideoFeeds: React.FC = () => {
  const [selectedOption, setSelectedOption] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedOption(event.target.value as string);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "390px",
        width: "620px",
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
          padding:0.3
        }}
      >
        <Typography sx={{fontWeight:"bold",color:"#00D1A3",ml:2}} variant="h6">Video Feeds</Typography>
        <Select
          value={selectedOption}
          onChange={handleChange}
          displayEmpty
          sx={{ ml: 'auto',width:190,mr:3}}
        >
          <MenuItem value={10} >North Entrance</MenuItem>
          <MenuItem value={20} >South Entrance</MenuItem>
        </Select>
      </Box>

      <video width="100%" height="100%" controls>
        <source src={vidMall} type="video/mp4" />
      </video>
    </Box>
  );
};

export default VideoFeeds;
