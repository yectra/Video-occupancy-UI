import React from "react";
import { Box, Button, Paper } from "@mui/material";
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

  const employeeImages = React.useMemo(() => [
    empImg, empImg2, empImg3, empImg4, empImg5, empImg6
  ], []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 10,
      }}
    >
      <Paper
        elevation={7}
        sx={{
          p: 5,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "auto",
          height: "auto",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 4,
          }}
        >
          {employeeImages.map((img, index) => (
            <Box
              key={index}
              sx={{
                boxShadow: 3,
                bgcolor:
                  index % 2 === 0
                    ? "#A0E7AB"
                    : index % 3 === 0
                    ? "#D78981"
                    : "#807D7C",
                position: "relative",
                aspectRatio: "4 / 3",
              }}
            >
              <img
                src={img}
                alt={`Employee ${index + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          ))}
        </Box>
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
