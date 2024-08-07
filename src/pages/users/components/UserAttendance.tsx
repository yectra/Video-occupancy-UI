import * as React from 'react';
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
import { useState } from 'react';
import 'react-calendar/dist/Calendar.css'; 
import '@/styles/core/components/CalendarStyles.css';

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

function createData(
  employeeId: number,
  date: string,
  punchIn: string,
  punchOut: string,
  breakTime: string,
  overTime: string,
) {
  return { employeeId, date, punchIn, punchOut, breakTime, overTime };
}

const rows = [
  createData(1840, '13/01/24', '8AM', '5:30 PM', '1hrs', '2hrs'),
  createData(1840, '14/01/24', '8AM', '5:30 PM', '1hrs', '1hrs'),
  createData(1840, '15/01/24', '8AM', '5:30 PM', '1hrs', '3hrs'),
  createData(1840, '16/01/24', '8AM', '5:30 PM', '1hrs', '0hrs'),
  createData(1840, '17/01/24', '8AM', '5:30 PM', '1hrs', '1hrs'),
  createData(1840, '20/01/24', '8AM', '5:30 PM', '1hrs', '1hrs'),
];

const UserAttendance: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
    setCalendarOpen(false);
  };

  return (
    <Paper>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography sx={{ fontWeight: "bold", color: "#252C58", p: 2 }} variant='h6'>Attendance List</Typography>
        <TextField
          variant="outlined"
          label="Date"
          value={selectedDate ? selectedDate.toLocaleDateString() : ''}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={handleIconClick}>
                  <TodayIcon />
                </IconButton>
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
            {rows.map((row) => (
              <StyledTableRow key={row.date}>
                <StyledTableCell align="center">{row.employeeId}</StyledTableCell>
                <StyledTableCell align="center">{row.date}</StyledTableCell>
                <StyledTableCell align="center">{row.punchIn}</StyledTableCell>
                <StyledTableCell align="center">{row.punchOut}</StyledTableCell>
                <StyledTableCell align="center">{row.breakTime}</StyledTableCell>
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
