import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import moment from 'moment';
import axios from 'axios';
import './Timeoff.css';
import { createLeaves, updateLeave } from '../actions/Timeoff-actions';
import { manageError } from '../../core/actions/common-actions';
import { AppConfigProps } from '../../core/settings/app-config';
import AppUtils from '../../core/helpers/app-utils';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '0px solid #000',
    boxShadow: 2
};

const AddLeave = (props) => {
    const history = useHistory();
    const [leaveValues, setLeaveValues] = useState({
        leave_type: '',
        from_date: '',
        to_date: '',
        no_of_days: '',
        status: 'Pending',
        description: '',
        rejectreason: '',
        user_id: '',
        email: ''
        // approval_id: 1
    });

    const [errors, setErrors] = useState({});
    // const [isSaveButtonClicked, setSaveButtonClicked] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            setLeaveValues((prevValues) => ({
                ...prevValues,
                user_id: userId
            }));
        }

        if (props.leaveDetails) {
            setLeaveValues((prevValues) => ({
                ...prevValues,
                leave_type: props.leaveDetails.leave_type || '',
                from_date: props.leaveDetails.from_date || '',
                to_date: props.leaveDetails.to_date || '',
                no_of_days: props.leaveDetails.no_of_days || '',
                status: props.leaveDetails.status || '',
                description: props.leaveDetails.description || '',
                rejectreason: props.leaveDetails.rejectreason || '',
                user_id: props.leaveDetails.user_id || '',
                email: props.leaveDetails.email || ''
            }));
        }
    }, [props.leaveDetails]);

    const handleChange = async (event) => {
        const { name, value } = event.target;

        // Clear error message for the current input field
        setErrors((prevState) => ({ ...prevState, [name]: null }));

        if (name === 'from_date' || name === 'to_date') {
            const fromDate = name === 'from_date' ? value : leaveValues.from_date;
            const toDate = name === 'to_date' ? value : leaveValues.to_date;

            const numberOfDays = calculateNumberOfDays(fromDate, toDate);

            await setLeaveValues((prevValues) => ({
                ...prevValues,
                [name]: value,
                no_of_days: numberOfDays.toString()
            }));
        } else {
            await setLeaveValues((prevValues) => ({
                ...prevValues,
                [name]: value
            }));
        }
    };

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

    const sendEmail = async () => {
        const token = AppUtils.getIdentityIdToken();
        const formData = new FormData();

        formData.append('subject', 'Leave');
        formData.append('leave_type', leaveValues.leave_type.toString());
        formData.append('from_date', leaveValues.from_date.toString());
        formData.append('to_date', leaveValues.to_date.toString());
        formData.append('no_of_days', leaveValues.no_of_days.toString());
        formData.append('status', leaveValues.status.toString());
        formData.append('description', leaveValues.description.toString());
        formData.append('rejectreason', leaveValues.rejectreason.toString());
        // formData.append('user_id', leaveValues.user_id?.id.toString());

        // Conditionally append user_id based on its type
        const userId =
            leaveValues.user_id && typeof leaveValues.user_id === 'object'
                ? leaveValues.user_id.id.toString()
                : leaveValues.user_id;
        formData.append('user_id', userId);

        // formData.append('approval_id', '1');

        try {
            const response = await axios.post(
                AppConfigProps.serverRoutePrefix + `/api/v1/timeoff`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            // console.log('Response:', response.data);
        } catch (error) {
            // console.error('Error:', error);
            // Handle error
        }

        ClearedValues();
    };

    const validate = () => {
        let isValid = true;
        if (!leaveValues.leave_type) {
            handleError('Please select leave type', 'leave_type');
            isValid = false;
        }
        if (!leaveValues.from_date) {
            handleError('Please enter from date', 'from_date');
            isValid = false;
        }
        if (!leaveValues.to_date) {
            handleError('Please enter to date', 'to_date');
            isValid = false;
        }
        if (!leaveValues.description) {
            handleError('Please enter description', 'description');
            isValid = false;
        } else if (leaveValues.description.trim().length < 5) {
            handleError('Description must be at least 5 characters long', 'description');
            isValid = false;
        }

        if (isValid) {
            setErrors({});
        }

        return isValid;
    };

    const handleError = (error, input) => {
        setErrors((prevState) => ({ ...prevState, [input]: error }));
    };

    const handleSubmit = async () => {
        if (!isLoading) {
            // setSaveButtonClicked(true);
            setLoading(true);

            if (validate()) {
                if (props.method === 'add') {
                    addLeave();
                } else if (props.method === 'edit') {
                    leaveUpdate();
                }
            } else {
                // setSaveButtonClicked(false);
                setLoading(false);
            }
        }
    };

    const addLeave = async () => {
        let leaveObj = {
            leave_type: leaveValues.leave_type,
            from_date: AppUtils.getDateTimeFormat(leaveValues.from_date),
            to_date: AppUtils.getDateTimeFormat(leaveValues.to_date),
            no_of_days: leaveValues.no_of_days,
            status: leaveValues.status,
            approvedby: leaveValues.approvedby,
            description: leaveValues.description,
            // approval_id: 1,
            user_id: leaveValues.user_id
        };

        setLoading(true);

        createLeaves(leaveObj)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    await sendEmail();
                    props.handleClose();
                    props.reloadLeave(userId);
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

    const leaveUpdate = async () => {
        let leaveId = props.leaveDetails?.id;
        let userid = props.leaveDetails?.user_id?.id;
        // console.log(userid);

        let formattedFromDate = moment(leaveValues.from_date).format('YYYY-MM-DD');
        let formattedToDate = moment(leaveValues.to_date).format('YYYY-MM-DD');

        let leaveObj = {
            leave_type: leaveValues.leave_type
                ? leaveValues.leave_type
                : props.leaveDetails?.leave_type,
            // from_date: leaveValues.from_date
            //     ? leaveValues.from_date
            //     : props.leaveDetails?.from_date,
            // to_date: leaveValues.to_date ? leaveValues.to_date : props.leaveDetails?.to_date,
            from_date: formattedFromDate,
            to_date: formattedToDate,
            no_of_days: leaveValues.no_of_days
                ? leaveValues.no_of_days
                : props.leaveDetails?.no_of_days.toString(),
            status: leaveValues.status ? leaveValues.status : props.leaveDetails?.status,
            // approvedby: leaveValues.approvedby
            //     ? leaveValues.approvedby
            //     : props.leaveDetails?.approvedby,
            description: leaveValues.description
                ? leaveValues.description
                : props.leaveDetails?.description
        };
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
                    await sendEmail();
                    props.handleClose();
                    props.reloadLeave(userId);
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

    const ClearedValues = () => {
        setLeaveValues({
            leave_type: '',
            from_date: '',
            to_date: '',
            no_of_days: '',
            status: 'Pending',
            description: '',
            rejectreason: '',
            user_id: userId,
            email: ''
            // approval_id: 1
        });
    };
    const handleClose = () => {
        setErrors({});
        props.handleClose();
        ClearedValues();
    };

    const leave = ['SickLeave', 'Lop', 'Casual'];
    const statusOptions = ['Approved', 'Rejected', 'Pending'];

    return (
        <Modal
            aria-labelledby='spring-modal-title'
            aria-describedby='spring-modal-description'
            open={props.open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={props.Backdrop}
            BackdropProps={{ timeout: 500 }}
        >
            <Box component='form' sx={style} noValidate autoComplete='off'>
                <AppBar
                    position='static'
                    sx={{ width: 600, height: 60, backgroundcolor: ' #DEECF4' }}
                >
                    <CardHeader title={props.method === 'add' ? 'Add Leave' : 'Edit Leave'} />
                    <IconButton
                        sx={{
                            position: 'absolute',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginLeft: '550px',
                            marginTop: '10px',
                            color: '#0070AC'
                        }}
                        onClick={handleClose}
                    >
                        <HighlightOffIcon />
                    </IconButton>
                </AppBar>
                <Card sx={{ minWidth: 500, boxShadow: 0 }}>
                    <CardContent>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            <Grid item xs={6}>
                                <Typography>
                                    Leave Type<span className='error'>*</span>
                                </Typography>
                                <TextField
                                    sx={{ minWidth: 270 }}
                                    select
                                    // required
                                    id='leave_type'
                                    name='leave_type'
                                    type='text'
                                    onFocus={() => handleError(null, 'leave_type')}
                                    // defaultValue={props.leaveDetails?.leave_type}
                                    value={leaveValues.leave_type}
                                    error={errors.leave_type}
                                    SelectProps={{ native: true }}
                                    onChange={handleChange}
                                    helperText={errors.leave_type}
                                >
                                    <option value='' />
                                    {leave.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </TextField>
                                {/* {errors.leave_type && (
                                    <Typography variant='caption' color='error'>
                                        {errors.leave_type}
                                    </Typography>
                                )} */}
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>
                                    FromDate<span className='error'>*</span>
                                </Typography>
                                <TextField
                                    sx={{ minWidth: 270 }}
                                    // required
                                    id='from_date'
                                    name='from_date'
                                    type='date'
                                    onFocus={() => handleError(null, 'from_date')}
                                    error={errors.from_date}
                                    // value={leaveValues.from_date}
                                    value={
                                        props.method === 'edit'
                                            ? moment(leaveValues.from_date).format('YYYY-MM-DD')
                                            : leaveValues.from_date
                                    }
                                    // defaultValue={
                                    //     props.leaveDetails?.from_date
                                    //         ? moment(props.leaveDetails.from_date).format(
                                    //               'YYYY-MM-DD'
                                    //           )
                                    //         : ''
                                    // }
                                    onChange={handleChange}
                                    helperText={errors.from_date}
                                    InputProps={{
                                        inputProps: {
                                            min: moment().format('YYYY-MM-DD') // Set minimum date to current date
                                        }
                                    }}
                                />
                                {/* {errors.from_date && (
                                    <Typography variant='caption' color='error'>
                                        {errors.from_date}
                                    </Typography>
                                )} */}
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>
                                    To Date<span className='error'>*</span>
                                </Typography>
                                <TextField
                                    sx={{ minWidth: 270 }}
                                    // required
                                    id='to_date'
                                    name='to_date'
                                    type='date'
                                    onFocus={() => handleError(null, 'to_date')}
                                    error={errors.to_date}
                                    // value={leaveValues.to_date}
                                    value={
                                        props.method === 'edit'
                                            ? moment(leaveValues.to_date).format('YYYY-MM-DD')
                                            : leaveValues.to_date
                                    }
                                    // defaultValue={
                                    //     props.leaveDetails?.to_date
                                    //         ? moment(props.leaveDetails.to_date).format(
                                    //               'YYYY-MM-DD'
                                    //           )
                                    //         : ''
                                    // }
                                    onChange={handleChange}
                                    helperText={errors.to_date}
                                    InputProps={{
                                        inputProps: {
                                            // min: moment().format('YYYY-MM-DD'),
                                            min: leaveValues.from_date
                                                ? moment(leaveValues.from_date).format('YYYY-MM-DD')
                                                : moment().format('YYYY-MM-DD') // Set minimum date to selected "From Date" value
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>No Of Days</Typography>
                                <TextField
                                    sx={{ minWidth: 270 }}
                                    // required
                                    id='no_of_days'
                                    name='no_of_days'
                                    type='text'
                                    onFocus={() => handleError(null, 'no_of_days')}
                                    error={errors.no_of_days}
                                    value={leaveValues.no_of_days}
                                    onChange={handleChange}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>Status</Typography>
                                <TextField
                                    sx={{ minWidth: 270 }}
                                    select
                                    required
                                    id='status'
                                    name='status'
                                    disabled={!props.isRequests}
                                    value={leaveValues.status || 'pending'}
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
                                    sx={{ minWidth: 270 }} // You can adjust minHeight if needed
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
                                        sx={{ minWidth: 270 }}
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
                {/* {isLoading && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <CircularProgress sx={{ marginBottom: 2 }} />
                        <Typography variant='subtitle1'>Sending Emails...</Typography>
                    </Box>
                )} */}
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
                    onClick={handleSubmit}
                    // disabled={isSaveButtonClicked}
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
};

export default AddLeave;
