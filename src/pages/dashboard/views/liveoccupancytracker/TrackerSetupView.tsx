import React, { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Typography,
    MenuItem,
    Select,
    FormControl,
    SelectChangeEvent,
    IconButton,
    Button,
    Popper,
    Paper,
    Grid,
    Slider,
    Tooltip,
    InputLabel,
} from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import DeleteIcon from "@mui/icons-material/Delete";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import setupImg from "@/assets/survillance.jpg";
import { useNavigate } from "react-router-dom";

const TrackerSetupView: React.FC = () => {
    const [capacity, setCapacity] = useState<string>("");
    const [alertMessage, setAlertMessage] = useState<string>("90%");
    const [sliderValue, setSliderValue] = useState<number>(90);
    const [isDisable, setIsDisable] = useState<boolean>(false)
    const [cameraSetups, setCameraSetups] = useState<any[]>([
        { entranceName: "", cameraPosition: "INSIDE-OUT", videoSource: "" },
    ]);
    const [currentCameraIndex, setCurrentCameraIndex] = useState<number>(0);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [coordinates] = useState<any>({});
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [tooltipContent, setTooltipContent] = useState<string>("");
    const marks = [
        {
            value: 0,
            label: '0%',
        },
        {
            value: 50,
            label: '50%',
        },
        {
            value: 100,
            label: '100%',
        }
    ];

    const navigate = useNavigate();

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
        if (!capacity || !alertMessage || cameraSetups.find((i) => i.entranceName === '' || i.videoSource === ''))
            setIsDisable(true)
        else
            setIsDisable(false)
    }, [capacity, alertMessage, cameraSetups]);

    const handleCameraIndexChange = (delta: number) =>
        setCurrentCameraIndex((prev) =>
            Math.min(Math.max(prev + delta, 0), cameraSetups.length - 1)
        );

    const handleChangeTextField =
        (index: number, field: any) =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                const newValue = event.target.value;
                setCameraSetups((prev) => {
                    const isDuplicate = prev.some(
                        (setup, i) => i !== index && setup[field] === newValue
                    );
                    if (isDuplicate) {
                        setErrors((prevErrors) => ({
                            ...prevErrors,
                            [`${field}${index}`]: `${field.replace(/([A-Z])/g, ' $1').replace(/^./, (str: any) => str.toUpperCase())} Already Exist`,
                        }));
                        return prev;
                    }
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        [`${field}${index}`]: "",
                    }));

                    const updated = [...prev];
                    updated[index][field] = event.target.value;
                    return updated;
                });
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

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        if (event && typeof newValue === "number") {
            setAlertMessage(`${newValue}%`);
            setSliderValue(newValue)
        }
    };

    return (
        <Grid container sx={{ maxWidth: "100vw", maxHeight: "100vh" }} spacing={0}>
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
                        objectFit: "cover",
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
                    gap: 2,
                }}
            >
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ color: "#00D1A3", fontWeight: "bold" }}
                >
                    LIVE OCCUPANCY TRACKER
                </Typography>
                <Typography
                    variant="h6"
                    sx={{ color: "#1C214F", fontWeight: "bold", marginRight: 10, mb:2 }}
                >
                    Setup details
                </Typography>
                <Box
                    component="form"
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                    <Box display="flex" alignItems="center" gap={1}>
                        <Typography sx={{ color: "#1C214F", fontWeight: "Normal" }}>
                            Capacity of people
                        </Typography>
                        <Tooltip
                            title={
                                <Typography sx={{ fontSize: '14px', p: 1, whiteSpace: 'nowrap' }}>
                                   Max number of people allowed in the space.
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
                    <Box display="flex" alignItems="center" gap={1}>
                        <Typography sx={{ color: "#1C214F", fontWeight: "Normal" }}>
                            Alert When Capacity Reaches
                        </Typography>
                        <Tooltip
                            title={
                                <Typography sx={{ fontSize: '14px', p: 1, whiteSpace:"nowrap" }}>
                                    Get alerted when occupancy hits this percentage.
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
                    <Slider
                        aria-label="Custom marks"
                        value={sliderValue}
                        onChange={handleSliderChange}
                        step={5}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `${value}%`}
                        marks={marks}
                    />
                    {/* <FormControl
                  variant="outlined"
                  fullWidth
                  error={!!errors.alertMessage}
                  required
                >
                  <InputLabel id="alert-message-label">
                    Alert When Capacity Reaches
                  </InputLabel>
                  <Select
                    labelId="alert-message-label"
                    label="Alert When Capacity Reaches"
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
                </FormControl> */}
                    <Box sx={{ display: "flex", alignItems: "center", my:1 }}>
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
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Typography sx={{ color: "#1C214F", fontWeight: "Normal" }}>
                            Camera Identifier
                        </Typography>
                        <Tooltip
                            title={
                                <Typography sx={{ fontSize: '14px', p: 1, whiteSpace:"nowrap" }}>
                                   Unique name for this camera.e.g., 'North block'.
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
                    <FormControl variant="outlined" fullWidth required sx={{mt:3, mb:1}}>
                        {/* <Typography sx={{ color: "#1C214F", fontWeight: "Normal", mb: 2 }}>
                            Camera Position
                        </Typography> */}
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
                    <Box display="flex" alignItems="center" gap={1}>
                        <Typography sx={{ color: "#1C214F", fontWeight: "Normal" }}>
                            URL of the video source
                        </Typography>
                        <Tooltip
                            title={
                                <Typography sx={{ fontSize: '14px', p: 1, whiteSpace:"nowrap" }}>
                                    Provide the URL that streams video from this camera.
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
                            mt:2
                        }}
                        onClick={handleAddCameraClick}
                    >
                        <Typography>+ Add another camera</Typography>
                    </Button>
                    <Box
                        sx={{
                            marginTop: 2,
                            alignItems: "center",
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={isDisable}
                            onClick={handlePreview}
                            sx={{
                                width: "150px",
                                height: "50px",
                                backgroundColor: "#00D1A3",
                                "&:hover": { backgroundColor: "#00A685" },
                                marginLeft: "auto",
                                display: "block",
                            }}
                        >
                            <Typography>Preview</Typography>
                        </Button>
                    </Box>
                </Box>
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
