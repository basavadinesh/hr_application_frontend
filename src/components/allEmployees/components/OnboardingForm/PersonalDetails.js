import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
    TextField,
    Grid,
    MenuItem,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Paper
} from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import moment from 'moment';

const PersonalDetails = ({
    employeeValues,
    setEmployeeValues,
    handleChange,
    textFieldStyle,
    props,
    errors,
    isEditMode,
    setaadharPanFilesToDelete
}) => {
    const [existingFiles, setExistingFiles] = useState([]);
    const [removedFiles, setRemovedFiles] = useState([]);
    // Initialize files from props in edit mode
    useEffect(() => {
        if (props.method === 'edit' && props.employeeDetails?.aadharPanDocuments) {
            setEmployeeValues((prev) => ({
                ...prev,
                adhaarOrPancard: props.employeeDetails.aadharPanDocuments
            }));
        } else if (!employeeValues.adhaarOrPancard) {
            setEmployeeValues((prev) => ({
                ...prev,
                adhaarOrPancard: []
            }));
        }
    }, [props.method, props.employeeDetails]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => {
            setEmployeeValues((prev) => ({
                ...prev,
                adhaarOrPancard: [...(prev.adhaarOrPancard || []), ...acceptedFiles]
            }));
        },
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png'],
            'application/pdf': ['.pdf']
        }
    });

    const removeFile = (index) => {
        setEmployeeValues((prev) => ({
            ...prev,
            adhaarOrPancard: prev.adhaarOrPancard.filter((_, i) => i !== index)
        }));
    };

    // Function to remove an existing file from the list
    const removeExistingFile = (fileIndex, filename) => {
        // Remove the file from the existing files list
        setExistingFiles((prevFiles) => prevFiles.filter((_, index) => index !== fileIndex));

        // Add the removed file to the removed files list
        setRemovedFiles((prevRemovedFiles) => [...prevRemovedFiles, filename]);

        // Add the removed file to the aadharPanFilesToDelete list
        setaadharPanFilesToDelete((prevFilesToDelete) => [...prevFilesToDelete, filename]);
    };

    const getFileName = (file) => {
        if (file instanceof File) {
            return file.name;
        } else if (typeof file === 'string') {
            return file.split('/').pop(); // Extract filename from path
        } else if (file.filename) {
            return file.filename;
        }
        return 'Unknown file';
    };

    return (
        <Paper
            elevation={3}
            sx={{
                padding: '20px',
                borderRadius: '12px',
                backgroundColor: '#edf3fc',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                marginBottom: '20px'
            }}
        >
            <Typography variant='h6' sx={{ marginBottom: '16px', fontWeight: 600 }}>
                Personal Information
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={4}>
                    <TextField
                        label='First Name'
                        name='firstName'
                        value={employeeValues.firstName || ''}
                        onChange={handleChange}
                        size='small'
                        sx={textFieldStyle}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label='Last Name'
                        name='lastName'
                        value={employeeValues.lastName || ''}
                        onChange={handleChange}
                        size='small'
                        sx={textFieldStyle}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label='Date of Birth'
                        name='employeeDateOfBirth'
                        type='date'
                        defaultValue={
                            props.method === 'edit' &&
                            moment(employeeValues.employeeDateOfBirth).format('YYYY-MM-DD')
                        }
                        onChange={handleChange}
                        size='small'
                        sx={textFieldStyle}
                        error={!!errors.employeeDateOfBirth}
                        helperText={errors.employeeDateOfBirth}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={4}>
                    <TextField
                        select
                        label='Gender'
                        name='gender'
                        value={employeeValues.gender || ''}
                        error={!!errors.gender}
                        helperText={errors.gender}
                        onChange={handleChange}
                        size='small'
                        sx={textFieldStyle}
                        fullWidth
                    >
                        <MenuItem value='Male'>Male</MenuItem>
                        <MenuItem value='Female'>Female</MenuItem>
                        <MenuItem value='Other'>Other</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        select
                        label='Blood Group'
                        name='bloodGroup'
                        value={employeeValues.bloodGroup || ''}
                        error={!!errors.bloodGroup}
                        helperText={errors.bloodGroup}
                        onChange={handleChange}
                        size='small'
                        sx={textFieldStyle}
                        fullWidth
                    >
                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((group) => (
                            <MenuItem key={group} value={group}>
                                {group}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        required
                        label='Email'
                        name='email'
                        type='email'
                        value={employeeValues.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        size='small'
                        sx={textFieldStyle}
                        InputProps={{
                            readOnly: props.method === 'edit',
                            style: {
                                backgroundColor: props.method === 'edit' ? '#f5f5f5' : 'inherit'
                            }
                        }}
                    />
                </Grid>
                {props.method === 'add' && (
                    <Grid item xs={4}>
                        <TextField
                            required
                            label='Password'
                            name='password'
                            type='password'
                            value={employeeValues.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password}
                            size='small'
                            sx={textFieldStyle}
                        />
                    </Grid>
                )}
                <Grid item xs={4}>
                    <TextField
                        label='Phone'
                        name='phone'
                        value={employeeValues.phone || ''}
                        error={!!errors.phone}
                        helperText={errors.phone}
                        onChange={handleChange}
                        size='small'
                        sx={textFieldStyle}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label='Aadhaar Number'
                        name='aadharNumber'
                        value={employeeValues.aadharNumber || ''}
                        error={!!errors.aadharNumber}
                        helperText={errors.aadharNumber}
                        onChange={handleChange}
                        size='small'
                        sx={textFieldStyle}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label='Name as per Aadhaar'
                        name='nameAsPerAadhar'
                        value={employeeValues.nameAsPerAadhar || ''}
                        error={!!errors.nameAsPerAadhar}
                        helperText={errors.nameAsPerAadhar}
                        onChange={handleChange}
                        size='small'
                        sx={textFieldStyle}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label='PAN Number'
                        name='panNumber'
                        value={employeeValues.panNumber || ''}
                        onChange={handleChange}
                        error={!!errors.panNumber}
                        helperText={errors.panNumber}
                        size='small'
                        sx={textFieldStyle}
                        fullWidth
                    />
                </Grid>
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
                                ? 'Drop your Adhaar Card/Pan Card files here...'
                                : 'Drag and drop your Adhaar Card/Pan Card here, or click to select files'}
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
                                        <ListItemText primary={file.filename || file.name} />
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

                        {employeeValues.adhaarOrPancard &&
                            employeeValues.adhaarOrPancard.length > 0 && (
                                <List sx={{ marginTop: '10px' }}>
                                    {employeeValues.adhaarOrPancard.map((file, index) => (
                                        <ListItem
                                            key={index}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                padding: '8px',
                                                borderBottom: '1px solid #e0e0e0',
                                                backgroundColor: '#fff',
                                                borderRadius: '4px',
                                                marginBottom: '4px'
                                            }}
                                        >
                                            <ListItemText
                                                primary={getFileName(file)}
                                                secondary={
                                                    file instanceof File
                                                        ? 'New file'
                                                        : 'Existing file'
                                                }
                                                sx={{
                                                    '& .MuiTypography-root': {
                                                        wordBreak: 'break-all'
                                                    }
                                                }}
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        removeFile(index);
                                                    }}
                                                    size='small'
                                                    sx={{ color: '#ff1744' }}
                                                >
                                                    <HighlightOffIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                    </div>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default PersonalDetails;
