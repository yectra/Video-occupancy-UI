import React from "react";
import { Box, Button, Paper, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

import empImg from "@/assets/afro man.png";
import empImg2 from "@/assets/afro woman.png";
import empImg3 from "@/assets/blonde man.png";
import empImg4 from "@/assets/red hair woman.png";
import empImg5 from "@/assets/short hair man.png";
import empImg6 from "@/assets/purple hair woman.png";

const EmployeeView: React.FC = () => {
  const navigate = useNavigate();

  const handleAddSubAdminClick = () => {
    navigate("/dashboard/occupancy-tracker/add-emp");
  };

  const employeeImages = React.useMemo(
    () => [empImg, empImg2, empImg3, empImg4, empImg5, empImg6, empImg2, empImg],
    []
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 10
      }}
    >
      <Paper
        elevation={7}
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "auto",
        }}
      >
        <Grid container spacing={4} justifyContent="center">
          {employeeImages.map((img, index) => (
            <Grid item xs={12} sm={6}  md={4}  lg={3} key={index}>
              <Box
                sx={{
                  height:"100%",
                  boxShadow: 3,
                  bgcolor:
                    index % 2 === 0
                      ? "#A0E7AB"
                      : index % 3 === 0
                      ? "#D78981"
                      : "#807D7C",
                  position: "relative",
                  aspectRatio: "4 / 3"
                }}
              >
                <img
                  src={img}
                  alt={`Employee ${index + 1}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Button
        variant="contained"
        sx={{
          fontWeight: "bold",
          mt: 5,
          height: 50,
          width: 170,
          bgcolor: "#00D1A3",
          "&:hover": { bgcolor: "#00D1A3" },
          textTransform: "capitalize",
          fontSize: "17px",
        }}
        onClick={handleAddSubAdminClick}
      >
        Add Employee
      </Button>
    </Box>
  );
};

export default EmployeeView;
