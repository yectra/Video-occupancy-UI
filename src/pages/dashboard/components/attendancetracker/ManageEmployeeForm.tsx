import React, { useEffect, useState } from "react";
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
import BaseButton from "@/common/components/controls/BaseButton";
import { AttendanceDetails } from "../../services/attendancetracker";
import { ManageEmployeeDetails } from "../../models/attendancetracker";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: { backgroundColor: theme.palette.common.black, color: theme.palette.common.white },
  [`&.${tableCellClasses.body}`]: { fontSize: 14 },
  borderRight: `1px solid ${theme.palette.divider}`,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover },
}));

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
  const [searchTerm, setSearchTerm] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [employeeForm, setEmployeeForm] = useState<ManageEmployeeDetails[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<ManageEmployeeDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const attendanceDetails = new AttendanceDetails();

  useEffect(() => {
    setLoading(true);
    attendanceDetails
      .getManageEmployeeDetails()
      .then((response) => {
        setEmployeeForm(response);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedEmployee(null);
  };

  const handleEditClick = (employee: ManageEmployeeDetails) => {
    setSelectedEmployee(employee);
    setEditDialogOpen(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSelectedEmployee((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleRoleChange = (event: React.ChangeEvent<{ value: string }>) => {
    const { value } = event.target;
    setSelectedEmployee((prev) => prev ? { ...prev, role: value  } : null);
  };

  const handleSave = () => {
    if (selectedEmployee) {
      setLoading(true);
     
    }
  };

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
              onChange={handleSearch}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
              endAdornment={
                searchTerm && (
                  <InputAdornment position="end">
                    <IconButton edge="end" size="large" onClick={() => setSearchTerm("")}>
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
              {employeeForm.map((row) => (
                <StyledTableRow key={row.employeeId}>
                  <StyledTableCell>{row.employeeId}</StyledTableCell>
                  <StyledTableCell align="center">{row.employeeName}</StyledTableCell>
                  <StyledTableCell align="center">{row.dateOfJoining}</StyledTableCell>
                  <StyledTableCell align="center">{row.role}</StyledTableCell>
                  <StyledTableCell align="center">{row.email}</StyledTableCell>
                  <StyledTableCell align="center">
                    <BaseButton variant="text" color="primary" onClick={() => handleEditClick(row)}>
                      EDIT
                    </BaseButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog open={editDialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogContent>
            {selectedEmployee && (
              <>
                <DialogTextField
                  label="Employee Id"
                  value={selectedEmployee.employeeId}
                  name="employeeId"
                  disabled
                />
                <DialogTextField
                  label="Name"
                  value={selectedEmployee.employeeName}
                  name="employeeName"
                  onChange={handleInputChange}
                />
                <DialogTextField
                  label="Date of Joining"
                  value={selectedEmployee.dateOfJoining}
                  name="dateOfJoining"
                  onChange={handleInputChange}
                />
                <DialogTextField
                  label="Role"
                  value={selectedEmployee.role}
                  name="role"
                  onChange={handleRoleChange}
                  select
                >
                  <MenuItem value="Employee">Employee</MenuItem>
                  <MenuItem value="Manager">Manager</MenuItem>
                  <MenuItem value="Manager">Developer</MenuItem>
                </DialogTextField>
                <DialogTextField
                  label="Mail Id"
                  value={selectedEmployee.email}
                  name="email"
                  disabled
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <BaseButton onClick={handleDialogClose} color="primary">
              Cancel
            </BaseButton>
            <BaseButton onClick={handleSave} color="primary" disabled={loading}>
            Save
            </BaseButton>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default ManageEmployeeForm;
