// Imports for React Library and hooks
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

// Imports for material ui for pre-designed components
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Button from '@mui/material/Button';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
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

// Imports for HTTP requests library and custom API call hooks
import axios from 'axios';
import { getLeave, viewLeaveDetails, deleteLeave } from '../actions/timeoff-actions1';

// Imports for configuration settings and common constants
import { manageError } from '../../core/actions/common-actions';
import AppUtils from '../../core/helpers/app-utils';
import { AppConfigProps } from '../../core/settings/app-config';
import { LeaveMsgResProps } from '../messages/timeoff-properties1';

// Import for Time off form and Modal
import AddTimeoff from './Addtimeoff1';

// Custom style settings for cells and rows in the table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.grey,
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
    '&:last-child td, &:last-child th': {
        border: 0
    }
}));

const columnBorderStyle = {
    borderRight: '1px solid #ccc'
};

// Function to render the list of all employees time-offs
export default function CustomizedTables() {
    // Constants for assigning cancel token
    const _axiosSource = axios.CancelToken.source();
    const _cancelToken = { cancelToken: _axiosSource.token };

    // Constant definition from useHistory hook
    const history = useHistory();

    // Setting Initial state for the list of time-offs
    const [leaveData, setLeaveData] = React.useState(null);

    // Initial State setting for Modal open and close
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const popUpOen = Boolean(anchorEl);

    // initial state setting for search and pagination
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Initial state setting for selected item in the list
    const [selectedLeaveID, setSelectedLeaveID] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [selectedLeaveDetails, setSelectedLeaveDetails] = useState(null);

    // useEffect hook call to load list of time-offs
    useEffect(() => {
        loadPageData();
    }, []);

    // Handler functions to open and close modals
    const handleOpen = async (event) => {
        if (event === 'add') {
            await setSelectedLeaveDetails(null);
        }
        await setSelectedMethod(event);
        await setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        loadPageData();
        handlePopUpClose();
    };

    const handlePopUpClick = (event, leave_id) => {
        setSelectedLeaveID(leave_id);
        setAnchorEl(event.currentTarget);
    };

    const handlePopUpClose = () => {
        setAnchorEl(null);
    };

    // Handler Functions to handle search and pagination change
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Filtered constants for search and pagination
    const filteredTimeoff = leaveData
        ? leaveData.filter((leave) => {
              const searchString = `${leave.leave_type} ${leave.status} ${leave.from_date} ${leave.to_date} ${leave.no_of_days} ${leave.description}  `;
              return searchString.toLowerCase().includes(searchQuery.toLowerCase());
          })
        : [];

    const pagenatedTimeoff = filteredTimeoff.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    // Function definition to fetch the list of employees time-offs
    const loadPageData = async () => {
        await getLeave(_cancelToken)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    if (res.data) {
                        const leaveData = res.data.content || res.data;
                        leaveData.sort((a, b) => new Date(b.from_date) - new Date(a.from_date));
                        setLeaveData(leaveData);
                    }
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            });
    };

    // Function definition to delete employees time-offs
    const deleteLeaves = async () => {
        let leaveId = selectedLeaveID;

        await deleteLeave(leaveId, _cancelToken)
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

    // Function definition to edit employees time-offs
    const handleEditLeave = async () => {
        let leaveId = selectedLeaveID;
        await viewLeaveDetails(leaveId, _cancelToken)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    setSelectedLeaveDetails(res.data);
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            });
        await handleOpen('edit');
    };

    // Function definition to export time-offs list
    const exportToCSV = () => {
        const csvRows = [];
        csvRows.push(
            [
                'Employee Id',
                'Employee Name',
                'Leave Type',
                'From Date',
                'To Date',
                'Number of Days',
                'Description',
                'Status',
                'Reject Reason'
            ].join(',')
        );
        filteredTimeoff.forEach((leave) => {
            const rowData = [
                leave.user_id?.employeeid || '-',
                leave.user_id?.fullname || '-',
                leave.leave_type || '-',
                leave.from_date || '-',
                leave.to_date || '-',
                leave.no_of_days || '-',
                leave.description || '-',
                leave.status || '-',
                leave.rejectreason || '-'
            ];
            csvRows.push(rowData.join(','));
        });
        const csvData = csvRows.join('\n');
        const blob = new Blob([csvData], { type: 'text/csv' });
        const blobUrl = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = blobUrl;
        anchor.download = 'Leave_Data.csv';
        anchor.click();
        URL.revokeObjectURL(blobUrl);
    };

    // JSX to render the time-offs list
    return (
        <div>
            <Input
                type='text'
                placeholder='Search... Leaves'
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{
                    color: '#0070ac',
                    marginBottom: 2,
                    padding: 1,
                    width: 250,
                    height: 43,
                    borderRadius: 4.1,
                    fontSize: 12,
                    border: '2px solid #0070ac',
                    '&:focus': {
                        borderColor: '#0070ac',
                        boxShadow: (theme) => `0 0 0 0.2rem ${theme.palette.primary.main}`
                    }
                }}
            />
            
            <Button
                onClick={exportToCSV}
                style={{
                    marginLeft: '',
                    color: '#F06D4B',
                    borderColor: '#F06D4B',
                    float: 'right',
                    marginBottom: '10px',
                    borderRadius: '40px',
                    marginRight: '12px'
                }}
                // variant='contained'
                variant='outlined'
                // color='primary'
                startIcon={<DownloadIcon style={{ fontSize: 12 }} />}
            >
                Export to CSV
            </Button>

            <Button
                variant='outlined'
                onClick={() => handleOpen('add')}
                style={{
                    color: '#F06D4B',
                    borderColor: '#F06D4B',
                    float: 'right',
                    marginBottom: '10px',
                    marginRight: '10px',
                    borderRadius: '40px'
                }}
            >
                + Add Timeoff
            </Button>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label='customized table'>
                    <TableHead sx={{ backgroundColor: '#E7E9EA' }}>
                        <TableRow>
                        <StyledTableCell style={columnBorderStyle}>
                                {LeaveMsgResProps.body.form.actions.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {LeaveMsgResProps.body.form.user_id.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {LeaveMsgResProps.body.form.leave_type.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {LeaveMsgResProps.body.form.from_date.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {LeaveMsgResProps.body.form.to_date.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {LeaveMsgResProps.body.form.no_of_days.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {LeaveMsgResProps.body.form.rejectreason.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {LeaveMsgResProps.body.form.status.label}
                            </StyledTableCell>
                            
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pagenatedTimeoff && pagenatedTimeoff.length > 0 ? (
                            pagenatedTimeoff.map((leave, index) => {
                                return (
                                    <StyledTableRow key={index}>
                                    <StyledTableCell
                                            component='th'
                                            scope='row'
                                            style={columnBorderStyle}
                                        >
                                            &nbsp; &nbsp;
                                            <MoreVertIcon
                                                aria-describedby={leave.id}
                                                id={leave.id}
                                                onClick={(event) =>
                                                    handlePopUpClick(event, leave.id)
                                                }
                                            />
                                            <Popover
                                                id={leave.id}
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
                                                            handleEditLeave();
                                                        }}
                                                    >
                                                        <EditIcon />{' '}
                                                        <ListItemText inset className='pl-5'>
                                                            Edit
                                                        </ListItemText>
                                                    </MenuItem>
                                                    <MenuItem
                                                        onClick={() => {
                                                            deleteLeaves();
                                                        }}
                                                    >
                                                        <DeleteIcon />{' '}
                                                        <ListItemText inset className='pl-5'>
                                                            Delete
                                                        </ListItemText>
                                                    </MenuItem>
                                                </MenuList>
                                            </Popover>
                                        </StyledTableCell>
                                        <StyledTableCell
                                            component='th'
                                            scope='row'
                                            style={columnBorderStyle}
                                        >
                                            {leave.user_id ? leave.user_id.fullname : '-'}
                                        </StyledTableCell>
                                        <StyledTableCell
                                            component='th'
                                            scope='row'
                                            style={columnBorderStyle}
                                        >
                                            {leave.leave_type ? leave.leave_type : '-'}
                                        </StyledTableCell>
                                        <StyledTableCell
                                            component='th'
                                            scope='row'
                                            style={columnBorderStyle}
                                        >
                                            {leave.from_date
                                                ? AppUtils.getDateFormat(leave.from_date)
                                                : '-'}
                                        </StyledTableCell>

                                        <StyledTableCell
                                            component='th'
                                            scope='row'
                                            style={columnBorderStyle}
                                        >
                                            {leave.to_date
                                                ? AppUtils.getDateFormat(leave.to_date)
                                                : '-'}
                                        </StyledTableCell>

                                        <StyledTableCell
                                            component='th'
                                            scope='row'
                                            style={columnBorderStyle}
                                            sx={{ textAlign: 'center' }}
                                        >
                                            {leave.no_of_days ? leave.no_of_days : '-'}
                                        </StyledTableCell>
                                        <StyledTableCell
                                            component='th'
                                            scope='row'
                                            style={columnBorderStyle}
                                        >
                                            {leave.rejectreason ? leave.rejectreason : '-'}
                                        </StyledTableCell>
                                        <StyledTableCell
                                            component='th'
                                            scope='row'
                                            style={columnBorderStyle}
                                        >
                                            {leave.status ? leave.status : '-'}
                                        </StyledTableCell>
                                        
                                    </StyledTableRow>
                                );
                            })
                        ) : (
                            <StyledTableRow>
                                <StyledTableCell>No Data Found.</StyledTableCell>
                            </StyledTableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component='div'
                    count={filteredTimeoff.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
            <AddTimeoff
                open={open}
                handleClose={handleClose}
                Backdrop={Backdrop}
                method={selectedMethod}
                leaveDetails={selectedLeaveDetails}
            />
        </div>
    );
}
