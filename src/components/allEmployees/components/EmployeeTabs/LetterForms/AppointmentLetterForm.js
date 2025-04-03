import React from 'react';
import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import moment from 'moment';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { manageError } from 'components/core/actions/common-actions';
import { useDropzone } from 'react-dropzone';
import {
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    MenuItem,
    Autocomplete
} from '@mui/material';

// Styles for the modal box
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 675,
    bgcolor: 'background.paper',
    boxShadow: 24,
    padding: '20px',
    maxHeight: '90vh',
    overflowY: 'auto'
};

export const AppointmentLetterForm = ({
    open,
    employeeDetails,
    appointmentLetterDetails,
    employeeValues,
    setEmployeeValues,
    method,
    Backdrop,
    onClose,
    designations = [],
    managers = []
}) => {
    const _axiosSource = axios.CancelToken.source();
    const history = useHistory();
    const _cancelToken = { cancelToken: _axiosSource.token };
    const [appointmentValues, setAppointmentValues] = useState({
        userId: '',
        letterReferenceNumber: '',
        dateOfAppointment: '',
        nameAsPerAadhar: '',
        designation: '',
        ctc: '',
        issuedByDesignation: '',
        issuedByName: ''
    });
    const [errors, setErrors] = useState({});
    const [files, setFiles] = useState([]);
    const [existingFiles, setExistingFiles] = useState([]);
    const [fileErrors, setFileErrors] = useState(null);
    const [removedFiles, setRemovedFiles] = useState([]);

    const [managerOptions, setManagerOptions] = useState([]);

    useEffect(() => {
        if (managers && managers.length > 0) {
            setManagerOptions(
                managers.map((manager) => ({
                    label: `${manager.firstname} ${manager.lastname}  (${manager.employeeid})`, // Modified to include ID
                    managerEmail: manager.email,
                    id: manager.id
                }))
            );
        }
    }, [managers]);

    // Function to handle file drop
    const onDrop = (acceptedFiles) => {
        setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
        setFileErrors(null);
    };

    // Function to remove a file from the new list
    const removeFile = (fileIndex) => {
        setFiles((prevFiles) => prevFiles.filter((_, index) => index !== fileIndex));
    };

    // Function to remove an existing file from the list
    const removeExistingFile = (fileIndex, filename) => {
        setExistingFiles((prevFiles) => prevFiles.filter((_, index) => index !== fileIndex));
        setRemovedFiles((prevRemovedFiles) => [...prevRemovedFiles, filename]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: '.pdf,.doc,.docx,.png,.jpg,.jpeg', // Allowed file types
        multiple: true
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setAppointmentValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }));
        if (errors[name]) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: ''
            }));
        }
    };

    const validate = () => {
        let tempErrors = {};
        if (!appointmentValues.letterReferenceNumber) {
            tempErrors.letterReferenceNumber = 'This field must not be Empty';
        }
        if (!appointmentValues.dateOfAppointment) {
            tempErrors.dateOfAppointment = 'This field must not be empty';
        }
        if (!appointmentValues.ctc) {
            tempErrors.ctc = 'This field must not be empty';
        }
        if (!appointmentValues.issuedByDesignation) {
            tempErrors.issuedByDesignation = 'This field must not be empty';
        }
        if (!employeeValues.manager) {
            tempErrors.issuedByName = 'This field must not be empty';
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    // Function to create a new appointment letter
    const createAppointmentLetterInfo = async (formData, _cancelToken) => {
        try {
            console.log(formData.keys, formData.values);
            // Sending the POST request to create the appointment letter
            const response = await axios.post('hrletters/appointmentletter', formData, {
                cancelToken: _cancelToken.token,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return response.data;
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled:', error.message);
            } else {
                console.error('Error creating appointment letter:', error);
            }
        }
    };

    // Function to update an existing appointment letter
    const updateAppointmentLetterInfo = async (formData, _cancelToken) => {
        try {
            // Sending the PUT request to update the appointment letter
            const response = await axios.put(
                `hrletters/appointmentletter/${employeeDetails.id}`,
                formData,
                {
                    cancelToken: _cancelToken.token,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            return response.data;
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled:', error.message);
            } else {
                console.error('Error updating appointment letter:', error);
            }
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        if (validate()) {
            if (method === 'create') {
                addAppointmentLetter();
            } else if (method === 'update') {
                updateAppointmentLetter();
            }
        }
    };

    const ClearedValues = () => {
        setAppointmentValues({
            letterReferenceNumber: '',
            dateOfAppointment: '',
            nameAsPerAadhar: '',
            designation: '',
            ctc: '',
            issuedByDesignation: '',
            issuedByName: ''
        });
        setExistingFiles(null);
        setFiles(null);
    };

    const addAppointmentLetter = async () => {
        const formData = new FormData();
        formData.append('letterReferenceNumber', appointmentValues.letterReferenceNumber || '');
        if (appointmentValues.dateOfAppointment) {
            formData.append(
                'dateOfAppointment',
                moment(appointmentValues.dateOfAppointment).format('MM/DD/YYYY')
            );
        }
        formData.append('nameAsPerAadhaar', appointmentValues.nameAsPerAadhar || '');
        formData.append('designation', appointmentValues.designation || '');
        formData.append('ctc', parseFloat(appointmentValues.ctc) || 0);
        formData.append('issuedByDesignation', appointmentValues.issuedByDesignation || '');
        formData.append('issuedByName', employeeValues.manager || '');
        formData.append('userId', employeeDetails.id || '');
        files.forEach((file) => {
            formData.append('document', file);
        });

        try {
            const res = await createAppointmentLetterInfo(formData, _cancelToken);
            if (res) {
                handleClose();
            } else {
                await manageError(res, history);
            }
        } catch (err) {
            await manageError(err, history);
        }
    };

    const updateAppointmentLetter = async () => {
        const formData = new FormData();

        // Append appointment letter details as a JSON string
        formData.append(
            'appointmentLetterDetails',
            new Blob(
                [
                    JSON.stringify({
                        letterReferenceNumber: appointmentValues.letterReferenceNumber,
                        dateOfAppointment: moment(appointmentValues.dateOfAppointment).format(
                            'MM/DD/YYYY'
                        ),
                        nameAsPerAadhaar: appointmentValues.nameAsPerAadhar,
                        designation: appointmentValues.designation,
                        ctc: parseFloat(appointmentValues.ctc),
                        issuedByDesignation: appointmentValues.issuedByDesignation,
                        issuedByName: employeeValues.manager,
                        userId: employeeDetails.id
                    })
                ],
                { type: 'application/json' }
            )
        );

        // Append documents if available
        files.forEach((file) => {
            formData.append('document', file);
        });
        formData.append(
            'removedFiles',
            new Blob([JSON.stringify(removedFiles)], { type: 'application/json' })
        );
        console.log('files', files);
        try {
            const response = await axios.put(
                `hrletters/appointmentletter/${employeeDetails.id}`,
                formData,
                {
                    cancelToken: _cancelToken.token,
                    headers: {
                        // Do not set 'Content-Type' here, axios will handle it automatically for FormData
                    }
                }
            );

            if (response.data) {
                handleClose();
            } else {
                await manageError(response.data, history);
            }
        } catch (error) {
            await manageError(error, history);
        }
    };

    useEffect(() => {
        if (employeeDetails && appointmentLetterDetails) {
            setAppointmentValues((prevValues) => ({
                ...prevValues,
                nameAsPerAadhar:
                    employeeDetails.fullname || appointmentLetterDetails.nameAsPerAadhaar || '',
                designation:
                    employeeDetails.designation || appointmentLetterDetails.designation || '',
                userId: employeeDetails.id || '',
                letterReferenceNumber: appointmentLetterDetails.letterReferenceNumber || '',
                dateOfAppointment: appointmentLetterDetails.dateOfAppointment || '',
                ctc: appointmentLetterDetails.ctc || '',
                issuedByDesignation: appointmentLetterDetails.issuedByDesignation || '',
                issuedByName: appointmentLetterDetails.issuedByName || ''
            }));

            // Set the manager in employeeValues
            setEmployeeValues((prevValues) => ({
                ...prevValues,
                manager: appointmentLetterDetails.issuedByName || '',
                // If you have the manager's email in appointmentLetterDetails, set it here
                managerEmail: appointmentLetterDetails.managerEmail || ''
            }));

            setExistingFiles(appointmentLetterDetails.documents || []);
        }
    }, [employeeDetails, appointmentLetterDetails]);

    const handleClose = () => {
        setErrors({});
        setFileErrors(null);
        onClose();
        setFiles([]);
        setExistingFiles([]);
        if (!appointmentLetterDetails) {
            ClearedValues();
        }
    };
    const handleManagerChange = (event, value) => {
        setEmployeeValues((prevValues) => ({
            ...prevValues,
            manager: value?.label || '',
            managerEmail: value?.managerEmail || ''
        }));

        if (value?.label) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.issuedByName;
                return newErrors;
            });
        }
    };
    return (
        <Modal
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500 }}
        >
            <Box sx={style}>
                <Card sx={{ boxShadow: 0 }}>
                    <CardHeader
                        title={
                            method === 'create'
                                ? 'Add Appointment Letter'
                                : 'Edit Appointment Letter '
                        }
                        sx={{
                            bgcolor: '#DEECF4',
                            padding: '20px 24px',
                            borderTopLeftRadius: '10px',
                            borderTopRightRadius: '10px',
                            position: 'relative'
                        }}
                        action={
                            <IconButton
                                sx={{ position: 'absolute', right: 10, top: 10 }}
                                onClick={handleClose}
                            >
                                <HighlightOffIcon />
                            </IconButton>
                        }
                    />
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    required
                                    readOnly
                                    label='Name As Per Aadhar'
                                    name='nameAsPerAadhar'
                                    value={appointmentValues.nameAsPerAadhar}
                                    onChange={handleChange}
                                    error={!!errors.nameAsPerAadhar}
                                    helperText={errors.nameAsPerAadhar}
                                    sx={{ marginBottom: 2 }}
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label='Designation'
                                    name='designation'
                                    value={appointmentValues.designation}
                                    onChange={handleChange}
                                    error={!!errors.designation}
                                    helperText={errors.designation}
                                    sx={{ marginBottom: 2 }}
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label='Date Of Appointment'
                                    name='dateOfAppointment'
                                    type='date'
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors.dateOfAppointment}
                                    helperText={errors.dateOfAppointment}
                                    sx={{ marginBottom: 2 }}
                                    defaultValue={moment(
                                        appointmentValues?.dateOfAppointment
                                    ).format('YYYY-MM-DD')}
                                    onFocus={() => {
                                        setErrors((prevErrors) => ({
                                            ...prevErrors,
                                            dateOfAppointment: ''
                                        }));
                                    }}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label='Letter Reference Number'
                                    name='letterReferenceNumber'
                                    value={appointmentValues.letterReferenceNumber}
                                    onChange={handleChange}
                                    error={!!errors.letterReferenceNumber}
                                    helperText={errors.letterReferenceNumber}
                                    sx={{ marginBottom: 2 }}
                                    onFocus={() => {
                                        setErrors((prevErrors) => ({
                                            ...prevErrors,
                                            letterReferenceNumber: ''
                                        }));
                                    }}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label='CTC'
                                    name='ctc'
                                    value={appointmentValues.ctc}
                                    onChange={handleChange}
                                    error={!!errors.ctc}
                                    helperText={errors.ctc}
                                    type='number' // Type 'number' for automatic increment/decrement arrows
                                    inputProps={{
                                        step: '0.01', // Allows for decimals, e.g., increment by 0.01
                                        min: 0 // Prevent negative values
                                    }}
                                    sx={{ marginBottom: 2 }}
                                    onFocus={() => {
                                        setErrors((prevErrors) => ({
                                            ...prevErrors,
                                            ctc: ''
                                        }));
                                    }}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    select
                                    fullWidth
                                    required
                                    label='Issued By Designation'
                                    name='issuedByDesignation'
                                    value={appointmentValues.issuedByDesignation}
                                    onChange={handleChange}
                                    error={!!errors.issuedByDesignation}
                                    helperText={errors.issuedByDesignation}
                                    sx={{ marginBottom: 2 }}
                                    onFocus={() => {
                                        setErrors((prevErrors) => ({
                                            ...prevErrors,
                                            issuedByDesignation: ''
                                        }));
                                    }}
                                >
                                    {designations &&
                                        designations.map((option) => (
                                            <MenuItem key={option.id} value={option.designation}>
                                                {option.designation}
                                            </MenuItem>
                                        ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <Autocomplete
                                    options={managerOptions}
                                    getOptionLabel={(option) => option.label}
                                    value={
                                        employeeValues.manager
                                            ? {
                                                  label: employeeValues.manager,
                                                  managerEmail: employeeValues.managerEmail || ''
                                              }
                                            : null
                                    }
                                    id='manager'
                                    name='manager'
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            id='manager'
                                            name='manager'
                                            label='Issued By Name'
                                            error={!!errors.issuedByName}
                                            helperText={errors.issuedByName || ''}
                                            required
                                            fullWidth
                                            sx={{ marginBottom: 2 }}
                                        />
                                    )}
                                    renderOption={(props, option) => (
                                        <li {...props}>{option.label}</li>
                                    )}
                                    onChange={handleManagerChange}
                                    onFocus={() => {
                                        setErrors((prevErrors) => ({
                                            ...prevErrors,
                                            issuedByName: ''
                                        }));
                                    }}
                                />
                            </Grid>
                            {/* Drag and Drop Field */}
                            <Grid item xs={12}>
                                <div
                                    {...getRootProps()}
                                    style={{
                                        border: '2px dashed #0070AC',
                                        padding: '20px',
                                        textAlign: 'center',
                                        borderRadius: '8px',
                                        background: isDragActive ? '#f0f8ff' : '#fafafa',
                                        minHeight: '150px'
                                    }}
                                >
                                    <input {...getInputProps()} />
                                    <Typography variant='body1' color='textSecondary'>
                                        {isDragActive
                                            ? 'Drop the files here...'
                                            : 'Drag and drop files here, or click to select files'}
                                    </Typography>

                                    {/* Display existing files */}
                                    {existingFiles.length > 0 && (
                                        <List sx={{ marginTop: '10px' }}>
                                            {existingFiles.map((file, index) => (
                                                <ListItem
                                                    key={index}
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        padding: 0,
                                                        borderBottom: '1px solid #e0e0e0'
                                                    }}
                                                >
                                                    <ListItemText primary={file.filename} />
                                                    <ListItemSecondaryAction>
                                                        <IconButton
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                removeExistingFile(
                                                                    index,
                                                                    file.filename
                                                                );
                                                            }}
                                                            size='small'
                                                        >
                                                            <HighlightOffIcon />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            ))}
                                        </List>
                                    )}

                                    {/* Display newly added files */}
                                    {files.length > 0 && (
                                        <List sx={{ marginTop: '10px' }}>
                                            {files.map((file, index) => (
                                                <ListItem
                                                    key={index}
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        padding: 0,
                                                        borderBottom: '1px solid #e0e0e0'
                                                    }}
                                                >
                                                    <ListItemText primary={file.name} />
                                                    <ListItemSecondaryAction>
                                                        <IconButton
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                removeFile(index);
                                                            }}
                                                            size='small'
                                                        >
                                                            <HighlightOffIcon />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            ))}
                                        </List>
                                    )}
                                </div>
                                {fileErrors && (
                                    <Typography variant='body2' color='error' sx={{ mt: 1 }}>
                                        {fileErrors}
                                    </Typography>
                                )}
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Button
                    sx={{
                        marginTop: 2,
                        float: 'right',
                        marginRight: 2,
                        borderRadius: '40px',
                        backgroundColor: '#0070AC',
                        color: '#fff'
                    }}
                    variant='contained'
                    onClick={handleSubmit}
                >
                    {method === 'create' ? 'Create' : method === 'update' ? 'Update' : 'Submit'}
                </Button>
                <Button
                    sx={{
                        marginTop: 2,
                        float: 'right',
                        marginRight: 2,
                        borderRadius: '40px',
                        backgroundColor: '#E0E0E0',
                        color: '#000'
                    }}
                    variant='contained'
                    onClick={handleClose}
                >
                    Cancel
                </Button>
            </Box>
        </Modal>
    );
};
