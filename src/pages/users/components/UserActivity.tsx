import React from 'react'
import { Box, Typography } from '@mui/material'
import { AttendanceDataResponseModel, AttendanceListModel } from '@/pages/dashboard/models/attendancetracker'

interface IProps {
  todayPunchDetail: AttendanceDataResponseModel
}

const UserActivity: React.FC<IProps> = ({ todayPunchDetail }) => {
  return (
    <Box sx={{ height: "305px", width: "45%", boxShadow: 3, borderRadius: 3, padding: 2, margin:2 }}>
      <Typography sx={{ color: "#1C214F", fontWeight: "bold" }} variant='h6'>Today activity</Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mt: 2,
          overflowY: 'auto',
          height: '80%',
        }}
      >
        {todayPunchDetail &&
          todayPunchDetail.attendanceList?.map((detail: AttendanceListModel, index: any) => (
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
                  {detail.punchIn}
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
                  {detail.punchOut}
                </Typography>
              </Box>
            </Box>
          ))}
      </Box>
    </Box>
  )
}

export default UserActivity