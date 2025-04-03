import React from 'react';
import { TextField, Grid, MenuItem, Button, Typography, Paper } from '@mui/material';
import moment from 'moment';
import { useEffect } from 'react';

const FamilyInformation = ({
    employeeValues,
    setEmployeeValues,
    handleChange,
    textFieldStyle,
    props,
    isEditMode
}) => {
    const handleKidDetailsChange = (index, field, value) => {
        setEmployeeValues((prev) => ({
            ...prev,
            kids: prev.kids.map((kid, i) =>
                i === index
                    ? {
                          ...kid,
                          // Use the correct field names that match your API
                          [field]: value
                      }
                    : kid
            )
        }));
    };

    const addKid = () => {
        setEmployeeValues((prev) => ({
            ...prev,
            kids: [
                ...(prev.kids || []),
                {
                    name: '',
                    gender: '',
                    dob: ''
                }
            ]
        }));
    };

    useEffect(() => {
        if (isEditMode && props.employeeDetails?.childrenDetails) {
            setEmployeeValues((prev) => ({
                ...prev,
                kids: props.employeeDetails.childrenDetails.map((kid) => ({
                    name: kid.kidName || '', // Map API fields to component fields
                    gender: kid.kidGender || '',
                    dob: kid.kidDob || ''
                }))
            }));
        }
    }, [isEditMode, props.employeeDetails]);
    // Function to remove a kid
    const removeKid = (index) => {
        setEmployeeValues((prev) => ({
            ...prev,
            kids: prev.kids.filter((_, i) => i !== index)
        }));
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
                Family Information
            </Typography>
            <Grid container spacing={3}>
                {/* Parent Details */}
                <Grid item xs={4}>
                    <TextField
                        label="Father's Name"
                        name='fatherName'
                        value={employeeValues.fatherName || ''}
                        onChange={handleChange}
                        size='small'
                        sx={textFieldStyle}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label="Mother's Name"
                        name='motherName'
                        value={employeeValues.motherName || ''}
                        onChange={handleChange}
                        size='small'
                        sx={textFieldStyle}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label='Contact Number'
                        name='contactNumber'
                        value={employeeValues.contactNumber || ''}
                        onChange={handleChange}
                        size='small'
                        sx={textFieldStyle}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        select
                        label='Marital Status'
                        name='maritalStatus'
                        value={employeeValues.maritalStatus || ''}
                        onChange={handleChange}
                        size='small'
                        sx={textFieldStyle}
                        fullWidth
                    >
                        <MenuItem value='Single'>Single</MenuItem>
                        <MenuItem value='Married'>Married</MenuItem>
                    </TextField>
                </Grid>

                {/* Spouse and Kids Details if Married */}
                {employeeValues.maritalStatus === 'Married' && (
                    <>
                        <Grid item xs={4}>
                            <TextField
                                label='Spouse Name'
                                name='spouseName'
                                value={employeeValues.spouseName || ''}
                                onChange={handleChange}
                                size='small'
                                sx={textFieldStyle}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label='Spouse Aadhaar Number'
                                name='spouseAadharNumber'
                                value={employeeValues.spouseAadharNumber || ''}
                                onChange={handleChange}
                                size='small'
                                sx={textFieldStyle}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={addKid}
                                sx={{ marginBottom: '16px' }}
                            >
                                Add Kid
                            </Button>
                        </Grid>

                        {/* Kid Details */}
                        {employeeValues.kids?.map((kid, index) => (
                            <React.Fragment key={index}>
                                <Grid item xs={4}>
                                    <TextField
                                        label={`Kid ${index + 1} Name`}
                                        value={kid.name || ''} // Changed from kidName to name
                                        onChange={(e) =>
                                            handleKidDetailsChange(index, 'name', e.target.value)
                                        }
                                        size='small'
                                        sx={textFieldStyle}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        select
                                        label={`Kid ${index + 1} Gender`}
                                        value={kid.gender || ''} // Changed from kidGender to gender
                                        onChange={(e) =>
                                            handleKidDetailsChange(index, 'gender', e.target.value)
                                        }
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
                                        label={`Kid ${index + 1} Date of Birth`}
                                        type='date'
                                        value={kid.dob ? moment(kid.dob).format('YYYY-MM-DD') : ''} // Changed from kidDob to dob
                                        onChange={(e) =>
                                            handleKidDetailsChange(index, 'dob', e.target.value)
                                        }
                                        size='small'
                                        InputLabelProps={{ shrink: true }}
                                        sx={textFieldStyle}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant='outlined'
                                        color='error'
                                        onClick={() => removeKid(index)}
                                        sx={{ marginBottom: '16px' }}
                                    >
                                        Remove Kid
                                    </Button>
                                </Grid>
                            </React.Fragment>
                        ))}
                    </>
                )}
            </Grid>
        </Paper>
    );
};

export default FamilyInformation;
