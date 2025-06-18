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
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LinkIcon from '@mui/icons-material/Link';
import HomeIcon from '@mui/icons-material/Home';
import { AttendanceTracker } from '@/pages/dashboard/services/attendancetracker';
import { OrganizationSetup } from '@/pages/dashboard/models/attendancetracker';
import orgBg from '@/assets/orgBg.jpg';

const OrganizationView: React.FC = () => {
  const attendanceService = new AttendanceTracker();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<OrganizationSetup>({
    organizationName: '',
    phoneNumber: '',
    websiteUrl: '',
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: null,
    workTiming: null
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
      !formData.workTiming ||
      !formData.street || !formData.city || !formData.state || !formData.zipCode || !formData.country ||
      errors?.phoneNumber || errors?.websiteUrl || errors?.workTiming ||
      errors?.street || errors?.city || errors?.state || errors?.zipCode || errors?.country)
      setIsDisable(true);
    else
      setIsDisable(false);
  }, [formData]);

  const validatePhoneNumber = (value: string) => {
    const phoneRegex = /^(\+91[\-\s]?[6-9]\d{9}|0?[6-9]\d{9}|\+1[\-\s]?\(?[2-9]\d{2}\)?[\-\s]?[2-9]\d{2}[\-\s]?\d{4})$/;
    // const phoneRegex = /^\+1 \(\d{3}\) \d{3}-\d{4}$|^\+91 \d{5}-\d{5}$/;
    return phoneRegex.test(value);
  };

  // const validateWebsiteURL = (value: string) => {
  //   const urlRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+(com|net|org|gov|edu|in|co\.in|io|info|biz)(\/[^\s]*)?$/i;
  //   return urlRegex.test(value);
  // };

  const validateWebsiteURL = (value: string) => {
    const urlRegex = /^(https?:\/\/)?www\.([a-zA-Z0-9-]+\.)+(com|net|org|gov|edu|in|co\.in|io|info|biz)(\/[^\s]*)?$/i;
    return urlRegex.test(value);
  };

  const validateWorkingHours = (value: string) => {
    const hoursRegex = /^(?:[1-9]|1[0-9]|2[0-4])$/;
    return hoursRegex.test(value);
  };

  const validateStreet = (value: string) => {
    const streetRegex = /^[a-zA-Z0-9\s,'-]{3,}$/;
    return streetRegex.test(value);
  };
  const validateCityState = (value: string) => {
    const cityRegex = /^[a-zA-Z\s]{2,}$/;
    return cityRegex.test(value);
  };

  const validateZipCode = (value: string) => {
    const zipRegex = /^([1-9][0-9]{5}|[0-9]{5})$/;
    return zipRegex.test(value);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if ((name === "phoneNumber" && !validatePhoneNumber(value)) ||
      (name === "websiteUrl" && !validateWebsiteURL(value)) ||
      (name === "workTiming" && !validateWorkingHours(value)) ||
      (name === "street" && !validateStreet(value)) ||
      ((name === "city" || name === "state" || name === "country") && !validateCityState(value)) ||
      (name === "zipCode" && !validateZipCode(value))
    )
      setErrors((prevErrors) => ({
        ...prevErrors,
        [`${name}`]: `Enter Valid ${name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}`,
      }));
    else
      setErrors((prevErrors) => ({
        ...prevErrors,
        [`${name}`]: '',
      }));
    setFormData({ ...formData, [name]: value });
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = /[0-9()+\-\s]/;
    const controlKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Delete"];

    if (!allowedKeys.test(event.key) && !controlKeys.includes(event.key)) {
      event.preventDefault();
    }
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
      }).catch((error) => {
        setSnackbarMessage(error.response.data.warn);
        setSnackbarSeverity('error');
        setSnackbarOpen(true)
      }).finally(() => setLoading(false));
  };

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
          required
          fullWidth
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
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
          type="text"
          required
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
          label="Working Hours"
          variant="outlined"
          required
          fullWidth
          name="workTiming"
          value={formData.workTiming}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          error={!!errors[`workTiming`]}
          helperText={errors[`workTiming`]}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccessTimeIcon sx={{ color: 'black' }} />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{
            style: { color: 'black', fontWeight: 'bold' },
          }}
        />

        <Box sx={{ px: 2, pb: 3, mt: 0, borderRadius: 2, boxShadow: 1, backgroundColor: '#fff' }}>
          <Box display="flex" alignItems="center" mb={2}>
            <HomeIcon sx={{ color: 'black', mr: 1 }} />
            <Typography variant="subtitle1">Address Details</Typography>
          </Box>
          <Grid container spacing={3} >
            <Grid item xs={12} sm={12}>
              <TextField
                label="Street"
                variant="outlined"
                required
                fullWidth
                name="street"
                value={formData.street}
                onChange={handleChange}
                error={!!errors[`street`]}
                helperText={errors[`street`]}
                InputLabelProps={{
                  style: { color: 'black', fontWeight: 'Normal' },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="City"
                variant="outlined"
                required
                fullWidth
                name="city"
                value={formData.city}
                onChange={handleChange}
                error={!!errors[`city`]}
                helperText={errors[`city`]}
                InputLabelProps={{
                  style: { color: 'black', fontWeight: 'Normal' },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="State"
                variant="outlined"
                required
                fullWidth
                name="state"
                value={formData.state}
                onChange={handleChange}
                error={!!errors[`state`]}
                helperText={errors[`state`]}
                InputLabelProps={{
                  style: { color: 'black', fontWeight: 'Normal' },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Country"
                variant="outlined"
                required
                fullWidth
                name="country"
                value={formData.country}
                onChange={handleChange}
                error={!!errors[`country`]}
                helperText={errors[`country`]}
                InputLabelProps={{
                  style: { color: 'black', fontWeight: 'Normal' },
                }}
              />
            </Grid>


            <Grid item xs={12} sm={6}>
              <TextField
                label="ZipCode"
                variant="outlined"
                required
                fullWidth
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                error={!!errors[`zipCode`]}
                helperText={errors[`zipCode`]}
                InputLabelProps={{
                  style: { color: 'black', fontWeight: 'Normal' },
                }}
              />
            </Grid>
          </Grid>
        </Box>

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
