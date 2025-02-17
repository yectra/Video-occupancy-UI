import React, { useState } from "react";
import { Box, TextField, Typography, Autocomplete, Avatar, Button, Snackbar, Alert, Grid, Popper, InputAdornment, IconButton, } from "@mui/material";
import { AddEmployeeDetails } from "@/pages/dashboard/models/attendancetracker";
import { AttendanceDetails } from "@/pages/dashboard/services/attendancetracker";
import Calendar, { CalendarProps } from 'react-calendar';
import TodayIcon from '@mui/icons-material/Today';

const EmployeeForm: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [employeeId, setEmployeeId] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [selectedDate, setselectedDate] = useState<Date | null>(null);
  const [avatarSrc, setAvatarSrc] = useState<string>("");
  const [imageBase64, setImageBase64] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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

  const handleIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setCalendarOpen((prev) => !prev);
  };

  const handleDateChange: CalendarProps['onChange'] = (date: any) => {
    if (Array.isArray(date)) {
      setselectedDate(date.length > 0 ? date[0] : null);   
    } else {
      setselectedDate(date);
    }

    setCalendarOpen(false);
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
    let dateOfJoining: string = selectedDate ? selectedDate.toISOString().split("T")[0] : ''
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

        setTimeout(() => {
          window.location.reload();
        }, 1000);
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
      selectedDate &&
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
          Add Employee
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
            <TextField
              variant="outlined"
              id="dateOfJoining"
              label="Date of Joining"
              fullWidth
              value={selectedDate ? selectedDate.toLocaleDateString() : ''}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton onClick={handleIconClick}>
                      <TodayIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Popper id={"dateOfJoining"} open={calendarOpen} anchorEl={anchorEl} placement="bottom">
              <Box sx={{ position: "absolute", border: '1px solid #ccc', borderRadius: '8px', padding: '20px', backgroundColor: 'white', zIndex: 1000 }}>
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate || new Date()}
                  className="custom-calendar"
                />
              </Box>
            </Popper>
          </Grid>
          <Grid item xs={12}>
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
                mb: 2,
                bgcolor: "#00D1A3",
                '&:hover': { bgcolor: "#00A387" },
              }}
              variant="contained"
              onClick={handleSubmit}
              disabled={!isFormValid()}
            >
              Add Employee
            </Button>
          </Grid>
        </Grid>
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
