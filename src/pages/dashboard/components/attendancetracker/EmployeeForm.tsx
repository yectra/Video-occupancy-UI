import React, { useState } from "react";

import {
  Box,
  TextField,
  Typography,
  Autocomplete,
  Avatar,
  Button,
} from "@mui/material";
import { AddEmployeeDetails } from "../../models/attendancetracker";
import { AttendanceDetails } from "../../services/attendancetracker";


const EmployeeForm: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [employeeId, setEmployeeId] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [role, setRole] = useState<string>('');
  const [dateOfJoining, setDateOfJoining] = useState<string>(""); 
  const [avatarSrc, setAvatarSrc] = useState<string>("");
  

  const attendanceDetails=new AttendanceDetails();
 
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
        }
      };
      reader.readAsDataURL(file);
    } else {
      alert("Only .jpg format is allowed.");
    }
  };

  const handleSubmit = () => {

    const request:AddEmployeeDetails={
      dateOfJoining,
      role,
      email,
      employeeId,
      employeeName:name,
      imageBase64:"",
      action:"Active"
    }

    attendanceDetails.addEmployeeDetails(request)
    .then((response)=>{
      console.log(response)
    })
    
  };

  const isFormValid = (): boolean => {
    return !!(
      name.trim() &&
      employeeId.trim() &&
      email.trim() &&
      !emailError &&
      role &&
      dateOfJoining
    );
  };

  return (
    <Box
      sx={{
        mt:4,
        height: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow:"hidden"
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
          gap:5
        }}
      >
        <Typography
          sx={{ color: "#1C214F", fontWeight: "bold" }}
          variant="h6"
        >
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
            <Avatar
              sx={{ width: 60, height: 60 }}
              src={avatarSrc} // Display uploaded image
            />
            <Button
              variant="outlined"
              component="label"
              sx={{ mt: 2 }}
            >
              Upload Picture
              <input
                type="file"
                accept=".jpg"
                hidden
                onChange={handlePictureUpload}
              />
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
              onChange={(e) => setEmployeeId(e.target.value)}
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
              <TextField
                {...params}
                label="Role"
                variant="outlined"
                sx={{ flex: 1 }}
              />
            )}
            sx={{ width: "100%" }}
          />
          <Button
            sx={{
              width: 200,
              height: 50,
              mt: 3,
              bgcolor: "#00D1A3",
              "&:hover": { bgcolor: "#00D1A3" },
            }}
            variant="contained"
            onClick={handleSubmit}
            disabled={!isFormValid()}
          >
            Add Employee
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EmployeeForm;
