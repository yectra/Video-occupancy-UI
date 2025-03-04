import { useEffect, useState } from "react";
import { Backdrop, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, MenuItem, Slider, styled, Table, TableBody, TableCell, tableCellClasses, TableHead, TableRow, TextField, Typography } from "@mui/material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

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
    const [isDisableSetup, setIsDisableSetup] = useState<boolean>(true);
    const [loading, setLoading] = useState(true);
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
                getCameraDetails();
                setIsDisableSetup(true);
            })
            .catch((error) =>
                console.error("Error updating employee details:", error)
            )
            .finally(() => setLoading(false));
        setRowIndex(0)
        // setVideoSource(new CameraDetailsModel());

    }

    const handleEditClick = (index: any) => {
        setRowIndex(index);
        setVideoSource(cameraDetails[index]);
        setEditDialogOpen(true);
    };

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
                [`${name}`]: `${name} Already Exist`,
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
        <Box sx={{ padding: 2 }}>
            <Backdrop open={loading} style={{ zIndex: 9999, color: "#fff" }}>
                <CircularProgress color={"primary"} />
            </Backdrop>
            <Grid item xs={12} md={12}
                sx={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ color: "#00D1A3", fontWeight: "bold" }}>
                    LIVE OCCUPANCY TRACKER
                </Typography>
                <Box component="div" display="flex" flexDirection="row" sx={{ my: 2 }}>
                    <Typography variant="h6" sx={{ color: "#1C214F", fontWeight: "bold", marginRight: 10 }}>
                        Setup details
                    </Typography>
                    <IconButton sx={{ bgcolor: "#00D1A3", color: "white", '&:hover': { bgcolor: "#00A387" }, marginRight: 10 }}
                        onClick={() => setIsDisableSetup(prev => !prev)}
                    >
                        <EditOutlinedIcon />
                    </IconButton>
                    {!isDisableSetup && <Button
                        sx={{ bgcolor: "#00D1A3", "&:hover": { bgcolor: "#00D1A3" } }}
                        variant="contained"
                        onClick={saveSetupDetails}
                    >
                        Save
                    </Button>}
                </Box>
                <Box component="div" display="flex" flexDirection="column" justifyContent="center"
                    sx={{ gap: 4, width: "40%", pl: 6 }}>
                    <Typography sx={{ color: "#1C214F", fontWeight: "Normal" }}>
                        Capacity of people *
                    </Typography>
                    <TextField
                        variant="outlined"
                        value={cameraResponse.capacityOfPeople}
                        disabled={isDisableSetup}
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
                        disabled={isDisableSetup}
                    />
                </Box>
                <Box>
                    <Box component="div" display="flex" flexDirection="row" sx={{ my: 2 }}>
                        <Typography
                            variant="h6"
                            sx={{ color: "#1C214F", fontWeight: "bold", marginRight: 10 }}
                        >
                            Camera details
                        </Typography>
                        <Button
                            sx={{ bgcolor: "#00D1A3", "&:hover": { bgcolor: "#00D1A3" }, marginRight: 10 }}
                            variant="contained"
                            onClick={handleAddCameraClick}
                        >
                            + Add another camera
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
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                {["Camera Identifier", "Camera Position", "videoUrl", "EDIT"].map(
                                    (header) => (
                                        <StyledTableCell key={header} align="center">
                                            {header}
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
                                        <IconButton sx={{ bgcolor: "#00D1A3", color: "white", '&:hover': { bgcolor: "#00A387" } }}
                                            onClick={() => handleEditClick(index)}
                                        >
                                            <EditOutlinedIcon />
                                        </IconButton>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
                <Dialog open={editDialogOpen} onClose={handleDialogClose}>
                    <DialogTitle>Edit Camera Location Details</DialogTitle>
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
                        <Button onClick={() => { openConfirmDialog() }} color="error">
                            Delete
                        </Button>
                        <Button onClick={handleDialogClose}>Cancel</Button>
                        <Button disabled={isDisableSave} color="primary" onClick={handleSave}>
                            Save
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
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDelete}
                            color="error"
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        </Box>
    )
}

export default TrackerSetupUpdateView;
