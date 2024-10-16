import React, { useEffect, useState, useCallback } from "react";
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
  Button,
  Avatar,
} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon, Close as CloseIcon } from "@mui/icons-material";
import { AttendanceDetails } from "@/pages/dashboard/services/attendancetracker";
import { ManageEmployeeDetails } from "@/pages/dashboard/models/attendancetracker";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: { fontSize: 14 },
  borderRight: `1px solid ${theme.palette.divider}`,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover },
}));

const DialogTextField = ({
  label,
  value,
  name,
  onChange,
  disabled = false,
  select = false,
  children,
}: any) => (
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
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [employeeForm, setEmployeeForm] = useState<ManageEmployeeDetails[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<ManageEmployeeDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string>(""); 
  const attendanceDetails = new AttendanceDetails();

  const fetchEmployeeDetails = useCallback(() => {
    setLoading(true);
    attendanceDetails
      .getManageEmployeeDetails()
      .then(setEmployeeForm)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchEmployeeDetails();
  }, [fetchEmployeeDetails]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(event.target.value);

  const handleDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedEmployee(null);
  };

  const handleImageDialogClose = () => {
    setImageDialogOpen(false);
    setImageUrl(null);
    setNewImage(null);
    setImageBase64(""); // Reset Base64 when closing
  };

  const handleEditClick = (employee: ManageEmployeeDetails) => {
    setSelectedEmployee(employee);
    setEditDialogOpen(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSelectedEmployee((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleRoleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedEmployee((prev) =>
      prev ? { ...prev, role: event.target.value as string } : null
    );
  };

  const handleSave = () => {
    if (selectedEmployee) {
      setLoading(true);
      attendanceDetails
        .updateEmployeeDetails(selectedEmployee)
        .then(() => {
          fetchEmployeeDetails();
          handleDialogClose();
        })
        .catch((error) =>
          console.error("Error updating employee details:", error)
        )
        .finally(() => setLoading(false));
    }
  };

  const handleDelete = () => {
    if (selectedEmployee) {
      setLoading(true);
      attendanceDetails
        .deleteEmployeeDetails(selectedEmployee.employeeId)
        .then(() => {
          fetchEmployeeDetails();
          handleDialogClose();
        })
        .catch((error) => console.error("Error deleting employee:", error))
        .finally(() => setLoading(false));
    }
  };

  const handleAvatarClick = (employee :ManageEmployeeDetails) => {
    setSelectedEmployee(employee)
    setImageUrl(employee.imageUrl || "");
    setImageDialogOpen(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewImage(file); 
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string); // Store Base64 image
        setImageUrl(reader.result as string)
      };
      reader.readAsDataURL(file);
    
    }
  };

  const handleImageSave = () => {
    if (newImage && imageBase64 && selectedEmployee) {
      console.log("Sending Base64 image to the backend:", imageBase64);
      const data = {
        employeeId: selectedEmployee?.employeeId,
        newImageBase64: imageBase64, 
      };
      setLoading(true);
      attendanceDetails
        .updateEmployeeDetails(data)
        .then(() => {
          fetchEmployeeDetails();
          handleDialogClose();
        })
        .catch((error) =>
          console.error("Error updating employee details:", error)
        )
        .finally(() => setLoading(false));
    

      handleImageDialogClose(); 
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
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
              {["Employee Id", "Profile", "Name", "Date of Joining", "Role", "Mail Id", "Action"].map(
                (header) => (
                  <StyledTableCell key={header} align={header === "Employee Id" ? "left" : "center"}>
                    {header}
                  </StyledTableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {employeeForm.map((row) => (
              <StyledTableRow key={row.employeeId}>
                <StyledTableCell align="center">{row.employeeId}</StyledTableCell>
                <StyledTableCell align="center">
                  <Box
                    sx={{ display: "flex", justifyContent: "center", cursor: "pointer" }}
                    onClick={() => handleAvatarClick(row)}
                  >
                    <Avatar alt={row.employeeName} src={row.imageUrl} sx={{ width: 45, height: 45 }} />
                  </Box>
                </StyledTableCell>
                <StyledTableCell align="center">{row.employeeName}</StyledTableCell>
                <StyledTableCell align="center">{row.dateOfJoining}</StyledTableCell>
                <StyledTableCell align="center">{row.role}</StyledTableCell>
                <StyledTableCell align="center">{row.email}</StyledTableCell>
                <StyledTableCell align="center">
                  <Button variant="text" color="primary" onClick={() => handleEditClick(row)}>
                    EDIT
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={editDialogOpen} onClose={handleDialogClose}>
        <DialogTitle sx={{ fontWeight: "bold" }}>Edit Employee</DialogTitle>
        <DialogContent>
          {selectedEmployee && (
            <>
              <DialogTextField label="Employee Id" value={selectedEmployee.employeeId} name="employeeId" disabled />
              <DialogTextField label="Name" value={selectedEmployee.employeeName} name="employeeName" onChange={handleInputChange} />
              <DialogTextField label="Date of Joining" value={selectedEmployee.dateOfJoining} name="dateOfJoining" onChange={handleInputChange} />
              <DialogTextField label="Role" value={selectedEmployee.role} name="role" onChange={handleRoleChange} select>
                <MenuItem value="Employee">Employee</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
              </DialogTextField>
              <DialogTextField label="Mail Id" value={selectedEmployee.email} name="email" disabled />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" sx={{ bgcolor: "red" }} onClick={handleDelete}>
            Remove
          </Button>
          <Button variant="outlined" onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button variant="outlined" onClick={handleSave} color="primary" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={imageDialogOpen} onClose={handleImageDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <IconButton aria-label="close" onClick={handleImageDialogClose} sx={{ position: "absolute", right: 2, top: 4, color: "red" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {imageUrl && (
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <img src={imageUrl} alt="Profile" style={{ maxWidth: "100%", height: "300px" }} />
              <Button sx={{ mt: 2 }} variant="contained" component="label">
                Change profile picture
                <input type="file" accept="image/*" hidden onChange={handleFileChange} />
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleImageSave} disabled={!imageBase64}>
            Save Image
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageEmployeeForm;
