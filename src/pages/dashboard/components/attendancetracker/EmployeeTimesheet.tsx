import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import avImg from '@/assets/avatar.png';
import gaugImg from '@/assets/gauge.png';
import { Box, Typography, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const EmployeeTimesheet: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const name = searchParams.get('name') ;
  const id = searchParams.get('id');

  const handleBackClick = () => {
    navigate('/dashboard/attendance');
  };

  return (
    <Box sx={{ height: "305px", width: "540px", boxShadow: 3, padding: 3, borderRadius: 3, position: 'relative' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={handleBackClick}>
          <ArrowBack sx={{ color: "#1C214F" }} />
        </IconButton>
        <Typography sx={{ color: "#1C214F", fontWeight: "bold", ml: 1 }} variant='h6'>Timesheet 13/01/24</Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 4 }}>
        <Box sx={{ display: "flex", border: "2px solid  #7D7D7D", borderRadius: 3, mt: 4, padding: 4, gap: 3 }}>
          <img style={{ height: 70, width: 70 }} src={avImg} alt="Avatar" />
          <Box sx={{ display: "flex", flexDirection: "column", color: "#7D7D7D" }}>
            <Typography sx={{ fontWeight: "bold" }} variant='h6'>{name}</Typography>
            <Typography variant='body2'>Employee Id {id}</Typography>
          </Box>
        </Box>
        <img style={{ height: 170, width: 170 }} src={gaugImg} alt="Gauge" />
      </Box>

      
    </Box>
  );
};

export default EmployeeTimesheet;
