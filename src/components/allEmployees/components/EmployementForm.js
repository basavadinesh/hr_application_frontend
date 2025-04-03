import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    CircularProgress
} from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

import PersonalDetails from './OnboardingForm/PersonalDetails';
import EmploymentInformation from './OnboardingForm/EmploymentInformation';
import Experience from './OnboardingForm/Experience';
import EducationDetails from './OnboardingForm/EducationDetails';
import BankDetails from './OnboardingForm/BankDetails';
import ContactInformation from './OnboardingForm/ContactInformation';
import FamilyInformation from './OnboardingForm/FamilyInformation';

import { createEmployees, updateEmployees, getEmployees } from '../actions/employee-actions';
import { getProjects } from '../../projects/actions/project-action';
import { manageError } from '../../core/actions/common-actions';
import AppUtils from '../../core/helpers/app-utils';
import { AppConfigProps } from '../../core/settings/app-config';
import generatePDF from './GeneratePdf';
import { useLocation } from 'react-router-dom';
import SLUGS from 'resources/slugs';
import EmployeePreview from './EmployeePreview';
const textFieldStyle = {
    width: '100%',
    marginBottom: '24px',
    paddingRight: '16px',
    '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: '#e0e0e0' },
        '&:hover fieldset': { borderColor: '#0070ac' },
        '&.Mui-focused fieldset': { borderColor: '#0070ac' }
    }
};

export default function EmploymentForm() {
    const location = useLocation();
    const [state, setState] = useState({});
    const {
        open,
        handleClose,
        Backdrop,
        method,
        employeeDetails,
        designations,
        departments,
        countries,
        states,
        activeEditCard,
        manager
    } = location.state || state;
    const props = {
        open,
        handleClose,
        Backdrop,
        method,
        employeeDetails,
        designations,
        departments,
        activeEditCard,
        countries,
        states,
        manager
    };

    const _axiosSource = axios.CancelToken.source();
    const _cancelToken = { cancelToken: _axiosSource.token };
    const history = useHistory();

    // State management
    const [employeeEmails, setEmployeeEmails] = useState([]);
    const [employeeIds, setEmployeeIds] = useState([]);
    const [employeeNames, setEmployeeNames] = useState([]);
    const [projectNames, setProjectNames] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [dialogOpen, setDialogOpen] = useState(false);
    const [submittedData, setSubmittedData] = useState({});
    const [aadharPanFiles, setAadharPanFiles] = useState([]);
    const [passbookFiles, setPassbookFiles] = useState([]);
    const [payslipFiles, setPayslipFiles] = useState([]);
    const [removedFiles, setRemovedFiles] = useState([]);
    const [aadharPanFilesToDelete, setAadharPanFilesToDelete] = useState([]);
    const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);

    const [employeeValues, setEmployeeValues] = useState({
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
        permenantAddress: props.employeeDetails?.permanentAddress || '',
        panNumber: props.employeeDetails?.panNumber || '',
        aadharNumber: props.employeeDetails?.aadharNumber || '',
        nameAsPerAadhar: props.employeeDetails?.nameAsPerAadhar || '',
        contactNumber: props.employeeDetails?.contactNumber || '',
        experienceDesignation: props.employeeDetails?.experienceDesignation || '',
        // adhaarOrPancard: props.employeeDetails?.aadharPanDocuments || [],
        adhaarOrPancard: [],
        payslipFiles: [],
        educationFiles: [],
        passbookOrCheque: [],
        // Experience fields
        isFresher: props.employeeDetails?.isFresher ?? null,
        hasExperience: props.employeeDetails?.hasExperience ?? null,
        employeeExperience: props.employeeDetails?.employeeExperience || [],
        previousCompany: props.employeeDetails?.employeeExperience?.[0]?.previousCompany || '',
        experienceDesignation:
            props.employeeDetails?.employeeExperience?.[0]?.experienceDesignation || '',
        reportingManager: props.employeeDetails?.employeeExperience?.[0]?.reportingManager || '',
        startDate: props.employeeDetails?.employeeExperience?.[0]?.startDate || '',
        endDate: props.employeeDetails?.employeeExperience?.[0]?.endDate || '',
        uanNumber: props.employeeDetails?.employeeExperience?.[0]?.uanNumber || '',

        educational: props.employeeDetails?.educationList
            ? [...props.employeeDetails.educationList]
            : [],

        specification: props.employeeDetails?.specification || '',
        institution: props.employeeDetails?.institution || '',
        eduStartYear: props.employeeDetails?.eduStartYear || '',
        eduEndYear: props.employeeDetails?.eduEndYear || '',
        gpa: props.employeeDetails?.gpa || '',
        // Bank fields
        accountNumber: props.employeeDetails?.accountNumber || '',
        ifscCode: props.employeeDetails?.ifscCode || '',
        bankName: props.employeeDetails?.bankName || '',
        // Married status fields
        spouseName: props.employeeDetails?.spouseName || '',
        spouseAadharNumber: props.employeeDetails?.spouseAadharNumber || '',
        numberOfKids: props.employeeDetails?.numberOfKids || 0,
        kids: props.employeeDetails?.childrenDetails
            ? [...props.employeeDetails.childrenDetails]
            : []
    });

    useEffect(() => {
        loadPageData();
        loadPageDataProjectNames();
        setErrors({});
        setState({});
        const stateData = JSON.parse(localStorage.getItem('employmentFormState'));
        if (stateData) {
            setState(stateData);
            localStorage.removeItem('employmentFormState');
        }

        return () => {
            _axiosSource.cancel('Component unmounted');
        };
    }, []);
    const handleCancel = () => {
        if (activeEditCard === 'AllEmployees') {
            history.push('/employees');
        } else {
            history.push(`/employee/${props.employeeDetails.id}`);
        }
    };
    // Load employee data
    const loadPageData = async () => {
        try {
            const res = await getEmployees();
            if (res?.status === AppConfigProps.httpStatusCode.ok && res.data) {
                const employeeData = res.data.filter((employee) => !employee.disabled);
                setEmployeeNames(
                    employeeData.map((employee) => ({
                        label: employee.fullname,
                        value: employee.imageurl?.trim() || 'default-avatar-url',
                        managerEmail: employee.email
                    }))
                );
                setEmployeeEmails(res.data.map((employee) => employee.email));
                setEmployeeIds(res.data.map((employee) => employee.employeeid));
            } else {
                await manageError(res, history);
            }
        } catch (err) {
            await manageError(err, history);
        }
    };

    // Load project data
    const loadPageDataProjectNames = async () => {
        try {
            const res = await getProjects(_cancelToken);
            if (res?.status === AppConfigProps.httpStatusCode.ok && res.data) {
                setProjectNames(res.data.map((project) => project.name));
            } else {
                await manageError(res, history);
            }
        } catch (err) {
            await manageError(err, history);
        }
    };

    const handlePreviewOpen = () => {
        // Transform the current form values into the format expected by the preview component
        const previewData = {
            ...employeeValues,

            firstname: employeeValues.firstName,
            lastname: employeeValues.lastName,
            email: employeeValues.email,
            phone: employeeValues.phone,
            employeeid: employeeValues.number,

            fullname: `${employeeValues.firstName} ${employeeValues.lastName}`,
            department: employeeValues.department,
            designation: employeeValues.designation,
            joiningdate: employeeValues.joiningdate,
            employeeStatus: employeeValues.employeeStatus,
            workEmail: employeeValues.workEmail,
            workLocationName: employeeValues.workLocationName,
            projects: employeeValues.projects,
            reference: employeeValues.reference,
            role: employeeValues.role,
            company: employeeValues.company,
            childrenDetails:
                employeeValues.kids?.map((child) => ({
                    kidName: child.name || child.kidName,
                    kidGender: child.gender || child.kidGender,
                    kidDob: child.dob || child.kidDob
                })) || [],
            educationList: employeeValues.educational || [],
            employeeExperience: Array.isArray(employeeValues.employeeExperience)
                ? employeeValues.employeeExperience
                : employeeValues.employeeExperience
                ? [employeeValues.employeeExperience]
                : [],

            fathername: employeeValues.fatherName,
            mothername: employeeValues.motherName,
            emergencyContactNumber: employeeValues.emergencyContactNumber,
            address: employeeValues.address,
            permanentAddress: employeeValues.permenantAddress,
            city: employeeValues.city,
            state: employeeValues.state,
            country: employeeValues.country,
            zipcode: employeeValues.zipCode,
            accountNumber: employeeValues.accountNumber,
            ifscCode: employeeValues.ifscCode,
            bankName: employeeValues.bankName,
            panNumber: employeeValues.panNumber,
            aadharNumber: employeeValues.aadharNumber,
            nameAsPerAadhar: employeeValues.nameAsPerAadhar
        };
        setSelectedEmployeeDetails(previewData);
        setPreviewOpen(true);
    };

    const handlePreviewClose = () => {
        setPreviewOpen(false);
        setSelectedEmployeeDetails(null);
    };
    // Validation logic
    const validate = () => {
        let isValid = true;
        const newErrors = {};

        // Required fields validation
        const requiredFields = [
            'firstName',
            'lastName',
            'email',
            'phone',
            'gender',
            'employeeDateOfBirth',
            'bloodGroup',
            'employeeType',
            'department',
            'designation',
            'role',
            'number',
            'joiningdate',
            ...(props.method === 'add' ? ['password'] : []),
            'aadharNumber',
            'nameAsPerAadhar',
            'panNumber',
            'workEmail',
            'projects',
            'employeeStatus',
            'company',
            'workLocationName',
            'reference'
        ];

        requiredFields.forEach((field) => {
            if (!employeeValues[field]) {
                newErrors[field] = `Please enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
                isValid = false;
            }
        });

        // Email validation
        if (employeeValues.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employeeValues.email)) {
            newErrors.email = 'Please enter a valid email address';
            isValid = false;
        }

        // Phone validation
        if (employeeValues.phone && !/^\d{10}$/.test(employeeValues.phone)) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
            isValid = false;
        }
        if (
            employeeValues.emergencyContactNumber &&
            !/^\d{10}$/.test(employeeValues.emergencyContactNumber)
        ) {
            newErrors.emergencyContactNumber =
                'Please enter a valid 10-digit emergency contact number';
            isValid = false;
        }
        if (employeeValues.contactNumber && !/^\d{10}$/.test(employeeValues.contactNumber)) {
            newErrors.contactNumber = 'Please enter a valid 10-digit contact number';
            isValid = false;
        }

        // Employee ID validation
        if (props.method === 'add' && employeeIds.includes(employeeValues.number)) {
            newErrors.number = 'This employee ID already exists';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Handle form submission
    const handleSubmit = async () => {
        try {
            if (!validate()) {
                return;
            }
            setLoading(true);
            if (props.method === 'add') {
                await addEmployee();
            } else if (props.method === 'edit') {
                await employeeUpdate();
            }
        } catch (error) {
            console.error('Error in handleSubmit:', error);
            await manageError(error, history);
        } finally {
            setLoading(false);
        }
    };

    const addEmployee = async () => {
        const formatDate = (date) => {
            return date ? moment(date).format('MM/DD/YYYY') : null;
        };

        if (!validate()) {
            console.log('Validation failed');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();

            // Define userRequestData first
            const userRequestData = {
                // Personal Details
                firstname: employeeValues.firstName,
                lastname: employeeValues.lastName,
                fullname: `${employeeValues.firstName} ${employeeValues.lastName}`,
                email: employeeValues.email,
                workEmail:
                    employeeValues.workEmail ||
                    `${employeeValues.firstName.toLowerCase()}@ensarsolutions.com`,
                password: employeeValues.password,
                phone: employeeValues.phone,
                contactNumber: employeeValues.contactNumber,
                gender: employeeValues.gender,
                employeeDateOfBirth: formatDate(employeeValues.employeeDateOfBirth),
                bloodGroup: employeeValues.bloodGroup,
                maritalStatus: employeeValues.maritalStatus,

                // Employment Details
                employeeid: employeeValues.number,
                employeeType: employeeValues.employeeType,
                department: employeeValues.department,
                designation: employeeValues.designation,
                role: employeeValues.role,
                role_name: employeeValues.role || 'EMPLOYEE',
                joiningdate: formatDate(employeeValues.joiningdate),
                dateOfExit: formatDate(employeeValues.dateOfExit),
                employeeStatus: employeeValues.employeeStatus || 'Active',
                workLocationName: employeeValues.workLocationName,
                projects: employeeValues.projects,
                reference: employeeValues.reference,
                company: employeeValues.company || 'Ensar',
                manager: employeeValues.manager,
                managerEmail: employeeValues.managerEmail,

                // Contact Information
                address: employeeValues.address,
                city: employeeValues.city,
                state: employeeValues.state,
                country: employeeValues.country || 'India',
                zipcode: employeeValues.zipCode,
                permenantAddress: employeeValues.permenantAddress,
                emergencyContactNumber: employeeValues.emergencyContactNumber,

                // Document Information
                panNumber: employeeValues.panNumber,
                aadharNumber: employeeValues.aadharNumber,
                nameAsPerAadhar: employeeValues.nameAsPerAadhar,
                username: employeeValues.firstName.toLowerCase(),
                disabled: '0',

                // Bank Details
                accountNumber: employeeValues.accountNumber,
                ifscCode: employeeValues.ifscCode,
                bankName: employeeValues.bankName,

                // Family Information
                fatherName: employeeValues.fatherName,
                motherName: employeeValues.motherName,
                spouseName: employeeValues.spouseName,
                spouseAadharNumber: employeeValues.spouseAadharNumber,
                numberOfKids: Number(employeeValues.kids?.length) || 0,

                // Marital Status Details
                childrenDetails:
                    employeeValues.kids?.map((child) => ({
                        kidName: child.name,
                        kidGender: child.gender,
                        kidDob: formatDate(child.dob)
                    })) || [],

                // Experience Details
                hasExperience: Boolean(employeeValues.hasExperience),
                isFresher: employeeValues.hasExperience ? false : true,
                employeeExperience: [
                    {
                        ...employeeValues.employeeExperience,
                        startDate: formatDate(employeeValues.employeeExperience.startDate),
                        endDate: formatDate(employeeValues.employeeExperience.endDate)
                    }
                ],
                // Educational Details
                educationalDetails:
                    employeeValues.educational?.map((edu) => ({
                        education: edu.education,
                        specification: edu.specification,
                        institution: edu.institution,
                        startyear: formatDate(edu.eduStartYear),
                        endyear: formatDate(edu.eduEndYear),
                        gpa: edu.gpa,
                        documents: edu.educationFiles?.map((doc) => ({
                            filename: doc instanceof File ? doc.name : doc,
                            filepath:
                                doc instanceof File ? `path/to/${doc.name}` : `path/to/${doc}`,
                            documenttype: 'education'
                        }))
                    })) || []
            };
            // Append userRequestData to formData
            formData.append(
                'userrequest',
                new Blob([JSON.stringify(userRequestData)], {
                    type: 'application/json'
                })
            );

            // Add file data
            if (employeeValues.adhaarOrPancard && employeeValues.adhaarOrPancard.length > 0) {
                for (let i = 0; i < employeeValues.adhaarOrPancard.length; i++) {
                    formData.append('adhaarOrPancard', employeeValues.adhaarOrPancard[i]);
                }
            }

            if (employeeValues.passbookOrCheque && employeeValues.passbookOrCheque.length > 0) {
                for (let i = 0; i < employeeValues.passbookOrCheque.length; i++) {
                    formData.append('passbookOrCheque', employeeValues.passbookOrCheque[i]);
                }
            }

            if (employeeValues.payslipFiles && employeeValues.payslipFiles.length > 0) {
                for (let i = 0; i < employeeValues.payslipFiles.length; i++) {
                    formData.append('payslipFiles', employeeValues.payslipFiles[i]);
                }
            }

            // Make the API call
            const res = await axios.post('/api/v1/user/users', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res?.status === AppConfigProps.httpStatusCode.ok && res.data) {
                setDialogOpen(true);
                setSubmittedData(res.data);
                if (props.onSuccess) {
                    props.onSuccess();
                }
            } else {
                await manageError(res, history);
            }
        } catch (err) {
            console.error('Form submission error:', err);
            await manageError(err, history);
        } finally {
            setLoading(false);
        }
    };

    const employeeUpdate = async () => {
        const _axiosSource = axios.CancelToken.source();
        const _cancelToken = { cancelToken: _axiosSource.token };

        const formatDate = (date) => {
            return date ? moment(date).format('MM/DD/YYYY') : null;
        };
        console.log('Validate', validate());
        try {
            if (!validate()) {
                return;
            }

            setLoading(true);

            // Prepare the exact request payload matching the server's expected format
            const userRequestData = {
                // Personal Details
                userId: props.employeeDetails.id,
                firstname: employeeValues.firstName,
                lastname: employeeValues.lastName,
                fullname: `${employeeValues.firstName} ${employeeValues.lastName}`,
                email: employeeValues.email,
                workEmail: employeeValues.workEmail,
                phone: employeeValues.phone,
                contactNumber: employeeValues.contactNumber,
                gender: employeeValues.gender,
                employeeDateOfBirth: formatDate(employeeValues.employeeDateOfBirth),
                bloodGroup: employeeValues.bloodGroup,
                maritalStatus: employeeValues.maritalStatus,
                username: employeeValues.firstName.toLowerCase(),

                // Family Details - Keep existing data if not modified
                fatherName: employeeValues.fatherName || props.employeeDetails.fathername,
                motherName: employeeValues.motherName || props.employeeDetails.mothername,
                spouseName: employeeValues.spouseName || props.employeeDetails.spouseName || '',
                spouseAadharNumber:
                    employeeValues.spouseAadharNumber ||
                    props.employeeDetails.spouseAadharNumber ||
                    '',
                numberOfKids: employeeValues.kids?.length || 0,
                childrenDetails:
                    employeeValues.kids?.map((child) => ({
                        id: child.id,
                        kidName: child.name || child.kidName,
                        kidGender: child.gender || child.kidGender,
                        kidDob: formatDate(child.dob || child.kidDob)
                    })) ||
                    props.employeeDetails.childrenDetails ||
                    [],

                // Employment Details
                employeeid: employeeValues.number,
                employeeType: employeeValues.employeeType,
                department: employeeValues.department,
                designation: employeeValues.designation,
                role: employeeValues.role,
                role_name: employeeValues.role,
                joiningdate: formatDate(employeeValues.joiningdate),
                dateOfExit: formatDate(employeeValues.dateOfExit),
                employeeStatus: employeeValues.employeeStatus || 'Active',
                workLocationName: employeeValues.workLocationName,
                projects: employeeValues.projects,
                reference: employeeValues.reference,
                company: employeeValues.company || 'Ensar',
                manager: employeeValues.manager,
                managerEmail: employeeValues.managerEmail,

                // Experience Details
                hasExperience: employeeValues.hasExperience ?? false,
                isFresher: employeeValues.hasExperience ? false : true,
                employeeExperience: employeeValues.hasExperience
                    ? Array.isArray(employeeValues.employeeExperience)
                        ? employeeValues.employeeExperience.map((exp) => ({
                              ...exp,
                              startDate: exp.startDate ? formatDate(exp.startDate) : '',
                              endDate: exp.endDate ? formatDate(exp.endDate) : ''
                          }))
                        : employeeValues.employeeExperience
                        ? [
                              {
                                  ...employeeValues.employeeExperience,
                                  startDate: employeeValues.employeeExperience.startDate
                                      ? formatDate(employeeValues.employeeExperience.startDate)
                                      : '',
                                  endDate: employeeValues.employeeExperience.endDate
                                      ? formatDate(employeeValues.employeeExperience.endDate)
                                      : ''
                              }
                          ]
                        : []
                    : [],
                // Contact Information
                address: employeeValues.address,
                city: employeeValues.city,
                state: employeeValues.state,
                country: employeeValues.country || 'India',
                zipcode: employeeValues.zipCode,
                permenantAddress:
                    employeeValues.permenantAddress || props.employeeDetails.permanentAddress,
                emergencyContactNumber: employeeValues.emergencyContactNumber,

                // Additional Details
                panNumber: employeeValues.panNumber,
                aadharNumber: employeeValues.aadharNumber,
                nameAsPerAadhar: employeeValues.nameAsPerAadhar,

                // Bank Details
                accountNumber: employeeValues.accountNumber,
                ifscCode: employeeValues.ifscCode,
                bankName: employeeValues.bankName,

                // Education List - Preserve existing education data
                // educationalList:
                //     employeeValues.educational?.map((edu) => ({
                //         education: edu.education,
                //         specification: edu.specification,
                //         institution: edu.institution,
                //         startyear: formatDate(edu.eduStartYear),
                //         endyear: formatDate(edu.eduEndYear),
                //         gpa: edu.gpa
                //     })) ||
                //     props.employeeDetails.educationList ||
                //     [],
                educationalDetails:
                    employeeValues.educational?.map((edu) => ({
                        education: edu.education,
                        specification: edu.specification,
                        institution: edu.institution,
                        startyear: formatDate(edu.eduStartYear),
                        endyear: formatDate(edu.eduEndYear),
                        gpa: edu.gpa,
                        documents: edu.educationFiles?.map((doc) => ({
                            filename: doc instanceof File ? doc.name : doc,
                            filepath:
                                doc instanceof File ? `path/to/${doc.name}` : `path/to/${doc}`,
                            documenttype: 'education'
                        }))
                    })) || [],

                // Document Lists - Preserve existing document data
                aadharPanDocuments:
                    employeeValues.adhaarOrPancard ||
                    props.employeeDetails.aadharPanDocuments ||
                    [],
                passbookChequeDocuments:
                    employeeValues.passbookOrCheque ||
                    props.employeeDetails.passbookChequeDocuments ||
                    [],
                payslipsDocuments:
                    employeeValues.payslipFiles || props.employeeDetails.payslipsDocuments || [],

                // Preserve existing values
                disabled: false,
                password: props.employeeDetails.password,
                confirmpassword: props.employeeDetails.confirmpassword,
                aadharPanFilesToDelete: aadharPanFilesToDelete
            };
            console.log('userrequested', userRequestData);
            // Create a FormData object
            const formData = new FormData();

            formData.append(
                'userrequest',
                new Blob([JSON.stringify(userRequestData)], { type: 'application/json' })
            );

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
            // Append removed files
            formData.append(
                'removedFiles',
                new Blob([JSON.stringify(removedFiles)], { type: 'application/json' })
            );
            const response = await axios.put('/api/v1/user/users/', formData, _cancelToken);

            if (response.status === 200) {
                alert('Employee updated successfully');

                if (props.activeEditCard === 'AllEmployees') {
                    history.push('/employees');
                } else {
                    history.push(`/employee/${props.employeeDetails.id}`);
                }
            }
        } catch (error) {
            console.error('Error:', error.message || error);
            alert('Error updating employee. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle input changes
    const handleChange = (event) => {
        const { name, value } = event.target;

        // Log the field name and value to debug
        console.log('name:', name, 'value:', value);

        // Handle 'joiningdate' or other fields differently
        // if (name === 'joiningdate') {
        //     const dateFormat = AppUtils.getDateEmployeeFormat(value);
        //     setEmployeeValues((prev) => ({ ...prev, [name]: dateFormat }));
        // } else {
        //     setEmployeeValues((prev) => ({ ...prev, [name]: value }));
        // }

        setEmployeeValues((prev) => ({ ...prev, [name]: value }));
        // Log the updated employee values

        // Validate the field
        validateField(name, value);
    };

    // Field validation
    const validateField = (name, value) => {
        const newErrors = { ...errors };

        switch (name) {
            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    newErrors[name] = 'Please enter a valid email address';
                } else {
                    delete newErrors[name];
                }
                break;
            case 'phone':
                if (!/^\d{10}$/.test(value)) {
                    newErrors[name] = 'Please enter a valid 10-digit phone number';
                } else {
                    delete newErrors[name];
                }
                break;
            case 'emergencyContactNumber':
                if (!/^\d{10}$/.test(value)) {
                    newErrors[name] = 'Please enter a valid 10-digit phone number';
                } else {
                    delete newErrors[name];
                }
                break;
            case 'contactNumber':
                if (!/^\d{10}$/.test(value)) {
                    newErrors[name] = 'Please enter a valid 10-digit phone number';
                } else {
                    delete newErrors[name];
                }
                break;
            // Add other field validations as needed
            default:
                if (!value && name !== 'dateOfExit') {
                    newErrors[name] = `Please enter ${name
                        .replace(/([A-Z])/g, ' $1')
                        .toLowerCase()}`;
                } else {
                    delete newErrors[name];
                }
        }

        setErrors(newErrors);
    };

    // Handle file uploads
    const handleFileUpload = (type, files) => {
        const fileArray = Array.from(files);
        switch (type) {
            case 'adhaarOrPancard':
                setAadharPanFiles((prevFiles) => [...prevFiles, ...fileArray]);
                break;
            case 'passbookOrCheque':
                setPassbookFiles((prevFiles) => [...prevFiles, ...fileArray]);
                break;
            case 'payslipFiles':
                setPayslipFiles((prevFiles) => [...prevFiles, ...fileArray]);
                break;
            default:
                break;
        }
    };

    // Dialog handlers
    const handleDialogClose = () => {
        setDialogOpen(false);
        history.push(SLUGS.employees);
    };

    const handleDownload = () => {
        generatePDF(submittedData, true);
        setDialogOpen(false);
        history.push(SLUGS.employees);
    };

    // if (!state) {
    //     return <CircularProgress size={20} color='inherit' sx={{ mr: 1 }} />;
    // }

    return (
        <Box sx={{ maxWidth: '1100px', margin: '0 auto', p: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 'bold', marginBottom: '32px' }}>
                {props.method === 'add' ? 'Add Employee' : 'Edit Employee'}
            </Typography>
            {props.activeEditCard === 'employee_details_personal' ? (
                <>
                    <Typography
                        variant='h6'
                        sx={{ fontWeight: 'bold', marginBottom: '16px' }}
                    ></Typography>
                    <PersonalDetails
                        employeeValues={employeeValues}
                        setEmployeeValues={setEmployeeValues}
                        handleChange={handleChange}
                        textFieldStyle={textFieldStyle}
                        props={props}
                        errors={errors}
                        handleFileUpload={handleFileUpload}
                    />
                </>
            ) : (
                props.activeEditCard === 'AllEmployees' && (
                    <>
                        <Typography
                            variant='h6'
                            sx={{ fontWeight: 'bold', marginBottom: '16px' }}
                        ></Typography>
                        <PersonalDetails
                            employeeValues={employeeValues}
                            setEmployeeValues={setEmployeeValues}
                            handleChange={handleChange}
                            textFieldStyle={textFieldStyle}
                            props={props}
                            errors={errors}
                            handleFileUpload={handleFileUpload}
                        />
                    </>
                )
            )}
            {props.activeEditCard === 'employee_details_employment' ? (
                <>
                    <Typography
                        variant='h6'
                        sx={{ fontWeight: 'bold', marginBottom: '16px', mt: 4 }}
                    ></Typography>
                    <EmploymentInformation
                        employeeValues={employeeValues}
                        setEmployeeValues={setEmployeeValues}
                        handleChange={handleChange}
                        textFieldStyle={textFieldStyle}
                        errors={errors}
                        setErrors={setErrors}
                        props={props}
                        employeeNames={employeeNames}
                        projectNames={projectNames}
                        departments={props.departments}
                        designations={props.designations}
                        managers={props.manager}
                    />
                </>
            ) : (
                props.activeEditCard === 'AllEmployees' && (
                    <>
                        <Typography
                            variant='h6'
                            sx={{ fontWeight: 'bold', marginBottom: '16px', mt: 4 }}
                        ></Typography>
                        <EmploymentInformation
                            employeeValues={employeeValues}
                            setEmployeeValues={setEmployeeValues}
                            handleChange={handleChange}
                            textFieldStyle={textFieldStyle}
                            errors={errors}
                            setErrors={setErrors}
                            props={props}
                            employeeNames={employeeNames}
                            projectNames={projectNames}
                            departments={props.departments}
                            designations={props.designations}
                            managers={props.manager}
                        />
                    </>
                )
            )}
            {props.activeEditCard === 'employee_details_experience' ? (
                <>
                    <Typography
                        variant='h6'
                        sx={{ fontWeight: 'bold', marginBottom: '16px', mt: 4 }}
                    ></Typography>
                    <Experience
                        employeeValues={employeeValues}
                        setEmployeeValues={setEmployeeValues}
                        handleChange={handleChange}
                        textFieldStyle={textFieldStyle}
                        props={props}
                        errors={errors}
                        handleFileUpload={handleFileUpload}
                    />
                </>
            ) : (
                props.activeEditCard === 'AllEmployees' && (
                    <>
                        <Typography
                            variant='h6'
                            sx={{ fontWeight: 'bold', marginBottom: '16px', mt: 4 }}
                        ></Typography>
                        <Experience
                            employeeValues={employeeValues}
                            setEmployeeValues={setEmployeeValues}
                            handleChange={handleChange}
                            textFieldStyle={textFieldStyle}
                            props={props}
                            errors={errors}
                            handleFileUpload={handleFileUpload}
                        />
                    </>
                )
            )}
            {props.activeEditCard === 'employee_details_education' ? (
                <>
                    {' '}
                    <Typography
                        variant='h6'
                        sx={{ fontWeight: 'bold', marginBottom: '16px', mt: 4 }}
                    ></Typography>
                    <EducationDetails
                        employeeValues={employeeValues}
                        setEmployeeValues={setEmployeeValues}
                        handleChange={handleChange}
                        textFieldStyle={textFieldStyle}
                        props={props}
                        errors={errors}
                        handleFileUpload={handleFileUpload}
                    />
                </>
            ) : (
                props.activeEditCard === 'AllEmployees' && (
                    <>
                        <Typography
                            variant='h6'
                            sx={{ fontWeight: 'bold', marginBottom: '16px', mt: 4 }}
                        ></Typography>
                        <EducationDetails
                            employeeValues={employeeValues}
                            setEmployeeValues={setEmployeeValues}
                            handleChange={handleChange}
                            textFieldStyle={textFieldStyle}
                            props={props}
                            errors={errors}
                            handleFileUpload={handleFileUpload}
                        />
                    </>
                )
            )}

            {props.activeEditCard === 'employee_details_bank' ? (
                <>
                    {' '}
                    <Typography
                        variant='h6'
                        sx={{ fontWeight: 'bold', marginBottom: '16px', mt: 4 }}
                    >
                        Bank Details
                    </Typography>
                    <BankDetails
                        employeeValues={employeeValues}
                        setEmployeeValues={setEmployeeValues}
                        handleChange={handleChange}
                        textFieldStyle={textFieldStyle}
                        errors={errors}
                        handleFileUpload={handleFileUpload}
                        method={props.method}
                        employeeDetails={props.employeeDetails}
                    />
                </>
            ) : (
                props.activeEditCard === 'AllEmployees' && (
                    <>
                        <Typography
                            variant='h6'
                            sx={{ fontWeight: 'bold', marginBottom: '16px', mt: 4 }}
                        ></Typography>
                        <BankDetails
                            employeeValues={employeeValues}
                            setEmployeeValues={setEmployeeValues}
                            handleChange={handleChange}
                            textFieldStyle={textFieldStyle}
                            errors={errors}
                            handleFileUpload={handleFileUpload}
                            method={props.method}
                            employeeDetails={props.employeeDetails}
                        />
                    </>
                )
            )}
            {props.activeEditCard === 'employee_details_other' ? (
                <>
                    <Typography
                        variant='h6'
                        sx={{ fontWeight: 'bold', marginBottom: '16px', mt: 4 }}
                    ></Typography>
                    <ContactInformation
                        employeeValues={employeeValues}
                        setEmployeeValues={setEmployeeValues}
                        handleChange={handleChange}
                        textFieldStyle={textFieldStyle}
                        errors={errors}
                        countries={props.countries}
                        states={props.states}
                        isEditMode={props.method === 'edit'}
                        employeeDetails={props.employeeDetails}
                    />
                </>
            ) : (
                props.activeEditCard === 'AllEmployees' && (
                    <>
                        <Typography
                            variant='h6'
                            sx={{ fontWeight: 'bold', marginBottom: '16px', mt: 4 }}
                        ></Typography>
                        <ContactInformation
                            employeeValues={employeeValues}
                            setEmployeeValues={setEmployeeValues}
                            handleChange={handleChange}
                            textFieldStyle={textFieldStyle}
                            errors={errors}
                            countries={props.countries}
                            states={props.states}
                            isEditMode={props.method === 'edit'}
                            employeeDetails={props.employeeDetails}
                        />
                    </>
                )
            )}
            {props.activeEditCard === 'employee_details_family' ? (
                <>
                    {' '}
                    <Typography
                        variant='h6'
                        sx={{ fontWeight: 'bold', marginBottom: '16px', mt: 4 }}
                    ></Typography>
                    <FamilyInformation
                        employeeValues={employeeValues}
                        setEmployeeValues={setEmployeeValues}
                        handleChange={handleChange}
                        props={props}
                        textFieldStyle={textFieldStyle}
                        errors={errors}
                        isEditMode={props.method === 'edit'}
                    />
                </>
            ) : (
                props.activeEditCard === 'AllEmployees' && (
                    <>
                        <Typography
                            variant='h6'
                            sx={{ fontWeight: 'bold', marginBottom: '16px', mt: 4 }}
                        ></Typography>
                        <FamilyInformation
                            employeeValues={employeeValues}
                            setEmployeeValues={setEmployeeValues}
                            handleChange={handleChange}
                            props={props}
                            textFieldStyle={textFieldStyle}
                            errors={errors}
                            isEditMode={props.method === 'edit'}
                        />
                    </>
                )
            )}

            {/* Submit and Cancel Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
                {/* Cancel Button */}
                {!isLoading && (
                    <Button
                        variant='outlined'
                        onClick={handleCancel}
                        disabled={isLoading}
                        sx={{
                            borderRadius: '20px',
                            borderColor: '#0070ac',
                            color: '#0070ac',
                            px: 4,
                            py: 1,
                            '&:hover': {
                                borderColor: '#005580',
                                backgroundColor: '#f5f5f5'
                            }
                        }}
                    >
                        Cancel
                    </Button>
                )}
                {/* Preview Button */}
                {/* //here */}
                {!isLoading && activeEditCard === 'AllEmployees' && (
                    <Button
                        variant='contained'
                        onClick={handlePreviewOpen}
                        sx={{
                            borderRadius: '20px',
                            backgroundColor: '#6c757d',
                            px: 4,
                            py: 1,
                            '&:hover': {
                                backgroundColor: '#5a6268'
                            }
                        }}
                    >
                        Preview
                    </Button>
                )}
                {/* Submit Button */}
                <Button
                    variant='contained'
                    onClick={handleSubmit}
                    disabled={isLoading}
                    sx={{
                        borderRadius: '20px',
                        backgroundColor: '#0070ac',
                        px: 4,
                        py: 1,
                        '&:hover': {
                            backgroundColor: '#005580'
                        }
                    }}
                >
                    {isLoading ? (
                        <>
                            <CircularProgress size={20} color='inherit' sx={{ mr: 1 }} />
                            {props.method === 'add' ? 'Sending Email...' : 'Updating...'}
                        </>
                    ) : (
                        'Submit'
                    )}
                </Button>
            </Box>
            {/* Employee Preview */}
            <EmployeePreview
                open={previewOpen}
                handleClose={handlePreviewClose}
                Backdrop={Backdrop}
                employeeDetails={selectedEmployeeDetails}
            />
            {/* Success Dialog */}
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Success</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Employee has been successfully{' '}
                        {props.method === 'add' ? 'added' : 'updated'}.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {props.method === 'add' && (
                        <Button onClick={handleDownload} color='primary'>
                            Download PDF
                        </Button>
                    )}
                    <Button onClick={handleDialogClose} color='primary'>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
