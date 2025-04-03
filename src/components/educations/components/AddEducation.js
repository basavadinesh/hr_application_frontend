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
import { createEducation, updateEducation } from '../actions/education-actions';
import { manageError } from '../../core/actions/common-actions';
import { AppConfigProps } from '../../core/settings/app-config';
import AppUtils from 'components/core/helpers/app-utils';
import './Education.css';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import moment from 'moment';
import { Typography } from '@mui/material';

// Modal styling
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '0px solid #000',
    boxShadow: 5
};

export default function AddEducation(props) {
    // Axios cancel token setup
    const _axiosSource = axios.CancelToken.source();
    const _cancelToken = { cancelToken: _axiosSource.token };
    const history = useHistory();

    // State to hold form values and other UI states
    const [educationValues, setEducationValues] = useState({
        education: '',
        specification: '',
        institution: '',
        startyear: '',
        endyear: '',
        gpa: '',
        documents: ''
    });
    const [uploadFile, setUploadFile] = React.useState([]);
    const [specification, setSpecifications] = React.useState();
    const [fileNames, setFileNames] = useState('');
    const userId = localStorage.getItem('userId');
    const [errors, setErrors] = React.useState({});

    // Effect to initialize form values and handle edit mode
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            setEducationValues((prevValues) => ({
                ...prevValues,
                user_id: userId
            }));
        }

        if (props.educationDetails) {
            setEducationValues((prevValues) => ({
                ...prevValues,
                education: props.educationDetails.education || '',
                specification: props.educationDetails.specification || '',
                institution: props.educationDetails.institution || '',
                startyear: props.educationDetails.startyear || '',
                endyear: props.educationDetails.endyear || '',
                gpa: props.educationDetails.gpa || '',
                user_id: props.educationDetails.user_id || ''
            }));
            const educationObj = EducationData.find(
                (obj) => obj.name === props.educationDetails.education
            );
            if (educationObj) {
                setSpecifications(educationObj);
            }
        }
        if (props.method === 'edit' && props.educationDetails.documents) {
            const filenamesList = props.educationDetails.documents
                .map((doc) => doc.filename)
                .join(', ');
            setFileNames(filenamesList);
        }
    }, [props.educationDetails]);

    // Handle file input changes
    const handleDocumentChange = async (files) => {
        const validFiles = [];
        const fileNames = [];

        for (const file of files) {
            const fileName = file.name;
            const fileExtension = fileName.split('.').pop().toLowerCase();

            if (fileExtension !== 'pdf') {
                setErrors((prevState) => ({
                    ...prevState,
                    documents: 'Only PDF files are accepted. Please upload valid PDF documents.'
                }));
                return;
            }

            validFiles.push(file);
            fileNames.push(fileName);
        }

        // Batch the state updates together to avoid delays in reflecting changes
        setFileNames(fileNames.join(', '));
        setUploadFile(validFiles);

        // Clear any previous document-related errors
        setErrors((prevState) => ({ ...prevState, documents: '' }));
    };

    // Handle input changes
    const handleChange = async (event) => {
        if (event.target.name === 'education') {
            await setEducationValues((prevValues) => {
                return { ...prevValues, education: event.target.value };
            });
            let specificationObj;
            await EducationData.forEach((obj) => {
                if (obj.name === event.target.value) return (specificationObj = obj);
            });
            await setSpecifications(specificationObj);
        }

        if (event.target.name === 'gpa') {
            const gpaValue = parseFloat(event.target.value);
            if (isNaN(gpaValue) || !event.target.value.includes('.')) {
                handleError('GPA must be a valid float', 'gpa');
            } else {
                handleError('', 'gpa');
            }
        }

        await setEducationValues((prevValues) => {
            return { ...prevValues, [event.target.name]: event.target.value };
        });
    };

    // Validate form fields
    const validate = () => {
        let isValid = true;

        if (!educationValues.endyear) {
            handleError('Please input endyear', 'endyear');
            isValid = false;
        }
        if (!educationValues.education) {
            handleError('Please input education', 'education');
            isValid = false;
        }
        if (!educationValues.gpa) {
            handleError('Please input GPA', 'gpa');
            isValid = false;
        } else {
            let gpaValue;
            if (props.method === 'edit') {
                const gpaString = educationValues.gpa.toString();
                gpaValue = parseFloat(gpaString);

                if (isNaN(gpaValue) || !gpaString.includes('.')) {
                    handleError('GPA must be a valid float', 'gpa');
                    isValid = false;
                }
            } else {
                gpaValue = parseFloat(educationValues.gpa);
                if (isNaN(gpaValue) || !educationValues.gpa.includes('.')) {
                    handleError('GPA must be a valid float', 'gpa');
                    isValid = false;
                }
            }
        }

        if (!educationValues.institution) {
            handleError('Please input institution', 'institution');
            isValid = false;
        }
        if (!educationValues.specification) {
            handleError('Please input specification', 'specification');
            isValid = false;
        }
        if (props.method === 'add' && !uploadFile) {
            handleError('Please select a PDF document', 'documents');
            isValid = false;
        } else if (uploadFile) {
            const file = uploadFile[0];
            if (file) {
                const fileName = file.name;
                const fileExtension = fileName.split('.').pop().toLowerCase();

                if (fileExtension !== 'pdf') {
                    handleError(
                        'Only PDF files are accepted. Please upload a valid PDF document.',
                        'documents'
                    );
                    isValid = false;
                }
            }
        }

        if (!educationValues.startyear) {
            handleError('Please input startyear', 'startyear');
            isValid = false;
        }

        if (isValid) {
            setErrors({});
        }

        return isValid;
    };

    // Handle error messages for specific fields
    const handleError = (error, input) => {
        setErrors((prevState) => ({ ...prevState, [input]: error }));
    };

    // Submit form data based on method (add or edit)
    const handleSubmit = async () => {
        if (validate()) {
            if (props.method === 'add') {
                addEducation();
                ClearedValues();
            } else if (props.method === 'edit') {
                educationUpdate();
                ClearedValues();
            }
            setUploadFile(null);
        }
    };

    // Add new education record
    const addEducation = async () => {
        let queryObj = {
            education: educationValues.education,
            specification: educationValues.specification,
            institution: educationValues.institution,
            startyear: AppUtils.getDateFormat(educationValues.startyear),
            endyear: AppUtils.getDateFormat(educationValues.endyear),
            gpa: educationValues.gpa,
            documents: uploadFile,
            user_id: userId
        };

        let educationObj = uploadFile;

        createEducation(queryObj, educationObj, _cancelToken)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    handleClose();
                    props.handleClose();
                    props.reloadEducation(userId);
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            });
    };

    // Update existing education record
    const educationUpdate = async () => {
        let educationId = props.educationDetails?.id;
        if (educationId === undefined) {
            return;
        }

        let educationObj = {
            education: educationValues.education
                ? educationValues.education
                : props.educationDetails?.education,
            specification: educationValues.specification
                ? educationValues.specification
                : props.educationDetails?.specification,
            institution: educationValues.institution
                ? educationValues.institution
                : props.educationDetails?.institution,
            startyear: educationValues.startyear
                ? AppUtils.getDateFormat(educationValues.startyear)
                : props.educationDetails?.startyear,
            endyear: educationValues.endyear
                ? AppUtils.getDateFormat(educationValues.endyear)
                : props.educationDetails?.endyear,

            gpa: educationValues.gpa ? educationValues.gpa : props.educationDetails?.gpa,
            documents: uploadFile ? uploadFile : []
        };

        let fileStatus;
        if (uploadFile === undefined) {
            fileStatus = false;
        } else {
            fileStatus = true;
        }

        updateEducation(educationId, educationObj, fileStatus, _cancelToken)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    props.handleClose();
                    props.reloadEducation(userId);
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            });
    };

    // Clear form values
    const ClearedValues = () => {
        setEducationValues({
            education: '',
            specification: '',
            institution: '',
            startyear: '',
            endyear: '',
            gpa: '',
            documents: ''
        });
        setFileNames('');
    };

    // Handle modal close event
    const handleClose = () => {
        setErrors({});
        props.handleClose();
        ClearedValues();
    };

    let EducationData = [
        {
            name: 'SSC',
            specifications: ['State', 'CBSE', 'Other']
        },
        {
            name: 'Intermediate',
            specifications: ['State', 'CBSE', 'Other']
        },
        {
            name: 'B_Tech',
            specifications: ['CSE', 'ECE', 'MECH', 'IT', 'EEE', 'Civil', 'Other']
        },
        {
            name: 'M_Tech',
            specifications: ['CSE', 'IT', 'SE', 'CC']
        },
        {
            name: 'UG',
            specifications: ['Computers', 'Maths', 'Science', 'Arts', 'Commerce']
        },
        {
            name: 'PG',
            specifications: ['MCA', 'MSC']
        },
        {
            name: 'Phd',
            specifications: ['MCA', 'MSC']
        },
        {
            name: 'Others',
            specifications: ['others']
        }
    ];

    const educations = EducationData.map((education) => (
        <option key={education.name} value={education.name}>
            {education.name}
        </option>
    ));

    return (
        <Modal
            aria-labelledby='spring-modal-title'
            aria-describedby='spring-modal-description'
            open={props.open}
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
                    <CardHeader title={props.method === 'add' ? 'Add Education' : 'Edit Education'}>
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
                        <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            <Grid item xs={6}>
                                <Typography sx={{ marginLeft: '10px' }}>
                                    Education <span className='error'>*</span>
                                </Typography>
                                <select
                                    className='selecteducation'
                                    sx={{ minWidth: 270 }}
                                    id='education'
                                    name='education'
                                    label='Educational Category'
                                    onFocus={() => handleError(null, 'education')}
                                    error={errors.education}
                                    value={educationValues.education}
                                    helperText={errors.education}
                                    onChange={handleChange}
                                >
                                    <option value=''></option>
                                    {educations}
                                </select>
                                <br />
                                <Typography variant='caption' color='error'>
                                    {errors.education}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography sx={{ marginLeft: '10px' }}>Specification</Typography>
                                <select
                                    className='selecteducation'
                                    sx={{ minWidth: 270 }}
                                    id='specification'
                                    name='specification'
                                    label='specification'
                                    onFocus={() => handleError(null, 'specification')}
                                    error={errors.specification}
                                    value={educationValues.specification}
                                    helperText={errors.specification}
                                    onChange={handleChange}
                                >
                                    <option value=''></option>
                                    {specification?.specifications.map((obj, index) => (
                                        <option key={index} value={obj}>
                                            {obj}
                                        </option>
                                    ))}
                                </select>
                                <br />
                                <Typography variant='caption' color='error'>
                                    {errors.specification}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography sx={{ marginLeft: '10px' }}>
                                    Institution Name <span className='error'>*</span>
                                </Typography>
                                <TextField
                                    sx={{ minWidth: 270 }}
                                    id='institution'
                                    name='institution'
                                    type='text'
                                    onFocus={() => handleError(null, 'institution')}
                                    value={educationValues.institution}
                                    error={errors.institution}
                                    helperText={errors.institution}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography sx={{ marginLeft: '10px' }}>
                                    Start Year <span className='error'>*</span>
                                </Typography>
                                <TextField
                                    sx={{ minWidth: 270 }}
                                    id='startyear'
                                    name='startyear'
                                    type='date'
                                    onFocus={() => handleError(null, 'startyear')}
                                    error={errors.startyear}
                                    helperText={errors.startyear}
                                    style={{ texttransform: 'uppercase' }}
                                    defaultValue={
                                        props.method === 'edit' &&
                                        moment(props.educationDetails?.startyear).format(
                                            'YYYY-MM-DD'
                                        )
                                    }
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography sx={{ marginLeft: '10px' }}>
                                    End Year <span className='error'>*</span>
                                </Typography>
                                <TextField
                                    sx={{ minWidth: 270 }}
                                    id='endyear'
                                    name='endyear'
                                    type='date'
                                    onFocus={() => handleError(null, 'endyear')}
                                    error={errors.endyear}
                                    helperText={errors.endyear}
                                    style={{ texttransform: 'uppercase' }}
                                    defaultValue={
                                        props.method === 'edit' &&
                                        moment(props.educationDetails?.endyear).format('YYYY-MM-DD')
                                    }
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography sx={{ marginLeft: '10px' }}>
                                    GPA <span className='error'>*</span>
                                </Typography>
                                <TextField
                                    sx={{ minWidth: 270 }}
                                    id='gpa'
                                    name='gpa'
                                    error={errors.gpa}
                                    helperText={errors.gpa}
                                    value={educationValues.gpa}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
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
        </Modal>
    );
}
