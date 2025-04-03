import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { manageError } from '../../core/actions/common-actions';
import { AppConfigProps } from '../../core/settings/app-config';
import axios from 'axios';
import ImageUpload from './ImageUpload';
import Autocomplete from '@mui/material/Autocomplete';
import { getCountries, getStates } from 'components/allEmployees/actions/employee-actions';
import { AppDataProps } from '../../core/settings/app-data';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { getProjects } from '../../projects/actions/project-action';

// Styled components for table cells and rows
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.common.black
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14
    }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(even)': {
        backgroundColor: theme.palette.action.hover
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0
    }
}));

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
};

export default function CustomizedTables(props) {
    // Axios cancel token setup
    const _axiosSource = axios.CancelToken.source();
    const _cancelToken = { cancelToken: _axiosSource.token };
    const history = useHistory();

    // State variables
    const [selectedValues, setSelectedValues] = useState([]);
    const [imageurl, setImageurl] = useState('');
    const userData = localStorage.getItem('EmployeeApp');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [company, setCompany] = useState('');
    const [projects, setProjects] = useState('');
    const [username, setUsername] = useState('');
    const [stateOptions, setStateOptions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredStates, setFilteredStates] = useState([]);
    const [values, setValues] = useState({
        username: '',
        phone: '',
        email: '',
        country: '',
        state: '',
        city: '',
        address: '',
        zipcode: '',
        company: 'Ensar Solutions',
        projects: ''
    });

    // Snackbar handlers
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleSnackbarOpen = () => {
        setSnackbarOpen(true);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        const filteredStates = stateOptions.filter((state) =>
            state.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredStates(filteredStates);
    };

    // Fetch user data on component mount
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        axios
            .get(AppConfigProps.serverRoutePrefix + `/api/v1/user/${userId}`, _cancelToken)
            .then((res) => {
                console.log(res);
                if (res && res.status === 200) {
                    const Credentials = JSON.stringify([
                        {
                            username: res.data.username || '',
                            email: res.data?.email || '',
                            phone: res.data?.phone || '',
                            country: res.data?.country || '',
                            state: res.data?.state || '',
                            city: res.data?.city || '',
                            address: res.data?.address || '',
                            zipcode: res.data?.zipcode || '',
                            company: res.data?.company || '',
                            projects: res.data?.projects || ''
                        }
                    ]);
                    localStorage.setItem('userDetails', Credentials);
                    setValues((prevValues) => ({
                        ...prevValues,
                        username: res.data?.username || '',
                        email: res.data?.email || '',
                        phone: res.data?.phone || '',
                        country: res.data?.country || '',
                        state: res.data?.state || '',
                        city: res.data?.city || '',
                        address: res.data?.address || '',
                        zipcode: res.data?.zipcode || '',
                        company: res.data?.company || 'Ensar Solutions',
                        projects: res.data?.projects || ''
                    }));
                }
            });
    }, []);

    // Handler for changes in form fields
    const handleChange = async (e) => {
        const { name, value: inputValue } = e.target;
        let errorMessage = '';

        // Validation for Country field
        if (name === 'country') {
            if (!inputValue.trim()) {
                errorMessage = 'Please select a country';
            }
            setErrors((prevErrors) => ({
                ...prevErrors,
                country: errorMessage
            }));
        }

        if (name === 'state') {
            if (!inputValue.trim()) {
                errorMessage = 'Please select a state';
            }
            setErrors((prevErrors) => ({
                ...prevErrors,
                state: errorMessage
            }));
        }

        if (name === 'country') {
            setErrors({ ...errors, country: '' });
        } else if (name === 'state') {
            setErrors({ ...errors, state: '' });
        } else if (name === 'projects') {
            setErrors({ ...errors, projects: '' });
        }

        // For other fields excluding Projects, Country, and State
        if (name !== 'Projects' && name !== 'country' && name !== 'state') {
            if (!inputValue.trim()) {
                errorMessage = `Please select ${name}`;
            }
            // Update errors state
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: errorMessage
            }));
        }

        if (e.target.name === 'Projects') {
            const selectedProjects = e.target.value || [];
            const projectsString = selectedProjects.join(', ');
            await setValues((prevValues) => {
                return { ...prevValues, projects: projectsString };
            });
            setErrors({ ...errors, projects: '' });
        } else {
            await setValues((prevValues) => {
                return { ...prevValues, [e.target.name]: e.target.value };
            });
        }
    };

    const handleSubmit = async () => {
        const userId = localStorage.getItem('userId');
        console.log(userId);

        const formData = new FormData();

        formData.append('country', values.country);
        formData.append('state', values.state);
        formData.append('city', values.city);
        formData.append('address', values.address);
        formData.append('zipcode', values.zipcode);
        formData.append('company', values.company);
        formData.append('projects', values.projects);
        formData.append('id', userId);

        try {
            await axios.put(
                AppConfigProps.serverRoutePrefix + `/api/v1/user/employee/${userId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setSelectedValues([]);
            setValues({
                country: '',
                state: '',
                city: '',
                address: '',
                zipcode: '',
                company: 'Ensar Solutions',
                projects: ''
            });
            setValues((prevValues) => ({ ...prevValues, projects: '' }));
            await handleSnackbarOpen();
            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const [errors, setErrors] = useState({});
    const validate = () => {
        let isValid = true;
        const newErrors = {};

        if (!values.country) {
            newErrors.country = 'Please select country';
            isValid = false;
        }
        if (!values.state) {
            newErrors.state = 'Please select state';
            isValid = false;
        }
        if (!values.city) {
            newErrors.city = 'Please enter city';
            isValid = false;
        }
        if (!values.address) {
            newErrors.address = 'Please enter address';
            isValid = false;
        }
        if (!values.zipcode) {
            newErrors.zipcode = 'Please enter Zipcode';
            isValid = false;
        }
        if (!values.projects) {
            newErrors.projects = 'Please select projects';
            isValid = false;
        }

        setErrors(newErrors);

        // If there are no errors, submit the form
        if (Object.keys(newErrors).length === 0) {
            handleSubmit();
        }
    };

    const [projectNames, setProjectNames] = useState([]);

    // Fetch project names
    const loadPageDataProjectNames = async () => {
        await getProjects(_cancelToken)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    const projectsNames = res.data.map((project) => project.name);
                    setProjectNames(projectsNames);
                } else {
                    await manageError(res, props.history);
                }
            })
            .catch(async (err) => {
                await manageError(err, props.history);
            });
    };

    const [countryNames, setCountryNames] = useState([]);
    const [countryListData, setCountryListData] = useState([]);

    // Fetch country names
    const loadPageDataCountryNames = async () => {
        await getCountries(_cancelToken)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    const countryData = res.data.map((country) => country.name);
                    setCountryNames(countryData);
                    setCountryListData(res.data);
                } else {
                    await manageError(res, props.history);
                }
            })
            .catch(async (err) => {
                await manageError(err, props.history);
            });
    };

    const [stateNames, setStateNames] = useState([]);
    const [countryId, setCountryId] = useState();

    // Fetch states based on the selected country
    const loadPageDataStateNames = async (selectedCountryId) => {
        await getStates(_cancelToken)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    const filteredStates = res.data.filter(
                        (state) => state.country_id === selectedCountryId
                    );
                    const StateData = filteredStates.map((state) => state.name);
                    setStateNames(StateData);
                } else {
                    await manageError(res, props.history);
                }
            })
            .catch(async (err) => {
                await manageError(err, props.history);
            });
    };

    // Load data on component mount
    useEffect(() => {
        if (values.country) {
            loadPageDataStateNames(countryId);
        }
    }, [values.country]);

    // Fetch projects and countries data on component mount
    useEffect(() => {
        loadPageDataProjectNames();
        loadPageDataCountryNames();
    }, []);

    return (
        <div style={{ marginTop: '0px' }}>
            <Card
                sx={{
                    width: '250px',
                    height: '425px',
                    marginRight: '20px',
                    display: 'inline-block'
                }}
            >
                <CardContent style={{ textAlign: 'center' }}>
                    <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
                        <div style={{ padding: '10px 0px 0px 0px' }}>
                            <ImageUpload />
                        </div>
                    </Typography>
                    <br />
                </CardContent>
            </Card>
            <Card
                sx={{
                    width: '700px',
                    height: '425px',
                    display: 'inline-block'
                }}
            >
                <CardContent style={{ paddingTop: '65px', paddingLeft: '25px' }}>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
                        <Grid item xs={6}>
                            <TextField
                                id='fullName'
                                name='fullName'
                                label='Full Name'
                                error={!!errors.fullName}
                                helperText={errors.fullName}
                                style={{ width: '300px', margin: '2px 5px 2px 10px' }}
                                disabled
                                value={values.username}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <TextField
                                id='email'
                                name='emailaddress'
                                label='Email Address'
                                style={{ width: '300px', margin: '10px 10px 2px 5px' }}
                                disabled
                                value={values.email}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id='phone'
                                name='phonenumber'
                                label='Phone Number'
                                type='phonenumber'
                                style={{ width: '300px', margin: '2px 5px 2px 10px' }}
                                disabled
                                value={values.phone}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <TextField
                                id='country'
                                name='country'
                                label='Country'
                                error={!!errors.country}
                                helperText={errors.country}
                                style={{ width: '300px', margin: '10px 10px 2px 5px' }}
                                disabled
                                value={values.country}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id='state'
                                name='state'
                                label='State/Region'
                                error={!!errors.state}
                                helperText={errors.state}
                                style={{ width: '300px', margin: '2px 5px 2px 10px' }}
                                disabled
                                value={values.state}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={5}>
                            {' '}
                            <TextField
                                id='city'
                                name='city'
                                label='City'
                                error={!!errors.city}
                                helperText={errors.city}
                                style={{ width: '300px', margin: '2px 10px 2px 5px' }}
                                disabled
                                value={values.city}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            {' '}
                            <TextField
                                id='address'
                                name='address'
                                label='Address'
                                error={!!errors.address}
                                helperText={errors.address}
                                style={{ width: '300px', margin: '2px 5px 2px 10px' }}
                                disabled
                                value={values.address}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={5}>
                            {' '}
                            <TextField
                                id='zipcode'
                                name='zipcode'
                                label='ZIP code'
                                error={!!errors.zipcode}
                                helperText={errors.zipcode}
                                style={{ width: '300px', margin: '2px 10px 2px 5px' }}
                                disabled
                                value={values.zipcode}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>

                    <Snackbar
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        open={snackbarOpen}
                        autoHideDuration={3000}
                        onClose={handleSnackbarClose}
                    >
                        <MuiAlert
                            elevation={6}
                            variant='filled'
                            onClose={handleSnackbarClose}
                            severity='success'
                        >
                            Save Changes Successfully
                        </MuiAlert>
                    </Snackbar>
                </CardContent>
            </Card>
        </div>
    );
}
