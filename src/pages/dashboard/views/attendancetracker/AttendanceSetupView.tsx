import { useState } from 'react';
import attImg from '@/assets/attendancecamera.jpg';
import { Box, Button, Grid, TextField, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { SelectChangeEvent } from '@mui/material';

const AttendanceSetupView = () => {
  
  const [CameraPosition, setPunchInCameraPosition] = useState<string>('PUNCH-IN');
  const [CameraIdentifier, setPunchInCameraIdentifier] = useState<string>('');
  const [CameraFeedUrl, setPunchInCameraFeedUrl] = useState<string>('');

  
  const [punchOutCameraPosition, setPunchOutCameraPosition] = useState<string>('PUNCH-OUT');
  const [punchOutCameraFeedUrl, setPunchOutCameraFeedUrl] = useState<string>('');

  
  const handlePunchInCameraPositionChange = (event: SelectChangeEvent<string>) => {
    setPunchInCameraPosition(event.target.value as string);
  };

  const handlePunchInInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
  };

  
  const handlePunchOutCameraPositionChange = (event: SelectChangeEvent<string>) => {
    setPunchOutCameraPosition(event.target.value as string);
  };

  const handlePunchOutInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
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

          <Typography variant="h6" sx={{ color: "#1C214F", fontWeight: "bold" }}>
            Setup Details
          </Typography>

          <TextField
          label="Name of the Organization"/>
          <TextField
            label=" Camera Identifier"
            fullWidth
            value={CameraIdentifier}
            onChange={(e) => handlePunchInInputChange(setPunchInCameraIdentifier, e.target.value)}
          />

          <FormControl fullWidth>
            <InputLabel id="camera-position-label">Camera Position</InputLabel>
            <Select
              labelId="camera-position-label"
              value={CameraPosition}
              onChange={handlePunchInCameraPositionChange}
              label="Camera Position"
            >
              <MenuItem value="PUNCH-IN">Punch-IN Camera</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Punch-IN Camera URL"
            fullWidth
            value={CameraFeedUrl}
            onChange={(e) => handlePunchInInputChange(setPunchInCameraFeedUrl, e.target.value)}
          />

          <FormControl fullWidth>
            <InputLabel id="camera-position-label">Camera Position</InputLabel>
            <Select
              labelId="camera-position-label"
              value={punchOutCameraPosition}
              onChange={handlePunchOutCameraPositionChange}
              label="Camera Position"
            >
              <MenuItem value="PUNCH-OUT">Punch-OUT Camera</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Punch-OUT Camera URL"
            fullWidth
            value={punchOutCameraFeedUrl}
            onChange={(e) => handlePunchOutInputChange(setPunchOutCameraFeedUrl, e.target.value)}
          />

          <Button 
            variant="contained"
            sx={{
              bgcolor: "#00D1A3",
              "&:hover": { backgroundColor: "#00A685" },
              width: "150px",
              display: "flex",
              alignSelf: "flex-end",
            }}
          >
            SAVE
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default AttendanceSetupView;
