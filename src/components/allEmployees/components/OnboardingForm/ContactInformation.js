import React, { useEffect } from 'react';
import { TextField, Grid, MenuItem, Paper, Typography } from '@mui/material';

const ContactInformation = ({
    employeeValues,
    setEmployeeValues,
    handleChange,
    textFieldStyle,
    errors,
    countries,
    states,
    isEditMode,
    employeeDetails
}) => {
    // Get filtered states based on selected country
    const selectedCountry = countries?.find((country) => country.name === employeeValues.country);
    const selectedCountryId = selectedCountry ? selectedCountry.country_id : null;

    // Filter states based on the selected country_id
    const filteredStates =
        states && selectedCountryId
            ? states.filter((state) => state.country_id === selectedCountryId)
            : [];
    // console.log("states in contanct ", )
    // UseEffect to set initial values in edit mode
    useEffect(() => {
        if (isEditMode && employeeDetails) {
            setEmployeeValues((prev) => ({
                ...prev,
                country: employeeDetails.country || '',
                state: employeeDetails.state || '',
                address: employeeDetails.address || '',
                city: employeeDetails.city || '',
                zipCode: employeeDetails.zipcode || '',
                emergencyContactNumber: employeeDetails.emergencyContactNumber || '',
                permenantAddress: employeeDetails.permanentAddress || ''
            }));
        }
    }, [isEditMode, employeeDetails]);

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
                Contact Information
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={4}>
                    <TextField
                        label='Address'
                        name='address'
                        value={employeeValues.address}
                        onChange={handleChange}
                        size='small'
                        multiline
                        rows={2}
                        sx={textFieldStyle}
                        error={!!errors.address}
                        helperText={errors.address}
                        required
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label='City'
                        name='city'
                        value={employeeValues.city}
                        onChange={handleChange}
                        size='small'
                        sx={textFieldStyle}
                        error={!!errors.city}
                        helperText={errors.city}
                        required
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        select
                        label='Country'
                        name='country'
                        value={employeeValues.country || ''}
                        onChange={(e) => {
                            handleChange(e);
                            setEmployeeValues((prev) => ({
                                ...prev,
                                state: ''
                            }));
                        }}
                        size='small'
                        sx={textFieldStyle}
                        error={!!errors.country}
                        helperText={errors.country}
                        required
                    >
                        <MenuItem value=''>Select Country</MenuItem>
                        {countries &&
                            countries.map((country) => (
                                <MenuItem key={country.country_id} value={country.name}>
                                    {country.name}
                                </MenuItem>
                            ))}
                    </TextField>
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        select
                        label='State'
                        name='state'
                        value={employeeValues.state || ''}
                        onChange={handleChange}
                        size='small'
                        sx={textFieldStyle}
                        error={!!errors.state}
                        helperText={errors.state}
                        disabled={!employeeValues.country}
                        required
                    >
                        <MenuItem value=''>Select State</MenuItem>
                        {filteredStates.map((state) => (
                            <MenuItem key={state.state_id} value={state.name}>
                                {state.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label='Zip Code'
                        name='zipCode'
                        value={employeeValues.zipCode}
                        onChange={handleChange}
                        size='small'
                        sx={textFieldStyle}
                        error={!!errors.zipCode}
                        helperText={errors.zipCode}
                        required
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label='Emergency Contact'
                        name='emergencyContactNumber'
                        value={employeeValues.emergencyContactNumber}
                        onChange={handleChange}
                        size='small'
                        sx={textFieldStyle}
                        error={!!errors.emergencyContactNumber}
                        helperText={errors.emergencyContactNumber}
                        required
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label='Permanent Address'
                        name='permenantAddress'
                        value={employeeValues.permenantAddress}
                        onChange={handleChange}
                        size='small'
                        multiline
                        rows={2}
                        sx={textFieldStyle}
                        error={!!errors.permenantAddress}
                        helperText={errors.permenantAddress}
                        required
                    />
                </Grid>
            </Grid>
        </Paper>
    );
};

export default ContactInformation;
