import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
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
import Layout from './Layout';

export default function Forgot() {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const NewFormInputFields = () => {
        return {
            email: email
        };
    };
    const handleClick = (e) => {
        e.preventDefault();
        axios
            .post(`http://localhost:8080/v1/auth/forgot_password?email=${email}`)
            .then((res) => {
                if (res && res.status === 200) {
                    const Credentials = JSON.stringify([
                        {
                            username: email
                        }
                    ]);
                    localStorage.setItem('userDetails', Credentials);
                    history.push('/emailrequest');
                }
            })
            .catch((err) => {
                setError('email sent successfully');
                if (email === email) {
                    alert('email sent successfully');
                } else {
                    alert('incorrect email');
                }
            });
    };
    return (
        <Layout>
            <Container component='main' maxWidth='xs' style={{marginLeft: '861px', marginTop: '201px' }}>
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar> */}
                    <Typography component='h1' variant='h5' sx={{ color: '#0070ac' }}>
                        Please enter the valid E-mail address
                    </Typography>
                    <Box component='form' noValidate sx={{ mt: 1 }}>
                        <TextField
                            sx={{ width: 380 }}
                            margin='normal'
                            required
                            fullWidth
                            id='email'
                            label='Email Address'
                            name='email'
                            autoComplete='off'
                            values={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type='email'
                            autoFocus
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
                            //disabled={!email }
                            onClick={handleClick}
                        >
                            <Link
                                to='/forgotpasswordform'
                                variant='body2'
                                style={{ textdecoration: 'none', color: 'white' }}
                            >
                                submit
                            </Link>
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Button>
                                    <a href='/'> Back</a>
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
            {/* </ThemeProvider> */}
        </Layout>
    );
}
