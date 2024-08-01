import React from 'react'
import { Box, Typography } from '@mui/material'

const UserActivity:React.FC = () => {
  return (
    <Box sx={{height:"305px",width:"540px",boxShadow:3,borderRadius:3,padding:3}}>
        <Typography sx={{color:"#1C214F",fontWeight:"bold"}} variant='h6'>Today activity</Typography>
    </Box>
  )
}

export default UserActivity