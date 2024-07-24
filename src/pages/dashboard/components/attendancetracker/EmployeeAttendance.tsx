import React from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Box, Typography, InputBase, InputAdornment, IconButton, Container, tableCellClasses
} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";

interface Row {
  id: number;
  date: string;
  name: string;
  punchIn: string;
  punchOut: string;
  break: string;
  overTime: string;
}

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

const rows: Row[] = [
  { id: 1840, date: "21/04/2021", name: "Henry", punchIn: "8AM", punchOut: "5:30 PM", break: "1hrs", overTime: "2hrs" },
  { id: 1841, date: "21/04/2021", name: "Charlie", punchIn: "8AM", punchOut: "5:30 PM", break: "1hrs", overTime: "1hrs" },
  { id: 1842, date: "21/04/2021", name: "Alexander", punchIn: "8AM", punchOut: "5:30 PM", break: "1hrs", overTime: "3hrs" },
  { id: 1843, date: "21/04/2021", name: "William", punchIn: "8AM", punchOut: "5:30 PM", break: "1hrs", overTime: "0hrs" },
  { id: 1844, date: "21/04/2021", name: "Oliver", punchIn: "8AM", punchOut: "5:30 PM", break: "1hrs", overTime: "0hrs" },
  { id: 1845, date: "21/04/2021", name: "George", punchIn: "8AM", punchOut: "5:30 PM", break: "1hrs", overTime: "1hrs" },
  { id: 1846, date: "21/04/2021", name: "Noah", punchIn: "8AM", punchOut: "5:30 PM", break: "1hrs", overTime: "3hrs" },
  { id: 1847, date: "21/04/2021", name: "Jack", punchIn: "8AM", punchOut: "5:30 PM", break: "1hrs", overTime: "1hrs" },
  { id: 1848, date: "21/04/2021", name: "James", punchIn: "8AM", punchOut: "5:30 PM", break: "1hrs", overTime: "2hrs" },
  { id: 1849, date: "21/04/2021", name: "Bexley", punchIn: "8AM", punchOut: "5:30 PM", break: "1hrs", overTime: "0hrs" },
];

const EmployeeAttendance: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value);
  const clearSearch = () => setSearchTerm("");
  const filteredRows = rows.filter((row) => row.name.toLowerCase().includes(searchTerm.toLowerCase()) || row.id.toString() === searchTerm.trim());

  const navigate = useNavigate();

  const handleRowClick = (row: Row) => {
    navigate(`/dashboard/attendance/emp-details?name=${row.name}&id=${row.id}`);
  };

  return (
    <Container>
      <TableContainer component={Paper}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
          <Typography sx={{ fontWeight: "bold", color: "#1C214F", p: 2 }} variant="h5">Attendance List</Typography>
          <Box sx={{ width: "350px", marginRight: 3 }}>
            <InputBase
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              startAdornment={<InputAdornment position="start"><SearchIcon /></InputAdornment>}
              endAdornment={searchTerm && (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={clearSearch} size="large"><ClearIcon /></IconButton>
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
              <StyledTableCell>Employee Id</StyledTableCell>
              <StyledTableCell align="center">Name</StyledTableCell>
              <StyledTableCell align="center">Date</StyledTableCell>
              <StyledTableCell align="center">Punch In</StyledTableCell>
              <StyledTableCell align="center">Punch Out</StyledTableCell>
              <StyledTableCell align="center">Break</StyledTableCell>
              <StyledTableCell align="center">Over time</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No records found</TableCell>
              </TableRow>
            ) : (
              filteredRows.map((row) => (
                <StyledTableRow key={row.id} onClick={() => handleRowClick(row)} sx={{ cursor: 'pointer' }}>
                  <StyledTableCell component="th" scope="row">{row.id}</StyledTableCell>
                  <StyledTableCell align="center">{row.name}</StyledTableCell>
                  <StyledTableCell align="center">{row.date}</StyledTableCell>
                  <StyledTableCell align="center">{row.punchIn}</StyledTableCell>
                  <StyledTableCell align="center">{row.punchOut}</StyledTableCell>
                  <StyledTableCell align="center">{row.break}</StyledTableCell>
                  <StyledTableCell align="center">{row.overTime}</StyledTableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default EmployeeAttendance;
