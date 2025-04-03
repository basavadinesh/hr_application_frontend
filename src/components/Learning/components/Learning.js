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
    getLearning,
    viewLearningDetails,
    deleteLearning
} from '../actions/learning-actions';
import { manageError } from '../../core/actions/common-actions';
import { AppConfigProps } from '../../core/settings/app-config';
import { LearningMsgResProps } from '../messages/learning-properties';
import AppUtils from '../../core/helpers/app-utils';
import Backdrop from '@mui/material/Backdrop';
import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddLearning from './AddLearning';
import Input from '@mui/material/Input';
import DownloadIcon from '@mui/icons-material/Download';
import TablePagination from '@mui/material/TablePagination';

import LearningFilesModal from './LearningFilesModal'


// Styled TableCell component with customized styles
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.gray,
        color: theme.palette.common.black
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14
    }
}));

// Styled TableRow component with customized styles
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(even)': {
        backgroundColor: theme.palette.action.hover
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0
    }
}));


// Style for table column borders
const columnBorderStyle = {
    borderRight: '1px solid #ccc' // Adjust the border color and style as needed
};


// Main Learning Component
export default function Learning(props) {

    // Setup axios cancellation
    const _axiosSource = axios.CancelToken.source();
    const _cancelToken = { cancelToken: _axiosSource.token };

    // Router history
    const history = useHistory();

    // State hooks
    const [learning, setLearning] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedLearningID, setSelectLearningID] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedLearningDetails, setSelectedLearningDetails] = useState(null);
    
    const [showModal, setShowModal] = useState(false);
    const [documents, setDocuments] = useState([]);
    
    
    const popUpOen = Boolean(anchorEl);

    // Handle open modal
    const handleOpen = async (event) => {
        if (event === 'add') {
            await setSelectedLearningDetails(null);
        }
        await setSelectedMethod(event);
        await setOpen(true);
    };

    // Handle close modal
    const handleClose = () => {
        setOpen(false);
        loadPageData(userId);
        handlePopUpClose();
    };
    
    // Handle popup click
    const handlePopUpClick = (event, learnId) => {
        setSelectLearningID(learnId);
        setAnchorEl(event.currentTarget);
    };

    // Handle popup close
    const handlePopUpClose = () => {
        setAnchorEl(null);
    };

    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Handle search query change
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Filter and paginate learning data
    const filteredLearning = learning
        ? learning.filter(
              (item) =>
                  item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (item.completionPercentage &&
                      item.completionPercentage.toString().includes(searchQuery))
          )
        : [];

    const paginatedLearning = filteredLearning.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    // Load page data
    const loadPageData = async (userId) => {
        try {
            const res = await getLearning(_cancelToken);
            if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                const learning = res.data.content || res.data;
                const userLearning = learning.filter(
                    (learning) => learning.user.id === parseInt(userId)
                );
                setLearning(userLearning);
            } else {
                await manageError(res, props.history);
            }
        } catch (err) {
            await manageError(err, props.history);
        }
    };

    useEffect(() => {
        loadPageData(userId);
    }, []);

    // Load data on mount and user ID change
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            loadPageData(userId);
        }
    }, []);
    const userId = localStorage.getItem('userId');

    // Delete selected learning
    const deleteLearnings = async () => {
        let learningId = selectedLearningID;
        await deleteLearning(learningId, _cancelToken)
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

    // Show modal with documents
    const handleShowModal = (documents) => {
        setDocuments(documents);
        setShowModal(true);
    };

    // Close modal
    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Edit learning details
    const handleEditLearning = async () => {
        let learningId = selectedLearningID;
        await viewLearningDetails(learningId, _cancelToken)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    setSelectedLearningDetails(res.data);
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            });
        await handleOpen('edit');
    };


    // Handle file download
    const handleDownload = async (relativePath) => {
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
            const fileExtension = originalFileName.split('.').pop().toLowerCase();

            // Construct the new file name based on the file extension
            let fileName = 'Evidence_Document.' + fileExtension; // Default name with correct extension
            if (fileExtension === 'doc' || fileExtension === 'docx') {
                // Assuming you have access to the user's full name
                fileName = `${learning[0].user.fullname}_Evidence_Document.${fileExtension}`;
            } else {
                console.warn('Unsupported file type. Ignoring.');
                return; // Exit the function if the file type is unsupported
            }

            // Create a URL for the blob
            const url = window.URL.createObjectURL(
                new Blob([response.data], { type: response.headers['content-type'] })
            );

            // Create a temporary link element to trigger the download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName); // Set the constructed file name for download

            // Append the link to the document and trigger the click
            document.body.appendChild(link);
            link.click();

            // Clean up
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error handling file:', error);
        }
    };

    // Export data to CSV
    const exportToCSV = () => {
        const csvRows = [];
        // Adding headers
        csvRows.push(
            [
                'Title',
                '% Of Completion',
                'Start Date',
                'Completion Date',
                'Watched Link',
                'Evidence Attachments'
            ].join(',')
        );
        filteredLearning.forEach((learn) => {
            const rowData = [
                learn.title || '-',
                learn.completionPercentage || '-',
                learn.startDate || '-',
                learn.completionDate || '-',
                learn.watchedLink || '-',

                learn.evidenceattachments || '-'
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
        anchor.download = 'Learning_data.csv';
        // Triggering anchor click to download CSV
        anchor.click();
        // Cleanup
        URL.revokeObjectURL(blobUrl);
    };

    // Render Learning Component
    return (
        <div>
            <Input
                type='text'
                placeholder='Search Learning...'
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
                + Add Learning
            </Button>

            <LearningFilesModal
                open={showModal}
                onClose={handleCloseModal}
                documents={documents}
                handleDownload={handleDownload}
            />
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label='customized table'>
                    <TableHead sx={{ backgroundColor: '#E7E9EA' }}>
                        <TableRow>
                        <StyledTableCell style={columnBorderStyle}>
                                {LearningMsgResProps.body.form.action.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {LearningMsgResProps.body.form.title.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {LearningMsgResProps.body.form.completionPercentage.label}
                            </StyledTableCell>

                            <StyledTableCell style={columnBorderStyle}>
                                {LearningMsgResProps.body.form.startDate.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {LearningMsgResProps.body.form.completionDate.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {LearningMsgResProps.body.form.watchedLink.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {LearningMsgResProps.body.form.evidenceattachments.label}
                            </StyledTableCell>
                            
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedLearning && paginatedLearning.length > 0 ? (
                            paginatedLearning.map((learning, index) => (
                                <StyledTableRow key={index}>
                                <StyledTableCell component='th' scope='row'>
                                        &nbsp;&nbsp;&nbsp;
                                        <MoreVertIcon
                                            aria-describedby={learning.id}
                                            id={learning.id}
                                            onClick={(event) =>
                                                handlePopUpClick(event, learning.id)
                                            }
                                        />
                                        <Popover
                                            id={learning.id}
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
                                                        handleEditLearning();
                                                    }}
                                                >
                                                    <EditIcon />{' '}
                                                    <ListItemText inset className='pl-5'>
                                                        Edit
                                                    </ListItemText>
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={() => {
                                                        deleteLearnings();
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
                                        {learning.title ? learning.title : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                        sx={{ textAlign: 'center' }}
                                    >
                                        {learning.completionPercentage
                                            ? learning.completionPercentage
                                            : '-'}
                                    </StyledTableCell>

                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {learning.startDate
                                            ? AppUtils.getDateFormat(learning.startDate)
                                            : '-'}
                                    </StyledTableCell>

                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {learning.completionDate
                                            ? AppUtils.getDateFormat(learning.completionDate)
                                            : '-'}
                                    </StyledTableCell>

                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {learning.watchedLink ? (
                                            <a
                                                href={learning.watchedLink}
                                                target='_blank'
                                                rel='noreferrer'
                                            >
                                                {learning.watchedLink}
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
                                        {learning.documents && learning.documents.length > 0 ? (
                                            <p>
                                                <a
                                                    href='#'
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleShowModal(learning.documents); // Show the modal with the document list
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
                    count={filteredLearning.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            <AddLearning
                open={open}
                handleClose={handleClose}
                Backdrop={Backdrop}
                method={selectedMethod}
                learningDetails={selectedLearningDetails}
                reloadLearning={loadPageData}
            />
        </div>
    );
}
