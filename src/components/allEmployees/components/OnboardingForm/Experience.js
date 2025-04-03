import React, { useState, useRef, useEffect } from 'react';
import {
    TextField,
    Grid,
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Paper,
    Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment';

const Experience = ({ employeeValues, setEmployeeValues, textFieldStyle, props }) => {
    const [isDragActive, setIsDragActive] = useState(false);
    const payslipFileInputRef = useRef(null);

    // Initialize files from props in edit mode
    useEffect(() => {
        if (props.method === 'edit' && props.employeeDetails) {
            // Initialize experience data
            if (props.employeeDetails.employeeExperience?.length > 0) {
                const exp = props.employeeDetails.employeeExperience[0];
                setEmployeeValues((prev) => ({
                    ...prev,
                    employeeExperience: exp,
                    hasExperience: true,
                    isFresher: false
                }));
            }

            // Initialize payslip files
            if (props.employeeDetails.payslipsDocuments) {
                setEmployeeValues((prev) => ({
                    ...prev,
                    payslipFiles: props.employeeDetails.payslipsDocuments
                }));
            }
        }
    }, [props.method, props.employeeDetails]);

    const handleFresherChange = (e) => {
        const isFresher = e.target.value === 'Yes';
        setEmployeeValues({
            ...employeeValues,
            isFresher,
            hasExperience: isFresher ? null : employeeValues.hasExperience,
            employeeExperience: isFresher ? null : employeeValues.employeeExperience,
            payslipFiles: isFresher ? [] : employeeValues.payslipFiles
        });
    };

    const handleChangeExperience = (e) => {
        const hasExperience = e.target.value === 'Yes';
        setEmployeeValues({
            ...employeeValues,
            hasExperience,
            employeeExperience: hasExperience
                ? [
                      {
                          previousCompany: '',
                          experienceDesignation: '',
                          reportingManager: '',
                          startDate: '',
                          endDate: '',
                          uanNumber: ''
                      }
                  ]
                : null,
            payslipFiles: hasExperience ? employeeValues.payslipFiles : []
        });
    };

    const handleExperienceDetailsChange = (e) => {
        const { name, value } = e.target;
        setEmployeeValues((prev) => ({
            ...prev,
            [name]: value,
            employeeExperience: {
                ...(prev.employeeExperience || {}),
                [name]: value
            }
        }));
        console.log('Emp Values in Exp', employeeValues);
    };

    const handlePayslipUpload = (files) => {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        const filteredFiles = Array.from(files).filter((file) => allowedTypes.includes(file.type));

        if (filteredFiles.length !== files.length) {
            alert('Only PDF and image files (jpg, jpeg, png) are allowed.');
        }

        setEmployeeValues((prev) => ({
            ...prev,
            payslipFiles: [...(prev.payslipFiles || []), ...filteredFiles]
        }));
        payslipFileInputRef.current.value = '';
    };

    const removePayslip = (index) => {
        setEmployeeValues((prev) => ({
            ...prev,
            payslipFiles: prev.payslipFiles.filter((_, i) => i !== index)
        }));
    };

    const getFileName = (file) => {
        console.log('Getting filename for:', file);
        if (file instanceof File) {
            return file.name;
        } else if (typeof file === 'string') {
            return file.split('/').pop();
        } else if (file.filename) {
            return file.filename;
        } else if (file.name) {
            return file.name;
        } else if (file.filepath) {
            return file.filepath.split('/').pop();
        }
        return 'Unknown file';
    };

    const handlePayslipFileInputClick = () => {
        payslipFileInputRef.current.click();
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
                Experience
            </Typography>
            <Grid container spacing={3}>
                {/* Step 1: Are you a fresher? */}
                <Grid item xs={12}>
                    <Typography variant='h6' gutterBottom>
                        Are you a Fresher?
                    </Typography>
                    <RadioGroup
                        name='isFresher'
                        value={
                            employeeValues.isFresher === null
                                ? ''
                                : employeeValues.isFresher
                                ? 'Yes'
                                : 'No'
                        }
                        onChange={handleFresherChange}
                        row
                    >
                        <FormControlLabel
                            value='Yes'
                            control={<Radio />}
                            label={
                                <Typography variant='body1' fontWeight='bold' color='textPrimary'>
                                    Yes
                                </Typography>
                            }
                        />
                        <FormControlLabel
                            value='No'
                            control={<Radio />}
                            label={
                                <Typography variant='body1' fontWeight='bold' color='textPrimary'>
                                    No
                                </Typography>
                            }
                        />
                    </RadioGroup>
                </Grid>

                {/* Step 2: If not a fresher, ask about experience */}
                {employeeValues.isFresher === false && (
                    <Grid item xs={12}>
                        <Typography variant='h6' gutterBottom>
                            Do you have experience?
                        </Typography>
                        <RadioGroup
                            name='hasExperience'
                            value={
                                employeeValues.hasExperience === null
                                    ? ''
                                    : employeeValues.hasExperience
                                    ? 'Yes'
                                    : 'No'
                            }
                            onChange={handleChangeExperience}
                            row
                        >
                            <FormControlLabel
                                value='Yes'
                                control={<Radio />}
                                label={
                                    <Typography
                                        variant='body1'
                                        fontWeight='bold'
                                        color='textPrimary'
                                    >
                                        Yes
                                    </Typography>
                                }
                            />
                            <FormControlLabel
                                value='No'
                                control={<Radio />}
                                label={
                                    <Typography
                                        variant='body1'
                                        fontWeight='bold'
                                        color='textPrimary'
                                    >
                                        No
                                    </Typography>
                                }
                            />
                        </RadioGroup>
                    </Grid>
                )}

                {/* Step 3: Experience details form */}
                {employeeValues.hasExperience === true && (
                    <>
                        {/* Previous Company Details */}
                        <Grid item xs={4}>
                            <TextField
                                label='Previous Company'
                                name='previousCompany'
                                value={employeeValues?.employeeExperience?.previousCompany || ''}
                                onChange={handleExperienceDetailsChange}
                                size='small'
                                sx={textFieldStyle}
                                fullWidth
                            />
                        </Grid>

                        {/* Experience Designation */}
                        <Grid item xs={4}>
                            <TextField
                                label='Experience Designation'
                                name='experienceDesignation'
                                value={
                                    employeeValues?.employeeExperience?.experienceDesignation || ''
                                }
                                onChange={handleExperienceDetailsChange}
                                size='small'
                                sx={textFieldStyle}
                                fullWidth
                            />
                        </Grid>

                        {/* Reporting Manager */}
                        <Grid item xs={4}>
                            <TextField
                                label='Reporting Manager'
                                name='reportingManager'
                                value={employeeValues?.employeeExperience?.reportingManager || ''}
                                onChange={handleExperienceDetailsChange}
                                size='small'
                                sx={textFieldStyle}
                                fullWidth
                            />
                        </Grid>

                        {/* Start Date */}
                        <Grid item xs={4}>
                            <TextField
                                label='Start Date'
                                name='startDate'
                                type='date'
                                defaultValue={
                                    props.method === 'edit'
                                        ? moment(
                                              employeeValues?.employeeExperience[0]?.startDate
                                          ).format('YYYY-MM-DD')
                                        : ''
                                }
                                onChange={handleExperienceDetailsChange}
                                size='small'
                                InputLabelProps={{ shrink: true }}
                                sx={textFieldStyle}
                                fullWidth
                            />
                        </Grid>

                        {/* End Date */}
                        <Grid item xs={4}>
                            <TextField
                                label='End Date'
                                name='endDate'
                                type='date'
                                defaultValue={
                                    props.method === 'edit'
                                        ? moment(
                                              employeeValues?.employeeExperience[0]?.endDate
                                          ).format('YYYY-MM-DD')
                                        : ''
                                }
                                onChange={handleExperienceDetailsChange}
                                size='small'
                                InputLabelProps={{ shrink: true }}
                                sx={textFieldStyle}
                                fullWidth
                            />
                        </Grid>

                        {/* UAN Number */}
                        <Grid item xs={4}>
                            <TextField
                                label='UAN Number'
                                name='uanNumber'
                                value={employeeValues?.employeeExperience?.uanNumber || ''}
                                onChange={handleExperienceDetailsChange}
                                size='small'
                                sx={textFieldStyle}
                                fullWidth
                            />
                        </Grid>

                        {/* Payslip Upload Section */}
                        <Grid item xs={12}>
                            <div
                                style={{
                                    border: '2px dashed #0056b3',
                                    padding: '20px',
                                    textAlign: 'center',
                                    borderRadius: '8px',
                                    backgroundColor: isDragActive ? '#f0f8ff' : '#f9f9f9'
                                }}
                                onDragEnter={() => setIsDragActive(true)}
                                onDragLeave={() => setIsDragActive(false)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setIsDragActive(false);
                                    handlePayslipUpload(e.dataTransfer.files);
                                }}
                            >
                                <input
                                    type='file'
                                    ref={payslipFileInputRef}
                                    accept='.pdf, .jpg, .jpeg, .png'
                                    multiple
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                        handlePayslipUpload(e.target.files);
                                        e.target.value = '';
                                    }}
                                />
                                <Typography
                                    variant='body1'
                                    style={{
                                        textAlign: 'center',
                                        color: '#0056b3',
                                        marginBottom: '16px',
                                        cursor: 'pointer'
                                    }}
                                    onClick={handlePayslipFileInputClick}
                                >
                                    {isDragActive
                                        ? 'Drop your Payslip(s) here...'
                                        : 'Drag and drop Payslip(s) here or click to upload'}
                                </Typography>

                                {employeeValues.payslipFiles?.length > 0 && (
                                    <List
                                        sx={{
                                            marginTop: '16px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '8px'
                                        }}
                                    >
                                        {employeeValues.payslipFiles.map((file, index) => (
                                            <ListItem
                                                key={index}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    padding: '8px',
                                                    backgroundColor: '#fff',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '4px'
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
                                                        size='small'
                                                        color='error'
                                                        onClick={() => removePayslip(index)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        ))}
                                    </List>
                                )}
                            </div>
                        </Grid>
                    </>
                )}
            </Grid>
        </Paper>
    );
};

export default Experience;
