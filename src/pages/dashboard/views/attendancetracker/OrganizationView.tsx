import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import LinkIcon from '@mui/icons-material/Link';
import DomainIcon from '@mui/icons-material/Domain';
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

  const [phoneError, setPhoneError] = useState(false);
  const [isNextEnabled, setIsNextEnabled] = useState(false);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const validatePhoneNumber = (value: string) => {
    const phoneRegex = /^[0-9]{7,15}$/;
    return phoneRegex.test(value);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'phoneNumber') setPhoneError(!validatePhoneNumber(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneError) {
      setSnackbarMessage('Please fix the errors before submitting.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await attendanceService.organizationDetails(formData);
      setSnackbarMessage('Organization details saved successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      console.log(response);
      setIsNextEnabled(true);

    } catch (error) {
      console.error('Error saving organization details:', error);
      setSnackbarMessage('Failed to save organization details.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleNext = () => {
    if (isNextEnabled) {
      navigate('/dashboard/occupancy-tracker/attendance-setup');
    }
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
          error={phoneError}
          helperText={
            phoneError ? 'Enter a valid phone number (7-15 digits)' : ''
          }
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
          label="Domain Name"
          variant="outlined"
          fullWidth
          name="domainName"
          value={formData.domainName}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <DomainIcon sx={{ color: 'black' }} />
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
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            type="submit"
            variant="outlined"
            sx={{
              fontWeight: 'bold',
              padding: 1,
              width: '200px',
              borderColor: '#00D1A3',
              color: '#00D1A3',
              '&:hover': { borderColor: '#00B089', color: '#00B089' },
            }}
          >
            Submit
          </Button>
          <Button
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
            Next
          </Button>
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
