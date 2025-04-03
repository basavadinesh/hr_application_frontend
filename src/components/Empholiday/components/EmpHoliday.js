import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Button from '@mui/material/Button';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { getHolidays } from '../../holidays/actions/holiday-actions';
import { manageError } from '../../core/actions/common-actions';
import { AppConfigProps } from '../../core/settings/app-config';
import { HolidayMsgResProps } from '../messages/holiday-properties';
import Input from '@mui/material/Input';
import DownloadIcon from '@mui/icons-material/Download';
import TablePagination from '@mui/material/TablePagination';


// Styled components for table cells and rows 
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.gray,
        color: theme.palette.common.black
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14
    }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(even)': {
        backgroundColor: theme.palette.action.hover
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0
    }
}));


// Style for column borders
const columnBorderStyle = {
    borderRight: '1px solid #ccc', // Adjust the border color and style as needed
};

// Main component function
export default function CustomizedTables() {
    const _axiosSource = axios.CancelToken.source();
    const _cancelToken = { cancelToken: _axiosSource.token };
    const history = useHistory();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [holidays, setHolidays] = useState(null);
    const [open, setOpen] = React.useState(false);

    // Open modal for adding or editing holiday
    const handleOpen = async (event) => {
        if (event === 'add') {
            await setSelectedHolidayDetails(null);
        }
        await setSelectedMethod(event);
        await setOpen(true);
    };


    // Close modal and reload data
    const handleClose = () => {
        setOpen(false);
        loadPageData();
        handlePopUpClose();
    };
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedHolidayID, setSelectedHolidayID] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [selectedHolidayDetails, setSelectedHolidayDetails] = useState(null);


    // Handle popup click
    const handlePopUpClick = (event) => {
        setSelectedHolidayID(event.target.id);
        setAnchorEl(event.currentTarget);
    };


    // Close popup
    const handlePopUpClose = () => {
        setAnchorEl(null);
    };

    const popUpOen = Boolean(anchorEl);

    // Load holidays data
    const loadPageData = async () => {
        await getHolidays()
            .then(async (res) => {
                if (
                    res &&
                    res.status === AppConfigProps.httpStatusCode.ok &&
                    res.data &&
                    res.data
                ) {
                    // setHolidays(res.data);
                    // Sort holidays by month
                    const sortedHolidays = res.data.sort((a, b) => {
                        const dateA = new Date(a.holidaydate);
                        const dateB = new Date(b.holidaydate);
                        return dateA - dateB;
                    });
                    setHolidays(sortedHolidays);
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            });
    };

    useEffect(() => {
        loadPageData();
    }, []);


    // Get day of the week for a date string
    const getDayOfWeek = (dateString) => {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const date = new Date(dateString);
        const dayOfWeek = date.getDay();
        return daysOfWeek[dayOfWeek];
    };

    // Format date to a readable string
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = getMonthName(date.getMonth());
        const day = date.getDate();
        return `${year} ${month} ${day}`;
    };


    // Get month name from month index
    const getMonthName = (month) => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[month];
    };

    // Handle search input change
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };


    // Handle page change in pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }


    // Filter holidays based on search query
    const filteredHolidays = holidays
        ? holidays.filter((holiday) => {
              const searchString = `${holiday.name} ${holiday.holidaydate} ${getDayOfWeek(holiday.holidaydate)} ${getMonthName(new Date(holiday.holidaydate).getMonth())} `;
              return searchString.toLowerCase().includes(searchQuery.toLowerCase());
          })
        : [];

    // Paginate filtered holidays
    const pagenatedHolidays = filteredHolidays.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
    

        // Export holidays data to CSV
        const exportToCSV = () => {
            const csvRows = [];
            csvRows.push(
                [
                    '#',
                    HolidayMsgResProps.body.form.name.label,
                    HolidayMsgResProps.body.form.holidaydate.label,
                    HolidayMsgResProps.body.form.holidayday.label,
                ].join(',')
            );
            filteredHolidays.forEach((holiday, index) => {
                const rowData = [
                    index + 1,
                    holiday.name || '-',
                    formatDate(holiday.holidaydate),
                    getDayOfWeek(holiday.holidaydate),
                ];
                csvRows.push(rowData.join(','));
            });
            const csvData = csvRows.join('\n');
            const blob = new Blob([csvData], { type: 'text/csv' });
            const blobUrl = URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = blobUrl;
            anchor.download = 'Holidays_data.csv';
            anchor.click();
            URL.revokeObjectURL(blobUrl);
        };
        
    return (
        <div>
            <Input
                type='text'
                placeholder='Search... Holidays'
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{
                    color: '#0070ac',
                    marginBottom: 2,
                    padding: 1,
                    width: 250, // Adjust the width as needed
                    height:43,
                    borderRadius: 4.1,
                    fontSize: 19,
                    border: '2px solid #0070ac',
                    '&:focus': {
                        borderColor: '#0070ac', // Change color on focus
                        boxShadow: (theme) => `0 0 0 0.2rem ${theme.palette.primary.main}`
                    }
                }}
            />

            <Button
                onClick={exportToCSV}
                style={{
                    marginLeft: '20px',
                    color: '#F06D4B',
                    borderColor: '#F06D4B',
                    float: 'right',
                    marginBottom: '10px',
                    borderRadius: '40px'
                }}
                // variant='contained'
                variant='outlined'
                // color='primary'
                startIcon={<DownloadIcon style={{ fontSize: 12 }} />}
            >
                Export to CSV
            </Button>
            
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label='customized table'>
                    <TableHead sx={{ backgroundColor:"#E7E9EA"}}>
                        <TableRow>
                        <StyledTableCell style={columnBorderStyle}>#</StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {HolidayMsgResProps.body.form.name.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {HolidayMsgResProps.body.form.holidaydate.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {HolidayMsgResProps.body.form.holidayday.label}
                            </StyledTableCell>
                            {/* <StyledTableCell>
                                {HolidayMsgResProps.body.form.action.label}
                            </StyledTableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pagenatedHolidays && pagenatedHolidays.length > 0 ? (
                            pagenatedHolidays.map((holiday, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell style={columnBorderStyle}>{index + 1}</StyledTableCell>
                                    <StyledTableCell component='th' scope='row' style={columnBorderStyle}>
                                        {holiday.name ? holiday.name : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell component='th' scope='row' style={columnBorderStyle}>
                                        {/* {holiday.holidaydate ? holiday.holidaydate : '-'} */}
                                        {formatDate(holiday.holidaydate)}
                                    </StyledTableCell>
                                    <StyledTableCell component='th' scope='row' style={columnBorderStyle}>
                                    {getDayOfWeek(holiday.holidaydate)}
                                    </StyledTableCell>
                                
                                </StyledTableRow>
                            ))
                        ) : (
                            <StyledTableRow>
                                <StyledTableCell>No Data Found.</StyledTableCell>
                            </StyledTableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredHolidays.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </div>
        
    );
    
}
