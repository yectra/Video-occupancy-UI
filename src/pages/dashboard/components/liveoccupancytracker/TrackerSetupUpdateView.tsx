import { useEffect, useState } from "react";
import { Alert, Backdrop, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, MenuItem, Slider, Snackbar, styled, Table, TableBody, TableCell, tableCellClasses, TableHead, TableRow, TextField, Typography } from "@mui/material";

//Icons
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";

// Services
import { OccupancyTracker } from "@/pages/dashboard/services/liveoccupancytracker";

//Model
import { BackendPayload, CameraDetailsModel } from "../../models/liveoccupanytracker";

//Router
import { useLocation, useNavigate } from "react-router-dom";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: { fontSize: 14 },
    borderRight: `1px solid ${theme.palette.divider}`,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover },
}));

const DialogTextField = ({
    label,
    value,
    name,
    onChange,
    disabled = false,
    select = false,
    error,
    helperText,
    children,
}: any) => (
    <TextField
        margin="dense"
        label={label}
        type="text"
        fullWidth
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        select={select}
        error={error}
        helperText={helperText}
    >
        {children}
    </TextField>
);

const TrackerSetupUpdateView: React.FC = () => {
    const [cameraResponse, setCameraResponse] = useState<BackendPayload>(new BackendPayload())
    const [cameraDetails, setCameraDetails] = useState<any[]>([])
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [videoSource, setVideoSource] = useState<CameraDetailsModel>(new CameraDetailsModel())
    const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
    const [rowIndex, setRowIndex] = useState<number>(0);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isDisableSave, setIsDisableSave] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
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

    const openConfirmDialog = () => setConfirmDialogOpen(true);
    const closeConfirmDialog = () => setConfirmDialogOpen(false);

    const occupancyTracker = new OccupancyTracker();

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        getCameraDetails();
    }, []);

    useEffect(() => {
        if (videoSource.entranceName === '' || videoSource.videoUrl === '')
            setIsDisableSave(true)
        else
            setIsDisableSave(false)
    }, [videoSource]);

    useEffect(() => {
        if (location.state && location.state.payload) {
            updateCameraDetails(location.state.payload);
        }
    }, [location.state]);

    const getCameraDetails = () => {
        setLoading(true);
        occupancyTracker.getCameraUrls().then((response: any) => {
            let cameraResponse = response.data;
            cameraResponse.cameraDetails = cameraResponse.cameraDetails.map((i: any) => ({
                ...i,
                cameraPosition: i.cameraPosition.toUpperCase()
            }));
            setCameraResponse(cameraResponse);
            setCameraDetails(cameraResponse.cameraDetails);
            setErrors({});
        })
            .finally(() => setLoading(false));
    }

    const updateCameraDetails = (updatedData: BackendPayload) => {
        updatedData.cameraDetails = updatedData.cameraDetails.map((i: any) => ({
            ...i,
            cameraPosition: i.cameraPosition.toLowerCase()
        }));
        setEditDialogOpen(false);
        setLoading(true)
        occupancyTracker
            .updateCameraDetails(updatedData)
            .then(() => {
                setSnackbarMessage('Occupancy Details updated successfully!');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);

                getCameraDetails();
            })
            .catch((error) => {
                setSnackbarMessage(error.response.data.warn);
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            })
            .finally(() => setLoading(false));
        setRowIndex(0)
        // setVideoSource(new CameraDetailsModel());

    }

    const handleCloseSnackbar = (
        _event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleEditClick = (index: any) => {
        setRowIndex(index);
        setVideoSource(cameraDetails[index]);
        setEditDialogOpen(true);
    };

    const handleDeleteClick = (index: any) => {
        setRowIndex(index);
        setVideoSource(cameraDetails[index]);
        openConfirmDialog();
    }

    const handleDialogClose = () => {
        setRowIndex(0);
        setEditDialogOpen(false);
        // setVideoSource(new CameraDetailsModel());
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        let isDuplicate = cameraDetails.some((camera, i) =>
            i !== rowIndex && (camera[name] === value)
        );
        if (isDuplicate) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [`${name}`]: `${name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} Already Exist`,
            }));
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [`${name}`]: '',
            }));
            setVideoSource((prev: any) => {
                const updatedVideoSource = prev ? { ...prev, [name]: value } : null;
                return updatedVideoSource;
            });
        }
    };

    const handleCameraPositionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setVideoSource((prev: any) =>
            prev ? { ...prev, cameraPosition: event.target.value as string } : null
        );
    };

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        if (event && typeof newValue === "number") {
            setCameraResponse(prevState => ({
                ...prevState,
                alertMessage: `${newValue}%`
            }));
        }
    };

    const handleSave = () => {
        const updatedCameraResponse = {
            ...cameraResponse,
            cameraDetails: cameraResponse.cameraDetails.map((camera, index) =>
                index === rowIndex
                    ? {
                        ...camera,
                        entranceName: videoSource.entranceName,
                        cameraPosition: videoSource.cameraPosition,
                        videoUrl: videoSource.videoUrl
                    }
                    : camera
            )
        };

        setCameraResponse(updatedCameraResponse);
        updateCameraDetails(updatedCameraResponse);
    };

    const handleDelete = () => {
        const updatedCameraResponse = {
            ...cameraResponse,
            cameraDetails: cameraResponse.cameraDetails.filter((_, index) => index !== rowIndex)
        };
        setCameraResponse(updatedCameraResponse);
        closeConfirmDialog();
        updateCameraDetails(updatedCameraResponse);
    };

    const handleAddCameraClick = () => {
        const newCamera: CameraDetailsModel = {
            entranceName: "",
            cameraPosition: "INSIDE-OUT",
            videoUrl: "",
            doorCoordinates: []
        };

        setCameraResponse(prevState => ({
            ...prevState,
            cameraDetails: [...prevState.cameraDetails, newCamera]
        }));

        setRowIndex(cameraResponse.cameraDetails.length);
        setVideoSource(newCamera);
        setEditDialogOpen(true);
    };

    const updateCapacityAndAlert = (newCapacity: number) => {
        setCameraResponse(prevState => ({
            ...prevState,
            capacityOfPeople: newCapacity
        }));
    };

    const saveSetupDetails = () => {
        updateCameraDetails(cameraResponse);
    }

    const updateSetCoordinates = () => {
        navigate("/dashboard/occupancy-tracker/preview", {
            state: {
                cameraResponse
            },
        });
    }

    return (
        <Box sx={{
            mt: 4,
            height: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
        }}>
            <Backdrop open={loading} style={{ zIndex: 9999, color: "#fff" }}>
                <CircularProgress color={"primary"} />
            </Backdrop>
            <Grid item xs={12} md={12}
                sx={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ color: "#00D1A3", fontWeight: "bold" }}>
                    LIVE OCCUPANCY TRACKER
                </Typography>
                <Box component="div" display="flex" flexDirection="row">
                    <Typography variant="h6" sx={{ color: "#1C214F", fontWeight: "bold", marginRight: 5 }}>
                        Setup details
                    </Typography>
                </Box>
                <Box component="div" display="flex" flexDirection="column" justifyContent="center"
                    sx={{ gap: 2, width: "40%", pl: 6 }}>
                    <Typography sx={{ color: "#1C214F", fontWeight: "Normal" }}>
                        Capacity of people *
                    </Typography>
                    <TextField
                        variant="outlined"
                        value={cameraResponse.capacityOfPeople}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value) && value.length <= 8) {
                                updateCapacityAndAlert(Number(e.target.value))
                            }
                        }}
                        fullWidth
                        required
                    />
                    <Typography sx={{ color: "#1C214F", fontWeight: "Normal" }}>
                        Alert When Capacity Reaches *
                    </Typography>
                    <Slider
                        aria-label="Custom marks"
                        value={parseInt(cameraResponse?.alertMessage?.replace("%", ""), 10)}
                        onChange={handleSliderChange}
                        step={5}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `${value}%`}
                        marks={marks}
                    />
                </Box>
                <Box>
                    <Box component="div" display="flex" flexDirection="row" justifyContent="space-between" sx={{ my: 2 }}>
                        <Typography
                            variant="h6"
                            sx={{ color: "#1C214F", fontWeight: "bold", marginRight: 10 }}
                        >
                            Camera details
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Button
                                sx={{ bgcolor: "#00D1A3", "&:hover": { bgcolor: "#00D1A3" }, marginRight: 5 }}
                                variant="contained"
                                onClick={handleAddCameraClick}
                            >
                                <Typography> + Add another camera</Typography>
                            </Button>
                            <Button
                                sx={{ bgcolor: "#00D1A3", "&:hover": { bgcolor: "#00D1A3" } }}
                                variant="contained"
                                onClick={updateSetCoordinates}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <EditOutlinedIcon />
                                    <Typography>Edit Set Coordinates</Typography>
                                </Box>
                            </Button>
                        </Box>
                    </Box>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                {["Camera Identifier", "Camera Position", "Video Url", "Action"].map(
                                    (header) => (
                                        <StyledTableCell key={header} align="center">
                                            {header.toUpperCase()}
                                        </StyledTableCell>
                                    )
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cameraDetails.map((row: any, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell align="center">{row.entranceName}</StyledTableCell>

                                    <StyledTableCell align="center">{row.cameraPosition}</StyledTableCell>
                                    <StyledTableCell align="center">{row.videoUrl}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                                            <IconButton
                                                sx={{ color: "#00D1A3" }}
                                                onClick={() => handleEditClick(index)}
                                            >
                                                <EditOutlinedIcon />
                                            </IconButton>

                                            <IconButton
                                                sx={{ color: "#FF4D4D" }}
                                                onClick={() => handleDeleteClick(index)}
                                            >
                                                <DeleteOutlineIcon />
                                            </IconButton>
                                        </Box>
                                    </StyledTableCell>
                                    {/* <StyledTableCell align="center">
                                        <IconButton sx={{ bgcolor: "#00D1A3", color: "white", '&:hover': { bgcolor: "#00A387" } }}
                                            onClick={() => handleEditClick(index)}
                                        >
                                            <EditOutlinedIcon />
                                        </IconButton>
                                    </StyledTableCell> */}
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", my: 3 }}>
                        <Button
                            sx={{
                                bgcolor: "#00D1A3",
                                "&:hover": { bgcolor: "#00D1A3" },
                                minWidth: "200px"
                            }}
                            variant="contained"
                            onClick={saveSetupDetails}
                        >
                            <Typography>Save</Typography>
                        </Button>
                    </Box>
                </Box>
                <Dialog open={editDialogOpen} onClose={handleDialogClose}>
                    <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.4rem', position: 'relative', textAlign: 'center' }}>
                        {videoSource?.entranceName ? 'Edit Camera Location Details' : 'Add New Camera Details'}
                        <IconButton
                            aria-label="close"
                            onClick={handleDialogClose}
                            sx={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)' }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <DialogTextField
                            label="Camera Identifier *"
                            value={videoSource?.entranceName || ""}
                            name="entranceName"
                            onChange={handleInputChange}
                            error={!!errors[`entranceName`]}
                            helperText={errors[`entranceName`]}
                        />
                        <DialogTextField
                            label="Camera Position *"
                            value={videoSource?.cameraPosition || ""}
                            name="cameraPosition"
                            onChange={handleCameraPositionChange}
                            select
                        >
                            <MenuItem value="INSIDE-OUT">INSIDE-OUT</MenuItem>
                            <MenuItem value="OUTSIDE-IN">OUTSIDE-IN</MenuItem>
                        </DialogTextField>
                        <DialogTextField
                            label="Video Url *"
                            value={videoSource?.videoUrl || ""}
                            name="videoUrl"
                            onChange={handleInputChange}
                            error={!!errors[`videoUrl`]}
                            helperText={errors[`videoUrl`]}
                        />
                    </DialogContent>
                    <DialogActions>
                        {/* <Button onClick={() => { openConfirmDialog() }} color="error">
                        <Typography>Delete</Typography>
                        </Button> */}
                        {/* <Button onClick={handleDialogClose}><Typography>Cancel</Typography></Button> */}
                        {/* <Button disabled={isDisableSave} color="primary" onClick={handleSave}>
                            <Typography>Save</Typography>
                        </Button> */}
                        <Button
                            sx={{
                                bgcolor: "#00D1A3",
                                "&:hover": { bgcolor: "#00D1A3" },
                                px: 4,
                                mx: 3,
                                mb: 2
                            }}
                            variant="contained"
                            disabled={isDisableSave}
                            onClick={handleSave}
                        >
                            <Typography>Save</Typography>
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={confirmDialogOpen} onClose={closeConfirmDialog}>
                    <DialogTitle sx={{ bgcolor: "green", color: "white" }}>Confirm</DialogTitle>
                    <DialogContent>
                        <Typography sx={{ pt: 2 }}>
                            Are you sure want to delete {videoSource?.entranceName}?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeConfirmDialog} color="primary">
                            <Typography>Cancel</Typography>
                        </Button>
                        <Button
                            onClick={handleDelete}
                            color="error"
                        >
                            <Typography>Delete</Typography>
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default TrackerSetupUpdateView;
