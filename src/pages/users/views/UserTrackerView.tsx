import React from 'react';
import { Box } from '@mui/material';
import UserTimesheet from '@/pages/users/components/UserTimesheet';
import UserActivity from '@/pages/users/components/UserActivity';
import UserAttendance from '../components/UserAttendance';

const UserTrackerView: React.FC = () => {
  return (
    <Box sx={{display:"flex",flexDirection:"column"}}>
      <Box sx={{display:"flex",justifyContent:"space-around",mb:5}}>
    <UserTimesheet/>
    <UserActivity/>
      </Box>
    <UserAttendance/>
    </Box>
  );
};

export default UserTrackerView;
