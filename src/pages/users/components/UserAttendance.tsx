import React, { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Typography, CircularProgress, Backdrop, Button, Popover, MenuItem, Select } from '@mui/material';

import moment from 'moment';
import { DateRange } from "react-date-range";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import 'react-calendar/dist/Calendar.css';
import '@/styles/core/components/CalendarStyles.css';

// Services
import { AttendanceTracker } from "@/pages/dashboard/services/attendancetracker";

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
  const [searchParams] = useSearchParams();

  const id = searchParams.get("id");
  const date = searchParams.get("date");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [noRecordsMessage, setNoRecordsMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterOption, setFilterOption] = useState<string>("");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const customButtonRef = React.useRef<HTMLDivElement | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const attendanceDetails = new AttendanceTracker();

  const getAttendance = (id: string, dateValue: any) => {
    setLoading(true)
    const value = {
      ...dateValue,
      employeeId: id
    }
    attendanceDetails
      .getAllEmployeeAttendanceDetails(value)
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

  const handleFilterChange = (e: any) => {
    const value = e.target.value;
    setFilterOption(value);

    if (value === "custom") {
      setAnchorEl(customButtonRef.current);
      setPopoverOpen(true);
    } else {
      setPopoverOpen(false);
      setAnchorEl(null);
      const data = {
        period: value
      }
      if (id) {
        getAttendance(id, data);
      }
      else if (attendanceList) {
        handleDateChange(data);
      }
    }
  };

  const handleClosePopover = () => {
    setPopoverOpen(false);
    setAnchorEl(null);
  };

  const handleCustomChange = () => {
    handleClosePopover();

    if (dateRange[0] && dateRange[1] && dateRange[0] !== dateRange[1]) {
      const value =
      {
        start_date: format(dateRange[0], 'yyyy-MM-dd'),
        end_date: format(dateRange[1], 'yyyy-MM-dd')
      }

      if (id) {
        getAttendance(id, value);
      }
      else if (attendanceList) {
        handleDateChange(value)
      }
    }
  };

  const handleDateChange = (value: any) => {
    setLoading(true);

    attendanceDetails.getAttendance(value).then((response: any) => {
      let employeeAttendance: AttendanceDataResponseModel[] = response;
      setNoRecordsMessage(employeeAttendance.length ? null : "No records found.");
      let attendance = employeeAttendance.length ? employeeAttendance.map(({ employeeId, date, firstPunchIn, lastPunchOut, break: breakTime, overTime }) => ({
        employeeId, date, firstPunchIn, lastPunchOut, break: breakTime, overTime
      })) : [];
      setAttendance(attendance)
    }).finally(() => setLoading(false));
  }

  useEffect(() => {
    if (id) {
      getAttendance(id, { date: moment(date).format('YYYY-MM-DD') });
      setFilterOption(`${date}`)
    } else if (attendanceList) {
      setNoRecordsMessage(attendanceList.length ? null : "No records found.");
      setAttendance(attendanceList);
      setFilterOption('today')
    }
  }, [id, attendanceList]);

  return (
    <Paper sx={{ mt: 4 }}>
      <Backdrop open={loading} style={{ zIndex: 9999, color: "#fff" }}>
        <CircularProgress color={"primary"} />
      </Backdrop>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography sx={{ fontWeight: "bold", color: "#252C58", p: 2 }} variant='h6'>Attendance List</Typography>
        <Box ref={customButtonRef}>
          <Select
            value={filterOption}
            onChange={handleFilterChange}
            sx={{
              height: 40,
              minWidth: 150,
              fontSize: '1rem',
              paddingX: 2,
            }}
          >
            {date && <MenuItem value={`${date}`} disabled>
              {date}
            </MenuItem>}
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="yesterday">Yesterday</MenuItem>
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem
              value="custom"
              onClick={() => {
                if (filterOption === "custom") {
                  setDateRange([null, null]);
                  setAnchorEl(customButtonRef.current);
                  setPopoverOpen(true);
                }
              }}
            >
              Custom
            </MenuItem>
          </Select>
        </Box>
        <Popover
          open={popoverOpen}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Box p={2}>
            <DateRange
              editableDateInputs={true}
              onChange={(item: any) => setDateRange([item.selection.startDate, item.selection.endDate])}
              moveRangeOnFirstSelection={false}
              ranges={[{
                startDate: dateRange[0] || new Date(),
                endDate: dateRange[1] || new Date(),
                key: "selection",
              }]}
              maxDate={new Date()}
            />
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button variant="contained" onClick={handleCustomChange}>
                Apply
              </Button>
            </Box>
          </Box>
        </Popover>
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
