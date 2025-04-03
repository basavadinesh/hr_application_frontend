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
    maxHeight: '90vh', // Added to limit the height of the modal box
    overflowY: 'auto'
};

export const RelievingExperienceLetterForm = ({
    open,
    employeeDetails,
    relievingExperienceLetterDetails,
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

    const [letterValues, setLetterValues] = useState({
        userId: '',
        letterReferenceNumber: '',
        issueDate: '',
        issueType: '',
        letterReceivedBy: '',
        receivedName: '',
        receivedDate: '',
        nameAsPerPayslip: '',
        designationAsPerPayslip: '',
        dateOfJoining: '',
        resignationDate: '',
        dateOfRelieving: '',
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
                    label: `${manager.firstname} ${manager.lastname}  (${manager.employeeid})`,
                    managerEmail: manager.email,
                    id: manager.id
                }))
            );
        }
    }, [managers]);

    // Function to handle file drop
    const onDrop = (acceptedFiles) => {
        console.log(acceptedFiles); // Debugging to see the accepted files
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
        setLetterValues((prevValues) => ({
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
        if (!letterValues.letterReferenceNumber) {
            tempErrors.letterReferenceNumber = 'This field must not be empty';
        }
        if (!letterValues.issueDate) {
            tempErrors.issueDate = 'This field must not be empty';
        }
        if (!letterValues.issueType) {
            tempErrors.issueType = 'This field must not be empty';
        }
        if (!letterValues.dateOfRelieving) {
            tempErrors.dateOfRelieving = 'This field must not be empty';
        }
        if (!letterValues.issuedByDesignation) {
            tempErrors.issuedByDesignation = 'This field must not be empty';
        }
        if (!employeeValues.manager) {
            tempErrors.issuedByName = 'This field must not be empty';
        }
        if (!letterValues.letterReceivedBy) {
            tempErrors.letterReceivedBy = 'This field must not be empty';
        }
        if (!letterValues.receivedName) {
            tempErrors.receivedName = 'This field must not be empty';
        }
        if (!letterValues.receivedDate) {
            tempErrors.receivedDate = 'This field must not be empty';
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const createRelievingLetterInfo = async (formData, _cancelToken) => {
        try {
            const response = await axios.post('hrletters/relievingandexperienceletter', formData, {
                cancelToken: _cancelToken.token,
                headers: {
                    'Content-Type': 'multipart/form-data' // Set this header for form data
                }
            });
            return response.data;
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled:', error.message);
            } else {
                console.error('Error creating relieving letter:', error);
            }
        }
    };

    const updateRelievingLetterInfo = async (formData, _cancelToken) => {
        try {
            const response = await axios.put(
                `hrletters/relievingandexperienceletter/${employeeDetails.id}`,
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
                console.error('Error updating relieving letter:', error);
            }
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validate()) {
            if (method === 'create') {
                addRelievingLetter();
            } else if (method === 'update') {
                updateRelievingLetter();
            }
        }
    };

    const ClearedValues = () => {
        setLetterValues({
            letterReferenceNumber: '',
            issueDate: '',
            issueType: '',
            letterReceivedBy: '',
            receivedName: '',
            receivedDate: '',
            nameAsPerPayslip: '',
            designationAsPerPayslip: '',
            dateOfJoining: '',
            resignationDate: '',
            dateOfRelieving: '',
            issuedByDesignation: '',
            issuedByName: ''
        });
        setExistingFiles(null);
        setFiles(null);
    };

    const addRelievingLetter = async () => {
        const formData = new FormData();

        // Append form fields to FormData
        formData.append('letterReferenceNumber', letterValues.letterReferenceNumber);
        formData.append(
            'issueDate',
            letterValues.issueDate === '' ? null : AppUtils.getDateFormat(letterValues.issueDate)
        );
        formData.append('issueType', letterValues.issueType);
        formData.append('letterReceivedBy', letterValues.letterReceivedBy);
        formData.append('receivedName', letterValues.receivedName);
        if (letterValues.receivedDate) {
            formData.append('receivedDate', AppUtils.getDateFormat(letterValues.receivedDate));
        }
        formData.append('nameAsPerPayslip', letterValues.nameAsPerPayslip);
        formData.append('designationAsPerPayslip', letterValues.designationAsPerPayslip);
        formData.append(
            'dateOfJoining',
            letterValues.dateOfJoining === ''
                ? null
                : AppUtils.getDateFormat(letterValues.dateOfJoining)
        );
        formData.append(
            'resignationDate',
            letterValues.resignationDate === ''
                ? null
                : AppUtils.getDateFormat(letterValues.resignationDate)
        );

        if (letterValues.dateOfRelieving) {
            formData.append(
                'dateOfRelieving',
                AppUtils.getDateFormat(letterValues.dateOfRelieving)
            );
        }
        formData.append('issuedByDesignation', letterValues.issuedByDesignation);
        formData.append('issuedByName', employeeValues.manager || '');
        formData.append('userId', employeeDetails.id);

        // Append files to FormData
        files.forEach((file) => {
            formData.append('document', file);
        });

        try {
            const res = await createRelievingLetterInfo(formData, _cancelToken);
            if (res) {
                handleClose();
            } else {
                await manageError(res, history);
            }
        } catch (err) {
            await manageError(err, history);
        }
    };

    const updateRelievingLetter = async () => {
        const formData = new FormData();

        // Add relieving letter details as JSON string under the correct key
        formData.append(
            'relievingAndExperienceLetterDetails',
            new Blob(
                [
                    JSON.stringify({
                        letterReferenceNumber: letterValues.letterReferenceNumber,
                        issueDate:
                            letterValues.issueDate === ''
                                ? null
                                : AppUtils.getDateFormat(letterValues.issueDate),
                        issueType: letterValues.issueType,
                        letterReceivedBy: letterValues.letterReceivedBy,
                        receivedName: letterValues.receivedName,
                        receivedDate:
                            letterValues.receivedDate === ''
                                ? null
                                : AppUtils.getDateFormat(letterValues.receivedDate),
                        nameAsPerPayslip: letterValues.nameAsPerPayslip,
                        designationAsPerPayslip: letterValues.designationAsPerPayslip,
                        dateOfJoining:
                            letterValues.dateOfJoining === ''
                                ? null
                                : AppUtils.getDateFormat(letterValues.dateOfJoining),
                        resignationDate:
                            letterValues.resignationDate === ''
                                ? null
                                : AppUtils.getDateFormat(letterValues.resignationDate),
                        dateOfRelieving:
                            letterValues.dateOfRelieving === ''
                                ? null
                                : AppUtils.getDateFormat(letterValues.dateOfRelieving),
                        issuedByDesignation: letterValues.issuedByDesignation,
                        issuedByName: employeeValues.manager,
                        userId: employeeDetails.id
                    })
                ],
                { type: 'application/json' }
            )
        );

        // Append new files to FormData
        files.forEach((file) => {
            formData.append('document', file); // Ensure the key matches backend expectations
        });

        // Append removed files
        formData.append(
            'removedFiles',
            new Blob([JSON.stringify(removedFiles)], { type: 'application/json' })
        );

        try {
            const response = await axios.put(
                `/hrletters/relievingandexperienceletter/${employeeDetails.id}`,
                formData,
                {
                    cancelToken: _cancelToken.token,
                    headers: {
                        // Do not set 'Content-Type'; Axios will handle it for FormData
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
        if (employeeDetails && relievingExperienceLetterDetails) {
            setLetterValues((prevValues) => ({
                ...prevValues,
                nameAsPerPayslip:
                    employeeDetails.fullname ||
                    relievingExperienceLetterDetails.nameAsPerPayslip ||
                    '',
                designationAsPerPayslip: employeeDetails.designation || '',
                dateOfJoining: employeeDetails.joiningdate || '',
                resignationDate: employeeDetails.DateOfExit || '',
                dateOfRelieving: relievingExperienceLetterDetails.dateOfRelieving || '',
                userId: employeeDetails.id || '',
                letterReferenceNumber: relievingExperienceLetterDetails.letterReferenceNumber,
                issueDate: relievingExperienceLetterDetails.issueDate || '',
                issueType: relievingExperienceLetterDetails.issueType,
                letterReceivedBy: relievingExperienceLetterDetails.letterReceivedBy,
                receivedName: relievingExperienceLetterDetails.receivedName,
                receivedDate: relievingExperienceLetterDetails.receivedDate || '',
                issuedByDesignation: relievingExperienceLetterDetails.issuedByDesignation,
                issuedByName: relievingExperienceLetterDetails.issuedByName
            }));
            // Set the manager in employeeValues
            setEmployeeValues((prevValues) => ({
                ...prevValues,
                manager: relievingExperienceLetterDetails.issuedByName || '',
                // If you have the manager's email in appointmentLetterDetails, set it here
                managerEmail: relievingExperienceLetterDetails.managerEmail || ''
            }));
            setExistingFiles(relievingExperienceLetterDetails.documents || []);
        }
    }, [employeeDetails, relievingExperienceLetterDetails]);

    const handleClose = () => {
        setErrors({});
        setFileErrors(null);
        setFiles([]);
        setExistingFiles([]);
        onClose();

        if (!relievingExperienceLetterDetails) {
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
                        title={
                            method === 'create' ? 'Add Relieving Letter' : 'Edit Relieving Letter'
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
                                    label='Name As Per Payslip'
                                    name='nameAsPerPayslip'
                                    value={letterValues.nameAsPerPayslip}
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
                                    label='Date of Joining'
                                    name='dateOfJoining'
                                    type='date'
                                    defaultValue={moment(letterValues?.dateOfJoining).format(
                                        'YYYY-MM-DD'
                                    )}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors.dateOfJoining}
                                    helperText={errors.dateOfJoining}
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
                                    label='Resignation Date'
                                    name='resignationDate'
                                    type='date'
                                    defaultValue={moment(letterValues?.resignationDate).format(
                                        'YYYY-MM-DD'
                                    )}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors.resignationDate}
                                    helperText={errors.resignationDate}
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
                                    label='Designation As Per Payslip'
                                    name='designationAsPerPayslip'
                                    value={letterValues.designationAsPerPayslip}
                                    onChange={handleChange}
                                    error={!!errors.designationAsPerPayslip}
                                    helperText={errors.designationAsPerPayslip}
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
                                    value={letterValues.letterReferenceNumber}
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
                                    value={letterValues.issueDate}
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
                                        value={letterValues.issueType}
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
                                    label='Letter Received By'
                                    name='letterReceivedBy'
                                    value={letterValues.letterReceivedBy}
                                    onChange={handleChange}
                                    error={!!errors.letterReceivedBy}
                                    helperText={errors.letterReceivedBy}
                                    sx={{ marginBottom: 2 }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label='Received Name'
                                    name='receivedName'
                                    value={letterValues.receivedName}
                                    onChange={handleChange}
                                    error={!!errors.receivedName}
                                    helperText={errors.receivedName}
                                    sx={{ marginBottom: 2 }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label='Received Date'
                                    name='receivedDate'
                                    type='date'
                                    defaultValue={moment(letterValues?.receivedDate).format(
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
                                    label='Date of Relieving'
                                    name='dateOfRelieving'
                                    type='date'
                                    defaultValue={moment(letterValues?.dateOfRelieving).format(
                                        'YYYY-MM-DD'
                                    )}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors.dateOfRelieving}
                                    helperText={errors.dateOfRelieving}
                                    sx={{ marginBottom: 2 }}
                                    onFocus={() => {
                                        setErrors((prevErrors) => ({
                                            ...prevErrors,
                                            dateOfRelieving: ''
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
                                    value={letterValues.issuedByDesignation}
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
