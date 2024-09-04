// src/pages/EmployeeForm.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";
import BaseButton from "@/components/controls/BaseButton";

const EmployeeForm: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [employeeId, setEmployeeId] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [role, setRole] = useState<string | null>(null);

  const navigate = useNavigate();

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

  const handleSubmit = () => {
    navigate("/dashboard/occupancy-tracker/overview/emp-form?added=true");
  };

  const isFormValid = (): boolean => {
    return !!(
      name.trim() &&
      employeeId.trim() &&
      email.trim() &&
      !emailError &&
      role
    );
  };

  return (
    <Box
      sx={{
        height: "650px",
        width: "560px",
        border: "2px solid #7D7D7D",
        marginLeft: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 3,
        padding: 1,
      }}
    >
      <Typography
        sx={{ mb: 8, color: "#1C214F", fontWeight: "bold" }}
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
        </Box>
        <Autocomplete
          id="role"
          options={roleOptions}
          value={role}
          onChange={(_, newValue) => {
            setRole(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Role"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: <>{params.InputProps.endAdornment}</>,
              }}
              sx={{ flex: 1 }}
            />
          )}
          sx={{ width: "100%" }}
        />
        <BaseButton
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
        </BaseButton>
      </Box>
    </Box>
  );
};

export default EmployeeForm;
