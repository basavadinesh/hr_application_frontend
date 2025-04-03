import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Tooltip, Menu } from '@mui/material';
import { keyframes } from '@emotion/react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Button from '@mui/material/Button';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
    getEmployees,
    viewEmployeeDetails,
    deleteEmployee,
    restoreEmployee,
    createEmployees,
    resetEmployeePassword
} from '../actions/employee-actions';
// import { AppURLProps } from '../../core/settings/app-urls';
import { manageError, manageImportError } from '../../core/actions/common-actions';
import { AppConfigProps } from '../../core/settings/app-config';
import { EmployeeMsgResProps } from '../messages/employee-properties';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InfoIcon from '@mui/icons-material/Info';
import AppUtils from '../../core/helpers/app-utils';
import AddEmployee from './AddEmployee';
import AddRelievingInfo from './AddRelievingInfo';
import ViewEmployee from './AddEmployee';
import Backdrop from '@mui/material/Backdrop';
import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { getDesignations } from '../../designations/actions/designation-actions';
import { getDepartments } from 'components/departments/actions/department-actions';
import { getCountries } from '../actions/employee-actions';
import { getStates } from '../actions/employee-actions';
import Select from '@mui/material/Select';
import { Modal } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
// import ListItemIcon from '@mui/material/ListItemIcon';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import RestoreIcon from '@mui/icons-material/Restore';
import LockIcon from '@mui/icons-material/Lock';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CardHeader from '@mui/material/CardHeader';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
// import Menu from '@mui/material/Menu';
import DownloadIcon from '@mui/icons-material/Download';
import * as XLSX from 'xlsx';
import Input from '@mui/material/Input';
import TablePagination from '@mui/material/TablePagination';
import SLUGS from 'resources/slugs';
import EmployeePreview from './EmployeePreview';

// import { transform } from 'typescript';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '0px solid #000',
    boxShadow: 2
};

const clickAnimation = keyframes`
  0% {
    background-color: transparent;
    transform: scale(1);
  }
  50% {
    background-color: rgba(0, 255, 0, 0.6); /* Intense green color */
    transform: scale(1.05);
  }
  100% {
    background-color: transparent;
    transform: scale(1);
  }
`;

const AnimatedIconButton = styled(IconButton)(({ theme }) => ({
    color: '#1E88E5',
    borderColor: '#1E88E5',
    borderWidth: '1px',
    borderStyle: 'solid',
    padding: '5px',
    '&:hover': {
        backgroundColor: 'rgba(0, 255, 0, 0.1)' // Light green on hover
    },
    '&:active': {
        backgroundColor: 'rgba(0, 255, 0, 0.6)', // Intense green on click
        animation: `${clickAnimation} 0.15s ease-out` // Adjust animation duration for quicker effect
    }
}));

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//     [`&.${tableCellClasses.head}`]: {
//         backgroundColor: theme.palette.common.gray,
//         color: theme.palette.common.black
//     },
//     [`&.${tableCellClasses.body}`]: {
//         fontSize: 14,
//         whiteSpace: 'normal' // Allow text to wrap within cell
//         // Break words at appropriate points
//     }
// }));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.gray,
        color: theme.palette.common.black
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        maxWidth: '200px', // Adjust as necessary
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
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
    borderRight: '1px solid #ccc',
    // fontSize: '15px',
    minWidth: '190px'
};

const addressColumnStyle = {
    borderRight: '1px solid #ccc',
    minWidth: '200px',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    overflow: 'hidden'
};

export default function CustomizedTables() {
    const _axiosSource = axios.CancelToken.source();
    const _cancelToken = { cancelToken: _axiosSource.token };
    const history = useHistory();
    const [employees, setEmployees] = useState(null);
    // const [employeesPageRecords, setEmployeesPageRecords] = useState(null);
    // const [employeesAllRecords, setEmployeesAllRecords] = useState(null);
    const [open, setOpen] = useState(false);
    const [infoopen, setInfoopen] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);

    const handleOpen = async (event) => {
        if (event === 'add') {
            // Set the employee details first
            await setSelectedEmployeeDetails(null);

            const stateData = {
                open,
                method: event,
                employeeDetails: selectedEmployeeDetails,
                designations,
                departments,
                countries,
                states,
                activeEditCard: 'AllEmployees',
                manager: employees
            };
            localStorage.setItem('employmentFormState', JSON.stringify(stateData));
            const baseDomain = window.location.origin;
            const url = `${baseDomain}/employmentform`;
            window.open(url, '_blank', 'noopener,noreferrer');
            // Then navigate using history.push
            // history.push(SLUGS.employementform, {
            //     open,
            //     method: event,
            //     employeeDetails: selectedEmployeeDetails,
            //     designations,
            //     departments,
            //     countries,
            //     states,
            //     activeEditCard: 'AllEmployees',
            //     manager: employees
            // });
        }
    };

    const handleInfoOpen = async (event) => {
        // if (event === 'add') {
        //     await setSelectedEmployeeDetails(null);
        //     await setSelectedRelievingDetails(null);
        // }
        await setInfoopen(true);
    };

    const handlePreviewOpen = (employeeData) => {
        setSelectedEmployeeDetails(employeeData);
        setPreviewOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        loadPageData();
        // handlePopUpClose();
        setexportAnchorEl(false);
    };

    const handleInfoClose = () => {
        setInfoopen(false);
        history.push(SLUGS.employees);
        handlePopUpClose();
    };

    const handlePreviewClose = () => {
        setPreviewOpen(false);
        history.push(SLUGS.employees);
        handlePopUpClose();
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const [exportanchorEl, setexportAnchorEl] = useState(null);

    const [handleEmployeeName, setHandleEmployeeName] = useState('');
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [selectedInfoMethod, setSelectedInfoMethod] = useState(null);
    const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null);
    const [selectedRelievingDetails, setSelectedRelievingDetails] = useState(null);

    const [designations, setDesignations] = useState(null);
    const [departments, setDepartments] = useState(null);
    const [countries, setCountries] = useState(null);
    const [states, setStates] = useState(null);

    const [filterCriteria, setFilterCriteria] = useState('active');
    const [activeCount, setActiveCount] = useState(0);
    const [inactiveCount, setInactiveCount] = useState(0);

    const [isLoading, setLoading] = useState(false);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [searchQuery, setSearchQuery] = useState('');

    const [selectedEmployeeID, setSelectedEmployeeID] = useState(null);

    const handleFilterChange = (event) => {
        setFilterCriteria(event.target.value);
        loadPageData();
    };

    useEffect(() => {}, [handleEmployeeName]);

    const handlePopUpClick = (event, employeeName, empId) => {
        setSelectedEmployeeID(empId);
        setHandleEmployeeName(employeeName);
        setAnchorEl(event.currentTarget);
    };

    const handlePopUpClose = () => {
        setAnchorEl(null);
        setSelectedEmployeeID(null);
    };
    const handleClick = (event) => {
        setexportAnchorEl(event.currentTarget);
    };

    const popUpOen = Boolean(anchorEl);
    const exportpopUpOen = Boolean(exportanchorEl);

    const isSignedUrlValid = (timestamp) => {
        const currentTime = new Date().getTime();
        return currentTime - timestamp < 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    };

    const loadPageData = async () => {
        try {
            const res = await getEmployees(_cancelToken);
            if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                let filteredEmployees = res.data;

                const activeEmployees = res.data.filter((employee) => !employee.disabled);

                const inactiveEmployees = res.data.filter((employee) => employee.disabled);

                setActiveCount(activeEmployees.length);
                setInactiveCount(inactiveEmployees.length);

                if (filterCriteria === 'active') {
                    filteredEmployees = activeEmployees;
                } else if (filterCriteria === 'inactive') {
                    filteredEmployees = inactiveEmployees;
                }

                filteredEmployees.sort((a, b) => b.id - a.id);

                // Request signed URLs for employee images with caching logic
                const updatedEmployees = await Promise.all(
                    filteredEmployees.map(async (employee) => {
                        if (employee.imageurl && employee.imageurl.trim()) {
                            const cachedSignedUrl = localStorage.getItem(
                                `signedUrl_${employee.id}`
                            );
                            const cachedTimestamp = localStorage.getItem(
                                `signedUrlTimestamp_${employee.id}`
                            );

                            if (
                                cachedSignedUrl &&
                                cachedTimestamp &&
                                isSignedUrlValid(cachedTimestamp)
                            ) {
                                employee.imageurl = cachedSignedUrl;
                            } else {
                                try {
                                    const fileName = employee.imageurl.substring(
                                        employee.imageurl.lastIndexOf('/') + 1
                                    );
                                    const signedUrlResponse = await axios.get(
                                        `${AppConfigProps.serverRoutePrefix}/generate-signed-url`,
                                        { params: { filePath: fileName } }
                                    );
                                    if (
                                        signedUrlResponse.data &&
                                        signedUrlResponse.data.signedUrl
                                    ) {
                                        employee.imageurl = signedUrlResponse.data.signedUrl;
                                        localStorage.setItem(
                                            `signedUrl_${employee.id}`,
                                            employee.imageurl
                                        );
                                        localStorage.setItem(
                                            `signedUrlTimestamp_${employee.id}`,
                                            new Date().getTime()
                                        );
                                    }
                                } catch (error) {
                                    console.error('Error fetching signed URL:', error);
                                    employee.imageurl =
                                        'https://a0.anyrgb.com/pngimg/1140/162/user-profile-login-avatar-heroes-user-blue-icons-circle-symbol-logo.png';
                                }
                            }
                        } else {
                            employee.imageurl =
                                'https://a0.anyrgb.com/pngimg/1140/162/user-profile-login-avatar-heroes-user-blue-icons-circle-symbol-logo.png';
                        }
                        return employee;
                    })
                );

                setEmployees(updatedEmployees);
            } else {
                await manageError(res, history);
            }
        } catch (err) {
            await manageError(err, history);
        }
    };

    useEffect(() => {
        loadPageData();
        getEmployeeDesignations();
    }, [filterCriteria]);

    const deleteEmploees = async () => {
        let employeeId = selectedEmployeeID;
        await deleteEmployee(employeeId, _cancelToken)
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
    useEffect(() => {
        loadPageData();
    }, []);

    const handleRestoreEmployee = async () => {
        let employeeId = selectedEmployeeID;

        await restoreEmployee(employeeId, _cancelToken)
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

    const handleEditEmployee = async () => {
        let employeeId = selectedEmployeeID;
        await viewEmployeeDetails(employeeId, _cancelToken)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    setSelectedEmployeeDetails(res.data);
                    history.push(SLUGS.employementform, {
                        open: true,
                        method: 'edit',
                        employeeDetails: res.data,
                        designations,
                        departments,
                        countries,
                        activeEditCard: 'AllEmployees',
                        states,
                        manager: employees
                    });
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            });
        // await handleOpen('edit');
    };
    const handleRelievingInfo = async () => {
        let employeeId = parseInt(selectedEmployeeID, 10); // Use base 10 for conversion
        const baseUrl = '/api/v1/user'; // Adjust the base URL as needed
        const url = `${baseUrl}/relievinginfo/${employeeId}`;

        let relievingInfo = {};

        try {
            // First API call to get relieving info
            const res = await axios.get(url);
            relievingInfo = res.data;
        } catch (error) {
            console.error('Error fetching relieving info:', error);
        } finally {
            setSelectedRelievingDetails(relievingInfo || {});
        }

        try {
            // Always attempt to fetch employee details
            const employeeDetailsRes = await viewEmployeeDetails(employeeId, _cancelToken);
            if (
                employeeDetailsRes &&
                employeeDetailsRes.status === AppConfigProps.httpStatusCode.ok &&
                employeeDetailsRes.data
            ) {
                setSelectedEmployeeDetails(employeeDetailsRes.data);
            } else {
                await manageError(employeeDetailsRes, history);
            }
        } catch (error) {
            console.error('Error fetching employee details:', error);
            // Handle any error that occurred during the second request
            await manageError(error, history);
        }

        // Open the info after both API calls
        await handleInfoOpen('add');
    };

    useEffect(() => {
        loadPageData();
        getEmployeeDesignations();
        getEmployeeDepartments();
        getEmployeeCountries();
        getEmployeeStates();
    }, []);

    const getEmployeeDesignations = async () => {
        await getDesignations(_cancelToken)
            .then(async (res) => {
                if (
                    res &&
                    res.status === AppConfigProps.httpStatusCode.ok &&
                    res.data &&
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

    const getEmployeeDepartments = async () => {
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
    const getEmployeeCountries = async () => {
        await getCountries(_cancelToken)
            .then(async (res) => {
                if (
                    res &&
                    res.status === AppConfigProps.httpStatusCode.ok &&
                    res.data &&
                    res.data
                ) {
                    setCountries(res.data);
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            });
    };
    const getEmployeeStates = async () => {
        await getStates(_cancelToken)
            .then(async (res) => {
                if (
                    res &&
                    res.status === AppConfigProps.httpStatusCode.ok &&
                    res.data &&
                    res.data
                ) {
                    setStates(res.data);
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            });
    };

    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
    const [selectedEmployeeIdForReset, setSelectedEmployeeIdForReset] = useState(null);

    const handleOpenResetPasswordModal = (employeeId) => {
        setSelectedEmployeeIdForReset(employeeId);
        setShowResetPasswordModal(true);
    };

    const handleCloseResetPasswordModal = () => {
        setShowResetPasswordModal(false);
    };

    const handleResetEmployeePassword = async () => {
        let employeeId = selectedEmployeeID;
        await resetEmployeePassword(employeeId, _cancelToken)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    loadPageData();
                    handlePopUpClose();
                    // console.log('Reseted password');
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            });
    };

    const exportFilteredDataToCSV = () => {
        // Filtered data with specified columns removed
        const filteredData = filteredEmp.map((employee) => {
            const {
                id,
                password,
                confirmpassword,
                imageurl,
                country,
                state,
                address,
                zipcode,
                resetPasswordToken,
                ...filteredEmployee
            } = employee;
            return {
                ...filteredEmployee,
                address,
                state,
                country,
                zipcode: String(employee.zipcode) || '-', // Convert zipcode to string
                disabled: String(employee.disabled) || '-', // Convert disabled to string
                status: employee.disabled ? 'Inactive' : 'Active'
            };
        });

        const csvRows = [];
        // Adding headers
        csvRows.push(
            [
                'Employee Id',
                'Employee Name',
                'Email',
                'Joining Date',
                'Phone Number',
                'Reference',
                'Department',
                'Designation',
                'Role',
                'Manager',
                'Projects',
                'Employee Type',
                'Status',
                'Gender',
                'Employee Date Of Birth',
                'Marital Status',
                'Blood Group',
                'Date of Exit',
                'Work Email',
                'Work Location Name',
                'Mother Name',
                'Father Name',
                'Emergency Contact Number',
                'Permenant Address',
                'PAN Number',
                'Aadhar Number',
                'Name As Per Aadhar',
                'Address',
                'City',
                'Company',
                'State',
                'country',
                'Zip Code',
                'Disabled',
                'Account Number',
                'IFSC Code',
                'Bank Name',
                'Fresher',
                'Do you have prior experience',
                'Contact Number',
                'Spouse Name',
                'Spouse Aadhar Number',
                'Number of Kids'
            ].join(',')
        );
        // Adding data rows
        filteredData.forEach((employee) => {
            const isFresher = employee.isFresher ? 'Yes' : 'No';
            const hasExperience =
                employee.employeeExperience && employee.employeeExperience.length > 0
                    ? 'Yes'
                    : 'No';
            const rowData = [
                employee.employeeid || '-',
                employee.fullname || '-',
                employee.email || '-',
                employee.joiningdate || '-',
                employee.phone || '-',
                employee.reference || '-',
                employee.department || '-',
                employee.designation || '-',
                employee.role || '-',
                employee.manager || '-',
                `"${employee.projects}"` || '-',
                employee.employeeType || '-',
                employee.status,
                employee.gender || '-',
                employee.employeeDateOfBirth || '-',
                employee.maritalStatus || '-',
                employee.bloodGroup || '-',
                employee.dateOfExit || '-',
                employee.workEmail || '-',
                employee.workLocationName || '-',
                employee.mothername || '-',
                employee.fathername || '-',
                employee.emergencyContactNumber || '-',
                `"${employee.permanentAddress}"` || '-',
                employee.panNumber || '-',
                employee.aadharNumber || '-',
                employee.nameAsPerAadhar || '-',
                `"${employee.address}"` || '-',
                employee.city || '-',
                employee.company || '-',
                employee.state || '-',
                employee.country || '-',
                `"${String(employee.zipcode) || '-'}"`,
                `"${String(employee.disabled) || '-'}"`,
                employee.accountNumber || '-',
                employee.ifscCode || '-',
                employee.bankName || '-',
                isFresher,
                hasExperience,
                employee.contactNumber || '-',
                employee.spouseName || '-',
                employee.spouseAadharNumber || '-',
                employee.numberOfKids || '-'
            ];
            csvRows.push(rowData.join(','));
        });
        const csvData = csvRows.join('\n');
        const blob = new Blob([csvData], { type: 'text/csv' });
        const blobUrl = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = blobUrl;
        anchor.download = 'filtered_employees_data.csv';
        anchor.click();
        URL.revokeObjectURL(blobUrl);
    };

    const exportExperienceDataToCSV = () => {
        // Logic for exporting experience data to CSV
        const experienceData = filteredEmp.map((employee) => ({
            employeeId: employee.employeeid || '-',
            name: employee.fullname || '-',
            email: employee.email || '-',
            joiningDate: employee.joiningdate || '-',
            experienceYears: employee.experience || '-', // Assuming there's an experience field
            employeeExperience: employee.employeeExperience
                ? employee.employeeExperience.map((exp) => ({
                      previousCompany: exp.previousCompany || '-',
                      experienceDesignation: exp.experienceDesignation || '-',
                      reportingManager: exp.reportingManager || '-',
                      startDate: formatExcelDate(exp.startDate) || '-',
                      endDate: formatExcelDate(exp.endDate) || '-',
                      uanNumber: exp.uanNumber || '-'
                  }))
                : []
        }));

        const csvRows = [
            [
                'Employee Id',
                'Employee Name',
                'Email',
                'Joining Date',
                'Previous Company',
                'Experience Designation',
                'Reporting Manager',
                'Start Date',
                'End Date',
                'UAN Number'
            ].join(',')
        ];

        experienceData.forEach((emp) => {
            emp.employeeExperience.forEach((exp) => {
                csvRows.push(
                    [
                        emp.employeeId,
                        emp.name,
                        emp.email,
                        emp.joiningDate,
                        exp.previousCompany,
                        exp.experienceDesignation,
                        exp.reportingManager,
                        exp.startDate,
                        exp.endDate,
                        exp.uanNumber
                    ].join(',')
                );
            });
        });

        const csvData = csvRows.join('\n');
        const blob = new Blob([csvData], { type: 'text/csv' });
        const blobUrl = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = blobUrl;
        anchor.download = 'employee_experience_data.csv';
        anchor.click();
        URL.revokeObjectURL(blobUrl);
    };

    const exportFamilyDataToCSV = () => {
        // Logic for exporting experience data to CSV
        const familyData = filteredEmp.map((employee) => ({
            employeeId: employee.employeeid || '-',
            name: employee.fullname || '-',
            email: employee.email || '-',
            childrenDetails: employee.childrenDetails
                ? employee.childrenDetails.map((child) => ({
                      kidName: child.kidName || '-',
                      kidGender: child.kidGender || '-',
                      kidDob: child.kidDob || '-'
                  }))
                : []
        }));

        const csvRows = [
            [
                'Employee Id',
                'Employee Name',
                'Email',
                'Kid Name',
                'Kid Gender',
                'Kid Date of Birth'
            ].join(',')
        ];

        familyData.forEach((emp) => {
            emp.childrenDetails.forEach((child) => {
                csvRows.push(
                    [
                        emp.employeeId,
                        emp.name,
                        emp.email,
                        child.kidName,
                        child.kidGender,
                        child.kidDob
                    ].join(',')
                );
            });
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'FamilyData.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    const formatExcelDate = (date) => {
        if (!date || date === '-') {
            return null; // Return `null` for invalid dates
        }
        try {
            const parsedDate = new Date(date);
            // Format as MM/dd/yyyy
            const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
            const day = String(parsedDate.getDate()).padStart(2, '0');
            const year = parsedDate.getFullYear();
            return `${month}/${day}/${year}`;
        } catch (error) {
            console.error('Invalid date format:', date);
            return null;
        }
    };

    const fileInputRef = useRef(null);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const processEmployeeData = async (jsonData) => {
        setLoading(true);
        let errors = [];

        try {
            const promises = jsonData.map(async (row) => {
                // Build the user request object
                const userRequestData = {
                    firstname: row['Employee First Name'],
                    lastname: row['Employee Last Name'],
                    email: row['Personal Email'],
                    gender: row['Gender'],
                    employeeDateOfBirth: formatExcelDate(row['Employee Date Of Birth']),
                    maritalStatus: row['Marital Status'],
                    bloodGroup: row['Blood Group'],
                    dateOfExit: formatExcelDate(row['Date Of Exit']),
                    workEmail: row['Work Email'],
                    workLocationName: row['Work Location Name'],
                    employeeStatus: row['Employee Status'],
                    motherName: row['Mother Name'],
                    fatherName: row['Father Name'],
                    emergencyContactNumber: row['Emergency Contact Number'],
                    permenantAddress: row['Permanent Address Line'],
                    panNumber: row['PAN Number'],
                    aadharNumber: row['Aadhaar Number'],
                    nameAsPerAadhar: row['Name As Per Aadhaar'],
                    address: row['Present Address'],
                    city: row['City'],
                    company: row['Company'],
                    state: row['State'],
                    country: row['Country'],
                    zipcode: row['Zip Code'],
                    password: row['Password'],
                    department: row['Department'],
                    designation: row['Designation'],
                    employeeType: row['Employee Type'],
                    employeeid: row['Employee Number'],
                    joiningdate: formatExcelDate(row['Date Of Joining']),
                    manager: row['Manager'],
                    phone: row['Employee Mobile Number'],
                    projects: row['Projects'],
                    role: row['Role Name'],
                    reference: row['Reference'],
                    accountNumber: row['Account Number'],
                    ifscCode: row['IFSC Code'],
                    bankName: row['Bank Name'],
                    isFresher: row['Fresher'].toLowerCase() === 'yes',
                    hasExperience: row['Do you have prior experience'].toLowerCase() === 'yes',

                    employeeExperience: [
                        {
                            previousCompany: row['Previous Company'],
                            experienceDesignation: row['Experience Designation'],
                            reportingManager: row['Reporting Manager'],
                            startDate: formatExcelDate(row['Start Date']),
                            endDate: formatExcelDate(row['End Date']),
                            uanNumber: row['UAN Number']
                        }
                    ],

                    contactNumber: row['Contact Number'],
                    spouseName: row['Spouse Name'],
                    spouseAadharNumber: row['Spouse Aadhar Number'],
                    numberOfKids: row['Number of Kids']
                        ? parseInt(row['Number of Kids'], 10)
                        : null,
                    childrenDetails: [
                        {
                            kidName: row['Kid Name'],
                            kidGender: row['Kid Gender'],
                            kidDob: row['Kid Date of Birth']
                        }
                    ]
                };

                // Prepare form data
                const formData = new FormData();
                formData.append(
                    'userrequest',
                    new Blob([JSON.stringify(userRequestData)], { type: 'application/json' })
                );
                // Make the API call
                try {
                    const res = await axios.post('/api/v1/user/users', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });

                    if (!res || res.status !== AppConfigProps.httpStatusCode.ok || !res.data) {
                        const errorDetails = await manageImportError(res, history);
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
                path: 'processing loop',
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
                processEmployeeData(jsonData);
            };
            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error('Error importing file:', error);
        }
    };
    const exportSampleData = () => {
        // Define the headers with sample formats
        const headers = [
            { header: 'Employee First Name', key: 'firstname' },
            { header: 'Employee Last Name', key: 'lastname' },
            { header: 'Personal Email', key: 'email' },
            { header: 'Gender', key: 'gender' },
            {
                header: 'Employee Date Of Birth',
                key: 'employeeDateOfBirth',
                datePattern: 'MM/dd/yyyy'
            },
            { header: 'Marital Status', key: 'maritalStatus' },
            { header: 'Blood Group', key: 'bloodGroup' },
            { header: 'Date Of Exit', key: 'dateOfExit', datePattern: 'MM/dd/yyyy' },
            { header: 'Work Email', key: 'workEmail' },
            { header: 'Work Location Name', key: 'workLocationName' },
            { header: 'Employee Status', key: 'employeeStatus' },
            { header: 'Mother Name', key: 'motherName' },
            { header: 'Father Name', key: 'fatherName' },
            { header: 'Emergency Contact Number', key: 'emergencyContactNumber' },
            { header: 'Permanent Address Line', key: 'permenantAddress' },
            { header: 'PAN Number', key: 'panNumber' },
            { header: 'Aadhaar Number', key: 'aadharNumber' },
            { header: 'Name As Per Aadhaar', key: 'nameAsPerAadhar' },
            { header: 'Present Address', key: 'address' },
            { header: 'City', key: 'city' },
            { header: 'Company', key: 'company' },
            { header: 'State', key: 'state' },
            { header: 'Country', key: 'country' },
            { header: 'Zip Code', key: 'zipcode' },
            { header: 'Password', key: 'password' },
            { header: 'Department', key: 'department' },
            { header: 'Designation', key: 'designation' },
            { header: 'Employee Type', key: 'employeeType' },
            { header: 'Employee Number', key: 'employeeid' },
            { header: 'Date Of Joining', key: 'joiningdate', datePattern: 'MM/dd/yyyy' },
            { header: 'Manager', key: 'manager' },
            { header: 'Employee Mobile Number', key: 'phone' },
            { header: 'Projects', key: 'projects' },
            { header: 'Role Name', key: 'role' },
            { header: 'Reference', key: 'reference' },
            { header: 'Previous Company', key: 'previousCompany' },
            { header: 'Experience Designation', key: 'experienceDesignation' },
            { header: 'Reporting Manager', key: 'reportingManager' },
            { header: 'Start Date', key: 'startDate', datePattern: 'MM/dd/yyyy' },
            { header: 'End Date', key: 'endDate', datePattern: 'MM/dd/yyyy' },
            { header: 'UAN Number', key: 'uanNumber' },
            { header: 'Account Number', key: 'accountNumber' },
            { header: 'IFSC Code', key: 'ifscCode' },
            { header: 'Bank Name', key: 'bankName' },
            { header: 'Do you have prior experience', key: 'hasExperience' },
            { header: 'Fresher', key: 'isFresher' },
            { header: 'Contact Number', key: 'contactNumber' },
            { header: 'Spouse Name', key: 'spouseName' },
            { header: 'Spouse Aadhar Number', key: 'spouseAadharNumber' },
            { header: 'Number of Kids', key: 'numberOfKids' },
            { header: 'Kid Name', key: 'kidName' },
            { header: 'Kid Gender', key: 'kidGender' },
            { header: 'Kid Date of Birth', key: 'kidDob', datePattern: 'MM/dd/yyyy' }
        ];

        // Generate header and datePattern rows
        const headerRow = headers.map((col) => col.header);
        const datePatternRow = headers.map((col) => col.datePattern || '');

        // Prepare worksheet data
        const worksheetData = [headerRow, datePatternRow];

        // Create worksheet
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

        // Create a workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'SampleData');

        // Export the workbook as an Excel file
        XLSX.writeFile(workbook, 'sample_import_template.xlsx');
    };
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleViewEmployee = (userId) => {
        history.push(SLUGS.employeeView(userId));
        handlePopUpClose();
    };

    // Assuming employees is your original data array
    const filteredEmp = employees
        ? employees.filter((emp) => {
              const searchString = `${emp.employeeid} ${emp.fullname} ${emp.projects} ${emp.department} ${emp.designation} ${emp.role} ${emp.email}`;
              return searchString.toLowerCase().includes(searchQuery.toLowerCase());
          })
        : [];

    // Determine the data to display for the current page
    const paginatedData = filteredEmp.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to the first page
    };
    // useEffect(() => {
    //     console.log('Employee Details in State:', selectedEmployeeDetails);
    // }, [selectedEmployeeDetails]);

    return (
        <div>
            {/* Dropdown for filtering active and inactive employees */}
            <div style={{ display: 'block' }}>
                <FormControl
                    style={{
                        float: 'left',
                        marginBottom: '10px',
                        minWidth: 170
                    }}
                >
                    <InputLabel id='filter-label'>Status </InputLabel>
                    <Select
                        labelId='filter-label'
                        id='filter'
                        value={filterCriteria}
                        onChange={handleFilterChange}
                        label='Status'
                        style={{
                            color: filterCriteria === 'active' ? '#4CAF50' : '#F44336', // green for active, red for inactive
                            borderColor: filterCriteria === 'active' ? '#4CAF50' : '#F44336',
                            height: 35,
                            width: 150,
                            fontSize: 13,
                            borderRadius: '40px'
                        }}
                    >
                        <MenuItem value='active' style={{ fontSize: 13 }}>
                            {' '}
                            <FiberManualRecordIcon
                                style={{
                                    color: '#4CAF50',
                                    height: 15,
                                    position: 'relative',
                                    top: 3
                                }}
                            />{' '}
                            &nbsp; Active &nbsp;&nbsp; {activeCount}
                        </MenuItem>
                        <MenuItem value='inactive' style={{ fontSize: 13 }}>
                            {' '}
                            <FiberManualRecordIcon
                                style={{
                                    color: '#F44336',
                                    height: 15,
                                    position: 'relative',
                                    top: 3
                                }}
                            />{' '}
                            &nbsp; Inactive &nbsp;&nbsp;
                            {inactiveCount}
                        </MenuItem>
                    </Select>
                </FormControl>

                {/* Search Input */}
                <Input
                    type='text'
                    placeholder='Search...Employee Details'
                    value={searchQuery}
                    onChange={handleSearchChange}
                    sx={{
                        color: '#0070ac',
                        marginBottom: 2,
                        padding: 1,
                        width: 200,
                        height: 33,
                        borderRadius: 3.1,
                        fontSize: 12,
                        border: '2px solid #0070ac',
                        '&:focus': {
                            borderColor: '#0070ac',
                            boxShadow: (theme) => `0 0 0 0.2rem ${theme.palette.primary.main}`
                        }
                    }}
                />

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
                <div>
                    <Button
                        aria-controls='export-dropdown-menu'
                        aria-haspopup='true'
                        onClick={handleClick}
                        style={{
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
                        Export Data
                    </Button>
                    <Menu
                        id='export-dropdown-menu'
                        anchorEl={exportanchorEl}
                        open={exportpopUpOen}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={exportFilteredDataToCSV}>Export Employee</MenuItem>
                        <MenuItem onClick={exportExperienceDataToCSV}>Export Employee Exp</MenuItem>
                        <MenuItem onClick={exportFamilyDataToCSV}>Export Family</MenuItem>
                    </Menu>
                </div>

                <Button
                    onClick={exportSampleData}
                    style={{
                        marginLeft: '20px',
                        float: 'right',
                        fontSize: '10px',
                        borderRadius: '20px',
                        color: '#F06D4B',
                        borderColor: '#F06D4B',
                        marginBottom: '10px',
                        paddingLeft: '10px',
                        marginRight: '10px'
                    }}
                    variant='outlined'
                    startIcon={<DownloadIcon style={{ fontSize: 12 }} />}
                >
                    SAMPLE IMPORT
                </Button>

                <Button
                    variant='outlined'
                    onClick={() => handleOpen('add')}
                    style={{
                        color: '#F06D4B',
                        borderColor: '#F06D4B',
                        float: 'right',
                        marginBottom: '10px',
                        borderRadius: '40px',
                        fontSize: '10px'
                    }}
                >
                    + Add Employee
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
            </div>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 1700 }} aria-label='customized table'>
                    <TableHead sx={{ backgroundColor: '#E7E9EA' }}>
                        <TableRow>
                            <StyledTableCell
                                style={{
                                    borderRight: '1px solid #ccc',
                                    // fontSize: '15px',
                                    minWidth: '100px'
                                }}
                            >
                                {EmployeeMsgResProps.body.form.action.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EmployeeMsgResProps.body.form.name.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EmployeeMsgResProps.body.form.employeeId.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EmployeeMsgResProps.body.form.email.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EmployeeMsgResProps.body.form.employeeDateOfBirth.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EmployeeMsgResProps.body.form.mobile.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EmployeeMsgResProps.body.form.gender.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EmployeeMsgResProps.body.form.bloodGroup.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EmployeeMsgResProps.body.form.maritalStatus.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EmployeeMsgResProps.body.form.fatherName.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EmployeeMsgResProps.body.form.motherName.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EmployeeMsgResProps.body.form.reference.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EmployeeMsgResProps.body.form.employeeType.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EmployeeMsgResProps.body.form.employeeStatus.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EmployeeMsgResProps.body.form.workEmail.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EmployeeMsgResProps.body.form.company.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EmployeeMsgResProps.body.form.workLocationName.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EmployeeMsgResProps.body.form.department.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EmployeeMsgResProps.body.form.designation.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EmployeeMsgResProps.body.form.role.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EmployeeMsgResProps.body.form.manager.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EmployeeMsgResProps.body.form.projects.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EmployeeMsgResProps.body.form.joiningDate.label}
                            </StyledTableCell>
                            <StyledTableCell style={addressColumnStyle}>
                                {EmployeeMsgResProps.body.form.presentAddress.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EmployeeMsgResProps.body.form.city.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EmployeeMsgResProps.body.form.state.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EmployeeMsgResProps.body.form.Country.label}
                            </StyledTableCell>

                            <StyledTableCell style={columnBorderStyle}>
                                {EmployeeMsgResProps.body.form.zipCode.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EmployeeMsgResProps.body.form.permanentAddress.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EmployeeMsgResProps.body.form.emergencyContactNumber.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EmployeeMsgResProps.body.form.panNumber.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EmployeeMsgResProps.body.form.aadhaarNumber.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EmployeeMsgResProps.body.form.nameAsPerAadhaar.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                {EmployeeMsgResProps.body.form.dateOfExit.label}
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                Aadhaar or Pancard Files
                            </StyledTableCell>

                            <StyledTableCell style={columnBorderStyle}>
                                Account Number
                            </StyledTableCell>

                            <StyledTableCell style={columnBorderStyle}>IFSC Code</StyledTableCell>

                            <StyledTableCell style={columnBorderStyle}>Bank Name</StyledTableCell>

                            <StyledTableCell style={columnBorderStyle}>
                                Prior Experience
                            </StyledTableCell>

                            <StyledTableCell style={columnBorderStyle}>
                                Previous Company
                            </StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>
                                Experience Designation
                            </StyledTableCell>

                            <StyledTableCell style={columnBorderStyle}>
                                Reporting Manager
                            </StyledTableCell>

                            <StyledTableCell style={columnBorderStyle}>Start Date</StyledTableCell>

                            <StyledTableCell style={columnBorderStyle}>End Date</StyledTableCell>

                            <StyledTableCell style={columnBorderStyle}>UAN Number</StyledTableCell>

                            <StyledTableCell style={columnBorderStyle}>Is Fresher</StyledTableCell>

                            <StyledTableCell style={columnBorderStyle}>
                                Payslip Files
                            </StyledTableCell>

                            <StyledTableCell style={columnBorderStyle}>
                                Passbook/Cheque Files
                            </StyledTableCell>

                            <StyledTableCell style={columnBorderStyle}>
                                Contact Number
                            </StyledTableCell>

                            <StyledTableCell style={columnBorderStyle}>Spouse Name</StyledTableCell>

                            <StyledTableCell style={columnBorderStyle}>
                                Spouse Aadhar Number
                            </StyledTableCell>

                            <StyledTableCell style={columnBorderStyle}>
                                Number of Kids
                            </StyledTableCell>

                            <StyledTableCell style={columnBorderStyle}>Kids Name</StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>Kids Gender</StyledTableCell>
                            <StyledTableCell style={columnBorderStyle}>Kids DOB</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((employee, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={{
                                            borderRight: '1px solid #ccc',
                                            // fontSize: '15px',
                                            minWidth: '100px'
                                        }}
                                    >
                                        &nbsp;&nbsp;&nbsp;
                                        <MoreVertIcon
                                            aria-describedby={employee.id}
                                            id={employee.id}
                                            name={employee.id}
                                            onClick={(event) =>
                                                handlePopUpClick(
                                                    event,
                                                    employee.fullname,
                                                    employee.id
                                                )
                                            }
                                        />
                                        <Popover
                                            style={{ marginLeft: '20px' }}
                                            id={`popover-${employee.id}`}
                                            open={popUpOen && selectedEmployeeID === employee.id}
                                            anchorEl={anchorEl}
                                            onClose={handlePopUpClose}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left'
                                            }}
                                        >
                                            <MenuList dense>
                                                <MenuItem
                                                    onClick={() => handleViewEmployee(employee.id)}
                                                >
                                                    <VisibilityIcon />
                                                    <ListItemText inset className='pl-5'>
                                                        View
                                                    </ListItemText>
                                                </MenuItem>
                                                {filterCriteria === 'inactive' && (
                                                    <MenuItem
                                                        onClick={() => handleRestoreEmployee()}
                                                    >
                                                        <RestoreIcon />
                                                        <ListItemText inset className='pl-5'>
                                                            Restore
                                                        </ListItemText>
                                                    </MenuItem>
                                                )}
                                                {filterCriteria === 'active' && (
                                                    <>
                                                        <MenuItem
                                                            key='edit'
                                                            onClick={() => handleEditEmployee()}
                                                        >
                                                            <EditIcon />
                                                            <ListItemText inset className='pl-5'>
                                                                Edit
                                                            </ListItemText>
                                                        </MenuItem>
                                                        <MenuItem
                                                            key='delete'
                                                            onClick={() => deleteEmploees()}
                                                        >
                                                            <DeleteIcon />
                                                            <ListItemText inset className='pl-5'>
                                                                Delete
                                                            </ListItemText>
                                                        </MenuItem>

                                                        <MenuItem
                                                            key='reset-password'
                                                            onClick={() =>
                                                                handleOpenResetPasswordModal(
                                                                    employee.id
                                                                )
                                                            }
                                                        >
                                                            <LockIcon />
                                                            <ListItemText inset className='pl-5'>
                                                                Reset Password
                                                            </ListItemText>
                                                        </MenuItem>
                                                        {employee.employeeStatus === 'Resigned' ||
                                                        employee.employeeStatus === 'Terminated' ? (
                                                            <MenuItem
                                                                key='relieving-info'
                                                                onClick={() =>
                                                                    handleRelievingInfo()
                                                                }
                                                            >
                                                                <InfoIcon />
                                                                <ListItemText
                                                                    inset
                                                                    className='pl-5'
                                                                >
                                                                    Add/Edit Relieving Info
                                                                </ListItemText>
                                                            </MenuItem>
                                                        ) : null}
                                                    </>
                                                )}
                                            </MenuList>
                                        </Popover>
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={{
                                            borderRight: '1px solid #ccc',
                                            minWidth: '280px'
                                        }}
                                    >
                                        <Tooltip title='View Employee Details' arrow>
                                            <a
                                                href={`http://localhost:3000/employee/${employee.id}`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleViewEmployee(employee.id);
                                                }}
                                                className='employee-link'
                                            >
                                                <img
                                                    src={
                                                        !employee.imageurl ||
                                                        !employee.imageurl.trim()
                                                            ? 'https://a0.anyrgb.com/pngimg/1140/162/user-profile-login-avatar-heroes-user-blue-icons-circle-symbol-logo.png'
                                                            : employee.imageurl
                                                    }
                                                    alt='employee'
                                                    className='employee-image'
                                                />
                                                <span className='employee-name'>
                                                    {employee.fullname ? employee.fullname : '-'}
                                                </span>
                                            </a>
                                        </Tooltip>
                                    </StyledTableCell>

                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.employeeid ? employee.employeeid : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={{
                                            borderRight: '1px solid #ccc',
                                            // fontSize: '15px',
                                            minWidth: '270px'
                                        }}
                                    >
                                        {employee.email ? employee.email : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.employeeDateOfBirth
                                            ? employee.employeeDateOfBirth
                                            : ''}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.phone ? employee.phone : ''}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.gender ? employee.gender : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.bloodGroup ? employee.bloodGroup : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.maritalStatus ? employee.maritalStatus : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.fathername ? employee.fathername : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.mothername ? employee.mothername : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.reference ? employee.reference : ''}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.employeeType ? employee.employeeType : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.employeeStatus ? employee.employeeStatus : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={{
                                            borderRight: '1px solid #ccc',
                                            // fontSize: '15px',
                                            minWidth: '270px'
                                        }}
                                    >
                                        {employee.workEmail ? employee.workEmail : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.company ? employee.company : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.workLocationName
                                            ? employee.workLocationName
                                            : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.role ? employee.department : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.role ? employee.designation : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.role ? employee.role : ''}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.role ? employee.manager : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.role ? employee.projects : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.joiningdate
                                            ? AppUtils.getDateFormat(employee.joiningdate)
                                            : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={addressColumnStyle}
                                    >
                                        {employee.address ? employee.address : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.city ? employee.city : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.state ? employee.state : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.country ? employee.country : '-'}
                                    </StyledTableCell>

                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.zipcode ? employee.zipcode : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={addressColumnStyle}
                                    >
                                        {employee.permanentAddress
                                            ? employee.permanentAddress
                                            : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.emergencyContactNumber
                                            ? employee.emergencyContactNumber
                                            : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.panNumber ? employee.panNumber : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.aadharNumber ? employee.aadharNumber : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.nameAsPerAadhar ? employee.nameAsPerAadhar : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.dateOfExit ? employee.dateOfExit : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.aadharPanDocuments &&
                                        Array.isArray(employee.aadharPanDocuments)
                                            ? employee.aadharPanDocuments
                                                  .map((doc) =>
                                                      typeof doc === 'object'
                                                          ? doc.filename || doc.filepath
                                                          : doc
                                                  )
                                                  .join(', ')
                                            : '-'}
                                    </StyledTableCell>

                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.accountNumber ? employee.accountNumber : '-'}
                                    </StyledTableCell>

                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.ifscCode ? employee.ifscCode : '-'}
                                    </StyledTableCell>

                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.bankName ? employee.bankName : '-'}
                                    </StyledTableCell>

                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.hasExperience !== undefined
                                            ? employee.hasExperience
                                                ? 'Yes'
                                                : 'No'
                                            : '-'}
                                    </StyledTableCell>

                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.hasExperience &&
                                        employee.employeeExperience &&
                                        employee.employeeExperience.length > 0
                                            ? employee.employeeExperience.map((exp, idx) => (
                                                  <div key={idx}>{exp.previousCompany || '-'}</div>
                                              ))
                                            : '-'}
                                    </StyledTableCell>

                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.hasExperience &&
                                        employee.employeeExperience &&
                                        employee.employeeExperience.length > 0
                                            ? employee.employeeExperience.map((exp, idx) => (
                                                  <div key={idx}>
                                                      {exp.experienceDesignation || '-'}
                                                  </div>
                                              ))
                                            : '-'}
                                    </StyledTableCell>

                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.hasExperience &&
                                        employee.employeeExperience &&
                                        employee.employeeExperience.length > 0
                                            ? employee.employeeExperience.map((exp, idx) => (
                                                  <div key={idx}>{exp.reportingManager || '-'}</div>
                                              ))
                                            : '-'}
                                    </StyledTableCell>

                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.hasExperience &&
                                        employee.employeeExperience &&
                                        employee.employeeExperience.length > 0
                                            ? employee.employeeExperience.map((exp, idx) => (
                                                  <div key={idx}>
                                                      {exp.startDate
                                                          ? formatExcelDate(exp.startDate)
                                                          : '-'}
                                                  </div>
                                              ))
                                            : '-'}
                                    </StyledTableCell>

                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.hasExperience &&
                                        employee.employeeExperience &&
                                        employee.employeeExperience.length > 0
                                            ? employee.employeeExperience.map((exp, idx) => (
                                                  <div key={idx}>
                                                      {exp.endDate
                                                          ? formatExcelDate(exp.endDate)
                                                          : '-'}
                                                  </div>
                                              ))
                                            : '-'}
                                    </StyledTableCell>

                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.hasExperience &&
                                        employee.employeeExperience &&
                                        employee.employeeExperience.length > 0
                                            ? employee.employeeExperience.map((exp, idx) => (
                                                  <div key={idx}>{exp.uanNumber || '-'}</div>
                                              ))
                                            : '-'}
                                    </StyledTableCell>

                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.isFresher !== undefined
                                            ? employee.isFresher
                                                ? 'Yes'
                                                : 'No'
                                            : '-'}
                                    </StyledTableCell>

                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.payslipsDocuments &&
                                        Array.isArray(employee.payslipsDocuments)
                                            ? employee.payslipsDocuments
                                                  .map((doc) =>
                                                      typeof doc === 'object'
                                                          ? doc.filename || doc.filepath
                                                          : doc
                                                  )
                                                  .join(', ')
                                            : '-'}
                                    </StyledTableCell>

                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.passbookChequeDocuments &&
                                        Array.isArray(employee.passbookChequeDocuments)
                                            ? employee.passbookChequeDocuments
                                                  .map((doc) =>
                                                      typeof doc === 'object'
                                                          ? doc.filename || doc.filepath
                                                          : doc
                                                  )
                                                  .join(', ')
                                            : '-'}
                                    </StyledTableCell>

                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.contactNumber ? employee.contactNumber : '-'}
                                    </StyledTableCell>

                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.spouseName ? employee.spouseName : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.spouseAadharNumber
                                            ? employee.spouseAadharNumber
                                            : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.numberOfKids ? employee.numberOfKids : '0'}
                                    </StyledTableCell>

                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.childrenDetails &&
                                        employee.childrenDetails.length > 0
                                            ? employee.childrenDetails.map((kid, idx) => (
                                                  <div key={idx} style={{ padding: '2px 0' }}>
                                                      {kid.kidName || '-'}
                                                  </div>
                                              ))
                                            : '-'}
                                    </StyledTableCell>

                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.childrenDetails &&
                                        employee.childrenDetails.length > 0
                                            ? employee.childrenDetails.map((kid, idx) => (
                                                  <div key={idx} style={{ padding: '2px 0' }}>
                                                      {kid.kidGender || '-'}
                                                  </div>
                                              ))
                                            : '-'}
                                    </StyledTableCell>

                                    <StyledTableCell
                                        component='th'
                                        scope='row'
                                        style={columnBorderStyle}
                                    >
                                        {employee.childrenDetails &&
                                        employee.childrenDetails.length > 0
                                            ? employee.childrenDetails.map((kid, idx) => (
                                                  <div key={idx} style={{ padding: '2px 0' }}>
                                                      {kid.kidDob
                                                          ? formatExcelDate(kid.kidDob)
                                                          : '-'}
                                                  </div>
                                              ))
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
                    count={filteredEmp.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
            <AddEmployee
                open={open}
                handleClose={handleClose}
                Backdrop={Backdrop}
                method={selectedMethod}
                employeeDetails={selectedEmployeeDetails}
                designations={designations}
                departments={departments}
                countries={countries}
                states={states}
            />
            <EmployeePreview
                open={previewOpen}
                handleClose={handlePreviewClose}
                Backdrop={Backdrop}
                employeeDetails={selectedEmployeeDetails}
            />

            <AddRelievingInfo
                open={infoopen}
                handleClose={handleInfoClose}
                Backdrop={Backdrop}
                method={selectedInfoMethod}
                employeeDetails={selectedEmployeeDetails}
                relievingDetails={selectedRelievingDetails}
            />

            <ResetPasswordConfirmationModal
                open={showResetPasswordModal}
                onClose={handleCloseResetPasswordModal}
                onConfirm={handleResetEmployeePassword}
                onClickNo={handleClose}
                selectedEmployeeDetails={handleEmployeeName}
            />
        </div>
    );
}

// Define a new functional component for the confirmation modal
function ResetPasswordConfirmationModal({
    open,
    onClose,
    onConfirm,
    onClickNo,
    selectedEmployeeDetails
}) {
    const [loading, setLoading] = useState(false);

    const handleConfirmClick = async () => {
        setLoading(true);
        await onConfirm(); // Assuming onConfirm returns a promise
        setLoading(false);
        onClose();
    };

    const handleCloseClick = () => {
        onClickNo();
        onClose();
    };

    return (
        <Modal
            aria-labelledby='spring-modal-title'
            aria-describedby='spring-modal-description'
            open={open}
            onClose={onClose}
            closeAfterTransition
            // BackdropComponent={props.Backdrop}
            BackdropProps={{
                timeout: 500
            }}
        >
            <Box component='form' sx={style} noValidate autoComplete='off'>
                <AppBar
                    position='static'
                    sx={{
                        width: 700,
                        height: 60,
                        backgroundcolor: ' #DEECF4',
                        marginBottom: '40px'
                    }}
                >
                    <CardHeader title='Reset Password '></CardHeader>
                    <IconButton
                        sx={{
                            position: 'absolute',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginLeft: '650px',
                            marginTop: '10px',
                            color: '#0070AC'
                        }}
                        onClick={handleCloseClick}
                    >
                        <HighlightOffIcon />
                    </IconButton>
                </AppBar>
                <div
                    style={{
                        marginBottom: '10px'
                    }}
                >
                    <p style={{ margin: '0 0 20px', textAlign: 'center' }}>
                        Please confirm password reset for employee "<b>{selectedEmployeeDetails}</b>
                        " ?
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            onClick={handleConfirmClick}
                            disabled={loading}
                            style={{
                                marginTop: '10px',
                                float: 'right',
                                marginRight: '20px',
                                marginBottom: '20px',
                                borderRadius: '40px',
                                backgroundColor: '#0070ac',
                                color: '#fff'
                            }}
                            variant='contained'
                        >
                            {loading ? (
                                <>
                                    <CircularProgress
                                        size={20}
                                        color='inherit'
                                        style={{ backgroundColor: '#0070ac', marginRight: '8px' }}
                                    />
                                    Sending Email...
                                </>
                            ) : (
                                'Yes'
                            )}
                        </Button>
                        <Button
                            onClick={handleCloseClick}
                            style={{
                                marginTop: '10px',
                                float: 'right',
                                marginRight: '20px',
                                marginBottom: '20px',
                                borderRadius: '40px',
                                backgroundColor: '#0070ac'
                            }}
                            variant='contained'
                        >
                            No
                        </Button>
                    </div>
                </div>
            </Box>
        </Modal>
    );
}
