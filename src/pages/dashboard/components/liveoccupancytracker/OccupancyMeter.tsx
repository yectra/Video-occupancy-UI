import { Box, Typography } from "@mui/material";
import MeterComponent from "@/pages/dashboard/components/liveoccupancytracker/MeterComponent";
import Alert from "@mui/material/Alert";

const OccupancyMeter = () => {
  let percentage = 90; 

  return (
    <Box sx={{ width: "100%", height: "390px", borderRadius: 3, boxShadow: 3,display:"flex",flexDirection:"column",alignContent:"center",alignItems:"center" }}>
      <Box sx={{alignSelf:"flex-start"}}>
      <Typography sx={{ p:2, color: "#1C214F",fontWeight:"bold" }} variant="h6">
        Live occupancy meter
      </Typography>
      </Box>
      {percentage >= 90 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            mt: 3,
          }}
        >
          <Alert
            sx={{
              width: 300,
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
            }}
            severity="error"
          >
            Almost reaching capacity.
          </Alert>
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          width: "400px",
          justifyContent: "center",
          alignItems: "center",
          p: 4
        }}
      >
        <MeterComponent percentage={percentage} />
      </Box>
    </Box>
  );
};

export default OccupancyMeter;
