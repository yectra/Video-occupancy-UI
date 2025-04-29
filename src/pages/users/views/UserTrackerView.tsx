import React, { useEffect, useState } from 'react';
import { Backdrop, Box, CircularProgress } from '@mui/material';
import UserTimesheet from '@/pages/users/components/UserTimesheet';
import UserActivity from '@/pages/users/components/UserActivity';
import UserAttendance from '../components/UserAttendance';

// Services
import { AttendanceTracker } from "@/pages/dashboard/services/attendancetracker";
import { AttendanceDataResponseModel } from '@/pages/dashboard/models/attendancetracker';

const UserTrackerView: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [todayPunchDetail, setTodayPunchDetail] = useState<AttendanceDataResponseModel>(new AttendanceDataResponseModel())
  const [attendanceList, setAttendanceList] = useState<any[]>([]);

  const attendanceDetails = new AttendanceTracker();

  useEffect(() => {
    setLoading(true);
    attendanceDetails.getAttendance().then((response: any) => {
      setTodayPunchDetail(response[0]);
      let attendanceResponse: AttendanceDataResponseModel[] = response;
      let attendance = attendanceResponse.length ? attendanceResponse.map(({ employeeId, date, firstPunchIn, lastPunchOut, break: breakTime, overTime }) => ({
        employeeId, date, firstPunchIn, lastPunchOut, break: breakTime, overTime
      })) : [];
      setAttendanceList(attendance);
    }).finally(() => setLoading(false));
  }, [])

  return (
    <Box sx={{ display: "flex", flexDirection: "column", mx: "3%", my: "2%" }}>
      <Backdrop open={loading} style={{ zIndex: 9999, color: "#fff" }}>
        <CircularProgress color={"primary"} />
      </Backdrop>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <UserTimesheet todayPunchDetail={todayPunchDetail} />
        <UserActivity todayPunchDetail={todayPunchDetail} />
      </Box>
      <UserAttendance attendanceList={attendanceList} />
    </Box>
  );
};

export default UserTrackerView;
