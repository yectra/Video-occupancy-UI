import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import LinkIcon from '@mui/icons-material/Link';
import HomeIcon from '@mui/icons-material/Home';
import { AttendanceDetails } from '@/pages/dashboard/services/attendancetracker';
import { OrganizationSetup } from '@/pages/dashboard/models/attendancetracker';
import orgBg from '@/assets/orgBg.jpg';

const OrganizationView: React.FC = () => {
  const attendanceService = new AttendanceDetails();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<OrganizationSetup>({
    organizationName: '',
    phoneNumber: '',
    websiteUrl: '',
    domainName: '',
    address: '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  // const [isNextEnabled, setIsNextEnabled] = useState(false);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (!formData.organizationName ||
      !formData.phoneNumber ||
      !formData.websiteUrl ||
      errors?.phoneNumber || errors?.websiteUrl)
      setIsDisable(true);
    else
      setIsDisable(false);
  }, [formData]);

  const validatePhoneNumber = (value: string) => {
    const phoneRegex = /^[0-9]{7,15}$/;
    return phoneRegex.test(value);
  };

  const validateWebsiteURL = (value: string) => {
    const urlRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+)(\/[^\s]*)?$/;
    return urlRegex.test(value);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if ((name === "phoneNumber" && !validatePhoneNumber(value)) ||
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
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    attendanceService.organizationDetails(formData)
      .then(() => {
        setSnackbarMessage('Organization details saved successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        navigate('/dashboard/attendance/attendance-setup');
      }).catch(() => {
        setSnackbarMessage('Failed to save organization details.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true)
      }).finally(() => setLoading(false));

    // try {
    //   const response = await attendanceService.organizationDetails(formData);
    //   setSnackbarMessage('Organization details saved successfully!');
    //   setSnackbarSeverity('success');
    //   setSnackbarOpen(true);
    //   console.log(response);
    //   // setIsNextEnabled(true);
    //   navigate('/dashboard/attendance/attendance-setup');

    // } catch (error) {
    //   console.error('Error saving organization details:', error);
    //   setSnackbarMessage('Failed to save organization details.');
    //   setSnackbarSeverity('error');
    //   setSnackbarOpen(true);
    // }
  };

  // const handleNext = () => {
  //   if (isNextEnabled) {
  //     // navigate('/dashboard/occupancy-tracker/attendance-setup');
  //     navigate('/dashboard/attendance/attendance-setup');
  //   }
  // };

  const handleSnackbarClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundImage: `url(${orgBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: 4,
      }}
    >
      <Backdrop open={loading} style={{ zIndex: 9999, color: "#fff" }}>
        <CircularProgress color={"primary"} />
      </Backdrop>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography sx={{ fontWeight: 'bold', color: '#00D1A3' }} variant="h4">
          Attendance Tracking Setup
        </Typography>
        <Typography variant="h6">
          Please provide your organization details
        </Typography>
      </Box>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '40%',
          minHeight: '60vh',
          gap: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: 2,
          padding: 3,
        }}
      >
        <TextField
          label="Organization Name"
          variant="outlined"
          required
          fullWidth
          name="organizationName"
          value={formData.organizationName}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CorporateFareIcon sx={{ color: 'black' }} />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{
            style: { color: 'black', fontWeight: 'bold' },
          }}
        />
        <TextField
          label="Phone Number"
          variant="outlined"
          type="tel"
          fullWidth
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          error={!!errors[`phoneNumber`]}
          helperText={errors[`phoneNumber`]}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <ContactPhoneIcon sx={{ color: 'black' }} />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{
            style: { color: 'black', fontWeight: 'bold' },
          }}
        />
        <TextField
          label="Website URL"
          variant="outlined"
          type="url"
          fullWidth
          name="websiteUrl"
          value={formData.websiteUrl}
          onChange={handleChange}
          error={!!errors[`websiteUrl`]}
          helperText={errors[`websiteUrl`]}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LinkIcon sx={{ color: 'black' }} />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{
            style: { color: 'black', fontWeight: 'bold' },
          }}
        />
        <TextField
          label="Address"
          variant="outlined"
          fullWidth
          multiline
          rows={2}
          name="address"
          value={formData.address}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment
                position="start"
                sx={{ alignItems: 'flex-start', marginTop: '8px' }}
              >
                <HomeIcon sx={{ color: 'black' }} />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{
            style: { color: 'black', fontWeight: 'bold' },
          }}
          sx={{
            '.MuiOutlinedInput-root': {
              alignItems: 'flex-start',
            },
          }}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Button
            type="submit"
            variant="contained"
            sx={{
              fontWeight: 'bold',
              padding: 1,
              width: '200px',
              bgcolor: "#00D1A3", '&:hover': { bgcolor: '#00D1A3' }
            }}
            disabled={isDisable}
          >
            <Typography>Submit</Typography>
          </Button>
          {/* <Button
            variant="contained"
            sx={{
              fontWeight: 'bold',
              padding: 1,
              width: '200px',
              bgcolor: isNextEnabled ? '#00D1A3' : '#B0BEC5',
              '&:hover': isNextEnabled
                ? { bgcolor: '#00B089' }
                : { bgcolor: '#B0BEC5' },
            }}
            onClick={handleNext}
            disabled={!isNextEnabled}
          >
            <Typography>Next</Typography>
          </Button> */}
        </Box>
      </Box>
      {/* Snackbars */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OrganizationView;
