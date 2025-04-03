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
import { getSkills, viewSkillDetails, deleteSkill } from '../actions/skills-actions';
import { manageError } from '../../core/actions/common-actions';
import { AppConfigProps } from '../../core/settings/app-config';
import { SkillMsgResProps } from '../messages/skills-properties';
import AddSkill from './AddSkills';
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

export default function CustomizedTables(props) {
    // State variables
    const _axiosSource = axios.CancelToken.source();
    const _cancelToken = { cancelToken: _axiosSource.token };
    const history = useHistory();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [skills, setSkills] = useState(null);
    const [open, setOpen] = React.useState(false);

    // Open dialog for add/edit operations
    const handleOpen = async (event) => {
        if (event === 'add') {
            await setSelectedSkillDetails(null);
        }
        await setSelectedMethod(event);
        await setOpen(true);
    };
   
    // Close dialog and refresh skills data
    const handleClose = async () => {
        setOpen(false);
        const userId = localStorage.getItem('userId');
        if (selectedMethod === 'edit' && selectedSkillDetails) {
            const updatedSkills = [...skills];
            const skillIndex = updatedSkills.findIndex(skill => skill.id === selectedSkillDetails.id);
            if (skillIndex !== -1) {
                updatedSkills[skillIndex] = selectedSkillDetails;
                setSkills(updatedSkills);
            }
        }
        await loadPageData(userId);
        handlePopUpClose();
    };
    
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedSkillID, setSelectedSkillID] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [selectedSkillDetails, setSelectedSkillDetails] = useState(null);

    // Handle click on popover menu for actions (edit/delete)
    const handlePopUpClick = (event, skill_id) => {
        setSelectedSkillID(skill_id);
        setAnchorEl(event.currentTarget);
    };

    // Close popover menu
    const handlePopUpClose = () => {
        setAnchorEl(null);
    };

    // Determine if popover is open
    const popUpOen = Boolean(anchorEl);

    // Load skills data from API
    const loadPageData = async (userId) => {
        try {
            const res = await getSkills(_cancelToken);
            console.log(res.data);
            if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                const skillsData = res.data.content || res.data; // Use 'content' or the data directly based on your API response
                const userSkills = skillsData.filter(
                    (skill) => skill.user_id.id === parseInt(userId)
                );
                setSkills(userSkills);
                console.log(userSkills);
            } else {
                await manageError(res, props.history);
            }
        } catch (err) {
            await manageError(err, props.history);
        }
    };

    // Fetch skills data when component mounts
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            loadPageData(userId);
        }
    }, []);


    // Delete selected skill
    const deleteSkills = async () => {
        const userId = localStorage.getItem('userId');
        let skillId = selectedSkillID;
        await deleteSkill(skillId, _cancelToken)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok) {
                    // Remove the deleted skill from the skills state
                    setSkills((prevSkills) => prevSkills.filter((skill) => skill.id !== skillId));
                    handlePopUpClose();
                    // console.log(res.data)
                    loadPageData(userId);
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            });
    };

    // Fetch details of the skill to edit
    const handleEditSkill = async () => {
        let skillId = selectedSkillID;
        await viewSkillDetails(skillId, _cancelToken)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    setSelectedSkillDetails(res.data);
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            });
        await handleOpen('edit');
    };

    // Update search query
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Handle page change in pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    // Handle change in rows per page
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

    // Filter skills based on search query
    const filteredSkills = skills
        ? skills.filter((skill) => {
              const searchString = `${skill.user_id?.employeeid} ${skill.user_id?.fullname} ${skill.skill} ${skill.level_type} ${skill.status} `;
              return searchString.toLowerCase().includes(searchQuery.toLowerCase());
          })
        : [];

        // Paginate filtered skills
        const pagenatedSkills = filteredSkills.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    // Export filtered skills to CSV
    const exportToCSV = () => {
        const csvRows = [];
        // Adding headers
        csvRows.push(
            [
                'Employee Id',
                'Employee Name',
                'Skills',
                'Expertise',
                'Approved By',
                'Approved Status',
            ].join(',')
        );
        // Adding data rows
        filteredSkills.forEach((skill) => {
            const rowData = [
                skill.user_id?.employeeid || '-',
                skill.user_id?.fullname || '-',
                skill.skill || '-',
                skill.level_type || '-',
                skill.approval_id?.user_id?.fullname || '-',
                skill.status || '-',
            ];
            csvRows.push(rowData.join(','));
        });
        // Joining rows with newlines
        const csvData = csvRows.join('\n');
        // Creating a Blob with CSV data
        const blob = new Blob([csvData], { type: 'text/csv' });
        // Creating an anchor tag with Blob URL
        const blobUrl = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = blobUrl;
        anchor.download = 'Employees_Skils_data.csv';
        // Triggering anchor click to download CSV
        anchor.click();
        // Cleanup
        URL.revokeObjectURL(blobUrl);
    };
    return (
        <div>
            <Input
                type='text'
                placeholder='Search... Skills'
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
                + Add Skills
            </Button>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label='customized table'>
                    <TableHead sx={{ backgroundColor: '#E7E9EA' }}>
                        <TableRow>
                            {/* <StyledTableCell>
                                {SkillMsgResProps.body.form.skillid.label}
                            </StyledTableCell> */}
                            <StyledTableCell style={columnBorderStyle}>
                                {SkillMsgResProps.body.form.action.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {SkillMsgResProps.body.form.fullname.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {SkillMsgResProps.body.form.skill.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {SkillMsgResProps.body.form.level_type.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {SkillMsgResProps.body.form.approval_id.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {SkillMsgResProps.body.form.status.label}
                            </StyledTableCell>
                            
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pagenatedSkills && pagenatedSkills.length > 0 ? (
                            pagenatedSkills.map((skill, index) => (
                                <StyledTableRow key={index}>
                                    {/* <StyledTableCell component='th' scope='row'>
                                        {skill.id ? skill.id : '-'}
                                    </StyledTableCell> */}
                                    <StyledTableCell component='th' scope='row' style={columnBorderStyle}>
                                        &nbsp;&nbsp;&nbsp;{' '}
                                        <MoreVertIcon
                                            aria-describedby={skill.id}
                                            id={skill.id}
                                            onClick={(event) => handlePopUpClick(event, skill.id)}
                                        />
                                        <Popover
                                            id={skill.id}
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
                                                        handleEditSkill();
                                                    }}
                                                >
                                                    <EditIcon />{' '}
                                                    <ListItemText inset className='pl-5'>
                                                        Edit
                                                    </ListItemText>
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={() => {
                                                        deleteSkills();
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
                                    <StyledTableCell component='th' scope='row' style={columnBorderStyle}>
                                        {skill.user_id ? skill.user_id.fullname : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell component='th' scope='row' style={columnBorderStyle}>
                                        {skill.skill ? skill.skill : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell component='th' scope='row' style={columnBorderStyle}>
                                        {skill.level_type ? skill.level_type : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell component='th' scope='row' style={columnBorderStyle}>
                                        {skill.approval_id
                                            ? skill.approval_id.user_id.fullname
                                            : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell component='th' scope='row' style={columnBorderStyle}>
                                        {skill.status ? skill.status : 'Pending'}
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
                    count={filteredSkills.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
            <AddSkill
                open={open}
                handleClose={handleClose}
                Backdrop={Backdrop}
                method={selectedMethod}
                skillDetails={selectedSkillDetails}
                reloadSkills={loadPageData}
            />
        </div>
    );
}
