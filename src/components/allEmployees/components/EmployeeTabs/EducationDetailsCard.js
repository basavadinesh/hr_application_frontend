// Imports for React library and hooks
import React, { useState, useEffect } from 'react';

import DownloadFilesModal from '../../../educations/components/DownloadFilesModal ';

// Imports for material ui for pre-designed components
import {
    Card,
    CardContent,
    Typography,
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText
} from '@mui/material';
import { styled } from '@mui/system';
import DownloadIcon from '@mui/icons-material/Download';

//Import for HTTP request library
import axios from 'axios';

// Custom styling setting for the cards
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
    maxHeight: '250px',
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

// Function definition for list of educations
const EducationListCard = ({ educationDetails, onSelectEducation }) => {
    // Initial state setting for selected education
    const [selectedEducation, setSelectedEducation] = useState(null);

    // useEffect hook call to set the selected education
    useEffect(() => {
        if (educationDetails.length > 0) {
            setSelectedEducation(educationDetails[0]);
        }
    }, [educationDetails]);

    // Handler function to set the state of selected education
    const handleSelectEducation = (education) => {
        setSelectedEducation(education);
        onSelectEducation(education);
    };

    // JSX to display list of educations
    return (
        <Card
            variant='outlined'
            sx={{ ...cardStyles(pastelColors.blue), maxWidth: '500px', margin: '0 auto' }}
        >
            <CardContent>
                <Typography
                    variant='h5'
                    gutterBottom
                    sx={{ textAlign: 'center', fontWeight: 'bold' }}
                >
                    Education List
                </Typography>
                <ScrollableList>
                    <List>
                        {educationDetails && educationDetails.length > 0 ? (
                            educationDetails.map((education) => (
                                <ListItem
                                    key={education.id}
                                    disablePadding
                                    selected={education === selectedEducation}
                                >
                                    <ListItemButton
                                        onClick={() => handleSelectEducation(education)}
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': { backgroundColor: '#f0f0f0' }
                                        }}
                                    >
                                        <ListItemText
                                            primary={
                                                <Typography
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        marginBottom: '8px',
                                                        fontSize: '20px'
                                                    }}
                                                >
                                                    <span>{education.education}</span>
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography
                                                    sx={{
                                                        marginBottom: '8px',
                                                        fontSize: '16px'
                                                    }}
                                                >
                                                    {education.specification}
                                                </Typography>
                                            }
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))
                        ) : (
                            <Typography
                                variant='body1'
                                sx={{ textAlign: 'center', marginTop: '20px' }}
                            >
                                You have not added education details or no education information
                                available.
                            </Typography>
                        )}
                    </List>
                </ScrollableList>
            </CardContent>
        </Card>
    );
};

export default EducationListCard;

// Function defintion for Education Information
export const EducationInformationCard = ({ selectedEducation }) => {
    const [showModal, setShowModal] = useState(false);
    const [documents, setDocuments] = useState([]);

    // Return nothing if there are no items in the list
    if (!selectedEducation) {
        return null;
    }
    console.log('Education document ur:', selectedEducation.document);

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
            const fileName = relativePath;

            const response = await axios.get(`http://localhost:8080/api/v1/file/download`, {
                params: {
                    fileName: relativePath
                },
                responseType: 'blob'
            });

            // Check if the file extension is .pdf
            const fileExtension = fileName.split('.').pop().toLowerCase();

            if (fileExtension === 'pdf') {
                // Create a URL for the blob
                const url = window.URL.createObjectURL(
                    new Blob([response.data], { type: 'application/pdf' })
                );

                // Open PDF files in a new tab
                window.open(url, '_blank');

                // Clean up the URL object
                window.URL.revokeObjectURL(url);
            } else {
                console.warn('File is not a PDF. Ignoring.');
            }
        } catch (error) {
            console.error('Error handling file:', error);
        }
    };

    // JSX to display Education details of the selected education
    return (
        <Card
            variant='outlined'
            sx={{ ...cardStyles(pastelColors.blue), minWidth: '800px', marginLeft: '20px' }}
        >
            <CardContent sx={{ padding: '20px' }}>
                <DownloadFilesModal
                    open={showModal}
                    onClose={handleCloseModal}
                    documents={documents}
                    handleDownload={handleDownload}
                />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px'
                    }}
                >
                    <Typography variant='h5' gutterBottom>
                        Education Details
                    </Typography>
                </Box>
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
                        <span style={propertyStyles(pastelColors.black)}>Education:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedEducation.education}
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
                        <span style={propertyStyles(pastelColors.black)}> Specification:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedEducation.specification}
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
                        <span style={propertyStyles(pastelColors.black)}>Institution:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedEducation.institution}
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
                        <span style={propertyStyles(pastelColors.black)}>Start Year:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedEducation.startyear}
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
                        <span style={propertyStyles(pastelColors.black)}>End Yeaar:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedEducation.endyear}
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
                        <span style={propertyStyles(pastelColors.black)}>GPA:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedEducation.gpa}
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
                        <span style={propertyStyles(pastelColors.black)}>Document:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                cursor: 'pointer',
                                marginRight: 'auto',
                                marginLeft: '198px',
                                color: '#0056b3',
                                textDecoration: 'underline',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                            onClick={() => handleShowModal(selectedEducation.documents)}
                        >
                            <DownloadIcon />
                            Document File
                        </Typography>
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};
