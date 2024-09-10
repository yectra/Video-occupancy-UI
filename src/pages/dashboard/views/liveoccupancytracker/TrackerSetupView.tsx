import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  SelectChangeEvent,
  IconButton,
  Tooltip
} from "@mui/material";
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import setupImg from '@/assets/setupcamera.png';
import BaseButton from "@/common/components/controls/BaseButton";



const TrackerSetupView: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [capacity, setCapacity] = useState<string>("");
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [cameraSetups, setCameraSetups] = useState<CameraSetup[]>([{ entranceName: "", cameraPosition: "INSIDE-OUT", videoSource: "" }]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState<number>(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const handleStepChange = (newStep: number) => {
    if (newStep === 2 && !validateStep1()) return;
    setStep(newStep as 1 | 2);
  };

  const handleCameraIndexChange = (delta: number) => setCurrentCameraIndex(prev => Math.min(Math.max(prev + delta, 0), cameraSetups.length - 1));

  const handleChangeTextField = (index: number, field: keyof CameraSetup) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setCameraSetups(prev => {
      const updated = [...prev];
      updated[index][field] = event.target.value;
      return updated;
    });
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleChangeSelectField = (index: number, field: keyof CameraSetup) => (event: SelectChangeEvent<string>) => {
    setCameraSetups(prev => {
      const updated = [...prev];
      updated[index][field] = event.target.value;
      return updated;
    });
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleAddCameraClick = () => {
    setCameraSetups(prev => [...prev, { entranceName: "", cameraPosition: "INSIDE-OUT", videoSource: "" }]);
    setCurrentCameraIndex(cameraSetups.length);
  };

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!capacity) newErrors.capacity = "Capacity is required";
    if (!alertMessage) newErrors.alertMessage = "Alert message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {};
    cameraSetups.forEach((setup, index) => {
      if (!setup.entranceName) newErrors[`entranceName${index}`] = "Camera Identifier is required";
      if (!setup.videoSource) newErrors[`videoSource${index}`] = "Video source URL is required";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreview = () => {
    if (validateStep2()) {
      console.log("Previewing the setup...");
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: "#eaf2e6" }}>
      <Box sx={{ display: 'flex', width: '70%', height: '90%', borderRadius: 2, backgroundColor: '#FFFFFF', opacity: 0.9, boxShadow: 10 }}>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src={setupImg} alt="Setup" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} />
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 4, gap: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#00D1A3', fontWeight: "bold" }}>
            LIVE OCCUPANCY TRACKER
          </Typography>
          <>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {step === 2 && (
                <IconButton onClick={() => handleStepChange(1)} sx={{ marginRight: 2 }}>
                  <ArrowCircleLeftOutlinedIcon sx={{ fontSize: '30px', color: '#252C58' }} />
                </IconButton>
              )}
              <Typography variant="h6" sx={{ color: '#1C214F', fontWeight: 'bold', marginRight: 10 }}>
                Setup details
              </Typography>
              {step === 2 && (
                <>
                  {currentCameraIndex > 0 && (
                    <IconButton onClick={() => handleCameraIndexChange(-1)}>
                      <ArrowLeftIcon sx={{ fontSize: '20px', color: '#252C58' }} />
                    </IconButton>
                  )}
                  <Typography variant="body1" sx={{ color: '#1C214F', fontWeight: 'bold' }}>
                    LOCATION {currentCameraIndex + 1}
                  </Typography>
                  {currentCameraIndex < cameraSetups.length - 1 && (
                    <IconButton onClick={() => handleCameraIndexChange(1)}>
                      <ArrowRightIcon sx={{ fontSize: '20px', color: '#252C58' }} />
                    </IconButton>
                  )}
                </>
              )}
            </Box>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {step === 1 ? (
                <>
                  <TextField
                    label="Capacity of people"
                    variant="outlined"
                    value={capacity}
                    onChange={(e) => {
                      setCapacity(e.target.value);
                      setErrors(prev => ({ ...prev, capacity: "" }));
                    }}
                    fullWidth
                    error={!!errors.capacity}
                    helperText={errors.capacity}
                    required
                  />
                  <FormControl variant="outlined" fullWidth error={!!errors.alertMessage} required>
                    <InputLabel id="alert-message-label">Alert message</InputLabel>
                    <Select
                      labelId="alert-message-label"
                      label="Alert message"
                      value={alertMessage}
                      onChange={(e: SelectChangeEvent<string>) => {
                        setAlertMessage(e.target.value);
                        setErrors(prev => ({ ...prev, alertMessage: "" }));
                      }}
                    >
                      {Array.from({ length: 5 }, (_, i) => (
                        <MenuItem key={i} value={`${i * 20}-${i * 20 + 20}`}>
                          {`${i * 20}-${i * 20 + 20}`}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.alertMessage && <Typography color="error">{errors.alertMessage}</Typography>}
                  </FormControl>
                </>
              ) : (
                <>
                  <TextField
                    label="Camera Identifier"
                    variant="outlined"
                    value={cameraSetups[currentCameraIndex].entranceName}
                    onChange={handleChangeTextField(currentCameraIndex, 'entranceName')}
                    fullWidth
                    error={!!errors[`entranceName${currentCameraIndex}`]}
                    helperText={errors[`entranceName${currentCameraIndex}`]}
                    required
                  />
                  <FormControl variant="outlined" fullWidth required>
                    <InputLabel id="camera-position-label">Camera Position</InputLabel>
                    <Select
                      labelId="camera-position-label"
                      value={cameraSetups[currentCameraIndex].cameraPosition}
                      onChange={handleChangeSelectField(currentCameraIndex, 'cameraPosition')}
                      label="Camera Position"
                    >
                      <MenuItem value="INSIDE-OUT">
                        <Tooltip title="Camera installed inside the entrance and facing the door. People entering are facing the camera, while those leaving are not" placement="right">
                          <span>INSIDE-OUT</span>
                        </Tooltip>
                      </MenuItem>
                      <MenuItem value="OUTSIDE-IN">
                        <Tooltip title="Camera installed outside the entrance and facing the door. People entering are not facing the camera, while those leaving are" placement="right">
                          <span>OUTSIDE-IN</span>
                        </Tooltip>
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="URL of the video source"
                    variant="outlined"
                    value={cameraSetups[currentCameraIndex].videoSource}
                    onChange={handleChangeTextField(currentCameraIndex, 'videoSource')}
                    fullWidth
                    error={!!errors[`videoSource${currentCameraIndex}`]}
                    helperText={errors[`videoSource${currentCameraIndex}`]}
                    required
                  />
                  <BaseButton
                    variant="outlined"
                    sx={{
                      color: "#00D1A3",
                      border: "2px dashed #00D1A3",
                      width: "250px", 
                      "&:hover": { borderColor: "#00A685" }
                    }}
                    onClick={handleAddCameraClick}
                  >
                    + Add another camera
                  </BaseButton>
                </>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2, alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: '#1C214F', fontWeight: 'bold' }}>
                  Step <strong>{step}/2</strong>
                </Typography>
                <BaseButton
                  variant="contained"
                  color="primary"
                  onClick={() => step === 2 ? handlePreview() : handleStepChange(2)}
                  sx={{
                    width: '150px',
                    height: '50px',
                    backgroundColor: '#00D1A3',
                    '&:hover': { backgroundColor: '#00A685' },
                  }}
                >
                  {step === 1 ? 'Next' : 'Preview'}
                </BaseButton>
              </Box>
            </Box>
          </>
        </Box>
      </Box>
    </Box>
  );
};

export default TrackerSetupView;
