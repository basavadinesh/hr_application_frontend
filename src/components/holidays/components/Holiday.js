import React, { useEffect, useState,useRef } from 'react';
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
import * as XLSX from 'xlsx';
import {  manageImportError} from '../../core/actions/common-actions';


import { getHolidays, viewHolidayDetails, deleteHoliday } from '../actions/holiday-actions';
import { manageError } from '../../core/actions/common-actions';
import { AppConfigProps } from '../../core/settings/app-config';
import { HolidayMsgResProps } from '../messages/holiday-properties';
import CircularProgress from '@mui/material/CircularProgress';
import { createholidays } from '../actions/holiday-actions';

import AddHoliday from './Addholiday';
import Backdrop from '@mui/material/Backdrop';
import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Input from '@mui/material/Input';
import DownloadIcon from '@mui/icons-material/Download';
import TablePagination from '@mui/material/TablePagination';


// Styled Components
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

const columnBorderStyle = {
    borderRight: '1px solid #ccc' // Adjust the border color and style as needed
};


export default function Holiday() {
    const _axiosSource = axios.CancelToken.source();
    const _cancelToken = { cancelToken: _axiosSource.token };
    const userRole = JSON.parse(localStorage.getItem('userData'));
    const history = useHistory();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [holidays, setHolidays] = useState(null);
    const [open, setOpen] = React.useState(false);
    const handleOpen = async (event) => {
        if (event === 'add') {
            await setSelectedHolidayDetails(null);
        }
        await setSelectedMethod(event);
        await setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        loadPageData();
        handlePopUpClose();
    };
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedHolidayID, setSelectedHolidayID] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [selectedHolidayDetails, setSelectedHolidayDetails] = useState(null);
    const [isLoading, setLoading] = useState(false); 
    const popUpOen = Boolean(anchorEl);
    
    // Handle popup actions
    const handlePopUpClick = (event, holidayid) => {
        setSelectedHolidayID(holidayid);
        setAnchorEl(event.currentTarget);
    };
    
    const handlePopUpClose = () => {
        setAnchorEl(null);
    };

    // Load holidays data
    const loadPageData = async () => {
        await getHolidays(_cancelToken)
            .then(async (res) => {
                if (
                    res &&
                    res.status === AppConfigProps.httpStatusCode.ok &&
                    res.data &&
                    res.data
                ) {
                   
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

    // Fetch holidays on component mount
    useEffect(() => {
        loadPageData();
    }, []);


    // Handle delete holiday
    const deleteHolidays = async () => {
        let holidayId = selectedHolidayID;
        await deleteHoliday(holidayId, _cancelToken)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok) {
                    loadPageData();
                    handlePopUpClose();
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            });
    };

    // Handle edit holiday
    const handleEditHoliday = async () => {
        let holidayId = selectedHolidayID;
        await viewHolidayDetails(holidayId, _cancelToken)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    setSelectedHolidayDetails(res.data);
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            });
        await handleOpen('edit');
    };
 

    // Date formatting utilities
    const getDayOfWeek = (dateString) => {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const date = new Date(dateString);
        const dayOfWeek = date.getDay();
        return daysOfWeek[dayOfWeek];
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = getMonthName(date.getMonth());
        const day = date.getDate();
        return `${year} ${month} ${day}`;
    };

    const getMonthName = (month) => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[month];
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

    const filteredHolidays = holidays
        ? holidays.filter((holiday) => {
              const searchString = `${holiday.name} ${holiday.holidaydate} ${getDayOfWeek(holiday.holidaydate)} ${getMonthName(new Date(holiday.holidaydate).getMonth())} `;
              return searchString.toLowerCase().includes(searchQuery.toLowerCase());
          })
        : [];

        const pagenatedHolidays = filteredHolidays.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

        // Export to CSV
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

        const fileInputRef = useRef(null);

        // Handle file import
        const handleImportClick = () => {
            fileInputRef.current?.click();
        };
    
        
        const handleFileImport = async (file) => {
            try {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(sheet);
                    processHolidaysData(jsonData);
                };
                reader.readAsArrayBuffer(file);
            } catch (error) {
                console.error('Error importing file:', error);
            }
        };

        const formatExcelDate = (excelDate) => {
            if (excelDate === null || excelDate === undefined) {
                return null;
            }
    
            // Convert Excel date to JavaScript date
            const jsDate = new Date((excelDate - (25567 + 2)) * 86400 * 1000);
            // Format the date as MM/DD/YYYY
            const formattedDate = `${
                jsDate.getMonth() + 1
            }/${jsDate.getDate()}/${jsDate.getFullYear()}`;
            return formattedDate;
        };
    
        const processHolidaysData = async (jsonData) => {
            console.log(jsonData);
            setLoading(true);
            let errors = [];
    
            try {
                const promises = jsonData.map(async (row) => {
                    const transformedData = {
                       
                        name: row['Title'],
                        holidaydate: formatExcelDate(row['Holiday Date'])
                       
                      
                    
                    };
    
                    try {
                        const res = await createholidays(transformedData, _cancelToken);
                        if (!res || res.status !== AppConfigProps.httpStatusCode.ok || !res.data) {
                            const errorDetails = await manageImportError(res, history);
                            errors.push(errorDetails);
                        }
                    } catch (err) {
                        const errorDetails = await manageImportError(err, history);
                        errors.push(errorDetails);
                    }
                });
    
                await Promise.all(promises);
            } catch (error) {
                const errorDetails = {
                    path: 'processing loop',
                    statusCode: error.status,
                    message: error.message
                };
                errors.push(errorDetails);
            } finally {
                setLoading(false);
                if (errors.length > 0) {
                    // Store errors in a way that the error page can access them
                    localStorage.setItem('processingErrors', JSON.stringify(errors));
                    history.push('/importError');
                } else {
                    window.location.reload();
                }
            }
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
              
                variant='outlined'
             
                startIcon={<DownloadIcon style={{ fontSize: 12 }} />}
            >
                Export to CSV
            </Button>
      { userRole.role === 'ADMIN' ? <Button
            variant='outlined'
            onClick={() => handleOpen('add')}
            style={{
                color: '#F06D4B',
                borderColor: '#F06D4B',
                float: 'right',
                marginBottom: '10px',
                borderRadius: '40px'
            }}
        >
            + Add Holiday
        </Button> : ''}

        {userRole.role === "ADMIN" && (
        <Button
          onClick={handleImportClick}
          style={{
            color: '#F06D4B',
            borderColor: '#F06D4B',
            float: 'right',
            marginBottom: '10px',
            borderRadius: '40px',
            marginRight: '10px',
          }}
          variant='outlined'
          startIcon={<DownloadIcon style={{ fontSize: 12 }} />}
        >
          {isLoading ? (
            <>
              <CircularProgress
                size={10}
                variant='indeterminate'
                color='inherit'
                style={{
                  borderColor: '#F06D4B',
                  marginRight: '8px',
                  borderRadius: '50%',
                }}
              />
              Importing Data...
            </>
          ) : (
            'Import Data'
          )}
        </Button>
      )}
            <input
                type='file'
                ref={fileInputRef}
                onChange={(event) => {
                    const files = event.target.files;
                    if (files && files.length > 0) {
                        handleFileImport(files[0]);
                    }
                }}
                style={{ display: 'none' }}
            />
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label='customized table'>
                    <TableHead sx={{ backgroundColor:"#E7E9EA"}}>
                        <TableRow>
                        {userRole.role === 'ADMIN' ? <StyledTableCell style={columnBorderStyle}>
                                {HolidayMsgResProps.body.form.action.label}
                            </StyledTableCell> : ''}
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

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pagenatedHolidays && pagenatedHolidays.length > 0 ? (
                            pagenatedHolidays.map((holiday, index) => (
                                <StyledTableRow key={index}>
                                {  userRole.role === 'ADMIN' ? <StyledTableCell component='th' scope='row' style={columnBorderStyle}>
                                    &nbsp;&nbsp;&nbsp; <MoreVertIcon
                                            aria-describedby={holiday.id}
                                            id={holiday.id}
                                            onClick={(event) => handlePopUpClick(event, holiday.id)}
                                        />
                                        <Popover
                                            style={{ marginLeft: '20px' }}
                                            id={holiday.id}
                                            open={popUpOen}
                                            anchorEl={anchorEl}
                                            onClose={handlePopUpClose}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left'
                                            }}
                                        >
                                            <MenuList dense>
                                                <MenuItem
                                                    onClick={() => {
                                                        handleEditHoliday();
                                                    }}
                                                >
                                                    <EditIcon />{' '}
                                                    <ListItemText inset className='pl-5'>
                                                        Edit
                                                    </ListItemText>
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={() => {
                                                        deleteHolidays();
                                                    }}
                                                >
                                                    <DeleteIcon />{' '}
                                                    <ListItemText inset className='pl-5'>
                                                        Delete
                                                    </ListItemText>
                                                </MenuItem>
                                            </MenuList>
                                        </Popover>
                                    </StyledTableCell> : ''}
                                    <StyledTableCell style={columnBorderStyle}>{index + 1}</StyledTableCell>
                                    <StyledTableCell component='th' scope='row' style={columnBorderStyle}>
                                        {holiday.name ? holiday.name : '-'}
                                    </StyledTableCell>
                                    {/* <StyledTableCell component='th' scope='row'>
                                        {holiday.holidaydate ? holiday.holidaydate : '-'}
                                    </StyledTableCell> */}
                                     <StyledTableCell component='th' scope='row' style={columnBorderStyle}>
                                        {/* {holiday.holidaydate
                                            ? AppUtils.getDateFormat(holiday.holidaydate)
                                            : '-'} */}
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

            <AddHoliday
                open={open}
                handleClose={handleClose}
                Backdrop={Backdrop}
                method={selectedMethod}
                holidayDetails={selectedHolidayDetails}
            />
        </div>
    );
}
