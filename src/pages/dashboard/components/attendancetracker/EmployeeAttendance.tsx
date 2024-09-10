import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  InputBase,
  InputAdornment,
  IconButton,

  tableCellClasses,
} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";

import { AttendanceDetails } from "../../services/attendancetracker";

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
  const [error, _setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const attendanceDetails = new AttendanceDetails();

  useEffect(() => {
    setLoading(true);
    attendanceDetails
      .getAllEmployeeAttendanceDetails()
      .then((response) => {
        console.log(response);
        setRows(response);
        console.log(rows)
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(event.target.value);

  const handleRowClick = (row: any) => {
    navigate(`/dashboard/attendance/emp-details?name=${row.employee_Name}&id=${row.employee_Id}`);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>{error}</Typography>;
  }

  return (

      <TableContainer component={Paper}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <Typography
            sx={{ fontWeight: "bold", color: "#1C214F", p: 2 }}
            variant="h5"
          >
            Attendance List
          </Typography>
          <Box sx={{ width: "350px", marginRight: 3 }}>
            <InputBase
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
              endAdornment={
                searchTerm && (
                  <InputAdornment position="end">
                    <IconButton edge="end" size="large">
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }
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
              <StyledTableCell>Employee Id</StyledTableCell>
              <StyledTableCell align="center">Name</StyledTableCell>
              <StyledTableCell align="center">Email</StyledTableCell>
              <StyledTableCell align="center">Date</StyledTableCell>
              <StyledTableCell align="center">Punch In</StyledTableCell>
              <StyledTableCell align="center">Punch Out</StyledTableCell>
              <StyledTableCell align="center">Break</StyledTableCell>
              <StyledTableCell align="center">Over time</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow
                key={row.id}
                onClick={() => handleRowClick(row)}
                sx={{ cursor: "pointer" }}
              >
                <StyledTableCell component="th" scope="row">
                  {row.employee_Id}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.employee_Name}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.email}
                </StyledTableCell>

                <StyledTableCell align="center">10/09/2024</StyledTableCell>
                <StyledTableCell align="center">{row.punchIn}</StyledTableCell>
                <StyledTableCell align="center">
                  {row.punchOut ? row.punchOut : "-"}
                </StyledTableCell>
                <StyledTableCell align="center">{row.break}</StyledTableCell>
                <StyledTableCell align="center">{row.overTime}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
   
  );
};

export default EmployeeAttendance;
