import { Box } from "@mui/material"
import EmployeeTimesheet from "@/pages/dashboard/components/attendancetracker/EmployeeTimesheet";
import EmployeeActivity from "@/pages/dashboard/components/attendancetracker/EmployeeActivity";


const EmployeeDetailsView = () => {
  return (
    <Box sx={{ display: "flex", gap: 4 }}>
    <EmployeeTimesheet/>
    <EmployeeActivity/>
  </Box>
  )
}

export default EmployeeDetailsView