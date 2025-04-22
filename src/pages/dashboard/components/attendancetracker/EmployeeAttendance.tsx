import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { Table, TableBody, TableCell, TableHead, TableRow, Box, Typography, InputAdornment, IconButton, tableCellClasses, InputBase, Backdrop, CircularProgress, Popover, Button, Select, MenuItem } from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import "react-calendar/dist/Calendar.css";
import { AttendanceDetails } from "@/pages/dashboard/services/attendancetracker";
import { debounce } from "lodash";
import { useSearchParams } from 'react-router-dom';
import { DateRange } from "react-date-range";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';

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

interface IProps {
  date: string;
}

const EmployeeAttendance: React.FC<IProps> = ({ date }) => {
  const [rows, setRows] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [noRecordsMessage, setNoRecordsMessage] = useState<string | null>(null);
  const [filterOption, setFilterOption] = useState("Today");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const customButtonRef = React.useRef<HTMLDivElement | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const urlDate = searchParams.get('date');

  const navigate = useNavigate();
  const attendanceDetails = new AttendanceDetails();

  useEffect(() => {
    let currentDate: string = '';
    setLoading(true);
    if (urlDate) {
      setCurrentDate(urlDate);
      currentDate = urlDate;
    } else if (date) {
      setCurrentDate(date);
      currentDate = date;
    }

    const value = {
      employeeId: '',
      date: currentDate
    }

    attendanceDetails.getAllEmployeeAttendanceDetails(value)
      .then((response: any) => {
        if (Array.isArray(response.data)) {
          const filteredRows = response.data;
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
  }, [urlDate, date]);

  const fetchAttendanceRecords = useCallback(() => {
    if (currentDate) {
      const value = {
        employeeId: '',
        date: currentDate
      }
      setLoading(true);
      attendanceDetails.getAllEmployeeAttendanceDetails(value)
        .then((response: any) => {
          if (Array.isArray(response.data)) {
            const filteredRows = response.data;
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
  }, [currentDate]);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      if (value) {
        attendanceDetails.searchEmployeeDetails(currentDate || "", value)
          .then(setRows)
          .catch(err => {
            console.log(err);
            setRows([]);
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
    navigate(`/dashboard/attendance/attendance-details?date=${row.date}&id=${row.employeeId}`);
  };

  const handleFilterChange = (e: any) => {
    const value = e.target.value;
    setFilterOption(value);

    if (value === "Custom") {
      setAnchorEl(customButtonRef.current);
      setPopoverOpen(true);
    } else if(value === "Yesterday" || value === "Week" || value === "Month" || value === "Today"){
      setPopoverOpen(false);
      setAnchorEl(null);
      const data = {
        period : value.toLowerCase()       
      }
      handleDateChange(data)
    }
    customButtonRef.current = null;
  };

  const handleClosePopover = () => {
    setPopoverOpen(false);
    setAnchorEl(null);
  };

  const handleCustomChange = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("date");
    setSearchParams(newParams);

    handleClosePopover();

    if (dateRange[0] && dateRange[1] && dateRange[0] !== dateRange[1]) {
      const value =
      {
        start_date: format(dateRange[0], 'yyyy-MM-dd'),
        end_date: format(dateRange[1], 'yyyy-MM-dd')
      }

      handleDateChange(value)
    }
  };

  const handleDateChange = (value: any) => {
    setLoading(true);
    attendanceDetails.getAllEmployeeAttendanceDetails(value)
      .then((response: any) => {
        if (Array.isArray(response.data)) {
          const filteredRows = response.data;
          setRows(filteredRows);
          setNoRecordsMessage(filteredRows.length ? null : "No records found.");
        } else {
          setRows([]);
          setNoRecordsMessage("Unexpected response format.");
        }
      })
      .catch(() => setError("Failed to fetch data."))
      .finally(() => setLoading(false));
  }

  if (error) return <Typography>{error}</Typography>;

  return (
    <Box>
      <Backdrop open={loading} style={{ zIndex: 9999, color: "#fff" }}>
        <CircularProgress color={"primary"} />
      </Backdrop>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography sx={{ fontWeight: "bold", color: "#1C214F", p: 2 }} variant="h5">
          Attendance List
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box ref={customButtonRef}>
            <Select
              value={filterOption}
              onChange={handleFilterChange}
              size="small"
            >
              <MenuItem value="Today">Today</MenuItem>
              <MenuItem value="Yesterday">Yesterday</MenuItem>
              <MenuItem value="Week">This Week</MenuItem>
              <MenuItem value="Month">This Month</MenuItem>
              <MenuItem value="Custom">Custom</MenuItem>
            </Select>
          </Box>

          <Popover
            open={popoverOpen}  // Control the visibility of the Popover
            anchorEl={anchorEl}  // Anchor for the Popover
            onClose={handleClosePopover}  // Close popover
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

          <Box sx={{ width: "300px" }}>
            <InputBase
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              startAdornment={
                <InputAdornment position="start"><SearchIcon /></InputAdornment>
              }
              endAdornment={searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchTerm("")}>
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
      </Box>

      <Table sx={{ minWidth: 700, boxShadow: 3, border: "1px solid #ccc" }}>
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Employee Id</StyledTableCell>
            <StyledTableCell align="center">Name</StyledTableCell>
            <StyledTableCell align="center">Email</StyledTableCell>
            <StyledTableCell align="center">Date</StyledTableCell>
            <StyledTableCell align="center">Punch In</StyledTableCell>
            <StyledTableCell align="center">Punch Out</StyledTableCell>
            <StyledTableCell align="center">Break</StyledTableCell>
            <StyledTableCell align="center">Over time</StyledTableCell>
          </TableRow>
          {noRecordsMessage && rows.length == 0 && (
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
