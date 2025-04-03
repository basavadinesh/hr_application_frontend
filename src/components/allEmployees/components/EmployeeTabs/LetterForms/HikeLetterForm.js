import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Modal, Typography, Grid } from '@mui/material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Select from '@mui/material/Select';
import axios from 'axios';
import AppUtils from 'components/core/helpers/app-utils';
import { useHistory } from 'react-router-dom';
import { manageError } from 'components/core/actions/common-actions';
import { FormControl, InputLabel, FormHelperText } from '@mui/material';
import moment from 'moment';
import { useDropzone } from 'react-dropzone';
import { List, ListItem, ListItemText, ListItemSecondaryAction, Autocomplete } from '@mui/material';

// Define styles for the modal box
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

export const HikeLetterForm = ({
    open,
    employeeDetails,
    hikeLetterDetails,
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

    const [hikeValues, setHikeValues] = useState({
        userId: '',
        letterReferenceNumber: '',
        issueDate: '',
        issueType: '',
        letterReceivedBy: '',
        receivedName: '',
        receivedDate: '',
        nameAsPerPayslip: '',
        designation: '',
        newCtcPerAnnum: '',
        issuedByDesignation: '',
        issuedByName: ''
    });
    const [errors, setErrors] = useState({});
    const [files, setFiles] = useState([]);
    const [fileErrors, setFileErrors] = useState(null);
    const [existingFiles, setExistingFiles] = useState([]);
    const [removedFiles, setRemovedFiles] = useState([]);

    const [managerOptions, setManagerOptions] = useState([]);

    useEffect(() => {
        if (managers && managers.length > 0) {
            setManagerOptions(
                managers.map((manager) => ({
                    label: `${manager.firstname} ${manager.lastname} (${manager.employeeid})`,
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

    // Function to remove a file from the list
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
        accept: '.pdf,.doc,.docx,.png,.jpg,.jpeg',
        multiple: true
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setHikeValues((prevValues) => ({
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
        let isValid = true;
        let tempErrors = {};
        if (!hikeValues.letterReferenceNumber) {
            tempErrors.letterReferenceNumber = 'This field must not be empty';
        }
        if (!hikeValues.issueDate) {
            tempErrors.issueDate = 'This field must not be empty';
        }
        if (!hikeValues.issueType) {
            tempErrors.issueType = 'This field must not be empty';
        }
        if (!hikeValues.letterReceivedBy) {
            tempErrors.letterReceivedBy = 'This field must not be empty';
        }
        if (!hikeValues.receivedName) {
            tempErrors.receivedName = 'This field must not be empty';
        }
        if (!hikeValues.receivedDate) {
            tempErrors.receivedDate = 'This field must not be empty';
        }
        if (!hikeValues.newCtcPerAnnum) {
            tempErrors.newCtcPerAnnum = 'This field must not be empty';
        }
        if (!hikeValues.issuedByDesignation) {
            tempErrors.issuedByDesignation = 'This field must not be empty';
        }
        if (!employeeValues.manager) {
            tempErrors.issuedByName = 'This field must not be empty';
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const createHikeLetterInfo = async (formData, _cancelToken) => {
        try {
            const response = await axios.post('hrletters/hikeletter', formData, {
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
                console.error('Error creating hike letter:', error);
            }
        }
    };

    const updateHikeLetterInfo = async (formData, _cancelToken) => {
        try {
            const response = await axios.put(
                `hrletters/hikeletter/${employeeDetails.id}`,
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
                console.error('Error updating hike letter:', error);
            }
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validate()) {
            if (method === 'create') {
                addHikeLetter();
            } else if (method === 'update') {
                updateHikeLetter();
            }
        }
    };

    const ClearedValues = () => {
        setHikeValues({
            letterReferenceNumber: '',
            issueDate: '',
            issueType: '',
            letterReceivedBy: '',
            receivedName: '',
            receivedDate: '',
            nameAsPerPayslip: '',
            designation: '',
            newCtcPerAnnum: '',
            issuedByDesignation: '',
            issuedByName: ''
        });
        setExistingFiles(null);
        setFiles(null);
    };

    const addHikeLetter = async () => {
        const formData = new FormData();
        formData.append('letterReferenceNumber', hikeValues.letterReferenceNumber || '');
        if (hikeValues.issueDate) {
            formData.append('issueDate', AppUtils.getDateFormat(hikeValues.issueDate));
        }
        formData.append('issueType', hikeValues.issueType || '');
        formData.append('letterReceivedBy', hikeValues.letterReceivedBy || '');
        formData.append('receivedName', hikeValues.receivedName || '');
        if (hikeValues.receivedDate) {
            formData.append('receivedDate', AppUtils.getDateFormat(hikeValues.receivedDate));
        }
        formData.append('nameAsPerPayslip', hikeValues.nameAsPerPayslip || '');
        formData.append('designation', hikeValues.designation || '');
        formData.append('newCtcPerAnnum', parseFloat(hikeValues.newCtcPerAnnum) || 0);
        formData.append('issuedByDesignation', hikeValues.issuedByDesignation || '');
        formData.append('issuedByName', employeeValues.manager || '');
        formData.append('userId', employeeDetails.id || '');

        files.forEach((file) => {
            formData.append('document', file);
        });

        try {
            const res = await createHikeLetterInfo(formData, _cancelToken);
            if (res) {
                handleClose();
            } else {
                await manageError(res, history);
            }
        } catch (err) {
            await manageError(err, history);
        }
    };

    const updateHikeLetter = async () => {
        const formData = new FormData();

        // Add hike letter details
        formData.append(
            'hikeLetterDetails',
            new Blob(
                [
                    JSON.stringify({
                        letterReferenceNumber: hikeValues.letterReferenceNumber,
                        issueDate:
                            hikeValues.issueDate === ''
                                ? null
                                : AppUtils.getDateFormat(hikeValues.issueDate),
                        issueType: hikeValues.issueType,
                        letterReceivedBy: hikeValues.letterReceivedBy,
                        receivedName: hikeValues.receivedName,
                        receivedDate:
                            hikeValues.receivedDate === ''
                                ? null
                                : AppUtils.getDateFormat(hikeValues.receivedDate),
                        nameAsPerPayslip: hikeValues.nameAsPerPayslip,
                        designation: hikeValues.designation,
                        newCtcPerAnnum: parseFloat(hikeValues.newCtcPerAnnum),
                        issuedByDesignation: hikeValues.issuedByDesignation,
                        issuedByName: employeeValues.manager,
                        userId: employeeDetails.id
                    })
                ],
                { type: 'application/json' }
            )
        );

        // Append new files
        files.forEach((file) => {
            formData.append('document', file); // Ensure the key matches the backend
        });

        // Append removed files
        formData.append(
            'removedFiles',
            new Blob([JSON.stringify(removedFiles)], { type: 'application/json' })
        );

        try {
            const response = await axios.put(
                `/hrletters/hikeletter/${employeeDetails.id}`,
                formData,
                {
                    cancelToken: _cancelToken.token,
                    headers: {
                        // Axios handles 'Content-Type' automatically for FormData
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
        if (employeeDetails && hikeLetterDetails) {
            setHikeValues((prevValues) => ({
                ...prevValues,
                nameAsPerPayslip:
                    employeeDetails.fullname || hikeLetterDetails.nameAsPerPayslip || '',
                designation: employeeDetails.designation || hikeLetterDetails.designation || '',
                userId: employeeDetails.id || '',
                letterReferenceNumber: hikeLetterDetails.letterReferenceNumber || '',
                issueDate: hikeLetterDetails.issueDate || '',
                issueType: hikeLetterDetails.issueType || '',
                letterReceivedBy: hikeLetterDetails.letterReceivedBy || '',
                receivedName: hikeLetterDetails.receivedName || '',
                receivedDate: hikeLetterDetails.receivedDate || '',
                newCtcPerAnnum: hikeLetterDetails.newCtcPerAnnum || '',
                issuedByDesignation: hikeLetterDetails.issuedByDesignation || '',
                issuedByName: hikeLetterDetails.issuedByName || ''
            }));
            // Set the manager in employeeValues
            setEmployeeValues((prevValues) => ({
                ...prevValues,
                manager: hikeLetterDetails.issuedByName || '',
                // If you have the manager's email in appointmentLetterDetails, set it here
                managerEmail: hikeLetterDetails.managerEmail || ''
            }));
            setExistingFiles(hikeLetterDetails.documents || []);
        }
    }, [employeeDetails, hikeLetterDetails]);

    const handleClose = () => {
        setErrors({});
        setFileErrors(null);
        setFiles([]);
        setExistingFiles([]);
        onClose();
        if (!hikeLetterDetails) {
            ClearedValues();
        }
    };
    const handleManagerChange = (event, value) => {
        // Update employee values
        setEmployeeValues((prevValues) => ({
            ...prevValues,
            manager: value?.label || '',
            managerEmail: value?.managerEmail || ''
        }));

        // Clear the error for manager field if a value is selected
        if (value?.label) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.manager;
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
                        title={method === 'create' ? 'Add Hike Letter' : 'Edit Hike Letter'}
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
                                    label='Name As Per Payslip'
                                    name='nameAsPerPayslip'
                                    value={hikeValues.nameAsPerPayslip}
                                    onChange={handleChange}
                                    error={!!errors.nameAsPerPayslip}
                                    helperText={errors.nameAsPerPayslip}
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
                                    value={hikeValues.designation}
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
                                    label='Letter Reference Number'
                                    name='letterReferenceNumber'
                                    value={hikeValues.letterReferenceNumber}
                                    onChange={handleChange}
                                    error={!!errors.letterReferenceNumber}
                                    helperText={errors.letterReferenceNumber}
                                    sx={{ marginBottom: 2 }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label='Issue Date'
                                    name='issueDate'
                                    type='date'
                                    defaultValue={moment(hikeValues?.issueDate).format(
                                        'YYYY-MM-DD'
                                    )}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors.issueDate}
                                    helperText={errors.issueDate}
                                    sx={{ marginBottom: 2 }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth required sx={{ marginBottom: 2 }}>
                                    <InputLabel id='issueType-label'>Issue Type</InputLabel>
                                    <Select
                                        labelId='issueType-label'
                                        id='issueType'
                                        label='Issue Type'
                                        name='issueType'
                                        value={hikeValues.issueType}
                                        onChange={handleChange}
                                        error={!!errors.issueType}
                                    >
                                        <MenuItem value='Hard Copy'>Hard Copy</MenuItem>
                                        <MenuItem value='Soft Copy'>Soft Copy</MenuItem>
                                        <MenuItem value='Both'>Both</MenuItem>
                                    </Select>
                                    <FormHelperText>{errors.issueType}</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label='Letter Received By'
                                    name='letterReceivedBy'
                                    value={hikeValues.letterReceivedBy}
                                    onChange={handleChange}
                                    error={!!errors.letterReceivedBy}
                                    helperText={errors.letterReceivedBy}
                                    sx={{ marginBottom: 2 }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label='Received Name'
                                    name='receivedName'
                                    value={hikeValues.receivedName}
                                    onChange={handleChange}
                                    error={!!errors.receivedName}
                                    helperText={errors.receivedName}
                                    sx={{ marginBottom: 2 }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label='Received Date'
                                    name='receivedDate'
                                    type='date'
                                    defaultValue={moment(hikeValues?.receivedDate).format(
                                        'YYYY-MM-DD'
                                    )}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors.receivedDate}
                                    helperText={errors.receivedDate}
                                    sx={{ marginBottom: 2 }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label='New CTC Per Annum'
                                    name='newCtcPerAnnum'
                                    value={hikeValues.newCtcPerAnnum}
                                    onChange={handleChange}
                                    error={!!errors.newCtcPerAnnum}
                                    helperText={errors.newCtcPerAnnum}
                                    type='number'
                                    inputProps={{
                                        step: '0.01',
                                        min: 0
                                    }}
                                    sx={{ marginBottom: 2 }}
                                    onFocus={() => {
                                        setErrors((prevErrors) => ({
                                            ...prevErrors,
                                            newCtcPerAnnum: ''
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
                                    value={hikeValues.issuedByDesignation}
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
                                                    <ListItemText
                                                        primary={file.filename || file.name}
                                                    />
                                                    <ListItemSecondaryAction>
                                                        <IconButton
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                removeExistingFile(
                                                                    index,
                                                                    file.filename || file.name
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
