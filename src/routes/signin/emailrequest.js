import React from 'react';
import Layout from './Layout';
import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const EmailReq = () => {
  return (
    <Layout>
      <Container component='main' maxWidth='xs' style={{ marginLeft: '831px' }}>
      
               
      <Typography component='h1' variant='h5' sx={{ color: '#0070ac', marginTop:'0px' }}>Request sent Successfully.</Typography>
        <p>We have sent a confirmation email Please check your email.</p>
      
      
      

      {/* <button className="btn1">
        <Link
          to="/forgotpwd/fillpwd"
          type="submit"
          style={{ textDecoration: 'none', color: 'white' }}
        >
          Reset Password
        </Link>
      </button> */}
      
      </Container>
    </Layout>
  );
};

export default EmailReq;
