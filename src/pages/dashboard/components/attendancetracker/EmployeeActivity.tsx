import React, { useState } from 'react';
import { Box, Typography, IconButton, Popper, TextField, InputAdornment} from '@mui/material';
import TodayIcon from '@mui/icons-material/Today';
import Calendar, { CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import '@/styles/core/components/CalendarStyles.css';

const EmployeeActivity: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setCalendarOpen((prev) => !prev);
  };

  const handleDateChange: CalendarProps['onChange'] = (date: any) => {
    if (Array.isArray(date)) {
      setSelectedDate(date.length > 0 ? date[0] : null);
    } else {
      setSelectedDate(date);
    }
    setCalendarOpen(false);
  };

  return (
    <Box sx={{ height: "305px", width: "540px", boxShadow: 3, borderRadius: 3, padding: 3, display: 'flex', justifyContent: 'space-between' }}>
      <Typography sx={{ color: "#1C214F", fontWeight: "bold" }} variant='h6'>Today activity</Typography>
      <Box>
      <TextField variant="outlined"
          label="Date"
          value={selectedDate ? selectedDate.toLocaleDateString() : ''}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={handleIconClick}>
                  <TodayIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Popper open={calendarOpen} anchorEl={anchorEl} placement="bottom">
          <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px', backgroundColor: 'white' }}>
            <Calendar
              onChange={handleDateChange}
              value={selectedDate || new Date()}
              className="custom-calendar"
            />
          </div>
        </Popper>
      </Box>
    </Box>
  );
}

export default EmployeeActivity;
