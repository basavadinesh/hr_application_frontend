import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';
import { Icon } from 'react-icons-kit';
import axios from 'axios';
import './App.css';

import * as Yup from 'yup';
//import { useHistory } from 'react-router-dom';
import Layout from './Layout';

export default function ForgotPasswordForm() {
    const history = useHistory();
    const location = useLocation();
    const [type, setType] = useState('password');
    const [icon, setIcon] = useState(eyeOff);
    const [confirmationType, setConfirmationType] = useState('password');
    const [confirmationIcon, setConfirmationIcon] = useState(eyeOff);
    const [pass, setPass] = useState('confirmPassword');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [token, setToken] = useState('');

    useEffect(() => {
        let token = new URLSearchParams(location.search).get('token');
        setToken(token);
    });

    const ForgotFormInputFields = () => {
        return {
            token: token,
            password: password,
            confirmPassword: confirmPassword
        };
    };

    const initialValues = ForgotFormInputFields();
    const ForgotFormValidationSchema = () => {
        const schema = {
            token: Yup.string().trim().required('Token is required'),
            // oldPassword: Yup.string().required('Enter old password'),
            password: Yup.string()
                .required('Please Enter your password')
                .matches(
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                    'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character'
                ),

            confirmPassword: Yup.string()
                .required()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
        };
        return schema;
    };
    const handleToggle = () => {
        if (type === 'password') {
            setIcon(eye);
            setType('text');
            setPass('text');
        } else {
            setIcon(eyeOff);
            setType('password');
            setPass('confirmPassword');  
        }
    };
    const handleToggleConfirmPassword = () => {
      if (pass === 'confirmPassword') {
          setConfirmationIcon(eye);
          setConfirmationType('text');
          setPass('text');
      } else {
          setConfirmationIcon(eyeOff);
          setConfirmationType('password');
          setPass('confirmPassword');
      }
  };
    const handleClick = (e) => {
        e.preventDefault();

        axios
            .post(
                `http://localhost:8080/v1/auth/reset_password?token=${token}&password=${password}`
            )
            .then((res) => {
                if (res && res.status === 200) {
                    const Credentials = JSON.stringify([
                        {
                            token: token,
                            password: password,
                            confirmPassword: confirmPassword
                        }
                    ]);
                    localStorage.setItem('userDetails', Credentials);
                    history.push({ pathname: '/signin', state: { response: 'newroute' } });
                }
            })
            .catch((err) => {
                setError('password and confirmPassword should be same');
                if (password !== confirmPassword) {
                    alert('password and confirm possword is not matching');
                } else {
                    alert('submitted succesfully');
                }
            });
    };
    return (
        
        <Layout>
            <Container component='main' maxWidth='xs' style={{ marginLeft: '830px',marginTop:'110px' }}>
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
                        Please enter required passwords
                    </Typography>

                    <Box component='form' noValidate sx={{ mt: 1 }}>
                        <TextField
                            sx={{ marginTop: '10px' }}
                            margin='normal'
                            required
                            fullWidth
                            id='token'
                            label='Token'
                            name='Token'
                            //autoComplete='on'
                            values={token}
                            disabled={true}
                            onChange={(e) => {
                    setToken(e.target.value)}}
                            type='text'
                            autoFocus
                        />
                        <TextField
                            sx={{ marginTop: '25px' }}
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
                        <TextField
                            sx={{ marginTop: '5px' }}
                            margin='normal'
                            required
                            fullWidth
                            type={confirmationType}
                            values={confirmPassword}
                            name='confirmPassword'
                            label='ConfirmPassword'
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            id='password'
                            autoComplete='current-password'
                        />
                        <span className='icon' onClick={handleToggleConfirmPassword}>
                            <Icon icon={confirmationIcon} size={20} />
                        </span>

                        <Button
                            type='submit'
                            fullWidth
                            variant='contained'
                            sx={{
                                marginTop: '5px',
                                mb: 2,
                                backgroundColor: '#0070ac',
                                borderRadius: '40px',
                                height: '50px'
                            }}
                            //disabled={ !password ||  !confirmPassword}
                            onClick={handleClick}
                        >
                            <Link
                                href='/signin'
                                variant='body2'
                                style={{ textdecoration: 'none', color: 'white' }}
                            >
                                submit
                            </Link>
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                {/* <Link to='/' variant='body2'>
                                    Back
                                </Link> */}
                                <Button>
                                    <a href='/'> Back</a>
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
            
        </Layout>
    );
}
