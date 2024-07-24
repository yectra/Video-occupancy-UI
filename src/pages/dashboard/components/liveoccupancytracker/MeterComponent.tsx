import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { styled } from "@mui/system";
import WarningIcon from "@mui/icons-material/Warning";

const GaugeContainer = styled(Box)({
  position: "relative",
  width: "200px",
  height: "100px",
  margin: "0 auto",
});

const GaugeSvg = styled("svg")({
  width: "100%",
  height: "100%",
});

const GaugeText = styled(Typography)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  fontSize: "24px",
  fontWeight: "bold",
});

const Legend = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "16px",
});

const LegendItem = styled(Box)({
  display: "flex",
  alignItems: "center",
  marginRight: "16px",
});

const LegendColorBox = styled(Box)<{ color: string }>(({ color }) => ({
  width: "16px",
  height: "16px",
  backgroundColor: color,
  marginRight: "8px",
}));

const CustomDialogTitle = styled(DialogTitle)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  textAlign: "center",
  paddingTop: "16px",
});

const CustomDialogContent = styled(DialogContent)({
  textAlign: "center",
  padding: "16px 24px",
});

const CustomDialogActions = styled(DialogActions)({
  display: "flex",
  justifyContent: "center",
  paddingBottom: "16px",
});

const CustomButton = styled(Button)({
  backgroundColor: "#FF0000",
  color: "#FFFFFF",
  "&:hover": {
    backgroundColor: "#D00000",
  },
  width: "150px",
  height: "40px",
  fontWeight: "bold",
});

const CustomDialog = styled(Dialog)({
  "& .MuiPaper-root": {
    borderRadius: "20px",
  },
});

interface MeterComponentProps {
  percentage: number;
}

const MeterComponent: React.FC<MeterComponentProps> = ({ percentage }) => {
  const [open, setOpen] = useState(false);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const filled = (percentage / 200) * circumference;
  const balance = circumference - filled;

  useEffect(() => {
    if (percentage >= 90) setOpen(true);
  }, [percentage]);

  const handleClose = () => setOpen(false);

  return (
    <Box textAlign="center">
      <GaugeContainer>
        <GaugeSvg>
          <circle
            cx="50%"
            cy="100%"
            r={radius}
            fill="transparent"
            stroke="#DF1313"
            strokeWidth="20"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset="0"
          />
          <circle
            cx="50%"
            cy="100%"
            r={radius}
            fill="transparent"
            stroke="#00D1A3"
            strokeWidth="20"
            strokeDasharray={`${filled} ${balance}`}
            strokeDashoffset={circumference / 4}
            strokeLinecap="butt"
            transform="rotate(-90 100 100)"
          />
        </GaugeSvg>
        <GaugeText>
          <Typography sx={{ mt: 10 }} variant="h5" fontWeight="bold">
            {`${percentage}%`}
          </Typography>
        </GaugeText>
      </GaugeContainer>
      <Legend>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            ml: 8,
            mt: 2,
          }}
        >
          <LegendItem>
            <LegendColorBox color="#00D1A3" />
            <Typography variant="body2">Filled Space</Typography>
          </LegendItem>
          <LegendItem>
            <LegendColorBox color="#DF1313" />
            <Typography variant="body2">Balance Space</Typography>
          </LegendItem>
        </Box>
      </Legend>
      <CustomDialog open={open} onClose={handleClose}>
        <CustomDialogTitle>
          <WarningIcon sx={{ fontSize: 40, color: "#F21E1E" }} />
          <Typography
            variant="h6"
            sx={{ color: "#F21E1E", fontWeight: "bold" }}
          >
            Capacity almost filled !!
          </Typography>
        </CustomDialogTitle>
        <CustomDialogContent>
          <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
            Lorem ipsum dolor sit amet consectetur. Morbi euismod elementum
            lorem scelerisque. Sit maecenas aliquam eu diam odio. Nisi faucibus
            ultricies iaculis euismod. Id at etiam auctor ac.
          </Typography>
        </CustomDialogContent>
        <CustomDialogActions>
          <CustomButton onClick={handleClose}>Okay</CustomButton>
        </CustomDialogActions>
      </CustomDialog>
    </Box>
  );
};

export default MeterComponent;
