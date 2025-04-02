import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, TextField, Typography, Autocomplete, Avatar, Button, Grid, Dialog, DialogActions, DialogTitle, DialogContent } from "@mui/material";
import { AddEmployeeDetails } from "@/pages/dashboard/models/attendancetracker";

//Services
import { AttendanceDetails } from "@/pages/dashboard/services/attendancetracker";
import { OccupancyTracker } from "@/pages/dashboard/services/liveoccupancytracker";

//Model
import { AddUserDetails } from "../../models/liveoccupanytracker";

const EmployeeForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState<string>("");
  const [employeeId, setEmployeeId] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [avatarSrc, setAvatarSrc] = useState<string>("");
  const [imageBase64, setImageBase64] = useState<string>("");
  // const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  // const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [roleOptions, setRoleOptions] = useState<string[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [isEmployeePage, setIsEmployeePage] = useState<boolean>(false);

  const attendanceDetails = new AttendanceDetails();
  const occupancyTracker = new OccupancyTracker();

  const closeConfirmDialog = () => setConfirmDialogOpen(false);

  const pathName = location.pathname;

  useEffect(() => {
    if (pathName && pathName === '/dashboard/attendance/add-emp') {
      setIsEmployeePage(true);
      setRoleOptions(['Admin', 'Employee']);
    }
    else if (pathName && pathName === '/dashboard/occupancy-tracker/add-emp') {
      setIsEmployeePage(false);
      setRoleOptions(['Admin', 'User']);
    }
  }, [pathName])

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEmail(value);

    if (value.trim() === "") {
      setEmailError("Email ID is required");
    } else if (!validateEmail(value)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const handlePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "image/jpeg") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setAvatarSrc(reader.result as string);
          setImageBase64(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    } else {
      alert("Only .jpg format is allowed.");
    }
  };

  const handleSubmit = () => {
    if (isEmployeePage) {
      const request: AddEmployeeDetails = {
        role,
        email,
        employeeId,
        employeeName: name,
        imageBase64,
      };

      attendanceDetails
        .addEmployeeDetails(request)
        .then(() => {
          setSnackbarMessage('Employee added successfully!');
          setConfirmDialogOpen(true);
          // setSnackbarSeverity('success');
          // setSnackbarOpen(true);
          navigate('/dashboard/attendance/emp-form');
        })
        .catch((error) => {
          setSnackbarMessage(error.response.data.Warn);
          setConfirmDialogOpen(true);
        });
    } else {
      const request: AddUserDetails = {
        role,
        email,
        name
      };

      occupancyTracker.addUserDetails(request).then(() => {
        setSnackbarMessage('User added successfully!');
        setConfirmDialogOpen(true);
        // setSnackbarSeverity('success');
        // setSnackbarOpen(true);
        navigate('/dashboard/occupancy-tracker/emp-form');
      })
        .catch((error) => {
          setSnackbarMessage(error.response.data.data.message);
          setConfirmDialogOpen(true);
        });
    }
  };

  // const handleCloseSnackbar = (
  //   _event?: React.SyntheticEvent | Event,
  //   reason?: string
  // ) => {
  //   if (reason === "clickaway") {
  //     return;
  //   }
  //   setSnackbarOpen(false);
  // };

  const isFormValid = (): boolean => {
    return isEmployeePage ? !!(
      name.trim() &&
      employeeId &&
      email.trim() &&
      !emailError &&
      role &&
      imageBase64
    ) : !!(
      name.trim() &&
      email.trim() &&
      !emailError &&
      role
    );
  };

  return (
    <Box
      sx={{
        mt: 4,
        height: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          maxWidth: "800px", border: "2px solid #7D7D7D",
          borderRadius: 3,
          px: 10,
          py: 5
        }}
      >
        <Typography sx={{ color: "#1C214F", fontWeight: "bold", textAlign: "center" }} variant="h6">
          {isEmployeePage ? 'Add Employee' : 'Add User'}
        </Typography>
        <Grid container spacing={3}>
          {isEmployeePage ? <>
            <Grid item xs={12} container justifyContent="center">
              <Avatar sx={{ width: 60, height: 60, my: 2 }} src={avatarSrc} />
              <Grid item xs={12} container justifyContent="center">
                <Button
                  variant="contained"
                  component="label"
                  sx={{ bgcolor: "#00D1A3", '&:hover': { bgcolor: "#00A387" } }}
                >
                  <Typography>Upload Picture</Typography>
                  <Typography component="span" sx={{ pl: 1 }}>*</Typography>
                  <input type="file" accept=".jpg" hidden onChange={handlePictureUpload} />
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="name"
                label="Name"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="employeeId"
                label="Employee ID"
                variant="outlined"
                fullWidth
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="email"
                label="Email ID"
                variant="outlined"
                fullWidth
                value={email}
                onChange={handleEmailChange}
                error={!!emailError}
                helperText={emailError}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                id="role"
                options={roleOptions}
                value={role}
                onChange={(_, newValue) => {
                  setRole(newValue || "");
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Role *" variant="outlined" fullWidth />
                )}
              />
            </Grid>
          </> : <>
            <Grid container display="flex" direction="column" justifyContent="center" alignItems="center" spacing={3} sx={{ mt: 3 }}>
              <Box display="flex" alignItems="center" sx={{ width: "80%", mt: 2 }}>
                <Typography variant="subtitle1" sx={{ minWidth: 120, mr: 2 }}>
                  Name *
                </Typography>
                <TextField
                  id="name"
                  variant="outlined"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Box>
              <Box display="flex" alignItems="center" sx={{ width: "80%", mt: 2 }}>
                <Typography variant="subtitle1" sx={{ minWidth: 120, mr: 2 }}>
                  Email ID *
                </Typography>
                <TextField
                  id="email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={handleEmailChange}
                  error={!!emailError}
                  helperText={emailError}
                  required
                />
              </Box>
              <Box display="flex" alignItems="center" sx={{ width: "80%", mt: 2 }}>
                <Typography variant="subtitle1" sx={{ minWidth: 120, mr: 2 }}>
                  Role *
                </Typography>
                <Autocomplete
                  id="role"
                  options={roleOptions}
                  value={role}
                  onChange={(_, newValue) => {
                    setRole(newValue || "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      fullWidth
                    />
                  )}
                  sx={{ width: "100%" }}
                />
              </Box>
            </Grid>
          </>}
          <Grid item xs={12} container justifyContent="center">
            <Button
              sx={{
                width: 200,
                height: 50,
                my: 2,
                bgcolor: "#00D1A3",
                '&:hover': { bgcolor: "#00A387" },
              }}
              variant="contained"
              onClick={handleSubmit}
              disabled={!isFormValid()}
            >
              <Typography>{isEmployeePage ? 'Add Employee' : 'Add User'}</Typography>
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Dialog open={confirmDialogOpen} onClose={closeConfirmDialog}>
        <DialogTitle sx={{ bgcolor: "green", color: "white" }}>Error</DialogTitle>
        <DialogContent>
          <Typography sx={{ pt: 2 }}>
            {snackbarMessage}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog} color="primary">
            <Typography>OK</Typography>
          </Button>
        </DialogActions>
      </Dialog>

      {/* <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar> */}
    </Box>
  );
};

export default EmployeeForm;
