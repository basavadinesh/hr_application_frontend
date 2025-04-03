// Import for React library
import React from 'react';

// Imports for pre-designed compoenents
import { Container, Typography, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';

// Custom Styles and theme setting for errorpage
const useStyles = makeStyles(() => ({
  root: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '10rem', 
  },
  paper: {
    padding: '2rem',
    textAlign: 'center',
    maxWidth: '600px',
    width: '100%',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff', 
  },
  title: {
    fontSize: '2rem',
    color: '#13274F', 
    marginBottom: '1rem',
  },
  description: {
    fontSize: '1rem',
    color: '#13274F', 
    marginBottom: '1rem',
  },
  message: {
    color: '#333333', 
    marginBottom: '1rem',
  },
  customMessage: {
    color: '#ff0000', 
    marginTop: '1rem',
    fontWeight: 'bold',
  },
}));

// Error page to display import and other errors
export const EmployeeErrorPage = () => {
  const classes = useStyles();
  const errorDetails = JSON.parse(localStorage.getItem('processingErrors')) || [];

  let message = "An unexpected error occurred.";
  let customMessage = "";

  if (errorDetails.length > 0) {
    const { statusCode, message: serverMessage } = errorDetails[0];

    if (statusCode >= 400 && statusCode < 500) {
      message = "We encountered an error while processing your request.";
    } else if (statusCode >= 500) {
      message = "A server error occurred. Please contact the admin.";
    }

    if (serverMessage) {
      customMessage = serverMessage;
    }
  }

  return (
    <Container component="main" className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h1" className={classes.title}>
          Oops! Something went wrong.
        </Typography>
        <Typography variant="body1" className={classes.description}>
          {message}
        </Typography>
        {customMessage && (
          <Typography variant="body1" className={classes.customMessage}>
            {customMessage}
          </Typography>
        )}
      </Paper>
    </Container>
  );
};
