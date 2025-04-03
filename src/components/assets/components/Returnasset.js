
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import Card from '@mui/material/Card'; 
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { manageError } from '../../core/actions/common-actions';
import { AppConfigProps } from '../../core/settings/app-config';
import { createAssets, updateAssets } from '../actions/assets-actions';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AppUtils from '../../core/helpers/app-utils';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '0px solid #000',
    boxShadow: 2
};

export default function ReturnAssets(props) {
    const _axiosSource = axios.CancelToken.source();
    const _cancelToken = { cancelToken: _axiosSource.token };
    const history = useHistory();
    const [assetsValues, setAssetsValues] = useState({
        // name: '',
        asset_type: '',
        serial_number: '',
        asset_returning_at: '',
        asset_approved_at: '',
        asset_received_at: '',
        assignee_comment: '',
        received_comment: '',
        status: ''
    });

    const handleChange = async (event) => {
        await setAssetsValues((prevValues) => {
            return { ...prevValues, [event.target.name]: event.target.value };
        });
    };

    // useEffect(() => {}, []);

    const handleSubmit = async () => {
        return props.method === 'return'
            ? returnAssets()
            : props.method === 'edit'
            ? assetUpdate()
            : null;
    };

    const returnAssets = async () => {
        let assetsObj = {
            asset_type: assetsValues.asset_type,
            serial_number: assetsValues.serial_number,
            asset_returning_at: AppUtils.getDateTimeFormat(assetsValues.asset_returning_at),
            asset_received_at: AppUtils.getDateTimeFormat(assetsValues.asset_received_at),
            assignee_comment: assetsValues.assignee_comment,
            received_comment: assetsValues.received_comment
        };

        createAssets(assetsObj)
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

    const assetUpdate = async () => {
        let assetsId = props.assetsDetails?.id;
        let assetsObj = {
            // name: assetsValues.name ? assetsValues.name : props.assetsDetails?.name,
            asset_type: assetsValues.asset_type
                ? assetsValues.asset_type
                : props.assetsValues?.asset_type,
            serial_number: assetsValues.serial_number
                ? assetsValues.serial_number
                : props.assetsValues?.serial_number,
            asset_received_at: assetsValues.asset_received_at
                ? assetsValues.asset_received_at
                : props.assetsValues?.asset_received_at,
            asset_approved_at: assetsValues.asset_received_at
                ? assetsValues.asset_approved_at
                : props.assetsValues?.asset_approved_at,
            assignee_comment: assetsValues.assignee_comment
                ? assetsValues.assignee_comment
                : props.assetsValues?.assignee_comment,
            received_comment: assetsValues.received_comment
                ? assetsValues.received_comment
                : props.assetsValues?.received_comment
        };

        updateAssets(assetsId, assetsObj,_cancelToken)
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
                    sx={{ width: 700, height: 60, backgroundcolor: ' #DEECF4' }}
                >
                    {/* <CardHeader title={props.method === 'return' ? 'Return Assets' : 'Add Assets'}> */}
                    <CardHeader title={props.method === 'return' ? 'Return Assets' : 'Add Assets'}>
                        {' '}
                    </CardHeader>
                    <IconButton
                        sx={{
                            position: 'absolute',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginLeft: '650px',
                            marginTop: '10px',
                            color: '#0070AC'
                        }}
                        onClick={() => props.handleClose()}
                    >
                        <HighlightOffIcon />
                    </IconButton>
                </AppBar>

                <Card sx={{ minWidth: 500, boxShadow: 0 }}>
                    <CardContent>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>

                            <Grid item xs={6}>
                                {' '}
                                <TextField
                                    sx={{ minWidth: 320 }}
                                    required
                                    id='asset_type'
                                    name='asset_type'
                                    label='Assets Type'
                                    defaultValue={props.assetsDetails?.asset_type}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                {' '}
                                <TextField
                                    sx={{ minWidth: 320 }}
                                    required
                                    id='serial_number'
                                    name='serial_number'
                                    label='Serial Number'
                                    defaultValue={props.assetsDetails?.serial_number}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                {' '}
                                <TextField
                                    sx={{ minWidth: 320 }}
                                    required
                                    id='comment'
                                    name='comment'
                                    label='Comment'
                                    defaultValue={props.assetsDetails?.assignee_comment}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    sx={{ minWidth: 320 }}
                                    id='outlined-multiline-flexible'
                                    multiline
                                    name='returning at'
                                    label='Returning at'
                                    type='date'
                                    defaultValue={props.assetsDetails?.asset_returning_at}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                {' '}
                                <TextField
                                    sx={{ minWidth: 320 }}
                                    required
                                    id='receivedcomment'
                                    name='receivedcomment'
                                    label='Received Comment'
                                    defaultValue={props.assetsDetails?.received_comment}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                {' '}
                                <TextField
                                    sx={{ minWidth: 320 }}
                                    required
                                    id='receivedat'
                                    name='receivedat'
                                    // label='Received at'
                                    type='date'
                                    defaultValue={props.assetsDetails?.asset_received_at}
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
            {/* </Fade> */}
        </Modal>
    );
}