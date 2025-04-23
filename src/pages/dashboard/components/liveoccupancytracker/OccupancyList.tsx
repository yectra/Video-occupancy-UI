import React, { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Typography, CircularProgress, Backdrop, Select, MenuItem, Popover, Button } from '@mui/material';

import { format } from 'date-fns';
import { DateRange } from "react-date-range";
import 'react-calendar/dist/Calendar.css';
import '@/styles/core/components/CalendarStyles.css';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import "react-datepicker/dist/react-datepicker.css";

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
    const [noRecordsMessage, setNoRecordsMessage] = useState<string | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [loading, setLoading] = useState(true);
    const [filterOption, setFilterOption] = useState("today");
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const customButtonRef = React.useRef<HTMLDivElement | null>(null);
    const [popoverOpen, setPopoverOpen] = useState(false);

    const attendanceTracker = new OccupancyTracker();

    const handleFilterChange = (e: any) => {
        const value = e.target.value;
        setFilterOption(value);

        if (value === "custom") {
            setAnchorEl(customButtonRef.current);
            setPopoverOpen(true);
        } else {
            setPopoverOpen(false);
            setAnchorEl(null);
            const data = {
                period: value
            }
            handleDateChange(data)
        }
    };

    const handleClosePopover = () => {
        setPopoverOpen(false);
        setAnchorEl(null);
    };

    const handleCustomChange = () => {
        handleClosePopover();

        if (dateRange[0] && dateRange[1] && dateRange[0] !== dateRange[1]) {
            const value =
            {
                start_date: format(dateRange[0], 'yyyy-MM-dd'),
                end_date: format(dateRange[1], 'yyyy-MM-dd')
            }
            handleDateChange(value)
        }
    };

    const handleDateChange = (value: any) => {
        setLoading(true);
        attendanceTracker.getPersonCountByDate(value).then((response) => {
            let occupancyResponse = response.data;
            setNoRecordsMessage(occupancyResponse.camera_data.length ? null : "No records found.");
            setOccupancyResponse(occupancyResponse);
        }).finally(() => setLoading(false));
    }

    useEffect(() => {
        const value = {
            date: new Date().toLocaleDateString("en-CA")
        }
        setLoading(true)
        attendanceTracker.getPersonCountByDate(value).then((response) => {
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
                <Box ref={customButtonRef}>
                    <Select
                        value={filterOption}
                        onChange={handleFilterChange}
                        sx={{
                            height: 40,
                            minWidth: 150,
                            fontSize: '1rem',
                            paddingX: 2,
                        }}
                    >
                        <MenuItem value="today">Today</MenuItem>
                        <MenuItem value="yesterday">Yesterday</MenuItem>
                        <MenuItem value="week">This Week</MenuItem>
                        <MenuItem value="month">This Month</MenuItem>
                        <MenuItem
                            value="custom"
                            onClick={() => {
                                if (filterOption === "custom") {
                                    setDateRange([null, null]);
                                    setAnchorEl(customButtonRef.current);
                                    setPopoverOpen(true);
                                }
                            }}
                        >
                            Custom
                        </MenuItem>
                    </Select>
                </Box>
                <Popover
                    open={popoverOpen}
                    anchorEl={anchorEl}
                    onClose={handleClosePopover}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <Box p={2} sx={{ maxWidth: 320 }}>
                        <DateRange
                            direction="vertical"
                            editableDateInputs={true}
                            onChange={(item: any) => setDateRange([item.selection.startDate, item.selection.endDate])}
                            moveRangeOnFirstSelection={false}
                            ranges={[{
                                startDate: dateRange[0] || new Date(),
                                endDate: dateRange[1] || new Date(),
                                key: "selection",
                            }]}
                            maxDate={new Date()}
                        />

                        <Box display="flex" justifyContent="flex-end" mt={2}>
                            <Button variant="contained" onClick={handleCustomChange}>
                                Apply
                            </Button>
                        </Box>
                    </Box>
                </Popover>
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
