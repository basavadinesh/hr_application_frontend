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
import { getEducation } from '../actions/education-actions';
import { manageError } from '../../core/actions/common-actions';
import Backdrop from '@mui/material/Backdrop';
import { AppConfigProps } from '../../core/settings/app-config';
import { EducationMsgResProps } from '../messages/education-properties';
import DownloadIcon from '@mui/icons-material/Download';
import TablePagination from '@mui/material/TablePagination';
import AddEducation from './AddEducation';
import { Button } from '@mui/material';

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

const columnBorderStyle = {
    borderRight: '1px solid #ccc'
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
    const _axiosSource = axios.CancelToken.source();
    const _cancelToken = { cancelToken: _axiosSource.token };
    const history = useHistory();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [education, setEducations] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [open, setOpen] = React.useState(false);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [selectedEducationDetails, setSelectedEducationDetails] = useState(null);
    const userId = localStorage.getItem('userId');
    const [anchorEl, setAnchorEl] = useState(null);

    // Handle modal open event
    const handleOpen = async (event) => {
        if (event === 'add') {
            await setSelectedEducationDetails(null);
        }
        await setSelectedMethod(event);
        await setOpen(true);
    };

    // Load education data from the API
    const loadPageData = async () => {
        await getEducation()
            .then(async (res) => {
                if (
                    res &&
                    res.status === AppConfigProps.httpStatusCode.ok &&
                    res.data &&
                    res.data
                ) {
                    const filteredData = res.data.filter((edu) => !edu.user_id.disabled);
                    filteredData.sort((a, b) => b.user_id.id - a.user_id.id);
                    setEducations(filteredData);
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            });
    };

    // Handle modal close event
    const handleClose = () => {
        setOpen(false);
        loadPageData(userId);
        handlePopUpClose();
    };

    // Close pop-up menu
    const handlePopUpClose = () => {
        setAnchorEl(null);
    };

    const popUpOen = Boolean(anchorEl);

    // Load data on component mount
    useEffect(() => {
        loadPageData();
    }, []);

    // Handle search input change
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Handle page change in pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle rows per page change in pagination
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Filter education data based on search query
    const filteredEducation = education
        ? education.filter((edu) => {
              const searchString = `${edu.user_id?.employeeid} ${edu.user_id?.fullname} ${edu.education} ${edu.specification} ${edu.institution} ${edu.gpa} ${edu.startyear} ${edu.endyear} `;

              return searchString.toLowerCase().includes(searchQuery.toLowerCase());
          })
        : [];

    // Paginate filtered education data
    const pagenatedEducation = filteredEducation.slice(
        page * rowsPerPage,
        (page + 1) * rowsPerPage
    );

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
            const documents =
                edu.documents && edu.documents.length > 0
                    ? edu.documents
                          .map((doc) => `=HYPERLINK(""${doc.filepath}"", ""${doc.filename}"")`)
                          .join(', ')
                    : '-';
            const rowData = [
                edu.user_id?.employeeid || '-',
                edu.user_id?.fullname || '-',
                edu.education || '-',
                edu.specification || '-',
                edu.institution || '-',
                edu.startyear || '-',
                edu.endyear || '-',
                edu.gpa || '-',
                documents
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

    return (
        <div>
            <Input
                type='text'
                placeholder='Search... Education Details'
                value={searchQuery}
                onChange={handleSearchChange}
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

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 1300 }} aria-label='customized table'>
                    <TableHead sx={{ backgroundColor: '#E7E9EA' }}>
                        <TableRow>
                            <StyledTableCell style={columnBorderStyle}>Employee Id</StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                Employee Name
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
                            <StyledTableCell style={columnBorderStyle}>GPA</StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EducationMsgResProps.body.form.documents.label}
                            </StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pagenatedEducation.length > 0 ? (
                            pagenatedEducation.map((education, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {education.user_id?.employeeid
                                            ? education.user_id?.employeeid
                                            : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {education.user_id?.fullname
                                            ? education.user_id?.fullname
                                            : '-'}
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
                                        {education.startyear ? education.startyear : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {education.endyear ? education.endyear : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {education.gpa ? education.gpa : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {education.documents && education.documents.length > 0
                                            ? education.documents.map((document, i) => {
                                                  return (
                                                      <p key={i}>
                                                          <a
                                                              href={
                                                                  document ? document.filepath : '-'
                                                              }
                                                              target='_blank'
                                                              rel='noreferrer'
                                                          >
                                                              {document ? document.filename : '-'}
                                                          </a>
                                                      </p>
                                                  );
                                              })
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
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component='div'
                    count={filteredEducation.length}
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
