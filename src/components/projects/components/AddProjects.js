import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { MenuItem, Select, FormControl } from '@mui/material';
import Grid from '@mui/material/Grid';
import moment from 'moment';
import Button from '@mui/material/Button';
import { createProjects, updateProjects } from '../actions/project-action';
import { manageError } from '../../core/actions/common-actions';
import { AppConfigProps } from '../../core/settings/app-config';
import AppBar from '@mui/material/AppBar';
import AppUtils from 'components/core/helpers/app-utils';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { getEmployees } from '../../allEmployees/actions/employee-actions';
import './Project.css';

// Modal styling
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

// Main component
export default function AddProjects(props) {
    const history = useHistory();
    const [errors, setErrors] = useState({});

    const [employeeNames, setEmployeeNames] = useState([]);

    const [fileNames, setFileNames] = useState('');
    const [uploadFile, setUploadFile] = React.useState([]);


    const [projectValues, setProjectValues] = useState({
        name: '',
        startDate: '',
        endDate: '',
        price: '',
        priority: '',
        currency: '',
        billingtype: '',
        status: '',
        teamtype: '',
        projectlead: '',
        documents: '',
        description: ''
    });

    // Load employee data for the project lead selection
    const loadPageData = async () => {
        try {
            const res = await getEmployees();

            if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data && res.data) {
                const managerEmployees = res.data.filter(
                    (employee) => !employee.disabled && employee.role === 'MANAGER'
                );

                // Assuming you want to update some state with filtered data
                setEmployeeNames(managerEmployees);
            } else {
                await manageError(res, history);
            }
        } catch (err) {
            await manageError(err, history);
        }
    };

    const getFileNameWithExtension = (filePath) => {
    // Extract the filename with extension from the filePath
    const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
    
    // Remove the hash and other unwanted parts, keeping only the base filename with extension
    const baseName = fileName.replace(/^[0-9a-fA-F-]+-/, ''); // Remove leading hash if present
    
    return baseName;
};

    // Initialize data when component mounts or projectDetails change
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            setProjectValues((prevValues) => ({
                ...prevValues,
                user_id: userId
            }));
            loadPageData();
        }

        if (props.projectDetails) {
             if (props.projectDetails.documents) {
                const filenamesList = props.projectDetails.documents
                    .map((doc) => doc.filename)
                    .join(', ');
                setFileNames(filenamesList);
            }

            setProjectValues((prevValues) => ({
                ...prevValues,
                name: props.projectDetails.name || '',
                projectId: props.projectDetails.projectId || '',
                startDate: props.projectDetails.startdate || '',
                endDate: props.projectDetails.enddate || '',
                price: props.projectDetails.price || '',
                priority: props.projectDetails.priority || '',
                currency: props.projectDetails.currency || '',
                billingtype: props.projectDetails.billingtype || '',
                teamtype: props.projectDetails.teamtype || '',
                projectlead: props.projectDetails.projectlead || '',
                description: props.projectDetails.description || '',
                status: props.projectDetails.status || ''
            }));
        }

         if (props.method === 'edit' && props.projectDetails?.documents) {
            
            const filenamesList = props.projectDetails.documents
                .map((doc) => doc.filename)
                .join(', ');
            setFileNames(filenamesList);
        }
    }, [props.projectDetails]);

    // Handle input changes
    const handleChange = async (event) => {
        if (event.target.name === 'uploadDocument') {
            // // Handle file input separately
            // await setProjectValues((prevValues) => {
            //     return { ...prevValues, [event.target.name]: event.target.files[0] };
            // });
            // setFileName(event.target.value);
            // setErrors((prevState) => ({ ...prevState, uploadDocument: '' }));
        } else {
            // Handle other input fields
            await setProjectValues((prevValues) => {
                return { ...prevValues, [event.target.name]: event.target.value };
            });
        }
    };

    // Validate form fields
    const validate = () => {
        let isValid = true;
        if (!projectValues.name) {
            handleError('Please enter name', 'name');
            isValid = false;
        }
        if (!projectValues.startDate) {
            handleError('Please enter startDate', 'startDate');
            isValid = false;
        }
        if (!projectValues.endDate) {
            handleError('Please enter endDate', 'endDate');
            isValid = false;
        }
        if (!projectValues.price) {
            handleError('Please enter price', 'price');
            isValid = false;
        }
        if (!projectValues.priority) {
            handleError('Please enter priority', 'priority');
            isValid = false;
        }
        if (!projectValues.currency) {
            handleError('Please enter currency', 'currency');
            isValid = false;
        }
        if (!projectValues.billingtype) {
            handleError('Please enter billingtype', 'billingtype');
            isValid = false;
        }
        if (!projectValues.teamtype) {
            handleError('Please enter teamtype', 'teamtype');
            isValid = false;
        }
        if (
            props.method === 'add' &&
            (!uploadFile || uploadFile.length === 0)
        ) {
            handleError('Please upload at least one doc or docx file', 'documents');
            isValid = false;
        } 
        if (!projectValues.description || projectValues.description.length < 5) {
            handleError('Description must be at least 5 characters', 'description');
            isValid = false;
        }
        if (!projectValues.status) {
            handleError('Please enter status', 'status');
            isValid = false;
        }
        if (!projectValues.projectlead) {
            handleError('Please enter projectlead', 'projectlead');
            isValid = false;
        }

        if (isValid) {
            setErrors({});
        }

        return isValid;
    };

    // Handle error messages
    const handleError = (error, input) => {
        setErrors((prevState) => ({ ...prevState, [input]: error }));
    };

    useEffect(() => {}, []);

    // Handle form submission
    const handleSubmit = async () => {
        if (validate()) {
            if (props.method === 'add') {
                addProject();
            } else if (props.method === 'edit') {
                projectUpdate();
            }

            setProjectValues({
                name: '',
                startDate: '',
                endDate: '',
                price: '',
                priority: '',
                currency: '',
                billingtype: '',
                status: '',
                teamtype: '',
                projectlead: '',
                uploadDocument: '',
                description: ''
            });
        }
    };

    const userId = localStorage.getItem('userId');

    const addProject = async () => {
        const formData = new FormData();
         uploadFile.forEach((file) => {
        formData.append('document', file, file.name);
    });
        formData.append('name', projectValues.name);
        formData.append('priority', projectValues.priority);
        formData.append('teamtype', projectValues.teamtype);
        formData.append('price', projectValues.price);
        formData.append('currency', projectValues.currency);
        formData.append('billingtype', projectValues.billingtype);
        formData.append('status', projectValues.status);
        formData.append('description', projectValues.description);
        formData.append('startdate', AppUtils.getDateFormat(projectValues.startDate));
        formData.append('enddate', AppUtils.getDateFormat(projectValues.endDate));
        formData.append('clientid', projectValues.clientid);
        formData.append('projectlead', projectValues.projectlead);

        try {
            const response = await createProjects(formData);
            if (response && response.status === AppConfigProps.httpStatusCode.ok && response.data) {
                props.handleClose();
                props.reloadProjects(userId);
            } else {
                await manageError(response, history);
            }
        } catch (error) {
            await manageError(error, history);
        }
    };

    // Update an existing project
    const projectUpdate = async () => {
        let projectId = props.projectDetails?.id;

        // Construct FormData object
        const formData = new FormData();
        formData.append(
            'name',
            projectValues.name ? projectValues.name : props.projectDetails?.name
        );
        formData.append(
            'startdate',
            projectValues.startDate
                ? AppUtils.getDateFormat(projectValues.startDate)
                : props.projectDetails?.startdate
        );
        formData.append(
            'enddate',
            projectValues.endDate
                ? AppUtils.getDateFormat(projectValues.endDate)
                : props.projectDetails?.enddate
        );

        formData.append(
            'price',
            projectValues.price ? projectValues.price : props.projectDetails?.price
        );
        formData.append(
            'priority',
            projectValues.priority ? projectValues.priority : props.projectDetails?.priority
        );
        formData.append(
            'projectlead',
            projectValues.projectlead
                ? projectValues.projectlead
                : props.projectDetails?.projectlead
        );

        formData.append(
            'addteam',
            projectValues.addteam ? projectValues.addteam : props.projectDetails?.addteam
        );
        formData.append(
            'currency',
            projectValues.currency ? projectValues.currency : props.projectDetails?.currency
        );
        formData.append(
            'billingtype',
            projectValues.billingtype
                ? projectValues.billingtype
                : props.projectDetails?.billingtype
        );
        formData.append(
            'status',
            projectValues.status ? projectValues.status : props.projectDetails?.status
        );
        formData.append(
            'teamtype',
            projectValues.teamtype ? projectValues.teamtype : props.projectDetails?.teamtype
        );
        if (uploadFile && uploadFile.length > 0) {
            for (let i = 0; i < uploadFile.length; i++) {
                formData.append('document', uploadFile[i]);
            }
        } else {
            formData.append('document', ''); // Handle the case where no file is uploaded
        }
        formData.append(
            'description',
            projectValues.description
                ? projectValues.description
                : props.projectDetails?.description || ''
        );
     

        updateProjects(projectId, formData)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    props.handleClose();
                    if (props.reloadProjects) {
                        props.reloadProjects(userId);
                    }
                } else {
                    await manageError(res, history);
                }
            })
            .catch(async (err) => {
                await manageError(err, history);
            });
    };

    // Close modal and reset state
    const handleClose = () => {
        setErrors({});
        props.handleClose();
        setProjectValues({
            name: '',
            startDate: '',
            endDate: '',
            price: '',
            priority: '',
            currency: '',
            billingtype: '',
            status: '',
            teamtype: '',
            projectlead: '',
            uploadDocument: '',
            description: ''
        });
    };

    // Options for select fields
    const teamtype = ['Analyticals', 'Development', 'Leads', 'Project_managers', 'Quality_testing'];

    const billingtype = ['Daily', 'Hourly', 'Monthly', 'Weekly'];

    const priority = ['High', 'Low', 'Medium'];

    const status = [
        'Active',
        'Approved',
        'Cancled',
        'Closed',
        'Delivered',
        'Hold',
        'Initiated',
        'Pending',
        'failure',
        'success'
    ];

    const currency = ['Dollar', 'INR'];

     // Handle file input changes
    const handleDocumentChange = async (files) => {
        const validFiles = [];
        const fileNames = [];
    
        for (const file of files) {
            const fileName = file.name;
    
            validFiles.push(file);
            fileNames.push(fileName);
        }
    
        // Batch the state updates together to avoid delays in reflecting changes
        setFileNames(fileNames.join(', '));
        setUploadFile(validFiles);
    
        // Clear any previous document-related errors
        setErrors((prevState) => ({ ...prevState, documents: '' }));
    };
    
    

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
                    <CardHeader title={props.method === 'add' ? 'Add Project' : 'Edit Project'}>
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
                <Card sx={{ minWidth: 500, boxShadow: 0, height: 400, overflow: 'auto' }}>
                    <CardContent>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            <Grid item xs={6}>
                                <Typography>
                                    Project Name<span className='error'>*</span>
                                </Typography>

                                <TextField
                                    sx={{ minWidth: 320 }}
                                    required
                                    id='name'
                                    name='name'
                                    onFocus={() => handleError(null, 'name')}
                                    error={errors.name}
                                    helperText={errors.name}
                                    value={projectValues.name}
                                    defaultValue={props.projectDetails?.name}
                                    onChange={handleChange}
                                />
                            </Grid>

                            {/* {props.method === 'add' ? ( */}
                            <Grid item xs={6}>
                                <Typography>
                                    Start Date<span className='error'>*</span>
                                </Typography>
                                <TextField
                                    sx={{ minWidth: 320 }}
                                    required
                                    id='startdate'
                                    name='startDate'
                                    type='date'
                                    error={errors.startDate}
                                    style={{ texttransform: 'uppercase' }}
                                    onFocus={() => handleError(null, 'startDate')}
                                    defaultValue={
                                        props.method === 'edit' &&
                                        moment(props.projectDetails?.startdate).format('YYYY-MM-DD')
                                    }
                                    helperText={errors.startDate}
                                    onChange={handleChange}
                                />
                            </Grid>
                            {/* ) : null} */}
                            <Grid item xs={6}>
                                <Typography>
                                    End Date<span className='error'>*</span>
                                </Typography>
                                <TextField
                                    sx={{ minWidth: 320 }}
                                    required
                                    id='enddate'
                                    name='endDate'
                                    type='date'
                                    error={errors.endDate}
                                    style={{ texttransform: 'uppercase' }}
                                    onFocus={() => handleError(null, 'endDate')}
                                    defaultValue={
                                        props.method === 'edit' &&
                                        moment(props.projectDetails?.enddate).format('YYYY-MM-DD')
                                    }
                                    helperText={errors.endDate}
                                    onChange={handleChange}
                                    InputProps={{ readOnly: !!props.projectDetails?.endDate }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>
                                    Price<span className='error'>*</span>
                                </Typography>
                                <TextField
                                    sx={{ minWidth: 320 }}
                                    required
                                    id='price'
                                    name='price'
                                    error={errors.price}
                                    style={{ texttransform: 'uppercase' }}
                                    value={projectValues.price}
                                    onFocus={() => handleError(null, 'price')}
                                    helperText={errors.price}
                                    defaultValue={props.projectDetails?.price}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                {' '}
                                <Typography>
                                    Currency<span className='error'>*</span>
                                </Typography>
                                <FormControl sx={{ minWidth: 320 }} required>
                                    <Select
                                        label='currency'
                                        id='currency'
                                        name='currency'
                                        error={errors.currency}
                                        value={projectValues.currency}
                                        onFocus={() => handleError(null, 'currency')}
                                        defaultValue={props.projectDetails?.currency}
                                        helperText={errors.currency}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value='' />
                                        {currency.map((type) => (
                                            <MenuItem key={type} value={type}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </Select>

                                    <Typography variant='caption' color='error'>
                                        {errors.currency}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                {' '}
                                <Typography>
                                    Priority<span className='error'>*</span>
                                </Typography>
                                <FormControl sx={{ minWidth: 320 }} required>
                                    <Select
                                        id='priority'
                                        name='priority'
                                        label='Priority'
                                        error={!!errors.priority}
                                        onFocus={() => handleError(null, 'priority')}
                                        defaultValue={props.projectDetails?.priority}
                                        helperText={errors.priority}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value='' />

                                        {priority.map((type) => (
                                            <MenuItem key={type} value={type}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </Select>

                                    <Typography variant='caption' color='error'>
                                        {errors.priority}
                                    </Typography>
                                </FormControl>
                            </Grid>

                            <Grid item xs={6}>
                                <Typography>
                                    Project Lead<span className='error'>*</span>
                                </Typography>

                                <TextField
                                    sx={{ minWidth: 320 }}
                                    required
                                    id='projectlead'
                                    name='projectlead'
                                    select
                                    onFocus={() => handleError(null, 'projectlead')}
                                    error={errors.projectlead}
                                    helperText={errors.projectlead}
                                    value={projectValues.projectlead || ''}
                                    defaultValue={props.projectDetails?.projectlead || ''}
                                    onChange={handleChange}
                                    SelectProps={{ native: true }}
                                >
                                    <option value='' />
                                    {employeeNames.map((employee) => (
                                        <option key={employee.id} value={employee.fullname}>
                                            {employee.fullname}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={6}>
                                {' '}
                                <Typography>
                                    Billing Type<span className='error'>*</span>
                                </Typography>
                                <FormControl sx={{ minWidth: 320 }} required>
                                    <Select
                                        label='billingtype'
                                        id='billingtype'
                                        name='billingtype'
                                        error={errors.billingtype}
                                        value={projectValues.billingtype}
                                        helperText={errors.billingtype}
                                        onFocus={() => handleError(null, 'billingtype')}
                                        defaultValue={props.projectDetails?.billingtype}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value='' />
                                        {billingtype.map((type) => (
                                            <MenuItem key={type} value={type}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </Select>

                                    <Typography variant='caption' color='error'>
                                        {errors.billingtype}
                                    </Typography>
                                </FormControl>
                            </Grid>

                            <Grid item xs={6}>
                                {' '}
                                <Typography>
                                    Project Type<span className='error'>*</span>
                                </Typography>
                                <FormControl sx={{ minWidth: 320 }} required>
                                    <Select
                                        id='teamtype'
                                        name='teamtype'
                                        type='text'
                                        error={errors.teamtype}
                                        value={projectValues.teamtype}
                                        onFocus={() => handleError(null, 'teamtype')}
                                        helperText={errors.teamtype}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value='' />
                                        {teamtype.map((type) => (
                                            <MenuItem key={type} value={type}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </Select>

                                    <Typography variant='caption' color='error'>
                                        {errors.teamtype}
                                    </Typography>
                                </FormControl>
                            </Grid>

                            <Grid item xs={6}>
                                {' '}
                                <Typography>
                                    Status<span className='error'>*</span>
                                </Typography>
                                <FormControl sx={{ minWidth: 320 }} required>
                                    <Select
                                        id='status'
                                        name='status'
                                        label='Status'
                                        error={errors.status}
                                        value={projectValues.status}
                                        onFocus={() => handleError(null, 'status')}
                                        helperText={errors.status}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value='' />
                                        {status.map((type) => (
                                            <MenuItem key={type} value={type}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <Typography variant='caption' color='error'>
                                        {errors.status}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>
                                    Description<span className='error'>*</span>
                                </Typography>
                                <TextField
                                    sx={{ minWidth: 320 }} // Increase the width
                                    multiline
                                    rows={4} // Increase the height by specifying number of rows
                                    required
                                    id='description'
                                    name='description'
                                    error={errors.description}
                                    onFocus={() => handleError(null, 'description')}
                                    helperText={errors.description}
                                    value={projectValues.description}
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
                        backgroundColor: '#d3f0ff', // Light color
                        color: '#0070ac', // Text color
                        border: '1px solid #0070ac',
                        '&:hover': {
                            backgroundColor: '#0070ac', // Hover color
                            color: '#fff' // Text color on hover
                        }
                    }}
                    variant='contained'
                    onClick={handleClose} // Call handleCloseModal function
                >
                    Cancel
                </Button>
            </Box>
            {/* </Fade> */}
        </Modal>
    );
}
