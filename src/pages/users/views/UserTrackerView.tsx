import React, { useEffect, useState } from 'react';
import { Backdrop, Box, CircularProgress } from '@mui/material';
import UserTimesheet from '@/pages/users/components/UserTimesheet';
import UserActivity from '@/pages/users/components/UserActivity';
import UserAttendance from '../components/UserAttendance';

// Services
import { AttendanceDetails } from "@/pages/dashboard/services/attendancetracker";
import { AttendanceDataResponseModel } from '@/pages/dashboard/models/attendancetracker';

const UserTrackerView: React.FC = () => {
  const [loading, setLoading] =  useState<boolean>(false);  
  const [todayPunchDetail, setTodayPunchDetail] = useState<AttendanceDataResponseModel>(new AttendanceDataResponseModel())

  const attendanceDetails = new AttendanceDetails();

  useEffect(() => {
    // let todayDate = moment(new Date()).format('YYYY-MM-DD'
    setLoading(true);
    attendanceDetails.getAllEmployeeAttendanceDetails('1', '2024-12-19')
      .then((response: any) => {
        setTodayPunchDetail(response.data[0])

      }).finally(() => setLoading(false));
  }, [])

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Backdrop open={loading} style={{ zIndex: 9999, color: "#fff" }}>
        <CircularProgress color={"primary"}/>
      </Backdrop>
      <Box sx={{ display: "flex", justifyContent: "space-around", mb: 5 }}>
        <UserTimesheet todayPunchDetail={todayPunchDetail} />
        <UserActivity todayPunchDetail={todayPunchDetail} />
      </Box>
      <UserAttendance />
    </Box>
  );
};

export default UserTrackerView;
