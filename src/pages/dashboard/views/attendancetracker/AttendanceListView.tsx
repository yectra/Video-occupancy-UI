import { Box } from "@mui/material";
import EmployeeAttendance from "@/pages/dashboard/components/attendancetracker/EmployeeAttendance";

const AttendanceListView = () => {
  let date = new Date().toLocaleDateString("en-CA")
  return (
    <Box>
      <EmployeeAttendance date={date} />
    </Box>
  );
};

export default AttendanceListView;
