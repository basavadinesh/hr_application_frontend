import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Select from '@mui/material/Select';
import moment from 'moment';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import { Typography } from '@mui/material';
import axios from 'axios';
import { manageError } from '../../core/actions/common-actions';
import { AppConfigProps } from '../../core/settings/app-config';
import AppUtils from 'components/core/helpers/app-utils';
import { useHistory } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';

// Styles for the modal box
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 675,
    bgcolor: 'background.paper',
    boxShadow: 24,
    padding: '20px'
};

// Multi-select options
const documentOptions = ['Offer Letter', 'Hike Letter', 'Experience Letter'];

export default function AddRelievingInfo(props) {
    const _axiosSource = axios.CancelToken.source();
    const history = useHistory();
    const _cancelToken = { cancelToken: _axiosSource.token };
    console.log('employee', props.employeeDetails);
    console.log('relieving', props.relievingDetails);
    const [relievingValues, setRelievingValues] = useState({
        uaerId: '',
        employeeName: '',
        employeeCode: '',
        designation: '',
        joiningdate: '',
        DateOfExit: '',
        lastDrawnCTC: '',
        reportingTo: '',
        comments: '',
        documentsIssued: []
    });

    const [errors, setErrors] = useState({});
    const userId = localStorage.getItem('userId');
    const handleChange = (event) => {
        const { name, value } = event.target;
        setRelievingValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }));
    };
    const handleDocumentChange = (event) => {
        const { value } = event.target;
        // Filter out any empty or falsy values from the selected documents
        const filteredValues = value.filter((doc) => doc !== '' && doc !== undefined);

        setRelievingValues((prevValues) => ({
            ...prevValues,
            documentsIssued: filteredValues // set the filtered values
        }));
    };

    const validate = () => {
        let isValid = true;
        let tempErrors = {};

        // if (!relievingValues.employeeName) tempErrors.employeeName = 'Employee Name is required';
        // if (!relievingValues.designation) tempErrors.designation = 'Designation is required';
        // if (!relievingValues.joiningdate) tempErrors.joiningdate = 'Joining date is required';
        if (!relievingValues.lastDrawnCTC) tempErrors.lastDrawnCTC = 'Last drawn CTC is required';
        // if (!relievingValues.reportingTo) tempErrors.reportingTo = 'Reporting to is required';

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
          
                addRelievingInfo();
        
            // Call API to edit existing relieving info
        }
    };

    const ClearedValues = () => {
        setRelievingValues({
            employeeName: '',
            employeeCode: '',
            designation: '',
            joiningdate: '',
            DateOfExit: '',
            lastDrawnCTC: '',
            reportingTo: '',
            comments: '',
            documentsIssued: []
        });
    };
    const createRelievingInfo = async (queryObj, cancelToken) => {
        try {
            // Create FormData object
            const formData = new FormData();

            // Append the fields to the FormData object
            formData.append('employeeName', queryObj.employeeName);
            formData.append('employeeCode', queryObj.employeeCode);
            formData.append('designation', queryObj.designation);
            formData.append('reportingTo', queryObj.reportingTo);
            formData.append('lastDrawnCTC', queryObj.lastDrawnCTC);
            formData.append('comments', queryObj.comments);
            formData.append('joiningdate', queryObj.joiningdate);
            formData.append('DateOfExit', queryObj.DateOfExit);
            formData.append('userId', relievingValues.userId);

            // Send null for multipartfile
            formData.append('document', null);

            // Combine the documentsIssued array into a single comma-separated string
            const documentsIssuedString = queryObj.documentsIssued.join(', '); // Join with commas

            // Append the documentsIssued string to the FormData
            formData.append('documentsIssued', documentsIssuedString);

            // API call to create relieving info
            const response = await axios.post('api/v1/user/relievinginfo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                cancelToken: cancelToken.token // If using a cancellation token
            });

            // After successful response, execute the following:
            if (response.status === 200) {
                // Reset errors, clear form, and close modal
                setErrors({});
                props.handleClose();
                ClearedValues();
            }

            return response;
        } catch (error) {
            console.error('Error while creating relieving info:', error);
            throw error;
        }
    };

    // Function to handle API call when form is submitted
    const addRelievingInfo = async () => {
        // Build the query object
        let queryObj = {
            employeeName: relievingValues.employeeName,
            employeeCode: relievingValues.employeeCode,
            designation: relievingValues.designation,
            reportingTo: relievingValues.reportingTo,
            lastDrawnCTC: relievingValues.lastDrawnCTC, // Ensure this is BigDecimal-compatible if needed
            comments: relievingValues.comments,
            documentsIssued: relievingValues.documentsIssued,
            joiningdate:
                relievingValues.joiningdate === ''
                    ? null
                    : AppUtils.getDateFormat(relievingValues.joiningdate),
            DateOfExit:
                relievingValues.DateOfExit === ''
                    ? null
                    : AppUtils.getDateFormat(relievingValues.DateOfExit),
            user_id: userId // Assuming you have `userId` available in your component
        };

        // Call the createRelievingInfo API with null for files
        createRelievingInfo(queryObj, _cancelToken)
            .then(async (res) => {
                if (res && res.status === 200) {
                    // Handle success (e.g., close modal, refresh data, etc.)
                    handleClose();
                    props.handleClose();
                    // Assuming there's a function to reload data
                } else {
                    // Handle error response (e.g., show error messages)
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                // Handle error (e.g., show error messages)
                await manageError(err, history);
            });
    };

    useEffect(() => {
        if (props.employeeDetails) {
            setRelievingValues((prevValues) => ({
                ...prevValues,
                employeeName: props.employeeDetails.fullname || '',
                employeeCode: props.employeeDetails.employeeid || '',
                designation: props.employeeDetails.designation || '',
                joiningdate: props.employeeDetails.joiningdate || '',
                DateOfExit: props.employeeDetails.DateOfExit || '',
                lastDrawnCTC: props.relievingDetails?.lastDrawnCTC || '',
                reportingTo: props.employeeDetails?.manager || '',
                comments: props.relievingDetails?.comments || '',
                documentsIssued: (props.relievingDetails?.documentsIssued || '')
                    .split(',')
                    .map((doc) => doc.trim()), // Convert to array and trim any whitespace
                userId: props.employeeDetails.id || ''
            }));
        }
    }, [props.employeeDetails]);

    const handleClose = () => {
        setErrors({});
        props.handleClose();
        setRelievingValues({
            employeeName: '',
            employeeCode: '',
            designation: '',
            joiningdate: '',
            DateOfExit: '',
            lastDrawnCTC: '',
            reportingTo: '',
            comments: '',
            documentsIssued: []
        });
    };

    return (
        <Modal
            open={props.open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={props.Backdrop}
            BackdropProps={{ timeout: 500 }}
        >
            <Box sx={style}>
                <Card sx={{ boxShadow: 0 }}>
                    {/* Ensure only CardHeader has the blue background */}
                    <CardHeader
                        title={
                            props.method === 'add' ? 'Add Relieving Info' : 'Edit Relieving Info'
                        }
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
                                    readOnly
                                    label='Employee Name'
                                    name='employeeName'
                                    value={relievingValues.employeeName}
                                    onChange={handleChange}
                                    error={!!errors.employeeName}
                                    helperText={errors.employeeName}
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
                                    label='Employee Code'
                                    name='employeeCode'
                                    value={relievingValues.employeeCode}
                                    onChange={handleChange}
                                    error={!!errors.employeeCode}
                                    helperText={errors.employeeCode}
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
                                    value={relievingValues.designation}
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
                                    label='Joining Date'
                                    name='joiningdate'
                                    type='date'
                                    defaultValue={moment(relievingValues?.joiningdate).format(
                                        'YYYY-MM-DD'
                                    )}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors.joiningdate}
                                    helperText={errors.joiningdate}
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
                                    label='Date of Exit'
                                    name='DateOfExit'
                                    type='date'
                                    defaultValue={moment(relievingValues?.DateOfExit).format(
                                        'YYYY-MM-DD'
                                    )}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors.DateOfExit}
                                    helperText={errors.DateOfExit}
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
                                    label='Reporting To'
                                    name='reportingTo'
                                    value={relievingValues.reportingTo}
                                    onChange={handleChange}
                                    error={!!errors.reportingTo}
                                    helperText={errors.reportingTo}
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
                                    label='Last Drawn CTC'
                                    name='lastDrawnCTC'
                                    value={relievingValues.lastDrawnCTC}
                                    onChange={handleChange}
                                    error={!!errors.lastDrawnCTC}
                                    type='number' // Type 'number' for automatic increment/decrement arrows
                                    inputProps={{
                                        step: '0.01', // Allows for decimals, e.g., increment by 0.01
                                        min: 0 // Prevent negative values
                                    }}
                                    sx={{ marginBottom: 2 }}
                                    onFocus={() => {
                                        
                                        setErrors((prevErrors) => ({
                                            ...prevErrors,
                                            lastDrawnCTC: '' 
                                        }));
                                    }}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <Select
                                    fullWidth
                                    multiple
                                    displayEmpty
                                    value={relievingValues.documentsIssued}
                                    onChange={handleDocumentChange}
                                    renderValue={(selected) => {
                                        // Filter out empty strings
                                        const filteredSelected = selected.filter(
                                            (doc) => doc !== ''
                                        );
                                        return filteredSelected.length === 0
                                            ? 'Select Documents'
                                            : filteredSelected.join(', ');
                                    }}
                                    sx={{ marginBottom: 2 }}
                                >
                                    {documentOptions.map((document) => (
                                        <MenuItem key={document} value={document}>
                                            <Checkbox
                                                checked={relievingValues.documentsIssued.includes(
                                                    document
                                                )}
                                            />
                                            <ListItemText primary={document} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label='Comments'
                                    name='comments'
                                    value={relievingValues.comments}
                                    onChange={handleChange}
                                    multiline
                                    rows={3}
                                    sx={{ marginBottom: 2 }}
                                />
                            </Grid>

                            {/* <Grid item xs={6}>
                                <Typography sx={{ marginLeft: '10px' }}>
                                    Upload Files <span className='error'>*</span>
                                </Typography>
                                <input
                                    type='file'
                                    multiple
                                    onChange={(e) => handleDocumentChange(e.target.files)}
                                />
                                <br />
                                {errors.documents && (
                                    <Typography variant='caption' color='error'>
                                        {errors.documents}
                                    </Typography>
                                )}
                                {props.method === 'edit' && fileNames && (
                                    <p>Attached Documents: {fileNames}</p>
                                )}
                            </Grid> */}
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
                    Submit
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
}
