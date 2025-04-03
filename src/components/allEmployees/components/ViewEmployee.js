// Imports for rendering and routing
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

// Imports for Design
import { Card, CardContent, Typography, Grid, Avatar, Box, Tabs, Tab, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Backdrop from '@mui/material/Backdrop';

// Imports for displaying employee related information
import ProjectsListCard from './EmployeeTabs/ProjectsDetailsCard';
import { ProjectInformationCard } from './EmployeeTabs/ProjectsDetailsCard';
import EducationListCard from './EmployeeTabs/EducationDetailsCard';
import { EducationInformationCard } from './EmployeeTabs/EducationDetailsCard';
import AssetsListCard from './EmployeeTabs/AssetsDetailsCard';
import LettersListCard from './EmployeeTabs/LettersListCard';
import { AssetsInformationCard } from './EmployeeTabs/AssetsDetailsCard';
import {
    LeaveHistory,
    UpcomingLeaves,
    LeaveMetrics,
    LeaveHistoryDetails
} from './EmployeeTabs/LeavesDetailsCard';

// Imports for configuration settings and constants
import AppUtils from '../../core/helpers/app-utils';
import { AppConfigProps } from '../../core/settings/app-config';

// Imports for making api calls and using custom api hooks
import axios from 'axios';
import { getDesignations } from '../../designations/actions/designation-actions';
import { getDepartments } from 'components/departments/actions/department-actions';
import { getCountries } from '../actions/employee-actions';
import { getStates, getEmployees } from '../actions/employee-actions';
import { manageError } from '../../core/actions/common-actions';

//Other component imports
import AddEmployee from './AddEmployee';
import SkillsListCard, { SkillsInformationCard } from './EmployeeTabs/SkillsDetailsCard';
import { LearningInformationCard, LearningListCard } from './EmployeeTabs/LearningsDetailsCard';
import { RelievingInfoCard } from './EmployeeTabs/RelievingInfoCard';
import { LettersInformationCard } from './EmployeeTabs/LettersListCard';
import { FamilyInformationCard } from './EmployeeTabs/FamilyInformationCard';
import { EmployeeExperienceCard } from './EmployeeTabs/EmployeeExperienceCard';
import SLUGS from 'resources/slugs';
import DownloadIcon from '@mui/icons-material/Download';
import DownloadFilesModal from 'components/educations/components/DownloadFilesModal ';

// Theme Settings such as fonts and colors
const pastelColors = {
    blue: '#AEDFF7',
    black: '#000',
    white: '#ffffff'
};

const propertyStyles = (color) => ({
    fontWeight: 'bold',
    color: color,
    width: '150px',
    fontSize: '18px',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    whiteSpace: 'nowrap'
});

const cardStyles = (backgroundColor) => ({
    borderWidth: 2,
    borderStyle: 'solid',
    boxShadow: 3,
    borderRadius: 2,
    borderColor: backgroundColor,
    backgroundColor: `${backgroundColor}20`,
    padding: '12px',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
});

// Component Definition
const ViewEmployee = () => {
    // Authorization and Routing Constants definitions
    const { userId } = useParams();
    const _axiosSource = axios.CancelToken.source();
    const _cancelToken = { cancelToken: _axiosSource.token };
    const history = useHistory();
    const userRole = JSON.parse(localStorage.getItem('userData'));

    //State Management Constants for Tabs and Modals
    const [activeTab, setActiveTab] = useState('Employee');
    const [open, setOpen] = React.useState(false);

    //State Management Constants for Employees/Users and related details
    const [employeeDetails, setEmployeeDetails] = useState(null);
    const [relievingDetails, setRelievingDetails] = useState(null);
    const [familyDetails, setFamilyDetails] = useState(null);
    // const [familyDetails, setFamilyDeatils] = useState(null);
    const [designations, setDesignations] = useState(null);
    const [departments, setDepartments] = useState(null);
    const [countries, setCountries] = useState(null);
    const [states, setStates] = useState(null);

    //State Management Constants for Assets,Projects,Leaves,Skills,Education and Learning
    const [projectsList, setProjectsList] = useState([]);
    const [assetDetails, setAssetDetails] = useState([]);
    const [leaveData, setLeaveData] = useState([]);
    const [educationDetails, setEducationDetails] = useState([]);
    const [skillsDetails, setSkillsDetails] = useState([]);
    const [learningsDetails, setLearningsDetails] = useState([]);

    //State Management Constants for sending appropriate props to AddEmployee component
    const [isempinfo, setisempinfo] = useState(false);
    const [isotherinfo, setisotherinfo] = useState(false);
    const [ispersonalinfo, setispersonalinfo] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState(null);

    //State Management Constants for sending appropriate pops to AssetDetailsComponent
    const [upcomingLeaves, setUpcomingLeaves] = useState([]);
    const [leaveCounts, setLeaveCounts] = useState({ sick: 0, lop: 0, casual: 0 });
    const [initialRender, setInitialRender] = useState(true);

    //State Management Constants for controlling useEffect rendering
    const [projectsFetched, setProjectsFetched] = useState(false);

    //State Management Constants for displaying details based on the selected item
    const [selectedAsset, setSelectedAsset] = useState(assetDetails[assetDetails.length - 1]);
    const [selectedProject, setSelectedProject] = useState(projectsList[projectsList.length - 1]);
    const [selectedLeave, setSelectedLeave] = useState(leaveData[leaveData.length - 1]);
    const [selectedEducation, setSelectedEducation] = useState(
        educationDetails[educationDetails.length - 1]
    );
    const [selectedSkill, setSelectedSkill] = useState(skillsDetails[skillsDetails.length - 1]);
    const [selectedLearning, setSelectedLearning] = useState(
        learningsDetails[learningsDetails.length - 1]
    );
    const [selectedLetter, setSelectedLetter] = useState('');
    const [leaveAllowances, setLeaveAllowances] = useState({});
    const [isbankinfo, setisbankinfo] = useState(false);
    const [isfamilyinfo, setfamilyinfo] = useState(false);
    const [isexperienceinfo, setisexperienceinfo] = useState(false);
    const [employees, setEmployees] = useState(null);
    const [filterCriteria, setFilterCriteria] = useState('active');
    const [activeCount, setActiveCount] = useState(0);
    const [inactiveCount, setInactiveCount] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [documents, setDocuments] = useState([]);
    const handleShowModal = (docs) => {
        console.log('DocumentType', docs);
        setDocuments(docs || []);
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
    };

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

    const isSignedUrlValid = (timestamp) => {
        const currentTime = new Date().getTime();
        return currentTime - timestamp < 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    };

    const currentYear = new Date().getFullYear(); // Get the current year
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

    const fetchLeaveAllowances = async () => {
        try {
            const response = await axios.get(`/api/v1/leave-allowances/year/${currentYear}`); // Use currentYear for the API call
            const data = response.data;

            setLeaveAllowances({
                totalSickLeaves: data.sickLeave,
                totalLopLeaves: data.lopLeave,
                totalCasualLeaves: data.casualLeave
            });
            // Total Number of Leaves available to each employee
        } catch (error) {
            console.error('Error fetching leave allowances', error);
            // Optionally handle the error, e.g., set default values or show a notification
            setLeaveAllowances({
                totalSickLeaves: 0,
                totalLopLeaves: 0,
                totalCasualLeaves: 0
            });
        }
    };

    // Fetch leave allowances when the component mounts
    useEffect(() => {
        fetchLeaveAllowances();
    }, []);

    //Handler Functions to manage Modal Open and Close Actions.
    const handlePersonalInfoOpen = (event) => {
        history.push(SLUGS.employementform, {
            open: true,
            method: 'edit',
            employeeDetails: employeeDetails,
            designations,
            departments,
            activeEditCard: 'employee_details_personal',
            countries,
            states,
            manager: employees
        });
    };

    const handleEmpInfoOpen = (event) => {
        history.push(SLUGS.employementform, {
            open: true,
            method: 'edit',
            employeeDetails: employeeDetails,
            designations,
            departments,
            activeEditCard: 'employee_details_employment',
            countries,
            states,
            manager: employees
        });
    };

    const handleOtherInfoOpen = (event) => {
        history.push(SLUGS.employementform, {
            open: true,
            method: 'edit',
            employeeDetails: employeeDetails,
            designations,
            departments,
            activeEditCard: 'employee_details_other',
            countries,
            states,
            manager: employees
        });
    };
    const handleBankInfoOpen = (event) => {
        history.push(SLUGS.employementform, {
            open: true,
            method: 'edit',
            employeeDetails: employeeDetails,
            designations,
            departments,
            activeEditCard: 'employee_details_bank',
            countries,
            states,
            manager: employees
        });
    };
    const handleFamilyInfoOpen = (event) => {
        history.push(SLUGS.employementform, {
            open: true,
            method: 'edit',
            employeeDetails: employeeDetails,
            designations,
            departments,
            activeEditCard: 'employee_details_family',
            countries,
            states,
            manager: employees
        });
    };

    const handleExperienceInfoOpen = (event) => {
        history.push(SLUGS.employementform, {
            open: true,
            method: 'edit',
            employeeDetails: {
                ...employeeDetails,
                employeeExperience: employeeDetails.employeeExperience?.[0] || {}
            },
            designations,
            departments,
            activeEditCard: 'employee_details_experience',
            countries,
            states,
            manager: employees
        });
    };

    const handleEducationInfoOpen = (event) => {
        history.push(SLUGS.employementform, {
            open: true,
            method: 'edit',
            employeeDetails: {
                ...employeeDetails,
                employeeExperience: employeeDetails.employeeExperience?.[0] || {}
            },
            designations,
            departments,
            activeEditCard: 'employee_detials_education',
            countries,
            states,
            manager: employees
        });
    };

    const handleClose = () => {
        setOpen(false);

        handlePopUpClose();
    };

    const handlePopUpClose = () => {
        fetchEmployeeDetails(userId);
    };

    //Handler Functions for tabs and item selection
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const onSelectAsset = (asset) => {
        setSelectedAsset(asset);
    };

    const onSelectProject = (project) => {
        setSelectedProject(project);
    };

    const onSelectLeave = (leave) => {
        setSelectedLeave(leave);
        setInitialRender(false);
    };

    const onSelectEducation = (education) => {
        setSelectedEducation(education);
    };

    const onSelectSkill = (skill) => {
        setSelectedSkill(skill);
    };

    const onSelectLearning = (learning) => {
        setSelectedLearning(learning);
    };
    const onSelectLetter = (letter) => {
        setSelectedLetter(letter);
    };

    const fetchRelievingDetails = async () => {
        const baseUrl = '/api/v1/user';
        const url = `${baseUrl}/relievinginfo/${userId}`;

        try {
            const response = await axios.get(url);

            setRelievingDetails(response.data);
            return response.data;
        } catch (error) {
            console.error(`Error fetching relieving details for employee ID ${userId}:`, error);
            return {};
        }
    };
    const fetchFamilyDetails = async () => {
        const baseUrl = '/api/v1/user';
        const url = `${baseUrl}/family/${userId}`;

        try {
            const response = await axios.get(url);
            setFamilyDetails(response.data);
            return response.data;
        } catch (error) {
            console.error(`Error fetching family details for employee ID ${userId}:`, error);
            return {};
        }
    };
    const fetchEmployeeDetails = async () => {
        const isSignedUrlValid = (timestamp) => {
            const currentTime = new Date().getTime();
            return currentTime - timestamp < 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        };

        try {
            const token = AppUtils.getIdentityAccessToken();
            const response = await axios.get(`http://localhost:8080/api/v1/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                cancelToken: _cancelToken.token
            });
            // Extract and handle the image URL
            const imageUrl = response.data.imageurl;

            if (!imageUrl || !imageUrl.trim()) {
                setEmployeeDetails({
                    ...response.data,
                    imageUrl:
                        'https://a0.anyrgb.com/pngimg/1140/162/user-profile-login-avatar-heroes-user-blue-icons-circle-symbol-logo.png'
                });
            } else {
                const cachedSignedUrl = localStorage.getItem(`signedUrl_${userId}`);
                const cachedTimestamp = localStorage.getItem(`signedUrlTimestamp_${userId}`);

                if (cachedSignedUrl && cachedTimestamp && isSignedUrlValid(cachedTimestamp)) {
                    setEmployeeDetails({
                        ...response.data,
                        imageUrl: cachedSignedUrl
                    });
                } else {
                    const fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);

                    const signedUrlResponse = await axios.get(
                        `${AppConfigProps.serverRoutePrefix}/generate-signed-url`,
                        { params: { filePath: fileName } }
                    );

                    if (signedUrlResponse.data && signedUrlResponse.data.signedUrl) {
                        const newSignedUrl = signedUrlResponse.data.signedUrl;
                        localStorage.setItem(`signedUrl_${userId}`, newSignedUrl);
                        localStorage.setItem(`signedUrlTimestamp_${userId}`, new Date().getTime());
                        setEmployeeDetails({
                            ...response.data,
                            imageUrl: newSignedUrl
                        });
                    }
                }
            }
            return response.data;
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled', error.message);
            } else {
                console.error('Error fetching employee details:', error);
            }
            throw error;
        }
    };

    //API call Definition for fetching Asset Details using user_id value of Assets table
    const fetchAssetsByUserId = async (userId, cancelToken) => {
        try {
            const token = AppUtils.getIdentityAccessToken();
            const response = await axios.get(`http://localhost:8080/api/v1/assets/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                cancelToken: cancelToken.token
            });

            return response.data;
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled', error.message);
            } else {
                console.error('Error fetching asset details:', error);
            }
            throw error;
        }
    };

    //API call Definition for fetching Project Details using name value in projects table
    const fetchProjectByName = async (projectName, cancelToken) => {
        try {
            const token = AppUtils.getIdentityAccessToken();
            const response = await axios.get(
                `http://localhost:8080/api/v1/projects/name/${projectName}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    cancelToken: cancelToken.token
                }
            );

            return response.data;
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled', error.message);
            } else {
                console.error('Error fetching project details:', error);
            }
            throw error;
        }
    };

    // API call definition to get leaves by user ID
    const getLeavesByUserId = async (userId, cancelToken) => {
        try {
            const token = AppUtils.getIdentityAccessToken();
            const userIdInt = parseInt(userId);
            const response = await axios.get(
                `http://localhost:8080/api/v1/leave/user/${userIdInt}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    cancelToken: cancelToken.token
                }
            );
            return response.data;
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled', error.message);
            } else {
                console.error('Error fetching leave data:', error);
            }
            throw error;
        }
    };

    const fetchEducationsByUserId = async (userId, cancelToken) => {
        try {
            const token = AppUtils.getIdentityAccessToken();
            const response = await axios.get(
                `http://localhost:8080/api/v1/educationals/user/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    cancelToken: cancelToken.token
                }
            );

            return response.data;
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled', error.message);
            } else {
                console.error('Error fetching asset details:', error);
            }
            throw error;
        }
    };

    const fetchSkillsByUserId = async (userId, cancelToken) => {
        try {
            const token = AppUtils.getIdentityAccessToken();
            const response = await axios.get(`http://localhost:8080/api/v1/skills/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                cancelToken: cancelToken.token
            });

            return response.data;
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled', error.message);
            } else {
                console.error('Error fetching asset details:', error);
            }
            throw error;
        }
    };
    const fetchLearningsByUserId = async (userId, cancelToken) => {
        try {
            const token = AppUtils.getIdentityAccessToken();
            const response = await axios.get(
                `http://localhost:8080/api/v1/learnings/user/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    cancelToken: cancelToken.token
                }
            );

            return response.data;
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled', error.message);
            } else {
                console.error('Error fetching asset details:', error);
            }
            throw error;
        }
    };

    //Function Definition to fetch Designations to send as Props to AddEmployee Component
    const getEmployeeDesignations = async () => {
        await getDesignations()
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

    //Function Definition to fetch Departments to send as Props to AddEmployee Component
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

    //Function Definition to fetch Countries to send as Props to AddEmployee Component
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

    //Function Definition to fetch States to send as Pops to AddEmployee Component
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

    //Function Definition to call Assets API call function and set the Asset Details state
    const fetchAssetsDetailsByUserId = async (userId, cancelToken) => {
        try {
            const data = await fetchAssetsByUserId(userId, cancelToken);
            setAssetDetails(data);
            setSelectedAsset(data[0]);
        } catch (error) {
            if (!axios.isCancel(error)) {
                console.error('Error fetching asset details:', error);
            }
        }
    };

    //Function Definition to call Projects API call function and set the Project Details state
    const fetchProjectDetailsByName = async (employeeDetails, cancelToken) => {
        try {
            const projects = employeeDetails.projects.split(',').map((project) => project.trim());

            if (projects.length > 1) {
                const fetchedProjectsList = [];
                for (const projectName of projects) {
                    const data = await fetchProjectByName(projectName, cancelToken);
                    fetchedProjectsList.push(data);
                }

                setProjectsList(fetchedProjectsList);
                setSelectedProject(fetchedProjectsList[0]);
            } else {
                const data = await fetchProjectByName(employeeDetails.projects.trim(), cancelToken);
                setProjectsList([data]);
                setSelectedProject(data);
            }
            setProjectsFetched(true);
        } catch (error) {
            if (!axios.isCancel(error)) {
                console.error('Error fetching project details:', error);
            }
        }
    };

    // Function Definition to call Leaves API call function and set the Leave Data
    const fetchLeaveData = async (userId, cancelToken) => {
        try {
            const data = await getLeavesByUserId(userId, cancelToken);

            const currentDate = new Date();
            const pastLeaves = data.filter((leave) => {
                const leaveStartDate = new Date(leave.from_date);
                return leaveStartDate < currentDate;
            });

            // Sort filtered leave data by from_date descending (assuming from_date is in ISO string format)
            pastLeaves.sort((a, b) => new Date(b.from_date) - new Date(a.from_date));

            if (pastLeaves.length > 0) {
                setLeaveData(data); // Set all leave data
                setSelectedLeave(pastLeaves[pastLeaves.length - 1]);
                // Selecting the latest past leave
            } else {
                setLeaveData(data); // Set empty array if no past leaves
                setSelectedLeave(null); // Set selectedLeave to null
            }
        } catch (error) {
            if (!axios.isCancel(error)) {
                console.error('Error fetching leave data:', error);
            }
        }
    };

    const fetchEducationDetailsByUserId = async (userId, cancelToken) => {
        try {
            const data = await fetchEducationsByUserId(userId, cancelToken);
            setEducationDetails(data);
            setSelectedEducation(data[0]);
        } catch (error) {
            if (!axios.isCancel(error)) {
                console.error('Error fetching asset details:', error);
            }
        }
    };

    const fetchSkillsDetailsByUserId = async (userId, cancelToken) => {
        try {
            const data = await fetchSkillsByUserId(userId, cancelToken);
            setSkillsDetails(data);
            setSelectedSkill(data[0]);
        } catch (error) {
            if (!axios.isCancel(error)) {
                console.error('Error fetching asset details:', error);
            }
        }
    };

    const fetchLearningsDetailsByUserId = async (userId, cancelToken) => {
        try {
            const data = await fetchLearningsByUserId(userId, cancelToken);
            setLearningsDetails(data);
            setSelectedLearning(data[0]);
        } catch (error) {
            if (!axios.isCancel(error)) {
                console.error('Error fetching learning details:', error);
            }
        }
    };

    //UseEffect Definition to call functions that set states during Initial Rendering
    useEffect(() => {
        fetchEmployeeDetails(userId);
        fetchRelievingDetails();
        fetchFamilyDetails();
        fetchEmployeeDetails(userId);
        getEmployeeDesignations();
        getEmployeeDepartments();
        getEmployeeCountries();
        getEmployeeStates();
        fetchAssetsDetailsByUserId(userId, _cancelToken);
        fetchEducationDetailsByUserId(userId, _cancelToken);
        fetchSkillsDetailsByUserId(userId, _cancelToken);
        fetchLearningsDetailsByUserId(userId, _cancelToken);
        fetchLeaveData(userId, _cancelToken);
    }, []);

    //UseEffect Defintion only to call fetchProjectDetailsByName based on condition and dependencies
    useEffect(() => {
        if (employeeDetails && employeeDetails.projects && !projectsFetched) {
            fetchProjectDetailsByName(employeeDetails, _cancelToken);
        }
    }, [employeeDetails, _cancelToken, projectsFetched]);

    //UseEffect Defintion only to set values that need to be sent as props to Leave Details Component
    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const upcoming = leaveData.filter((leave) => new Date(leave.from_date) > new Date());
        const counts = leaveData.reduce(
            (acc, leave) => {
                const year = new Date(leave.from_date).getFullYear();
                if (year === currentYear) {
                    if (leave.leave_type === 'SickLeave') acc.sick++;
                    if (leave.leave_type === 'Lop') acc.lop++;
                    if (leave.leave_type === 'Casual') acc.casual++;
                }
                return acc;
            },
            { sick: 0, lop: 0, casual: 0 }
        );

        setUpcomingLeaves(upcoming);
        setLeaveCounts(counts);
    }, [leaveData]);

    //Function to Manage colors based os Status value
    const getStatusColor = (status) => {
        switch (status) {
            case 'Active':
                return 'green';
            case 'Inactive':
                return 'red';
            case 'On Leave':
                return 'orange';
            default:
                return 'gray';
        }
    };

    //Displaying Loading Page till employee details are available
    if (!employeeDetails) {
        return <Typography variant='h6'>Loading...</Typography>;
    }

    //JSX to display Employee Details including Assets,Projects,Education,Skills,Leave and Learning
    return (
        <Box
        sx={{
            padding: '20px',
            '& .MuiTabs-root': {
                maxWidth: '100%',
                overflow: 'auto',
                '&::-webkit-scrollbar': {
                    height: '8px'
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: '#f1f1f1'
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#888',
                    borderRadius: '4px',
                    '&:hover': {
                        backgroundColor: '#555'
                    }
                }
            }
        }}
    >
        <Tabs
            value={activeTab}
            variant='scrollable'
            scrollButtons='auto'
            onChange={handleTabChange}
            sx={{
                '& .MuiTabs-flexContainer': {
                    flexWrap: 'nowrap'
                }
            }}
        >
                <Tab label='Employee' value='Employee' />
                <Tab label='Family Information' value='Family Information' />
                <Tab label='Experience' value='Experience' />
                <Tab label='Projects' value='Projects' />
                <Tab label='Assets' value='Assets' />
                <Tab label='Leave' value='Leave' />
                <Tab label='Education' value='Education' />
                <Tab label='Skills & Expertise' value='Skills & Expertise' />
                <Tab label='Learning' value='Learning' />
                <Tab label='Relieving Info' value='Relieving Info' />
                <Tab label='Letters' value='Letters' />
            </Tabs>
            <Grid container spacing={2} sx={{ marginTop: '20px' }}>
                {activeTab === 'Employee' && (
                    <Grid item xs={12} sm={4}>
                        <DownloadFilesModal
                            open={showModal}
                            onClose={handleCloseModal}
                            documents={documents}
                            handleDownload={handleDownload}
                        />
                        <Card
                            variant='outlined'
                            sx={{
                                ...cardStyles(pastelColors.blue),
                                maxWidth: '400px',
                                boxShadow: 3,
                                marginLeft: '10px',
                                height: '1115px'
                            }}
                        >
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Avatar
                                    alt={employeeDetails.firstname}
                                    src={
                                        employeeDetails.imageUrl ||
                                        'https://a0.anyrgb.com/pngimg/1140/162/user-profile-login-avatar-heroes-user-blue-icons-circle-symbol-logo.png'
                                    }
                                    sx={{ width: 150, height: 150, margin: '0 auto' }}
                                />

                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginTop: '10px'
                                    }}
                                >
                                    <Typography
                                        variant='h6'
                                        sx={{
                                            fontSize: '29px',
                                            maxWidth: '300px',
                                            marginRight: '10px'
                                        }}
                                    >
                                        {employeeDetails.firstname} {employeeDetails.lastname}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        textAlign: 'center'
                                    }}
                                >
                                    <Button
                                        variant=''
                                        sx={{
                                            color: '#333333',
                                            marginRight: '20px',
                                            fontSize: '12px'
                                        }}
                                        onClick={handlePersonalInfoOpen}
                                        startIcon={<EditIcon />}
                                    >
                                        Edit
                                    </Button>
                                </Box>

                                <Box
                                    sx={{
                                        textAlign: 'left',
                                        marginTop: '20px',
                                        paddingLeft: '30px',
                                        fontSize: '20px'
                                    }}
                                >
                                    <Typography
                                        variant='body1'
                                        sx={{ fontWeight: 'bold', marginTop: '10px' }}
                                    >
                                        Email
                                    </Typography>
                                    <Typography
                                        variant='body1'
                                        sx={{ color: 'blue', marginTop: '10px' }}
                                    >
                                        {employeeDetails.email}
                                    </Typography>
                                    <Typography
                                        variant='body1'
                                        sx={{ fontWeight: 'bold', marginTop: '10px' }}
                                    >
                                        Phone
                                    </Typography>
                                    <Typography variant='body1' sx={{ marginTop: '10px' }}>
                                        {employeeDetails.phone}
                                    </Typography>

                                    <Typography
                                        variant='body1'
                                        sx={{ fontWeight: 'bold', marginTop: '10px' }}
                                    >
                                        Date Of Birth
                                    </Typography>
                                    <Typography variant='body1' sx={{ marginTop: '10px' }}>
                                        {employeeDetails.employeeDateOfBirth}
                                    </Typography>
                                    <Typography
                                        variant='body1'
                                        sx={{ fontWeight: 'bold', marginTop: '10px' }}
                                    >
                                        Gender
                                    </Typography>
                                    <Typography variant='body1' sx={{ marginTop: '10px' }}>
                                        {employeeDetails.gender}
                                    </Typography>
                                    <Typography
                                        variant='body1'
                                        sx={{ fontWeight: 'bold', marginTop: '10px' }}
                                    >
                                        Blood Group
                                    </Typography>
                                    <Typography variant='body1' sx={{ marginTop: '10px' }}>
                                        {employeeDetails.bloodGroup}
                                    </Typography>

                                    <Typography
                                        variant='body1'
                                        sx={{ fontWeight: 'bold', marginTop: '10px' }}
                                    >
                                        Name As Per Aadhar
                                    </Typography>
                                    <Typography variant='body1' sx={{ marginTop: '10px' }}>
                                        {employeeDetails.nameAsPerAadhar}
                                    </Typography>
                                    <Typography
                                        variant='body1'
                                        sx={{ fontWeight: 'bold', marginTop: '10px' }}
                                    >
                                        Aadhar Number
                                    </Typography>
                                    <Typography variant='body1' sx={{ marginTop: '10px' }}>
                                        {employeeDetails.aadharNumber}
                                    </Typography>
                                    <Typography
                                        variant='body1'
                                        sx={{ fontWeight: 'bold', marginTop: '10px' }}
                                    >
                                        PAN Number
                                    </Typography>
                                    <Typography variant='body1' sx={{ marginTop: '10px' }}>
                                        {employeeDetails.panNumber}
                                    </Typography>
                                    <Typography
                                        variant='body1'
                                        sx={{ fontWeight: 'bold', marginTop: '10px' }}
                                    >
                                        Aadhar PanDocuments
                                    </Typography>

                                    <Typography
                                        variant='body1'
                                        sx={{
                                            cursor: 'pointer',
                                            marginTop: '10px',
                                            color: '#0066cc',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            '&:hover': {
                                                textDecoration: 'underline'
                                            }
                                        }}
                                        onClick={() =>
                                            handleShowModal(employeeDetails.aadharPanDocuments)
                                        }
                                    >
                                        <DownloadIcon sx={{ fontSize: '20px' }} />
                                        AadharPan Documents
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
                <Grid item xs={12} sm={8}>
                    {activeTab === 'Employee' && (
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Card
                                    variant='outlined'
                                    sx={{ ...cardStyles(pastelColors.blue), boxShadow: 3 }}
                                >
                                    <CardContent sx={{ padding: '20px' }}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '10px'
                                            }}
                                        >
                                            <Typography variant='h5' gutterBottom>
                                                Employement Information
                                            </Typography>
                                            <Button
                                                variant=''
                                                sx={{ color: '#333333' }}
                                                onClick={handleEmpInfoOpen}
                                                startIcon={<EditIcon />}
                                            >
                                                Edit
                                            </Button>
                                        </Box>
                                        <Box
                                            sx={{
                                                width: '90%',
                                                // border: '1px solid #e0e0e0',
                                                borderRadius: '5px',
                                                padding: '10px',
                                                marginTop: '10px',
                                                marginLeft: '' // Adjust margin as needed
                                            }}
                                        >
                                            <Typography
                                                variant='body1'
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    paddingBottom: '11px'
                                                }}
                                            >
                                                <span style={propertyStyles(pastelColors.black)}>
                                                    Employee ID:
                                                </span>
                                                <Typography
                                                    variant='body1'
                                                    sx={{
                                                        marginRight: 'auto',
                                                        marginLeft: '200px'
                                                    }}
                                                >
                                                    {employeeDetails.employeeid}
                                                </Typography>
                                            </Typography>
                                            <Typography
                                                variant='body1'
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    paddingBottom: '11px'
                                                }}
                                            >
                                                <span style={propertyStyles(pastelColors.black)}>
                                                    Employee Type:
                                                </span>
                                                <Typography
                                                    variant='body1'
                                                    sx={{
                                                        marginRight: 'auto',
                                                        marginLeft: '200px'
                                                    }}
                                                >
                                                    {employeeDetails.employeeType}
                                                </Typography>
                                            </Typography>
                                            <Typography
                                                variant='body1'
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    paddingBottom: '11px'
                                                }}
                                            >
                                                <span style={propertyStyles(pastelColors.black)}>
                                                    Employee Status:
                                                </span>
                                                <Typography
                                                    variant='body1'
                                                    sx={{
                                                        marginRight: 'auto',
                                                        marginLeft: '200px'
                                                    }}
                                                >
                                                    {employeeDetails.employeeStatus}
                                                </Typography>
                                            </Typography>

                                            <Typography
                                                variant='body1'
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    paddingBottom: '11px'
                                                }}
                                            >
                                                <span style={propertyStyles(pastelColors.black)}>
                                                    Reference:
                                                </span>
                                                <Typography
                                                    variant='body1'
                                                    sx={{
                                                        marginRight: 'auto',
                                                        marginLeft: '200px'
                                                    }}
                                                >
                                                    {employeeDetails.reference}
                                                </Typography>
                                            </Typography>

                                            <Typography
                                                variant='body1'
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    paddingBottom: '11px'
                                                }}
                                            >
                                                <span style={propertyStyles(pastelColors.black)}>
                                                    Work Email:
                                                </span>
                                                <Typography
                                                    variant='body1'
                                                    sx={{
                                                        marginRight: 'auto',
                                                        marginLeft: '200px'
                                                    }}
                                                >
                                                    {employeeDetails.workEmail}
                                                </Typography>
                                            </Typography>
                                            <Typography
                                                variant='body1'
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    paddingBottom: '11px'
                                                }}
                                            >
                                                <span style={propertyStyles(pastelColors.black)}>
                                                    Company:
                                                </span>
                                                <Typography
                                                    variant='body1'
                                                    sx={{
                                                        marginRight: 'auto',
                                                        marginLeft: '200px'
                                                    }}
                                                >
                                                    {employeeDetails.company}
                                                </Typography>
                                            </Typography>
                                            <Typography
                                                variant='body1'
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    paddingBottom: '11px'
                                                }}
                                            >
                                                <span style={propertyStyles(pastelColors.black)}>
                                                    Work Location:
                                                </span>
                                                <Typography
                                                    variant='body1'
                                                    sx={{
                                                        marginRight: 'auto',
                                                        marginLeft: '200px'
                                                    }}
                                                >
                                                    {employeeDetails.workLocationName}
                                                </Typography>
                                            </Typography>
                                            <Typography
                                                variant='body1'
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    paddingBottom: '11px'
                                                }}
                                            >
                                                <span style={propertyStyles(pastelColors.black)}>
                                                    Designation:
                                                </span>
                                                <Typography
                                                    variant='body1'
                                                    sx={{
                                                        marginRight: 'auto',
                                                        marginLeft: '200px'
                                                    }}
                                                >
                                                    {employeeDetails.designation}
                                                </Typography>
                                            </Typography>
                                            <Typography
                                                variant='body1'
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    paddingBottom: '11px'
                                                }}
                                            >
                                                <span style={propertyStyles(pastelColors.black)}>
                                                    Department:
                                                </span>
                                                <Typography
                                                    variant='body1'
                                                    sx={{
                                                        marginRight: 'auto',
                                                        marginLeft: '200px'
                                                    }}
                                                >
                                                    {employeeDetails.department}
                                                </Typography>
                                            </Typography>
                                            <Typography
                                                variant='body1'
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    paddingBottom: '11px'
                                                }}
                                            >
                                                <span style={propertyStyles(pastelColors.black)}>
                                                    Role:
                                                </span>
                                                <Typography
                                                    variant='body1'
                                                    sx={{
                                                        marginRight: 'auto',
                                                        marginLeft: '200px'
                                                    }}
                                                >
                                                    {employeeDetails.role}
                                                </Typography>
                                            </Typography>
                                            <Typography
                                                variant='body1'
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    paddingBottom: '11px'
                                                }}
                                            >
                                                <span style={propertyStyles(pastelColors.black)}>
                                                    Manager:
                                                </span>
                                                <Typography
                                                    variant='body1'
                                                    sx={{
                                                        marginRight: 'auto',
                                                        marginLeft: '200px'
                                                    }}
                                                >
                                                    {employeeDetails.manager}
                                                </Typography>
                                            </Typography>

                                            <Typography
                                                variant='body1'
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between'
                                                }}
                                            >
                                                <span style={propertyStyles(pastelColors.black)}>
                                                    Projects:
                                                </span>
                                                <Typography
                                                    variant='body1'
                                                    sx={{
                                                        marginRight: 'auto',
                                                        marginLeft: '200px'
                                                    }}
                                                >
                                                    {employeeDetails.projects}
                                                </Typography>
                                            </Typography>

                                            <Typography
                                                variant='body1'
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    paddingBottom: '11px'
                                                }}
                                            >
                                                <span style={propertyStyles(pastelColors.black)}>
                                                    Joining Date:
                                                </span>
                                                <Typography
                                                    variant='body1'
                                                    sx={{
                                                        marginRight: 'auto',
                                                        marginLeft: '200px'
                                                    }}
                                                >
                                                    {employeeDetails.joiningdate}
                                                </Typography>
                                            </Typography>
                                            <Typography
                                                variant='body1'
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    paddingBottom: '11px'
                                                }}
                                            >
                                                <span style={propertyStyles(pastelColors.black)}>
                                                    Exit Date:
                                                </span>
                                                <Typography
                                                    variant='body1'
                                                    sx={{
                                                        marginRight: 'auto',
                                                        marginLeft: '200px'
                                                    }}
                                                >
                                                    {employeeDetails.DateOfExit
                                                        ? employeeDetails.DateOfExit
                                                        : '-'}
                                                </Typography>
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12}>
                                <Card
                                    variant='outlined'
                                    sx={{
                                        ...cardStyles(pastelColors.blue),
                                        boxShadow: 3,
                                        marginTop: '40px'
                                    }}
                                >
                                    <CardContent sx={{ padding: '10px' }}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '20px'
                                            }}
                                        >
                                            <Typography variant='h5' gutterBottom>
                                                Contact Information
                                            </Typography>
                                            <Button
                                                variant=''
                                                sx={{ color: '#333333' }}
                                                onClick={handleOtherInfoOpen}
                                                startIcon={<EditIcon />}
                                            >
                                                Edit
                                            </Button>
                                        </Box>
                                        <Box
                                            sx={{
                                                width: '90%',
                                                borderRadius: '5px',
                                                paddingLeft: '20px'
                                            }}
                                        >
                                            {/* Other Information Details */}
                                            <Typography
                                                variant='body1'
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    paddingBottom: '11px'
                                                }}
                                            >
                                                <span style={propertyStyles(pastelColors.black)}>
                                                    Emergency Contact:
                                                </span>
                                                <Typography
                                                    variant='body1'
                                                    sx={{
                                                        marginRight: 'auto',
                                                        marginLeft: '200px'
                                                    }}
                                                >
                                                    {employeeDetails.emergencyContactNumber}
                                                </Typography>
                                            </Typography>

                                            <Typography
                                                variant='body1'
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    paddingBottom: '11px'
                                                }}
                                            >
                                                <span style={propertyStyles(pastelColors.black)}>
                                                    Address:
                                                </span>
                                                <Typography
                                                    variant='body1'
                                                    sx={{
                                                        marginRight: 'auto',
                                                        marginLeft: '200px'
                                                    }}
                                                >
                                                    {employeeDetails.address}
                                                </Typography>
                                            </Typography>
                                            <Typography
                                                variant='body1'
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    paddingBottom: '11px'
                                                }}
                                            >
                                                <span style={propertyStyles(pastelColors.black)}>
                                                    Permenant Address:
                                                </span>
                                                <Typography
                                                    variant='body1'
                                                    sx={{
                                                        marginRight: 'auto',
                                                        marginLeft: '200px'
                                                    }}
                                                >
                                                    {employeeDetails.permanentAddress}
                                                </Typography>
                                            </Typography>
                                            <Typography
                                                variant='body1'
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    paddingBottom: '11px'
                                                }}
                                            >
                                                <span style={propertyStyles(pastelColors.black)}>
                                                    Country:
                                                </span>
                                                <Typography
                                                    variant='body1'
                                                    sx={{
                                                        marginRight: 'auto',
                                                        marginLeft: '200px'
                                                    }}
                                                >
                                                    {employeeDetails.country}
                                                </Typography>
                                            </Typography>
                                            <Typography
                                                variant='body1'
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    paddingBottom: '11px'
                                                }}
                                            >
                                                <span style={propertyStyles(pastelColors.black)}>
                                                    State:
                                                </span>
                                                <Typography
                                                    variant='body1'
                                                    sx={{
                                                        marginRight: 'auto',
                                                        marginLeft: '200px'
                                                    }}
                                                >
                                                    {employeeDetails.state}
                                                </Typography>
                                            </Typography>
                                            <Typography
                                                variant='body1'
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    paddingBottom: '11px'
                                                }}
                                            >
                                                <span style={propertyStyles(pastelColors.black)}>
                                                    City:
                                                </span>
                                                <Typography
                                                    variant='body1'
                                                    sx={{
                                                        marginRight: 'auto',
                                                        marginLeft: '200px'
                                                    }}
                                                >
                                                    {employeeDetails.city}
                                                </Typography>
                                            </Typography>
                                            <Typography
                                                variant='body1'
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    paddingBottom: '11px'
                                                }}
                                            >
                                                <span style={propertyStyles(pastelColors.black)}>
                                                    ZipCode:
                                                </span>
                                                <Typography
                                                    variant='body1'
                                                    sx={{
                                                        marginRight: 'auto',
                                                        marginLeft: '200px'
                                                    }}
                                                >
                                                    {employeeDetails.zipcode}
                                                </Typography>
                                            </Typography>

                                            {/* Add more fields as needed */}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <AddEmployee
                                open={open}
                                handleClose={handleClose}
                                ispersonalinfo={ispersonalinfo}
                                isemployeeinfo={isempinfo}
                                isotherinfo={isotherinfo}
                                isbankinfo={isbankinfo}
                                isfamilyinfo={isfamilyinfo}
                                isexperienceinfo={isexperienceinfo}
                                Backdrop={Backdrop}
                                method={selectedMethod}
                                employeeDetails={employeeDetails}
                                designations={designations}
                                departments={departments}
                                countries={countries}
                                states={states}
                            />
                        </Grid>
                    )}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',

                            width: '100%'
                        }}
                    >
                        {activeTab === 'Education' && (
                            <Grid container spacing={3} sx={{ marginTop: '' }}>
                                <Grid item xs={12} sm={6}>
                                    <EducationListCard
                                        educationDetails={educationDetails}
                                        onSelectEducation={onSelectEducation}
                                        fetchEmployeeDetails={fetchEmployeeDetails}
                                        handleEducationInfoOpen={handleEducationInfoOpen}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <EducationInformationCard
                                        selectedEducation={selectedEducation}
                                    />
                                </Grid>
                            </Grid>
                        )}
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            width: '100%'
                        }}
                    >
                        {activeTab === 'Family Information' && (
                            <Grid container spacing={3} sx={{ marginTop: '' }}>
                                <Grid item xs={12} sm={6}>
                                    <FamilyInformationCard
                                        employeeDetails={employeeDetails}
                                        familyDetails={familyDetails}
                                        fetchEmployeeDetails={fetchEmployeeDetails}
                                        fetchFamilyDetails={fetchFamilyDetails}
                                        handleFamilyInfoOpen={handleFamilyInfoOpen}
                                    />
                                </Grid>
                            </Grid>
                        )}
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            width: '100%'
                        }}
                    >
                        {activeTab === 'Experience' && (
                            <Grid container spacing={3} sx={{ marginTop: '' }}>
                                <Grid item xs={12}>
                                    <EmployeeExperienceCard
                                        employeeDetails={employeeDetails}
                                        handleExperienceInfoOpen={handleExperienceInfoOpen}
                                        fetchEmployeeDetails={fetchEmployeeDetails}
                                    />
                                </Grid>
                            </Grid>
                        )}
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',

                            width: '100%'
                        }}
                    >
                        {activeTab === 'Skills & Expertise' && (
                            <Grid container spacing={3} sx={{ marginTop: '' }}>
                                <Grid item xs={12} sm={6}>
                                    <SkillsListCard
                                        skillsDetails={skillsDetails}
                                        onSelectSkill={onSelectSkill} // Function to handle project selection
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <SkillsInformationCard selectedSkill={selectedSkill} />
                                </Grid>
                            </Grid>
                        )}
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',

                            width: '100%'
                        }}
                    >
                        {activeTab === 'Learning' && (
                            <Grid container spacing={3} sx={{ marginTop: '' }}>
                                <Grid item xs={12} sm={6}>
                                    <LearningListCard
                                        learningsDetails={learningsDetails}
                                        onSelectLearning={onSelectLearning} // Function to handle project selection
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <LearningInformationCard selectedLearning={selectedLearning} />
                                </Grid>
                            </Grid>
                        )}
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',

                            width: '100%'
                        }}
                    >
                        {activeTab === 'Relieving Info' && (
                            <Grid container spacing={3} sx={{ marginTop: '' }}>
                                <Grid item xs={12} sm={6}>
                                    <RelievingInfoCard
                                        employeeDetails={employeeDetails}
                                        relievingDetails={relievingDetails}
                                        fetchEmployeeDetails={fetchEmployeeDetails}
                                        fetchRelievingDetails={fetchRelievingDetails}
                                    />
                                </Grid>
                            </Grid>
                        )}
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',

                            width: '100%'
                        }}
                    >
                        {activeTab === 'Projects' && (
                            <Grid container spacing={3} sx={{ marginTop: '' }}>
                                <Grid item xs={12} sm={6}>
                                    <ProjectsListCard
                                        projectDetails={projectsList}
                                        onSelectProject={onSelectProject} // Function to handle project selection
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <ProjectInformationCard
                                        selectedProject={selectedProject}
                                        fetchProjectsByName={() =>
                                            fetchProjectDetailsByName(employeeDetails, _cancelToken)
                                        }
                                    />
                                </Grid>
                            </Grid>
                        )}
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',

                            width: '100%'
                        }}
                    >
                        {activeTab === 'Assets' && (
                            <>
                                <Box sx={{ minWidth: '500px', flexGrow: 1 }}>
                                    <AssetsListCard
                                        assetDetails={assetDetails}
                                        onSelectAsset={onSelectAsset}
                                    />
                                </Box>
                                <Box sx={{ flexGrow: 2, minWidth: '800px' }}>
                                    <AssetsInformationCard
                                        selectedAsset={selectedAsset}
                                        fetchAssetsByUserId={() =>
                                            fetchAssetsDetailsByUserId(userId, _cancelToken)
                                        }
                                    />
                                </Box>
                            </>
                        )}
                    </Box>
                </Grid>
                {activeTab === 'Employee' && (
                    <Grid item xs={12}>
                        <Card
                            variant='outlined'
                            sx={{
                                ...cardStyles(pastelColors.blue),

                                boxShadow: 3,
                                marginTop: '40px',
                                marginLeft: '10px'
                            }}
                        >
                            <CardContent sx={{ padding: '10px' }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '20px'
                                    }}
                                >
                                    <Typography variant='h5' gutterBottom>
                                        Bank Details
                                    </Typography>
                                    <Button
                                        variant=''
                                        sx={{ color: '#333333' }}
                                        onClick={handleBankInfoOpen}
                                        startIcon={<EditIcon />}
                                    >
                                        Edit
                                    </Button>
                                </Box>
                                <Box
                                    sx={{
                                        width: '90%',
                                        borderRadius: '5px',
                                        paddingLeft: '20px'
                                    }}
                                >
                                    <Typography
                                        variant='body1'
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            paddingBottom: '11px'
                                        }}
                                    >
                                        <span style={propertyStyles(pastelColors.black)}>
                                            Account Number:
                                        </span>
                                        <Typography
                                            variant='body1'
                                            sx={{
                                                marginRight: 'auto',
                                                marginLeft: '200px'
                                            }}
                                        >
                                            {employeeDetails.accountNumber || '-'}
                                        </Typography>
                                    </Typography>

                                    <Typography
                                        variant='body1'
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            paddingBottom: '11px'
                                        }}
                                    >
                                        <span style={propertyStyles(pastelColors.black)}>
                                            Bank Name:
                                        </span>
                                        <Typography
                                            variant='body1'
                                            sx={{
                                                marginRight: 'auto',
                                                marginLeft: '200px'
                                            }}
                                        >
                                            {employeeDetails.bankName || '-'}
                                        </Typography>
                                    </Typography>

                                    <Typography
                                        variant='body1'
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            paddingBottom: '11px'
                                        }}
                                    >
                                        <span style={propertyStyles(pastelColors.black)}>
                                            IFSC Code:
                                        </span>
                                        <Typography
                                            variant='body1'
                                            sx={{
                                                marginRight: 'auto',
                                                marginLeft: '200px'
                                            }}
                                        >
                                            {employeeDetails.ifscCode || '-'}
                                        </Typography>
                                    </Typography>

                                    <Typography
                                        variant='body1'
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            paddingBottom: '11px'
                                        }}
                                    >
                                        <span style={propertyStyles(pastelColors.black)}>
                                            Passbook/Cheque:
                                        </span>

                                        <Typography
                                            variant='body1'
                                            sx={{
                                                cursor: 'pointer',
                                                marginTop: '10px',
                                                color: '#0066cc',
                                                display: 'flex',
                                                alignItems: 'center',
                                                marginRight: 'auto',
                                                marginLeft: '200px',
                                                gap: '4px',
                                                '&:hover': {
                                                    textDecoration: 'underline'
                                                }
                                            }}
                                            onClick={() =>
                                                handleShowModal(
                                                    employeeDetails.passbookChequeDocuments
                                                )
                                            }
                                        >
                                            <DownloadIcon sx={{ fontSize: '20px' }} />
                                            PassbookCheque Documents
                                        </Typography>
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
            {activeTab === 'Leave' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '94%' }}>
                    {/* First Row */}

                    {/* Second Row */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', marginBottom: '' }}>
                        <Box sx={{ width: { xs: '100%', sm: '50%', md: '40%' }, padding: 2 }}>
                            <LeaveHistory leaveData={leaveData} onSelectLeave={onSelectLeave} />
                        </Box>
                        <Box
                            sx={{
                                width: { xs: '100%', sm: '50%', md: '60%' },
                                padding: 2,
                                marginLeft: ''
                            }}
                        >
                            <LeaveHistoryDetails
                                selectedData={selectedLeave}
                                initialRender={initialRender}
                            />
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', marginBottom: 2 }}>
                        <Box
                            sx={{
                                width: { xs: '100%', sm: '30%', md: '40%' },
                                padding: 2,
                                marginRight: ''
                            }}
                        >
                            <UpcomingLeaves
                                upcomingLeaves={upcomingLeaves}
                                leaveCounts={leaveCounts}
                                leaveAllowances={leaveAllowances}
                            />
                        </Box>
                        <Box sx={{ width: { xs: '100%', sm: '70%', md: '60%' }, padding: 2 }}>
                            <LeaveMetrics
                                leaveCounts={leaveCounts}
                                leaveAllowances={leaveAllowances}
                            />
                        </Box>
                    </Box>
                </Box>
            )}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',

                    width: '100%'
                }}
            >
                {activeTab === 'Letters' && (
                    <>
                        <Box sx={{ minWidth: '500px', flexGrow: 1 }}>
                            <LettersListCard onSelectLetter={onSelectLetter} />
                        </Box>
                        <Box sx={{ flexGrow: 2, minWidth: '800px' }}>
                            <LettersInformationCard
                                selectedLetter={selectedLetter}
                                userId={userId}
                                employeeDetails={employeeDetails}
                            />
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default ViewEmployee;
