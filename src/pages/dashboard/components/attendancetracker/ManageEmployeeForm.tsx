import React, { useEffect, useState, useCallback } from "react";
import { debounce } from 'lodash';
import { styled, Box, Typography, IconButton, InputAdornment, InputBase, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableBody, TableCell, tableCellClasses, TableHead, TableRow, MenuItem, Button, Avatar, CircularProgress, Backdrop } from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";

//Service
import { AttendanceDetails } from "@/pages/dashboard/services/attendancetracker";
import { OccupancyTracker } from "@/pages/dashboard/services/liveoccupancytracker";

//Models
import { ManageEmployeeDetails } from "@/pages/dashboard/models/attendancetracker";
import { ManageUserDetails, userDetails } from "../../models/liveoccupanytracker";

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
  const [userForm, setUserForm] = useState<ManageUserDetails>();
  const [selectedEmployee, setSelectedEmployee] = useState<ManageEmployeeDetails | null>(null);
  const [selectedUser, setSelectedUser] = useState<userDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string>("");
  const [noUserFound, setNoUserFound] = useState<boolean>(false);
  const [isDisable, setIsDisable] = useState<boolean>(false)
  const [emailError, setEmailError] = useState<string>("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [isEmployeePage, setIsEmployeePage] = useState<boolean>(false);

  const attendanceDetails = new AttendanceDetails();
  const occupancyTracker = new OccupancyTracker();

  const openConfirmDialog = () => setConfirmDialogOpen(true);
  const closeConfirmDialog = () => setConfirmDialogOpen(false);

  const pathName = location.pathname;

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

  const fetchUserDetails = useCallback(() => {
    setLoading(true);

    occupancyTracker.getUserDetails().then((response) => {
      setUserForm(response.data)
      setNoUserFound(response.data.users.length === 0);
    }).finally(() => setLoading(false));
  }, []);

  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      if (searchValue) {
        if (isEmployeePage) {
          setLoading(true);
          attendanceDetails.searchAllEmployeeDetails(searchValue)
            .then((response) => {
              setEmployeeForm(response);
              setNoUserFound(response.length === 0);
            })
            .catch((error) => console.error("Error fetching search results:", error))
            .finally(() => setLoading(false));
        } else {
          setLoading(true);
          occupancyTracker.searchAllUserDetails(searchValue)
            .then((response) => {
              setUserForm(response.data)
              setNoUserFound(response.data.users.length === 0);
            })
            .catch((error) => console.error("Error fetching search results:", error))
            .finally(() => setLoading(false));
        }
      } else {
        if (isEmployeePage)
          fetchEmployeeDetails();
        else
          fetchUserDetails();
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
    setSelectedUser(null);
    setImageUrl(null);
    setNewImage(null);
    setImageBase64("");
  };

  const handleEditClick = (employee: ManageEmployeeDetails) => {
    setSelectedEmployee(employee);
    setImageUrl(employee.imageUrl || "");
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (employee: ManageEmployeeDetails) => {
    setSelectedEmployee(employee);
    setImageUrl(employee.imageUrl || "");
    openConfirmDialog();
  }

  const handleUserEditClick = (user: userDetails) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleUserDeleteClick = (user: userDetails) => {
    setSelectedUser(user);
    openConfirmDialog();
  }


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    isEmployeePage ?
      setSelectedEmployee((prev) => (prev ? { ...prev, [name]: value } : null)) :
      setSelectedUser((prev) => (prev ? { ...prev, [name]: value } : null));
    if (name == 'email' && !validateEmail(value)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const handleSave = () => {
    if (isEmployeePage && selectedEmployee) {
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
    } else if (selectedUser) {
      let user: any = {
        user_id: selectedUser.id,
        role: selectedUser.role
      }
      setLoading(true);
      occupancyTracker.
        updateEmployeeDetails(user)
        .then(() => {
          fetchUserDetails();
          handleDialogClose();
        })
        .catch((error) =>
          console.error("Error updating user details:", error)
        )
        .finally(() => setLoading(false));
    }
  };

  const handleDelete = () => {
    closeConfirmDialog();
    setLoading(true);
    if (isEmployeePage && selectedEmployee) {
      attendanceDetails
        .deleteEmployeeDetails(selectedEmployee.employeeId)
        .then(() => {
          fetchEmployeeDetails();
          handleDialogClose();
        })
        .catch((error) => console.error("Error deleting employee:", error))
        .finally(() => setLoading(false));
    } else if (selectedUser) {
      let user: any = {
        user_id: selectedUser.id
      }
      occupancyTracker.deleteEmployeeDetails(user).then(() => {
        fetchUserDetails();
        handleDialogClose();
      })
        .catch((error) => console.error("Error deleting employee:", error))
        .finally(() => setLoading(false));
    }
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

  const validateEmail = (email: any): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  useEffect(() => {
    if (pathName && pathName === '/dashboard/attendance/emp-form') {
      setIsEmployeePage(true);
      fetchEmployeeDetails();
    }
    else if (pathName && pathName === '/dashboard/occupancy-tracker/emp-form') {
      setIsEmployeePage(false);
      fetchUserDetails();
    }
  }, []);

  useEffect(() => {
    if (isEmployeePage && (!selectedEmployee?.email || !selectedEmployee.employeeName || !selectedEmployee.role || emailError))
      setIsDisable(true);
    else if (!isEmployeePage && (!selectedUser?.email || !selectedUser.name || !selectedUser.role || emailError))
      setIsDisable(true);
    else
      setIsDisable(false);
  }, [handleInputChange]);


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
          {isEmployeePage ? 'Employee Registry' : 'User Registry'}
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
                    isEmployeePage ? fetchEmployeeDetails() : fetchUserDetails()
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

      <Box>
        <Backdrop open={loading} style={{ zIndex: 9999, color: "#fff" }}>
          <CircularProgress color={"primary"} />
        </Backdrop>
        <Table sx={{ minWidth: 700 }} >
          <TableHead>
            <TableRow>
              {isEmployeePage &&
                <><StyledTableCell align="center">ID</StyledTableCell>
                  <StyledTableCell align="center">PROFILE</StyledTableCell></>}
              <StyledTableCell align="center">NAME</StyledTableCell>
              <StyledTableCell align="center">ROLE</StyledTableCell>
              <StyledTableCell align="center">EMAIL</StyledTableCell>
              <StyledTableCell align="center">ACTION</StyledTableCell>
            </TableRow>
            {noUserFound && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="error"> {isEmployeePage ? 'No Employee Found' : 'No User Found'}</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableHead>
          <TableBody>
            {isEmployeePage ? employeeForm.map((row) => (
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
                {/* <StyledTableCell align="center">
                    <IconButton sx={{ bgcolor: "#00D1A3", color: "white", '&:hover': { bgcolor: "#00A387" } }} onClick={() => handleEditClick(row)}>
                      <EditOutlinedIcon />
                    </IconButton>
                  </StyledTableCell> */}
                <StyledTableCell align="center">
                  <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                    <IconButton
                      sx={{ color: "#00D1A3" }}
                      onClick={() => handleEditClick(row)}
                    >
                      <EditOutlinedIcon />
                    </IconButton>

                    <IconButton
                      sx={{ color: "#FF4D4D" }}
                      onClick={() => handleDeleteClick(row)}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Box>
                </StyledTableCell>
              </StyledTableRow>
            )) : userForm?.users.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell align="center">{row.name}</StyledTableCell>
                <StyledTableCell align="center">{row.role}</StyledTableCell>
                <StyledTableCell align="center">{row.email}</StyledTableCell>
                {/* <StyledTableCell align="center">
                    <IconButton sx={{ bgcolor: "#00D1A3", color: "white", '&:hover': { bgcolor: "#00A387" } }} onClick={() => handleUserEditClick(row)}>
                      <EditOutlinedIcon />
                    </IconButton>
                  </StyledTableCell> */}
                <StyledTableCell align="center">
                  <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                    <IconButton
                      sx={{ color: "#00D1A3" }}
                      onClick={() => handleUserEditClick(row)}
                    >
                      <EditOutlinedIcon />
                    </IconButton>

                    <IconButton
                      sx={{ color: "#FF4D4D" }}
                      onClick={() => handleUserDeleteClick(row)}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Box>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Dialog open={editDialogOpen}>
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.4rem', position: 'relative', textAlign: 'center' }}>
          {isEmployeePage ? 'Edit Employee' : 'Edit User'}
          <IconButton
            aria-label="close"
            onClick={handleDialogClose}
            sx={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {isEmployeePage ?
            <>
              <DialogTitle sx={{ textAlign: 'center' }}>Profile Picture</DialogTitle>
              <Box sx={{ textAlign: 'center', marginBottom: 1 }}>
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
              <DialogTextField
                label="User ID *"
                value={selectedEmployee?.employeeId || ""}
                name="employeeId"
                onChange={handleInputChange}
                disabled
              />
            </> :
            <>
              <DialogTextField
                label="Name *"
                value={isEmployeePage ? selectedEmployee?.employeeName : selectedUser?.name}
                name="employeeName"
                onChange={handleInputChange}
                disabled
              />
              <DialogTextField
                label="Email *"
                value={isEmployeePage ? selectedEmployee?.email : selectedUser?.email}
                name="email"
                onChange={handleInputChange}
                error={!!emailError}
                helperText={emailError}
                disabled
              />
              <DialogTextField
                label="Role *"
                value={isEmployeePage ? selectedEmployee?.role : selectedUser?.role}
                name="role"
                onChange={handleInputChange}
                select
              >
                <MenuItem value="Admin">Admin</MenuItem>
                {isEmployeePage ? <MenuItem value="Employee">Employee</MenuItem> :
                  <MenuItem value="User">User</MenuItem>}
              </DialogTextField>
            </>}
        </DialogContent>
        <DialogActions sx={{ my: 1 }}>
          {/* <Button onClick={() => { openConfirmDialog(); }} color="error">
            <Typography>Delete</Typography>
          </Button> */}
          <Button
            sx={{
              bgcolor: "#00D1A3",
              "&:hover": { bgcolor: "#00D1A3" },
              px: 4,
              mx: 3
            }}
            variant="contained"
            disabled={isDisable}
            onClick={handleSave}
          >
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
            Are you sure want to delete {isEmployeePage ? selectedEmployee?.employeeName : selectedUser?.name}?
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
