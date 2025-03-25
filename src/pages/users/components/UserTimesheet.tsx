import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography, Divider, TextField } from '@mui/material';
import { styled } from '@mui/system';
import { AttendanceDataResponseModel } from '@/pages/dashboard/models/attendancetracker';

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

interface IProps {
  todayPunchDetail: AttendanceDataResponseModel
}

const UserTimesheet: React.FC<IProps> = ({ todayPunchDetail }) => {
  const [todayPunch, setTodayPunch] = useState<string>('-')
  const [todayTimeWorks, setTodayTimeWorks] = useState<number>(0)
  const [angle, setAngle] = useState<number>(0)
  const [] = useSearchParams();

  useEffect(() => {
    if (todayPunchDetail && todayPunchDetail.date) {
      setTodayPunch(`${todayPunchDetail.date} ${todayPunchDetail.firstPunchIn}`)
      const [hours, minutes, seconds] = todayPunchDetail.totalWorkingHours.split(":").map(Number);
      const totalHours = hours + minutes / 60 + seconds / 3600;
      setTodayTimeWorks(totalHours)
      setAngle((todayTimeWorks / 24) * 200)
    }

  }, [todayPunchDetail])

  return (
    <Box sx={{ height: "30%", width: "45%", boxShadow: 3, padding: 2, margin:2, borderRadius: 3, position: 'relative' }}>
      <Box sx={{ display: 'flex', justifyContent: "flex-start", mb: 2 }}>
        <Typography sx={{ color: "#1C214F", fontWeight: "bold" }} variant='h6'>Timesheet </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <TextField
            variant="outlined"
            size="medium"
            label="PUNCH IN at"
            value={todayPunch}
            InputProps={{
              readOnly: true,
            }}
            sx={{ width: '250px' }}
          />
        </Box>
        <GaugeChart angle={angle}>
          {todayTimeWorks.toFixed(2)} hrs
        </GaugeChart>
      </Box>
      <Divider sx={{ mt: 3, width: "100%" }} />
      <Box sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center', gap: 30, mt: 2 }}>
        <Box>
          <Typography sx={{ fontWeight: "bold", color: "#7D7D7D" }}>Break</Typography>
          <Typography variant='body1'>{todayPunchDetail.break}</Typography>
        </Box>
        <Box>
          <Typography sx={{ fontWeight: "bold", color: "#7D7D7D" }}>Over Time</Typography>
          <Typography variant='body1'>{todayPunchDetail.overTime}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default UserTimesheet;