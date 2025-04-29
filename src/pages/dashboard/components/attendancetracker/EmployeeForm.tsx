import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Typography, Autocomplete, Avatar, Button, Grid, Backdrop, CircularProgress, Snackbar, Alert } from "@mui/material";
import { AddEmployeeDetails } from "@/pages/dashboard/models/attendancetracker";

//Services
import { AttendanceTracker } from "@/pages/dashboard/services/attendancetracker";

const EmployeeForm: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [avatarSrc, setAvatarSrc] = useState<string>("");
  const [imageBase64, setImageBase64] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const roleOptions: string[] = ['Admin', 'Employee'];

  const attendanceTracker = new AttendanceTracker();

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateName = (name: string): boolean => {
    const regex = /^[A-Za-z\s]+$/;
    return regex.test(name);
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!validateName(value)) {
      setNameError('Only alphabets and spaces are allowed');
    } else {
      setNameError('');
    }
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
    setLoading(true);

    const request: AddEmployeeDetails = {
      role,
      email,
      employeeName: name,
      imageBase64,
    };

    attendanceTracker
      .addEmployeeDetails(request)
      .then(() => {
        setSnackbarMessage('Employee added successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        navigate('/dashboard/attendance/emp-form');
      })
      .catch((error) => {
        setSnackbarMessage(error.response.data.warn);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }).finally(() => setLoading(false));

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
      !nameError &&
      email.trim() &&
      !emailError &&
      role &&
      imageBase64
    )
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
      <Backdrop open={loading} style={{ zIndex: 9999, color: "#fff" }}>
        <CircularProgress color={"primary"} />
      </Backdrop>
      <Box
        sx={{
          maxWidth: "800px", border: "2px solid #7D7D7D",
          borderRadius: 3,
          px: 10,
          py: 5
        }}
      >
        <Typography sx={{ color: "#1C214F", fontWeight: "bold", textAlign: "center" }} variant="h6">
          Add Employee
        </Typography>
        <Grid container spacing={3}>
          <Grid
            container
            direction="column"
            alignItems="center"
            spacing={3}
            sx={{ mt: 3 }}
          >
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar sx={{ width: 60, height: 60, my: 2 }} src={avatarSrc} />
              <Button
                variant="contained"
                component="label"
                sx={{
                  bgcolor: "#00D1A3",
                  '&:hover': { bgcolor: "#00A387" },
                  mt: 1,
                }}
              >
                <Typography>Upload Picture</Typography>
                <Typography component="span" sx={{ pl: 1 }}>*</Typography>
                <input type="file" accept=".jpg" hidden onChange={handlePictureUpload} />
              </Button>
            </Box>
            <Grid item sx={{ width: '100%', maxWidth: 400 }}>
              <Box display="flex" alignItems="center" sx={{ width: "80%", mt: 2 }}>
                <Typography variant="subtitle1" sx={{ minWidth: 120, mr: 2 }}>
                  Name *
                </Typography>
                <TextField
                  id="name"
                  variant="outlined"
                  fullWidth
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  error={!!nameError}
                  helperText={nameError}
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
              <Typography>Add Employee</Typography>
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
