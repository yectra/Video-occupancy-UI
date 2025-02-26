import React, { useState, useEffect } from "react";
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
  Button,
  Popper,
  Paper,
  Grid,
  FormHelperText,
} from "@mui/material";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import DeleteIcon from "@mui/icons-material/Delete";
import setupImg from "@/assets/survillance.jpg";
import { useNavigate, useLocation } from "react-router-dom";

const TrackerSetupView: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [capacity, setCapacity] = useState<string>("");
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [isDisable, setIsDisable] = useState<boolean>(false)
  const [cameraSetups, setCameraSetups] = useState<any[]>([
    { entranceName: "", cameraPosition: "INSIDE-OUT", videoSource: "" },
  ]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState<number>(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [coordinates, setCoordinates] = useState<any>({});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tooltipContent, setTooltipContent] = useState<string>("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.onbeforeunload = () => {
      setCapacity("");
      setAlertMessage("");
      setCameraSetups([
        { entranceName: "", cameraPosition: "INSIDE-OUT", videoSource: "" },
      ]);
      setCurrentCameraIndex(0);
      setErrors({});
    };
  }, []);

  useEffect(() => {
    if (location.state) {
      const { cameraSetups, alertMessage, capacity, coordinates, step } =
        location.state;
      if (cameraSetups) setCameraSetups(cameraSetups);
      if (alertMessage) setAlertMessage(alertMessage);
      if (capacity) setCapacity(capacity.toString());
      if (coordinates) setCoordinates(coordinates);
      if (step) setStep(step);
    }
  }, [location.state]);

  useEffect(() => {
    if (step === 2 && cameraSetups.find((i) => i.entranceName === '' || i.videoSource === ''))
      setIsDisable(true)
    else
      setIsDisable(false)
  }, [step, cameraSetups])

  const handleStepChange = (newStep: number) => {
    if (newStep === 2 && !validateStep1()) return;
    setStep(newStep as 1 | 2);
  };

  const handleCameraIndexChange = (delta: number) =>
    setCurrentCameraIndex((prev) =>
      Math.min(Math.max(prev + delta, 0), cameraSetups.length - 1)
    );

  const handleChangeTextField =
    (index: number, field: any) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setCameraSetups((prev) => {
          const updated = [...prev];
          updated[index][field] = event.target.value;
          return updated;
        });
        setErrors((prev) => ({ ...prev, [field]: "" }));
      };

  const handleChangeSelectField =
    (index: number, field: any) => (event: SelectChangeEvent<string>) => {
      setCameraSetups((prev) => {
        const updated = [...prev];
        updated[index][field] = event.target.value;
        return updated;
      });
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const handleAddCameraClick = () => {
    setCameraSetups((prev) => [
      ...prev,
      { entranceName: "", cameraPosition: "INSIDE-OUT", videoSource: "" },
    ]);
    setCurrentCameraIndex(cameraSetups.length);
  };

  const handleDeleteCameraClick = (index: number) => {
    const updatedCameras = cameraSetups.filter((_, i) => i !== index);
    setCameraSetups(updatedCameras);
    if (currentCameraIndex >= updatedCameras.length) {
      setCurrentCameraIndex(Math.max(0, updatedCameras.length - 1));
    }
  };

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!capacity) newErrors.capacity = "Capacity is required";
    if (!alertMessage) newErrors.alertMessage = "Alert message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreview = () => {
    navigate("/dashboard/occupancy-tracker/preview", {
      state: {
        cameraSetups,
        alertMessage,
        capacity,
        coordinates,
      },
    });
  };

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLElement>,
    content: string
  ) => {
    setAnchorEl(event.currentTarget);
    setTooltipContent(content);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
    setTooltipContent("");
  };

  return (
    <Grid container sx={{ width: "100vw", height: "100vh" }} spacing={0}>
      <Grid
        item
        xs={12}
        md={6}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <img
          src={setupImg}
          alt="Setup"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            borderRadius: 10,
          }}
        />
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 4,
          gap: 6,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "#00D1A3", fontWeight: "bold" }}
        >
          LIVE OCCUPANCY TRACKER
        </Typography>
        <>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {step === 2 && (
              <IconButton
                onClick={() => handleStepChange(1)}
                sx={{ marginRight: 2 }}
              >
                <ArrowCircleLeftOutlinedIcon
                  sx={{ fontSize: "30px", color: "#252C58" }}
                />
              </IconButton>
            )}
            <Typography
              variant="h6"
              sx={{ color: "#1C214F", fontWeight: "bold", marginRight: 10 }}
            >
              Setup details
            </Typography>
            {step === 2 && (
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
                {currentCameraIndex < cameraSetups.length - 1 && (
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
            )}
          </Box>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 4 }}
          >
            {step === 1 ? (
              <>
                <TextField
                  label="Capacity of people"
                  variant="outlined"
                  value={capacity}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) && value.length <= 8) {
                      setCapacity(value);
                      setErrors((prev) => ({ ...prev, capacity: "" }));
                    } else if (!/^\d*$/.test(value)) {
                      setErrors((prev) => ({
                        ...prev,
                        capacity: "Only numbers are allowed",
                      }));
                    } else if (value.length > 8) {
                      setErrors((prev) => ({
                        ...prev,
                        capacity: "Capacity cannot exceed 8 digits",
                      }));
                    }
                  }}
                  fullWidth
                  error={!!errors.capacity}
                  helperText={
                    errors.capacity ? (
                      <Typography sx={{ fontSize: "12px" }}>{errors.capacity}</Typography>
                    ) : null
                  }
                  required
                />

                <FormControl
                  variant="outlined"
                  fullWidth
                  error={!!errors.alertMessage}
                  required
                >
                  <InputLabel id="alert-message-label">
                    Alert when capacity reaches
                  </InputLabel>
                  <Select
                    labelId="alert-message-label"
                    label="Alert when capacity reaches"
                    value={alertMessage}
                    onChange={(e: SelectChangeEvent<string>) => {
                      setAlertMessage(e.target.value);
                      setErrors((prev) => ({ ...prev, alertMessage: "" }));
                    }}
                  >
                    {Array.from({ length: 5 }, (_, i) => (
                      <MenuItem key={i} value={`${i * 20}-${i * 20 + 20}`}>
                        {`${i * 20}-${i * 20 + 20}`}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.alertMessage && (
                    <FormHelperText sx={{ fontSize: "12px" }}>
                      {errors.alertMessage}
                    </FormHelperText>
                  )}
                </FormControl>
              </>
            ) : (
              <>
                <TextField
                  label="Camera Identifier"
                  variant="outlined"
                  value={cameraSetups[currentCameraIndex].entranceName}
                  onChange={handleChangeTextField(
                    currentCameraIndex,
                    "entranceName"
                  )}
                  fullWidth
                  error={!!errors[`entranceName${currentCameraIndex}`]}
                  helperText={errors[`entranceName${currentCameraIndex}`]}
                  required
                />
                <FormControl variant="outlined" fullWidth required>
                  <InputLabel id="camera-position-label">
                    Camera Position
                  </InputLabel>
                  <Select
                    labelId="camera-position-label"
                    value={cameraSetups[currentCameraIndex].cameraPosition}
                    onChange={handleChangeSelectField(
                      currentCameraIndex,
                      "cameraPosition"
                    )}
                    label="Camera Position"
                  >
                    <MenuItem
                      value="INSIDE-OUT"
                      onMouseEnter={(e) =>
                        handleMouseEnter(
                          e,
                          "Camera installed inside the entrance and facing the door. People entering are facing the camera, while those leaving are not."
                        )
                      }
                      onMouseLeave={handleMouseLeave}
                    >
                      INSIDE-OUT
                    </MenuItem>
                    <MenuItem
                      value="OUTSIDE-IN"
                      onMouseEnter={(e) =>
                        handleMouseEnter(
                          e,
                          "Camera installed outside the entrance and facing the door. People entering are not facing the camera, while those leaving are."
                        )
                      }
                      onMouseLeave={handleMouseLeave}
                    >
                      OUTSIDE-IN
                    </MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="URL of the video source"
                  variant="outlined"
                  value={cameraSetups[currentCameraIndex].videoSource}
                  onChange={handleChangeTextField(
                    currentCameraIndex,
                    "videoSource"
                  )}
                  fullWidth
                  error={!!errors[`videoSource${currentCameraIndex}`]}
                  helperText={errors[`videoSource${currentCameraIndex}`]}
                  required
                />
                <Button
                  variant="outlined"
                  disabled={isDisable}
                  sx={{
                    color: "#00D1A3",
                    border: "2px dashed #00D1A3",
                    width: "250px",
                    "&:hover": { borderColor: "#00A685" },
                  }}
                  onClick={handleAddCameraClick}
                >
                  + Add another camera
                </Button>
              </>
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 2,
                alignItems: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: "#1C214F", fontWeight: "bold" }}
              >
                Step <strong>{step}/2</strong>
              </Typography>
              <Button
                variant="contained"
                color="primary"
                disabled={isDisable}
                onClick={() =>
                  step === 2 ? handlePreview() : handleStepChange(2)
                }
                sx={{
                  width: "150px",
                  height: "50px",
                  backgroundColor: "#00D1A3",
                  "&:hover": { backgroundColor: "#00A685" },
                }}
              >
                {step === 1 ? "Next" : "Preview"}
              </Button>
            </Box>
          </Box>
        </>
        <Popper open={!!anchorEl} anchorEl={anchorEl} placement="right">
          <Paper sx={{ padding: 1, maxWidth: 300 }}>
            <Typography>{tooltipContent}</Typography>
          </Paper>
        </Popper>
      </Grid>
    </Grid>
  );
};

export default TrackerSetupView;
