import attImg from '@/assets/attendancecamera.jpg';
import { Box, Grid, Typography, TextField, Button, Snackbar, Alert, CircularProgress } from '@mui/material';
import { AttendanceDetails } from '../../services/attendancetracker';
import { useState } from 'react';
import { CameraurlSetup } from '../../models/attendancetracker';
import { useNavigate } from "react-router-dom";

const AttendanceSetupView = () => {
  const attendanceDetails = new AttendanceDetails();
  const navigate = useNavigate();
  const [cameraurlData, setCameraurlData] = useState<CameraurlSetup>({
    cameraDetails1: [
      {
        email: '',
        cameraI: '',
        punchinUrl: '',
        cameraII: '',
        punchoutUrl: '',
      },
    ],
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [isLoading, setIsLoading] = useState(false); // <-- Loading state

  type CameraDetailKeys = 'email' | 'cameraI' | 'punchinUrl' | 'cameraII' | 'punchoutUrl';

  const handleInputChange = (index: number, field: CameraDetailKeys, value: string) => {
    const updatedData = { ...cameraurlData };
    updatedData.cameraDetails1[index][field] = value;
    setCameraurlData(updatedData);
  };

  const handleSave = () => {
    setIsLoading(true);
    attendanceDetails
      .cameraurlDetails(cameraurlData)
      .then(() => {
        setSnackbarMessage('Camera setup details saved successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        navigate("/dashboard/occupancy-tracker/overview")
      })
      .catch((error) => {
        setSnackbarMessage('Failed to save camera setup details.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        console.error('Error saving camera setup details:', error);
      })
      .finally(() => setIsLoading(false)); // Set loading to false after API call finishes
  };

  const handleCloseSnackbar = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  return (
    <Grid container sx={{ width: "100vw", height: "100vh" }} spacing={0}>
      <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <img src={attImg} alt="Setup" style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 10 }} />
      </Grid>

      <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: 4, gap: 6 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ color: "#00D1A3", fontWeight: "bold" }}>
            ATTENDANCE TRACKER
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1C214F" }}>
            Camera Setup Details
          </Typography>

          <TextField
            required
            fullWidth
            label="Email Address"
            variant="outlined"
            onChange={(e) => handleInputChange(0, 'email', e.target.value)}
          />

          <TextField
            fullWidth
            label="Camera I"
            variant="outlined"
            onChange={(e) => handleInputChange(0, 'cameraI', e.target.value)}
          />

          <TextField
            required
            fullWidth
            label="Punch-In URL"
            variant="outlined"
            onChange={(e) => handleInputChange(0, 'punchinUrl', e.target.value)}
          />

          <TextField
            fullWidth
            label="Camera II"
            variant="outlined"
            onChange={(e) => handleInputChange(0, 'cameraII', e.target.value)}
          />

          <TextField
            required
            fullWidth
            label="Punch-Out URL"
            variant="outlined"
            onChange={(e) => handleInputChange(0, 'punchoutUrl', e.target.value)}
          />
        </Box>
        <Button
          variant='contained'
          sx={{ bgcolor: "#00D1A3", '&:hover': { bgcolor: '#00D1A3' } }}
          onClick={handleSave}
          disabled={isLoading} // Disable the button when loading
        >
          {isLoading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Save"}
        </Button>
      </Grid>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default AttendanceSetupView;
