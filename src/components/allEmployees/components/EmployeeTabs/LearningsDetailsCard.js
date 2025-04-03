// Import for React library and hooks
import React, { useState, useEffect } from 'react';
import axios from 'axios'
import LearningFilesModal from '../../../Learning/components/LearningFilesModal'
// Imports from material ui for pre-designed components
import {
    Card,
    CardContent,
    Typography,
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    CircularProgress,
    Tooltip,
    IconButton,
} from '@mui/material';
import { styled } from '@mui/system';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import  DownloadIcon  from '@mui/icons-material/Download';


// Custom Style setting for the cards
const pastelColors = {
    blue: '#AEDFF7',
    black: '#000',
    white: '#ffffff'
};

const propertyStyles = (color) => ({
    fontWeight: 'bold',
    color: color,
    width: '150px',
    fontSize: '18px',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    whiteSpace: 'nowrap'
});

const cardStyles = (backgroundColor) => ({
    borderWidth: 2,
    borderStyle: 'solid',
    boxShadow: 3,
    borderRadius: 2,
    borderColor: backgroundColor,
    backgroundColor: `${backgroundColor}20`,
    padding: '12px',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  });
  
const ScrollableList = styled(List)({
    maxHeight: '200px',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '8px'
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1'
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#888',
      borderRadius: '4px'
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#555'
    }
 });



// Function defintion to display the circular progress of learning
function CircularProgressWithLabel(props) {

    // Function defintion for returning color based on the value
    const getColor = (value) => {
      if (value < 30) return 'gold';
      if (value < 75) return 'green';
      return '#13274F';
    };
    
    // JSX to display the circular progress
    return (
      <Box sx={{ position: 'relative', display: 'inline-flex', marginLeft: '10px' }}>
        <CircularProgress
          variant="determinate"
          {...props}
          sx={{ color: getColor(props.value) }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" component="div" color="text.secondary">
            {`${Math.round(props.value)}%`}
          </Typography>
        </Box>
      </Box>
    );
  }
  
  // Function defintion for learnings list
  const LearningListCard = ({ learningsDetails, onSelectLearning }) => {

    // Initial state setting for selected learning and progress
    const [selectedLearning, setSelectedLearning] = useState(null);
    const [progressValues, setProgressValues] = useState({});
    
    // useEffect hook call to set the selected learning details
    useEffect(() => {
      if (learningsDetails.length > 0) {
        setSelectedLearning(learningsDetails[0]);
      }
    }, [learningsDetails]);
    
    // useEffect hook call to st the progress values
    useEffect(() => {
      const interval = setInterval(() => {
        setProgressValues((prevValues) =>
          learningsDetails.reduce((acc, learning) => {
            const prevValue = prevValues[learning.id] || 0;
            const newValue = prevValue < learning.completionPercentage ? prevValue + 1 : learning.completionPercentage;
            return { ...acc, [learning.id]: newValue };
          }, {})
        );
      }, 10);
  
      return () => clearInterval(interval);
    }, [learningsDetails]);
    
    // Handler function to set the selected learning
    const handleSelectLearning = (learning) => {
      setSelectedLearning(learning);
      onSelectLearning(learning);
    };
    
    // JSX to return the display the list of learnings
    return (
      <Card
        variant="outlined"
        sx={{ minWidth: '400px', margin: '20px', padding: '20px',...cardStyles(pastelColors.blue) }}
      >
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
            Learning List
          </Typography>
          <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
            <ScrollableList>
              {learningsDetails && learningsDetails.length > 0 ? (
                learningsDetails.map((learning) => (
                  <ListItem
                    key={learning.id}
                    disablePadding
                    selected={learning === selectedLearning}
                  >
                    <ListItemButton
                      onClick={() => handleSelectLearning(learning)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: '#f0f0f0' },
                        padding: '10px',
                        justifyContent: 'space-between', 
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              fontSize: '20px',
                            }}
                          >
                            <span>{learning.title}</span>
                            <CircularProgressWithLabel value={progressValues[learning.id] || 0} />
                          </Typography>
                        }
                        sx={{ paddingLeft: '20px' }} 
                      />
                    </ListItemButton>
                  </ListItem>
                ))
              ) : (
                <Typography variant="body1" sx={{ textAlign: 'center', marginTop: '20px' }}>
                  No learning details available.
                </Typography>
              )}
            </ScrollableList>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '20px' }}>
            <Tooltip
              title={
                <React.Fragment>
                  <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <Box sx={{ width: '10px', height: '10px', backgroundColor: 'gold', borderRadius: '50%', marginRight: '4px' }} />
                    <Typography variant="caption">0-30%</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <Box sx={{ width: '10px', height: '10px', backgroundColor: 'green', borderRadius: '50%', marginRight: '4px' }} />
                    <Typography variant="caption">30-75%</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '10px', height: '10px', backgroundColor: '#13274F', borderRadius: '50%', marginRight: '4px' }} />
                    <Typography variant="caption">75-100%</Typography>
                  </Box>
                </React.Fragment>
              }
            >
              <IconButton sx={{ ml: 1 }}>
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>
    );
  };

export default LearningListCard;

// Function definition for infromation card
const LearningInformationCard = ({ selectedLearning }) => {
  const [showModal, setShowModal] = useState(false);
  const [documents, setDocuments] = useState([]);
    if (!selectedLearning) {
        return null;
    }
    const handleShowModal = (documents) => {
      setDocuments(documents);
      setShowModal(true);
  };

  const handleCloseModal = () => {
      setShowModal(false);
  };

  const handleDownload = async (relativePath) => {
    console.log('Relative Path:', relativePath);
    try {
        // Make a GET request to the backend with the file name as a query parameter
        const response = await axios.get(`http://localhost:8080/api/v1/file/download`, {
            params: {
                fileName: relativePath // Include the file name as a query parameter
            },
            responseType: 'blob' // Ensure the response type is blob
        });
        console.log("user:", selectedLearning.user);
        // Extract the file name from the relativePath
        const originalFileName = relativePath.split('/').pop();
        const fileExtension = originalFileName.split('.').pop().toLowerCase();

        // Construct the new file name based on the file extension
        let fileName = 'Evidence_Document.' + fileExtension; // Default name with correct extension
        if (fileExtension === 'doc' || fileExtension === 'docx') {
            // Assuming you have access to the user's full name
            fileName = `${selectedLearning.user.fullname}_Evidence_Document.${fileExtension}`;
        } else {
            console.warn('Unsupported file type. Ignoring.');
            return; // Exit the function if the file type is unsupported
        }

        console.log(fileName); // Output the file name to confirm

        // Create a URL for the blob
        const url = window.URL.createObjectURL(
            new Blob([response.data], { type: response.headers['content-type'] })
        );

        // Create a temporary link element to trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName); // Set the constructed file name for download

        // Append the link to the document and trigger the click
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error handling file:', error);
    }
};
    return (
        <Card
            variant='outlined'
            sx={{ ...cardStyles(pastelColors.blue), minWidth: '800px', marginLeft: '20px' }}
        >
            <CardContent sx={{ padding: '20px' }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px'
                    }}
                >
                    <Typography variant='h5' gutterBottom>
                        Learning Details
                    </Typography>
                </Box>
                <LearningFilesModal
                open={showModal}
                onClose={handleCloseModal}
                documents={documents}
                handleDownload={handleDownload}
            />
                <Box
                    sx={{
                        width: '90%',
                        borderRadius: '5px',
                        padding: '10px',
                        marginTop: '10px'
                    }}
                >
                    <Typography
                        variant='body1'
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingBottom: '11px'
                        }}
                    >
                        <span style={propertyStyles(pastelColors.black)}>Title:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedLearning.title}
                        </Typography>
                    </Typography>
                    <Typography
                        variant='body1'
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingBottom: '11px'
                        }}
                    >
                        <span style={propertyStyles(pastelColors.black)}>
                            Completion Percentage:
                        </span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedLearning.completionPercentage}%
                        </Typography>
                    </Typography>
                    <Typography
                        variant='body1'
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingBottom: '11px'
                        }}
                    >
                        <span style={propertyStyles(pastelColors.black)}>Watched Link:</span>
                        <a
                            href={selectedLearning.watchedLink}
                            target='_blank'
                            rel='noopener noreferrer'
                            style={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            <Typography variant='body1'>View</Typography>
                        </a>
                    </Typography>
                    <Typography
                        variant='body1'
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingBottom: '11px'
                        }}
                    >
                        <span style={propertyStyles(pastelColors.black)}>
                            Evidence Attachments:
                        </span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                            onClick={() => handleShowModal(selectedLearning.documents)} 
                        >
                              <DownloadIcon  />
                              Document File
                        </Typography>
                    </Typography>
                    <Typography
                        variant='body1'
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingBottom: '11px'
                        }}
                    >
                        <span style={propertyStyles(pastelColors.black)}>Start Date:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {new Date(selectedLearning.startDate).toLocaleDateString()}
                        </Typography>
                    </Typography>
                    <Typography
                        variant='body1'
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingBottom: '11px'
                        }}
                    >
                        <span style={propertyStyles(pastelColors.black)}>Completion Date:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {new Date(selectedLearning.completionDate).toLocaleDateString()}
                        </Typography>
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export { LearningListCard, LearningInformationCard };
