import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Button from '@mui/material/Button';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
    getProjects,
    viewProjectDetails,
    deleteProject,
    getProjectsNames
} from '../actions/project-action';
import { manageError, manageImportError } from '../../core/actions/common-actions';
import { AppConfigProps } from '../../core/settings/app-config';
import { ProjectMsgResProps } from '../messages/project-properties';
import { createProjects } from '../actions/project-action';
import AppUtils from '../../core/helpers/app-utils';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import AddProjects from './AddProjects';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Input from '@mui/material/Input';
import TablePagination from '@mui/material/TablePagination';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DownloadIcon from '@mui/icons-material/Download';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import ProjectFilesModal from './ProjectFilesModal'
import SLUGS from 'resources/slugs';

import * as XLSX from 'xlsx';

// Styled Components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.common.black
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14
    }
}));

const columnBorderStyle = {
    borderRight: '1px solid #ccc' // Adjust the border color and style as needed
};

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(even)': {
        backgroundColor: theme.palette.action.hover
    },
    '&:last-child td, &:last-child th': {
        border: 0
    }
}));

// Separate styled components for the expanded table
const ExpandedTableCell = styled(TableCell)(({ theme }) => ({
    border: '1px solid #ddd', // Ensure borders are visible
    padding: '8px',
    backgroundColor: '#f9f9f9' // Different background color if needed
}));

const ExpandedTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(even)': {
        backgroundColor: theme.palette.action.hover // Ensure alternate row coloring if needed
    },
    '&:last-child td, &:last-child th': {
        border: 0
    }
}));

const useExpandedTableStyles = () => ({
    table: {
        minWidth: 700,
        borderCollapse: 'collapse'
    },
    tableHead: {
        backgroundColor: '#e0e0e0'
    },
    tableCell: {
        border: '1px solid #bbb',
        padding: '10px'
    },
    tableRow: {
        '&:nth-of-type(even)': {
            backgroundColor: '#e9e9e9'
        },
        '&:nth-of-type(odd)': {
            backgroundColor: '#f7f7f7'
        }
    },
    tableBody: {
        borderTop: '1px solid #bbb'
    }
});

// Main Component
export default function CustomizedTables(props) {
    // State and Refs
    const _axiosSource = axios.CancelToken.source();
    const _cancelToken = { cancelToken: _axiosSource.token };
    const [projects, setProjects] = useState(null);
    const [open, setOpen] = React.useState(false);
    const history = useHistory();
    const [isLoading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [selectedProjectID, setSelectedProjectID] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [selectedProjectDetails, setSelectedProjectDetails] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedProjectId, setExpandedProjectId] = useState(null);

    //const tableStyles = useTableStyles();
    const expandedTableStyles = useExpandedTableStyles();
    //Import related State Management
    const [importedData, setImportedData] = useState([]);
    const [includeDocument, setIncludeDocument] = useState(false);
    const [updatedImportedData, setUpdatedImportedData] = useState([]);
    const [showPopup, setShowPopup] = useState(false);

    const [projectNames, setProjectNames] = useState({});
    const [usernames, setUsernames] = useState({
        projectName: ''
    });

    const [expandedProjects, setExpandedProjects] = useState([]);
    const [projectUsers, setProjectUsers] = useState({});

    const [showModal, setShowModal] = useState(false);
    const [documents, setDocuments] = useState([]);

    const userId = localStorage.getItem('userId');

    // Event Handlers
    const handleOpen = async (event) => {
        if (event === 'add') {
            await setSelectedProjectDetails(null);
        }
        await setSelectedMethod(event);
        await setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        loadPageData(userId);
        handlePopUpClose();
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const filterProjects = () => {
        if (!projects) return [];

        return projects.filter((project) => {
            const searchTerms = [project.name, project.teamtype, project.priority];
            return searchTerms.some(
                (term) => term && term.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
    };

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedProjects = () => {
        if (!projects) return [];

        return filterProjects().sort((a, b) => {
            const aValue = a[orderBy] ? a[orderBy].toLowerCase() : '';
            const bValue = b[orderBy] ? b[orderBy].toLowerCase() : '';

            if (order === 'asc') {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        });
    };

    const handleUserNames = async (event, projectName) => {
        try {
            const namesResponse = await getProjectsNames(_cancelToken, projectName);

            if (namesResponse && namesResponse.status === AppConfigProps.httpStatusCode.ok) {
                setProjectNames(namesResponse.data);
                // Handle usernames data as needed, you may want to set it to state or use it in some way
            } else {
                await manageError(namesResponse, props.history);
            }
        } catch (error) {
            console.error('Error fetching usernames:', error);
        }

        setSelectedProjectID(event.target.id);
        setAnchorEl(event.currentTarget);
    };

    const handlePopUpClick = (event, projId) => {
        setSelectedProjectID(projId);

        setAnchorEl(event.currentTarget);
    };

    const handlePopUpClose = () => {
        setProjectNames({});
        setAnchorEl(null);
    };

    const popUpOpen = Boolean(anchorEl);

    const getUsersByProject = async (projectName, cancelToken) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/user/projects`, {
                params: { projectName }, // Pass the parameter as part of the query string
                cancelToken
            });
            return response;
        } catch (error) {
            throw error;
        }
    };

    const handleExpand = async (event, projectName, forceExpand = false) => {
        try {
            // Fetch user data for the selected project if not already fetched
            const response = await getUsersByProject(projectName);

            if (response && response.status === AppConfigProps.httpStatusCode.ok) {
                // Extract user data from the response
                const users = response.data;

                // Update state with user data
                setProjectUsers((prevUsers) => ({
                    ...prevUsers,
                    [projectName]: users
                }));

                // Handle expansion logic
                setExpandedProjects((prevExpandedProjects) => {
                    const isExpanded = prevExpandedProjects.includes(projectName);

                    if (forceExpand || !isExpanded) {
                        // Add projectName to expanded list if not already expanded
                        return Array.from(new Set([...prevExpandedProjects, projectName]));
                    } else if (!forceExpand && isExpanded) {
                        // Remove projectName from expanded list if already expanded and not forced
                        return prevExpandedProjects.filter((name) => name !== projectName);
                    }
                    return prevExpandedProjects;
                });
            } else {
                // Handle error if the response status is not OK
                console.error('Failed to fetch users:', response);
            }
        } catch (error) {
            // Handle any errors during the API call
            console.error('Error fetching users by project:', error);
        }
    };

    const handleExpandAll = async () => {
        const allProjectNames = projects.map((project) => project.name);
        const currentlyExpanded = expandedProjects || [];

        console.log('Currently Expanded:', currentlyExpanded);
        console.log('All Projects:', allProjectNames);

        const areAllExpanded = currentlyExpanded.length === allProjectNames.length;
        console.log('Are All Expanded:', areAllExpanded);

        if (areAllExpanded) {
            setExpandedProjects([]); // Collapse all projects
        } else {
            // Track promises for each handleExpand call
            const promises = allProjectNames.map(async (projectName) => {
                if (!currentlyExpanded.includes(projectName)) {
                    await handleExpand(null, projectName, true); // Ensure this completes
                    return projectName;
                }
                return projectName;
            });

            // Wait for all handleExpand calls to complete
            const newExpandedProjects = await Promise.all(promises);

            // Ensure unique values in the list
            setExpandedProjects([...new Set(newExpandedProjects)]);
        }
    };

    // Function to check if all projects are expanded
    const areAllProjectsExpanded = () => {
        return expandedProjects?.length === projects?.length;
    };

    const isProjectExpanded = (projectName) => {
        return expandedProjects.includes(projectName);
    };

    const loadPageData = async () => {
        await getProjects(_cancelToken)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    setProjects(res.data);
                } else {
                    await manageError(res, props.history);
                }
            })
            .catch(async (err) => {
                await manageError(err, props.history);
            });
    };

    const [userNames, setUserNames] = useState([]);

    useEffect(() => {
        loadPageData();
    }, []);

    const deleteProjects = async () => {
        let projectId = selectedProjectID;
        await deleteProject(projectId)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok) {
                    loadPageData(userId);
                    handlePopUpClose();
                } else {
                    await manageError(res, props.history);
                }
            })
            .catch(async (err) => {
                await manageError(err, props.history);
            });
    };

   // Handle file download
const handleDownload = async (relativePath) => {
    // Extract the file extension
    const fileExtension = relativePath.split('.').pop().toLowerCase();

    // Check if the file is a PDF
    if (fileExtension === 'pdf') {
        // Call handlePdfDownload if the file is a PDF
        handlePdfDownload(relativePath);
    } else {
        // Continue with the existing download logic for non-PDF files
        try {
            // Make a GET request to the backend with the file name as a query parameter
            const response = await axios.get(`http://localhost:8080/api/v1/file/download`, {
                params: {
                    fileName: relativePath // Include the file name as a query parameter
                },
                responseType: 'blob' // Ensure the response type is blob
            });

            // Extract the file name from the relativePath
            const originalFileName = relativePath.split('/').pop();

            // Create a URL for the blob
            const url = window.URL.createObjectURL(
                new Blob([response.data], { type: response.headers['content-type'] })
            );

            // Create a temporary link element to trigger the download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', originalFileName); // Set the original file name for download

            // Append the link to the document and trigger the click
            document.body.appendChild(link);
            link.click();

            // Clean up
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error handling file download:', error);
        }
    }
};

// Handle PDF file download
const handlePdfDownload = async (relativePath) => {
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
        console.error('Error handling PDF download:', error);
    }
};

    

    const handleEditProject = async () => {
        let projectId = selectedProjectID;

        await viewProjectDetails(projectId)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    setSelectedProjectDetails(res.data);
                } else {
                    await manageError(res, props.history);
                }
            })
            .catch(async (err) => {
                await manageError(err, props.history);
            });
        await handleOpen('edit');
    };

    const exportToCSV = () => {
        const filteredProjects = filterProjects();

        const csvRows = [];
        // Adding headers
        csvRows.push(
            [
                'Project ID',
                'Project Name',
                'Start Date',
                'End Date',
                'Priority',
                'Project Type',
                'Price',
                'Currency',
                'Project Lead',
                'Billing Type',
                'Status',
                'Description',
                'Documents'
            ].join(',')
        );
        // Adding data rows
        filteredProjects.forEach((project) => {
            const rowData = [
                project.id || '-',
                project.name || '-',
                project.startdate || '-',
                project.enddate || '-',
                project.priority || '-',
                project.teamtype || '-',
                project.price || '-',
                project.currency || '-',
                project.projectlead || '-',
                project.billingtype || '-',
                project.status || '-',
                project.description || '-',
                project.document || '-'
            ];
            csvRows.push(rowData.join(','));
        });
        const csvData = csvRows.join('\n');
        const blob = new Blob([csvData], { type: 'text/csv' });
        const blobUrl = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = blobUrl;
        anchor.download = 'Project_data.csv';
        anchor.click();
        URL.revokeObjectURL(blobUrl);
    };

    const handleToggleExpand = (projectId) => {
        setExpandedProjectId((prevId) => (prevId === projectId ? null : projectId));
    };

    // Import related  functions
    const handleOpenModal = (jsonData) => {
        if (jsonData && jsonData.length > 0) {
            setImportedData(jsonData); // Set the importedData state with the jsonData
            setShowPopup(true);
        } else {
            console.error('Invalid or empty JSON data received.');
        }
    };

    const handleCloseModal = () => {
        setShowPopup(false);
        window.location.reload();
    };

    const handleDocumentUpload = (event, index) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const updatedData = [...importedData];
            updatedData[index] = { ...updatedData[index], document: files[0], index: index };
            setImportedData(updatedData);
            setUpdatedImportedData(updatedData);

            // Set includeDocument to true when a document is uploaded for the corresponding item
            setIncludeDocument(true);
        }
    };
    const fileInputRef = useRef(null);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const startImport = async (jsonData) => {
        setLoading(true);
        let errors = [];

        try {
            const promises = jsonData.map(async (row) => {
                const formData = new FormData();
                if (includeDocument) {
                    formData.append('document', row.document);
                } else {
                    formData.append('document', null);
                }
                const index = row.index;
                formData.append('name', row['Name']);
                formData.append('priority', row['Priority']);
                formData.append('teamtype', row['ProjectType']);
                formData.append('price', row['Price']);
                formData.append('currency', row['Currency']);
                formData.append('billingtype', row['BillingType']);
                formData.append('status', row['Status']);
                formData.append('description', row['Description']);
                formData.append('startdate', AppUtils.getDateFormat(row['StartDate']));
                formData.append('enddate', AppUtils.getDateFormat(row['EndDate']));
                formData.append('clientid', row['ClientId']);
                formData.append('projectlead', row['ProjectLead']);

                try {
                    const res = await createProjects(formData);
                    if (!res || res.status !== AppConfigProps.httpStatusCode.ok || !res.data) {
                        const errorDetails = await manageImportError(res.data, history);
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
                path: 'startImport',
                statusCode: error.status,
                message: error.message
            };
            errors.push(errorDetails);
        } finally {
            setLoading(false);
            if (errors.length > 0) {
                localStorage.setItem('processingErrors', JSON.stringify(errors));
                history.push('/importError');
            } else {
                window.location.reload();
            }
        }
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
                handleOpenModal(jsonData);
            };
            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error('Error importing file:', error);
        }
    };

    const fetchUserByFullname = async (fullname) => {
        try {
            const token = AppUtils.getIdentityAccessToken();
            // Fetch user details by full name
            const response = await axios.get(
                `http://localhost:8080/api/v1/user/fullname/${fullname}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    cancelToken: _cancelToken.token
                }
            );

            if (response.status === 200) {
                // Extract user ID from response
                const userId = response.data.id;
                // Redirect to employee view
                handleViewEmployee(userId);
            } else {
                console.error('User not found');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const handleViewEmployee = (userId) => {
        // Assuming the URL includes the userId
        const url = `http://localhost:3000/employee/${userId}`;
        window.open(url, '_blank', 'noopener,noreferrer');
        handlePopUpClose();
    };

    // Show modal with documents
    const handleShowModal = (documents) => {
        setDocuments(documents);
        setShowModal(true);
    };

    // Close modal
    const handleCloseDownloadModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            <Button
                onClick={handleImportClick}
                style={{
                    marginLeft: '20px',
                    float: 'right',
                    fontSize: '10px',
                    borderRadius: '20px',
                    color: '#F06D4B',
                    borderColor: '#F06D4B',
                    marginBottom: '10px'
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
                                borderRadius: '50%'
                            }}
                        />
                        Importing Data...
                    </>
                ) : (
                    'Import Data'
                )}
            </Button>

            <Button
                onClick={exportToCSV}
                style={{
                    marginLeft: '20px',
                    float: 'right',
                    fontSize: '10px',
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
                    marginBottom: '5px',
                    borderRadius: '40px',
                    fontSize: '10px'
                }}
            >
                + Add Project
            </Button>

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
            {/* Import related Dialog Box */}
            <Modal
                open={showPopup}
                onClose={handleCloseDownloadModal}
                aria-labelledby='import-modal-title'
                aria-describedby='import-modal-description'
            >
                <Box
                    sx={{
                        width: 900,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    <AppBar position='static'>
                        <CardHeader title='Upload Documents'>
                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                    color: 'inherit'
                                }}
                                onClick={handleCloseModal}
                            >
                                <HighlightOffIcon />
                            </IconButton>
                        </CardHeader>
                    </AppBar>
                    <CardContent>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Project Name</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Project Lead</TableCell>
                                        <TableCell>Document</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {importedData &&
                                        importedData.map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{row.Name}</TableCell>
                                                <TableCell>{row.Description}</TableCell>
                                                <TableCell>{row.ProjectLead}</TableCell>
                                                <TableCell>
                                                    <input
                                                        type='file'
                                                        onChange={(event) =>
                                                            handleDocumentUpload(event, index)
                                                        }
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button onClick={handleCloseModal} color='secondary'>
                            Cancel
                        </Button>
                        <Button onClick={() => startImport(importedData)} variant='contained'>
                            Start Import
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Input
                type='text'
                placeholder='Search projects...'
                value={searchQuery}
                onChange={handleSearch}
                sx={{
                    color: '#0070ac',
                    marginBottom: 2,
                    padding: 1,
                    width: 200, // Adjust the width as needed
                    height: 33,
                    borderRadius: 3.1,
                    fontSize: 12,
                    border: '2px solid #0070ac',
                    '&:focus': {
                        borderColor: '#0070ac', // Change color on focus
                        boxShadow: (theme) => `0 0 0 0.2rem ${theme.palette.primary.main}`
                    }
                }}
            />

             <ProjectFilesModal
                open={showModal}
                onClose={handleCloseModal}
                documents={documents}
                handleDownload={handleDownload}
            />
            <TableContainer component={Paper}>
                <Table
                    sx={{ minWidth: 700, borderCollapse: 'collapse' }}
                    aria-label='customized table'
                >
                    <TableHead>
                        <TableRow>
                        
                            <StyledTableCell style={{ width: '40px', ...columnBorderStyle }}>
                                <IconButton size='small' onClick={handleExpandAll}>
                                    {areAllProjectsExpanded() ? (
                                        <ExpandLessIcon />
                                    ) : (
                                        <ExpandMoreIcon />
                                    )}
                                </IconButton>
                                Expand All
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {ProjectMsgResProps.body.form.action.label}
                            </StyledTableCell>
                            <StyledTableCell
                                onClick={() => handleSort('name')}
                                style={columnBorderStyle}
                            >
                                {ProjectMsgResProps.body.form.project.label}
                            </StyledTableCell>
                            <StyledTableCell
                                onClick={() => handleSort('startdate')}
                                style={columnBorderStyle}
                            >
                                {ProjectMsgResProps.body.form.startdate.label}
                            </StyledTableCell>
                            <StyledTableCell
                                onClick={() => handleSort('enddate')}
                                style={columnBorderStyle}
                            >
                                {ProjectMsgResProps.body.form.enddate.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {ProjectMsgResProps.body.form.price.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {ProjectMsgResProps.body.form.currency.label}
                            </StyledTableCell>
                            {/* <StyledTableCell
                                onClick={() => handleSort('priority')}
                                style={columnBorderStyle}
                            >
                                {ProjectMsgResProps.body.form.priority.label}
                            </StyledTableCell> */}
                            <StyledTableCell style={columnBorderStyle}>
                                {ProjectMsgResProps.body.form.priority.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {ProjectMsgResProps.body.form.projectlead.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {ProjectMsgResProps.body.form.billingtype.label}
                            </StyledTableCell>
                            <StyledTableCell
                                onClick={() => handleSort('teamtype')}
                                style={columnBorderStyle}
                            >
                                {ProjectMsgResProps.body.form.teamtype.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {ProjectMsgResProps.body.form.status.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {ProjectMsgResProps.body.form.description.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {ProjectMsgResProps.body.form.document.label}
                            </StyledTableCell>
                           
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedProjects()
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((project, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <StyledTableRow>
                                            <StyledTableCell
                                                style={{ width: '40px', ...columnBorderStyle }}
                                            >
                                                <IconButton
                                                    aria-label={
                                                        isProjectExpanded(project.name)
                                                            ? 'collapse'
                                                            : 'expand'
                                                    }
                                                    size='small'
                                                    style={{ color: 'gray' }}
                                                    onClick={(event) =>
                                                        handleExpand(event, project.name)
                                                    }
                                                >
                                                    {isProjectExpanded(project.name) ? (
                                                        <ExpandLessIcon />
                                                    ) : (
                                                        <ExpandMoreIcon />
                                                    )}
                                                </IconButton>
                                            </StyledTableCell>
                                            
                                            <StyledTableCell
                                                component='th'
                                                scope='row'
                                                style={columnBorderStyle}
                                            >
                                                <MoreVertIcon
                                                    aria-describedby={project.id}
                                                    id={project.id}
                                                    onClick={(event) =>
                                                        handlePopUpClick(event, project.id)
                                                    }
                                                />
                                                <Popover
                                                    id={project.id}
                                                    open={popUpOpen}
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
                                                                handleEditProject();
                                                            }}
                                                        >
                                                            <EditIcon />{' '}
                                                            <ListItemText inset className='pl-5'>
                                                                Edit
                                                            </ListItemText>
                                                        </MenuItem>
                                                        <MenuItem
                                                            onClick={() => {
                                                                deleteProjects();
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
                                                {project.name ? project.name : '-'}
                                            </StyledTableCell>

                                            <StyledTableCell
                                                component='th'
                                                scope='row'
                                                style={columnBorderStyle}
                                            >
                                                {project.startdate
                                                    ? AppUtils.getDateFormat(project.startdate)
                                                    : '-'}
                                            </StyledTableCell>
                                            <StyledTableCell
                                                component='th'
                                                scope='row'
                                                style={columnBorderStyle}
                                            >
                                                {project.enddate
                                                    ? AppUtils.getDateFormat(project.enddate)
                                                    : '-'}
                                            </StyledTableCell>
                                            <StyledTableCell
                                                component='th'
                                                scope='row'
                                                style={columnBorderStyle}
                                            >
                                                {project.price ? project.price : '-'}
                                            </StyledTableCell>
                                            <StyledTableCell
                                                component='th'
                                                scope='row'
                                                style={columnBorderStyle}
                                            >
                                                {project.currency ? project.currency : '-'}
                                            </StyledTableCell>
                                            <StyledTableCell
                                                component='th'
                                                scope='row'
                                                style={columnBorderStyle}
                                            >
                                                {project.priority ? project.priority : '-'}
                                            </StyledTableCell>
                                            <StyledTableCell
                                                component='th'
                                                scope='row'
                                                style={columnBorderStyle}
                                            >
                                                {project.projectlead ? (
                                                    <a
                                                        href='#'
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            fetchUserByFullname(
                                                                project.projectlead
                                                            );
                                                        }}
                                                        className='project-lead-link'
                                                        target='_blank'
                                                        rel='noopener noreferrer'
                                                    >
                                                        {project.projectlead}
                                                    </a>
                                                ) : (
                                                    '-'
                                                )}
                                            </StyledTableCell>
                                            <StyledTableCell
                                                component='th'
                                                scope='row'
                                                style={columnBorderStyle}
                                            >
                                                {project.billingtype ? project.billingtype : '-'}
                                            </StyledTableCell>
                                            <StyledTableCell
                                                component='th'
                                                scope='row'
                                                style={columnBorderStyle}
                                            >
                                                {project.teamtype ? project.teamtype : '-'}
                                            </StyledTableCell>
                                            <StyledTableCell
                                                component='th'
                                                scope='row'
                                                style={columnBorderStyle}
                                            >
                                                {project.status ? project.status : '-'}
                                            </StyledTableCell>
                                            <StyledTableCell
                                                component='th'
                                                scope='row'
                                                style={columnBorderStyle}
                                            >
                                                {project.description ? project.description : '-'}
                                            </StyledTableCell>

                                            {/* <StyledTableCell
                                                component='th'
                                                scope='row'
                                                style={columnBorderStyle}
                                            >
                                                {project.priority ? project.priority : '-'}
                                            </StyledTableCell> */}

                                             <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {project.documents && project.documents.length > 0 ? (
                                            <p>
                                                <a
                                                    href='#'
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleShowModal(project.documents); 
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

                                        {isProjectExpanded(project.name) && (
                                            <StyledTableRow style={expandedTableStyles.tableRow}>
                                                <TableCell colSpan={16} style={{ padding: '16px' }}>
                                                    <Table style={expandedTableStyles.table}>
                                                        <TableHead
                                                            style={expandedTableStyles.tableHead}
                                                        >
                                                            <TableRow
                                                                style={expandedTableStyles.tableRow}
                                                            >
                                                                <TableCell
                                                                    style={
                                                                        expandedTableStyles.tableCell
                                                                    }
                                                                    colSpan={2}
                                                                >
                                                                    User Full Name
                                                                </TableCell>
                                                                <TableCell
                                                                    style={
                                                                        expandedTableStyles.tableCell
                                                                    }
                                                                    colSpan={2}
                                                                >
                                                                    Contact Number
                                                                </TableCell>
                                                                <TableCell
                                                                    style={
                                                                        expandedTableStyles.tableCell
                                                                    }
                                                                    colSpan={2}
                                                                >
                                                                    Designation
                                                                </TableCell>
                                                                <TableCell
                                                                    style={
                                                                        expandedTableStyles.tableCell
                                                                    }
                                                                    colSpan={2}
                                                                >
                                                                    Email
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody
                                                            style={expandedTableStyles.tableBody}
                                                        >
                                                            {Array.isArray(
                                                                projectUsers[project.name]
                                                            ) ? (
                                                                projectUsers[project.name].map(
                                                                    (user, userIndex) => (
                                                                        <TableRow
                                                                            key={userIndex}
                                                                            style={
                                                                                expandedTableStyles.tableRow
                                                                            }
                                                                        >
                                                                            <TableCell
                                                                                style={
                                                                                    expandedTableStyles.tableCell
                                                                                }
                                                                                colSpan={2}
                                                                            >
                                                                                {user.fullname}
                                                                            </TableCell>
                                                                            <TableCell
                                                                                style={
                                                                                    expandedTableStyles.tableCell
                                                                                }
                                                                                colSpan={2}
                                                                            >
                                                                                {user.phone}
                                                                            </TableCell>
                                                                            <TableCell
                                                                                style={
                                                                                    expandedTableStyles.tableCell
                                                                                }
                                                                                colSpan={2}
                                                                            >
                                                                                {user.designation}
                                                                            </TableCell>
                                                                            <TableCell
                                                                                style={
                                                                                    expandedTableStyles.tableCell
                                                                                }
                                                                                colSpan={2}
                                                                            >
                                                                                {user.workEmail}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    )
                                                                )
                                                            ) : (
                                                                <TableRow>
                                                                    <TableCell colSpan={8}>
                                                                        Invalid projectNames data
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </TableCell>
                                            </StyledTableRow>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>

            <AddProjects
                open={open}
                handleClose={handleClose}
                Backdrop={Backdrop}
                method={selectedMethod}
                projectDetails={selectedProjectDetails}
                reloadProjects={loadPageData}
            />
        </div>
    );
}
