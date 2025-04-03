import React from 'react';
import { Box, Typography } from '@mui/material';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';

const NotAuthorized = () => {
    console.log("Not Authorized Loaded");
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      minHeight="70vh"
      textAlign="center"
      bgcolor="background.default"
      p={2}
    >
     
      <Typography variant="h5" color="textPrimary" gutterBottom>
        Hey there!
      </Typography>
      <Typography variant="h6" color="textSecondary">
        Looks like you don't have access to this page.
      </Typography>
  
      <EmojiObjectsIcon style={{ fontSize: 60, color: '#13274F', marginTop: 16 }} />
    </Box>
  );
};

export default NotAuthorized;
