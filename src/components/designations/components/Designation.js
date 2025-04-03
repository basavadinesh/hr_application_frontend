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
    getDesignations,
    viewDesignationDetails,
    deleteDesignation
} from '../actions/designation-actions';
import { manageError } from '../../core/actions/common-actions';
import { AppConfigProps } from '../../core/settings/app-config';
import { DesignationMsgResProps } from '../messages/designation-properties';
import AddDesignation from './AddDesignation';
import Backdrop from '@mui/material/Backdrop';
import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { getDepartments } from 'components/departments/actions/department-actions';


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

export default function CustomizedTables() {

    // Create an axios CancelToken source
    const _axiosSource = axios.CancelToken.source();
    const _cancelToken = { cancelToken: _axiosSource.token };

    // Create a history object for navigation
    const history = useHistory();

    // Create a history object for navigation
    const [designations, setDesignations] = useState(null);
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedDesignationID, setSelectedDesignationID] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [selectedDesignationDetails, setSelectedDesignationDetails] = useState(null);
    const [departments, setDepartments] = useState(null);

    // Open the modal for adding or editing a designation
    const handleOpen = async (event) => {
        if (event === 'add') {
            await setSelectedDesignationDetails(null);
        }
        await setSelectedMethod(event);
        await setOpen(true);
    };

    // Close the modal and reload data
    const handleClose = () => {
        setOpen(false);
        loadPageData();
        handlePopUpClose();
    };

    // Handle popover click and close events
    const handlePopUpClick = (event, designationid) => {
        setSelectedDesignationID(designationid);
        setAnchorEl(event.currentTarget);
    };


    const handlePopUpClose = () => {
        setAnchorEl(null);
    };

    const popUpOen = Boolean(anchorEl);

    // Load designations from the server
    const loadPageData = async () => {
        await getDesignations(_cancelToken)
            .then(async (res) => {
                if (
                    res &&
                    res.status === AppConfigProps.httpStatusCode.ok &&
                    res.data 
                ) {
                    setDesignations(res.data);
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            });
    };

    
    // Load designations and departments on component mounts
    useEffect(() => {
        loadPageData();
        getDesignationDepartments();
    }, []); 
    
    // Delete a designation
    const deleteDesignations = async () => {
        let designationId = selectedDesignationID;
        await deleteDesignation(designationId, _cancelToken)
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

    // Handle editing a designation
    const handleEditDesignation = async () => {
        let designationId = selectedDesignationID;
        await viewDesignationDetails(designationId, _cancelToken)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    setSelectedDesignationDetails(res.data);
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            });
        await handleOpen('edit');
    };


    // Load departments for designations
    const getDesignationDepartments = async () => {
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
                + Add Designation
            </Button>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label='customized table'>
                    <TableHead sx={{ backgroundColor:"#E7E9EA"}}>
                        <TableRow>
                        <StyledTableCell>
                                {DesignationMsgResProps.body.form.action.label}
                            </StyledTableCell>
                            <StyledTableCell>
                                {DesignationMsgResProps.body.form.Designation.label}
                            </StyledTableCell>
                            <StyledTableCell>
                                {DesignationMsgResProps.body.form.Department.label}
                            </StyledTableCell>
                            
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {designations && designations.length > 0 ? (
                            designations.map((designation, index) => (
                                <StyledTableRow key={index}>
                                <StyledTableCell component='th' scope='row'>
                                        &nbsp;&nbsp;&nbsp;<MoreVertIcon
                                            aria-describedby={designation.id}
                                            id={designation.id}
                                            onClick={(event) => handlePopUpClick(event,designation.id)}
                                        />
                                        <Popover
                                            id={designation.id}
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
                                                        handleEditDesignation();
                                                    }}
                                                >
                                                    <EditIcon />{' '}
                                                    <ListItemText inset className='pl-5'>
                                                        Edit
                                                    </ListItemText>
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={() => {
                                                        deleteDesignations();
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
                                        {designation.designation ? designation.designation : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell component='th' scope='row'>
                                        {designation.department ? designation.department : '-'}
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

            <AddDesignation
                open={open}
                handleClose={handleClose}
                Backdrop={Backdrop}
                method={selectedMethod}
                designationDetails={selectedDesignationDetails}
                departments={departments}
            />
        </div>
    );
}
