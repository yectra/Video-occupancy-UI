import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Autocomplete,
  Avatar,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { AddEmployeeDetails } from "@/pages/dashboard/models/attendancetracker";
import { AttendanceDetails } from "@/pages/dashboard/services/attendancetracker";

const EmployeeForm: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [employeeId, setEmployeeId] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [dateOfJoining, setDateOfJoining] = useState<string>("");
  const [avatarSrc, setAvatarSrc] = useState<string>("");
  const [imageBase64, setImageBase64] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  const attendanceDetails = new AttendanceDetails();
  const roleOptions = ["Employee", "Manager"];

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
      dateOfJoining,
      role,
      email,
      employeeId,
      employeeName: name,
      imageBase64,
    };
    console.log("Request payload: ", request);

    attendanceDetails
      .addEmployeeDetails(request)
      .then((response) => {
        console.log(response);
        setSnackbarOpen(true);
        
        // Refresh the page after successful addition
        setTimeout(() => {
          window.location.reload(); // Refresh the page
        }, 1000); // Optional delay before refreshing
      })
      .catch((error) => {
        console.error("Error adding employee:", error);
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
      dateOfJoining &&
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
          width: "560px",
          border: "2px solid #7D7D7D",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 3,
          padding: 1,
          gap: 5,
        }}
      >
        <Typography sx={{ color: "#1C214F", fontWeight: "bold" }} variant="h6">
          Add Employee
        </Typography>
        <Box
          sx={{
            width: "460px",
            display: "flex",
            flexDirection: "column",
            gap: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Avatar sx={{ width: 60, height: 60 }} src={avatarSrc} />
            <Button variant="contained" component="label" sx={{ mt: 2,bgcolor:"#00D1A3",'&:hover':{bgcolor:"#00A387"} }}>
              Upload Picture
              <input type="file" accept=".jpg" hidden onChange={handlePictureUpload} />
            </Button>
          </Box>
          <Box sx={{ display: "flex", gap: 5, width: "100%" }}>
            <TextField
              id="name"
              label="Name"
              variant="outlined"
              sx={{ flex: 1 }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              id="employeeId"
              label="Employee ID"
              variant="outlined"
              sx={{ flex: 1 }}
              value={employeeId}
              onChange={(e) => setEmployeeId((e.target.value))}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 5, width: "100%" }}>
            <TextField
              id="email"
              label="Email ID"
              variant="outlined"
              sx={{ flex: 1 }}
              value={email}
              onChange={handleEmailChange}
              error={!!emailError}
              helperText={emailError}
            />
            <TextField
              id="dateOfJoining"
              label="Date of Joining"
              variant="outlined"
              sx={{ flex: 1 }}
              value={dateOfJoining}
              onChange={(e) => setDateOfJoining(e.target.value)}
            />
          </Box>

          <Autocomplete
            id="role"
            options={roleOptions}
            value={role}
            onChange={(_, newValue) => {
              setRole(newValue || "");
            }}
            renderInput={(params) => (
              <TextField {...params} label="Role" variant="outlined" sx={{ flex: 1 }} />
            )}
            sx={{ width: "100%" }}
          />

          <Button
            sx={{
              width: 200,
              height: 50,
              mb: 2,
              bgcolor: "#00D1A3",
              '&:hover':{bgcolor:"#00A387"},
            }}
            variant="contained"
            onClick={handleSubmit}
            disabled={!isFormValid()}
          >
            Add Employee
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          Employee added successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmployeeForm;
