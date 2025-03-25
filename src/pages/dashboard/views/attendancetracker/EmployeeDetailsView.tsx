import { Box } from "@mui/material"
import EmployeeTimesheet from "@/pages/dashboard/components/attendancetracker/EmployeeTimesheet";
import EmployeeActivity from "@/pages/dashboard/components/attendancetracker/EmployeeActivity";
import UserAttendance from "@/pages/users/components/UserAttendance";


const EmployeeDetailsView = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <EmployeeTimesheet />
        <EmployeeActivity />
      </Box>
      <UserAttendance />
    </Box>
  )
}

export default EmployeeDetailsView