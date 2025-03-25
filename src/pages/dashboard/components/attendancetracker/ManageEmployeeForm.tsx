import React, { useEffect, useState, useCallback } from "react";
import { debounce } from 'lodash';
import { styled, Box, Typography, IconButton, InputAdornment, InputBase, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableBody, TableCell, tableCellClasses, TableHead, TableRow, MenuItem, Button, Avatar, CircularProgress, Backdrop } from "@mui/material";
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
  error,
  helperText,
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
    error={error}
    helperText={helperText}
  >
    {children}
  </TextField>
);

const ManageEmployeeForm: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  // const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [employeeForm, setEmployeeForm] = useState<ManageEmployeeDetails[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<ManageEmployeeDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string>("");
  const [noUserFound, setNoUserFound] = useState(false);
  const [isDisable, setIsDisable] = useState<boolean>(false)
  const [emailError, setEmailError] = useState<string>("");
  const attendanceDetails = new AttendanceDetails();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const openConfirmDialog = () => setConfirmDialogOpen(true);
  const closeConfirmDialog = () => setConfirmDialogOpen(false);

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
    []
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedEmployee(null);
    setImageUrl(null);
    setNewImage(null);
    setImageBase64("");
  };

  // const handleImageDialogClose = () => {
  //   setImageDialogOpen(false);
  //   setImageUrl(null);
  //   setNewImage(null);
  //   setImageBase64("");
  // };

  const handleEditClick = (employee: ManageEmployeeDetails) => {
    // setSelectedEmployee(employee)    
    // setImageDialogOpen(true);
    setSelectedEmployee(employee);
    setImageUrl(employee.imageUrl || "");
    setEditDialogOpen(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSelectedEmployee((prev) => (prev ? { ...prev, [name]: value } : null));
    if (name == 'email' && !validateEmail(value)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const handleRoleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedEmployee((prev) =>
      prev ? { ...prev, role: event.target.value as string } : null
    );
  };

  const handleSave = () => {
    if (selectedEmployee) {
      if (newImage && imageBase64)
        selectedEmployee.newImageBase64 = imageBase64;
     
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
    closeConfirmDialog();

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

  // const handleAvatarClick = (employee: ManageEmployeeDetails) => {
  //   setSelectedEmployee(employee)
  //   setImageUrl(employee.imageUrl || "");
  //   setImageDialogOpen(true);
  // };

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

  // const handleImageSave = () => {
  //   if (newImage && imageBase64 && selectedEmployee) {
  //     console.log("Sending Base64 image to the backend:", imageBase64);
  //     const data = {
  //       employeeId: selectedEmployee?.employeeId,
  //       newImageBase64: imageBase64,
  //     };
  //     setLoading(true);
  //     attendanceDetails
  //       .updateEmployeeDetails(data)
  //       .then(() => {
  //         fetchEmployeeDetails();
  //         handleDialogClose();
  //       })
  //       .catch((error) =>
  //         console.error("Error updating employee details:", error)
  //       )
  //       .finally(() => setLoading(false));
  //     handleImageDialogClose();
  //   }
  // };

  const validateEmail = (email: any): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  useEffect(() => {
    fetchEmployeeDetails();
  }, []);

  useEffect(() => {
    if (!selectedEmployee?.email || !selectedEmployee.employeeName || !selectedEmployee.role || emailError)
      setIsDisable(true)
    else
      setIsDisable(false)
  }, [handleInputChange])


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
          User Registry
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
                  <IconButton edge="end" size="large" onClick={() => {
                    setSearchTerm("")
                    fetchEmployeeDetails()
                  }}>
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
            <CircularProgress color={"primary"} />
          </Backdrop>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                {["ID", "PROFILE", "NAME", "ROLE", "EMAIL", "EDIT"].map(
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
                    <Box sx={{ display: "flex", justifyContent: "center", cursor: "pointer" }} >
                      <Avatar alt={row.employeeName} src={row.imageUrl} sx={{ width: 50, height: 50 }} />
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.employeeName}</StyledTableCell>
                  <StyledTableCell align="center">{row.role}</StyledTableCell>
                  <StyledTableCell align="center">{row.email}</StyledTableCell>
                  <StyledTableCell align="center">
                    <IconButton sx={{ bgcolor: "#00D1A3", color: "white", '&:hover': { bgcolor: "#00A387" } }} onClick={() => handleEditClick(row)}>
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
        <Box sx={{ textAlign: 'center' }}>
          <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.4rem' }}>Edit User</DialogTitle>
          <DialogTitle>Profile Picture</DialogTitle>
        </Box>
        <DialogContent>
          <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
            <Avatar
              src={imageUrl || undefined}
              alt="Employee Image"
              sx={{ width: 100, height: 100, margin: '0 auto' }}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
            <Button
              variant="contained"
              component="label"
              sx={{ fontSize: '0.75rem', padding: '5px 10px', minWidth: 'auto' }} // Reducing size
            >
              Upload New Image
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
          </Box>
        </DialogContent>
        <DialogContent>
          <DialogTextField
            label="User ID *"
            value={selectedEmployee?.employeeId || ""}
            name="employeeId"
            onChange={handleInputChange}
            disabled
          />
          <DialogTextField
            label="Name *"
            value={selectedEmployee?.employeeName || ""}
            name="employeeName"
            onChange={handleInputChange}
          />
          <DialogTextField
            label="Email *"
            value={selectedEmployee?.email || ""}
            name="email"
            onChange={handleInputChange}
            error={!!emailError}
            helperText={emailError}
          />
          <DialogTextField
            label="Role *"
            value={selectedEmployee?.role || ""}
            name="role"
            onChange={handleRoleChange}
            select
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Employee">Employee</MenuItem>
          </DialogTextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { openConfirmDialog(); }} color="error">
            <Typography>Delete</Typography>
          </Button>
          <Button onClick={handleDialogClose}><Typography>Cancel</Typography></Button>
          <Button disabled={isDisable} color="primary" onClick={handleSave}>
            <Typography>Save</Typography>
          </Button>
        </DialogActions>
      </Dialog>

      {/* <Dialog open={imageDialogOpen} onClose={handleImageDialogClose}>
        <DialogTitle>Profile Picture</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
            <Avatar
              src={imageUrl || undefined}
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
            <Typography>Upload New Image</Typography>
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
            <Typography>Cancel</Typography>
          </Button>
          <Button onClick={handleImageSave} color="primary">
            <Typography>Save</Typography>
          </Button>
        </DialogActions>
      </Dialog> */}

      <Dialog open={confirmDialogOpen} onClose={closeConfirmDialog}>
        <DialogTitle sx={{ bgcolor: "green", color: "white" }}>Confirm</DialogTitle>
        <DialogContent>
          <Typography sx={{ pt: 2 }}>
            Are you sure want to delete {selectedEmployee?.employeeName}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog} color="primary">
            <Typography>Cancel</Typography>
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
          >
            <Typography>Delete</Typography>
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageEmployeeForm;
