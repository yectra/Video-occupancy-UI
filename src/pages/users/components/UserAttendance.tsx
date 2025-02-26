import { useEffect, useRef, useState } from "react";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, TextField, Typography, InputAdornment, Popper, IconButton } from '@mui/material';
import TodayIcon from '@mui/icons-material/Today';
import Calendar, { CalendarProps } from 'react-calendar';
import moment from 'moment';
import 'react-calendar/dist/Calendar.css';
import '@/styles/core/components/CalendarStyles.css';

// Services
import { AttendanceDetails } from "@/pages/dashboard/services/attendancetracker";
import { AttendanceDataResponseModel } from "@/pages/dashboard/models/attendancetracker";

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

const UserAttendance: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [attendance, setAttendance] = useState<any[]>([])
  const calenderRef = useRef<HTMLDivElement>(null) as React.MutableRefObject<HTMLDivElement>;

  const attendanceDetails = new AttendanceDetails();

  const handleIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setCalendarOpen((prev) => !prev);
  };

  const handleDateChange: CalendarProps['onChange'] = (date: any) => {
    if (Array.isArray(date)) {
      setSelectedDate(date.length > 0 ? date[0] : null);
    } else {
      setSelectedDate(date);
    }
    attendanceDetails.getAllEmployeeAttendanceDetails('1', moment(date).format('YYYY-MM-DD'))
      .then((response) => {
        let attendanceResponse = response;
        const attendance = attendanceResponse.map(({ employeeId, date, firstPunchIn, lastPunchOut, break: breakTime, overTime }) => ({
          employeeId, date, firstPunchIn, lastPunchOut, break: breakTime, overTime
        }));
        setAttendance(attendance)
      })
    setCalendarOpen(false);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    const targetNode = event.target as Node | null;
    if (!calenderRef.current?.contains(targetNode)) {
      setCalendarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    attendanceDetails.getAllEmployeeAttendanceDetails('1')
      .then((response:any) => {
        let attendanceResponse: AttendanceDataResponseModel[]= response.data;
        const attendance = attendanceResponse.map(({ employeeId, date, firstPunchIn, lastPunchOut, break: breakTime, overTime }) => ({
          employeeId, date, firstPunchIn, lastPunchOut, break: breakTime, overTime
        }));
        setAttendance(attendance)
      })
  }, [])

  return (
    <Paper>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography sx={{ fontWeight: "bold", color: "#252C58", p: 2 }} variant='h6'>Attendance List</Typography>
        <TextField
          variant="outlined"
          label="Date"
          value={selectedDate ? selectedDate.toLocaleDateString() : 'Select Date'}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <span ref={calenderRef}>
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
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Employee Id</StyledTableCell>
              <StyledTableCell align="center">Date</StyledTableCell>
              <StyledTableCell align="center">Punch In</StyledTableCell>
              <StyledTableCell align="center">Punch Out</StyledTableCell>
              <StyledTableCell align="center">Break</StyledTableCell>
              <StyledTableCell align="center">Over Time</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendance.map((row) => (
              <StyledTableRow key={row.date}>
                <StyledTableCell align="center">{row.employeeId}</StyledTableCell>
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
