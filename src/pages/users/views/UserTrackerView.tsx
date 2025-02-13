import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import UserTimesheet from '@/pages/users/components/UserTimesheet';
import UserActivity from '@/pages/users/components/UserActivity';
import UserAttendance from '../components/UserAttendance';

// Services
import { AttendanceDetails } from "@/pages/dashboard/services/attendancetracker";
import { AttendanceDataResponseModel } from '@/pages/dashboard/models/attendancetracker';

const UserTrackerView: React.FC = () => {
  const [todayPunchDetail, setTodayPunchDetail] = useState<AttendanceDataResponseModel>(new AttendanceDataResponseModel())

  const attendanceDetails = new AttendanceDetails();

  useEffect(() => {
    // let todayDate = new Date().toISOString().split('T')[0]
    attendanceDetails.getAllEmployeeAttendanceDetails('1', '2024-12-19')
      .then((response: any) => {
        setTodayPunchDetail(response[0])

      })
  }, [])

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", justifyContent: "space-around", mb: 5 }}>
        <UserTimesheet todayPunchDetail={todayPunchDetail} />
        <UserActivity todayPunchDetail={todayPunchDetail} />
      </Box>
      <UserAttendance />
    </Box>
  );
};

export default UserTrackerView;
