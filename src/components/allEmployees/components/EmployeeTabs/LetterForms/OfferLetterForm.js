import React, { useState } from 'react';
import { Box, Button, TextField, Modal, Typography, Grid } from '@mui/material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Select from '@mui/material/Select';
import moment from 'moment';
import axios from 'axios';
import AppUtils from 'components/core/helpers/app-utils';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { manageError } from 'components/core/actions/common-actions';
import { FormControl, InputLabel, FormHelperText } from '@mui/material';
import { CommandColumnRenderer } from '@syncfusion/ej2-react-grids';
import { useDropzone } from 'react-dropzone';
import { List, ListItem, ListItemText, ListItemSecondaryAction, Autocomplete } from '@mui/material';

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

export const OfferLetterForm = ({
    open,
    employeeDetails,
    offerLetterDetails,
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
    const [offerValues, setOfferValues] = useState({
        uaerId: '',
        letterReferenceNumber: '',
        issueDate: '',
        issueType: '',
        letterReceivedBy: '',
        receivedName: '',
        receivedDate: '',
        joiningDate: '',
        nameAsPerAadhaar: '',
        designation: '',
        ctc: '',
        issuedByDesignation: '',
        issuedByName: ''
    });
    const [errors, setErrors] = useState({});
    const [files, setFiles] = React.useState([]);
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
        setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]); // Update files state
        setFileErrors(null); // Clear file errors if any
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
        accept: '.pdf,.doc,.docx,.png,.jpg,.jpeg', // Allowed file types
        multiple: true
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setOfferValues((prevValues) => ({
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
        if (!offerValues.letterReferenceNumber) {
            tempErrors.letterReferenceNumber = 'This field must not be Empty';
        }
        if (!offerValues.issueDate) {
            tempErrors.issueDate = 'This field must not be empty';
        }
        if (!offerValues.issueType) {
            tempErrors.issueType = 'This field must not be empty';
        }
        if (!offerValues.letterReceivedBy) {
            tempErrors.letterReceivedBy = 'This field must not be empty';
        }
        if (!offerValues.receivedName) {
            tempErrors.receivedName = 'This field must not be empty';
        }
        if (!offerValues.receivedDate) {
            tempErrors.receivedDate = 'This field must not be empty';
        }
        if (!offerValues.ctc) {
            tempErrors.ctc = 'This field must not be empty';
        }
        if (!offerValues.issuedByDesignation) {
            tempErrors.issuedByDesignation = 'This field must not be empty';
        }
        if (!employeeValues.manager) {
            tempErrors.issuedByName = 'This field must not be empty';
        }
        if (!offerValues.joiningDate) {
            tempErrors.joiningDate = 'This field must not be empty';
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const createOfferLetterInfo = async (formData, _cancelToken) => {
        try {
            const response = await axios.post('hrletters/offerletter', formData, {
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
                console.error('Error creating offer letter:', error);
            }
        }
    };

    const updateOfferLetterInfo = async (formData, _cancelToken) => {
        try {
            const response = await axios.put(
                `hrletters/offerletter/${employeeDetails.id}`,
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
                console.error('Error updating offer letter:', error);
            }
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (validate()) {
            if (method === 'create') {
                addOfferLetter();
            } else if (method === 'update') {
                updateOfferLetter();
            }
        }
    };

    const ClearedValues = () => {
        setOfferValues({
            letterReferenceNumber: '',
            issueDate: '',
            issueType: '',
            letterReceivedBy: '',
            receivedName: '',
            receivedDate: '',
            joiningDate: '',
            nameAsPerAadhaar: '',
            designation: '',
            ctc: '',
            issuedByDesignation: '',
            issuedByName: ''
        });
        setExistingFiles(null);
        setFiles(null);
    };

    const addOfferLetter = async () => {
        const formData = new FormData();

        // Append form fields to FormData, conditionally appending date fields if not null or undefined
        formData.append('letterReferenceNumber', offerValues.letterReferenceNumber || '');
        if (offerValues.issueDate) {
            formData.append('issueDate', AppUtils.getDateFormat(offerValues.issueDate));
        }
        formData.append('issueType', offerValues.issueType || '');
        formData.append('letterReceivedBy', offerValues.letterReceivedBy || '');
        formData.append('receivedName', offerValues.receivedName || '');
        if (offerValues.receivedDate) {
            formData.append('receivedDate', AppUtils.getDateFormat(offerValues.receivedDate));
        }
        if (offerValues.joiningDate) {
            formData.append('joiningDate', AppUtils.getDateFormat(offerValues.joiningDate));
        }

        formData.append('nameAsPerAadhaar', offerValues.nameAsPerAadhaar || '');
        formData.append('designation', offerValues.designation || '');
        formData.append('ctc', parseFloat(offerValues.ctc) || 0);
        formData.append('issuedByDesignation', offerValues.issuedByDesignation || '');
        formData.append('issuedByName', employeeValues.manager || '');
        formData.append('userId', employeeDetails.id || '');

        // Append files to FormData
        files.forEach((file) => {
            formData.append('document', file);
        });

        try {
            const res = await createOfferLetterInfo(formData, _cancelToken);
            if (res) {
                handleClose();
            } else {
                await manageError(res, history);
            }
        } catch (err) {
            await manageError(err, history);
        }
    };

    const updateOfferLetter = async () => {
        const formData = new FormData();

        // Add offer letter details
        formData.append(
            'offerLetterDetails',
            new Blob(
                [
                    JSON.stringify({
                        letterReferenceNumber: offerValues.letterReferenceNumber,
                        issueDate:
                            offerValues.issueDate === ''
                                ? null
                                : AppUtils.getDateFormat(offerValues.issueDate),
                        issueType: offerValues.issueType,
                        letterReceivedBy: offerValues.letterReceivedBy,
                        receivedName: offerValues.receivedName,
                        receivedDate:
                            offerValues.receivedDate === ''
                                ? null
                                : AppUtils.getDateFormat(offerValues.receivedDate),
                        joiningDate:
                            offerValues.joiningDate === ''
                                ? null
                                : AppUtils.getDateFormat(offerValues.joiningDate),
                        nameAsPerAadhaar: offerValues.nameAsPerAadhaar,
                        designation: offerValues.designation,
                        ctc: parseFloat(offerValues.ctc),
                        issuedByDesignation: offerValues.issuedByDesignation,
                        issuedByName: employeeValues.manager,
                        userId: employeeDetails.id
                    })
                ],
                { type: 'application/json' }
            )
        );

        // Append new files to FormData
        files.forEach((file) => {
            formData.append('document', file); // Ensure 'files' matches backend key
        });

        // Append removed files
        formData.append(
            'removedFiles',
            new Blob([JSON.stringify(removedFiles)], { type: 'application/json' })
        );

        try {
            const response = await axios.put(
                `/hrletters/offerletter/${employeeDetails.id}`,
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
        if (employeeDetails && offerLetterDetails) {
            setOfferValues((prevValues) => ({
                ...prevValues,
                nameAsPerAadhaar:
                    employeeDetails.fullname || offerLetterDetails.nameAsPerAadhaar || '',
                designation: employeeDetails.designation || offerLetterDetails.designation || '',
                joiningDate: employeeDetails.joiningdate || offerLetterDetails.joiningDate || '',
                userId: employeeDetails.id || '',
                letterReferenceNumber: offerLetterDetails.letterReferenceNumber || '',
                issueDate: offerLetterDetails.issueDate || '',
                issueType: offerLetterDetails.issueType || '',
                letterReceivedBy: offerLetterDetails.letterReceivedBy || '',
                receivedName: offerLetterDetails.receivedName || '',
                receivedDate: offerLetterDetails.receivedDate || '',
                ctc: offerLetterDetails.ctc || '',
                issuedByDesignation: offerLetterDetails.issuedByDesignation || '',
                issuedByName: offerLetterDetails.issuedByName || ''
            }));
            // Set the manager in employeeValues
            setEmployeeValues((prevValues) => ({
                ...prevValues,
                manager: offerLetterDetails.issuedByName || '',
                // If you have the manager's email in appointmentLetterDetails, set it here
                managerEmail: offerLetterDetails.managerEmail || ''
            }));
            setExistingFiles(offerLetterDetails.documents || []);
        }

        console.log('offerLetterDetails:', offerLetterDetails);
    }, [employeeDetails, offerLetterDetails]);

    const handleClose = () => {
        console.log('handle close called');
        setErrors({});
        setFileErrors(null);
        setFiles([]);
        setExistingFiles([]);
        onClose();
        if (!offerLetterDetails) {
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
                    {/* Ensure only CardHeader has the blue background */}
                    <CardHeader
                        title={method === 'create' ? 'Add Offer Letter' : 'Edit Offer Letter '}
                        sx={{
                            bgcolor: '#DEECF4', // Apply blue background to CardHeader only
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
                                    label='Name As Per Aadhaar'
                                    name='nameAsPerAadhaar'
                                    value={offerValues.nameAsPerAadhaar}
                                    onChange={handleChange}
                                    error={!!errors.nameAsPerAadhaar}
                                    helperText={errors.nameAsPerAadhaar}
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
                                    label='Joining Date'
                                    name='joiningDate'
                                    type='date'
                                    defaultValue={moment(offerValues?.joiningDate).format(
                                        'YYYY-MM-DD'
                                    )}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors.joiningDate}
                                    helperText={errors.joiningDate}
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
                                    value={offerValues.designation}
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
                                    value={offerValues.letterReferenceNumber}
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
                                    label='Issue Date'
                                    name='issueDate'
                                    type='date'
                                    defaultValue={moment(offerValues?.issueDate).format(
                                        'YYYY-MM-DD'
                                    )}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors.issueDate}
                                    helperText={errors.issueDate}
                                    sx={{ marginBottom: 2 }}
                                    onFocus={() => {
                                        setErrors((prevErrors) => ({
                                            ...prevErrors,
                                            issueDate: ''
                                        }));
                                    }}
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
                                        value={offerValues.issueType}
                                        onChange={handleChange}
                                        onFocus={() => {
                                            setErrors((prevErrors) => ({
                                                ...prevErrors,
                                                issueType: ''
                                            }));
                                        }}
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
                                    value={offerValues.letterReceivedBy}
                                    onChange={handleChange}
                                    error={!!errors.letterReceivedBy}
                                    helperText={errors.letterReceivedBy}
                                    sx={{ marginBottom: 2 }}
                                    onFocus={() => {
                                        setErrors((prevErrors) => ({
                                            ...prevErrors,
                                            letterReceivedBy: ''
                                        }));
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label='Received Name'
                                    name='receivedName'
                                    value={offerValues.receivedName}
                                    onChange={handleChange}
                                    error={!!errors.receivedName}
                                    helperText={errors.receivedName}
                                    sx={{ marginBottom: 2 }}
                                    onFocus={() => {
                                        setErrors((prevErrors) => ({
                                            ...prevErrors,
                                            receivedName: ''
                                        }));
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label='Received Date'
                                    name='receivedDate'
                                    type='date'
                                    defaultValue={moment(offerValues?.receivedDate).format(
                                        'YYYY-MM-DD'
                                    )}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors.receivedDate}
                                    helperText={errors.receivedDate}
                                    sx={{ marginBottom: 2 }}
                                    onFocus={() => {
                                        setErrors((prevErrors) => ({
                                            ...prevErrors,
                                            receivedDate: ''
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
                                    value={offerValues.ctc}
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
                                    value={offerValues.issuedByDesignation}
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
