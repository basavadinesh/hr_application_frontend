// Imports for React library and hooks
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

// Imports for material ui for pre-designed components
import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

// Imports for HTTP requests library and custom API call hooks
import axios from 'axios';
import { createLeaves, updateLeave } from '../../time-offs/actions/Timeoff-actions';

// Imports for configuration settings and constants
import AppUtils from '../../core/helpers/app-utils';
import { manageError } from '../../core/actions/common-actions';
import { AppConfigProps } from '../../core/settings/app-config';

// Import for Date conversion
import moment from 'moment';

// Common Style setting
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    boxShadow: 2
};

// Function for rendering Form for time-offs
export default function AddTimeOff(props) {
    // Constant definition from useHistory hook
    const history = useHistory();

    // Initial state setting of leaveValues object
    const [leaveValues, setLeaveValues] = useState({
        leave_type: props.leaveDetails?.leave_type || '',
        from_date: props.leaveDetails?.from_date || '',
        to_date: props.leaveDetails?.to_date || '',
        no_of_days: props.leaveDetails?.no_of_days || '',
        status: props.leaveDetails?.status || '',
        description: props.leaveDetails?.description || '',
        rejectreason: props.leaveDetails?.rejectreason || ''
    });

    // Initial State setting of loading and errors
    const [isSaveButtonClicked, setSaveButtonClicked] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Pre defined lists for drop downs
    const leaveTypes = ['SickLeave', 'Lop', 'Casual'];
    const statusOptions = ['Approved', 'Rejected', 'Pending'];

    // useEffect hook call to set the leave values when selected method is edit
    useEffect(() => {
        if (props.method === 'edit' && props.leaveDetails) {
            setLeaveValues({
                from_date: moment(props.leaveDetails.from_date).format('YYYY-MM-DD'),
                to_date: moment(props.leaveDetails.to_date).format('YYYY-MM-DD'),
                leave_type: props.leaveDetails?.leave_type || '',

                no_of_days: props.leaveDetails?.no_of_days || '',
                status: props.leaveDetails?.status || '',
                description: props.leaveDetails?.description || '',
                rejectreason: props.leaveDetails?.rejectreason || ''
            });
        }
    }, [props.method, props.leaveDetails]);

    // useEffect hook call to set the state of button clicked
    useEffect(() => {
        setSaveButtonClicked(false);
    }, [props]);

    // Handler function to handle form field changes
    const handleChange = (event) => {
        const { name, value } = event.target;
        console.log(name);
        console.log(value);

        // If the status is changed to 'Approved', set rejectreason to an empty string
        if (name === 'status' && value === 'Approved') {
            setLeaveValues((prevValues) => ({
                ...prevValues,
                rejectreason: ''
            }));

            console.log(leaveValues.rejectreason);
        }

        if (name === 'from_date' || name === 'to_date') {
            const fromDate = name === 'from_date' ? value : leaveValues.from_date;
            const toDate = name === 'to_date' ? value : leaveValues.to_date;

            const numberOfDays = calculateNumberOfDays(fromDate, toDate);

            setLeaveValues((prevValues) => ({
                ...prevValues,
                [name]: value,
                no_of_days: numberOfDays.toString()
            }));
        } else {
            setLeaveValues((prevValues) => ({
                ...prevValues,
                [name]: value
            }));
        }
    };

    // Handler function to open and close Form Modal
    const handleCloseModal = () => {
        props.handleClose();
        setErrors({});
        setLeaveValues({});
    };

    // Handler function for form submission
    const handleSubmit = () => {
        console.log('message');
        if (!isSaveButtonClicked && !isLoading) {
            setSaveButtonClicked(true);

            if (props.method === 'add') {
                addLeave();
            } else if (props.method === 'edit') {
                leaveUpdate();
            }
        }
    };

    // Handler function to calculate number of days field
    const calculateNumberOfDays = (fromDate, toDate) => {
        const start = moment(fromDate);
        const end = moment(toDate);

        if (end.isSameOrAfter(start)) {
            const numberOfDays = end.diff(start, 'days') + 1;
            return numberOfDays;
        } else {
            return 0;
        }
    };

    // Handle error messages
    const handleError = (error, input) => {
        setErrors((prevState) => ({ ...prevState, [input]: error }));
    };

    // Validate function to validate all form fields
    const validate = () => {
        let isValid = true;
        const errors = {};

        if (!leaveValues.leave_type) {
            errors.leave_type = 'Please input leave_type';
            isValid = false;
        }
        if (!leaveValues.from_date) {
            errors.from_date = 'Please input from_date';
            isValid = false;
        }
        if (!leaveValues.to_date) {
            errors.to_date = 'Please input to_date';
            isValid = false;
        }
        if (!leaveValues.no_of_days) {
            errors.no_of_days = 'Please input no_of_days';
            isValid = false;
        }
        if (!leaveValues.description || leaveValues.description.length < 5) {
            errors.description = 'Description must be at least 5 characters';
            isValid = false;
        }
        if (props.method === 'edit' && !leaveValues.status) {
            errors.status = 'Please input status';
            isValid = false;
        }
        if (
            props.method === 'edit' &&
            leaveValues.status === 'Rejected' &&
            !leaveValues.rejectreason
        ) {
            errors.rejectreason = 'Please input Reject Reason';
            isValid = false;
        }

        setErrors(errors);
        if (isValid) {
            handleSubmit();
        }
    };

    // Function Definition to add time-off
    const addLeave = () => {
        const userId = localStorage.getItem('userId');
        const leaveObj = {
            leave_type: leaveValues.leave_type,
            from_date: AppUtils.getDateTimeFormat(leaveValues.from_date),
            to_date: AppUtils.getDateTimeFormat(leaveValues.to_date),
            no_of_days: leaveValues.no_of_days,
            status: 'Pending',
            approvedby: leaveValues.approvedby,
            description: leaveValues.description,
            user_id: userId,
            rejectreason: leaveValues.rejectreason
        };

        setLoading(true);

        createLeaves(leaveObj)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    props.handleClose();
                    handleCloseModal();
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

    // Function definition to update employees time-offs
    const leaveUpdate = () => {
        const leaveId = props.leaveDetails?.id;
        const userId = props.leaveDetails?.id;

        const leaveObj = {
            leave_type: props.leaveDetails?.leave_type,
            from_date: moment(props.leaveDetails?.from_date, 'MM/DD/YYYY').format('YYYY-MM-DD'),
            to_date: moment(props.leaveDetails?.to_date, 'MM/DD/YYYY').format('YYYY-MM-DD'),
            no_of_days: props.leaveDetails?.no_of_days,
            status: leaveValues.status ? leaveValues.status : props.leaveDetails?.status,
            approvedby: props.leaveDetails?.approvedby,
            description: leaveValues.description
                ? leaveValues.description
                : props.leaveDetails?.description,
            user_id: userId
        };

        // Only add rejectreason if the status is not 'Approved'
        if (leaveValues.status !== 'Approved' && leaveValues.status !== 'Pending') {
            leaveObj.rejectreason = leaveValues.rejectreason
                ? leaveValues.rejectreason
                : props.leaveDetails?.rejectreason;
        } else {
            // If status is 'Approved' or 'Pending', set rejectreason to an empty string
            leaveObj.rejectreason = '';
        }

        setLoading(true);

        updateLeave(leaveId, leaveObj)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    await sendEmail(res.data);
                    props.handleClose();
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

    // Function definition to send email update for time-offs
    const sendEmail = async (data) => {
        const formData = new FormData();
        formData.append('leave_type', String(data.leave_type));
        formData.append('from_date', String(data.from_date));
        formData.append('to_date', String(data.to_date));
        formData.append('no_of_days', String(data.no_of_days));
        formData.append('status', String(data.status));
        formData.append('description', String(data.description));
        formData.append('rejectreason', String(data.rejectreason));
        formData.append('user_id', String(data.user_id.id));

        try {
            await axios.post(
                AppConfigProps.serverRoutePrefix + '/api/v1/adminSendToEmployee',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
        } catch (error) {
            await manageError(error.message, history);
        }
    };

    //Form for adding and updating time-offs
    return (
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
                    sx={{ width: 700, height: 60, backgroundColor: '#DEECF4' }}
                >
                    <CardHeader title={props.method === 'add' ? 'Add Leave' : 'Edit Leave'} />
                    <IconButton
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: '#0070AC'
                        }}
                        onClick={handleCloseModal}
                    >
                        <HighlightOffIcon />
                    </IconButton>
                </AppBar>
                <Card sx={{ boxShadow: 0 }}>
                    <CardContent>
                        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            <Grid item xs={6}>
                                <Typography>
                                    Leave Type<span className='error'>*</span>
                                </Typography>
                                <TextField
                                    sx={{ minWidth: 320 }}
                                    select
                                    required
                                    id='leave_type'
                                    name='leave_type'
                                    value={leaveValues.leave_type}
                                    error={!!errors.leave_type}
                                    onFocus={() => handleError(null, 'leave_type')}
                                    helperText={errors.leave_type}
                                    SelectProps={{ native: true }}
                                    onChange={handleChange}
                                >
                                    <option value='' />
                                    {leaveTypes.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>
                                    From Date<span className='error'>*</span>
                                </Typography>
                                <TextField
                                    sx={{ minWidth: 320 }}
                                    required
                                    id='from_date'
                                    name='from_date'
                                    type='date'
                                    value={leaveValues.from_date}
                                    onFocus={() => handleError(null, 'from_date')}
                                    error={!!errors.from_date}
                                    helperText={errors.from_date}
                                    onChange={handleChange}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>
                                    To Date<span className='error'>*</span>
                                </Typography>
                                <TextField
                                    sx={{ minWidth: 320 }}
                                    required
                                    id='to_date'
                                    name='to_date'
                                    type='date'
                                    value={leaveValues.to_date}
                                    onFocus={() => handleError(null, 'to_date')}
                                    error={!!errors.to_date}
                                    helperText={errors.to_date}
                                    onChange={handleChange}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>Number of Days</Typography>
                                <TextField
                                    sx={{ minWidth: 320 }}
                                    id='no_of_days'
                                    name='no_of_days'
                                    type='number'
                                    value={leaveValues.no_of_days}
                                    disabled
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>Status</Typography>
                                <TextField
                                    sx={{ minWidth: 320 }}
                                    select
                                    required
                                    id='status'
                                    name='status'
                                    disabled={props.method === 'add'}
                                    value={props.method === 'add' ? 'Pending' : leaveValues.status}
                                    error={!!errors.status}
                                    helperText={errors.status}
                                    SelectProps={{ native: true }}
                                    onChange={handleChange}
                                >
                                    <option value='' />
                                    {/* {statusOptions
                                        .filter(
                                            (option) =>
                                                !(props.method === 'edit' && option === 'Pending')
                                        )
                                        .map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))} */}
                                    {statusOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>
                                    Description<span className='error'>*</span>
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    required // Increased the number of rows for a larger text area
                                    sx={{ minWidth: 320 }} // You can adjust minHeight if needed
                                    id='description'
                                    name='description'
                                    error={!!errors.description}
                                    onFocus={() => handleError(null, 'description')}
                                    helperText={errors.description}
                                    value={leaveValues.description}
                                    onChange={handleChange}
                                />
                            </Grid>

                            {props.method === 'edit' && leaveValues.status === 'Rejected' && (
                                <Grid item xs={6}>
                                    <Typography>
                                        Reject Reason<span className='error'>*</span>
                                    </Typography>
                                    <TextField
                                        sx={{ minWidth: 320 }}
                                        rows={4}
                                        id='rejectreason'
                                        name='rejectreason'
                                        value={leaveValues.rejectreason}
                                        error={!!errors.rejectreason}
                                        helperText={errors.rejectreason}
                                        onChange={handleChange}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </CardContent>
                </Card>

                <Box sx={{ textAlign: 'right', marginTop: '20px' }}>
                    <Button
                        style={{
                            marginRight: '20px',
                            marginBottom: '20px',
                            borderRadius: '40px',
                            backgroundColor: '#0070ac',
                            color: '#fff'
                        }}
                        variant='contained'
                        onClick={() => {
                            validate();
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
            </Box>
        </Modal>
    );
}
