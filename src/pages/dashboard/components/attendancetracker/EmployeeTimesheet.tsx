import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton, Divider, Avatar } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { styled } from '@mui/system';
import avImg from '@/assets/avatar.png'
import { AttendanceDetails } from '@/pages/dashboard/services/attendancetracker';
import { IndividualTimesheet } from '@/pages/dashboard/models/attendancetracker';

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

const EmployeeTimesheet: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const id = searchParams.get('id');
const [getEmployeeTimesheet,setEmployeeTimesheet]=useState<IndividualTimesheet>()
  const attendanceDetails=new AttendanceDetails();

  useEffect(()=>{
    attendanceDetails.getIndividualEmployeeDetails(id|| "").then((res)=>{
      console.log(res)
      setEmployeeTimesheet(res)
    })
  },[id])
 
  


  const time = 9;
  const angle = (time / 24) * 200; 

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
          <Avatar alt="Employee Avatar" src={avImg} sx={{ width: 70, height: 70 }} />
          <Box sx={{ ml: 2, color: "#7D7D7D" }}>
            <Typography sx={{ fontWeight: "bold" }} variant='h6'>{getEmployeeTimesheet?.employeeName}</Typography>
            <Typography variant='body2'>Employee Id {id}</Typography>
          </Box>
        </Box>
        <GaugeChart angle={angle}>
          {time.toFixed(2)} hrs
        </GaugeChart>
      </Box>
      <Divider sx={{ mt: 3, width: "100%" }} />
      <Box sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center',gap:30,mt:2}}>
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

export default EmployeeTimesheet;
