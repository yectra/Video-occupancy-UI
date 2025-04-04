import { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, TextField, Typography, InputAdornment, Popper, IconButton, CircularProgress, Backdrop } from '@mui/material';
import TodayIcon from '@mui/icons-material/Today';
import Calendar, { CalendarProps } from 'react-calendar';
import moment from 'moment';
import 'react-calendar/dist/Calendar.css';
import '@/styles/core/components/CalendarStyles.css';

// Services
import { AttendanceDetails } from "@/pages/dashboard/services/attendancetracker";

// Models
import { AttendanceDataResponseModel } from "@/pages/dashboard/models/attendancetracker";

//Router
import { useSearchParams } from "react-router-dom";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  '&:last-child': {
    borderRight: 'none',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  }
}));

interface IProps {
  attendanceList?: any;
}

const UserAttendance: React.FC<IProps> = ({ attendanceList }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [noRecordsMessage, setNoRecordsMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const attendanceDetails = new AttendanceDetails();

  const [searchParams] = useSearchParams();

  const id = searchParams.get("id");
  const date = searchParams.get("date");

  const handleIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setCalendarOpen((prev) => !prev);
  };

  const getAttendance=(id: string, date: string)=>{
    setLoading(true)
      attendanceDetails
        .getAllEmployeeAttendanceDetails(id, date)
        .then((response: any) => {
          let attendanceResponse: AttendanceDataResponseModel[] = response.data;
          setNoRecordsMessage(attendanceResponse.length ? null : "No records found.");
          const attendance = attendanceResponse.length ? attendanceResponse.map(({ employeeId, date, firstPunchIn, lastPunchOut, break: breakTime, overTime }) => ({
            employeeId, date, firstPunchIn, lastPunchOut, break: breakTime, overTime
          })) : [];
          setAttendance(attendance);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => setLoading(false));
  }

  const handleDateChange: CalendarProps['onChange'] = (currentDate: any) => {
    if (Array.isArray(currentDate)) {
      setSelectedDate(currentDate.length > 0 ? currentDate[0] : null);
    } else {
      setSelectedDate(currentDate);
    }
    setLoading(true);
    if (id) {
      getAttendance(id, moment(currentDate).format('YYYY-MM-DD'));      
    } 
    else if (attendanceList) {
      attendanceDetails.getAttendance(moment(currentDate).format('YYYY-MM-DD')).then((response: any) => {        
        let employeeAttendance: AttendanceDataResponseModel[] = response;
        setNoRecordsMessage(employeeAttendance.length ? null : "No records found.");
              let attendance = employeeAttendance.length ? employeeAttendance.map(({ employeeId, date, firstPunchIn, lastPunchOut, break: breakTime, overTime }) => ({
                employeeId, date, firstPunchIn, lastPunchOut, break: breakTime, overTime
              })) : [];
        setAttendance(attendance)
      }).finally(() => setLoading(false));
    }

    setCalendarOpen(false);
  };

  useEffect(() => {
    if (id) {
      let requestId = id;
      let requestDate = moment(date).format('YYYY-MM-DD');
      getAttendance(requestId, requestDate);
      setSelectedDate(new Date(date ?? ""));
    } else if (attendanceList) {
      setNoRecordsMessage(attendanceList.length ? null : "No records found.");
      setAttendance(attendanceList);
    }
  }, [id, attendanceList]);

  return (
    <Paper sx={{ mt: 4 }}>
      <Backdrop open={loading} style={{ zIndex: 9999, color: "#fff" }}>
        <CircularProgress color={"primary"} />
      </Backdrop>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography sx={{ fontWeight: "bold", color: "#252C58", p: 2 }} variant='h6'>Attendance List</Typography>
        <TextField
          variant="outlined"
          label="Date"
          value={selectedDate ? selectedDate.toLocaleDateString() : "Select Date"}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <span>
                  <IconButton onClick={handleIconClick}>
                    <TodayIcon />
                  </IconButton>
                </span>
              </InputAdornment>
            ),
          }}
        />
        <Popper open={calendarOpen} anchorEl={anchorEl} placement="bottom">
          <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px', backgroundColor: 'white' }}>
            <Calendar
              onChange={handleDateChange}
              value={selectedDate || new Date()}
              className="custom-calendar"
              maxDate={new Date()}
            />
          </div>
        </Popper>
      </Box>
      <TableContainer component={Paper} sx={{ mt: '10px' }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              {id && <StyledTableCell align="center">Employee Id</StyledTableCell>}
              <StyledTableCell align="center">Date</StyledTableCell>
              <StyledTableCell align="center">Punch In</StyledTableCell>
              <StyledTableCell align="center">Punch Out</StyledTableCell>
              <StyledTableCell align="center">Break</StyledTableCell>
              <StyledTableCell align="center">Over Time</StyledTableCell>
            </TableRow>
            {noRecordsMessage && attendance.length == 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="error">{noRecordsMessage}</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableHead>
          <TableBody>
            {attendance.map((row) => (
              <StyledTableRow key={row.date}>
                {id && <StyledTableCell align="center">{row.employeeId}</StyledTableCell>}
                <StyledTableCell align="center">{row.date}</StyledTableCell>
                <StyledTableCell align="center">{row.firstPunchIn}</StyledTableCell>
                <StyledTableCell align="center">{row.lastPunchOut}</StyledTableCell>
                <StyledTableCell align="center">{row.break}</StyledTableCell>
                <StyledTableCell align="center">{row.overTime}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default UserAttendance;
