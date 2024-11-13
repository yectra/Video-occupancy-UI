import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { IndividualTimesheet } from '@/pages/dashboard/models/attendancetracker';
import { AttendanceDetails } from '@/pages/dashboard/services/attendancetracker';
import { useSearchParams } from 'react-router-dom';

const EmployeeActivity: React.FC = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [getEmployeeActivity, setEmployeeActivity] = useState<IndividualTimesheet[]>([]);
  const attendanceDetails = new AttendanceDetails();

  useEffect(() => {
    if (id) {
      attendanceDetails
        .getIndividualEmployeeDetails(id)
        .then((res) => {
          setEmployeeActivity(res);
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [id]);

  return (
    <Box
      sx={{
        height: '305px',
        width: '540px',
        boxShadow: 3,
        borderRadius: 3,
        padding: 3,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography sx={{ color: '#1C214F', fontWeight: 'bold' }} variant='h6'>
        Today activity
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
        {getEmployeeActivity &&
          getEmployeeActivity[0]?.attendanceList?.map((map, index) => (
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
                  {map.punchIn}
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
                  {map.punchOut}
                </Typography>
              </Box>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default EmployeeActivity;
