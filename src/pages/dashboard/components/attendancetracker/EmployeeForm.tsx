import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Typography, Autocomplete, Avatar, Button, Snackbar, Alert, Grid } from "@mui/material";
import { AddEmployeeDetails } from "@/pages/dashboard/models/attendancetracker";
import { AttendanceDetails } from "@/pages/dashboard/services/attendancetracker";

const EmployeeForm: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [employeeId, setEmployeeId] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [avatarSrc, setAvatarSrc] = useState<string>("");
  const [imageBase64, setImageBase64] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const attendanceDetails = new AttendanceDetails();
  const roleOptions = ["Admin", "Employee"];

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
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        navigate('/dashboard/occupancy-tracker/emp-form');
      })
      .catch((error) => {
        setSnackbarMessage(error.response.data.Warn);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
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

  const isFormValid = (): boolean => {
    return !!(
      name.trim() &&
      employeeId &&
      email.trim() &&
      !emailError &&
      role &&
      imageBase64
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
          padding: 10,
        }}
      >
        <Typography sx={{ color: "#1C214F", fontWeight: "bold", textAlign: "center" }} variant="h6">
          Add User
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} container justifyContent="center">
            <Avatar sx={{ width: 60, height: 60, mt: 2 }} src={avatarSrc} />
          </Grid>
          <Grid item xs={12} container justifyContent="center">
            <Button
              variant="contained"
              component="label"
              sx={{ bgcolor: "#00D1A3", '&:hover': { bgcolor: "#00A387" } }}
            >
              Upload Picture
              <Typography component="span" sx={{ pl: 1 }}>*</Typography>
              <input type="file" accept=".jpg" hidden onChange={handlePictureUpload} />
            </Button>
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
              label="User ID"
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
              Add User
            </Button>
          </Grid>
        </Grid>
      </Box>

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

export default EmployeeForm;
