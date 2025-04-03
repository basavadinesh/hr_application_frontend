import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import axios from 'axios';

const leaveTypes = [
    { type: 'Sick', color: '#5072A7' },
    { type: 'Lop', color: '#0039a6' },
    { type: 'Casual', color: '#13274F' }
];

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600, // Increased width
    bgcolor: 'background.paper',
    border: 'px solid #000',
    boxShadow: 2
};

export default function AddAllowance(props) {
    const [formValues, setFormValues] = useState({
        sick: '',
        lop: '',
        casual: ''
    });
    const [errors, setErrors] = useState({});
    const [isVerification, setIsVerification] = useState(false);
    const [status, setStatus] = useState(null); // Added state for status
    const [statusMessage, setStatusMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // Added state for error message

    useEffect(() => {
        if (props.method === 'edit' && props.leaveDetails) {
            setFormValues({
                sick: props.leaveDetails.sick || '',
                lop: props.leaveDetails.lop || '',
                casual: props.leaveDetails.casual || ''
            });
        }
    }, [props.leaveDetails]);

    console.log(props.method);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevState) => ({
            ...prevState,
            [name]: value
        }));
        if (errors[name]) {
            setErrors((prevState) => ({
                ...prevState,
                [name]: ''
            }));
        }
    };

    const handleFocus = (e) => {
        const { name } = e.target;
        if (errors[name]) {
            setErrors((prevState) => ({
                ...prevState,
                [name]: ''
            }));
        }
    };

    const validate = () => {
        let isValid = true;
        const newErrors = {};
        if (!formValues.sick) {
            newErrors.sick = 'Please enter Sick leave days';
            isValid = false;
        }
        if (!formValues.lop) {
            newErrors.lop = 'Please enter LOP leave days';
            isValid = false;
        }
        if (!formValues.casual) {
            newErrors.casual = 'Please enter Casual leave days';
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = () => {
        if (validate()) {
            setIsVerification(true);
        }
    };

    const postLeaveAllowance = async (leaveAllowance) => {
        try {
            const response = await axios.post('/api/v1/leave-allowances', leaveAllowance);
            console.log('Leave Allowance Created Successfully!', response.data);
            return response.data;
        } catch (error) {
            console.error('Error creating leave allowance', error);
            const errorMsg = error.response?.data || 'Failed to create leave allowance. Please try again later.';
            throw new Error(errorMsg);
        }
    };

    const putLeaveAllowance = async (id, leaveAllowance) => {
        try {
            const response = await axios.put(`/api/v1/leave-allowances/${id}`, leaveAllowance);
            console.log('Leave Allowance Updated Successfully!', response.data);
            return response.data;
        } catch (error) {
            console.error('Error updating leave allowance', error);
            const errorMsg = error.response?.data || 'Failed to update leave allowance. Please try again later.';
            throw new Error(errorMsg);
        }
    };

    const handleAuthorize = async () => {
        const leaveAllowance = {
            year: props.year,
            sickLeave: formValues.sick,
            lopLeave: formValues.lop,
            casualLeave: formValues.casual
        };

        if (props.method === 'add') {
            try {
                const result = await postLeaveAllowance(leaveAllowance);
                console.log('Success:', result);
                setStatus('success');
                setStatusMessage('Leave allowance created successfully.');
                setErrorMessage(''); // Clear any previous error messages
            } catch (error) {
                console.error('Error:', error.message);
                setStatus('failure');
                setStatusMessage('Create Failed');
                setErrorMessage(error.message); // Set the received error message
            }
        } else if (props.method === 'edit') {
            try {
                const result = await putLeaveAllowance(props.leaveDetails.id, leaveAllowance);
                console.log('Success:', result);
                setStatus('success');
                setStatusMessage('Leave allowance updated successfully.');
                setErrorMessage(''); // Clear any previous error messages
            } catch (error) {
                console.error('Error:', error.message);
                setStatus('failure');
                setStatusMessage('Update Failed');
                setErrorMessage(error.message); // Set the received error message
            }
        }
    };

    const handleBack = () => {
        setIsVerification(false);
    };

    const handleClose = () => {
        setFormValues({ sick: '', lop: '', casual: '' });
        props.onClose();
        setIsVerification(false);
        setStatus(null); // Reset status
        setStatusMessage('');
        setErrorMessage(''); // Reset error message
        props.onSuccess();
    };

    const handleRetry = () => {
        setStatus(null);
        setErrorMessage(''); // Clear the error message
        setIsVerification(false);
    };

    return (
        <Modal
            aria-labelledby='modal-title'
            aria-describedby='modal-description'
            open={props.open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={props.Backdrop}
            BackdropProps={{ timeout: 500 }}
        >
            <Box sx={style} component='form'>
                <AppBar
                    position='static'
                    sx={{ width: '100%', height: 50, backgroundColor: '#DEECF4' }}
                >
                    <CardHeader
                        title={isVerification ? (status ? 'Status' : 'Authorize Leave Allowances') : `Add Leave Allowances - ${props.year}`}
                    />
                    <IconButton
                        sx={{
                            position: 'absolute',
                            right: 10,
                            top: 10,
                            color: '#0070AC'
                        }}
                        onClick={handleClose}
                    >
                        <HighlightOffIcon />
                    </IconButton>
                </AppBar>
                <Box sx={{ padding: 3 }}>
                    {!status ? (
                        !isVerification ? (
                            <Box>
                                <Grid container rowSpacing={2} columnSpacing={2}>
                                    {leaveTypes
                                        .filter(leave => {
    if (props.editMethod) { // Check if editMethod exists
        const leaveType = leave.type || ''; // Handle undefined type
        return leaveType.toLowerCase() === props.editMethod.toLowerCase();
    }
    // If no editMethod exists, return all leaveAllowances
    return true;
})
                                        .map((leave, index) => (
                                            <Grid item xs={12} key={index}>
                                                <TextField
                                                    fullWidth
                                                    type='number'
                                                    label={`${leave.type} Leave`}
                                                    name={leave.type.toLowerCase()}
                                                    value={formValues[leave.type.toLowerCase()]}
                                                    onChange={handleChange}
                                                    onFocus={handleFocus}
                                                    error={!!errors[leave.type.toLowerCase()]}
                                                    helperText={errors[leave.type.toLowerCase()]}
                                                    InputProps={{
                                                        inputProps: { min: 0 }
                                                    }}
                                                    sx={{ marginBottom: 2 }}
                                                />
                                            </Grid>
                                        ))
                                    }
                                </Grid>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 3 }}>
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        onClick={handleSubmit}
                                        sx={{ padding: '8px 16px' }}
                                    >
                                        Proceed
                                    </Button>
                                </Box>
                            </Box>
                        ) : (
                            <Box>
                                <Box sx={{ marginBottom: 3 }}>
                                    {leaveTypes.map((leave, index) => (
                                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }} key={index}>
                                            <Box
                                                sx={{
                                                    width: 20,
                                                    height: 20,
                                                    borderRadius: '50%',
                                                    backgroundColor: leave.color,
                                                    marginRight: 1
                                                }}
                                            />
                                            <Typography variant='body1'>
                                                {`${leave.type} Leave: ${formValues[leave.type.toLowerCase()]}`}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                                <Typography variant='body2' color='textSecondary' sx={{ marginBottom: 3 }}>
                                    Please verify and click Authorize to set the leaves for the Year {props.year}.
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                                    <Button
                                        variant='outlined'
                                        onClick={handleBack}
                                        sx={{ padding: '8px 16px' }}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        onClick={handleAuthorize}
                                        sx={{ padding: '8px 16px' }}
                                    >
                                        Authorize
                                    </Button>
                                </Box>
                            </Box>
                        )
                    ) : (
                        <Box>
                            {status === 'success' ? (
                                <Box sx={{ textAlign: 'center' }}>
                                    <CheckCircleIcon sx={{ color: 'green', fontSize: 80, marginBottom: 2 }} />
                                    <Typography variant='h6' color='textPrimary'>{statusMessage}</Typography>
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        onClick={handleClose}
                                        sx={{ marginTop: 2 }}
                                    >
                                        Close
                                    </Button>
                                </Box>
                            ) : (
                                <Box sx={{ textAlign: 'center' }}>
                                    <ErrorIcon sx={{ color: 'red', fontSize: 80, marginBottom: 2 }} />
                                    <Typography variant='h6' color='textPrimary'>{statusMessage}</Typography>
                                    <Typography variant='body1' color='textSecondary'>{errorMessage}</Typography>
                                    <Button
                                        variant='contained'
                                        color='secondary'
                                        onClick={handleRetry}
                                        sx={{ marginTop: 2 }}
                                    >
                                        Retry
                                    </Button>
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        onClick={handleClose}
                                        sx={{ marginTop: 2, marginLeft: 2 }}
                                    >
                                        Close
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>
            </Box>
        </Modal>
    );
}
