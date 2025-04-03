import React, { useState } from 'react';
import {
    TextField,
    Grid,
    Typography,
    Button,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Paper
} from '@mui/material';
import moment from 'moment';

const EducationDetails = ({ employeeValues, setEmployeeValues, textFieldStyle, props }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentEntryState, setCurrentEntryState] = useState({
        education: '',
        specification: '',
        institution: '',
        eduStartYear: '',
        eduEndYear: '',
        gpa: ''
    });

    React.useEffect(() => {
        if (!employeeValues.educational) {
            setEmployeeValues((prev) => ({
                ...prev,
                educational: []
            }));
        }
    }, []);

    const handleEducationChange = (event) => {
        const { name, value } = event.target;
        setCurrentEntryState((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const addEducationDetail = () => {
        if (
            !currentEntryState.education ||
            !currentEntryState.institution ||
            !currentEntryState.eduStartYear ||
            !currentEntryState.eduEndYear ||
            !currentEntryState.gpa
        ) {
            alert('Please fill all required fields');
            return;
        }

        setEmployeeValues((prev) => ({
            ...prev,
            educational: [...prev.educational, currentEntryState]
        }));

        setCurrentIndex((prev) => prev + 1);
        setCurrentEntryState({
            education: '',
            specification: '',
            institution: '',
            eduStartYear: '',
            eduEndYear: '',
            gpa: ''
        });
    };

    const removeEducationDetail = (index) => {
        setEmployeeValues((prev) => ({
            ...prev,
            educational: prev.educational.filter((_, i) => i !== index)
        }));

        if (index <= currentIndex && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const educationToSpecificationsMap = {
        SSC: ['State', 'CBSE'],
        Intermediate: ['State', 'CBSE'],
        B_Tech: ['CSE', 'IT', 'EEE', 'Civil', 'ECE', 'MECH'],
        UG: ['CSE', 'IT', 'EEE', 'Civil', 'ECE', 'MECH', 'BSC', 'BCA'],
        PG: ['MSc', 'MCA', 'MBA', 'MA', 'MCom'],
        Phd: ['Science', 'Maths', 'Computers'],
        M_Tech: ['CSE', 'IT', 'EEE', 'ECE', 'MECH'],
        Others: ['other']
    };

    const currentEntry = employeeValues.educational?.[currentIndex] || {
        education: '',
        specification: '',
        institution: '',
        eduStartYear: '',
        eduEndYear: '',
        gpa: ''
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
                Education Details
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={4}>
                    <Typography sx={{ marginBottom: '8px' }}>
                        Education <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <TextField
                        select
                        name='education'
                        value={currentEntryState.education}
                        onChange={handleEducationChange}
                        size='small'
                        sx={textFieldStyle}
                        fullWidth
                    >
                        {Object.keys(educationToSpecificationsMap).map((edu) => (
                            <MenuItem key={edu} value={edu}>
                                {edu}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid item xs={4}>
                    <Typography sx={{ marginBottom: '8px' }}>Specification</Typography>
                    <TextField
                        select
                        name='specification'
                        value={currentEntryState.specification}
                        onChange={handleEducationChange}
                        size='small'
                        sx={textFieldStyle}
                        fullWidth
                    >
                        {educationToSpecificationsMap[currentEntryState.education]?.map((spec) => (
                            <MenuItem key={spec} value={spec}>
                                {spec}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid item xs={4}>
                    <Typography sx={{ marginBottom: '8px' }}>
                        Institution Name <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <TextField
                        name='institution'
                        value={currentEntryState.institution}
                        onChange={handleEducationChange}
                        size='small'
                        sx={textFieldStyle}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={4}>
                    <Typography sx={{ marginBottom: '8px' }}>
                        Start Year <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <TextField
                        name='eduStartYear'
                        type='date'
                        value={currentEntryState.eduStartYear || ''}
                        defaultValue={
                            props.method === 'edit'
                                ? moment(employeeValues.eduStartYear).format('YYYY-MM-DD')
                                : ''
                        }
                        onChange={handleEducationChange}
                        size='small'
                        InputLabelProps={{ shrink: true }}
                        sx={textFieldStyle}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={4}>
                    <Typography sx={{ marginBottom: '8px' }}>
                        End Year <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <TextField
                        name='eduEndYear'
                        type='date'
                        value={currentEntryState.eduEndYear || ''}
                        defaultValue={
                            props.method === 'edit'
                                ? moment(employeeValues.eduEndYear).format('YYYY-MM-DD')
                                : ''
                        }
                        onChange={handleEducationChange}
                        size='small'
                        InputLabelProps={{ shrink: true }}
                        sx={textFieldStyle}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={4}>
                    <Typography sx={{ marginBottom: '8px' }}>
                        GPA <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <TextField
                        name='gpa'
                        value={currentEntryState.gpa}
                        onChange={handleEducationChange}
                        size='small'
                        sx={textFieldStyle}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button
                        variant='contained'
                        color='primary'
                        onClick={addEducationDetail}
                        sx={{ ml: 2 }}
                    >
                        Add Education Detail
                    </Button>
                </Grid>

                {employeeValues.educational?.length > 0 && (
                    <Grid item xs={12}>
                        <Typography variant='h6' sx={{ mb: 2 }}>
                            Added Education Details
                        </Typography>
                        <List>
                            {employeeValues.educational.map((edu, index) =>
                                edu.education ||
                                edu.institution ||
                                edu.eduStartYear ||
                                edu.eduEndYear ||
                                edu.gpa ? (
                                    <ListItem
                                        key={index}
                                        sx={{
                                            backgroundColor:
                                                index === currentIndex ? '#e3f2fd' : '#f5f5f5',
                                            mb: 1,
                                            borderRadius: '4px',
                                            border: '1px solid #e0e0e0'
                                        }}
                                    >
                                        <ListItemText
                                            primary={
                                                edu.education
                                                    ? `${edu.education}${
                                                          edu.specification
                                                              ? ` - ${edu.specification}`
                                                              : ''
                                                      }`
                                                    : ''
                                            }
                                            secondary={
                                                <Typography component='span' variant='body2'>
                                                    {edu.institution &&
                                                        `Institution: ${edu.institution}`}
                                                    {edu.eduStartYear && edu.eduEndYear && (
                                                        <span>
                                                            <br />
                                                            {`Duration: ${edu.eduStartYear} - ${edu.eduEndYear}`}
                                                        </span>
                                                    )}
                                                    {edu.gpa && (
                                                        <span>
                                                            <br />
                                                            {`GPA: ${edu.gpa}`}
                                                        </span>
                                                    )}
                                                </Typography>
                                            }
                                        />
                                        <ListItemSecondaryAction>
                                            <Button
                                                edge='end'
                                                color='error'
                                                onClick={() => removeEducationDetail(index)}
                                            >
                                                Remove
                                            </Button>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ) : null
                            )}
                        </List>
                    </Grid>
                )}
            </Grid>
        </Paper>
    );
};

export default EducationDetails;
