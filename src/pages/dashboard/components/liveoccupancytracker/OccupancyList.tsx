import { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, TextField, Typography, InputAdornment, Popper, IconButton, CircularProgress, Backdrop } from '@mui/material';
import TodayIcon from '@mui/icons-material/Today';
import Calendar, { CalendarProps } from 'react-calendar';
import moment from 'moment';
import 'react-calendar/dist/Calendar.css';
import '@/styles/core/components/CalendarStyles.css';

// Services
import { OccupancyTracker } from "../../services/liveoccupancytracker";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    '&:last-child': {
        borderRight: 'none',
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    }
}));

const OccupancyList: React.FC = () => {
    const [occupancyResponse, setOccupancyResponse] = useState<any>({});
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
    const [noRecordsMessage, setNoRecordsMessage] = useState<string | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [loading, setLoading] = useState(true);
    const attendanceTracker = new OccupancyTracker();


    const handleIconClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setCalendarOpen((prev) => !prev);
    };

    const handleDateChange: CalendarProps['onChange'] = (currentDate: any) => {
        if (Array.isArray(currentDate)) {
            setSelectedDate(currentDate.length > 0 ? currentDate[0] : null);
        } else {
            setSelectedDate(currentDate);
        }
        setLoading(true);
        attendanceTracker.getPersonCountByDate(moment(currentDate).format('YYYY-MM-DD')).then((response) => {
            let occupancyResponse = response.data;
            setNoRecordsMessage(occupancyResponse.camera_data.length ? null : "No records found.");
            setOccupancyResponse(occupancyResponse);
        }).finally(() => setLoading(false));
        setCalendarOpen(false);
    };


    useEffect(() => {
        let date = new Date().toLocaleDateString("en-CA")
        setLoading(true)
        attendanceTracker.getPersonCountByDate(date).then((response) => {
            let occupancyResponse = response.data;
            setNoRecordsMessage(occupancyResponse.camera_data.length ? null : "No records found.");
            setOccupancyResponse(occupancyResponse)
        }).finally(() => setLoading(false));
    }, [])


    return (
        <Paper>
            <Backdrop open={loading} style={{ zIndex: 9999, color: "#fff" }}>
                <CircularProgress color={"primary"} />
            </Backdrop>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 4 }}>
                <Typography sx={{ fontWeight: "bold", color: "#252C58", p: 2 }} variant='h6'>Occupancy List</Typography>
                <TextField
                    variant="outlined"
                    label="Date"
                    value={selectedDate ? selectedDate.toLocaleDateString() : 'Select Date'}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <span>
                                    <IconButton onClick={handleIconClick}>
                                        <TodayIcon />
                                    </IconButton>
                                </span>
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
                            maxDate={new Date()}
                        />
                    </div>
                </Popper>
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">CAMREA ID</StyledTableCell>
                            <StyledTableCell align="center">ENTRIES</StyledTableCell>
                            <StyledTableCell align="center">EXITS</StyledTableCell>
                            <StyledTableCell align="center">NET COUNT</StyledTableCell>
                        </TableRow>
                        {noRecordsMessage && occupancyResponse?.camera_data.length == 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <Typography variant="body2" color="error">{noRecordsMessage}</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableHead>
                    <TableBody>
                        {occupancyResponse?.camera_data?.map((row: any, index: any) => (
                            <StyledTableRow key={index}>
                                <StyledTableCell align="center">{row.camera_id}</StyledTableCell>
                                <StyledTableCell align="center">{row.entries}</StyledTableCell>
                                <StyledTableCell align="center">{row.exits}</StyledTableCell>
                                <StyledTableCell align="center">{row.net_count}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                        {!noRecordsMessage && occupancyResponse?.camera_data?.length && (
                            <StyledTableRow>
                                <StyledTableCell align="center" sx={{ color: "#1C214F", fontWeight: "bold" }}>TOTAL</StyledTableCell>
                                <StyledTableCell align="center" sx={{ color: "#1C214F", fontWeight: "bold" }}>{occupancyResponse.total_entries}</StyledTableCell>
                                <StyledTableCell align="center" sx={{ color: "#1C214F", fontWeight: "bold" }}>{occupancyResponse.total_exits}</StyledTableCell>
                                <StyledTableCell align="center" sx={{ color: "#1C214F", fontWeight: "bold" }}>{occupancyResponse.total_count}</StyledTableCell>
                            </StyledTableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default OccupancyList;
