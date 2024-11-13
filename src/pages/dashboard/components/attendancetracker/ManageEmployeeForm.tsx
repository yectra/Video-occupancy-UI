import React, { useEffect, useState, useCallback } from "react";
import { debounce } from 'lodash';
import {styled,Box,Typography,IconButton,InputAdornment,InputBase,Dialog,DialogTitle,DialogContent,DialogActions,TextField,Table,TableBody,TableCell,tableCellClasses,TableHead,TableRow,MenuItem,Button,Avatar,CircularProgress,Backdrop} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
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
  const [noUserFound, setNoUserFound] = useState(false);  
  const attendanceDetails = new AttendanceDetails();

  const fetchEmployeeDetails = useCallback(() => {
    setLoading(true);
    attendanceDetails
      .getManageEmployeeDetails()
      .then((response) => {
        setEmployeeForm(response);
        setNoUserFound(response.length === 0);  
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchEmployeeDetails();
  }, [fetchEmployeeDetails]);

  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      if (searchValue) {
        attendanceDetails.searchAllEmployeeDetails(searchValue)
          .then((response) => {
            setEmployeeForm(response);
            setNoUserFound(response.length === 0); 
          })
          .catch((error) => console.error("Error fetching search results:", error));
      } else {
        fetchEmployeeDetails(); 
      }
    }, 300), 
    [attendanceDetails, fetchEmployeeDetails]
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    debouncedSearch(value);

  };

  const handleDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedEmployee(null);
  };

  const handleImageDialogClose = () => {
    setImageDialogOpen(false);
    setImageUrl(null);
    setNewImage(null);
    setImageBase64(""); 
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

  const handleAvatarClick = (employee: ManageEmployeeDetails) => {
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
        setImageBase64(reader.result as string); 
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

      {noUserFound ? (
        <Box sx={{ textAlign: "center", marginTop: 4 }}>
          <Typography variant="h6" color="textSecondary">
            No user found
          </Typography>
        </Box>
      ) : (
        <Box>
          <Backdrop open={loading} style={{ zIndex: 9999, color: "#fff" }}>
        <CircularProgress color={"primary"}/>
      </Backdrop>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                {["ID", "PROFILE", "NAME", "DATE OF JOINING", "ROLE", "EMAIL", "EDIT"].map(
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
                      <Avatar alt={row.employeeName} src={row.imageUrl} sx={{ width: 50, height: 50 }} />
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.employeeName}</StyledTableCell>
                  <StyledTableCell align="center">{row.dateOfJoining}</StyledTableCell>
                  <StyledTableCell align="center">{row.role}</StyledTableCell>
                  <StyledTableCell align="center">{row.email}</StyledTableCell>
                  <StyledTableCell align="center">
                    <IconButton sx={{ bgcolor: "#00D1A3", color: "white",'&:hover':{bgcolor:"#00A387"} }} onClick={() => handleEditClick(row)}>
                      <EditOutlinedIcon />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
          </Box>
      )}
      {noUserFound && (
   <Typography variant="body2" color="error">{noUserFound}</Typography>
)}


      <Dialog open={editDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent>
          <DialogTextField
            label="Employee ID"
            value={selectedEmployee?.employeeId || ""}
            name="employeeId"
            onChange={handleInputChange}
            disabled
          />
          <DialogTextField
            label="Name"
            value={selectedEmployee?.employeeName || ""}
            name="employeeName"
            onChange={handleInputChange}
          />
          <DialogTextField
            label="Email"
            value={selectedEmployee?.email || ""}
            name="email"
            onChange={handleInputChange}
          />
          <DialogTextField
            label="Date of Joining"
            value={selectedEmployee?.dateOfJoining || ""}
            name="dateOfJoining"
            onChange={handleInputChange}
            disabled
          />
          <DialogTextField
            label="Role"
            value={selectedEmployee?.role || ""}
            name="role"
            onChange={handleRoleChange}
            select
          >
            <MenuItem value="Manager">Manager</MenuItem>
            <MenuItem value="Employee">Employee</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
          </DialogTextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={imageDialogOpen} onClose={handleImageDialogClose}>
        <DialogTitle>Profile Picture</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
            <Avatar
              src={imageUrl||undefined}
              alt="Employee Image"
              sx={{ width: 100, height: 100, margin: '0 auto' }}
            />
          </Box>
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ marginBottom: 2 }}
          >
            Upload New Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleImageDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleImageSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageEmployeeForm;
