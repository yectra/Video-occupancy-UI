// React Dependancies
import { useEffect, useState } from "react";

import { Backdrop, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, styled, Table, TableBody, TableCell, tableCellClasses, TableHead, TableRow, TextField, Typography } from "@mui/material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

// Services
import { AttendanceDetails } from "../../services/attendancetracker";

// Models
import { AttendanceCameraDetailsModel, AttendanceTrackerDetailsModel } from "../../models/attendancetracker";

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

const AttendanceSetupUpdateView: React.FC = () => {
    const [cameraDetails, setCameraDetails] = useState<AttendanceCameraDetailsModel[]>([]);
    const [organizationResponse, setOrganizationResponse] = useState<AttendanceTrackerDetailsModel>(new AttendanceTrackerDetailsModel());
    const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
    const [cameraData, setCameraData] = useState<AttendanceCameraDetailsModel>(new AttendanceCameraDetailsModel())
    const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
    const [rowIndex, setRowIndex] = useState<number>(0);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isDisable, setIsDisable] = useState<boolean>(false);
    const [isDisableSave, setIsDisableSave] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const openConfirmDialog = () => setConfirmDialogOpen(true);
    const closeConfirmDialog = () => setConfirmDialogOpen(false);

    const attendanceTracker = new AttendanceDetails();

    useEffect(() => {
        getCameraDetails();
    }, []);

    useEffect(() => {
        if (!organizationResponse?.organizationData?.organizationName ||
            !organizationResponse?.organizationData?.phoneNumber ||
            !organizationResponse?.organizationData?.websiteUrl ||
            errors?.email || errors?.phoneNumber || errors?.websiteUrl)
            setIsDisable(true);
        else
            setIsDisable(false);
    }, [organizationResponse]);


    useEffect(() => {
        if (!cameraData.punchinCamera || !cameraData.punchinUrl || !cameraData.punchoutCamera || !cameraData.punchoutUrl)
            setIsDisableSave(true);
        else
            setIsDisableSave(false);
    }, [cameraData]);

    const getCameraDetails = () => {
        setLoading(true);
        attendanceTracker.getAttendanceTrackerDetails().then((response: AttendanceTrackerDetailsModel) => {
            setOrganizationResponse(response);
            setCameraDetails(response?.cameraData?.cameraDetails ?? []);
            setErrors({});
        })
            .finally(() => setLoading(false));

    }

    const updateCameraDetails = (updatedData: AttendanceTrackerDetailsModel) => {
        setEditDialogOpen(false);
        setLoading(true)
        attendanceTracker
            .updateAttendanceTrackerDetails(updatedData)
            .then(() => {
                getCameraDetails();
            })
            .catch((error) =>
                console.error("Error updating employee details:", error)
            )
            .finally(() => setLoading(false));
        setRowIndex(0)
    }

    const validateEmail = (email: string): boolean => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePhoneNumber = (value: string) => {
        const phoneRegex = /^[0-9]{7,15}$/;
        return phoneRegex.test(value);
    };

    const validateWebsiteURL = (value: string) => {
        const urlRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+)(\/[^\s]*)?$/;
        return urlRegex.test(value);
    };

    const handleEditClick = (index: any) => {
        setRowIndex(index);
        setCameraData(cameraDetails[index]);
        setEditDialogOpen(true);
    };

    const handleDialogClose = () => {
        setRowIndex(0);
        setEditDialogOpen(false);
    };

    const handleOrganizationInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if ((name === "email" && !validateEmail(value)) ||
            (name === "phoneNumber" && !validatePhoneNumber(value)) ||
            (name === "websiteUrl" && !validateWebsiteURL(value))
        )
            setErrors((prevErrors) => ({
                ...prevErrors,
                [`${name}`]: `Enter Valid ${name}`,
            }));
        else
            setErrors((prevErrors) => ({
                ...prevErrors,
                [`${name}`]: '',
            }));
       
        setOrganizationResponse(prevState => {
            if (name === "email") {
                return {
                    ...prevState,
                    cameraData: {
                        ...prevState.cameraData,
                        email: value
                    }
                };
            } else {
                return {
                    ...prevState,
                    organizationData: {
                        ...prevState.organizationData,
                        [name]: value
                    }
                };
            }
        });

    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        const allExistingUrls = cameraDetails.flatMap((setup) =>
            [setup.punchinUrl, setup.punchoutUrl]
        );

        const isDuplicateAcrossCameras = allExistingUrls.includes(value);

        if (isDuplicateAcrossCameras) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [`${name}`]: `${name} Already Exist`,
            }));
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [`${name}`]: '',
            }));
            setCameraData(prevData => ({
                ...prevData,
                [name]: value
            }));

            setCameraDetails(prev => {
                if (!Array.isArray(prev)) return [];
                return prev.map((item, index) =>
                    index === rowIndex ? { ...item, [name]: value } : item
                );
            });
        }
    };

    const handleSave = () => {
        setOrganizationResponse(prevState => {
            const updatedCameraDetails = Array.isArray(prevState.cameraData.cameraDetails)
                ? [...prevState.cameraData.cameraDetails]
                : [];


            if (rowIndex < updatedCameraDetails.length) {
                updatedCameraDetails[rowIndex] = { ...cameraData };
            } else {
                updatedCameraDetails.push({ ...cameraData });
            }
            const updatedResponse = {
                ...prevState,
                cameraData: {
                    ...prevState.cameraData,
                    cameraDetails: updatedCameraDetails
                }
            };

            updateCameraDetails(updatedResponse);
            return updatedResponse;
        });

        setEditDialogOpen(false);
    };

    const handleDelete = () => {
        const updatedCameraDetails = cameraDetails.filter((_, index) => index !== rowIndex);
        setCameraDetails(updatedCameraDetails);

        setOrganizationResponse(prevState => ({
            ...prevState,
            cameraData: {
                ...prevState.cameraData,
                cameraDetails: updatedCameraDetails
            }
        }));

        closeConfirmDialog();
        updateCameraDetails({
            ...organizationResponse,
            cameraData: {
                ...organizationResponse.cameraData,
                cameraDetails: updatedCameraDetails
            }
        });
    };

    const handleAddCameraClick = () => {
        const newCamera: AttendanceCameraDetailsModel = {
            punchinCamera: "",
            punchinUrl: "",
            punchoutCamera: "",
            punchoutUrl: ""
        };

        setOrganizationResponse(prevState => ({
            ...prevState,
            cameraData: {
                ...prevState.cameraData,
                cameraDetails: [...(prevState.cameraData?.cameraDetails ?? []), newCamera]
            }
        }));

        setRowIndex((organizationResponse.cameraData?.cameraDetails?.length ?? 0));
        setCameraData(newCamera);
        setEditDialogOpen(true);
    };

    const saveSetupDetails = () => {
        updateCameraDetails(organizationResponse);
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
                    ATTENDANCE TRACKER
                </Typography>
                <Box component="div" display="flex" flexDirection="row">
                    <Typography variant="h6" sx={{ color: "#1C214F", fontWeight: "bold", marginRight: 5 }}>
                        Setup details
                    </Typography>
                </Box>
                {/* <Box component="div" display="flex" flexDirection="column" justifyContent="center"
                    sx={{ gap: 2, width: "40%", pl: 6 }}>         */}
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Typography sx={{ color: "#1C214F", fontWeight: "Normal" }}>
                            Organization Name *
                        </Typography>
                        <TextField
                            variant="outlined"
                            value={organizationResponse?.organizationData?.organizationName}
                            name="organizationName"
                            onChange={handleOrganizationInputChange}
                            sx={{ width: "80%" }}
                            required
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography sx={{ color: "#1C214F", fontWeight: "Normal" }}>
                            Phone Number *
                        </Typography>
                        <TextField
                            variant="outlined"
                            value={organizationResponse?.organizationData?.phoneNumber}
                            name="phoneNumber"
                            onChange={handleOrganizationInputChange}
                            sx={{ width: "80%" }}
                            required
                            error={!!errors[`phoneNumber`]}
                            helperText={errors[`phoneNumber`]}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography sx={{ color: "#1C214F", fontWeight: "Normal" }}>
                            Website URL *
                        </Typography>
                        <TextField
                            variant="outlined"
                            value={organizationResponse?.organizationData?.websiteUrl}
                            name="websiteUrl"
                            onChange={handleOrganizationInputChange}
                            sx={{ width: "80%" }}
                            required
                            error={!!errors[`websiteUrl`]}
                            helperText={errors[`websiteUrl`]}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography sx={{ color: "#1C214F", fontWeight: "Normal" }}>
                            Email
                        </Typography>
                        <TextField
                            variant="outlined"
                            value={organizationResponse?.cameraData?.email}
                            name="email"
                            onChange={handleOrganizationInputChange}
                            sx={{ width: "80%" }}
                            required
                            error={!!errors[`email`]}
                            helperText={errors[`email`]}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography sx={{ color: "#1C214F", fontWeight: "Normal" }}>
                            Address
                        </Typography>
                        <TextField
                            variant="outlined"
                            value={organizationResponse?.organizationData?.address}
                            name="address"
                            onChange={handleOrganizationInputChange}
                            sx={{ width: "80%" }}
                            multiline
                            rows={2}
                            required
                        />
                    </Grid>
                </Grid>
                {/* </Box> */}
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
                        </Box>
                    </Box>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                {["Punchin Camera", "Punchin Url", "Punchout Camera", "Punchout Url", "EDIT"].map(
                                    (header) => (
                                        <StyledTableCell key={header} align="center">
                                            {header.toUpperCase()}
                                        </StyledTableCell>
                                    )
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(cameraDetails) && cameraDetails.map((row: any, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell align="center">{row.punchinCamera}</StyledTableCell>
                                    <StyledTableCell align="center">{row.punchinUrl}</StyledTableCell>
                                    <StyledTableCell align="center">{row.punchoutCamera}</StyledTableCell>
                                    <StyledTableCell align="center">{row.punchoutUrl}</StyledTableCell>
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
                    <Box sx={{ display: "flex", justifyContent: "flex-end", my: 3 }}>
                        <Button
                            sx={{
                                bgcolor: "#00D1A3",
                                "&:hover": { bgcolor: "#00D1A3" },
                                minWidth: "200px"
                            }}
                            variant="contained"
                            onClick={saveSetupDetails}
                            disabled={isDisable}
                        >
                            <Typography>Save</Typography>
                        </Button>
                    </Box>
                </Box>
                <Dialog open={editDialogOpen} onClose={handleDialogClose}>
                    <DialogTitle>Edit Camera Location Details</DialogTitle>
                    <DialogContent>
                        <DialogTextField
                            label="Punchin Camera *"
                            value={cameraData?.punchinCamera || ""}
                            name="punchinCamera"
                            onChange={handleInputChange}
                            error={!!errors[`punchinCamera`]}
                            helperText={errors[`punchinCamera`]}
                        />
                        <DialogTextField
                            label="Punchin Url *"
                            value={cameraData?.punchinUrl || ""}
                            name="punchinUrl"
                            onChange={handleInputChange}
                            error={!!errors[`punchinUrl`]}
                            helperText={errors[`punchinUrl`]}
                        />
                        <DialogTextField
                            label="Punchout Camera *"
                            value={cameraData?.punchoutCamera || ""}
                            name="punchoutCamera"
                            onChange={handleInputChange}
                            error={!!errors[`punchoutCamera`]}
                            helperText={errors[`punchoutCamera`]}
                        />
                        <DialogTextField
                            label="Punchout Url *"
                            value={cameraData?.punchoutUrl || ""}
                            name="punchoutUrl"
                            onChange={handleInputChange}
                            error={!!errors[`punchoutUrl`]}
                            helperText={errors[`punchoutUrl`]}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { openConfirmDialog() }} color="error">
                            <Typography>Delete</Typography>
                        </Button>
                        <Button onClick={handleDialogClose}><Typography>Cancel</Typography></Button>
                        <Button disabled={isDisableSave} color="primary" onClick={handleSave}>
                            <Typography>Save</Typography>
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={confirmDialogOpen} onClose={closeConfirmDialog}>
                    <DialogTitle sx={{ bgcolor: "green", color: "white" }}>Confirm</DialogTitle>
                    <DialogContent>
                        <Typography sx={{ pt: 2 }}>
                            Are you sure want to delete?
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
        </Box>
    )
}

export default AttendanceSetupUpdateView;
