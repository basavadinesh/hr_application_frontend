// import React, { useState } from 'react';
// import { useHistory } from 'react-router-dom';
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import CssBaseline from '@mui/material/CssBaseline';
// import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
// import Grid from '@mui/material/Grid';
// import Box from '@mui/material/Box';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import Typography from '@mui/material/Typography';
// import Container from '@mui/material/Container';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { eyeOff } from 'react-icons-kit/feather/eyeOff';
// import { eye } from 'react-icons-kit/feather/eye';
// import { Icon } from 'react-icons-kit';
// import axios from 'axios';
// import './App.css';

// import * as Yup from 'yup';
// //import { useHistory } from 'react-router-dom';
// import Layout from './Layout';
// export default function Reset() {
//     const history = useHistory();
//     const [type, setType] = useState('password');
//     const [confirmationType, setConfirmationType] = useState('password');
//     const [confirmationIcon, setConfirmationIcon] = useState(eyeOff);
//     const [pass, setPass] = useState('confirmPassword');
//     const [newPasswordType, setNewPasswordType] = useState('password');
//     const [newIcon, setNewIcon] = useState(eyeOff);
//     const [newPass, setNewPass] = useState('newPassword');

//     const [icon, setIcon] = useState(eyeOff);
//     const [loginId, setLoginId] = useState('');
//     const [oldPassword, setOldPassword] = useState('');
//     const [newPassword, setNewPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [error, setError] = useState(null);
//     const ReSetFormInputFields = () => {
//         return {
//             loginId: loginId,
//             oldPassword: oldPassword,
//             newPassword: newPassword,
//             confirmPassword: confirmPassword
//         };
//     };
//     const initialValues = ReSetFormInputFields();
//     const ReSetFormValidationSchema = () => {
//         const schema = {
//             loginId: Yup.string().trim().required('Email Id is required'),
//             oldPassword: Yup.string().required('Enter old password'),
//             newPassword: Yup.string()
//                 .required('Please Enter your password')
//                 .matches(
//                     /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
//                     'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character'
//                 ),

//             confirmPassword: Yup.string()
//                 .required()
//                 .oneOf([Yup.ref('newpassword'), null], 'Passwords must match')
//         };
//         return schema;
//     };

//     const handleToggle = () => {
//         if (type === 'password') {
//             setIcon(eye);
//             setType('text');
//             setPass('text');
//         } else {
//             setIcon(eyeOff);
//             setType('password');
//             setPass('confirmPassword');
//         }
//     };
    
//     const handleToggleNewPassword = () => {
//         if (newPass === 'newPassword') {
//             setNewIcon (eye);
//             setNewPasswordType('text');
//            setNewPass('text');
//         } else {
//             setNewIcon(eyeOff);
//             setNewPasswordType ('password');
//             setNewPass('newPassword');
//         }
//     };
//     const handleToggleConfirmPassword = () => {
//         if (pass === 'confirmPassword') {
//             setConfirmationIcon(eye);
//             setConfirmationType('text');
//             setPass('text');
//         } else {
//             setConfirmationIcon(eyeOff);
//             setConfirmationType('password');
//            setPass('confirmPassword');
//         }
//     };
//     // const handleToggle = () => {
//     //     if (pass === 'confirmPassword') {
//     //         setIcon(eye);
//     //     setPass('text');
//     //     } else {
//     //         setIcon(eyeOff);
//     //         setPass('confirmPassword');
//     //     }
//     // };

//     const handleClick = (e) => {
//         e.preventDefault();
//         axios
//             .post(
//                 `http://localhost:8080/v1/auth/change_password?email=${loginId}&oldpassword=${oldPassword}&newpassword=${newPassword}`
//             )
//             .then((res) => {
//                 if (res && res.status === 200) {
//                     const Credentials = JSON.stringify([
//                         {
//                             username: res.data?.loginId,
//                             oldPassword: res.data?.oldPassword,
//                             newPassword: res.data?.newPassword,
//                             confirmPassword: res.data?.confirmPassword
//                         }
//                     ]);
//                     localStorage.setItem('userDetails', Credentials);
//                     history.push({ pathname: '/signin', state: { response: 'newroute' } });
//                 }
//             })
//             .catch((err) => {
//                 setError('newPassword and confirmPassword should be same');
//                 if (err) {
//                     alert('Verify Your Password Details');
//                 }
//             });
//     };
//     return (
//         // <ThemeProvider theme={theme}>
//         <Layout>
//             <Container component='main' maxWidth='xs' style={{ marginLeft: '830px',marginTop: '110px' }}>
//                 <CssBaseline />
//                 <Box
//                     sx={{
//                         marginTop: 1,
//                         display: 'flex',
//                         flexDirection: 'column',
//                         alignItems: 'center'
//                     }}
//                 >
//                     {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
//                         <LockOutlinedIcon />
//                     </Avatar> */}
//                     <Typography component='h1' variant='h5' sx={{ color: '#0070ac' }}>
//                         Reset Your Password?
//                     </Typography>
//                     <p>Please enter your valid email address and required passwords.</p>
//                     <Box component='form' noValidate sx={{ mt: 1 }}>
//                         <TextField
//                             sx={{ marginTop: '10px' }}
//                             margin='normal'
//                             required
//                             fullWidth
//                             id='loginId'
//                             label='Email Address'
//                             name='loginId'
//                             autoComplete='on'
//                             values={loginId}
//                             onChange={(e) => setLoginId(e.target.value)}
//                             type='email'
//                             autoFocus
//                         />
//                         <TextField
//                             sx={{ marginTop: '25px' }}
//                             margin='normal'
//                             required
//                             fullWidth
//                             type={type}
//                             // [type]="showOldPassword ? 'text' : 'password'"
//                             values={oldPassword}
//                             name='oldpassword'
//                             label='OldPassword'
//                             onChange={(e) => setOldPassword(e.target.value)}
//                             id='password'
//                             autoComplete='current-password'
//                         />
//                         <span className='icon' onClick={handleToggle}>
//                             <Icon icon={icon} size={20} />
//                         </span>
//                         <TextField
//                             sx={{ marginTop: '5px' }}
//                             margin='normal'
//                             required
//                             fullWidth
//                             type={newPasswordType}
//                             values={newPassword}
//                             name='newpassword'
//                             label='NewPassword'
//                             onChange={(e) => setNewPassword(e.target.value)}
//                             id='password'
//                             autoComplete='current-password'
//                         />
//                         <span className='icon' onClick={handleToggleNewPassword}>
//                             <Icon icon={newIcon} size={20} />
//                         </span>
//                         <TextField
//                             sx={{ marginTop: '5px' }}
//                             margin='normal'
//                             required
//                             fullWidth
//                             type={confirmationType}
//                             values={confirmPassword}
//                             name='confirmpassword'
//                             label='ConfirmPassword'
//                             onChange={(e) => setConfirmPassword(e.target.value)}
//                             id='password'
//                             autoComplete='current-password'
//                         />
//                         <span className='icon' onClick={handleToggleConfirmPassword}>
//                             <Icon icon={confirmationIcon} size={20} />
//                         </span>
//                         <Button
//                             type='submit'
//                             fullWidth
//                             variant='contained'
//                             sx={{
//                                 mb: 2,
//                                 marginTOp: '5px',
//                                 backgroundColor: '#0070ac',
//                                 borderRadius: '40px',
//                                 height: '50px'
//                             }}
//                             //disabled={!loginId || !oldPassword || !newPassword || !confirmPassword}
//                             onClick={handleClick}
//                         >
//                             submit{' '}
//                         </Button>
//                         <Grid container>
//                             <Grid item xs>
//                                 {/* <Link to='/signin' variant='body2'>
//                                     Back
//                                 </Link> */}
//                                 <Button>
//                                     <a href='/'> Back</a>
//                                 </Button>
//                             </Grid>
//                         </Grid>
//                     </Box>
//                 </Box>
//             </Container>
//             {/* </ThemeProvider> */}
//         </Layout>
//     );
// }


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
import { AppConfigProps } from "../../components/core/settings/app-config";
import './App.css';

import * as Yup from 'yup';
import Layout from './Layout';

export default function Reset() {
    const history = useHistory();
    const [type, setType] = useState('password');
    const [confirmationType, setConfirmationType] = useState('password');
    const [confirmationIcon, setConfirmationIcon] = useState(eyeOff);
    const [pass, setPass] = useState('confirmPassword');
    const [newPasswordType, setNewPasswordType] = useState('password');
    const [newIcon, setNewIcon] = useState(eyeOff);
    const [newPass, setNewPass] = useState('newPassword');

    const [icon, setIcon] = useState(eyeOff);
    const [loginId, setLoginId] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({
        loginId: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const ReSetFormInputFields = () => {
        return {
            loginId: loginId,
            oldPassword: oldPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword
        };
    };

    const initialValues = ReSetFormInputFields();

    const ReSetFormValidationSchema = () => {
        return Yup.object().shape({
            loginId: Yup.string().trim().required('Email Id is required'),
            oldPassword: Yup.string().required('Enter old password'),
            newPassword: Yup.string()
                .matches(
                    /^(?=.*[a-z])/,
                    'New password must contain at least one lowercase letter'
                )
                .matches(
                    /^(?=.*[A-Z])/,
                    'New password must contain at least one uppercase letter'
                )
                .matches(
                    /^(?=.*\d)/,
                    'New password must contain at least one digit'
                )
                .matches(
                    /^(?=.*[@$!%*?&])/,
                    'New password must contain at least one special character'
                )
                .min(8, 'New password must be at least 8 characters long ')
                .required('Please enter your new password'),
            confirmPassword: Yup.string()
                .required('Please confirm your password')
                .oneOf([Yup.ref('newPassword')], 'Passwords must match')
        });
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

    const handleToggleNewPassword = () => {
        if (newPass === 'newPassword') {
            setNewIcon(eye);
            setNewPasswordType('text');
            setNewPass('text');
        } else {
            setNewIcon(eyeOff);
            setNewPasswordType('password');
            setNewPass('newPassword');
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

    const handleClick = async (e) => {
        e.preventDefault();
        const formData = {
            loginId: loginId,
            oldPassword: oldPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword
        };

        try {
            await ReSetFormValidationSchema().validate(formData, { abortEarly: false });
            
            const response = await axios.post(
                AppConfigProps.serverRoutePrefix + `/v1/auth/change_password?email=${loginId}&oldpassword=${oldPassword}&newpassword=${newPassword}`
            );
            
            if (response.status === 200) {
                const Credentials = JSON.stringify([
                    {
                        username: response.data?.loginId,
                        oldPassword: response.data?.oldPassword,
                        newPassword: response.data?.newPassword,
                        confirmPassword: response.data?.confirmPassword
                    }
                ]);
                localStorage.setItem('userDetails', Credentials);
                history.push({ pathname: '/signin', state: { response: 'newroute' } });
            }
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                // console.log(error);
                let newErrors = {};
                error.inner.forEach(err => {
                    newErrors[err.path] = err.message;
                });
                setErrors(newErrors);
                console.log()
            } else {
                setErrors({ oldPassword: 'Your old password is Incorrect' });
                console.error('Error occurred during form submission:', error);
                // alert('Your old password is Incorrect');
            }
        }
    };

    return (
        <Layout>
            <Container component='main' maxWidth='xs' style={{ marginLeft: '830px', marginTop: '110px' }}>
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <Typography component='h1' variant='h5' sx={{ color: '#0070ac' }}>
                        Reset Your Password?
                    </Typography>
                    <p>Please enter your valid email address and required passwords.</p>
                    <Box component='form' noValidate sx={{ mt: 1 }}>
                        <TextField
                            sx={{ marginTop: '10px' }}
                            margin='normal'
                            required
                            fullWidth
                            id='loginId'
                            label='Email Address'
                            name='loginId'
                            autoComplete='on'
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
                            type='email'
                            autoFocus
                            error={!!errors.loginId}
                            helperText={errors.loginId}
                        />
                        <TextField
                            sx={{ marginTop: '25px' }}
                            margin='normal'
                            required
                            fullWidth
                            type={type}
                            value={oldPassword}
                            name='oldpassword'
                            label='Old Password'
                            onChange={(e) => setOldPassword(e.target.value)}
                            id='password'
                            autoComplete='current-password'
                            error={!!errors.oldPassword}
                            helperText={errors.oldPassword}
                        />
                        <span className='icon' onClick={handleToggle}>
                            <Icon icon={icon} size={20} />
                        </span>
                        <TextField
                            sx={{ marginTop: '5px' }}
                            margin='normal'
                            required
                            fullWidth
                            type={newPasswordType}
                            value={newPassword}
                            name='newpassword'
                            label='New Password'
                            onChange={(e) => setNewPassword(e.target.value)}
                            id='password'
                            autoComplete='current-password'
                            error={!!errors.newPassword}
                            helperText={errors.newPassword}
                        />
                        <span className='icon' onClick={handleToggleNewPassword}>
                            <Icon icon={newIcon} size={20} />
                        </span>
                        <TextField
                            sx={{ marginTop: '5px' }}
                            margin='normal'
                            required
                            fullWidth
                            type={confirmationType}
                            value={confirmPassword}
                            name='confirmpassword'
                            label='Confirm Password'
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            id='password'
                            autoComplete='current-password'
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                        />
                        <span className='icon' onClick={handleToggleConfirmPassword}>
                            <Icon icon={confirmationIcon} size={20} />
                        </span>
                        <Button
                            type='submit'
                            fullWidth
                            variant='contained'
                            sx={{
                                mb: 2,
                                marginTOp: '5px',
                                backgroundColor: '#0070ac',
                                borderRadius: '40px',
                                height: '50px'
                            }}
                            onClick={handleClick}
                        >
                            Submit
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Button>
                                    <a href='/'> Login</a>
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </Layout>
    );
}
