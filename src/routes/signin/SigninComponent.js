import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import { AppConfigProps } from '../../components/core/settings/app-config';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AppUtils from 'components/core/helpers/app-utils';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';
import { Icon } from 'react-icons-kit';
import Layout from './Layout'; // Assuming your layout component is imported
import * as Yup from 'yup';
export default function SigninComponent() {

    // State Variables
    const history = useHistory();
    const [type, setType] = useState('password');
    const [icon, setIcon] = useState(eyeOff);
    const _axiosSource = axios.CancelToken.source();
    const _cancelToken = { cancelToken: _axiosSource.token };
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [text, setText] = useState();

    const initLoginFormInputFields = () => {
        return { loginId: loginId, password: password };
    };
    const initialValues = initLoginFormInputFields();

    const loginFormValidationSchema = () => {
        const schema = {
            loginId: Yup.string().trim().required('Email Id is required'),
            password: Yup.string().required('Password is required')
        };
        return schema;
    };

    // Toggle password visibility
    const handleToggle = () => {
        if (type === 'password') {
            setIcon(eye);
            setType('text');
        } else {
            setIcon(eyeOff);
            setType('password');
        }
    };

    // Handle form submission
    const handleClick = (e) => {
        e.preventDefault();
        let loginOBJ = {
            email: loginId,
            password: password
        };
        axios
            .post(AppConfigProps.serverRoutePrefix + 'v1/auth/login', loginOBJ, _cancelToken)
            .then(async (res) => {
                if (res && res.status === AppConfigProps.httpStatusCode.ok && res.data) {
                    await redirectToAppHome(res);
                }
            })
            .catch((err) => {
                if (err.response && err.response.status === 401) {
                    if (err.response.data === ' Invalid credentials.') {
                        setError('Invalid credentials. Please try again.');
                    } else if (err.response.data === 'User is disabled.') {
                        setError(`Your account has been deactivated. Please Contact HR.`);
                    } else {
                        setError(`Your account is not registered.`);
                    }
                }
            });
    };

    // Redirect user based on role
    const redirectToAppHome = (res) => {
        AppUtils.setIdentityToken(
            res.data?.accessToken,
            res.data?.accessToken,
            res.data?.accessToken
        );
        const Credentials = JSON.stringify([{ username: res.data?.fullname, id: res.data?.id }]);
        localStorage.setItem('EmployeeApp', Credentials);
        localStorage.setItem('userData', JSON.stringify(res.data));
        localStorage.setItem('userId', res.data?.id);
        localStorage.setItem('SessionStatus', 'userLoggedIn');
        // Check user role and redirect accordingly
        if (
            res.data?.role === 'EMPLOYEE' ||
            res.data?.role === 'MANAGER' ||
            localStorage.getItem('userData').role === 'EMPLOYEE' ||
            localStorage.getItem('userData').role === 'MANAGER'
        ) {
            history.push({ pathname: '/myprofile', state: { response: 'newroute' } });
        } else {
            history.push('/dashboard');
        }
    };

    const handleRegisterEmployee = () => {
        history.push('/public/employee-add');
    };

    return (
        <Layout>
            <Container
                component='main'
                maxWidth='xs'
                style={{ marginLeft: '830px', marginTop: '110px' }}
            >
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component='h1' variant='h5' sx={{ color: '#0070ac' }}>
                        Login In to Your Account
                    </Typography>
                    <Box component='form' noValidate sx={{ mt: 1 }}>
                        {error && (
                            <Typography
                                variant='body2'
                                color='error'
                                align='left'
                                fontSize='19px'
                                gutterBottom
                            >
                                {error}
                            </Typography>
                        )}
                        <TextField
                            margin='normal'
                            required
                            fullWidth
                            id='loginId'
                            label='Email Address'
                            name='loginId'
                            autoComplete='off'
                            values={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
                            type='email'
                            autoFocus
                            error={text === ''}
                            helperText={text === '' ? 'Empty!' : ' '}
                        />

                        <TextField
                            margin='normal'
                            required
                            fullWidth
                            type={type}
                            values={password}
                            name='password'
                            label='Password'
                            onChange={(e) => setPassword(e.target.value)}
                            id='password'
                            autoComplete='current-password'
                        />
                        <span className='icon' onClick={handleToggle}>
                            <Icon icon={icon} size={20} />
                        </span>
                        <FormControlLabel
                            control={<Checkbox value='remember' color='primary' />}
                            label='Remember me'
                        />
                        <Button
                            type='submit'
                            fullWidth
                            variant='contained'
                            sx={{
                                mt: 3,
                                mb: 2,
                                backgroundColor: '#0070ac',
                                borderRadius: '40px',
                                height: '50px'
                            }}
                            disabled={!loginId || !password}
                            onClick={handleClick}
                        >
                            Login
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href='/forgotpassword' variant='body2'>
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href='/resetPassword' variant='body2'>
                                    {'Reset Password'}
                                </Link>
                            </Grid>
                            <Grid item xs={12} sx={{ textAlign: 'center' }}>
                                <Button
                                    fulWidth
                                    variant='outlined'
                                    sx={{
                                        mt: 3,
                                        mb: 2,
                                        backgroundColor: 'transparent',
                                        borderRadius: '40px',
                                        height: '37px',
                                        color: '#0070ac',
                                        borderColor: '#0070ac',
                                        '&:hover': {
                                            backgroundColor: '#0070ac',
                                            color: '#ffffff'
                                        }
                                    }}
                                    onClick={handleRegisterEmployee}
                                >
                                    Register as Employee
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </Layout>
    );
}
