import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { Table, TableBody, TableCell, TableHead, TableRow, Box, Typography, InputAdornment, IconButton, tableCellClasses, InputBase, Backdrop, CircularProgress, Popover, Button, Select, MenuItem, TableContainer, TablePagination } from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import { AttendanceTracker } from "@/pages/dashboard/services/attendancetracker";
import { debounce } from "lodash";
import { DateRange } from "react-date-range";
import { format } from 'date-fns';
import "react-calendar/dist/Calendar.css";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import "react-datepicker/dist/react-datepicker.css";
import { employeeAttendanceResponse } from "../../models/attendancetracker";

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
  const navigate = useNavigate();
  const location = useLocation();
  const pageSize: number = 10;
  const [rows, setRows] = useState<employeeAttendanceResponse>(new employeeAttendanceResponse());
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [noRecordsMessage, setNoRecordsMessage] = useState<string | null>(null);
  const [filterOption, setFilterOption] = useState<string>("today");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const customButtonRef = React.useRef<HTMLDivElement | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(pageSize);

  const attendanceDetails = new AttendanceTracker();

  useEffect(() => {
    if (location.state && location.state.filterOption)
      setFilterOption(location.state.filterOption);

    let value: any;
    if (location.state && location.state.filterOption === 'custom')
      value = {
        start_date: location.state.start_date,
        end_date: location.state.end_date,
        page_number: 1,
        page_size: rowsPerPage
      }
    else value = {
      period: (location.state && location.state.filterOption) ? location.state.filterOption : 'today',
      page_number: 1,
      page_size: rowsPerPage
    }
    fetchAttendanceRecords(value);
  }, [location.state]);


  const handleChangePage = (event: unknown, newPage: number) => {
    console.log('event', event)
    setPage(newPage);
    let value: any;
    if (filterOption === 'custom') {
      value = {
        start_date: dateRange[0] ? format(dateRange[0], 'yyyy-MM-dd') : '',
        end_date: dateRange[1] ? format(dateRange[1], 'yyyy-MM-dd') : '',
        page_number: newPage + 1,
        page_size: rowsPerPage
      }
    } else {
      value = {
        period: filterOption,
        page_number: newPage + 1,
        page_size: rowsPerPage
      }
    }
    fetchAttendanceRecords(value);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    let value: any;
    if (filterOption === 'custom') {
      value = {
        start_date: dateRange[0] ? format(dateRange[0], 'yyyy-MM-dd') : '',
        end_date: dateRange[1] ? format(dateRange[1], 'yyyy-MM-dd') : '',
        page_number: 1,
        page_size: parseInt(event.target.value, 10)
      }
    } else {
      value = {
        period: filterOption,
        page_number: 1,
        page_size: parseInt(event.target.value, 10)
      }
    }
    fetchAttendanceRecords(value);
  };

  const fetchAttendanceRecords = (value: any) => {
    setLoading(true);
    attendanceDetails.getAllEmployeeAttendanceDetails(value)
      .then((response: any) => {
        if (Array.isArray(response.data)) {
          // const filteredRows = response.data;
          setRows(response);
          setNoRecordsMessage(response.data.length ? null : "No records found.");
        } else if (response?.message) {
          setNoRecordsMessage(response.message);
        } else {
          setNoRecordsMessage("Unexpected response format.");
        }
      })
      .catch(() => setError("Failed to fetch data."))
      .finally(() => setLoading(false));
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      let request: any;
      if (filterOption === 'custom') {
        request = {
          start_date: dateRange[0] ? format(dateRange[0], 'yyyy-MM-dd') : '',
          end_date: dateRange[1] ? format(dateRange[1], 'yyyy-MM-dd') : '',
          page_number: page + 1,
          page_size: rowsPerPage
        }
      } else {
        request = {
          period: filterOption,
          page_number: page + 1,
          page_size: rowsPerPage
        }
      }
      if (value) {
        const data = {
          ...request,
          search: value
        }
        attendanceDetails.searchEmployeeDetails(data)
          .then((response: any) => {
            // const filteredRows = response.data;
            setRows(response);
            setNoRecordsMessage(response.data.length ? null : "No records found.");
          })
          .catch(err => {
            console.log(err);
            setNoRecordsMessage("No user found");
          });
      } else {
        fetchAttendanceRecords(request);
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
    if (filterOption === 'custom') {
      navigate(`/dashboard/attendance/attendance-details?date=${row.date}&id=${row.employeeId}`, {
        state: {
          filterOption,
          start_date: dateRange[0] ? format(dateRange[0], 'yyyy-MM-dd') : '',
          end_date: dateRange[1] ? format(dateRange[1], 'yyyy-MM-dd') : '',
        },
      });
    }
    else {
      navigate(`/dashboard/attendance/attendance-details?date=${row.date}&id=${row.employeeId}`, {
        state: {
          filterOption,
        },
      });
    }
  };

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
        period: value,
        page_number: page + 1,
        page_size: rowsPerPage
      }
      handleDateChange(data)
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
        end_date: format(dateRange[1], 'yyyy-MM-dd'),
        page_number: page + 1,
        page_size: rowsPerPage
      }

      handleDateChange(value)
    }
  };

  const handleDateChange = (value: any) => {
    setLoading(true);
    attendanceDetails.getAllEmployeeAttendanceDetails(value)
      .then((response: any) => {
        if (Array.isArray(response.data)) {
          // const filteredRows = response.data;
          setRows(response);
          setNoRecordsMessage(response.data.length ? null : "No records found.");
        } else {
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

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", my: 2 }}>
        <Typography sx={{ fontWeight: "bold", color: "#1C214F", p: 2 }} variant="h5">
          Attendance List
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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

          <Box sx={{ width: 170 }}>
            <InputBase
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              startAdornment={
                <InputAdornment position="start"><SearchIcon /></InputAdornment>
              }
              endAdornment={searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small"
                    onClick={() => {
                      setSearchTerm("");
                      let request: any;
                      if (filterOption === 'custom') {
                        request = {
                          start_date: dateRange[0] ? format(dateRange[0], 'yyyy-MM-dd') : '',
                          end_date: dateRange[1] ? format(dateRange[1], 'yyyy-MM-dd') : '',
                          page_number: page + 1,
                          page_size: rowsPerPage
                        }
                      } else {
                        request = {
                          period: filterOption,
                          page_number: page + 1,
                          page_size: rowsPerPage
                        }
                      }
                      fetchAttendanceRecords(request);
                    }}
                  >
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

      <TableContainer>
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
            {noRecordsMessage && rows.data.length == 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="error">{noRecordsMessage}</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableHead>
          <TableBody>
            {Array.isArray(rows?.data) && rows.data.map((row) => (
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
      </TableContainer>
      {rows.total_records ? <TablePagination
        rowsPerPageOptions={[pageSize, pageSize * 2, pageSize * 3, pageSize * 4, pageSize * 5]}
        component="div"
        count={rows.total_records || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> : null}
    </Box>
  );
};

export default EmployeeAttendance;
