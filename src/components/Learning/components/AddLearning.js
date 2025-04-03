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
import { Typography } from '@mui/material';
import { manageError } from '../../core/actions/common-actions';
import { AppConfigProps } from '../../core/settings/app-config';
import AppUtils from 'components/core/helpers/app-utils';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import moment from 'moment';
import { createLearning, updateLearning } from '../actions/learning-actions';

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

export default function AddLearning(props) {
    // Axios cancel token for request cancellation
    const _axiosSource = axios.CancelToken.source();
    const _cancelToken = { cancelToken: _axiosSource.token };
    const history = useHistory();

    // State to manage form values
    const [learningValues, setLearningValues] = useState({
        title: '',
        completionPercentage: '',
        startDate: '',
        completionDate: '',
        evidenceattachments: '',
        watchedLink: '',
        user_id: '',
        documents: ''
    });

    // State to manage uploaded file and errors
    const [uploadFile, setUploadFile] = React.useState();
    const [fileName, setFileName] = useState('');

    // Retrieve user ID from local storage
    const userId = localStorage.getItem('userId');
    const [errors, setErrors] = React.useState({});

    useEffect(() => {
        // Set user ID in learning values
        if (userId) {
            setLearningValues((prevValues) => ({
                ...prevValues,
                user_id: userId
            }));
        }

        // Initialize leaveValues with props.leaveDetails when it is available
        if (props.learningDetails) {
            if (props.learningDetails.documents) {
                const filenamesList = props.learningDetails.documents
                    .map((doc) => doc.filename)
                    .join(', ');
                setFileName(filenamesList);
            }
            setLearningValues((prevValues) => ({
                ...prevValues,
                title: props.learningDetails.title || '',
                completionPercentage: props.learningDetails.completionPercentage || '',
                startDate: props.learningDetails.startDate || '',
                completionDate: props.learningDetails.completionDate || '',
                evidenceattachments: props.learningDetails.evidenceattachments || '',
                watchedLink: props.learningDetails.watchedLink || '',
                user_id: props.learningDetails.user_id || ''
            }));
        }
    }, [props.learningDetails]);

    // Handle file upload and validation
    const handleDocumentChange = async (event) => {
        const files = event.target.files;
        const file = files[0];
        const fileName = file.name;
        const fileExtension = fileName.split('.').pop().toLowerCase();

        if (fileExtension !== 'doc' && fileExtension !== 'docx') {
            setErrors((prevState) => ({
                ...prevState,
                evidenceattachments:
                    'Only DOC or DOCX files are accepted. Please upload a valid document.'
            }));
            return;
        }

        setFileName(fileName);

        if (files.length > 0) {
            setLearningValues((prevValues) => ({
                ...prevValues,
                evidenceattachments: files
            }));
            setUploadFile(files);

            setErrors((prevErrors) => ({
                ...prevErrors,
                evidenceattachments: ''
            }));
        }
    };

    // Handle input field changes
    const handleChange = async (event) => {
        await setLearningValues((prevValues) => {
            return { ...prevValues, [event.target.name]: event.target.value };
        });
    };

    // Validate form inputs
    const validate = () => {
        let isValid = true;

        if (!learningValues.title) {
            handleError('Please enter title', 'title');
            isValid = false;
        }
        if (!learningValues.completionPercentage) {
            handleError('Please enter percentage of completion', 'completionPercentage');
            isValid = false;
        }
        if (!learningValues.startDate) {
            handleError('Please enter start date', 'startDate');
            isValid = false;
        }
        if (!learningValues.completionDate) {
            handleError('Please enter completion date', 'completionDate');
            isValid = false;
        }
        if (!learningValues.watchedLink) {
            handleError('Please enter watched link', 'watchedLink');
            isValid = false;
        }

        if (
            props.method === 'add' &&
            (!learningValues.evidenceattachments || learningValues.evidenceattachments.length === 0)
        ) {
            handleError('Please upload at least one doc or docx file', 'evidenceattachments');
            isValid = false;
        } else if (learningValues.evidenceattachments) {
            const file = learningValues.evidenceattachments[0];
            if (file) {
                const fileName = file.name;
                const fileExtension = fileName.split('.').pop().toLowerCase();

                // Validate the file extension for .doc or .docx
                if (fileExtension !== 'doc' && fileExtension !== 'docx') {
                    handleError(
                        'Only DOC or DOCX files are accepted. Please upload a valid document.',
                        'evidenceattachments'
                    );
                    isValid = false;
                }
            }
        }

        if (isValid) {
            setErrors({});
        }

        return isValid;
    };

    // Set error messages for form fields
    const handleError = (error, input) => {
        setErrors((prevState) => ({ ...prevState, [input]: error }));
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (validate()) {
            if (props.method === 'add') {
                addLearning();
            } else if (props.method === 'edit') {
                learningUpdate();
            }

            setLearningValues({
                title: '',
                completionPercentage: '',
                startDate: '',
                completionDate: '',
                evidenceattachments: '',
                watchedLink: '',
                user_id: ''
            });
        } else {
            // setSaveButtonClicked(false);
            // setLoading(false);
        }
    };

    const addLearning = async () => {
        let queryObj = {
            title: learningValues.title,
            completionPercentage: learningValues.completionPercentage,
            watchedLink: learningValues.watchedLink,
            startDate: AppUtils.getDateFormat(learningValues.startDate),
            completionDate: AppUtils.getDateFormat(learningValues.completionDate),
            user_id: userId,
            filepath: null
        };

        let learningObj = uploadFile;

        createLearning(queryObj, learningObj, _cancelToken)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    props.handleClose();
                    handleClose();
                    props.reloadLearning(userId);
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            });
    };

    // Update existing learning record
    const learningUpdate = async () => {
        let learningId = props.learningDetails?.id;
        var formdata = new FormData();

        // Append other properties to FormData
        formdata.append('title', learningValues.title || props.learningDetails?.title);
        formdata.append(
            'completionPercentage',
            learningValues.completionPercentage || props.learningDetails?.completionPercentage
        );
        formdata.append(
            'watchedLink',
            learningValues.watchedLink || props.learningDetails?.watchedLink
        );
        formdata.append(
            'startDate',
            learningValues.startDate
                ? AppUtils.getDateFormat(learningValues.startDate)
                : props.learningDetails?.startDate
        );
        formdata.append(
            'completionDate',
            learningValues.completionDate
                ? AppUtils.getDateFormat(learningValues.completionDate)
                : props.learningDetails?.completionDate
        );
        formdata.append('user_Id', userId);

        // Append evidenceattachments (if there are any files in uploadFile)
        if (uploadFile && uploadFile.length > 0) {
            for (let i = 0; i < uploadFile.length; i++) {
                formdata.append('evidenceattachments', uploadFile[i]);
            }
        } else {
            formdata.append('evidenceattachments', ''); // Handle the case where no file is uploaded
        }

        updateLearning(learningId, formdata, _cancelToken)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    props.handleClose();
                    props.reloadLearning(userId);
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            });
    };

    // Handle modal close
    const handleClose = () => {
        setErrors({});
        props.handleClose();
        setFileName('');
        setLearningValues({
            title: '',
            completionPercentage: '',
            startDate: '',
            completionDate: '',
            evidenceattachments: '',
            watchedLink: '',
            user_id: '',
            documents: ''
        });
    };

    return (
        <Modal
            aria-labelledby='spring-modal-title'
            aria-describedby='spring-modal-description'
            open={props.open}
            // onClose={props.handleClose}
            onClose={handleClose}
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
                    <CardHeader title={props.method === 'add' ? 'Add Learning' : 'Edit Learning'}>
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
                        onClick={handleClose}
                    >
                        <HighlightOffIcon />
                    </IconButton>
                </AppBar>

                <Card sx={{ minWidth: 500, boxShadow: 0 }}>
                    <CardContent>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            <Grid item xs={6}>
                                {/* <Typography sx={{ marginLeft: '10px' }}>Title<span className='error'>*</span></Typography> */}
                                <TextField
                                    sx={{ minWidth: 270 }}
                                    required
                                    id='title'
                                    name='title'
                                    label='Title'
                                    type='text'
                                    onFocus={() => handleError(null, 'title')}
                                    // value={learningValues.title}
                                    // onFocus={() => setErrors(prevErrors => ({ ...prevErrors, title: '' }))}
                                    error={errors.title}
                                    helperText={errors.title}
                                    defaultValue={props.learningDetails?.title}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                {/* <Typography sx={{ marginLeft: '10px' }}>Percentage of  <span className='error'>*</span></Typography> */}
                                <TextField
                                    sx={{ minWidth: 270 }}
                                    required
                                    id='completionPercentage'
                                    name='completionPercentage'
                                    label='Percentage of completion'
                                    type='text'
                                    onFocus={() => handleError(null, 'completionPercentage')}
                                    value={learningValues.completionPercentage}
                                    // onBlur={() => setErrors(prevState => ({...prevState, completionPercentage: !learningValues.completionPercentage}))}
                                    error={!!errors.completionPercentage}
                                    helperText={errors.completionPercentage}
                                    // defaultValue={props.learningDetails?.completionPercentage}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <Typography sx={{ marginLeft: '10px' }}>
                                    Start Date <span className='error'>*</span>
                                </Typography>
                                <TextField
                                    sx={{ minWidth: 270 }}
                                    required
                                    id='startDate'
                                    name='startDate'
                                    type='date'
                                    onFocus={() => handleError(null, 'startDate')}
                                    // value={learningValues.startDate}
                                    error={errors.startDate}
                                    style={{ texttransform: 'uppercase' }}
                                    helperText={errors.startDate}
                                    // defaultValue={props.learningDetails?.startDate}
                                    defaultValue={
                                        props.method === 'edit' &&
                                        moment(props.learningDetails?.startDate).format(
                                            'YYYY-MM-DD'
                                        )
                                    }
                                    // formatDate={(date) => moment(new Date(date)).format('dd/mm/yyyy')}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography sx={{ marginLeft: '10px' }}>
                                    End Date <span className='error'>*</span>
                                </Typography>
                                <TextField
                                    sx={{ minWidth: 270 }}
                                    required
                                    id='completionDate'
                                    name='completionDate'
                                    type='date'
                                    onFocus={() => handleError(null, 'completionDate')}
                                    // value={learningValues.completionDate}
                                    error={errors.completionDate}
                                    // value={
                                    //     learningValues.completionDate
                                    //         ? learningValues.completionDate
                                    //         : moment(props.learningDetails?.completionDate).format(
                                    //             'MM/DD/YYYY'
                                    //         )
                                    // }
                                    helperText={errors.completionDate}
                                    style={{ texttransform: 'uppercase' }}
                                    defaultValue={
                                        props.method === 'edit' &&
                                        moment(props.learningDetails?.completionDate).format(
                                            'YYYY-MM-DD'
                                        )
                                    }
                                    // defaultValue={props.learningDetails?.completionDate}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                {' '}
                                {/* <Typography sx={{ marginLeft: '10px' }}>watched Link</Typography> */}
                                <TextField
                                    sx={{ minWidth: 270, marginTop: '20px' }}
                                    required
                                    id='watchedLink'
                                    name='watchedLink'
                                    label='Watched Link'
                                    // onBlur={() => setErrors(prevState => ({...prevState, watchedLink: !learningValues.watchedLink}))}
                                    onFocus={() => handleError(null, 'watchedLink')}
                                    error={errors.watchedLink}
                                    // value={learningValues.watchedLink}
                                    helperText={errors.watchedLink}
                                    defaultValue={props.learningDetails?.watchedLink}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <input
                                    type='file'
                                    multiple
                                    onChange={(e) => handleDocumentChange(e)}
                                    style={{ marginTop: '20px' }}
                                />
                                <br />
                                {errors.evidenceattachments && (
                                    <Typography variant='caption' color='error'>
                                        {errors.evidenceattachments}
                                    </Typography>
                                )}
                                {fileName && <p>Attached Documents: {fileName}</p>}
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
            {/* </Fade> */}
        </Modal>
    );
}
