import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography, Divider, Button, TextField } from '@mui/material';
import { styled } from '@mui/system';

const GaugeChart = styled('div')<{
  angle: number;
}>(({ angle }) => ({
  width: 170,
  height: 170,
  borderRadius: '50%',
  background: `conic-gradient(#00C49A 0% ${angle}%, #4A4A4A ${angle}% 100%)`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#FFFFFF',
  fontSize: '24px',
  fontWeight: 'bold',
}));

const UserTimesheet: React.FC = () => {
  const [] = useSearchParams();
  const time = 9;
  const angle = (time / 24) * 200;

  return (
    <Box sx={{ height: "305px", width: "540px", boxShadow: 3, padding: 3, borderRadius: 3, position: 'relative' }}>
      <Box sx={{ display: 'flex', justifyContent: "flex-start", mb: 2 }}>
        <Typography sx={{ color: "#1C214F", fontWeight: "bold" }} variant='h6'>Timesheet 13/01/24</Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            variant="outlined"
            size="medium"
            label="PUNCH IN at"
            value="13 March 2024 8am"
            InputProps={{
              readOnly: true,
            }}
            sx={{ width: '250px' }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{
              bgcolor: '#00C49A',
              '&:hover': {
                bgcolor: '#00A37A',
              },
            }}
          >
            Punch out
          </Button>
        </Box>
        <GaugeChart angle={angle}>
          {time.toFixed(2)} hrs
        </GaugeChart>
      </Box>
      <Divider sx={{ mt: 3, width: "100%" }} />
      <Box sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center', gap: 30, mt: 2 }}>
        <Box>
          <Typography sx={{ fontWeight: "bold", color: "#7D7D7D" }}>Break</Typography>
          <Typography variant='body1'>1hrs</Typography>
        </Box>
        <Box>
          <Typography sx={{ fontWeight: "bold", color: "#7D7D7D" }}>Over Time</Typography>
          <Typography variant='body1'>3hrs</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default UserTimesheet;