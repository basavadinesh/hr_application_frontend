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
import { getEducation, viewEducationDetails, deleteEducation } from '../actions/education-actions';
import { manageError } from '../../core/actions/common-actions';
import { AppConfigProps } from '../../core/settings/app-config';
import { EducationMsgResProps } from '../messages/education-properties';
import AppUtils from '../../core/helpers/app-utils';
import AddEducation from './AddEducation';
import Backdrop from '@mui/material/Backdrop';
import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Input from '@mui/material/Input';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TablePagination from '@mui/material/TablePagination';
import DownloadIcon from '@mui/icons-material/Download';
import DownloadFilesModal from './DownloadFilesModal ';

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

const columnBorderStyle = {
    borderRight: '1px solid #ccc'
};

// Main component function
export default function Education(props) {
    const _axiosSource = axios.CancelToken.source();
    const _cancelToken = { cancelToken: _axiosSource.token };
    const history = useHistory();
    const [education, setEducation] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [showModal, setShowModal] = useState(false);
    const [documents, setDocuments] = useState([]);

    // State for modal and popover handling
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedEducationID, setSelectEducationID] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedEducationDetails, setSelectedEducationDetails] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Handle opening modal with different methods
    const handleOpen = async (event) => {
        if (event === 'add') {
            setSelectedMethod('add');
            await setSelectedEducationDetails(null);
        }
        await setSelectedMethod(event);
        console.log(setSelectedMethod.method, 'method');
        await setOpen(true);
        console.log('handleOpen called with:', event);
    };

    // Handle closing modal and refreshing data
    const handleClose = () => {
        setOpen(false);
        loadPageData(userId);
        handlePopUpClose();
    };

    // Handle opening and closing of popover
    const handlePopUpClick = (event, eduId) => {
        setSelectEducationID(eduId);
        setAnchorEl(event.currentTarget);
    };

    // Handle search input change
    const handlePopUpClose = () => {
        setAnchorEl(null);
    };

    const popUpOen = Boolean(anchorEl);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Handle pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Show download modal with document list
    const handleShowModal = (documents) => {
        setDocuments(documents);
        setShowModal(true);
    };

    // Close download modal
    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Filter education data based on search query
    const filteredEducation = education
        ? education.filter(
              (item) =>
                  item.education.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.specification.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.institution.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : [];

    // Paginate filtered education data
    const pagenatedEducation = filteredEducation.slice(
        page * rowsPerPage,
        (page + 1) * rowsPerPage
    );

    // Load education data from API
    const loadPageData = async (userId) => {
        try {
            setLoading(true);
            console.log('Fetching education data for user ID:', userId);

            // Use the correct endpoint for user-specific education data
            const response = await axios.get(`/api/v1/educationals/user/${userId}`);
            console.log('API Response:', response.data);

            if (response.data) {
                setEducation(response.data);
                console.log('Education data set:', response.data);
            }
        } catch (error) {
            console.error('Error fetching education data:', error);
            setError('Failed to load education data');
        } finally {
            setLoading(false);
        }
    };
    // Load education data on component mount
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        console.log('UserId from localStorage:', userId);

        if (userId) {
            loadPageData(userId);
        }
    }, []);

    // For debugging
    useEffect(() => {
        console.log('Current education state:', education);
    }, [education]);

    if (loading) {
        return <div>Loading...</div>;
    }
    const userId = localStorage.getItem('userId');

    // Delete education entry
    const deleteEducations = async () => {
        let educationId = selectedEducationID;
        await deleteEducation(educationId, _cancelToken)
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

    // Edit education entry
    const handleEditEducation = async () => {
        setSelectedMethod('edit');
        let educationId = selectedEducationID;
        await viewEducationDetails(educationId, _cancelToken)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    setSelectedEducationDetails(res.data);
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            });
        await handleOpen('edit');
    };

    // Export education data to CSV
    const exportToCSV = () => {
        const csvRows = [];
        // Adding headers
        csvRows.push(
            [
                'Employee Id',
                'Employee Name',
                'Education',
                'Specification',
                'Institution',
                'Start Year',
                'End Year',
                'GPA',
                'Documents'
            ]
                .map((header) => `"${header}"`)
                .join(',')
        );
        // Adding data rows
        filteredEducation.forEach((edu) => {
            const rowData = [
                edu.user_id?.id || '-',
                edu.user_id?.fullname || '-',
                edu.education || '-',
                edu.specification || '-',
                edu.institution || '-',
                edu.startyear || '-',
                edu.endyear || '-',
                edu.gpa || '-',
                edu.document || '-'
            ]
                .map((cell) => `"${cell}"`)
                .join(',');
            csvRows.push(rowData);
        });
        const csvData = csvRows.join('\n');
        const blob = new Blob([csvData], { type: 'text/csv' });
        const blobUrl = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = blobUrl;
        anchor.download = 'education_data.csv';
        anchor.click();
        URL.revokeObjectURL(blobUrl);
    };

    // Handle file download
    const handleDownload = async (relativePath) => {
        console.log('Relative Path:', relativePath);
        try {
            const fileName = relativePath;

            const response = await axios.get(`http://localhost:8080/api/v1/file/download`, {
                params: {
                    fileName: relativePath
                },
                responseType: 'blob'
            });

            // Check if the file extension is .pdf
            const fileExtension = fileName.split('.').pop().toLowerCase();

            if (fileExtension === 'pdf') {
                // Create a URL for the blob
                const url = window.URL.createObjectURL(
                    new Blob([response.data], { type: 'application/pdf' })
                );

                // Open PDF files in a new tab
                window.open(url, '_blank');

                // Clean up the URL object
                window.URL.revokeObjectURL(url);
            } else {
                console.warn('File is not a PDF. Ignoring.');
            }
        } catch (error) {
            console.error('Error handling file:', error);
        }
    };

    return (
        <div>
            <Input
                type='text'
                placeholder='Search Education...'
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{
                    color: '#0070ac',
                    marginBottom: 2,
                    padding: 1,
                    fontSize: 12,
                    width: 300, // Adjust the width as needed
                    borderRadius: 4,
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
                    float: 'right',
                    fontSize: 12,
                    // fontSize: '10px',
                    borderRadius: '20px',
                    color: '#F06D4B',
                    borderColor: '#F06D4B',
                    marginBottom: '10px',
                    marginRight: '10px'
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
                    fontSize: '12px',
                    marginBottom: '10px',
                    borderRadius: '40px'
                }}
            >
                + Add Education
            </Button>
            <DownloadFilesModal
                open={showModal}
                onClose={handleCloseModal}
                documents={documents}
                handleDownload={handleDownload}
            />
            <div style={{ display: 'none' }}>
                <pre>{JSON.stringify({ education, loading }, null, 2)}</pre>
            </div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label='customized table'>
                    <TableHead sx={{ backgroundColor: '#E7E9EA' }}>
                        <TableRow>
                            <StyledTableCell style={columnBorderStyle}>
                                {EducationMsgResProps.body.form.action.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EducationMsgResProps.body.form.education.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EducationMsgResProps.body.form.specification.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EducationMsgResProps.body.form.institution.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EducationMsgResProps.body.form.startyear.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EducationMsgResProps.body.form.endyear.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EducationMsgResProps.body.form.documents.label}
                            </StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pagenatedEducation && pagenatedEducation.length > 0 ? (
                            pagenatedEducation.map((education, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell component='th' scope='row'>
                                        &nbsp;&nbsp;&nbsp;
                                        <MoreVertIcon
                                            aria-describedby={education.id}
                                            id={education.id}
                                            onClick={(event) =>
                                                handlePopUpClick(event, education.id)
                                            }
                                        />
                                        <Popover
                                            id={education.id}
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
                                                        handleEditEducation();
                                                    }}
                                                >
                                                    <EditIcon />{' '}
                                                    <ListItemText inset className='pl-5'>
                                                        Edit
                                                    </ListItemText>
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={() => {
                                                        deleteEducations();
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
                                        {education.education
                                            ? education.education === 'B_Tech'
                                                ? 'B.Tech'
                                                : education.education === 'M_Tech'
                                                ? 'M.Tech'
                                                : education.education
                                            : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {education.specification ? education.specification : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {education.institution ? education.institution : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {education.startyear
                                            ? AppUtils.getDateFormat(education.startyear)
                                            : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {education.endyear
                                            ? AppUtils.getDateFormat(education.endyear)
                                            : '-'}
                                    </StyledTableCell>

                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {education.documents && education.documents.length > 0 ? (
                                            <p>
                                                <a
                                                    href='#'
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleShowModal(education.documents); // Show the modal with document list
                                                    }}
                                                    style={{
                                                        color: 'blue',
                                                        textDecoration: 'underline'
                                                    }}
                                                >
                                                    Download Documents
                                                </a>
                                            </p>
                                        ) : (
                                            '-'
                                        )}
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
                    component='div'
                    count={pagenatedEducation.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            <AddEducation
                open={open}
                handleClose={handleClose}
                Backdrop={Backdrop}
                method={selectedMethod}
                educationDetails={selectedEducationDetails}
                reloadEducation={loadPageData}
            />
        </div>
    );
}
