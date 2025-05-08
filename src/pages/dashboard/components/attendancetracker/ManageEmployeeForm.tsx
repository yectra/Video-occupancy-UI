import React, { useEffect, useState, useCallback } from "react";
import { debounce } from 'lodash';
import { styled, Box, Typography, IconButton, InputAdornment, InputBase, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableBody, TableCell, tableCellClasses, TableHead, TableRow, MenuItem, Button, Avatar, CircularProgress, Backdrop, Snackbar, Alert, TablePagination, TableContainer } from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";

//Service
import { AttendanceTracker } from "@/pages/dashboard/services/attendancetracker";

//Models
import { employeeResponse, ManageEmployeeDetails } from "@/pages/dashboard/models/attendancetracker";

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
  const pageSize: number = 10;

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [employeeForm, setEmployeeForm] = useState<employeeResponse>(new employeeResponse());
  const [selectedEmployee, setSelectedEmployee] = useState<ManageEmployeeDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string>("");
  const [noUserFound, setNoUserFound] = useState<boolean>(false);
  const [isDisable, setIsDisable] = useState<boolean>(false)
  const [emailError, setEmailError] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(pageSize);

  const attendanceDetails = new AttendanceTracker();

  const openConfirmDialog = () => setConfirmDialogOpen(true);
  const closeConfirmDialog = () => setConfirmDialogOpen(false);

  const handleChangePage = (event: unknown, newPage: number) => {
    console.log('event', event)
    setPage(newPage);
    fetchEmployeeDetails(newPage + 1, rowsPerPage)
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    fetchEmployeeDetails(1, parseInt(event.target.value, 10))

  };

  const fetchEmployeeDetails = (page: number, size: number) => {
    setLoading(true);
    attendanceDetails
      .getManageEmployeeDetails(page, size)
      .then((response: employeeResponse) => {
        setEmployeeForm(response);
        setNoUserFound(response.employees.length === 0);
      })
      .finally(() => setLoading(false));
  };

  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      if (searchValue) {
        setLoading(true);
        attendanceDetails.searchAllEmployeeDetails(searchValue)
          .then((response) => {
            setEmployeeForm(response);
            setNoUserFound(response.employees.length === 0);
          })
          .finally(() => setLoading(false));
      } else {
        fetchEmployeeDetails(page + 1, rowsPerPage);
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSelectedEmployee((prev) => (prev ? { ...prev, [name]: value } : null));

    if (name == 'email' && !validateEmail(value)) {
      setEmailError("Invalid email format");
    } else if (name === 'employeeName' && !validateName(value)) {
      setNameError("Only Alphabet Allowed");
    }
    else {
      setEmailError("");
      setNameError("");
    }
  };

  const handleSave = () => {
    if (selectedEmployee) {
      if (newImage && imageBase64)
        selectedEmployee.newImageBase64 = imageBase64;

      setLoading(true);
      attendanceDetails
        .updateEmployeeDetails(selectedEmployee)
        .then(() => {
          setSnackbarMessage('Employee updated successfully!');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);

          fetchEmployeeDetails(page + 1, rowsPerPage);
          handleDialogClose();
        })
        .catch((error) => {
          setSnackbarMessage(error.response.data.warn);
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        })
        .finally(() => setLoading(false));
    }
  };

  const handleDelete = () => {
    closeConfirmDialog();
    setLoading(true);
    if (selectedEmployee) {
      attendanceDetails
        .deleteEmployeeDetails(selectedEmployee.employeeId)
        .then(() => {
          fetchEmployeeDetails(page + 1, rowsPerPage);
          handleDialogClose();
        })
        .catch((error) => {
          setSnackbarMessage(error.response.data.warn);
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        })
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

  const handleCloseSnackbar = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const validateEmail = (email: any): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateName = (name: string): boolean => {
    const regex = /^[A-Za-z\s]+$/;
    return regex.test(name);
  };

  useEffect(() => {
    fetchEmployeeDetails(page + 1, rowsPerPage);
  }, []);

  useEffect(() => {
    if (!selectedEmployee?.email || !selectedEmployee.employeeName || !selectedEmployee.role || emailError || nameError)
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
                  <IconButton edge="end" size="large" onClick={() => {
                    setSearchTerm("")
                    fetchEmployeeDetails(page + 1, rowsPerPage)
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
        <TableContainer>
          <Table sx={{ minWidth: 700 }} >
            <TableHead>
              <TableRow>

                <StyledTableCell align="center">ID</StyledTableCell>
                <StyledTableCell align="center">PROFILE</StyledTableCell>
                <StyledTableCell align="center">NAME</StyledTableCell>
                <StyledTableCell align="center">ROLE</StyledTableCell>
                <StyledTableCell align="center">EMAIL</StyledTableCell>
                <StyledTableCell align="center">ACTION</StyledTableCell>
              </TableRow>
              {noUserFound && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="error"> No Employee Found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableHead>
            <TableBody>
              {Array.isArray(employeeForm.employees) && employeeForm.employees.map((row) => (
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {employeeForm.total_records ? <TablePagination
          rowsPerPageOptions={[pageSize, pageSize * 2, pageSize * 3, pageSize * 4, pageSize * 5]}
          component="div"
          count={employeeForm.total_records || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> : null}
      </Box>

      <Dialog open={editDialogOpen}>
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.4rem', position: 'relative', textAlign: 'center' }}>
          Edit Employee
          <IconButton
            aria-label="close"
            onClick={handleDialogClose}
            sx={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
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
            label="Name *"
            value={selectedEmployee?.employeeName}
            name="employeeName"
            onChange={handleInputChange}
            error={!!nameError}
            helperText={nameError}
          />
          <DialogTextField
            label="Email *"
            value={selectedEmployee?.email}
            name="email"
            onChange={handleInputChange}
            error={!!emailError}
            helperText={emailError}
            disabled
          />
          <DialogTextField
            label="Role *"
            value={selectedEmployee?.role}
            name="role"
            onChange={handleInputChange}
            select
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Employee">Employee</MenuItem>
          </DialogTextField>

        </DialogContent>
        <DialogActions sx={{ my: 1 }}>
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageEmployeeForm;
