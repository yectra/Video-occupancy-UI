import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  Popper,
  tableCellClasses,
  InputBase,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Today as TodayIcon,
} from "@mui/icons-material";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "@/styles/core/components/CalendarStyles.css";
import { AttendanceDetails } from "@/pages/dashboard/services/attendancetracker";
import { debounce } from "lodash";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "black",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const EmployeeAttendance: React.FC = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [date, setDate] = useState<string>();
  const [noRecordsMessage, setNoRecordsMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const attendanceDetails = new AttendanceDetails();

  useEffect(() => {
    const today = new Date();
    setDate(today.toLocaleDateString("en-CA"));
  }, []);

  useEffect(() => {
    if (date) {
      setLoading(true);
      attendanceDetails.getAllEmployeeAttendanceDetails(date)
        .then((response) => {
          if (Array.isArray(response)) {
            const filteredRows = response.filter(record => record.date === date);
            setRows(filteredRows);
            setNoRecordsMessage(filteredRows.length ? null : "No records found.");
          } else if (response?.message) {
            setRows([]);
            setNoRecordsMessage(response.message);
          } else {
            setRows([]);
            setNoRecordsMessage("Unexpected response format.");
          }
        })
        .catch(() => setError("Failed to fetch data."))
        .finally(() => setLoading(false));
    }
  }, [date]);

  const fetchAttendanceRecords = useCallback(() => {
    if (date) {
      setLoading(true);
      attendanceDetails.getAllEmployeeAttendanceDetails(date)
        .then((response) => {
          if (Array.isArray(response)) {
            const filteredRows = response.filter(record => record.date === date);
            setRows(filteredRows);
            setNoRecordsMessage(filteredRows.length ? null : "No records found.");
          } else if (response?.message) {
            setRows([]);
            setNoRecordsMessage(response.message);
          } else {
            setRows([]);
            setNoRecordsMessage("Unexpected response format.");
          }
        })
        .catch(() => setError("Failed to fetch data."))
        .finally(() => setLoading(false));
    }
  }, [date]);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      if (value) {
        attendanceDetails.searchEmployeeDetails(date || "",value)
          .then(setRows)
          .catch(err=>{
            console.log(err)
            setRows([]) 
            setNoRecordsMessage("No user found");

          });
      } else {
        fetchAttendanceRecords();
      }
    }, 100),
    [fetchAttendanceRecords]
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleRowClick = (row: any) => {
    navigate(`/dashboard/attendance/emp-details?name=${row.employeeName}&id=${row.employeeId}`);
  };

  const handleIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setCalendarOpen(prev => !prev);
  };

  const handleDateChange = (date: any) => {
    const formattedDate = new Date(date).toLocaleDateString("en-CA");
    setDate(formattedDate);
    setSelectedDate(date);
    setCalendarOpen(false);
  };

 
  if (error) return <Typography>{error}</Typography>;

  return (
    <Box>
      <Backdrop open={loading} style={{ zIndex: 9999, color: "#fff" }}>
        <CircularProgress color={"primary"}/>
      </Backdrop>

      <Box sx={{ display: "flex", alignItems: "center",justifyContent:"space-between",marginBottom: "10px" }}>
        <Typography sx={{ fontWeight: "bold", color: "#1C214F", p: 2 }} variant="h5">
          Attendance List
        </Typography>
        <Box sx={{width:"350px" }}>
          <InputBase
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            startAdornment={
              <InputAdornment position="start"><SearchIcon /></InputAdornment>
            }
            endAdornment={searchTerm && (
              <InputAdornment position="end">
                <IconButton edge="end" size="large" onClick={() => setSearchTerm("")}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )}
            sx={{
              borderRadius: "4px",
              border: "2px solid #ccc",
              padding: "6px 10px",
              width: "100%",
              "&:hover": { borderColor: "#888" },
              "&:focus": { borderColor: "#1C214F", boxShadow: "1px #1C214F" },
            }}
          />
        </Box>
      </Box>

      <Table sx={{ minWidth: 700, boxShadow: 3, border: "1px solid #ccc" }}>
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Employee Id</StyledTableCell>
            <StyledTableCell align="center">Name</StyledTableCell>
            <StyledTableCell align="center">Email</StyledTableCell>
            <StyledTableCell align="center">
              Date
              <IconButton onClick={handleIconClick}>
                <TodayIcon style={{ color: "white" }} />
              </IconButton>
              <Popper open={calendarOpen} anchorEl={anchorEl} placement="bottom">
                <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "10px", backgroundColor: "white" }}>
                  <Calendar onChange={handleDateChange} value={selectedDate || new Date()} className="custom-calendar" maxDate={new Date()} />
                </div>
              </Popper>
            </StyledTableCell>
            <StyledTableCell align="center">Punch In</StyledTableCell>
            <StyledTableCell align="center">Punch Out</StyledTableCell>
            <StyledTableCell align="center">Break</StyledTableCell>
            <StyledTableCell align="center">Over time</StyledTableCell>
          </TableRow>
          {noRecordsMessage && rows.length==0 && (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography variant="body2" color="error">{noRecordsMessage}</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.id} onClick={() => handleRowClick(row)} sx={{ cursor: "pointer" }}>
              <StyledTableCell align="center">{row.employeeId}</StyledTableCell>
              <StyledTableCell align="center">{row.employeeName}</StyledTableCell>
              <StyledTableCell align="center">{row.email}</StyledTableCell>
              <StyledTableCell align="center">{row.date}</StyledTableCell>
              <StyledTableCell align="center">{row.firstPunchIn}</StyledTableCell>
              <StyledTableCell align="center">{row.lastPunchOut}</StyledTableCell>
              <StyledTableCell align="center">{row.break}</StyledTableCell>
              <StyledTableCell align="center">{row.overTime}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      </Box>
  );
};

export default EmployeeAttendance;
