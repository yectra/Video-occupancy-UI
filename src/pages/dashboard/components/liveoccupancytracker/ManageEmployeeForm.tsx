import * as React from "react";
import {
  styled,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  InputBase,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  CircularProgress,
  Container,
} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import BaseButton from "@/components/controls/BaseButton";

interface Row {
  id: number;
  dateOfJoining: string;
  name: string;
  role: string;
  email: string;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: { backgroundColor: theme.palette.common.black, color: theme.palette.common.white },
  [`&.${tableCellClasses.body}`]: { fontSize: 14 },
  borderRight: `1px solid ${theme.palette.divider}`,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover },
}));

const initialRows: Row[] = [
  { id: 1840, dateOfJoining: "21/04/2021", name: "Henry", role: "Employee", email: "henry@gmail.com" },
  { id: 1841, dateOfJoining: "21/04/2021", name: "Charlie", role: "Employee", email: "charlie@gmail.com" },
  { id: 1842, dateOfJoining: "21/04/2021", name: "Alexander", role: "Employee", email: "alexander@gmail.com" },
  { id: 1843, dateOfJoining: "21/04/2021", name: "William", role: "Employee", email: "william@gmail.com" },
  { id: 1844, dateOfJoining: "21/04/2021", name: "Oliver", role: "Employee", email: "oliver@gmail.com" },
  { id: 1845, dateOfJoining: "21/04/2021", name: "George", role: "Employee", email: "george@gmail.com" },
  { id: 1846, dateOfJoining: "21/04/2021", name: "Noah", role: "Employee", email: "noah@gmail.com" },
  { id: 1847, dateOfJoining: "21/04/2021", name: "Jack", role: "Employee", email: "jack@gmail.com" },
  { id: 1848, dateOfJoining: "21/04/2021", name: "James", role: "Employee", email: "james@gmail.com" },
  { id: 1849, dateOfJoining: "21/04/2021", name: "Bexley", role: "Employee", email: "bexley@gmail.com" },
];

const DialogTextField = ({ label, value, name, onChange, disabled = false, select = false, children }: any) => (
  <TextField
    margin="dense"
    label={label}
    type="text"
    fullWidth
    name={name}
    value={value}
    onChange={onChange}
    disabled={disabled}
    select={select}
  >
    {children}
  </TextField>
);

const ManageEmployeeForm: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = React.useState<Row | null>(null);
  const [rows, setRows] = React.useState<Row[]>(initialRows);
  const [loading, setLoading] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);
  const handleClearSearch = () => setSearchTerm("");
  const handleEditClick = (employee: Row) => {
    setSelectedEmployee(employee);
    setEditDialogOpen(true);
  };
  const handleDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedEmployee(null);
  };
  const handleSave = () => {
    setLoading(true);
    if (selectedEmployee) {
      setRows((prev) =>
        prev.map((row) => (row.id === selectedEmployee.id ? selectedEmployee : row))
      );
      handleDialogClose();
    }
    setLoading(false);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedEmployee((prev) => (prev ? { ...prev, [name]: value } : prev));
  };
  const handleRoleChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const value = e.target.value as string;
    setSelectedEmployee((prev) => (prev ? { ...prev, role: value } : prev));
  };

  const filteredRows = rows.filter((row) =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase()) || row.id.toString().includes(searchTerm.trim())
  );

  return (
    <Container>
      <Box sx={{ padding: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography sx={{ fontWeight: "bold", color: "#1C214F" }} variant="h5">
            Employee Registry
          </Typography>
          <Box sx={{ position: "relative", width: "350px" }}>
            <InputBase
              placeholder="Search"
              value={searchTerm}
              onChange={handleChange}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
              endAdornment={
                searchTerm && (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={handleClearSearch} size="large">
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }
              sx={{
                borderRadius: "8px",
                border: "2px solid #ccc",
                padding: "6px 10px",
                width: "100%",
                "&:hover": { borderColor: "#888" },
              }}
            />
          </Box>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Employee Id</StyledTableCell>
                <StyledTableCell align="center">Name</StyledTableCell>
                <StyledTableCell align="center">Date of Joining</StyledTableCell>
                <StyledTableCell align="center">Role</StyledTableCell>
                <StyledTableCell align="center">Mail Id</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows.map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell>{row.id}</StyledTableCell>
                    <StyledTableCell align="center">{row.name}</StyledTableCell>
                    <StyledTableCell align="center">{row.dateOfJoining}</StyledTableCell>
                    <StyledTableCell align="center">{row.role}</StyledTableCell>
                    <StyledTableCell align="center">{row.email}</StyledTableCell>
                    <StyledTableCell align="center">
                      <BaseButton variant="text" color="primary" onClick={() => handleEditClick(row)}>
                        EDIT
                      </BaseButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog open={editDialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogContent>
            {selectedEmployee && (
              <>
                <DialogTextField label="Employee Id" value={selectedEmployee.id} name="id" onChange={handleInputChange} disabled />
                <DialogTextField label="Name" value={selectedEmployee.name} name="name" onChange={handleInputChange} />
                <DialogTextField label="Date of Joining" value={selectedEmployee.dateOfJoining} name="dateOfJoining" onChange={handleInputChange} />
                <DialogTextField label="Role" value={selectedEmployee.role} name="role" onChange={handleRoleChange} select>
                  <MenuItem value="Employee">Employee</MenuItem>
                  <MenuItem value="Manager">Manager</MenuItem>
                </DialogTextField>
                <DialogTextField label="Mail Id" value={selectedEmployee.email} name="email" onChange={handleInputChange} disabled />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <BaseButton onClick={handleDialogClose} color="primary">
              Cancel
            </BaseButton>
            <BaseButton onClick={handleSave} color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "Save"}
            </BaseButton>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default ManageEmployeeForm;
