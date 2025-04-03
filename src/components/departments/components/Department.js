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
import {
    getDepartments,
    viewDepartmentDetails,
    deleteDepartment
} from '../actions/department-actions';
import { manageError } from '../../core/actions/common-actions';
import { AppConfigProps } from '../../core/settings/app-config';
import { DepartmentMsgResProps } from '../messages/department-properties';
import AddDepartment from './AddDepartment';
import Backdrop from '@mui/material/Backdrop';
import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// Custom styling for table cells
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.gray,
        color: theme.palette.common.black
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14
    }
}));

// Custom styling for table rows
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(even)': {
        backgroundColor: theme.palette.action.hover
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0
    }
}));

export default function CustomizedTables() {
    const _axiosSource = axios.CancelToken.source();
    const _cancelToken = { cancelToken: _axiosSource.token };
    const history = useHistory();

    // State to store the list of departments
    const [departments, setDepartments] = useState(null);

    // State to handle the modal open/close status
    const [open, setOpen] = React.useState(false);
    
    // State to manage the anchor element for the popover menu
    const [anchorEl, setAnchorEl] = useState(null);
    
    // State to store the ID of the selected department
    const [selectedDepartmentID, setSelectedDepartmentID] = useState(null);
    
    // State to store the method (add or edit) for department actions
    const [selectedMethod, setSelectedMethod] = useState(null);
    
    // State to store the details of the selected department
    const [selectedDepartmentDetails, setSelectedDepartmentDetails] = useState(null);

    // Handle opening of the modal
    const handleOpen = async (event) => {
        if (event === 'add') {
            await setSelectedDepartmentDetails(null);
        }
        await setSelectedMethod(event);
        await setOpen(true);
    };

    // Handle closing of the modal and refreshing data
    const handleClose = () => {
        setOpen(false);
        loadPageData();
        handlePopUpClose();
    };

    // Handle popover menu click event
    const handlePopUpClick = (event, depId) => {
        setSelectedDepartmentID(depId);
        setAnchorEl(event.currentTarget);
    };

    // Handle closing of the popover menu
    const handlePopUpClose = () => {
        setAnchorEl(null);
    };

    // Check if the popover menu is open
    const popUpOen = Boolean(anchorEl);

    // Load the department data from the server
    const loadPageData = async () => {
        await getDepartments(_cancelToken)
            .then(async (res) => {
                if (
                    res &&
                    res.status === AppConfigProps.httpStatusCode.ok &&
                    res.data &&
                    res.data
                ) {
                    setDepartments(res.data);
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            });
    };

    // Fetch department data when component mounts
    useEffect(() => {
        loadPageData();
    }, []);

    // Handle department deletion
    const deleteDepartments = async () => {
        let departmentId = selectedDepartmentID;
        await deleteDepartment(departmentId, _cancelToken)
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

    // Handle department editing
    const handleEditDepartment = async () => {
        let departmentId = selectedDepartmentID;
        await viewDepartmentDetails(departmentId, _cancelToken)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    setSelectedDepartmentDetails(res.data);
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            });
        await handleOpen('edit');
    };
    useEffect(() => {
        loadPageData();
    }, []);

    return (
        <div>
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
                + Add Department
            </Button>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label='customized table'>
                    <TableHead sx={{ backgroundColor:"#E7E9EA"}}>
                        <TableRow>
                        <StyledTableCell>
                                {DepartmentMsgResProps.body.form.action.label}
                            </StyledTableCell>
                            <StyledTableCell>
                                {DepartmentMsgResProps.body.form.departmentname.label}
                            </StyledTableCell>
                           
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {departments && departments.length > 0 ? (
                            departments.map((department, index) => (
                                <StyledTableRow key={index}>
                                <StyledTableCell component='th' scope='row'>
                                    &nbsp;&nbsp;&nbsp;<MoreVertIcon
                                            aria-describedby={department.id}
                                            id={department.id}
                                            onClick={(event) => handlePopUpClick(event, department.id)}
                                        />
                                        <Popover
                                            id={department.id}
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
                                                        handleEditDepartment();
                                                    }}
                                                >
                                                    <EditIcon />{' '}
                                                    <ListItemText inset className='pl-5'>
                                                        Edit
                                                    </ListItemText>
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={() => {
                                                        deleteDepartments();
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
                                    <StyledTableCell component='th' scope='row'>
                                        {department.departmentname
                                            ? department.departmentname
                                            : '-'}
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
            </TableContainer>

            <AddDepartment
                open={open}
                handleClose={handleClose}
                Backdrop={Backdrop}
                method={selectedMethod}
                departmentDetails={selectedDepartmentDetails}
            />
        </div>
    );
}
