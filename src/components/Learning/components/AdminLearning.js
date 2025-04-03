import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Input from '@mui/material/Input';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import Stack from '@mui/material/Stack';
import { getLearning, viewLearningDetails } from '../actions/learning-actions';
import { manageError } from '../../core/actions/common-actions';
import { AppConfigProps } from '../../core/settings/app-config';
import { LearningMsgResProps } from '../messages/learning-properties';
import Learning from './Learning';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';

import PublishIcon from '@mui/icons-material/Publish';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.gray,
        color: theme.palette.common.black
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14
    }
}));

const columnBorderStyle = {
    borderRight: '1px solid #ccc', // Adjust the border color and style as needed
};

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
    // Axios cancel token for request cancellation
    const _axiosSource = axios.CancelToken.source();
    const _cancelToken = { cancelToken: _axiosSource.token };
    const history = useHistory();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [learning, setLearning] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // State for pagination and search
    const loadPageData = async () => {
        await getLearning()
            .then(async (res) => {
                if (
                    res &&
                    res.status === AppConfigProps.httpStatusCode.ok &&
                    res.data &&
                    res.data
                ) {
                    // setLearning(res.data);
                    // console.log(res.data);
                    const filteredData = res.data.filter((edu) => !edu.user.disabled);
                    filteredData.sort((a, b) => b.user.id - a.user.id);
                    setLearning(filteredData);
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

    // Handle search input change
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Handle pagination changes
    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

    // Filter learning data based on search query
    const filteredLearning = learning
        ? learning.filter((learn) => {
            const searchString = `${learn.user?.employeeid} ${learn.user?.fullname} ${learn.title} ${learn.completionPercentage} ${learn.watchedLink} ${learn.evidenceattachments} ${learn.startDate} ${learn.completionDate} `;
            return searchString.toLowerCase().includes(searchQuery.toLowerCase());
        })
        : [];


    // Paginate filtered learning data
    const paginatedLearning = filteredLearning.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    // Handle file download
    const handleDownload = async (relativePath) => {
        console.log('Relative Path:', relativePath);
        try {
            // Make a GET request to the backend with the file name as a query parameter
            const response = await axios.get(
                `http://localhost:8080/api/v1/file/download`,
                {
                    params: {
                        fileName: relativePath, // Include the file name as a query parameter
                    },
                    responseType: 'blob', // Ensure the response type is blob
                }
            );
    
            // Check the file extension
            const fileExtension = relativePath.split('.').pop().toLowerCase();
    
            // Determine the MIME type based on file extension
            let mimeType = '';
            if (fileExtension === 'doc') {
                mimeType = 'application/msword';
            } else if (fileExtension === 'docx') {
                mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            } else {
                console.warn('Unsupported file type. Ignoring.');
                return; // Exit the function if the file type is unsupported
            }
    
            // Create a URL for the blob
            const url = window.URL.createObjectURL(new Blob([response.data], { type: mimeType }));
    
            // Open the file in a new tab
            window.open(url, '_blank');
    
            // Clean up the URL object
            window.URL.revokeObjectURL(url);
    
        } catch (error) {
            console.error('Error handling file:', error);
        }
    };
    
    // Export filtered data to CSV
    const exportToCSV = () => {
        const csvRows = [];
        // Adding headers
        csvRows.push(
            [
                'ID',
                'Employee Id',
                'Employee Name',
                'Title',
                '% Of Completion',
                'Start Date',
                'Completion Date',
                'Watched Link',
                'Evidence Attachments'
            ].join(',')
        );
        // Adding data rows
        filteredLearning.forEach((learn) => {
            const rowData = [
                learn.id || '-',
                learn.user?.employeeid || '-',
                learn.user?.fullname || '-',
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

    return (
        <div>
           <Input
                type='text'
                placeholder='Search... Learning Details'
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{
                    color: '#0070ac',
                    marginBottom: 2,
                    padding: 1,
                    width: 200, // Adjust the width as needed
                    height:33,
                    borderRadius: 3.1,
                    fontSize: 12,
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
                    fontSize: '10px',
                    borderRadius: '20px',
                    color: '#F06D4B',
                    borderColor: '#F06D4B',
                    marginBottom: '10px'
                }}
                variant='outlined'
                startIcon={<DownloadIcon style={{ fontSize: 12 }} />}
            >
                Export to CSV
            </Button>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 1100 }} aria-label='customized table'>
                    <TableHead sx={{ backgroundColor: '#E7E9EA' }}>
                        <TableRow>
                            <StyledTableCell style={columnBorderStyle}>Employee Id</StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>Employee Name</StyledTableCell>
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
                        {paginatedLearning.length > 0 ? (
                            paginatedLearning.map((learning, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell component='th' scope='row' style={columnBorderStyle}>
                                        {learning.user?.employeeid
                                            ? learning.user?.employeeid
                                            : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell component='th' scope='row' style={columnBorderStyle}>
                                        {learning.user?.fullname ? learning.user?.fullname : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell component='th' scope='row' style={columnBorderStyle}>
                                        {learning.title ? learning.title : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell component='th' scope='row' style={columnBorderStyle} sx={{ textAlign: 'center' }}>
                                        {learning.completionPercentage ? learning.completionPercentage : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell component='th' scope='row' style={columnBorderStyle}>
                                        {learning.startDate ? learning.startDate : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell component='th' scope='row' style={columnBorderStyle}>
                                        {learning.completionDate ? learning.completionDate : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell component='th' scope='row' style={columnBorderStyle}>
                                        {learning.watchedLink ? (
                                            <a href={learning.watchedLink} target='_blank'>
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
                                        {learning.evidenceattachments ? (
                                            <a
                                                href={learning.evidenceattachments}
                                                target='_blank'
                                                onClick={(e) => {
                                                    e.preventDefault(); // Prevent the default link behavior
                                                    handleDownload(learning.evidenceattachments);
                                                }}
                                                rel='noreferrer'
                                            >
                                                {learning.evidenceattachments}
                                            </a>
                                        ) : (
                                            '-'
                                        )}
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))
                        ) : (
                            <StyledTableRow>
                                <StyledTableCell colSpan={8}>No Data Found.</StyledTableCell>
                            </StyledTableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredLearning.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </div>
    );
}


