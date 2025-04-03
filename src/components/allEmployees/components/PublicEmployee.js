import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    TextField,
    Button,
    MenuItem,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';

import moment from 'moment';

import axios from 'axios';

import generatePDF from './GeneratePdf';

// Array of role options for selection
const roles = [
    { value: 'ADMIN', label: 'Admin' },
    { value: 'USER', label: 'User' },
    { value: 'Hr', label: 'HR' },
    { value: 'MANAGER', label: 'Manager' },
    { value: 'EMPLOYEE', label: 'Employee' },
    { value: 'ANONYMOUS', label: 'Anonymous' }
];

// Array of employee type options for selection
const employeeTypes = [
    { value: 'PartTime', label: 'Part Time' },
    { value: 'FullTime', label: 'Full Time' }
];

// Array of marital status options for selection
const maritalStatuses = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' }
];

// Array of gender options for selection
const genders = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Others', label: 'Others' }
];

// Array of blood group options for selection
const bloodGroups = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' }
];

// Array of employee status options for selection
const employeeStatuses = [
    { value: 'Initiated', label: 'Initiated' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Active', label: 'Active' },
    { value: 'On Leave', label: 'On Leave' },
    { value: 'Hold', label: 'Hold' },
    { value: 'Resigned', label: 'Resigned' },
    { value: 'Terminated', label: 'Terminated' },
    { value: 'Retired', label: 'Retired' },
    { value: 'Contract Ended', label: 'Contract Ended' },
    { value: 'Inactive', label: 'Inactive' }
];

// Initial form data structure
const initialFormData = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    employeeid: '',
    employeeDateOfBirth: '',
    phone: '',
    gender: '',
    bloodGroup: '',
    maritalStatus: '',
    fatherName: '',
    motherName: '',
    reference: '',
    employeeType: '',
    employeeStatus: '',
    workEmail: '',
    company: '',
    workLocationName: '',
    department: '',
    designation: '',
    role: '',
    manager: '',
    projects: '',
    joiningdate: '',
    address: '',
    country: '',
    state: '',
    city: '',
    zipcode: '',
    permenantAddress: '',
    emergencyContactNumber: '',
    panNumber: '',
    aadharNumber: '',
    nameAsPerAadhar: '',
    dateOfExit: ''
};

// Transformed data structure for form
const transformedData = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    employeeid: '',
    employeeDateOfBirth: '',
    phone: '',
    gender: '',
    bloodGroup: '',
    maritalStatus: '',
    fatherName: '',
    motherName: '',
    reference: '',
    employeeType: '',
    employeeStatus: '',
    workEmail: '',
    company: '',
    workLocationName: '',
    department: '',
    designation: '',
    role: '',
    manager: '',
    projects: '',
    joiningdate: '',
    address: '',
    country: '',
    state: '',
    city: '',
    zipcode: '',
    permenantAddress: '',
    emergencyContactNumber: '',
    panNumber: '',
    aadharNumber: '',
    nameAsPerAadhar: '',
    dateOfExit: ''
};

/**
 * Validates individual fields based on specified rules.
 *
 * @param {string} key - The key of the field being validated.
 * @param {any} value - The value of the field being validated.
 * @returns {string} Error message if validation fails, otherwise an empty string.
 */
const validateField = (key, value) => {
    if (
        key !== 'dateOfExit' &&
        key !== 'employeeDateOfBirth' &&
        key !== 'joiningdate' &&
        typeof value === 'string' &&
        !value.trim()
    ) {
        return 'Please Enter ' + key;
    } else if (key === 'password') {
        if (!/(?=.*[a-z])/.test(value)) {
            return 'Password must contain at least one lowercase letter';
        } else if (!/(?=.*[A-Z])/.test(value)) {
            return 'Password must contain at least one uppercase letter';
        } else if (!/(?=.*[0-9])/.test(value)) {
            return 'Password must contain at least one digit';
        } else if (!/(?=.*[\^$*.[\]{}()?"!@#%&/\\,><\':;|_~`])/.test(value)) {
            return 'Password must contain at least one special character';
        }
    } else if (key === 'phone' && value.length !== 10) {
        return 'Phone number should contain 10 digits';
    } else if (key === 'emergencyContactNumber' && value.length !== 10) {
        return 'Emergency Contact number should contain 10 digits';
    } else if (
        key === 'workEmail' &&
        !/^[a-z0-9]+[._]?[a-z0-9]+@ensarsolutions\.com$/i.test(value)
    ) {
        return 'Work Email must end with "@ensarsolutions.com"';
    } else if (key === 'firstname' && !/^[A-Za-z0-9 .]{2,50}$/.test(value)) {
        return 'First name must be between 2 and 50 characters';
    } else if (key === 'lastname' && !/^[A-Za-z0-9 .]{2,50}$/.test(value)) {
        return 'Last name must be between 2 and 50 characters';
    } else if (key === 'email' && !/^[a-z0-9]+[._]?[a-z0-9]+[@]\w+[.]\w{2,3}$/.test(value)) {
        return 'Invalid email format';
    } else if ((key === 'employeeDateOfBirth' || key === 'joiningdate') && !value) {
        return `Please enter ${key}`;
    }
    return '';
};

/**
 * Validates the entire form data and returns the validation status and errors.
 *
 * @param {Object} formData - The form data to be validated.
 * @param {Object} currentErrors - The current errors to be validated.
 * @returns {Object} An object containing the validation status and errors.
 */
const validate = (formData, currentErrors) => {
    let isValid = true;
    const newErrors = { ...currentErrors };

    Object.entries(formData).forEach(([key, value]) => {
        // Conditionally skip validation for the 'manager' field if the role is 'ADMIN'
        if (key === 'manager' && formData.role === 'ADMIN') {
            // Allow null/empty value for 'manager' if the role is 'ADMIN'
            newErrors[key] = '';
        } else {
            const error = validateField(key, value);
            if (error) {
                newErrors[key] = error;
                isValid = false;
            }
        }
    });

    // Retain any existing errors that are still present in the form
    Object.entries(currentErrors).forEach(([key, value]) => {
        if (value) {
            newErrors[key] = value;
            isValid = false;
        }
    });

    return { isValid, newErrors };
};

// Base URL for API requests
const API_BASE_URL = 'http://localhost:8080';

/**
 * PublicEmployee is a React component for managing employee information.
 * It handles form submission, validation, and data fetching.
 *
 * @returns {JSX.Element} The PublicEmployee component.
 */
const PublicEmployee = () => {
    const [formData, setFormData] = useState(transformedData);
    const [errors, setErrors] = useState({});
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [selectedCountryName, setSelectedCountryName] = useState('');
    const [projects, setProjects] = useState([]);
    const [managers, setManagers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [employeeIds, setEmployeeIds] = useState([]);
    const [employeeEmails, setEmployeeEmails] = useState([]);
    const [employeeWorkEmails, setEmployeeWorkEmails] = useState([]);
    const [open, setOpen] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);
    const history = useHistory();

    const _axiosSource = axios.CancelToken.source();
    const cancelToken = { cancelToken: _axiosSource.token };

    /**
     * Fetches the list of countries from the API.
     *
     * @param {Object} cancelToken - The Axios cancel token.
     * @returns {Promise<Array>} A promise that resolves to the list of countries.
     */
    const fetchCountries = async (cancelToken) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/v1/countries`, cancelToken);
            return response.data;
        } catch (error) {
            console.error('Error fetching countries:', error);
            throw error; // Rethrow the error to handle in the caller
        }
    };

    /**
     * Fetches the list of states based on the selected country ID.
     *
     * @param {string} country_id - The ID of the selected country.
     * @returns {Promise<Array>} A promise that resolves to the list of states.
     */
    const fetchStates = async (country_id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/v1/states/${country_id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching states:', error);
            throw error; // Rethrow the error to handle in the caller
        }
    };

    /**
     * Fetches the list of projects from the API.
     *
     * @param {Object} cancelToken - The Axios cancel token.
     * @returns {Promise<Array>} A promise that resolves to the list of projects.
     */
    const fetchProjects = async (cancelToken) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/v1/projects`, cancelToken);
            return response.data;
        } catch (error) {
            console.error('Error fetching projects:', error);
            throw error; // Rethrow the error to handle in the caller
        }
    };

    /**
     * Fetches the list of employees from the API.
     *
     * @returns {Promise<Array>} A promise that resolves to the list of employees.
     */
    const fetchEmployees = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/v1/user/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching employees:', error);
            throw error; // Rethrow the error to handle in the caller
        }
    };

    /**
     * Fetches the list of departments from the API.
     *
     * @param {Object} cancelToken - The Axios cancel token.
     * @returns {Promise<Array>} A promise that resolves to the list of departments.
     */
    const getDepartments = async (cancelToken) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/v1/departments`, cancelToken);
            return response.data;
        } catch (error) {
            console.error('Error fetching departments:', error);
            throw error; // Rethrow the error to handle in the caller
        }
    };

    /**
     * Fetches the list of designations from the API.
     *
     * @param {Object} cancelToken - The Axios cancel token.
     * @returns {Promise<Array>} A promise that resolves to the list of designations.
     */
    const getDesignations = async (cancelToken) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/v1/designations`, cancelToken);
            return response.data;
        } catch (error) {
            console.error('Error fetching designations:', error);
            throw error; // Rethrow the error to handle in the caller
        }
    };

    /**
     * Creates a new employee record using the provided data.
     *
     * @param {Object} employeeObj - The employee data to be sent to the API.
     * @param {Object} cancelToken - The Axios cancel token.
     * @returns {Promise<number>} A promise that resolves to the HTTP status code of the response.
     */
    const createEmployees = async (employeeObj, cancelToken) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/v1/user/users`,
                employeeObj,
                cancelToken
            );
            return response.status;
        } catch (error) {
            console.error('Error creating employee:', error);
            throw error; // Rethrow the error to handle in the caller
        }
    };

    // Fetches data for countries, states, projects, employees, departments, and designations
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch and set countries
                const countriesData = await fetchCountries(cancelToken);
                setCountries(countriesData);

                // Fetch and set states if a country is selected
                if (formData.country) {
                    const statesData = await fetchStates(formData.country);
                    setStates(statesData);
                }

                // Fetch and set projects
                const projectsData = await fetchProjects(cancelToken);
                setProjects(projectsData);

                // Fetch employees and update employee-related state
                const employeesData = await fetchEmployees();

                const employeeIdsArray = employeesData.map((employee) => employee.employeeid);
                const employeeEmailsArray = employeesData.map((employee) => employee.email);
                const employeeWorkEmailsArray = employeesData.map((employee) => employee.workEmail);
                setEmployeeIds(employeeIdsArray);
                setEmployeeEmails(employeeEmailsArray);
                setEmployeeWorkEmails(employeeWorkEmailsArray);
                setManagers(
                    employeesData.map((employee) => ({
                        id: employee.employeeid,
                        fullName: employee.fullname
                    }))
                );

                // Fetch and set departments and designations
                const departmentsData = await getDepartments(cancelToken);
                setDepartments(departmentsData);

                const designationsData = await getDesignations(cancelToken);
                setDesignations(designationsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Clean up function to cancel ongoing requests if the component unmounts
        return () => {
            _axiosSource.cancel('Request canceled by cleanup');
        };
    }, []);

    // Handles changes in form inputs and updates formData and errors
    const handleChange = (e) => {
        const { value, name } = e.target;

        setFormData({ ...formData, [name]: value });
        const newErrors = { ...errors, [name]: validateField(name, value) };
        setErrors(newErrors);
    };

    // Handles date changes and formats them according to backend requirements
    const handleDateChange = (key, newValue) => {
        const formattedDate = moment(newValue).format('YYYY-MM-DD'); // Format to "MM/dd/yyyy"

        setFormData((prevFormData) => ({
            ...prevFormData,
            [key]: formattedDate
        }));

        const newErrors = { ...errors, [key]: validateField(key, formattedDate) };
        setErrors(newErrors);
    };

    // Handles country selection and fetches related states
    const handleCountryChange = async (e) => {
        const selectedCountryId = e.target.value; // Get selected country ID

        // Find the selected country object if needed
        const selectedCountry = countries.find(
            (country) => country.country_id === parseInt(selectedCountryId)
        );

        // Update formData with selected country ID and clear state
        setFormData({
            ...formData,
            country: selectedCountryId, // Set country ID in formData
            state: '' // Clear state when country changes
        });

        // Set selected country name for display in UI
        setSelectedCountryName(selectedCountry.name);

        try {
            setLoading(true);

            const statesData = await fetchStates(selectedCountryId);
            if (statesData.length === 0) {
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    state: 'Not Exists'
                }));
            } // Fetch states using country ID
            setStates(statesData);

            setLoading(false);

            // Clear error message for country
            const newErrors = { ...errors, country: '' };
            setErrors(newErrors);
        } catch (error) {
            console.error('Error fetching states:', error);
            // Handle error as needed
            setLoading(false);
        }
    };

    // Handles changes in work email input and validates email format
    const handleWorkEmailChange = (e) => {
        const { value } = e.target;
        let errorMessage = '';

        if (!/^[a-z0-9]+[._]?[a-z0-9]+@ensarsolutions\.com$/i.test(value)) {
            errorMessage = 'Work Email must end with "@ensarsolutions.com"';
        }
        if (employeeWorkEmails.includes(value)) {
            errorMessage = 'This Email already exists. Please enter a unique Work Email ID';
        }
        setFormData({ ...formData, workEmail: value });
        setErrors({ ...errors, workEmail: errorMessage });
    };

    // Handles changes in general email input and validates email format
    const handleEmailChange = (e) => {
        const { value } = e.target;
        let errorMessage = '';

        // Check for invalid email format
        if (!/^[a-z0-9]+[._]?[a-z0-9]+[@]\w+[.]\w{2,3}$/.test(value)) {
            errorMessage = 'Invalid email format';
        }
        if (employeeEmails.includes(value)) {
            errorMessage = 'This Email is already registered. Please enter a unique Email ID';
        }
        setFormData({ ...formData, email: value });
        setErrors({ ...errors, email: errorMessage });
    };

    // Handles changes in employee ID input and validates ID format
    const handleEmployeeIdChange = (e) => {
        const { value } = e.target;

        // Updated regex to allow letters, numbers, special characters, and spaces
        const alphanumericSpecialRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9\s\W]+$/;

        let errorMessage = '';

        if (!alphanumericSpecialRegex.test(value)) {
            console.log('Value:', value);
            errorMessage =
                'Employee ID must contain both letters and numbers, and can include special characters and spaces.';
        }

        // Normalize value and employee IDs by removing hyphens
        const normalizedValue = value.trim().replace(/-/g, '');

        const normalizedEmployeeIds = employeeIds.map((id) => id.replace(/-/g, ''));

        if (normalizedEmployeeIds.includes(normalizedValue)) {
            errorMessage = 'This employee ID already exists. Please enter a unique ID.';
        }

        setFormData({
            ...formData,
            employeeid: value
        });

        setErrors({
            ...errors,
            employeeid: errorMessage
        });
    };

    // Converts a Blob object to a Base64 string
    const blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    // Handles form submission, validates data, and processes PDF generation
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { isValid, newErrors } = validate(formData, errors);
        setErrors(newErrors);
        if (true) {
            // Check if state exists, if not set it to 'Not Exists'
            const stateValue = formData.state ? formData.state : 'Not Exists';

            // Format dates according to backend requirements
            const transformedData = {
                ...formData,
                state: stateValue,
                employeeDateOfBirth: moment(formData.employeeDateOfBirth).format('MM/DD/YYYY'),
                joiningdate: moment(formData.joiningdate).format('MM/DD/YYYY'),
                country: selectedCountryName,
                ...(formData.dateOfExit && {
                    dateOfExit: moment(formData.dateOfExit).format('MM/DD/YYYY')
                })
            };

            console.log('Form submitted:', transformedData);

            try {
                // Get the PDF Blob
                const pdfBlob = await generatePDF(transformedData, false);

                // Convert PDF Blob to Base64
                const pdfBase64 = await blobToBase64(pdfBlob);

                // Add the Base64 PDF to transformedData
                const formDataWithPdf = {
                    ...transformedData,
                    pdf: pdfBase64
                };

                // Submit to API
                addEmployee(formDataWithPdf);

                // Clear form values after successful submission
                setFormData(initialFormData);
            } catch (error) {
                console.error('Error generating PDF:', error);
            }
        }
    };

    // Handles closing of the modal and redirects to signin page
    const handleClose = () => {
        setOpen(false);
        generatePDF(submittedData, true);
        history.push('/signin');
    };

    // Adds a new employee by submitting the data to the API
    const addEmployee = async (data) => {
        try {
            setLoading(true);
            const res = await createEmployees(data);
            console.log(res);
            if (res === 200) {
                setSubmittedData(data);
                setOpen(true);

                // Handle success (e.g., close modal)
            } else {
                console.error('Error adding employee:', res);
                // Handle error
            }
        } catch (error) {
            console.error('Error adding employee:', error);
            // Handle error
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Box
                component='form'
                onSubmit={handleSubmit}
                noValidate
                sx={{
                    mt: 3,
                    maxWidth: '1000px',
                    mx: 'auto',
                    p: 2
                }}
            >
                <Card>
                    <CardContent>
                        <Typography
                            variant='h4'
                            gutterBottom
                            sx={{ color: '#0B5CFF', textAlign: 'center', paddingBottom: '20px' }}
                        >
                            Employee Registration Form
                        </Typography>
                        <Grid container spacing={2}>
                            {/* Row 1 */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id='firstname'
                                    name='firstname'
                                    label='First Name'
                                    variant='outlined'
                                    fullWidth
                                    required
                                    value={formData.firstname}
                                    onChange={handleChange}
                                    error={!!errors.firstname}
                                    helperText={errors.firstname}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id='lastname'
                                    name='lastname'
                                    label='Last Name'
                                    variant='outlined'
                                    fullWidth
                                    required
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    error={!!errors.lastname}
                                    helperText={errors.lastname}
                                />
                            </Grid>

                            {/* Row 2 */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id='email'
                                    name='email'
                                    label='Email'
                                    variant='outlined'
                                    fullWidth
                                    required
                                    value={formData.email}
                                    onChange={handleEmailChange}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id='password'
                                    name='password'
                                    label='Password'
                                    type='password'
                                    variant='outlined'
                                    fullWidth
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={!!errors.password}
                                    helperText={errors.password}
                                />
                            </Grid>

                            {/* Row 3 */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id='employeeid'
                                    name='employeeid'
                                    label='Employee ID'
                                    variant='outlined'
                                    fullWidth
                                    required
                                    value={formData.employeeid}
                                    onChange={handleEmployeeIdChange}
                                    error={!!errors.employeeid}
                                    helperText={errors.employeeid}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id='employeeDateOfBirth'
                                    name='employeeDateOfBirth'
                                    label='Date of Birth'
                                    type='date'
                                    variant='outlined'
                                    fullWidth
                                    required
                                    value={formData.employeeDateOfBirth}
                                    onChange={(e) =>
                                        handleDateChange('employeeDateOfBirth', e.target.value)
                                    }
                                    error={!!errors.employeeDateOfBirth}
                                    helperText={errors.employeeDateOfBirth}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            {/* Row 4 */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id='phone'
                                    name='phone'
                                    label='Phone'
                                    variant='outlined'
                                    fullWidth
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    error={!!errors.phone}
                                    helperText={errors.phone}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id='gender'
                                    select
                                    name='gender'
                                    label='Gender'
                                    value={formData.gender}
                                    onChange={handleChange}
                                    variant='outlined'
                                    fullWidth
                                    required
                                    error={!!errors.gender}
                                    helperText={errors.gender}
                                >
                                    {genders.map((option) => (
                                        <MenuItem key={option} value={option.label}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            {/* Row 5 */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id='bloodGroup'
                                    select
                                    name='bloodGroup'
                                    label='Blood Group'
                                    value={formData.bloodGroup}
                                    onChange={handleChange}
                                    variant='outlined'
                                    fullWidth
                                    required
                                    error={!!errors.bloodGroup}
                                    helperText={errors.bloodGroup}
                                >
                                    {bloodGroups.map((option) => (
                                        <MenuItem key={option} value={option.label}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id='maritalStatus'
                                    select
                                    name='maritalStatus'
                                    label='Marital Status'
                                    value={formData.maritalStatus}
                                    onChange={handleChange}
                                    variant='outlined'
                                    fullWidth
                                    required
                                    error={!!errors.maritalStatus}
                                    helperText={errors.maritalStatus}
                                >
                                    {maritalStatuses.map((option) => (
                                        <MenuItem key={option} value={option.label}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            {/* Row 6 */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id='fatherName'
                                    name='fatherName'
                                    label='Father Name'
                                    variant='outlined'
                                    fullWidth
                                    required
                                    value={formData.fatherName}
                                    onChange={handleChange}
                                    error={!!errors.fatherName}
                                    helperText={errors.fatherName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id='motherName'
                                    name='motherName'
                                    label='Mother Name'
                                    variant='outlined'
                                    fullWidth
                                    required
                                    value={formData.motherName}
                                    onChange={handleChange}
                                    error={!!errors.motherName}
                                    helperText={errors.motherName}
                                />
                            </Grid>

                            {/* Row 7 */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id='reference'
                                    name='reference'
                                    label='Reference'
                                    variant='outlined'
                                    fullWidth
                                    required
                                    value={formData.reference}
                                    onChange={handleChange}
                                    error={!!errors.reference}
                                    helperText={errors.reference}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id='employeeType'
                                    select
                                    name='employeeType'
                                    label='Employee Type'
                                    value={formData.employeeType}
                                    onChange={handleChange}
                                    variant='outlined'
                                    fullWidth
                                    required
                                    error={!!errors.employeeType}
                                    helperText={errors.employeeType}
                                >
                                    {employeeTypes.map((option) => (
                                        <MenuItem key={option} value={option.label}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            {/* Row 8 */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id='employeeStatus'
                                    select
                                    name='employeeStatus'
                                    label='Employee Status'
                                    value={formData.employeeStatus}
                                    onChange={handleChange}
                                    variant='outlined'
                                    fullWidth
                                    required
                                    error={!!errors.employeeStatus}
                                    helperText={errors.employeeStatus}
                                >
                                    {employeeStatuses.map((option) => (
                                        <MenuItem key={option} value={option.label}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id='workEmail'
                                    name='workEmail'
                                    label='Work Email'
                                    variant='outlined'
                                    fullWidth
                                    required
                                    value={formData.workEmail}
                                    onChange={handleWorkEmailChange}
                                    error={!!errors.workEmail}
                                    helperText={errors.workEmail}
                                />
                            </Grid>

                            {/* Row 9 */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id='company'
                                    name='company'
                                    label='Company'
                                    variant='outlined'
                                    fullWidth
                                    required
                                    value={formData.company}
                                    onChange={handleChange}
                                    error={!!errors.company}
                                    helperText={errors.company}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id='workLocationName'
                                    name='workLocationName'
                                    label='Work Location'
                                    variant='outlined'
                                    fullWidth
                                    required
                                    value={formData.workLocationName}
                                    onChange={handleChange}
                                    error={!!errors.workLocationName}
                                    helperText={errors.workLocationName}
                                />
                            </Grid>

                            {/* Row 10 */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id='department'
                                    select
                                    name='department'
                                    label='Department'
                                    value={formData.department}
                                    onChange={handleChange}
                                    variant='outlined'
                                    fullWidth
                                    required
                                    error={!!errors.department}
                                    helperText={errors.department}
                                >
                                    {departments.map((department) => (
                                        <MenuItem
                                            key={department.id}
                                            value={department.departmentname}
                                        >
                                            {department.departmentname}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id='designation'
                                    select
                                    name='designation'
                                    label='Designation'
                                    value={formData.designation}
                                    onChange={handleChange}
                                    variant='outlined'
                                    fullWidth
                                    required
                                    error={!!errors.designation}
                                    helperText={errors.designation}
                                >
                                    {designations.map((designation) => (
                                        <MenuItem
                                            key={designation.id}
                                            value={designation.designation}
                                        >
                                            {designation.designation}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            {/* Row 11 */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id='role'
                                    select
                                    name='role'
                                    label='Role'
                                    value={formData.role}
                                    onChange={handleChange}
                                    variant='outlined'
                                    fullWidth
                                    required
                                    error={!!errors.role}
                                    helperText={errors.role}
                                >
                                    {roles.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id='manager'
                                    select
                                    name='manager'
                                    label='Reporting To'
                                    value={formData.manager}
                                    onChange={handleChange}
                                    variant='outlined'
                                    fullWidth
                                    required
                                    error={!!errors.manager}
                                    helperText={errors.manager}
                                >
                                    {managers.map((manager) => (
                                        <MenuItem key={manager.id} value={manager.fullName}>
                                            {manager.fullName}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            {/* Row 12 */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id='projects'
                                    select
                                    name='projects'
                                    label='Projects'
                                    value={formData.projects}
                                    onChange={handleChange}
                                    variant='outlined'
                                    fullWidth
                                    required
                                    error={!!errors.projects}
                                    helperText={errors.projects}
                                >
                                    {projects.map((project) => (
                                        <MenuItem key={project.id} value={project.name}>
                                            {project.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id='joiningdate'
                                    name='joiningdate'
                                    label='Joining Date'
                                    type='date'
                                    variant='outlined'
                                    fullWidth
                                    required
                                    value={formData.joiningdate}
                                    onChange={(e) =>
                                        handleDateChange('joiningdate', e.target.value)
                                    }
                                    error={!!errors.joiningdate}
                                    helperText={errors.joiningdate}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id='address'
                                    name='address'
                                    label='Address'
                                    variant='outlined'
                                    fullWidth
                                    required
                                    value={formData.address}
                                    onChange={handleChange}
                                    error={!!errors.address}
                                    helperText={errors.address}
                                />
                            </Grid>

                            {/* Row 13 */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id='country'
                                    select
                                    name='country'
                                    label='Country'
                                    value={formData.country}
                                    onChange={handleCountryChange}
                                    variant='outlined'
                                    fullWidth
                                    required
                                    error={!!errors.country}
                                    helperText={errors.country}
                                >
                                    {countries.map((country) => (
                                        <MenuItem
                                            key={country.country_id}
                                            value={country.country_id}
                                        >
                                            {country.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id='state'
                                    select
                                    name='state'
                                    label='State'
                                    value={formData.state}
                                    onChange={handleChange}
                                    variant='outlined'
                                    fullWidth
                                    required
                                    error={!!errors.state}
                                    helperText={errors.state}
                                >
                                    {states.map((state) => (
                                        <MenuItem key={state.id} value={state.name}>
                                            {state.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            {/* Row 14 */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id='city'
                                    name='city'
                                    label='City'
                                    variant='outlined'
                                    fullWidth
                                    required
                                    value={formData.city}
                                    onChange={handleChange}
                                    error={!!errors.city}
                                    helperText={errors.city}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id='zipcode'
                                    name='zipcode'
                                    label='Zip Code'
                                    variant='outlined'
                                    fullWidth
                                    required
                                    value={formData.zipcode}
                                    onChange={handleChange}
                                    error={!!errors.zipcode}
                                    helperText={errors.zipcode}
                                />
                            </Grid>

                            {/* Row 15 */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id='permenantAddress'
                                    name='permenantAddress'
                                    label='Permanent Address'
                                    variant='outlined'
                                    fullWidth
                                    required
                                    value={formData.permenantAddress}
                                    onChange={handleChange}
                                    error={!!errors.permenantAddress}
                                    helperText={errors.permenantAddress}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id='emergencyContactNumber'
                                    name='emergencyContactNumber'
                                    label='Emergency Contact Number'
                                    variant='outlined'
                                    fullWidth
                                    required
                                    value={formData.emergencyContactNumber}
                                    onChange={handleChange}
                                    error={!!errors.emergencyContactNumber}
                                    helperText={errors.emergencyContactNumber}
                                />
                            </Grid>

                            {/* Row 16 */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id='panNumber'
                                    name='panNumber'
                                    label='PAN Number'
                                    variant='outlined'
                                    fullWidth
                                    required
                                    value={formData.panNumber}
                                    onChange={handleChange}
                                    error={!!errors.panNumber}
                                    helperText={errors.panNumber}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id='aadharNumber'
                                    name='aadharNumber'
                                    label='Aadhar Number'
                                    variant='outlined'
                                    fullWidth
                                    required
                                    value={formData.aadharNumber}
                                    onChange={handleChange}
                                    error={!!errors.aadharNumber}
                                    helperText={errors.aadharNumber}
                                />
                            </Grid>

                            {/* Row 17 */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id='nameAsPerAadhar'
                                    name='nameAsPerAadhar'
                                    label='Name As Per Aadhar'
                                    variant='outlined'
                                    fullWidth
                                    required
                                    value={formData.nameAsPerAadhar}
                                    onChange={handleChange}
                                    error={!!errors.nameAsPerAadhar}
                                    helperText={errors.nameAsPerAadhar}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id='dateOfExit'
                                    name='dateOfExit'
                                    label='Date of Exit'
                                    type='date'
                                    variant='outlined'
                                    fullWidth
                                    required
                                    value={formData.dateOfExit}
                                    onChange={(e) => handleDateChange('dateOfExit', e.target.value)}
                                    error={!!errors.dateOfExit}
                                    helperText={errors.dateOfExit}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                    <Button
                                        type='submit'
                                        variant='contained'
                                        color='primary'
                                        disabled={isLoading}
                                        startIcon={isLoading && <CircularProgress size={20} />}
                                    >
                                        Submit
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Success</DialogTitle>
                <DialogContent>
                    <DialogContentText>The form has been successfully submitted.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color='primary'>
                        Download PDF
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default PublicEmployee;
