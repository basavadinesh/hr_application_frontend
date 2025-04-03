import React, { useEffect, useState } from 'react';
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
import { getLeave, viewLeaveDetails, deleteLeave } from '../actions/Timeoff-actions';
import { viewEmployeeDetails } from '../../allEmployees/actions/employee-actions';
import { manageError } from '../../core/actions/common-actions';
import { AppConfigProps } from '../../core/settings/app-config';
import { LeaveMsgResProps } from '../messages/Timeoff-properties';
import AddLeave from './AddTimeoff';
import Backdrop from '@mui/material/Backdrop';
import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';
import Input from '@mui/material/Input';
import DownloadIcon from '@mui/icons-material/Download';
import TablePagination from '@mui/material/TablePagination';


// Styled components for table cells and rows
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
    borderRight: '1px solid #ccc' // Adjust the border color and style as needed
};

export default function CustomizedTables(props) {
    const _axiosSource = axios.CancelToken.source();
    const _cancelToken = { cancelToken: _axiosSource.token };
    const history = useHistory();
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [leaveData, setLeaveData] = React.useState(null);
    const [empLeaveData, setEmpLeaveData] = React.useState(null);
    const [isRequests, setIsRequests] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    // Handle opening of modal
    const handleOpen = async (event) => {
        if (event === 'add') {
            await setSelectedLeaveDetails(null);
        }
        await setSelectedMethod(event);

        await setOpen(true);
    };

    // Handle closing of modal and resetting states
    const handleClose = () => {
        setOpen(false);
        handleEmpPopUpClose();
        handleLeavePopUpClose();
        loadPageData(userId);
        handlePopUpClose();
    };
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedLeaveID, setSelectedLeaveID] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [selectedLeaveDetails, setSelectedLeaveDetails] = useState(null);

    // Handle opening of popover
    const handlePopUpClick = (event, leave_id) => {
        setSelectedLeaveID(leave_id);
        setAnchorEl(event.currentTarget);
    };

    // Handle closing of popover
    const handlePopUpClose = () => {
        setAnchorEl(null);
    };

    // Determine if popover is open
    const popUpOen = Boolean(anchorEl);

    // Load page data including leave and employee details
    const loadPageData = async (userId) => {
        try {
            // Assuming you have a function to get the current user's details by ID
            const currentUserRes = await viewEmployeeDetails(userId);
            if (
                !currentUserRes ||
                currentUserRes.status !== AppConfigProps.httpStatusCode.ok ||
                !currentUserRes.data
            ) {
                throw new Error('Failed to fetch current user details');
            }

            const currentUserFullName = currentUserRes.data.fullname;

            const res = await getLeave(_cancelToken);
            if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                const leaveData = res.data.content || res.data;

                // Filter leaves where the user_id matches and sort them
                const userLeave = leaveData.filter(
                    (leave) => leave.user_id.id === parseInt(userId)
                );
                userLeave.sort((a, b) => new Date(b.from_date) - new Date(a.from_date));
                setLeaveData(userLeave);

                // Filter leaves where the manager's name matches the current user's full name
                const empLeave = leaveData.filter(
                    (leave) => leave.user_id.manager === currentUserFullName
                );
                console.log('Employee Requests', empLeave);
                setEmpLeaveData(empLeave);
            } else {
                await manageError(res, props.history);
            }
        } catch (err) {
            await manageError(err, props.history);
        }
    };

    // Effect hook to load data when component mounts
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            loadPageData(userId);
        }
    }, []);

    const userId = localStorage.getItem('userId');

    // Handle delete operation
    const deleteLeaves = async () => {
        let leaveId = selectedLeaveID;

        await deleteLeave(leaveId, _cancelToken)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok) {
                    loadPageData(userId);
                    handlePopUpClose();
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            });
    };

    // Handle edit for employee leave
    const handleEditEmpLeave = async () => {
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
        await setIsRequests(true);
     
    };

    // Handle edit for regular leave
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
        await setIsRequests(false);
    };

    // Handle search input change
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Handle page change in pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Add a flag to differentiate between employee and regular leave data
    const empLeaveDataWithFlag = empLeaveData?.map((leave) => ({
        ...leave,
        source: 'empLeaveData' // Adding a flag to identify this data source
    }));

    const leaveDataWithFlag = leaveData?.map((leave) => ({
        ...leave,
        source: 'leaveData' // Adding a flag to identify this data source
    }));


    // Combine and filter leave data based on search query
    const combinedLeaveData = [...(empLeaveDataWithFlag || []), ...(leaveDataWithFlag || [])];

    // Apply the search filter to the combined list
    const filteredTimeoff = combinedLeaveData.filter((leave) => {
        const searchString = `${leave.leave_type} ${leave.status} ${leave.from_date} ${leave.to_date} ${leave.no_of_days} ${leave.description}`;
        return searchString.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const pagenatedTimeoff = filteredTimeoff.slice(page * rowsPerPage, (page + 1) * rowsPerPage);


    // Export data to CSV
    const exportToCSV = () => {
        const csvRows = [];
        // Adding headers
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
        // Adding data rows
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

    const [empAnchorEl, setEmpAnchorEl] = React.useState(null);
    const [leaveAnchorEl, setLeaveAnchorEl] = React.useState(null);

    const [isEmpPopoverOpen, setIsEmpPopoverOpen] = React.useState(false);
    const [isLeavePopoverOpen, setIsLeavePopoverOpen] = React.useState(false);
    const handleEmpPopUpClick = (event, id) => {
        setEmpAnchorEl(event.currentTarget);
        setSelectedLeaveID(id);
        setIsEmpPopoverOpen(true);
    };

    const handleLeavePopUpClick = (event, id) => {
        setLeaveAnchorEl(event.currentTarget);
        setSelectedLeaveID(id);
        setIsLeavePopoverOpen(true);
    };

    const handleEmpPopUpClose = () => {
        setIsEmpPopoverOpen(false);
        setEmpAnchorEl(null);
    };

    const handleLeavePopUpClose = () => {
        setIsLeavePopoverOpen(false);
        setLeaveAnchorEl(null);
    };

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
                    width: 250, // Adjust the width as needed
                    height: 43,
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
            <Button
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
                + Add Timeoff
            </Button>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label='customized table'>
                    <TableHead sx={{ backgroundColor: '#E7E9EA' }}>
                        <TableRow>
                        {
                                <StyledTableCell style={columnBorderStyle}>
                                    {LeaveMsgResProps.body.form.actions.label}
                                </StyledTableCell>
                            }
                            <StyledTableCell style={columnBorderStyle}>
                                {LeaveMsgResProps.body.form.name.label}
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
                                {LeaveMsgResProps.body.form.status.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {LeaveMsgResProps.body.form.description.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {LeaveMsgResProps.body.form.rejectreason.label}
                            </StyledTableCell>
                            
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pagenatedTimeoff && pagenatedTimeoff.length > 0 ? (
                            pagenatedTimeoff.map((leave, index) => {
                                // Determine if the leave is from empLeaveData

                                return (
                                    <StyledTableRow key={index}>
                                    <StyledTableCell
                                            component='th'
                                            scope='row'
                                            style={columnBorderStyle}
                                        >
                                            &nbsp; &nbsp;
                                            {/* Display vertical icon based on source and status */}
                                            {leave.source === 'empLeaveData' && (
                                                <MoreVertIcon
                                                    aria-describedby={`emp-popover-${leave.id}`}
                                                    id={`emp-popover-${leave.id}`}
                                                    onClick={(event) =>
                                                        handleEmpPopUpClick(event, leave.id)
                                                    }
                                                />
                                            )}
                                            {leave.source !== 'empLeaveData' &&
                                                leave.status === 'Pending' && (
                                                    <MoreVertIcon
                                                        aria-describedby={`leave-popover-${leave.id}`}
                                                        id={`leave-popover-${leave.id}`}
                                                        onClick={(event) =>
                                                            handleLeavePopUpClick(event, leave.id)
                                                        }
                                                    />
                                                )}
                                            {/* Employee Leave Popover */}
                                            {isEmpPopoverOpen &&
                                                empAnchorEl &&
                                                empAnchorEl.id === `emp-popover-${leave.id}` && (
                                                    <Popover
                                                        id={`emp-popover-${leave.id}`}
                                                        open={isEmpPopoverOpen}
                                                        anchorEl={empAnchorEl}
                                                        onClose={handleEmpPopUpClose}
                                                        anchorOrigin={{
                                                            vertical: 'bottom',
                                                            horizontal: 'left'
                                                        }}
                                                    >
                                                        <MenuList dense>
                                                            <MenuItem
                                                                onClick={() => {
                                                                    handleEditEmpLeave(
                                                                        selectedLeaveID
                                                                    ); // Handle Employee Leave edit
                                                                }}
                                                            >
                                                                <EditIcon />{' '}
                                                                <ListItemText
                                                                    inset
                                                                    className='pl-5'
                                                                >
                                                                    Edit
                                                                </ListItemText>
                                                            </MenuItem>
                                                            <MenuItem
                                                                onClick={() => {
                                                                    deleteLeaves(selectedLeaveID); // Handle Employee Leave deletion
                                                                }}
                                                            >
                                                                <DeleteIcon />{' '}
                                                                <ListItemText
                                                                    inset
                                                                    className='pl-5'
                                                                >
                                                                    Delete 
                                                                </ListItemText>
                                                            </MenuItem>
                                                        </MenuList>
                                                    </Popover>
                                                )}
                                            {/* Regular Leave Popover */}
                                            {isLeavePopoverOpen &&
                                                leaveAnchorEl &&
                                                leaveAnchorEl.id ===
                                                    `leave-popover-${leave.id}` && (
                                                    <Popover
                                                        id={`leave-popover-${leave.id}`}
                                                        open={isLeavePopoverOpen}
                                                        anchorEl={leaveAnchorEl}
                                                        onClose={handleLeavePopUpClose}
                                                        anchorOrigin={{
                                                            vertical: 'bottom',
                                                            horizontal: 'left'
                                                        }}
                                                    >
                                                        <MenuList dense>
                                                            <MenuItem
                                                                onClick={() => {
                                                                    handleEditLeave(
                                                                        selectedLeaveID
                                                                    ); // Handle Regular Leave edit
                                                                }}
                                                            >
                                                                <EditIcon />{' '}
                                                                <ListItemText
                                                                    inset
                                                                    className='pl-5'
                                                                >
                                                                    Edit
                                                                </ListItemText>
                                                            </MenuItem>
                                                            <MenuItem
                                                                onClick={() => {
                                                                    deleteLeaves(selectedLeaveID); // Handle Regular Leave deletion
                                                                }}
                                                            >
                                                                <DeleteIcon />{' '}
                                                                <ListItemText
                                                                    inset
                                                                    className='pl-5'
                                                                >
                                                                    Delete
                                                                </ListItemText>
                                                            </MenuItem>
                                                        </MenuList>
                                                    </Popover>
                                                )}
                                        </StyledTableCell>
                                        <StyledTableCell
                                            component='th'
                                            scope='row'
                                            style={columnBorderStyle}
                                        >
                                            {leave.user_id.fullname ? leave.user_id.fullname : '-'}
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
                                            {leave.from_date ? leave.from_date : '-'}
                                        </StyledTableCell>
                                        <StyledTableCell
                                            component='th'
                                            scope='row'
                                            style={columnBorderStyle}
                                        >
                                            {leave.to_date ? leave.to_date : '-'}
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
                                            {leave.status ? leave.status : '-'}
                                        </StyledTableCell>

                                        <StyledTableCell
                                            component='th'
                                            scope='row'
                                            style={columnBorderStyle}
                                        >
                                            {leave.description ? leave.description : '-'}
                                        </StyledTableCell>
                                        <StyledTableCell
                                            component='th'
                                            scope='row'
                                            style={columnBorderStyle}
                                        >
                                            {leave.rejectreason ? leave.rejectreason : '-'}
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

            <AddLeave
                open={open}
                handleClose={handleClose}
                Backdrop={Backdrop}
                method={selectedMethod}
                isRequests={isRequests}
                leaveDetails={selectedLeaveDetails}
                reloadLeave={loadPageData}
            />
        </div>
    );
}
