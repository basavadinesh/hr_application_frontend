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
import { createholidays, updateHolidays } from '../actions/holiday-actions';
import { manageError } from '../../core/actions/common-actions';
import { AppConfigProps } from '../../core/settings/app-config';
import './AddHoliday.css';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';


// Style for the modal container
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    bgcolor: 'background.paper',
    border: 'px solid #000',
    boxShadow: 2
};


// Main component function
export default function AddHoliday(props) {
    const history = useHistory();
    const [holidayValues, setHolidayValues] = useState({
        name: '',
        holidaydate: ''
    });

    // Handle changes to form fields
    const handleChange = async (event) => {
        await setHolidayValues((prevValues) => {
            return { ...prevValues, [event.target.name]: event.target.value };
        });
    };

    useEffect(() => {}, []);

    // Handle form submission based on method (add or edit)
    const handleSubmit = async () => {
        return props.method === 'add'
            ? addHoliday()
            : props.method === 'edit'
            ? holidayUpdate()
            : null;
    };


    // Add new holiday
    const addHoliday = async () => {
        let holidayObj = {
            name: holidayValues.name,
            holidaydate: holidayValues.holidaydate
        };

        createholidays(holidayObj)
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

    // Update existing holiday
    const holidayUpdate = async () => {
        let holidayId = props.holidayDetails?.id;
        let holidayObj = {
            name: holidayValues.name ? holidayValues.name : props.holidayDetails?.name,
            holidaydate: holidayValues.holidaydate
                ? holidayValues.holidaydate
                : props.holidayDetails?.holidaydate
        };

        updateHolidays(holidayId, holidayObj)
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
                    sx={{ width: 450, height: 50, backgroundcolor: ' #DEECF4' }}
                >
                    <CardHeader title={props.method === 'add' ? 'Add Holiday' : 'Edit Holiday'}>
                        {' '}
                    </CardHeader>
                    <IconButton
                        sx={{
                            position: 'absolute',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginLeft: '400px',
                            marginTop: '5px',
                            color: '#0070AC'
                        }}
                        onClick={() => props.handleClose()}
                    >
                        <HighlightOffIcon />
                    </IconButton>
                </AppBar>
                <Card sx={{ boxShadow: 0, minWidth: 450 }}>
                    <CardContent>
                        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            <Grid item xs={7}>
                                {' '}
                                <TextField
                                    sx={{ marginLeft: '30px', minWidth: 350, marginTop: '20px' }}
                                    required
                                    id='name'
                                    name='name'
                                    label='name'
                                    defaultValue={props.holidayDetails?.name}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={7}>
                                {' '}
                                <TextField
                                    sx={{ marginLeft: '30px', minWidth: 350, marginTop: '20px' }}
                                    required
                                    id='holidaydate'
                                    name='holidaydate'
                                    type='date'
                                    style={{ texttransform: 'uppercase' }}
                                    defaultValue={props.holidayDetails?.holidaydate}
                                    onChange={handleChange}
                                />
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
                    onClick={() => {
                        handleSubmit();
                    }}
                >
                    Submit
                </Button>
            </Box>
        </Modal>
    );
}
