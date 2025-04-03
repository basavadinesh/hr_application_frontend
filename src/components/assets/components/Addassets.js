import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { FormControl, Select, MenuItem, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { getDepartments } from 'components/departments/actions/department-actions';
import './Assets.css';
import { manageError } from '../../core/actions/common-actions';
import { getProjects } from '../../projects/actions/project-action';
import { AppConfigProps } from '../../core/settings/app-config';
import { createAssets, updateAssets, returnAssets } from '../actions/assets-actions';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Typography } from '@mui/material';
import AppUtils from '../../core/helpers/app-utils';
import Autocomplete from '@mui/material/Autocomplete';
import { getEmployees } from '../../allEmployees/actions/employee-actions';

// Style object for the modal
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

export default function AddAssets(props) {
    // Determines the title based on the method (add, edit, return)
    const getTitle = (method) => {
        switch (method) {
            case 'add':
                return 'Add Assets';
            case 'edit':
                return 'Edit Assets';
            case 'return':
                return 'Return Assets';
            default:
                return '';
        }
    };
    const history = useHistory();
    const [isLoading, setLoading] = useState(false); // Loading state
    const [errors, setErrors] = React.useState({}); // Error state
    const userId = localStorage.getItem('userId'); // Fetch userId from localStorage
    const [employees, setEmployees] = useState([]); // List of employees
    const [departments, setDepartments] = useState([]); // List of departments
    const [projectNames, setProjectNames] = useState([]); // List of projects
    const [employeesLoading, setEmployeesLoading] = useState(false); // Loading state for employees
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(() => {
        const initialId = props.assetDetails?.emp_code || ''; // Initialize selectedEmployeeId
        return initialId;
    });
    const [cancelTokenSource] = useState(axios.CancelToken.source()); // Axios cancel token
    const [assetsValues, setAssetsValues] = useState({
        // Asset details state
        asset_type: '',
        serial_number: '',
        asset_given_at: '',
        asset_approved_at: '',
        asset_received_at: '',
        assignee_comment: '',
        received_comment: '',
        status: 'Pending',
        return_comment: '',
        asset_return_at: '',
        user_id: userId,
        amount_or_invoice_wise: '',
        warranty_date: '',
        company: '',
        delivered_to: '',
        department: '',
        emp_code: '',
        handovered_type: '',
        hard_disk_size: '',
        hard_disk_type: '',
        delivered_date: '',
        inv_number: '',
        invoice_date: '',
        make: '',
        processor: '',
        project: '',
        quantity: '',
        ram: '',
        remarks: ''
    });

    // Update selectedEmployeeId when assetDetails change
    useEffect(() => {
        if (props.assetDetails && props.assetDetails.emp_code) {
            setSelectedEmployeeId(props.assetDetails.emp_code);
        }
    }, [props.assetDetails]);

    // Fetch employees when component mounts or cancelTokenSource changes
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await getEmployees({ cancelToken: cancelTokenSource.token });
                setEmployees(response.data);
            } catch (err) {
                console.error('Error fetching employees:', err);
            } finally {
                setEmployeesLoading(false);
            }
        };

        fetchEmployees();

        return () => {
            cancelTokenSource.cancel('Component unmounted');
        };
    }, [cancelTokenSource]);

    // Fetch departments and projects when component mounts
    useEffect(() => {
        getEmployeeDepartments();
        loadPageDataProjectNames();
    }, []);

    // Fetch departments
    const getEmployeeDepartments = async () => {
        await getDepartments({ cancelToken: cancelTokenSource.token })
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

    // Fetch project names
    const loadPageDataProjectNames = async () => {
        await getProjects({ cancelToken: cancelTokenSource.token })
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    const projects = res.data.map((project) => {
                        return project;
                    });
                    setProjectNames(projects);
                } else {
                    await manageError(res, props.history);
                }
            })
            .catch(async (err) => {
                await manageError(err, props.history);
            });
    };

    // Handle department selection change
    const handleDepartmentChange = (event) => {
        const { value } = event.target;

        // Update the assetsValues state with the selected department
        setAssetsValues((prevValues) => ({
            ...prevValues,
            department: value
        }));

        // If a value is selected, set the error for 'department' to null
        if (value) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                department: null
            }));
        }

        // Call the onChange handler passed from props
        props.onChange({ target: { name: 'department', value } });
    };

    // Handle project selection change
    const handleProjectChange = (event) => {
        const { value } = event.target;
        setAssetsValues((prevValues) => ({
            ...prevValues,
            project: value
        }));
        props.onChange({ target: { name: 'project', value } });
    };

    // Handle employee selection change
    const handleEmployeeChange = (event, value) => {
        setSelectedEmployeeId(value ? value.employeeid : '');
        setAssetsValues((prevValues) => ({
            ...prevValues,
            emp_code: value ? value.employeeid : ''
        }));

        if (props.onChange) {
            props.onChange({ target: { name: 'emp_code', value: value ? value.employeeid : '' } });
        }
        if (handleError) {
            handleError(null, 'emp_code');
        }
    };

    // Reset state when dialog is closed
    useEffect(() => {
        if (!props.open) {
            // Reset the state when the dialog is closed
            setSelectedEmployeeId('');
            setEmployeesLoading(false);
        }
    }, [props.open]);

    // Update asset values when assetDetails or userId changes
    useEffect(() => {
        if (userId) {
            setAssetsValues((prevValues) => ({
                ...prevValues,
                user_id: userId.toString()
            }));
        }
        if (props.assetDetails) {
            setAssetsValues((prevValues) => ({
                ...prevValues,
                asset_type: props.assetDetails.asset_type || '',
                serial_number: props.assetDetails.serial_number || '',
                asset_given_at: props.assetDetails.asset_given_at || '',
                asset_approved_at: props.assetDetails.asset_approved_at || '',
                asset_received_at: props.assetDetails.asset_received_at || '',
                assignee_comment: props.assetDetails.assignee_comment || '',
                received_comment: props.assetDetails.received_comment || '',
                return_comment: props.assetDetails.return_comment || '',
                asset_return_at: props.assetDetails.asset_return_at || '',
                delivered_date: props.assetDetails.delivered_date || '',
                status: props.assetDetails.status || '',
                user_id: props.assetDetails.user_id || '',
                amount_or_invoice_wise: props.assetDetails.amount_or_invoice_wise || '',
                warranty_date: props.assetDetails.warranty_date || '',
                company: props.assetDetails.company || '',
                delivered_to: props.assetDetails.delivered_to || '',
                department: props.assetDetails.department || '',
                emp_code: props.assetDetails.emp_code || '',
                handovered_type: props.assetDetails.handovered_type || '',
                hard_disk_size: props.assetDetails.hard_disk_size || '',
                hard_disk_type: props.assetDetails.hard_disk_type || '',
                inv_number: props.assetDetails.invoice_number || '',
                invoice_date: props.assetDetails.invoice_date || '',
                make: props.assetDetails.make || '',
                processor: props.assetDetails.processor || '',
                project: props.assetDetails.project || '',
                quantity: props.assetDetails.quantity || '',
                ram: props.assetDetails.ram || '',
                remarks: props.assetDetails.remarks || ''
            }));
        }
    }, [props.assetDetails]);

    // Handle form field changes
    const handleChange = async (event) => {
        const { name, value } = event.target;

        // Format amount or invoice value
        if (name === 'amount_or_invoice_wise') {
            // Parse value to BigDecimal
            const parsedValue = parseFloat(value); // Parse as float
            const formattedValue = isNaN(parsedValue) ? '' : parsedValue.toFixed(2); // Format to 2 decimal places

            await setAssetsValues((prevValues) => ({
                ...prevValues,
                [name]: formattedValue
            }));
        } else {
            // Generic handling for other fields
            await setAssetsValues((prevValues) => ({
                ...prevValues,
                [name]: value
            }));
        }
    };

    // Handle changes to warranty date field
    const handleWarrantyDateChange = async (event) => {
        const { name, value } = event.target;
        const inputDate = new Date(value);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        if (inputDate <= currentDate) {
            handleError('Warranty date must be in the future', name);
        } else {
            handleError(null, name);
        }

        await setAssetsValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }));
    };

    // Function to validate form fields
    const validate = () => {
        let isValid = true;
        const currentDate = new Date();

        // Check each field for validity
        if (!assetsValues.asset_type) {
            handleError('Please Select Asset_Type', 'asset_type');
            isValid = false;
        }
        if (!assetsValues.inv_number) {
            handleError('Please Enter Invoice_Number', 'inv_number');
            isValid = false;
        }
        if (!assetsValues.invoice_date) {
            handleError('Please Enter Invoice_Date', 'invoice_date');
            isValid = false;
        }

        if (!assetsValues.make) {
            handleError('Please Enter Make', 'make');
            isValid = false;
        }
        if (!assetsValues.quantity) {
            handleError('Please Enter Quantity', 'quantity');
            isValid = false;
        }
        if (!assetsValues.ram) {
            handleError('Please Enter Ram', 'ram');
            isValid = false;
        }
        if (!assetsValues.processor) {
            handleError('Please Enter Processor', 'processor');
            isValid = false;
        }
        if (!assetsValues.hard_disk_size) {
            handleError('Please Enter Hard Disk Size', 'hard_disk_size');
            isValid = false;
        }
        if (!assetsValues.hard_disk_type) {
            handleError('Please Enter Hard Disk Type', 'hard_disk_type');
            isValid = false;
        }
        if (!assetsValues.company) {
            handleError('Please Enter Company', 'company');
            isValid = false;
        }
        if (!assetsValues.department) {
            handleError('Please Enter Department', 'department');
            isValid = false;
        }
        if (!assetsValues.emp_code) {
            handleError('Please Enter Emp Code', 'emp_code');
            isValid = false;
        }
        if (!assetsValues.warranty_date) {
            handleError('Please Enter Warranty Date', 'warranty_date');
            isValid = false;
        } else {
            // Check if warranty date is in the future
            const warrantyDate = new Date(assetsValues.warranty_date);
            if (warrantyDate <= currentDate) {
                handleError('Warranty Date must be in the future', 'warranty_date');
                isValid = false;
            }
        }
        if (!assetsValues.project) {
            handleError('Please Enter Project', 'project');
            isValid = false;
        }
        if (!assetsValues.serial_number) {
            handleError('Please Enter Serial_Number', 'serial_number');
            isValid = false;
        }
        if (!assetsValues.amount_or_invoice_wise) {
            handleError('Please Enter Amount or Invoice', 'amount_or_invoice_wise');
            isValid = false;
        }
        if (!assetsValues.asset_approved_at) {
            handleError('Please Enter Asset_Approved_At', 'asset_approved_at');
            isValid = false;
        }
        if (!assetsValues.assignee_comment) {
            handleError('Please Enter Assignee_Comment', 'assignee_comment');
            isValid = false;
        }
        if (props.method === 'return' && !assetsValues.return_comment) {
            handleError('Please Enter Return_Comment', 'return_comment');
            isValid = false;
        }
        if (!assetsValues.status) {
            handleError('Please Enter Status', 'status');
            isValid = false;
        }
        if (props.method === 'return' && !assetsValues.asset_return_at) {
            handleError('Please Enter Asset_Return_At', 'asset_return_at');
            isValid = false;
        }

        // If all fields are valid, clear any previous errors
        if (isValid) {
            setErrors({});
        }

        return isValid;
    };

    // Function to handle and display errors
    const handleError = (error, input) => {
        setErrors((prevState) => {
            const newErrors = { ...prevState, [input]: error };
            return newErrors;
        });
    };

    // Function to handle form submission
    const handleSubmit = async () => {
        const isValid = validate();

        if (isValid) {
            // Call the appropriate function based on the method prop
            return props.method === 'add'
                ? addAssets()
                : props.method === 'edit'
                ? assetUpdate()
                : props.method === 'return'
                ? assetReturn()
                : null;
        } else {
            // Handle case where form is not valid, you might want to show an error message or take some other action.
            console.log('Form is not valid');
        }
    };

    // Function to add a new asset
    const addAssets = async () => {
        let assetsObj = {
            asset_type: assetsValues.asset_type,
            serial_number: assetsValues.serial_number,
            asset_given_at: AppUtils.getDateTimeFormat(assetsValues.asset_given_at),
            asset_approved_at: AppUtils.getDateTimeFormat(assetsValues.asset_approved_at),
            asset_received_at: AppUtils.getDateTimeFormat(assetsValues.asset_received_at),
            warranty_date: AppUtils.getDateTimeFormat(assetsValues.warranty_date),
            invoice_date: AppUtils.getDateTimeFormat(assetsValues.invoice_date),
            assignee_comment: assetsValues.assignee_comment,
            received_comment: assetsValues.received_comment,
            status: assetsValues.status,
            user_id: {
                id: Number(assetsValues.user_id)
            },
            amount_or_invoice_wise: assetsValues.amount_or_invoice_wise,
            company: assetsValues.company,
            delivered_to: assetsValues.delivered_to,
            department: assetsValues.department,
            delivered_date: AppUtils.getDateTimeFormat(assetsValues.delivered_date),

            emp_code: assetsValues.emp_code,
            handovered_type: assetsValues.handovered_type,
            hard_disk_size: assetsValues.hard_disk_size,
            hard_disk_type: assetsValues.hard_disk_type,
            invoice_number: assetsValues.inv_number,
            make: assetsValues.make,
            processor: assetsValues.processor,
            project: assetsValues.project,
            quantity: assetsValues.quantity,
            ram: assetsValues.ram,
            remarks: assetsValues.remarks
        };

        setLoading(true);

        // Call createAssets API with the asset object
        createAssets(assetsObj)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    handleClose();
                    props.reloadAssets(userId);
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Function to update an existing asset
    const assetUpdate = async () => {
        let assetsId = props.assetDetails?.id;
        let userDetails = props.assetDetails?.user_id;
        let assetsObj = {
            asset_type: assetsValues.asset_type
                ? assetsValues.asset_type
                : props.assetDetails?.asset_type,
            serial_number: assetsValues.serial_number
                ? assetsValues.serial_number
                : props.assetDetails?.serial_number,
            asset_received_at: assetsValues.asset_received_at
                ? assetsValues.asset_received_at
                : props.assetDetails?.asset_received_at,
            asset_given_at: assetsValues.asset_given_at
                ? assetsValues.asset_given_at
                : props.assetDetails?.asset_given_at,
            asset_approved_at: assetsValues.asset_approved_at
                ? assetsValues.asset_approved_at
                : props.assetDetails?.asset_approved_at,
            assignee_comment: assetsValues.assignee_comment
                ? assetsValues.assignee_comment
                : props.assetDetails?.assignee_comment,
            received_comment: assetsValues.received_comment
                ? assetsValues.received_comment
                : props.assetDetails?.received_comment,
            status: assetsValues.status ? assetsValues.status : props.assetDetails?.status,
            warranty_date: assetsValues.warranty_date
                ? assetsValues.warranty_date
                : props.assetDetails?.warranty_date,
            user_id: userDetails,
            amount_or_invoice_wise: assetsValues.amount_or_invoice_wise
                ? assetsValues.amount_or_invoice_wise
                : props.assetDetails?.amount_or_invoice_wise,
            company: assetsValues.company ? assetsValues.company : props.assetDetails?.company,
            delivered_to: assetsValues.delivered_to
                ? assetsValues.delivered_to
                : props.assetDetails?.delivered_to,
            delivered_date: assetsValues.delivered_date
                ? assetsValues.delivered_date
                : props.assetDetails?.delivered_date,
            department: assetsValues.department
                ? assetsValues.department
                : props.assetDetails?.department,
            emp_code: assetsValues.emp_code ? assetsValues.emp_code : props.assetDetails?.emp_code,
            handovered_type: assetsValues.handovered_type
                ? assetsValues.handovered_type
                : props.assetDetails?.handovered_type,
            hard_disk_size: assetsValues.hard_disk_size
                ? assetsValues.hard_disk_size
                : props.assetDetails?.hard_disk_size,
            hard_disk_type: assetsValues.hard_disk_type
                ? assetsValues.hard_disk_type
                : props.assetDetails?.hard_disk_type,
            invoice_number: assetsValues.inv_number
                ? assetsValues.inv_number
                : props.assetDetails?.invoice_number,
            invoice_date: assetsValues.invoice_date
                ? assetsValues.invoice_date
                : props.assetDetails?.invoice_date,
            make: assetsValues.make ? assetsValues.make : props.assetDetails?.make,
            processor: assetsValues.processor
                ? assetsValues.processor
                : props.assetDetails?.processor,
            project: assetsValues.project ? assetsValues.project : props.assetDetails?.project,
            quantity: assetsValues.quantity ? assetsValues.quantity : props.assetDetails?.quantity,
            ram: assetsValues.ram ? assetsValues.ram : props.assetDetails?.ram,
            remarks: assetsValues.remarks ? assetsValues.remarks : props.assetDetails?.remarks
        };

        setLoading(true);

        // Call updateAssets API with the asset ID and updated object
        updateAssets(assetsId, assetsObj)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    handleClose();
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Function to handle returning an asset
    const assetReturn = async () => {
        // Get asset ID and user details from props
        let assetsId = props.assetDetails?.id;
        let userDetails = props.assetDetails?.user_id;
        // Create an object with updated asset values, falling back to existing values if not provided
        let assetsObj = {
            asset_type: assetsValues.asset_type
                ? assetsValues.asset_type
                : props.assetDetails?.asset_type,
            serial_number: assetsValues.serial_number
                ? assetsValues.serial_number
                : props.assetDetails?.serial_number,
            asset_received_at: assetsValues.asset_received_at
                ? assetsValues.asset_received_at
                : props.assetDetails?.asset_received_at,
            delivered_date: assetsValues.delivered_date
                ? assetsValues.delivered_date
                : props.assetDetails?.delivered_date,
            asset_given_at: assetsValues.asset_given_at
                ? assetsValues.asset_given_at
                : props.assetDetails?.asset_given_at,
            asset_approved_at: assetsValues.asset_approved_at
                ? assetsValues.asset_approved_at
                : props.assetDetails?.asset_approved_at,
            asset_return_at: assetsValues.asset_return_at
                ? assetsValues.asset_return_at
                : props.assetDetails?.asset_return_at,
            assignee_comment: assetsValues.assignee_comment
                ? assetsValues.assignee_comment
                : props.assetDetails?.assignee_comment,
            warranty_date: assetsValues.warranty_date
                ? assetsValues.warranty_date
                : props.assetDetails?.warranty_date,
            return_comment: assetsValues.return_comment
                ? assetsValues.return_comment
                : props.assetDetails?.return_comment,
            received_comment: assetsValues.received_comment
                ? assetsValues.received_comment
                : props.assetDetails?.received_comment,
            status: assetsValues.status ? assetsValues.status : props.assetDetails?.status,
            user_id: userDetails,
            amount_or_invoice_wise: assetsValues.amount_or_invoice_wise
                ? assetsValues.amount_or_invoice_wise
                : props.assetDetails.amount_or_invoice_wise,
            company: assetsValues.company ? assetsValues.company : props.assetDetails.company,
            delivered_to: assetsValues.delivered_to
                ? assetsValues.delivered_to
                : props.assetDetails.delivered_to,
            department: assetsValues.department
                ? assetsValues.department
                : props.assetDetails.department,
            emp_code: assetsValues.emp_code ? assetsValues.emp_code : props.assetDetails.emp_code,
            handovered_type: assetsValues.handovered_type
                ? assetsValues.handovered_type
                : props.assetDetails.handovered_type,
            hard_disk_size: assetsValues.hard_disk_size
                ? assetsValues.hard_disk_size
                : props.assetDetails.hard_disk_size,
            hard_disk_type: assetsValues.hard_disk_type
                ? assetsValues.hard_disk_type
                : props.assetDetails.hard_disk_type,
            invoice_number: assetsValues.inv_number
                ? assetsValues.inv_number
                : props.assetDetails.inv_number,
            invoice_date: assetsValues.invoice_date
                ? assetsValues.invoice_date
                : props.assetDetails.invoice_date,
            make: assetsValues.make ? assetsValues.make : props.assetDetails.make,
            processor: assetsValues.processor
                ? assetsValues.processor
                : props.assetDetails.processor,
            project: assetsValues.project.name
                ? assetsValues.project.name
                : props.assetDetails.project,
            quantity: assetsValues.quantity ? assetsValues.quantity : props.assetDetails.quantity,
            ram: assetsValues.ram ? assetsValues.ram : props.assetDetails.ram,
            remarks: assetsValues.remarks ? assetsValues.remarks : props.assetDetails.remarks
        };

        setLoading(true);

        // Call returnAssets API with the asset ID and updated object
        returnAssets(assetsId, assetsObj)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    props.handleClose();
                    // props.reloadAssets(userId);
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Function to close the form/modal and reset state
    const handleClose = () => {
        setErrors({});
        setEmployeesLoading(false);
        props.handleClose();

        // Reset asset values to default state
        setAssetsValues({
            asset_type: '',
            serial_number: '',
            asset_given_at: '',
            asset_approved_at: '',
            asset_received_at: '',
            assignee_comment: '',
            received_comment: '',
            status: 'Pending',
            return_comment: '',
            asset_return_at: '',
            user_id: userId,
            amount_or_invoice_wise: '',
            company: '',
            delivered_to: '',
            department: '',
            emp_code: '',
            handovered_type: '',
            hard_disk_size: '',
            hard_disk_type: '',
            delivered_date: '',
            warranty_date: '',
            // id: '',
            inv_number: '',
            invoice_date: '',
            make: '',
            processor: '',
            project: '',
            quantity: '',
            ram: '',
            remarks: ''
        });
    };

    // Array of possible asset types
    const assetTypes = ['Laptop', 'Modem', 'SSD', 'USB', 'HDD', 'Tablet'];

    // Array of possible asset statuses
    const ASSET_STATUS = [
        'Initiated',
        'Pending',
        'Active',
        'Hold',
        'Canceled',
        'Closed',
        'Approved',
        'Delivered',
        'success',
        'failure'
    ];

    // Array of possible RAM sizes
    const RAM_SIZES = ['2GB', '4GB', '8GB', '16GB', '32GB', '64GB', '128GB'];

    // Array of possible hard disk sizes
    const HARD_DISK_SIZES = ['128GB', '256GB', '512GB', '1TB', '2TB', '4TB', '8TB'];

    // Array of possible hard disk types
    const HARD_DISK_TYPES = ['SSD', 'HDD'];

    return (
        <Modal
            aria-labelledby='spring-modal-title'
            aria-describedby='spring-modal-description'
            open={props.open}
            onClose={handleClose}
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
                    <CardHeader title={getTitle(props.method)}> </CardHeader>
                    <IconButton
                        sx={{
                            position: 'absolute',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginLeft: '650px',
                            marginTop: '10px',
                            color: '#0070AC'
                        }}
                        onClick={handleClose}
                    >
                        <HighlightOffIcon />
                    </IconButton>
                </AppBar>

                <Card sx={{ minWidth: 500, boxShadow: 0, height: 400, overflow: 'auto' }}>
                    <CardContent>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            {/* <Grid item xs={6}>
                                {' '}
                                <TextField
                                    required
                                    id='name'
                                    name='name'
                                    label='Employee Name'
                                    defaultValue={props.assetDetails?.name}
                                    onChange={handleChange}
                                />
                            </Grid> */}

                            <Grid item xs={6}>
                                {' '}
                                <Typography>
                                    Invoice Number<span className='error'>*</span>
                                </Typography>
                                <TextField
                                    sx={{ minWidth: 320 }}
                                    required
                                    id='inv_number'
                                    name='inv_number'
                                    error={errors.inv_number}
                                    onFocus={() => handleError(null, 'inv_number')}
                                    helperText={errors.inv_number}
                                    defaultValue={props.assetDetails?.invoice_number}
                                    onChange={handleChange}
                                    disabled={props.method === 'return'}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                {' '}
                                <Typography>
                                    Invoice Date<span className='error'>*</span>
                                </Typography>
                                <TextField
                                    sx={{ minWidth: 320 }}
                                    required
                                    id='invoice_date'
                                    name='invoice_date'
                                    type='date'
                                    onFocus={() => handleError(null, 'invoice_date')}
                                    error={errors.invoice_date}
                                    helperText={errors.invoice_date}
                                    defaultValue={props.assetDetails?.invoice_date}
                                    onChange={handleChange}
                                    disabled={props.method === 'return'}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                {' '}
                                <Typography>
                                    Product<span className='error'>*</span>
                                </Typography>
                                <FormControl sx={{ minWidth: 320 }} required>
                                    <Select
                                        label='Assets Type'
                                        id='asset_type'
                                        name='asset_type'
                                        value={assetsValues.asset_type}
                                        onFocus={() => handleError(null, 'asset_type')}
                                        error={errors.asset_type}
                                        helperText={errors.asset_type}
                                        defaultValue={props.leaveDetails?.asset_type}
                                        onChange={handleChange}
                                        disabled={props.method === 'return'}
                                    >
                                        {/* <MenuItem value='' /> */}
                                        {assetTypes.map((type) => (
                                            <MenuItem key={type} value={type}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <Typography variant='caption' color='error'>
                                        {errors.asset_type}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                {' '}
                                <Typography>
                                    Make<span className='error'>*</span>
                                </Typography>
                                <TextField
                                    sx={{ minWidth: 320 }}
                                    required
                                    id='make'
                                    name='make'
                                    error={errors.make}
                                    onFocus={() => handleError(null, 'make')}
                                    helperText={errors.inv_number}
                                    defaultValue={props.assetDetails?.make}
                                    onChange={handleChange}
                                    disabled={props.method === 'return'}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                {' '}
                                <Typography>
                                    Quantity<span className='error'>*</span>
                                </Typography>
                                <TextField
                                    sx={{ minWidth: 320 }}
                                    required
                                    id='quantity'
                                    name='quantity'
                                    type='number'
                                    error={errors.quantity}
                                    onFocus={() => handleError(null, 'quantity')}
                                    helperText={errors.quantity}
                                    defaultValue={props.assetDetails?.quantity}
                                    onChange={handleChange}
                                    disabled={props.method === 'return'}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                {' '}
                                <Typography>
                                    Serial Number<span className='error'>*</span>
                                </Typography>
                                <TextField
                                    sx={{ minWidth: 320 }}
                                    required
                                    id='serial_number'
                                    name='serial_number'
                                    error={errors.serial_number}
                                    onFocus={() => handleError(null, 'serial_number')}
                                    helperText={errors.serial_number}
                                    defaultValue={props.assetDetails?.serial_number}
                                    onChange={handleChange}
                                    disabled={props.method === 'return'}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                {' '}
                                <Typography>
                                    Ram <span className='error'>*</span>
                                </Typography>
                                <FormControl sx={{ minWidth: 320 }} required>
                                    <Select
                                        id='ram'
                                        name='ram'
                                        label='ram'
                                        error={errors.ram}
                                        onFocus={() => handleError(null, 'ram')}
                                        disabled={props.method === 'return'}
                                        helperText={errors.ram}
                                        defaultValue={props.assetDetails?.ram}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value='' />
                                        {RAM_SIZES.map((type) => (
                                            <MenuItem key={type} value={type}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <Typography variant='caption' color='error'>
                                        {errors.ram}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                {' '}
                                <Typography>
                                    Processor<span className='error'>*</span>
                                </Typography>
                                <TextField
                                    sx={{ minWidth: 320 }}
                                    required
                                    id='processor'
                                    name='processor'
                                    error={errors.processor}
                                    onFocus={() => handleError(null, 'processor')}
                                    helperText={errors.processor}
                                    defaultValue={props.assetDetails?.processor}
                                    onChange={handleChange}
                                    disabled={props.method === 'return'}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                {' '}
                                <Typography>
                                    Hard Disk Size<span className='error'>*</span>
                                </Typography>
                                <FormControl sx={{ minWidth: 320 }} required>
                                    <Select
                                        id='hard_disk_size'
                                        name='hard_disk_size'
                                        label='hard_disk_size'
                                        error={errors.hard_disk_size}
                                        onFocus={() => handleError(null, 'hard_disk_size')}
                                        helperText={errors.hard_disk_size}
                                        disabled={props.method === 'return'}
                                        defaultValue={props.assetDetails?.hard_disk_size}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value='' />
                                        {HARD_DISK_SIZES.map((type) => (
                                            <MenuItem key={type} value={type}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <Typography variant='caption' color='error'>
                                        {errors.hard_disk_size}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                {' '}
                                <Typography>
                                    Hard Disk Type<span className='error'>*</span>
                                </Typography>
                                <FormControl sx={{ minWidth: 320 }} required>
                                    <Select
                                        id='hard_disk_type'
                                        name='hard_disk_type'
                                        label='hard_disk_type'
                                        error={errors.hard_disk_type}
                                        onFocus={() => handleError(null, 'hard_disk_type')}
                                        helperText={errors.hard_disk_type}
                                        disabled={props.method === 'return'}
                                        defaultValue={props.assetDetails?.hard_disk_type}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value='' />
                                        {HARD_DISK_TYPES.map((type) => (
                                            <MenuItem key={type} value={type}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <Typography variant='caption' color='error'>
                                        {errors.hard_disk_type}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                {' '}
                                <Typography>
                                    Company<span className='error'>*</span>
                                </Typography>
                                <TextField
                                    sx={{ minWidth: 320 }}
                                    required
                                    id='company'
                                    name='company'
                                    error={errors.company}
                                    onFocus={() => handleError(null, 'company')}
                                    helperText={errors.company}
                                    defaultValue={props.assetDetails?.company}
                                    onChange={handleChange}
                                    disabled={props.method === 'return'}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                {' '}
                                <Typography>
                                    Amount or invoice wise<span className='error'>*</span>
                                </Typography>
                                <TextField
                                    sx={{ minWidth: 320 }}
                                    required
                                    id='amount_or_invoice_wise'
                                    name='amount_or_invoice_wise'
                                    type='number'
                                    error={errors.amount_or_invoice_wise}
                                    onFocus={() => handleError(null, 'amount_or_invoice_wise')}
                                    helperText={errors.amount_or_invoice_wise}
                                    defaultValue={props.assetDetails?.amount_or_invoice_wise}
                                    onChange={handleChange}
                                    disabled={props.method === 'return'}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                {' '}
                                <Typography>
                                    Warranty Date<span className='error'>*</span>
                                </Typography>
                                <TextField
                                    sx={{ minWidth: 320 }}
                                    required
                                    id='warranty_date'
                                    name='warranty_date'
                                    type='date'
                                    error={Boolean(errors.warranty_date)}
                                    helperText={errors.warranty_date || ''}
                                    defaultValue={props.assetDetails?.warranty_date}
                                    onChange={handleWarrantyDateChange} // Use the specific handler here
                                    disabled={props.method === 'return'}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                {' '}
                                <Typography>
                                    Asset Approved At<span className='error'>*</span>
                                </Typography>
                                <TextField
                                    sx={{ minWidth: 320 }}
                                    required
                                    id='asset_approved_at'
                                    name='asset_approved_at'
                                    type='date'
                                    onFocus={() => handleError(null, 'asset_approved_at')}
                                    error={errors.asset_approved_at}
                                    helperText={errors.asset_approved_at}
                                    defaultValue={props.assetDetails?.asset_approved_at}
                                    onChange={handleChange}
                                    disabled={props.method === 'return'}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                {' '}
                                <Typography>Asset Given At</Typography>
                                <TextField
                                    sx={{ minWidth: 320 }}
                                    required
                                    id='asset_given_at'
                                    name='asset_given_at'
                                    type='date'
                                    error={errors.asset_given_at}
                                    onFocus={() => handleError(null, 'asset_given_at')}
                                    helperText={errors.asset_given_at}
                                    defaultValue={props.assetDetails?.asset_given_at}
                                    onChange={handleChange}
                                    disabled={props.method === 'return'}
                                />
                            </Grid>
                            {props.method === 'return' && (
                                <Grid item xs={6}>
                                    {' '}
                                    <Typography>
                                        Asset Return At<span className='error'>*</span>
                                    </Typography>
                                    <TextField
                                        sx={{ minWidth: 320 }}
                                        required
                                        id='asset_return_at'
                                        name='asset_return_at'
                                        type='date'
                                        onFocus={() => handleError(null, 'asset_return_at')}
                                        error={errors.asset_return_at}
                                        helperText={errors.asset_return_at}
                                        defaultValue={props.assetDetails?.asset_return_at}
                                        onChange={handleChange}
                                    />
                                </Grid>
                            )}
                            <Grid item xs={6}>
                                {' '}
                                <Typography>Received At</Typography>
                                <TextField
                                    sx={{ minWidth: 320 }}
                                    required
                                    id='asset_received_at'
                                    name='asset_received_at'
                                    type='date'
                                    onFocus={() => handleError(null, 'asset_received_at')}
                                    error={errors.asset_received_at}
                                    helperText={errors.asset_received_at}
                                    defaultValue={props.assetDetails?.asset_received_at}
                                    onChange={handleChange}
                                    disabled={props.method === 'return'}
                                />
                            </Grid>
                            {props.method === 'edit' && (
                                <Grid item xs={6}>
                                    {' '}
                                    <Typography>
                                        Status<span className='error'>*</span>
                                    </Typography>
                                    <FormControl sx={{ minWidth: 320 }} required>
                                        <Select
                                            id='status'
                                            name='status'
                                            label='Status'
                                            error={errors.status}
                                            onFocus={() => handleError(null, 'status')}
                                            helperText={errors.status}
                                            defaultValue={props.assetDetails?.status}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value='' />
                                            {ASSET_STATUS.map((type) => (
                                                <MenuItem key={type} value={type}>
                                                    {type}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            )}

                            <Grid item xs={6}>
                                {' '}
                                <Typography>
                                    Assignee Comment<span className='error'>*</span>
                                </Typography>
                                <TextField
                                    sx={{ minWidth: 320 }}
                                    required
                                    id='assignee_comment'
                                    name='assignee_comment'
                                    error={errors.assignee_comment}
                                    onFocus={() => handleError(null, 'assignee_comment')}
                                    helperText={errors.assignee_comment}
                                    defaultValue={props.assetDetails?.assignee_comment}
                                    onChange={handleChange}
                                    disabled={props.method === 'return'}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                {' '}
                                <Typography>Received Comment</Typography>
                                <TextField
                                    sx={{ minWidth: 320 }}
                                    required
                                    id='received_comment'
                                    name='received_comment'
                                    error={errors.received_comment}
                                    onFocus={() => handleError(null, 'received_comment')}
                                    helperText={errors.received_comment}
                                    defaultValue={props.assetDetails?.received_comment}
                                    onChange={handleChange}
                                    disabled={props.method === 'return'}
                                />
                            </Grid>
                            {props.method === 'return' && (
                                <Grid item xs={6}>
                                    {' '}
                                    <Typography>
                                        Return Comment<span className='error'>*</span>
                                    </Typography>
                                    <TextField
                                        sx={{ minWidth: 320 }}
                                        required
                                        id='return_comment'
                                        name='return_comment'
                                        onFocus={() => handleError(null, 'return_commnet')}
                                        error={errors.return_comment}
                                        helperText={errors.return_comment}
                                        defaultValue={props.assetDetails?.return_comment}
                                        onChange={handleChange}
                                    />
                                </Grid>
                            )}

                            <Grid item xs={6}>
                                {' '}
                                <Typography>Delivered To</Typography>
                                <TextField
                                    sx={{ minWidth: 320 }}
                                    required
                                    id='delivered_to'
                                    name='delivered_to'
                                    error={errors.delivered_to}
                                    onFocus={() => handleError(null, 'delivered_to')}
                                    helperText={errors.delivered_to}
                                    defaultValue={props.assetDetails?.delivered_to}
                                    onChange={handleChange}
                                    disabled={props.method === 'return'}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>
                                    Department<span className='error'>*</span>
                                </Typography>
                                <FormControl sx={{ minWidth: 320 }} required>
                                    <Select
                                        id='department'
                                        name='department'
                                        label='department'
                                        error={errors.department}
                                        onFocus={() => handleError(null, 'status')}
                                        helperText={errors.department}
                                        defaultValue={props.assetDetails?.department}
                                        onChange={handleDepartmentChange}
                                    >
                                        {departments.map((department) => (
                                            <MenuItem
                                                key={department.id}
                                                value={department.departmentname}
                                            >
                                                {department.departmentname}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <Typography variant='caption' color='error'>
                                        {errors.department}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>
                                    Project<span className='error'>*</span>
                                </Typography>
                                <FormControl sx={{ minWidth: 320 }} required>
                                    <Select
                                        id='project'
                                        name='project'
                                        label='project'
                                        error={errors.project}
                                        onFocus={() => handleError(null, 'project')}
                                        helperText={errors.project}
                                        defaultValue={props.assetDetails?.project}
                                        onChange={handleProjectChange}
                                    >
                                        {projectNames.map((project) => (
                                            <MenuItem key={project.id} value={project.name}>
                                                {project.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <Typography variant='caption' color='error'>
                                        {errors.project}
                                    </Typography>
                                </FormControl>
                            </Grid>

                            <Grid item xs={6} container alignItems='flex-start'>
                                <Typography>Handovered By hand/Courier Number</Typography>
                                <TextField
                                    sx={{ minWidth: 320 }}
                                    required
                                    id='handovered_type'
                                    name='handovered_type'
                                    error={errors.handovered_type}
                                    onFocus={() => handleError(null, 'handovered_type')}
                                    helperText={errors.handovered_type}
                                    defaultValue={props.assetDetails?.handovered_type}
                                    onChange={handleChange}
                                    disabled={props.method === 'return'}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography sx={{ paddingTop: '4px' }}>
                                    EMP Code<span className='error'>*</span>
                                </Typography>
                                <Autocomplete
                                    options={employees}
                                    getOptionLabel={(option) => option.employeeid.toString()}
                                    value={
                                        employees.find(
                                            (emp) => emp.employeeid === selectedEmployeeId
                                        ) || null
                                    }
                                    onChange={handleEmployeeChange}
                                    disabled={props.method === 'return' || props.method === 'edit'}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            sx={{ minWidth: 320 }}
                                            required
                                            id='emp_code'
                                            name='emp_code'
                                            error={errors.emp_code}
                                            onFocus={() => props.handleError(null, 'emp_code')}
                                            helperText={errors?.emp_code}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {employeesLoading ? (
                                                            <CircularProgress
                                                                color='inherit'
                                                                size={20}
                                                            />
                                                        ) : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                )
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                {' '}
                                <Typography>Remarks if Any</Typography>
                                <TextField
                                    sx={{ minWidth: 320 }}
                                    required
                                    id='remarks'
                                    name='remarks'
                                    error={errors.remarks}
                                    onFocus={() => handleError(null, 'remarks')}
                                    helperText={errors.remarks}
                                    defaultValue={props.assetDetails?.remarks}
                                    onChange={handleChange}
                                    disabled={props.method === 'return'}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <div></div>
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
                    {isLoading ? (
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
                    onClick={handleClose}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
            </Box>
        </Modal>
    );
}
