import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { createEmployees, updateEmployees, getEmployees } from '../actions/employee-actions';
import { manageError } from '../../core/actions/common-actions';
import AppUtils from '../../core/helpers/app-utils';
import { AppConfigProps } from '../../core/settings/app-config';
import './AddEmployee.css';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Autocomplete from '@mui/material/Autocomplete';
import moment from 'moment';
import { getProjects } from '../../projects/actions/project-action';
import CircularProgress from '@mui/material/CircularProgress';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import generatePDF from './GeneratePdf';

// Modal style configuration
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

// Main component for adding or editing an employee
export default function AddEmployee(props) {
    // Axios cancel token for API requests
    const _axiosSource = axios.CancelToken.source();
    const _cancelToken = { cancelToken: _axiosSource.token };
    const history = useHistory();

    // State variables
    const [employeeEmails, setEmployeeEmails] = useState([]);
    const [employeeIds, setEmployeeIds] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [dialogOpen, setDialogOpen] = useState(false);
    const [submittedData, setSubmittedData] = useState({});

    // Employee form state
    const [employeeValues, setEmployeeValues] = useState({
        firstName: props.employeeDetails?.firstname || '',
        lastName: props.employeeDetails?.lastname || '',
        email: props.employeeDetails?.email || '',
        phone: props.employeeDetails?.phone || '',
        gender: props.employeeDetails?.gender || '',
        reference: props.employeeDetails?.reference || '',
        department: props.employeeDetails?.department || '',
        designation: props.employeeDetails?.designation || '',
        role: props.employeeDetails?.role || '',
        password: '',
        manager: props.employeeDetails?.manager || '',
        managerEmail: props.employeeDetails?.managerEmail || '',
        projects: props.employeeDetails?.projects || '',
        employeeType: props.employeeDetails?.employeeType || '',
        number: props.employeeDetails?.employeeid || '',
        joiningdate: props.employeeDetails?.joiningdate || '',
        maritalStatus: props.employeeDetails?.maritalStatus || '',
        employeeStatus: props.employeeStatus?.employeeStatus || '',
        bloodGroup: props.employeeDetails?.bloodGroup || '',
        dateOfExit: props.employeeDetails?.dateOfExit || '',
        workEmail: props.employeeDetails?.workEmail || '',
        workLocationName: props.employeeDetails?.workLocationName || '',
        fatherName: props.employeeDetails?.fathername || '',
        motherName: props.employeeDetails?.mothername || '',
        emergencyContactNumber: props.employeeDetails?.emergencyContactNumber || '',
        employeeDateOfBirth: props.employeeDetails?.employeeDateOfBirth || '',
        address: props.employeeDetails?.address || '',
        city: props.employeeDetails?.city || '',
        state: props.employeeDetails?.state || '',
        zipCode: props.employeeDetails?.zipcode || '',
        company: props.employeeDetails?.company || '',
        country: props.employeeDetails?.country || '',
        permanentAddress: props.employeeDetails?.permanentAddress || '',
        panNumber: props.employeeDetails?.pannumber || '',
        aadhaarNumber: props.employeeDetails?.aadhaarnumber || '',
        nameAsPerAadhaar: props.employeeDetails?.nameAsPerAadhar || ''
    });

    // Effect to update employee values when props change
    useEffect(() => {
        setEmployeeValues({
            firstName: props.employeeDetails?.firstname || '',
            lastName: props.employeeDetails?.lastname || '',
            password: '',
            email: props.employeeDetails?.email || '',
            phone: props.employeeDetails?.phone || '',
            gender: props.employeeDetails?.gender || '',
            reference: props.employeeDetails?.reference || '',
            department: props.employeeDetails?.department || '',
            designation: props.employeeDetails?.designation || '',
            role: props.employeeDetails?.role || '',
            manager: props.employeeDetails?.manager || '',
            managerEmail: props.employeeDetails?.managerEmail || '',
            projects: props.employeeDetails?.projects || '',
            employeeType: props.employeeDetails?.employeeType || '',
            employeeStatus: props.employeeDetails?.employeeStatus || '',
            number: props.employeeDetails?.employeeid || '',
            joiningdate: props.employeeDetails?.joiningdate || '',
            maritalStatus: props.employeeDetails?.maritalStatus || '',
            bloodGroup: props.employeeDetails?.bloodGroup || '',
            dateOfExit: props.employeeDetails?.dateOfExit || '',
            workEmail: props.employeeDetails?.workEmail || '',
            workLocationName: props.employeeDetails?.workLocationName || '',
            fatherName: props.employeeDetails?.fathername || '',
            motherName: props.employeeDetails?.mothername || '',
            emergencyContactNumber: props.employeeDetails?.emergencyContactNumber || '',
            employeeDateOfBirth: props.employeeDetails?.employeeDateOfBirth || '',
            address: props.employeeDetails?.address || '',
            city: props.employeeDetails?.city || '',
            state: props.employeeDetails?.state || '',
            zipCode: props.employeeDetails?.zipcode || '',
            company: props.employeeDetails?.company || '',
            country: props.employeeDetails?.country || '',
            permanentAddress: props.employeeDetails?.permanentAddress || '',
            panNumber: props.employeeDetails?.panNumber || '',
            aadhaarNumber: props.employeeDetails?.aadharNumber || '',
            nameAsPerAadhaar: props.employeeDetails?.nameAsPerAadhar || ''
            // Add other fields here and set their values accordingly
        });
    }, [props.employeeDetails]);

    //1
    const validate = () => {
        let isValid = true;
        const newErrors = {};

        // Validation for 'add' method
        if (props.method === 'add') {
            // Iterate through all employee values
            Object.entries(employeeValues).forEach(([key, value]) => {
                console.log('key', value);

                // Check if field is empty
                if (key !== 'dateOfExit' && typeof value === 'string' && !value.trim()) {
                    newErrors[key] = 'Please Enter ' + key;
                    isValid = false;

                    // Validate password
                } else if (key === 'password') {
                    if (!/(?=.*[a-z])/.test(value)) {
                        newErrors[key] = 'Password must contain at least one lowercase letter';
                        isValid = false;
                    } else if (!/(?=.*[A-Z])/.test(value)) {
                        newErrors[key] = 'Password must contain at least one uppercase letter';
                        isValid = false;
                    } else if (!/(?=.*[0-9])/.test(value)) {
                        newErrors[key] = 'Password must contain at least one digit';
                        isValid = false;
                    } else if (!/(?=.*[\^$*.[\]{}()?"!@#%&/\\,><':;|_~`])/.test(value)) {
                        newErrors[key] = 'Password must contain at least one special character';
                        isValid = false;
                    }

                    // Validate phone number length
                } else if (key === 'phone' && value.length !== 10) {
                    newErrors[key] = 'Phone number should contain 10 digits';
                    isValid = false;

                    // Validate emergency contact number length
                } else if (key === 'emergencyContactNumber' && value.length !== 10) {
                    newErrors[key] = 'Emergency Contact number should contain 10 digits';
                    isValid = false;

                    // Validate work email format
                } else if (
                    key === 'workEmail' &&
                    !/^[a-z0-9]+[._]?[a-z0-9]+@ensarsolutions\.com$/i.test(value)
                ) {
                    newErrors[key] = 'Work Email must end with "@ensarsolutions.com';
                    isValid = false;

                    // Validate first name length
                } else if (key === 'firstName' && !/^[A-Za-z0-9 .]{2,50}$/.test(value)) {
                    newErrors[key] = 'First name must be between 2 and 50 characters';
                    isValid = false;

                    // Validate last name length
                } else if (key === 'lastName' && !/^[A-Za-z0-9 .]{2,50}$/.test(value)) {
                    newErrors[key] = 'Last name must be between 2 and 50 characters';
                    isValid = false;

                    // Validate email format
                } else if (
                    key === 'email' &&
                    !/^[a-z0-9]+[._]?[a-z0-9]+[@]\w+[.]\w{2,3}$/.test(value)
                ) {
                    newErrors[key] = 'Invalid email format';
                    isValid = false;
                }
            });

            // Check if email already exists
            if (
                props.method === 'add' &&
                employeeValues.email.trim() &&
                employeeEmails.includes(employeeValues.email.trim())
            ) {
                newErrors.email = 'This email already exists, please use a different email.';
                isValid = false;
            }

            // Check if employee ID already exists
            if (
                props.method === 'add' &&
                employeeValues.number.trim() &&
                employeeIds.includes(employeeValues.number.trim())
            ) {
                newErrors.number = 'This employee ID already exists, please use a different ID.';
                isValid = false;
            }

            // Validation for 'edit' method
        } else if (props.method === 'edit') {
            // Validate first name
            if (!employeeValues.firstName.trim()) {
                console.log('firstname validation failed');
                newErrors['firstName'] = 'Please enter First Name';
                isValid = false;
            }

            // Validate last name
            if (!employeeValues.lastName.trim()) {
                console.log('lastname validation failed');
                newErrors['lastName'] = 'Please enter Last Name';
                isValid = false;
            }

            // Validate email
            if (!employeeValues.email.trim()) {
                console.log('email validation failed');
                newErrors.email = 'Please enter Email';
                isValid = false;
            } else if (!/^[a-z0-9]+[._]?[a-z0-9]+[@]\w+[.]\w{2,3}$/.test(employeeValues.email)) {
                console.log('email validation failed');
                newErrors.email = 'Invalid email format';
                isValid = false;
            }

            // Validate phone number
            if (!employeeValues.phone.trim()) {
                console.log('phone validation failed');
                newErrors.phone = 'Please enter Phone number';
                isValid = false;
            } else if (employeeValues.phone.length !== 10) {
                console.log('phone validation failed');
                newErrors.phone = 'Phone number should contain 10 digits';
                isValid = false;
            }

            // Validate emergency contact number
            if (!employeeValues.emergencyContactNumber.trim()) {
                console.log('Emergency Phone Number validation failed');
                newErrors.emergencyContactNumber = 'Please enter Emergency Contact number';
                isValid = false;
            } else if (employeeValues.emergencyContactNumber.length !== 10) {
                console.log('phone validation failed');
                newErrors.emergencyContactNumber =
                    'Emergency Contact number should contain 10 digits';
                isValid = false;
            }

            // Validate reference
            if (!employeeValues.reference.trim()) {
                console.log('reference validation failed');
                newErrors.reference = 'Please enter Reference name';
                isValid = false;
            }

            // Validate department
            if (!employeeValues.department.trim()) {
                console.log('department validation failed');
                newErrors.department = 'Please select Department';
                isValid = false;
            }

            // Validate designation
            if (!employeeValues.designation.trim()) {
                console.log('designation validation failed');
                newErrors.designation = 'Please select Designation';
                isValid = false;
            }

            // Validate role
            if (!employeeValues.role.trim()) {
                console.log('role validation failed');
                newErrors.role = 'Please select a Role';
                isValid = false;
            }

            // Validate manager
            if (!employeeValues.manager.trim()) {
                console.log('manager validation failed');
                newErrors.manager = 'Please select a Manager';
                isValid = false;
            }

            // Validate projects
            if (!employeeValues.projects.trim()) {
                console.log('projects validation failed');
                newErrors.projects = 'Please select at least one Project';
                isValid = false;
            }

            // Validate employee type
            if (!employeeValues.employeeType || !employeeValues.employeeType.trim()) {
                console.log('emp type validation failed');
                newErrors.employeeType = 'Please select Employee Type';
                isValid = false;
            }

            // Validate employee ID
            if (!employeeValues.number.trim()) {
                console.log('emp id validation failed');
                newErrors['number'] = 'Please enter Employee Id';
                isValid = false;
            }

            // Validate joining date
            if (!employeeValues.joiningdate) {
                console.log('joining date validation failed');
                newErrors['joiningdate'] = 'Please enter Joining Date';
                isValid = false;
            }

            // Validate marital status
            if (!employeeValues.maritalStatus) {
                console.log('marital status validation failed');
                newErrors['maritalStatus'] = 'Please enter Marital Status';
                isValid = false;
            }

            // Additional validation for 'add' method
        } else if (props.method === 'add') {
            // Validate first name
            if (!employeeValues.firstName.trim()) {
                newErrors['firstName'] = 'Please enter First Name';
                isValid = false;
            }

            // Validate last name
            if (!employeeValues.lastName.trim()) {
                newErrors['lastName'] = 'Please enter Last Name';
                isValid = false;
            }

            // Validate email
            if (!employeeValues.email.trim()) {
                newErrors['email'] = 'Please enter Email';
                isValid = false;
            }

            // Validate password
            if (!employeeValues.password.trim()) {
                newErrors['password'] = 'Please enter Password';
                isValid = false;
            }

            // Validate employee ID
            if (!employeeValues.number.trim()) {
                newErrors['number'] = 'Please enter Employee Id';
                isValid = false;
            }

            // Validate joining date
            if (!employeeValues.joiningdate) {
                newErrors['joiningdate'] = 'Please enter Joining Date';
                isValid = false;
            }

            // Validate phone number
            if (!employeeValues.phone.trim()) {
                newErrors['phone'] = 'Please enter Phone number';
                isValid = false;
            }

            // Validate emergency contact number
            if (!employeeValues.emergencyContactNumber.trim()) {
                console.log('Emergency Phone Number validation failed');
                newErrors['emergencyContactNumber'] = 'Please enter Emergency Contact number';
                isValid = false;
            }

            // Validate reference
            if (!employeeValues.reference.trim()) {
                newErrors['reference'] = 'Please enter Reference name';
                isValid = false;
            }

            // Validate department
            if (!employeeValues.department.trim()) {
                newErrors['department'] = 'Please select Department';
                isValid = false;
            }

            // Validate designation
            if (!employeeValues.designation.trim()) {
                newErrors['designation'] = 'Please select Designation';
                isValid = false;
            }

            // Validate role
            if (!employeeValues.role) {
                newErrors['role'] = 'Please select a Role';
                isValid = false;
            }

            // Validate manager
            if (!employeeValues.manager.trim()) {
                newErrors['manager'] = 'Please select a Manager';
                isValid = false;
            }

            // Validate projects
            if (employeeValues.projects.length === 0) {
                newErrors['projects'] = 'Please select at least one Project';
                isValid = false;
            }

            // Validate employee type
            if (!employeeValues.employeeType) {
                newErrors['employeeType'] = 'Please select Employee Type';
                isValid = false;
            }

            // Validate marital status
            if (!employeeValues.maritalStatus) {
                newErrors['maritalStatus'] = 'Please enter Marital Status';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    // State hooks
    const [employeeNames, setEmployeeNames] = useState([]);
    const [projectNames, setProjectNames] = useState([]);

    // Load page data for employees
    const loadPageData = async () => {
        await getEmployees()
            .then(async (res) => {
                if (
                    res &&
                    res.status === AppConfigProps.httpStatusCode.ok &&
                    res.data &&
                    res.data
                ) {
                    const employeeData1 = res.data;
                    const employeeData = res.data.filter((employee) => !employee.disabled);
                    setEmployeeNames(
                        employeeData.map((employee) => ({
                            label: employee.fullname,
                            value:
                                !employee.imageurl || !employee.imageurl.trim()
                                    ? 'https://a0.anyrgb.com/pngimg/1140/162/user-profile-login-avatar-heroes-user-blue-icons-circle-symbol-logo.png'
                                    : employee.imageurl,
                            managerEmail: employee.email
                        }))
                    );

                    setEmployeeEmails(employeeData1.map((employee) => employee.email));
                    setEmployeeIds(employeeData1.map((employee) => employee.employeeid));
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            });
    };

    // Load page data for project names
    const loadPageDataProjectNames = async () => {
        await getProjects(_cancelToken)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    const projectsNames = res.data.map((project) => project.name);
                    setProjectNames(projectsNames);
                } else {
                    await manageError(res, props.history);
                }
            })
            .catch(async (err) => {
                await manageError(err, props.history);
            });
    };

    // Handle input change and validation
    const handleChange = async (event) => {
        const { name, value: inputValue } = event.target;
        let errorMessage = '';

        if (name !== 'Projects' && name !== 'dateOfExit' && name !== 'city' && name !== 'country') {
            if (!inputValue.trim()) {
                errorMessage = `Please Enter ${name}`;
            } else if (name === 'password') {
                if (!/(?=.*[a-z])/.test(inputValue)) {
                    errorMessage = 'Password must contain at least one lowercase letter';
                } else if (!/(?=.*[A-Z])/.test(inputValue)) {
                    errorMessage = 'Password must contain at least one uppercase letter';
                } else if (!/(?=.*[0-9])/.test(inputValue)) {
                    errorMessage = 'Password must contain at least one digit';
                } else if (!/(?=.*[\^$*.[\]{}()?"!@#%&/\\,><':;|_~`])/.test(inputValue)) {
                    errorMessage = 'Password must contain at least one special character';
                }
            } else if (name === 'phone' && inputValue.length !== 10) {
                errorMessage = 'Phone number should contain 10 digits';
            } else if (name === 'emergencyContactNumber' && inputValue.length !== 10) {
                errorMessage = 'Emergency contact number should contain 10 digits';
            } else if (name === 'firstName' && !/^[A-Za-z0-9 .]{2,50}$/.test(inputValue)) {
                errorMessage = 'First name must be between 2 and 50 characters';
            } else if (name === 'lastName' && !/^[A-Za-z0-9 .]{2,50}$/.test(inputValue)) {
                errorMessage = 'Last name must be between 2 and 50 characters';
            } else if (
                name === 'email' &&
                !/^[a-z0-9]+[._]?[a-z0-9]+[@]\w+[.]\w{2,3}$/.test(inputValue)
            ) {
                errorMessage = 'Invalid email format';
            } else if (name === 'email' && employeeEmails.includes(inputValue)) {
            } else if (name === 'email' && employeeEmails.includes(inputValue)) {
                errorMessage = 'This email already exists. Please try a new email.';
            } else if (
                name === 'workEmail' &&
                !/^[a-z0-9]+[._]?[a-z0-9]+@ensarsolutions\.com$/i.test(inputValue)
            ) {
                errorMessage = 'Invalid work email format. Please use an ensarsolutions.com email.';
            } else if (name === 'number') {
                // Updated regex to allow letters, numbers, special characters, and spaces (optional)
                const alphanumericSpecialRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9\s\W]+$/;

                if (!alphanumericSpecialRegex.test(inputValue)) {
                    errorMessage =
                        'Employee ID must contain both letters and numbers, and can include special characters and spaces.';
                } else if (employeeIds.includes(inputValue)) {
                    errorMessage = 'This employee ID already exists. Please enter a unique ID.';
                }
            }
        }

        // Update errors state
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: errorMessage
        }));

        // Reset specific error states
        if (name === 'manager' || name === 'employeeType' || name === 'projects') {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: ''
            }));
        }

        // Update employee values based on field name
        if (name === 'joiningdate' || name === 'employeeDateOfBirth' || name === 'dateOfExit') {
            let dateFormat = AppUtils.getDateEmployeeFormat(inputValue);
            await setEmployeeValues((prevValues) => ({
                ...prevValues,
                [name]: dateFormat
            }));
        } else if (name === 'Projects') {
            const selectedProjects = event.target.value || [];
            const projectsString = selectedProjects.join(', ');
            await setEmployeeValues((prevValues) => ({
                ...prevValues,
                projects: projectsString
            }));
            setErrors((prevErrors) => ({
                ...prevErrors,
                projects: ''
            }));
        } else {
            await setEmployeeValues((prevValues) => ({
                ...prevValues,
                [name]: inputValue
            }));
        }
    };

    // Handle error messages
    const handleError = (error, input) => {
        setErrors((prevState) => ({ ...prevState, [input]: error }));
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (validate()) {
            if (!isLoading) {
                setLoading(true);

                if (props.method === 'add') {
                    addEmployee();
                } else if (props.method === 'edit') {
                    const filteredValues = Object.entries(employeeValues).filter(
                        ([key, value]) =>
                            key !== 'password' &&
                            key !== 'dateOfExit' &&
                            key !== 'state' &&
                            key !== 'country' &&
                            key !== 'managerEmail'
                    );

                    if (filteredValues.some(([, value]) => !value.trim())) {
                        console.log('Some values are empty or whitespace-only:', employeeValues);
                    } else {
                        console.log('else block execution started');
                        employeeUpdate();
                        setLoading(false);
                    }
                }
            } else {
                setLoading(false);
            }
        } else {
            console.log('Validation failed');
        }
    };

    // Load data on component mount
    useEffect(() => {
        loadPageData();
        loadPageDataProjectNames();
        setErrors({});
    }, []);

    // Add a new employee
    const addEmployee = async () => {
        let employeeObj = {
            firstname: employeeValues.firstName,
            lastname: employeeValues.lastName,
            email: employeeValues.email,
            password: employeeValues.password,
            employeeid: employeeValues.number,
            joiningdate: employeeValues.joiningdate,
            phone: employeeValues.phone,
            gender: employeeValues.gender,
            reference: employeeValues.reference,
            department: employeeValues.department,
            designation: employeeValues.designation,
            role: employeeValues.role,
            manager: employeeValues.manager,
            managerEmail: employeeValues.managerEmail,
            projects: employeeValues.projects,
            employeeType: employeeValues.employeeType,
            employeeStatus: employeeValues?.employeeStatus,
            maritalStatus: employeeValues.maritalStatus,
            bloodGroup: employeeValues.bloodGroup,
            dateOfExit: employeeValues.dateOfExit,
            workEmail: employeeValues.workEmail,
            workLocationName: employeeValues.workLocationName,
            fatherName: employeeValues.fatherName,
            motherName: employeeValues.motherName,
            emergencyContactNumber: employeeValues.emergencyContactNumber,
            employeeDateOfBirth: employeeValues.employeeDateOfBirth,
            address: employeeValues.address,
            city: employeeValues.city,
            state: employeeValues.state,
            zipcode: employeeValues.zipCode,
            company: employeeValues.company,
            country: employeeValues.country,
            permenantAddress: employeeValues.permanentAddress,
            panNumber: employeeValues.panNumber,
            aadharNumber: employeeValues.aadhaarNumber,
            nameAsPerAadhar: employeeValues.nameAsPerAadhaar
        };

        setLoading(true);

        createEmployees(employeeObj, _cancelToken)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    props.handleClose();
                    setDialogOpen(true);
                    setSubmittedData(employeeObj);
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            })
            .finally(() => {
                setLoading(false);
                ClearedValues();
            });
    };

    // Update an existing employee
    const employeeUpdate = async () => {
        console.log('employee_id', props.employeeDetails?.id);
        let userId = props.employeeDetails?.id;
        let employeeObj = {
            // Personal Details
            userId: props.employeeDetails.id,
            firstname: employeeValues.firstName || props.employeeDetails?.firstname,
            lastname: employeeValues.lastName || props.employeeDetails?.lastname,
            fullname: `${employeeValues.firstName || props.employeeDetails?.firstname} ${
                employeeValues.lastName || props.employeeDetails?.lastname
            }`,
            email: employeeValues.email || props.employeeDetails?.email,
            workEmail: employeeValues.workEmail || props.employeeDetails?.workEmail,
            phone: employeeValues.phone || props.employeeDetails?.phone,
            contactNumber: employeeValues.contactNumber || props.employeeDetails?.contactNumber,
            gender: employeeValues.gender || props.employeeDetails?.gender,
            employeeDateOfBirth:
                employeeValues.employeeDateOfBirth || props.employeeDetails?.employeeDateOfBirth,
            bloodGroup: employeeValues.bloodGroup || props.employeeDetails?.bloodGroup,
            maritalStatus: employeeValues.maritalStatus || props.employeeDetails?.maritalStatus,
            username: (employeeValues.firstName || props.employeeDetails?.firstname)?.toLowerCase(),

            // Employment Details
            employeeid: employeeValues.number || props.employeeDetails?.employeeid,
            employeeType: employeeValues.employeeType || props.employeeDetails?.employeeType,
            department: employeeValues.department || props.employeeDetails?.department,
            designation: employeeValues.designation || props.employeeDetails?.designation,
            role: employeeValues.role || props.employeeDetails?.role,
            role_name: employeeValues.role || props.employeeDetails?.role,
            joiningdate: employeeValues.joiningdate || props.employeeDetails?.joiningdate,
            dateOfExit: employeeValues.dateOfExit || props.employeeDetails?.dateOfExit,
            employeeStatus:
                employeeValues.employeeStatus || props.employeeDetails?.employeeStatus || 'Active',
            workLocationName:
                employeeValues.workLocationName || props.employeeDetails?.workLocationName,
            projects: employeeValues.projects || props.employeeDetails?.projects,
            reference: employeeValues.reference || props.employeeDetails?.reference,
            company: employeeValues.company || props.employeeDetails?.company || 'Ensar',
            manager: employeeValues.manager || props.employeeDetails?.manager,
            managerEmail: employeeValues.managerEmail || props.employeeDetails?.managerEmail,

            // Contact Information
            address: employeeValues.address || props.employeeDetails?.address,
            city: employeeValues.city || props.employeeDetails?.city,
            state: employeeValues.state || props.employeeDetails?.state,
            country: employeeValues.country || props.employeeDetails?.country || 'India',
            zipcode: employeeValues.zipCode || props.employeeDetails?.zipcode,
            permenantAddress:
                employeeValues.permenantAddress || props.employeeDetails?.permanentAddress,
            emergencyContactNumber:
                employeeValues.emergencyContactNumber ||
                props.employeeDetails?.emergencyContactNumber,

            // Additional Details
            panNumber: employeeValues.panNumber || props.employeeDetails?.panNumber,
            aadharNumber: employeeValues.aadharNumber || props.employeeDetails?.aadharNumber,
            nameAsPerAadhar:
                employeeValues.nameAsPerAadhar || props.employeeDetails?.nameAsPerAadhar,

            // Bank Details
            accountNumber: employeeValues.accountNumber || props.employeeDetails?.accountNumber,
            ifscCode: employeeValues.ifscCode || props.employeeDetails?.ifscCode,
            bankName: employeeValues.bankName || props.employeeDetails?.bankName,

            // Document Lists
            aadharPanDocuments:
                employeeValues.adhaarOrPancard || props.employeeDetails?.aadharPanDocuments || [],
            passbookChequeDocuments:
                employeeValues.passbookOrCheque ||
                props.employeeDetails?.passbookChequeDocuments ||
                [],
            payslipsDocuments:
                employeeValues.payslipFiles || props.employeeDetails?.payslipsDocuments || [],

            // Experience Details
            hasExperience: employeeValues.hasExperience || props.employeeDetails?.hasExperience,
            isFresher: employeeValues.hasExperience ? false : true,
            employeeExperience: Array.isArray(employeeValues.employeeExperience)
                ? employeeValues.employeeExperience
                : [
                      employeeValues.employeeExperience ||
                          props.employeeDetails?.employeeExperience ||
                          {}
                  ],

            // Preserve existing values
            disabled: false,
            imageurl: props.employeeDetails?.imageurl,
            password: props.employeeDetails?.password,
            confirmpassword: props.employeeDetails?.confirmpassword
        };

        const formData = new FormData();
        formData.append(
            'userrequest',
            new Blob([JSON.stringify(employeeObj)], { type: 'application/json' })
        );

        // Handle file uploads
        if (employeeValues.adhaarOrPancard && Array.isArray(employeeValues.adhaarOrPancard)) {
            employeeValues.adhaarOrPancard.forEach((file) => {
                if (file instanceof Blob) {
                    formData.append('adhaarOrPancard', file);
                }
            });
        }

        if (employeeValues.passbookOrCheque && Array.isArray(employeeValues.passbookOrCheque)) {
            employeeValues.passbookOrCheque.forEach((file) => {
                if (file instanceof Blob) {
                    formData.append('passbookOrCheque', file);
                }
            });
        }

        if (employeeValues.payslipFiles && Array.isArray(employeeValues.payslipFiles)) {
            employeeValues.payslipFiles.forEach((file) => {
                if (file instanceof Blob) {
                    formData.append('payslipFiles', file);
                }
            });
        }

        try {
            console.log('Before PUT Request', employeeObj);
            const response = await axios.put('/api/v1/user/users/', formData, _cancelToken);

            if (response.status === 200) {
                alert('Employee updated successfully');
                history.push('/employees');
            }
        } catch (error) {
            console.error('Error:', error.message || error);
            alert('Error updating employee. Please try again.');
        }
    };
    // Clear employee values
    const ClearedValues = () => {
        setEmployeeValues({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            number: '',
            joiningdate: '',
            gender: '',
            employeeDateOfBirth: '',
            phone: '',
            reference: '',
            department: '',
            designation: '',
            role: '',
            manager: '',
            employeeType: '',
            maritalStatus: '',
            employeeStatus: '',
            projects: [],
            bloodGroup: '',
            managerEmail: '',
            dateOfExit: '',
            workEmail: '',
            workLocationName: '',
            fatherName: '',
            motherName: '',
            emergencyContactNumber: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            company: '',
            country: '',
            permanentAddress: '',
            panNumber: '',
            aadhaarNumber: '',
            nameAsPerAadhaar: ''
        });
    };

    // Close modal and clear values
    const handleCloseModal = () => {
        setErrors({});
        props.handleClose();
        ClearedValues();
    };

    // Close dialog
    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    // Handle PDF download
    const handleDownload = () => {
        generatePDF(submittedData, true);
        setDialogOpen(false);
    };

    // Define options
    const role = ['ADMIN', 'EMPLOYEE', 'MANAGER', 'USER', 'Hr', 'ANONYMOUS'];
    const EmployeeType = ['PartTime', 'FullTime'];
    const MaritalStatus = ['Yes', 'No'];
    const Gender = ['Male', 'Female', 'Others'];
    const BloodGroups = ['A +', 'A -', 'B +', 'B -', 'O +', 'O -', 'AB +', 'AB -'];
    const EmployeeStatus = [
        'Initiated',
        'Pending',
        'Active',
        'On Leave',
        'Hold',
        'Resigned',
        'Terminated',
        'Retired',
        'Contract Ended',
        'Inactive'
    ];

    // Determine selected country and filter states
    const selectedCountry = props.countries?.find(
        (country) => country.name === employeeValues.country
    );
    const selectedCountryId = selectedCountry ? selectedCountry.country_id : null;

    // Filter states based on the selected country_id
    const filteredStates =
        props.states && selectedCountryId
            ? props.states.filter((state) => state.country_id === selectedCountryId)
            : [];

    return (
        <>
            <Modal
                aria-labelledby='spring-modal-title'
                aria-describedby='spring-modal-description'
                open={props.open}
                onClose={handleCloseModal}
                closeAfterTransition
                BackdropComponent={props.Backdrop}
                BackdropProps={{
                    timeout: 500
                }}
            >
                <Box component='form' sx={style} noValidate autoComplete='off'>
                    <AppBar
                        position='static'
                        sx={{ width: 700, height: 60, backgroundcolor: ' #DEECF4' }}
                    >
                        <CardHeader
                            title={props.method === 'add' ? 'Add Employee' : 'Edit Employee'}
                        ></CardHeader>
                        <IconButton
                            sx={{
                                position: 'absolute',
                                display: 'flex',
                                justifyContent: 'flex-end',
                                marginLeft: '650px',
                                marginTop: '10px',
                                color: '#0070AC'
                            }}
                            onClick={handleCloseModal}
                        >
                            <HighlightOffIcon />
                        </IconButton>
                    </AppBar>
                    <Card sx={{ minWidth: 500, boxShadow: 0, height: 400, overflow: 'auto' }}>
                        <CardContent>
                            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                {(props.ispersonalinfo ||
                                    (!props.isemployeeinfo &&
                                        !props.isotherinfo &&
                                        !props.ispersonalinfo)) && (
                                    <Grid item xs={6}>
                                        <TextField
                                            sx={{ minWidth: 320, marginBottom: '15px' }}
                                            required
                                            id='firstName'
                                            name='firstName'
                                            label='First Name'
                                            error={!!errors.firstName}
                                            helperText={errors.firstName || ''}
                                            value={employeeValues.firstName}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                )}
                                {(props.ispersonalinfo ||
                                    (!props.isemployeeinfo &&
                                        !props.isotherinfo &&
                                        !props.ispersonalinfo)) && (
                                    <Grid item xs={6}>
                                        <TextField
                                            sx={{ minWidth: 320, marginBottom: '15px' }}
                                            required
                                            id='lastName'
                                            name='lastName'
                                            label='Last Name'
                                            error={!!errors.lastName}
                                            helperText={errors.lastName}
                                            value={employeeValues.lastName}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                )}
                                {(props.ispersonalinfo ||
                                    (!props.isemployeeinfo &&
                                        !props.isotherinfo &&
                                        !props.ispersonalinfo)) && (
                                    <Grid item xs={6}>
                                        <TextField
                                            sx={{ minWidth: 320, marginBottom: '15px' }}
                                            required
                                            id='email'
                                            name='email'
                                            label='Email'
                                            type='email'
                                            value={employeeValues.email}
                                            onChange={handleChange}
                                            error={!!errors.email}
                                            helperText={errors.email}
                                            InputProps={{
                                                readOnly: props.method === 'edit' ? true : false,
                                                style: {
                                                    backgroundColor:
                                                        props.method === 'edit'
                                                            ? '#e8e8e8'
                                                            : 'inherit'
                                                }
                                            }}
                                        />
                                    </Grid>
                                )}
                                {props.method === 'add' ? (
                                    <Grid item xs={6}>
                                        <TextField
                                            sx={{ minWidth: 320, marginBottom: '15px' }}
                                            required
                                            id='password'
                                            name='password'
                                            label='Password'
                                            type='password'
                                            autoComplete='current-password'
                                            defaultValue={props.employeeDetails?.password}
                                            onChange={handleChange}
                                            error={!!errors.password}
                                            helperText={errors.password}
                                        />
                                    </Grid>
                                ) : null}
                                {(props.isemployeeinfo ||
                                    (!props.isemployeeinfo &&
                                        !props.isotherinfo &&
                                        !props.ispersonalinfo)) && (
                                    <Grid item xs={6}>
                                        <TextField
                                            sx={{ minWidth: 320, marginBottom: '15px' }}
                                            required
                                            id='number'
                                            name='number'
                                            label='Employee Id'
                                            error={!!errors.number}
                                            helperText={errors.number}
                                            defaultValue={props.employeeDetails?.employeeid}
                                            onChange={handleChange}
                                            InputProps={{
                                                readOnly: props.method === 'edit' ? true : false,
                                                style: {
                                                    backgroundColor:
                                                        props.method === 'edit'
                                                            ? '#e8e8e8'
                                                            : 'inherit'
                                                }
                                            }}
                                        />
                                    </Grid>
                                )}
                                {(props.ispersonalinfo ||
                                    (!props.isemployeeinfo &&
                                        !props.isotherinfo &&
                                        !props.ispersonalinfo)) && (
                                    <Grid item xs={6}>
                                        <TextField
                                            sx={{ minWidth: 320, marginBottom: '15px' }}
                                            required
                                            id='employeeDateOfBirth'
                                            name='employeeDateOfBirth'
                                            className='datetype'
                                            label='Employee Date of Birth'
                                            type='date'
                                            error={!!errors.employeeDateOfBirth}
                                            helperText={errors.employeeDateOfBirth}
                                            defaultValue={
                                                props.method === 'edit' &&
                                                moment(
                                                    props.employeeDetails?.employeeDateOfBirth
                                                ).format('YYYY-MM-DD')
                                            }
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                )}

                                {(props.ispersonalinfo ||
                                    (!props.isemployeeinfo &&
                                        !props.isotherinfo &&
                                        !props.ispersonalinfo)) && (
                                    <Grid item xs={6}>
                                        {' '}
                                        <TextField
                                            sx={{ minWidth: 320, marginBottom: '15px' }}
                                            required
                                            id='phone'
                                            name='phone'
                                            label='Phone'
                                            error={!!errors.phone}
                                            helperText={errors.phone}
                                            value={employeeValues.phone}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                )}
                                {(props.ispersonalinfo ||
                                    (!props.isemployeeinfo &&
                                        !props.isotherinfo &&
                                        !props.ispersonalinfo)) && (
                                    <Grid item xs={6}>
                                        <TextField
                                            select
                                            sx={{ minWidth: 320, marginBottom: '15px' }}
                                            required
                                            id='gender'
                                            name='gender'
                                            label='Gender'
                                            error={!!errors.gender}
                                            helperText={errors.gender}
                                            value={employeeValues.gender}
                                            onChange={handleChange}
                                            SelectProps={{ native: true }}
                                        >
                                            <option value='' />

                                            {Gender.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </TextField>
                                    </Grid>
                                )}

                                {(props.ispersonalinfo ||
                                    (!props.isemployeeinfo &&
                                        !props.isotherinfo &&
                                        !props.ispersonalinfo)) && (
                                    <Grid item xs={6}>
                                        <Autocomplete
                                            sx={{ minWidth: 320, marginBottom: '15px' }}
                                            required
                                            id='bloodGroup'
                                            name='bloodGroup'
                                            options={BloodGroups}
                                            defaultValue={props.employeeDetails?.bloodGroup}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    required
                                                    label='Blood Group'
                                                    error={!!errors.bloodGroup}
                                                    helperText={errors.bloodGroup}
                                                />
                                            )}
                                            onChange={(event, value) => {
                                                setEmployeeValues((prevValues) => ({
                                                    ...prevValues,
                                                    bloodGroup: value
                                                }));
                                                setErrors({ ...errors, bloodGroup: '' });
                                            }}
                                        />
                                    </Grid>
                                )}
                                {(props.ispersonalinfo ||
                                    (!props.isemployeeinfo &&
                                        !props.isotherinfo &&
                                        !props.ispersonalinfo)) && (
                                    <Grid item xs={6}>
                                        <Autocomplete
                                            sx={{ minWidth: 320, marginBottom: '15px' }}
                                            required
                                            id='maritalStatus'
                                            name='maritalStatus'
                                            options={MaritalStatus}
                                            defaultValue={props.employeeDetails?.maritalStatus}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    required
                                                    label='Marital Status'
                                                    error={!!errors.maritalStatus}
                                                    helperText={errors.maritalStatus}
                                                />
                                            )}
                                            onChange={(event, value) => {
                                                setEmployeeValues((prevValues) => ({
                                                    ...prevValues,
                                                    maritalStatus: value
                                                }));
                                                setErrors({ ...errors, maritalStatus: '' });
                                            }}
                                        />
                                    </Grid>
                                )}
                                {(props.isotherinfo ||
                                    (!props.isemployeeinfo &&
                                        !props.isotherinfo &&
                                        !props.ispersonalinfo)) && (
                                    <Grid item xs={6}>
                                        <TextField
                                            sx={{ minWidth: 320, marginBottom: '15px' }}
                                            required
                                            id='fatherName'
                                            name='fatherName'
                                            label='Father Name'
                                            error={!!errors.fatherName}
                                            helperText={errors.fatherName}
                                            value={employeeValues.fatherName}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                )}
                                {(props.isotherinfo ||
                                    (!props.isemployeeinfo &&
                                        !props.isotherinfo &&
                                        !props.ispersonalinfo)) && (
                                    <Grid item xs={6}>
                                        <TextField
                                            sx={{ minWidth: 320, marginBottom: '15px' }}
                                            required
                                            id='motherName'
                                            name='motherName'
                                            label='Mother Name'
                                            error={!!errors.motherName}
                                            helperText={errors.motherName}
                                            value={employeeValues.motherName}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                )}
                                {(props.isemployeeinfo ||
                                    (!props.isemployeeinfo &&
                                        !props.isotherinfo &&
                                        !props.ispersonalinfo)) && (
                                    <Grid item xs={6}>
                                        {' '}
                                        <TextField
                                            sx={{ minWidth: 320, marginBottom: '15px' }}
                                            required
                                            id='reference'
                                            name='reference'
                                            label='Reference'
                                            error={!!errors.reference}
                                            helperText={errors.reference}
                                            value={employeeValues.reference}
                                            onChange={handleChange}
                                        ></TextField>
                                    </Grid>
                                )}
                                {(props.isemployeeinfo ||
                                    (!props.isemployeeinfo &&
                                        !props.isotherinfo &&
                                        !props.ispersonalinfo)) && (
                                    <Grid item xs={6}>
                                        <Autocomplete
                                            sx={{ minWidth: 320, marginBottom: '15px' }}
                                            required
                                            id='Emp Type'
                                            name='Emp Type'
                                            options={EmployeeType}
                                            defaultValue={props.employeeDetails?.employeeType}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    required
                                                    label='Emp Type'
                                                    error={!!errors.employeeType}
                                                    helperText={errors.employeeType}
                                                />
                                            )}
                                            onChange={(event, value) => {
                                                setEmployeeValues((prevValues) => ({
                                                    ...prevValues,
                                                    employeeType: value
                                                }));
                                                setErrors({ ...errors, employeeType: '' });
                                            }}
                                        />
                                    </Grid>
                                )}
                                {(props.ispersonalinfo ||
                                    (!props.isemployeeinfo &&
                                        !props.isotherinfo &&
                                        !props.ispersonalinfo)) && (
                                    <Grid item xs={6}>
                                        <Autocomplete
                                            sx={{ minWidth: 320, marginBottom: '15px' }}
                                            required
                                            id='employeeStatus'
                                            name='employeeStatus'
                                            options={EmployeeStatus}
                                            defaultValue={props.employeeDetails?.employeeStatus}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    required
                                                    label='Employee Status'
                                                    error={!!errors.employeeStatus}
                                                    helperText={errors.employeeStatus}
                                                />
                                            )}
                                            onChange={(event, value) => {
                                                setEmployeeValues((prevValues) => ({
                                                    ...prevValues,
                                                    employeeStatus: value
                                                }));
                                                setErrors({ ...errors, employeeStatus: '' });
                                            }}
                                        />
                                    </Grid>
                                )}
                                {(props.isemployeeinfo ||
                                    (!props.isemployeeinfo &&
                                        !props.isotherinfo &&
                                        !props.ispersonalinfo)) && (
                                    <Grid item xs={6}>
                                        <TextField
                                            sx={{ minWidth: 320, marginBottom: '15px' }}
                                            required
                                            id='workEmail'
                                            name='workEmail'
                                            label='Work Email'
                                            type='email'
                                            value={employeeValues.workEmail}
                                            onChange={handleChange}
                                            error={!!errors.workEmail}
                                            helperText={errors.workEmail}
                                            InputProps={{
                                                readOnly: props.method === 'edit' ? true : false,
                                                style: {
                                                    backgroundColor:
                                                        props.method === 'edit'
                                                            ? '#e8e8e8'
                                                            : 'inherit'
                                                }
                                            }}
                                        />
                                    </Grid>
                                )}
                                {(props.isemployeeinfo ||
                                    (!props.isemployeeinfo &&
                                        !props.isotherinfo &&
                                        !props.ispersonalinfo)) && (
                                    <Grid item xs={6}>
                                        {' '}
                                        <TextField
                                            sx={{ minWidth: 320, marginBottom: '15px' }}
                                            required
                                            id='company'
                                            name='company'
                                            label='Company'
                                            error={!!errors.company}
                                            helperText={errors.company}
                                            value={employeeValues.company}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                )}
                                {(props.isemployeeinfo ||
                                    (!props.isemployeeinfo &&
                                        !props.isotherinfo &&
                                        !props.ispersonalinfo)) && (
                                    <Grid item xs={6}>
                                        {' '}
                                        <TextField
                                            sx={{ minWidth: 320, marginBottom: '15px' }}
                                            required
                                            id='workLocationName'
                                            name='workLocationName'
                                            label='Work Location Name'
                                            error={!!errors.workLocationName}
                                            helperText={errors.workLocationName}
                                            value={employeeValues.workLocationName}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                )}

                                {(props.isemployeeinfo ||
                                    (!props.isemployeeinfo &&
                                        !props.isotherinfo &&
                                        !props.ispersonalinfo)) && (
                                    <Grid item xs={6}>
                                        {' '}
                                        <TextField
                                            select
                                            sx={{ minWidth: 320, marginBottom: '15px' }}
                                            required
                                            id='department'
                                            name='department'
                                            label='Department'
                                            error={!!errors.department}
                                            helperText={errors.department}
                                            value={employeeValues.department}
                                            SelectProps={{ native: true }}
                                            onChange={handleChange}
                                        >
                                            <option value=''></option>
                                            {props.departments &&
                                                props.departments.map((option) => (
                                                    <option
                                                        key={option.id}
                                                        value={option.departmentname}
                                                    >
                                                        {option.departmentname}
                                                    </option>
                                                ))}
                                        </TextField>
                                    </Grid>
                                )}
                                {(props.ispersonalinfo ||
                                    (!props.isemployeeinfo &&
                                        !props.isotherinfo &&
                                        !props.ispersonalinfo)) && (
                                    <Grid item xs={6}>
                                        <TextField
                                            select
                                            sx={{ minWidth: 320, marginBottom: '15px' }}
                                            required
                                            id='designation'
                                            name='designation'
                                            label='Designation'
                                            error={!!errors.designation}
                                            helperText={errors.designation}
                                            value={employeeValues.designation}
                                            SelectProps={{ native: true }}
                                            onChange={handleChange}
                                        >
                                            <option value=''></option>

                                            {props.designations &&
                                                props.designations.map((option) => (
                                                    <option
                                                        key={option.id}
                                                        value={option.designation}
                                                    >
                                                        {option.designation}
                                                    </option>
                                                ))}
                                        </TextField>
                                    </Grid>
                                )}
                                {!props.isemployeeinfo && !props.isotherinfo && (
                                    <Grid item xs={6}>
                                        <TextField
                                            select
                                            sx={{ minWidth: 320, marginBottom: '15px' }}
                                            required
                                            id='role'
                                            name='role'
                                            label='Role'
                                            error={!!errors.role}
                                            helperText={errors.role}
                                            value={employeeValues.role}
                                            onChange={handleChange}
                                            SelectProps={{ native: true }}
                                        >
                                            <option value='' />

                                            {role.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </TextField>
                                    </Grid>
                                )}
                                {(props.isemployeeinfo ||
                                    (!props.isemployeeinfo &&
                                        !props.isotherinfo &&
                                        !props.ispersonalinfo)) && (
                                    <Grid item xs={6}>
                                        <Autocomplete
                                            options={employeeNames}
                                            getOptionLabel={(option) => option.label}
                                            id='manager'
                                            name='manager'
                                            defaultValue={
                                                props.employeeDetails?.manager
                                                    ? {
                                                          label: props.employeeDetails.manager
                                                      }
                                                    : null
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    id='manager'
                                                    name='manager'
                                                    label='Reporting To'
                                                    error={!!errors.manager}
                                                    helperText={errors.manager}
                                                />
                                            )}
                                            onChange={(event, value) => {
                                                setEmployeeValues((prevValues) => ({
                                                    ...prevValues,
                                                    manager: value ? value.label : '',
                                                    managerEmail: value ? value.managerEmail : ''
                                                }));

                                                setErrors({ ...errors, manager: '' });
                                            }}
                                        />
                                    </Grid>
                                )}

                                {(props.isemployeeinfo ||
                                    (!props.isemployeeinfo &&
                                        !props.isotherinfo &&
                                        !props.ispersonalinfo)) && (
                                    <Grid item xs={6}>
                                        <Autocomplete
                                            multiple
                                            sx={{ minWidth: 320, marginBottom: '15px' }}
                                            required
                                            options={projectNames}
                                            getOptionLabel={(option) => option}
                                            id='Projects'
                                            name='Projects'
                                            defaultValue={
                                                props.method === 'edit' &&
                                                props.employeeDetails?.projects
                                                    ? props.employeeDetails?.projects.split(', ')
                                                    : []
                                            }
                                            onChange={(event, value) =>
                                                handleChange({
                                                    target: { name: 'Projects', value }
                                                })
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label='Projects'
                                                    error={!!errors.projects}
                                                    helperText={errors.projects}
                                                />
                                            )}
                                        />
                                    </Grid>
                                )}
                                {(props.ispersonalinfo ||
                                    (!props.isemployeeinfo &&
                                        !props.isotherinfo &&
                                        !props.ispersonalinfo)) && (
                                    <Grid item xs={6}>
                                        <TextField
                                            sx={{ minWidth: 320, marginBottom: '15px' }}
                                            required
                                            id='joiningdate'
                                            name='joiningdate'
                                            className='datetype'
                                            label='Joining Date'
                                            type='date'
                                            error={!!errors.joiningdate}
                                            helperText={errors.joiningdate}
                                            defaultValue={
                                                props.method === 'edit' &&
                                                moment(props.employeeDetails?.joiningdate).format(
                                                    'YYYY-MM-DD'
                                                )
                                            }
                                            InputLabelProps={{
                                                shrink: true // This makes sure the label "Joining Date" stays as the label
                                            }}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                )}

                                {(props.ispersonalinfo ||
                                    (!props.isemployeeinfo &&
                                        !props.isotherinfo &&
                                        !props.ispersonalinfo)) && (
                                    <Grid item xs={6}>
                                        {' '}
                                        <TextField
                                            sx={{ minWidth: 320, marginBottom: '15px' }}
                                            required
                                            id='address'
                                            name='address'
                                            label='Present Address'
                                            error={!!errors.address}
                                            helperText={errors.address}
                                            value={employeeValues.address}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                )}
                                {(props.isotherinfo ||
                                    (!props.isemployeeinfo &&
                                        !props.isotherinfo &&
                                        !props.ispersonalinfo)) && (
                                    <Grid item xs={6}>
                                        {/* Dropdown for selecting a country */}
                                        <TextField
                                            select
                                            sx={{ minWidth: 320, marginBottom: '15px' }}
                                            required
                                            id='country'
                                            name='country'
                                            label='Country'
                                            error={!!errors.country}
                                            helperText={errors.country}
                                            value={employeeValues.country}
                                            SelectProps={{ native: true }}
                                            onChange={handleChange}
                                        >
                                            <option value=''></option>
                                            {props.countries &&
                                                props.countries.map((option) => (
                                                    <option
                                                        key={option.country_id}
                                                        value={option.name}
                                                    >
                                                        {option.name}
                                                    </option>
                                                ))}
                                        </TextField>
                                    </Grid>
                                )}

                                {(props.isotherinfo ||
                                    (!props.isemployeeinfo &&
                                        !props.isotherinfo &&
                                        !props.ispersonalinfo)) && (
                                    <Grid item xs={6}>
                                        {/* Dropdown for selecting a state, filtered by selected country */}
                                        <TextField
                                            select
                                            sx={{ minWidth: 320, marginBottom: '15px' }}
                                            required
                                            id='state'
                                            name='state'
                                            label='State'
                                            error={!!errors.state}
                                            helperText={errors.state}
                                            value={employeeValues.state}
                                            SelectProps={{ native: true }}
                                            onChange={handleChange}
                                        >
                                            <option value=''></option>
                                            {filteredStates.map((option) => (
                                                <option key={option.state_id} value={option.name}>
                                                    {option.name}
                                                </option>
                                            ))}
                                        </TextField>
                                    </Grid>
                                )}
                                {(props.isotherinfo ||
                                    (!props.isemployeeinfo &&
                                        !props.isotherinfo &&
                                        !props.ispersonalinfo)) && (
                                    <Grid item xs={6}>
                                        {' '}
                                        <TextField
                                            sx={{ minWidth: 320, marginBottom: '15px' }}
                                            required
                                            id='city'
                                            name='city'
                                            label='City'
                                            error={!!errors.city}
                                            helperText={errors.city}
                                            value={employeeValues.city}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                )}

                                {(props.isotherinfo ||
                                    (!props.isemployeeinfo &&
                                        !props.isotherinfo &&
                                        !props.ispersonalinfo)) && (
                                    <Grid item xs={6}>
                                        {' '}
                                        <TextField
                                            sx={{ minWidth: 320, marginBottom: '15px' }}
                                            required
                                            id='zipCode'
                                            name='zipCode'
                                            label='Zip Code'
                                            error={!!errors.zipCode}
                                            helperText={errors.zipCode}
                                            value={employeeValues.zipCode}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                )}
                                {(props.isotherinfo ||
                                    (!props.isemployeeinfo &&
                                        !props.isotherinfo &&
                                        !props.ispersonalinfo)) && (
                                    <Grid item xs={6}>
                                        {' '}
                                        <TextField
                                            sx={{ minWidth: 320, marginBottom: '15px' }}
                                            required
                                            id='permanentAddress'
                                            name='permanentAddress'
                                            label='Permanent Address'
                                            error={!!errors.permanentAddress}
                                            helperText={errors.permanentAddress}
                                            value={employeeValues.permanentAddress}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                )}
                                {(props.isotherinfo ||
                                    (!props.isemployeeinfo &&
                                        !props.isotherinfo &&
                                        !props.ispersonalinfo)) && (
                                    <Grid item xs={6}>
                                        {' '}
                                        <TextField
                                            sx={{ minWidth: 320, marginBottom: '15px' }}
                                            required
                                            id='emergencyContactNumber'
                                            name='emergencyContactNumber'
                                            label='Emergency Contact Number'
                                            error={!!errors.emergencyContactNumber}
                                            helperText={errors.emergencyContactNumber}
                                            value={employeeValues.emergencyContactNumber}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                )}
                                {(props.isotherinfo ||
                                    (!props.isemployeeinfo &&
                                        !props.isotherinfo &&
                                        !props.ispersonalinfo)) && (
                                    <Grid item xs={6}>
                                        {' '}
                                        <TextField
                                            sx={{ minWidth: 320, marginBottom: '15px' }}
                                            required
                                            id='panNumber'
                                            name='panNumber'
                                            label='PAN Number'
                                            error={!!errors.panNumber}
                                            helperText={errors.panNumber}
                                            value={employeeValues.panNumber}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                )}
                                {(props.isotherinfo ||
                                    (!props.isemployeeinfo &&
                                        !props.isotherinfo &&
                                        !props.ispersonalinfo)) && (
                                    <Grid item xs={6}>
                                        {' '}
                                        <TextField
                                            sx={{ minWidth: 320, marginBottom: '15px' }}
                                            required
                                            id='aadhaarNumber'
                                            name='aadhaarNumber'
                                            label='Aadhar Number'
                                            error={!!errors.aadhaarNumber}
                                            helperText={errors.aadhaarNumber}
                                            value={employeeValues.aadhaarNumber}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                )}
                                {(props.isotherinfo ||
                                    (!props.isemployeeinfo &&
                                        !props.isotherinfo &&
                                        !props.ispersonalinfo)) && (
                                    <Grid item xs={6}>
                                        <TextField
                                            sx={{ minWidth: 320, marginBottom: '15px' }}
                                            required
                                            id='nameAsPerAadhaar'
                                            name='nameAsPerAadhaar'
                                            label='Name as per Aadhar'
                                            error={!!errors.nameAsPerAadhaar}
                                            helperText={errors.nameAsPerAadhaar || ''}
                                            value={employeeValues.nameAsPerAadhaar}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                )}
                                {(props.ispersonalinfo ||
                                    (!props.isemployeeinfo &&
                                        !props.isotherinfo &&
                                        !props.ispersonalinfo)) && (
                                    <Grid item xs={6}>
                                        <TextField
                                            sx={{ minWidth: 320, marginBottom: '15px' }}
                                            id='dateOfExit'
                                            name='dateOfExit'
                                            label='Date of Exit'
                                            className='datetype'
                                            type='date'
                                            error={!!errors.dateOfExit}
                                            helperText={errors.dateOfExit}
                                            defaultValue={
                                                props.method === 'edit' &&
                                                moment(props.employeeDetails?.dateOfExit).format(
                                                    'YYYY-MM-DD'
                                                )
                                            }
                                            InputLabelProps={{
                                                shrink: true // This makes sure the label "Joining Date" stays as the label
                                            }}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                )}
                            </Grid>
                        </CardContent>
                    </Card>

                    <Button
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
                        onClick={() => {
                            handleSubmit();
                        }}
                        disabled={isLoading}
                    >
                        {props.method === 'add' ? (
                            isLoading ? (
                                <>
                                    <CircularProgress
                                        size={20}
                                        color='inherit'
                                        style={{ backgroundColor: '#0070ac', marginRight: '8px' }}
                                    />
                                    Sending Email...
                                </>
                            ) : (
                                'Submit'
                            )
                        ) : (
                            'Submit'
                        )}
                    </Button>

                    <Button
                        sx={{
                            marginTop: '10px',
                            float: 'right',
                            marginRight: '20px',
                            marginBottom: '20px',
                            borderRadius: '40px',
                            backgroundColor: '#d3f0ff',
                            color: '#0070ac',
                            border: '1px solid #0070ac',
                            '&:hover': {
                                backgroundColor: '#0070ac',
                                color: '#fff'
                            },
                            '&:disabled': {
                                backgroundColor: '#d3f0ff',
                                color: '#0070ac'
                            }
                        }}
                        variant='contained'
                        onClick={() => handleCloseModal()}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                </Box>
            </Modal>

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Success</DialogTitle>
                <DialogContent>
                    <DialogContentText>The form has been successfully submitted.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDownload} color='primary'>
                        Download PDF
                    </Button>
                    <Button onClick={handleDialogClose} color='primary'>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
