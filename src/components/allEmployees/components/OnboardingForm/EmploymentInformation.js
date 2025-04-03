import React, { useState, useEffect } from 'react';
import { TextField, Grid, MenuItem, Autocomplete, Typography, Paper } from '@mui/material';
import moment from 'moment';

const EmploymentInformation = ({
    employeeValues,
    setEmployeeValues,
    handleChange,
    textFieldStyle,
    props,
    errors = {},
    setErrors,
    departments = [],
    designations = [],
    managers = [],
    projectNames = []
}) => {
    const [managerOptions, setManagerOptions] = useState([]);

    useEffect(() => {
        if (managers && managers.length > 0) {
            setManagerOptions(
                managers.map((manager) => ({
                    label: manager.firstname,
                    managerEmail: manager.email
                }))
            );
        }
    }, [managers]);

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
    console.log('Designations', designations);
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
                Employment Information
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={4}>
                    <TextField
                        required
                        label='Employee ID'
                        name='number'
                        value={employeeValues.number}
                        onChange={handleChange}
                        error={!!errors.number}
                        helperText={errors.number}
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
                <Grid item xs={4}>
                    <TextField
                        label='Joining Date'
                        name='joiningdate'
                        type='date'
                        defaultValue={
                            props.method === 'edit' &&
                            moment(employeeValues.joiningdate).format('YYYY-MM-DD')
                        }
                        onChange={handleChange}
                        error={!!errors.joiningdate}
                        helperText={errors.joiningdate}
                        size='small'
                        sx={textFieldStyle}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        select
                        label='Department'
                        name='department'
                        value={employeeValues.department || ''}
                        onChange={handleChange}
                        size='small'
                        sx={textFieldStyle}
                        error={!!errors.department}
                        helperText={errors.department}
                        fullWidth
                    >
                        {departments.map((option) => (
                            <MenuItem key={option.id} value={option.departmentname}>
                                {option.departmentname}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        select
                        label='Designation'
                        name='designation'
                        value={employeeValues.designation || ''}
                        onChange={handleChange}
                        size='small'
                        sx={textFieldStyle}
                        error={!!errors.designation}
                        helperText={errors.designation}
                        fullWidth
                    >
                        {designations.map((option) => (
                            <MenuItem key={option.id} value={option.designation}>
                                {option.designation}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        required
                        label='Work Email'
                        name='workEmail'
                        type='email'
                        value={employeeValues.workEmail}
                        onChange={handleChange}
                        error={!!errors.workEmail}
                        helperText={errors.workEmail}
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
                <Grid item xs={4}>
                    <TextField
                        select
                        label='Projects'
                        name='projects'
                        value={employeeValues.projects || ''}
                        onChange={handleChange}
                        size='small'
                        sx={textFieldStyle}
                        error={!!errors.projects}
                        helperText={errors.projects}
                        fullWidth
                    >
                        {projectNames.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        select
                        label='Employee Type'
                        name='employeeType'
                        value={employeeValues.employeeType}
                        onChange={handleChange}
                        error={!!errors.employeeType}
                        helperText={errors.employeeType}
                        size='small'
                        sx={textFieldStyle}
                    >
                        <MenuItem value='Full Time'>Full Time</MenuItem>
                        <MenuItem value='Part Time'>Part Time</MenuItem>
                        <MenuItem value='Contract'>Contract</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        select
                        label='Employee Status'
                        name='employeeStatus'
                        value={employeeValues.employeeStatus || ''}
                        onChange={handleChange}
                        error={!!errors.employeeStatus}
                        helperText={errors.employeeStatus}
                        size='small'
                        sx={textFieldStyle}
                        fullWidth
                    >
                        <MenuItem value='Initiated'>Initiated</MenuItem>
                        <MenuItem value='Pending'>Pending</MenuItem>
                        <MenuItem value='Active'>Active</MenuItem>
                        <MenuItem value='On Leave'>On Leave</MenuItem>
                        <MenuItem value='Hold'>Hold</MenuItem>
                        <MenuItem value='Resigned'>Resigned</MenuItem>
                        <MenuItem value='Terminated'>Terminated</MenuItem>
                        <MenuItem value='Retired'>Retired</MenuItem>
                        <MenuItem value='Contract Ended'>Contract Ended</MenuItem>
                        <MenuItem value='Inactive'>Inactive</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label='Company'
                        name='company'
                        value={employeeValues.company}
                        error={!!errors.company}
                        helperText={errors.company}
                        onChange={handleChange}
                        size='small'
                        sx={textFieldStyle}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        select
                        label='Role'
                        name='role'
                        value={employeeValues.role}
                        onChange={handleChange}
                        error={!!errors.role}
                        helperText={errors.role}
                        size='small'
                        sx={textFieldStyle}
                    >
                        <MenuItem value='ADMIN'>Admin</MenuItem>
                        <MenuItem value='USER'>user</MenuItem>
                        <MenuItem value='HR'>Hr</MenuItem>
                        <MenuItem value='EMPLOYEE'>Employee</MenuItem>
                        <MenuItem value='MANAGER'>Manager</MenuItem>
                        <MenuItem value='ANONYMOUS'>Anonymous</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={4}>
                    <Autocomplete
                        options={managerOptions}
                        getOptionLabel={(option) => option.label}
                        value={
                            employeeValues.manager
                                ? {
                                      label: employeeValues.manager,
                                      managerEmail: employeeValues.managerEmail
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
                                label='Reporting To'
                                error={!!errors.manager}
                                helperText={errors.manager || ''}
                                size='small'
                            />
                        )}
                        onChange={handleManagerChange}
                        size='small'
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label='Work Location'
                        name='workLocationName'
                        value={employeeValues.workLocationName}
                        error={!!errors.workLocationName}
                        helperText={errors.workLocationName}
                        onChange={handleChange}
                        size='small'
                        sx={textFieldStyle}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label='Reference'
                        name='reference'
                        value={employeeValues.reference}
                        error={!!errors.reference}
                        helperText={errors.reference}
                        onChange={handleChange}
                        size='small'
                        sx={textFieldStyle}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label='Date Of Exit'
                        name='dateOfExit'
                        type='date'
                        defaultValue={
                            props.method === 'edit' &&
                            moment(employeeValues.dateOfExit).format('YYYY-MM-DD')
                        }
                        onChange={handleChange}
                        size='small'
                        sx={textFieldStyle}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />
                </Grid>
            </Grid>
        </Paper>
    );
};

export default EmploymentInformation;
