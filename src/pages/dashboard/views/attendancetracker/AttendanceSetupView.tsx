import { useEffect, useState } from 'react';
import attImg from '@/assets/attendancecamera.jpg';
import { Box, Grid, Typography, TextField, Button, Snackbar, Alert, CircularProgress, IconButton, Backdrop, Tooltip } from '@mui/material';
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import DeleteIcon from "@mui/icons-material/Delete";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

// Services
import { AttendanceDetails } from '../../services/attendancetracker';

// Models
import { CameraurlSetup } from '../../models/attendancetracker';

// Router
import { useNavigate } from "react-router-dom";

const AttendanceSetupView = () => {
  const attendanceDetails = new AttendanceDetails();
  const navigate = useNavigate();

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [emailError, setEmailError] = useState<string>("");
  const [isDisable, setIsDisable] = useState<boolean>(false)
  const [cameraurlData, setCameraurlData] = useState<CameraurlSetup>({
    email: "",
    cameraDetails: [
      {
        cameraId: null,
        punchinCamera: "",
        punchinUrl: "",
        punchoutCamera: "",
        punchoutUrl: ""
      }
    ]
  });
  const [currentCameraIndex, setCurrentCameraIndex] = useState<number>(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  type CameraDetailKeys = 'punchinCamera' | 'punchinUrl' | 'punchoutCamera' | 'punchoutUrl';

  useEffect(() => {
    const hasErrors = Object.values(errors).some(error => error !== "");
    const isAnyFieldEmpty = !cameraurlData.email ||
      cameraurlData.cameraDetails.some(i => !i.punchinCamera || !i.punchinUrl || !i.punchoutCamera || !i.punchoutUrl);

    setIsDisable(hasErrors || isAnyFieldEmpty);
  }, [cameraurlData, errors]);

  const handleEmailChange = (value: string) => {
    setCameraurlData(prevState => ({
      ...prevState,
      email: value
    }));
    if (!validateEmail(value)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleInputChange = (index: number, field: CameraDetailKeys, value: string) => {
    setCameraurlData(prevState => {
      const updatedCameraDetails = [...(prevState.cameraDetails || [])];
      if (!updatedCameraDetails[index]) return prevState;

      // const isDuplicate = updatedCameraDetails.some(
      //   (setup, i) => i !== index && setup[field] === value
      // );

      const allExistingUrls = prevState.cameraDetails.flatMap((setup) =>
        [setup.punchinUrl, setup.punchoutUrl]
      );

      const isDuplicateAcrossCameras = allExistingUrls.includes(value);

      if (isDuplicateAcrossCameras) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [`${field}${index}`]: `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} Already Exist`,
        }));
        return prevState;
      }
      setErrors((prevErrors) => ({
        ...prevErrors,
        [`${field}${index}`]: "",
      }));

      updatedCameraDetails[index] = {
        ...updatedCameraDetails[index],
        [field]: value
      };

      return {
        ...prevState,
        cameraDetails: updatedCameraDetails
      };
    });
  };

  const handleSave = () => {
    setIsLoading(true);
    attendanceDetails
      .cameraurlDetails(cameraurlData)
      .then(() => {
        setSnackbarMessage('Camera setup details saved successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        navigate("/dashboard/attendance/emp-attendance")
      })
      .catch((error) => {
        setSnackbarMessage(error.response.data.warn);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      })
      .finally(() => setIsLoading(false)); // Set loading to false after API call finishes
  };

  const handleCloseSnackbar = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const handleCameraIndexChange = (delta: number) => {
    setCurrentCameraIndex((prev) => {
      const maxIndex = (cameraurlData.cameraDetails?.length || 1) - 1;
      return Math.min(Math.max(prev + delta, 0), maxIndex);
    });
  };

  const handleDeleteCameraClick = (index: number) => {
    setCameraurlData(prevState => {
      const updatedCameras = prevState.cameraDetails ? [...prevState.cameraDetails] : [];
      updatedCameras.splice(index, 1); // Remove the selected camera

      return {
        ...prevState,
        cameraDetails: updatedCameras
      };
    });

    setCurrentCameraIndex((prev) => Math.max(0, prev - 1)); // Ensure index remains valid
  };

  const handleAddCameraClick = () => {
    setCameraurlData(prevState => {
      const updatedCameras = [...(prevState.cameraDetails || [])];
      updatedCameras.push({
        cameraId: null,
        punchinCamera: "",
        punchinUrl: "",
        punchoutCamera: "",
        punchoutUrl: ""
      });

      return {
        ...prevState,
        cameraDetails: updatedCameras
      };
    });

    setCurrentCameraIndex(prev => prev + 1);
  };

  return (
    <Grid container sx={{ width: "100vw", height: "100vh" }} spacing={0}>
      <Backdrop open={isLoading} style={{ zIndex: 9999, color: "#fff" }}>
        <CircularProgress color={"primary"} />
      </Backdrop>
      <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <img src={attImg} alt="Setup" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 10 }} />
      </Grid>

      <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: 4 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ color: "#00D1A3", fontWeight: "bold" }}>
            ATTENDANCE TRACKER
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1C214F" }}>
            Setup Details
          </Typography>

          <TextField
            required
            fullWidth
            label="Email Address"
            variant="outlined"
            onChange={(e) => handleEmailChange(e.target.value)}
            error={!!emailError}
            helperText={emailError}
          />
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="h6"
              sx={{ color: "#1C214F", fontWeight: "bold", marginRight: 10 }}
            >
              Camera details
            </Typography>
            <>
              {currentCameraIndex > 0 && (
                <IconButton onClick={() => handleCameraIndexChange(-1)}>
                  <ArrowLeftIcon
                    sx={{ fontSize: "20px", color: "#252C58" }}
                  />
                </IconButton>
              )}
              <Typography
                variant="body1"
                sx={{ color: "#1C214F", fontWeight: "bold" }}
              >
                LOCATION {currentCameraIndex + 1}
              </Typography>
              {currentCameraIndex < cameraurlData.cameraDetails.length - 1 && (
                <IconButton onClick={() => handleCameraIndexChange(1)}>
                  <ArrowRightIcon
                    sx={{ fontSize: "20px", color: "#252C58" }}
                  />
                </IconButton>
              )}
              {currentCameraIndex > 0 && (
                <IconButton
                  onClick={() => handleDeleteCameraClick(currentCameraIndex)}
                >
                  <DeleteIcon sx={{ fontSize: "20px", color: "red" }} />
                </IconButton>
              )}
            </>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Typography sx={{ color: "#1C214F", fontWeight: "Normal" }}>
              Punch in Camera
            </Typography>
            <Tooltip
              title={
                <Typography sx={{ fontSize: '14px', p: 1, whiteSpace: 'nowrap' }}>
                  Unique name for Punch in Camera.e.g., 'North block'.
                </Typography>
              }
              arrow
              PopperProps={{
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, 8],
                    },
                  },
                ],
              }}
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: '#fff',
                    color: '#000',
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                    maxWidth: 'none',
                    padding: '10px 12px',
                    boxShadow: 3,
                    border: '1px solid #ccc',
                  },
                },
                arrow: {
                  sx: {
                    color: '#fff',
                  },
                },
              }}
            >
              <HelpOutlineIcon sx={{ color: "#1C214F", cursor: "pointer", fontSize: "18px" }} />
            </Tooltip>
          </Box>
          <TextField
            fullWidth
            // label="Punchin Camera"
            variant="outlined"
            value={cameraurlData.cameraDetails[currentCameraIndex].punchinCamera}
            onChange={(e) => handleInputChange(currentCameraIndex, 'punchinCamera', e.target.value)}
            error={!!errors[`punchinCamera${currentCameraIndex}`]}
            helperText={errors[`punchinCamera${currentCameraIndex}`]}
            required
          />


          <Box display="flex" alignItems="center" gap={1}>
            <Typography sx={{ color: "#1C214F", fontWeight: "Normal" }}>
              Punch in URL
            </Typography>
            <Tooltip
              title={
                <Typography sx={{ fontSize: '14px', p: 1, whiteSpace: 'nowrap' }}>
                  URL used to record punch in time.
                </Typography>
              }
              arrow
              PopperProps={{
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, 8],
                    },
                  },
                ],
              }}
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: '#fff',
                    color: '#000',
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                    maxWidth: 'none',
                    padding: '10px 12px',
                    boxShadow: 3,
                    border: '1px solid #ccc',
                  },
                },
                arrow: {
                  sx: {
                    color: '#fff',
                  },
                },
              }}
            >
              <HelpOutlineIcon sx={{ color: "#1C214F", cursor: "pointer", fontSize: "18px" }} />
            </Tooltip>
          </Box>
          <TextField
            required
            fullWidth
            // label="Punch-In URL"
            variant="outlined"
            value={cameraurlData.cameraDetails[currentCameraIndex].punchinUrl}
            onChange={(e) => handleInputChange(currentCameraIndex, 'punchinUrl', e.target.value)}
            error={!!errors[`punchinUrl${currentCameraIndex}`]}
            helperText={errors[`punchinUrl${currentCameraIndex}`]}
          />

          <Box display="flex" alignItems="center" gap={1}>
            <Typography sx={{ color: "#1C214F", fontWeight: "Normal" }}>
              Punch out Camera
            </Typography>
            <Tooltip
              title={
                <Typography sx={{ fontSize: '14px', p: 1, whiteSpace: 'nowrap' }}>
                  Unique name for Punch out Camera.e.g., 'North block'.
                </Typography>
              }
              arrow
              PopperProps={{
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, 8],
                    },
                  },
                ],
              }}
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: '#fff',
                    color: '#000',
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                    maxWidth: 'none',
                    padding: '10px 12px',
                    boxShadow: 3,
                    border: '1px solid #ccc',
                  },
                },
                arrow: {
                  sx: {
                    color: '#fff', // arrow matches tooltip background
                  },
                },
              }}
            >
              <HelpOutlineIcon sx={{ color: "#1C214F", cursor: "pointer", fontSize: "18px" }} />
            </Tooltip>
          </Box>
          <TextField
            fullWidth
            required
            // label="Punchout Camera"
            variant="outlined"
            value={cameraurlData.cameraDetails[currentCameraIndex].punchoutCamera}
            onChange={(e) => handleInputChange(currentCameraIndex, 'punchoutCamera', e.target.value)}
            error={!!errors[`punchoutCamera${currentCameraIndex}`]}
            helperText={errors[`punchoutCamera${currentCameraIndex}`]}
          />

          <Box display="flex" alignItems="center" gap={1}>
            <Typography sx={{ color: "#1C214F", fontWeight: "Normal" }}>
              Punch out URL
            </Typography>
            <Tooltip
              title={
                <Typography sx={{ fontSize: '14px', p: 1, whiteSpace: 'nowrap' }}>
                  URL used to record punch out time.
                </Typography>
              }
              arrow
              PopperProps={{
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, 8],
                    },
                  },
                ],
              }}
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: '#fff',
                    color: '#000',
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                    maxWidth: 'none',
                    padding: '10px 12px',
                    boxShadow: 3,
                    border: '1px solid #ccc',
                  },
                },
                arrow: {
                  sx: {
                    color: '#fff',
                  },
                },
              }}
            >
              <HelpOutlineIcon sx={{ color: "#1C214F", cursor: "pointer", fontSize: "18px" }} />
            </Tooltip>
          </Box>
          <TextField
            required
            fullWidth
            // label="Punch-Out URL"
            variant="outlined"
            value={cameraurlData.cameraDetails[currentCameraIndex].punchoutUrl}
            onChange={(e) => handleInputChange(currentCameraIndex, 'punchoutUrl', e.target.value)}
            error={!!errors[`punchoutUrl${currentCameraIndex}`]}
            helperText={errors[`punchoutUrl${currentCameraIndex}`]}
          />
          <Button
            variant="outlined"
            disabled={isDisable}
            sx={{
              color: "#00D1A3",
              border: "2px dashed #00D1A3",
              width: "250px",
              "&:hover": { borderColor: "#00A685" },
              mt: 2
            }}
            onClick={handleAddCameraClick}
          >
            <Typography>+ Add another camera</Typography>
          </Button>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "end", mt: 2 }}>
          <Button
            variant='contained'
            sx={{ bgcolor: "#00D1A3", '&:hover': { bgcolor: '#00D1A3' }, width: "200px" }}
            onClick={handleSave}
            disabled={isDisable}
          >
            Save
          </Button>
        </Box>
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
