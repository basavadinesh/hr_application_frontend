import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { createDepartments, updateDepartments } from '../actions/department-actions';
import { manageError } from '../../core/actions/common-actions';
import { AppConfigProps } from '../../core/settings/app-config';
import './AddDepartment.css';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

// Modal styling
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: ' px solid #000',
    boxShadow: 2
};

export default function AddDepartment(props) {
    const history = useHistory();

    // State to store department form values
    const [departmentValues, setDepartmentValues] = useState({
        departmentName: ''
    });

    // State to handle form validation errors
    const [errors, setErrors] = React.useState({});


    // Update form values when props change (e.g., when editing a department)
   useEffect(() => {
       if (props.departmentDetails) {
           setDepartmentValues((prevValues) => ({
               ...prevValues,
               departmentName: props.departmentDetails.departmentname || ''
           }));
       }
   }, [props.departmentDetails]);


    // Handle input change and update department values
    const handleChange = async (event) => {
        await setDepartmentValues((prevValues) => {
            return { ...prevValues, [event.target.name]: event.target.value };
        });
    };

    // Validate the form inputs
    const validate = () => {
        let isValid = true;
        if (!departmentValues.departmentName) {
            handleError('Please Enter Department Name', 'departmentName');
            isValid = false;
          }
         else if (isValid) {
            setErrors({});
          }
      
          return isValid;
    }
    // Set specific error messages for form inputs
    const handleError = (error, input) => {
        setErrors(prevState => ({...prevState, [input]: error}));
      };
    
    // Handle form submission
    const handleSubmit = async () => {
        if (validate()) {
            if (props.method === 'add') {
                addDepartment();
                setDepartmentValues({
                    departmentName: ''
                });
            } else if (props.method === 'edit') {
                departmentUpdate();
                setDepartmentValues({
                    departmentName: ''
                });
            }
        }
    };
    
    // Reset form values
   const handleClose = () => {
       setErrors({});
       props.handleClose();
       setDepartmentValues({
       departmentName: ''
       });
   };

    // Close modal and clear form and errors
    const addDepartment = async () => {
        let departmentObj = {
            departmentname: departmentValues.departmentName
        };

        createDepartments(departmentObj)
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
    
    
    // Function to handle updating an existing department
    const departmentUpdate = async () => {
        let departmentId = props.departmentDetails?.id;
        let departmentObj = {
            departmentname: departmentValues.departmentName
                ? departmentValues.departmentName
                : props.departmentDetails?.departmentname
        };
        updateDepartments(departmentId, departmentObj)
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
                        title={props.method === 'add' ? 'Add Department' : 'Edit Department'}
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
                <Card sx={{ width: 400, boxShadow: 0 }}>
                    <CardContent>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            <Grid item xs={6}>
                                {' '}
                                <TextField
                                    sx={{ minWidth: 350, marginTop: '20px' }}
                                    required
                                    id='departmentName'
                                    name='departmentName'
                                    label='DepartmentName'
                                    onFocus={() => handleError(null, 'departmentName')}
                                    error={errors.departmentName}
                                    helperText={errors.departmentName}
                                    value={departmentValues.departmentName}
                                    SelectProps={{ native: true }}
                                    onChange={handleChange}
                                >    
                                 
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
