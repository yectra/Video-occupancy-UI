import attImg from '@/assets/attendancecamera.jpg'
import { Box, Button, Grid, TextField, Typography } from '@mui/material'

const AttendanceSetupView = () => {
  return (
    <Grid container sx={{ width: "100vw", height: "100vh" }} spacing={0}>
      <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <img src={attImg} alt="Setup" style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 10 }} />
      </Grid>
      <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: 4, gap: 6 }}>
        <Box sx={{display:"flex",flexDirection:"column",gap:3}}>
        <Typography variant="h4" gutterBottom sx={{ color: "#00D1A3", fontWeight: "bold" }}>
          ATTENDANCE TRACKER
        </Typography>
        <Typography variant="h6" sx={{ color: "#1C214F", fontWeight: "bold", marginRight: 10 }}>
              Setup details
        </Typography>
        <TextField
        label="PunchIN URL">
        </TextField>
        <TextField
        label="PunchOUT URL">
        </TextField>
        <Button variant='contained' sx={{bgcolor:"#00D1A3","&:hover": { backgroundColor: "#00A685" }}}>SAVE</Button>
        </Box>
    </Grid>
    </Grid>
  )
}

export default AttendanceSetupView