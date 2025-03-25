import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { IndividualTimesheet } from '@/pages/dashboard/models/attendancetracker';
import { AttendanceDetails } from '@/pages/dashboard/services/attendancetracker';
import { useSearchParams } from 'react-router-dom';

const EmployeeActivity: React.FC = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const date = searchParams.get('date');
  
  const [employeeActivity, setEmployeeActivity] = useState<IndividualTimesheet>()
  const attendanceDetails = new AttendanceDetails();

  useEffect(() => {
    if (id) {
      attendanceDetails
        .getIndividualEmployeeDetails(id)
        .then((response: any) => {
          let employeeActivity = response.data.find((employee: IndividualTimesheet) => employee.date === date)
          setEmployeeActivity(employeeActivity)
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [id]);

  return (
    <Box
      sx={{
        height: '315px',
        width: '45%',
        boxShadow: 3,
        borderRadius: 3,
        padding: 3,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography sx={{ color: '#1C214F', fontWeight: 'bold' }} variant='h6'>
        Activity
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mt: 2,
          overflowY: 'auto',
          height: '100%',
        }}
      >
        {employeeActivity &&
          employeeActivity.attendanceList?.map((timeSheet, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  height: 40,
                  width: 250,
                  bgcolor: '#E6F5EE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Punched In at:
                <Typography component="span" sx={{ fontWeight: 'bold' }}>
                  {timeSheet.punchIn}
                </Typography>
              </Box>
              <Box
                sx={{
                  height: 40,
                  width: 250,
                  bgcolor: '#FBF5E8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Punched Out at:
                <Typography component="span" sx={{ fontWeight: 'bold' }}>
                  {timeSheet.punchOut}
                </Typography>
              </Box>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default EmployeeActivity;
