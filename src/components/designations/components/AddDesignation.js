import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { createDesignations, updateDesignations } from '../actions/designation-actions';
import { manageError } from '../../core/actions/common-actions';
import { AppConfigProps } from '../../core/settings/app-config';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import './AddDesignation.css';

// Styles for the modal box
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: 'px solid #000',
    boxShadow: 2
};

// AddDesignation component handles adding and editing designations
export default function AddDesignation(props) {
    // Axios cancel token for request cancellation
    const _axiosSource = axios.CancelToken.source();
    const _cancelToken = { cancelToken: _axiosSource.token };
    const history = useHistory();
    const [designationValues, setDesignationValues] = useState({
        designation: '',
        department: ''
    });

    // Handle input changes and update state
    const handleChange = async (event) => {
        await setDesignationValues((prevValues) => {
            return { ...prevValues, [event.target.name]: event.target.value };
        });
    };

    // State to manage validation errors
    const [errors, setErrors] = React.useState({});

    // Validate form inputs
    const validate = () => {
        let isValid = true;
        if (!designationValues.designation) {
            handleError('Please enter designation', 'designation');
            isValid = false;
          }
          if (!designationValues.department) {
            handleError('Please select department', 'department');
            isValid = false;
          }
         else if (isValid) {
            // handleSubmit();
            setErrors({});
          }
      
        return isValid;
    }

    // Handle errors by setting the error message for the specified input
    const handleError = (error, input) => {
        setErrors(prevState => ({...prevState, [input]: error}));
      };


    // Populate form values when editing an existing designation
    useEffect(() => {
        if (props.designationDetails) {
            setDesignationValues((prevValues) => ({
                ...prevValues,
                designation: props.designationDetails.designation || '',
                department: props.designationDetails.department || ''
            }));
        }
    }, [props.designationDetails]);


    // Handle form submission
    const handleSubmit = async () => {

        if (validate()) {
            if (props.method === 'add') {
                addDesignation();
                setDesignationValues({
                    designation: '',
                    department: ''
                });
            } else if (props.method === 'edit') {
                designationUpdate();
                setDesignationValues({
                    designation: '',
                    department: ''
                });
            }
        }
    };

    // Add a new designation
    const addDesignation = async () => {
        let designationObj = {
            designation: designationValues.designation,
            department: designationValues.department
        };

        createDesignations(designationObj)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    props.handleClose();
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            });
    };

    // Update an existing designation
    const designationUpdate = async () => {
        let designationId = props.designationDetails?.id;
        let designationObj = {
            designation: designationValues.designation
                ? designationValues.designation
                : props.designationDetails?.designation,
            department: designationValues.department
                ? designationValues.department
                : props.designationDetails?.department
        };

        updateDesignations(designationId, designationObj, _cancelToken)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    props.handleClose();
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            });
    };

    // Close the modal and reset form values
    const handleClose = () => {
        setErrors({});
        props.handleClose();
        setDesignationValues({
            designation: '',
            department: ''
        });
    };

    return (
        <Modal
            aria-labelledby='spring-modal-title'
            aria-describedby='spring-modal-description'
            open={props.open}
            onClose={props.handleClose}
            closeAfterTransition
            BackdropComponent={props.Backdrop}
            BackdropProps={{
                timeout: 500
            }}
        >
            <Box component='form' sx={style} noValidate autoComplete='off'>
                <AppBar
                    position='static'
                    sx={{ width: 400, height: 50, backgroundcolor: ' #DEECF4' }}
                >
                    <CardHeader
                        title={props.method === 'add' ? 'Add Designation' : 'Edit Designation'}
                    >
                        {' '}
                    </CardHeader>
                    <IconButton
                        sx={{
                            position: 'absolute',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginLeft: '350px',
                            marginTop: '10px',
                            color: '#0070AC'
                        }}
                        onClick={handleClose}
                    >
                        <HighlightOffIcon />
                    </IconButton>
                </AppBar>

                <Card sx={{ minWidth: 400, boxShadow: 0 }}>
                    <CardContent>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            <Grid item xs={7}>
                                {' '}
                                <TextField
                                    sx={{ minWidth: 350, marginTop: '20px' }}
                                    required
                                    id='designation'
                                    name='designation'
                                    label='designation'
                                    onFocus={() => handleError(null, 'designation')}
                                    error={errors.designation}
                                    helperText={errors.designation}
                                    value={designationValues.designation}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={7}>
                                {' '}
                                
                                <TextField
                                    select
                                    sx={{ minWidth: 350, marginTop: '20px' }}
                                    required
                                    id='department'
                                    name='department'
                                    label='department'
                                    onFocus={() => handleError(null, 'department')}
                                    error={errors.department}
                                    // defaultValue={props.designationDetails?.department}
                                    // {...getFieldProps('designation')}
                                    helperText={errors.department}
                                    value={designationValues.department}
                                    SelectProps={{ native: true }}
                                    onChange={handleChange}
                                >
                           <option value=''></option>
                                    {/* <option value="">Select Department</option> */}
                                    {props.departments &&
                                        props.departments.map((option) => (
                                            <option key={option.id} value={option.departmentname}>
                                                {option.departmentname}
                                            </option>
                                        ))}
                                </TextField>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <div></div>
                <Button
                    style={{
                        marginTop: '10px',
                        float: 'right',
                        marginRight: '20px',
                        marginBottom: '20px',
                        borderRadius: '40px',
                        backgroundColor: '#0070ac'
                    }}
                    variant='contained'
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
                <Button
                    sx={{
                        marginTop: '10px',
                        float: 'right',
                        marginRight: '20px',
                        marginBottom: '20px',
                        borderRadius: '40px',
                        backgroundColor: '#d3f0ff', 
                        color: '#0070ac', 
                        border: '1px solid #0070ac',
                        '&:hover': {
                            backgroundColor: '#0070ac', 
                            color: '#fff' 
                        }
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
