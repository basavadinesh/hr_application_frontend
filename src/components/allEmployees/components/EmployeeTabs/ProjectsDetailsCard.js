import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Card,
    CardContent,
    Typography,
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Chip
} from '@mui/material';
import { styled } from '@mui/system';
import DownloadIcon from '@mui/icons-material/Download';

// Define pastel colors for styling
const pastelColors = {
    blue: '#AEDFF7',
    black: '#000',
    white: '#ffffff'
};

// Function to get the appropriate color based on the project status
const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
        case 'active':
            return 'primary';
        case 'completed':
            return 'success';
        case 'hold':
            return 'warning';
        case 'cancelled':
            return 'error';
        default:
            return 'default';
    }
};

// Function to define property styles for the project details
const propertyStyles = (color) => ({
    fontWeight: 'bold',
    color: color,
    width: '150px',
    fontSize: '18px', // Adjust the size as needed
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    whiteSpace: 'nowrap'
});

// Function to define card styles, including background color and transparency
const cardStyles = (backgroundColor) => ({
    borderWidth: 2,
    borderStyle: 'solid',
    boxShadow: 3,
    borderRadius: 2,
    borderColor: backgroundColor,
    backgroundColor: `${backgroundColor}20`, // Adding transparency
    padding: '12px',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
});

// Custom styled list component for scrollable project list
const ScrollableList = styled(List)({
    maxHeight: '250px', // Set a height for the scrollable area
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

// Component to display the list of projects
const ProjectsListCard = ({ projectDetails, onSelectProject }) => {
    const [selectedProject, setSelectedProject] = useState(null);

    // Automatically select the first project when the component mounts
    useEffect(() => {
        if (projectDetails.length > 0) {
            setSelectedProject(projectDetails[0]);
        }
    }, [projectDetails]);

    // Handle the selection of a project
    const handleSelectProject = (project) => {
        setSelectedProject(project);
        onSelectProject(project);
    };

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
                    Projects List
                </Typography>
                <ScrollableList>
                    {projectDetails && projectDetails.length > 0 ? (
                        projectDetails.map((project) => (
                            <ListItem
                                disablePadding
                                selected={project === selectedProject}
                                key={project.id}
                            >
                                <ListItemButton
                                    onClick={() => handleSelectProject(project)}
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
                                                <span>{project.name}</span>
                                                <Chip
                                                    label={project.status}
                                                    color={getStatusColor(project.status)}
                                                    size='small'
                                                    sx={{ marginLeft: '8px' }}
                                                />
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography
                                                sx={{
                                                    marginBottom: '8px',
                                                    fontSize: '16px'
                                                }}
                                            >
                                                {project.description}
                                            </Typography>
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))
                    ) : (
                        <Typography variant='body1' sx={{ textAlign: 'center', marginTop: '20px' }}>
                            No Projects details available.
                        </Typography>
                    )}
                </ScrollableList>
            </CardContent>
        </Card>
    );
};

export default ProjectsListCard;

// Function to handle downloading of selected project files
const handleSelectedProjectDownload = async (relativePath) => {
    console.log('Relative Path:', relativePath);
    try {
        const fileName = relativePath;

        const response = await axios.get(`http://localhost:8080/api/v1/file/download`, {
            params: {
                fileName: relativePath
            },
            responseType: 'blob'
        });

        // Get the file extension
        const fileExtension = fileName.split('.').pop().toLowerCase();

        // Create a URL for the blob
        const url = window.URL.createObjectURL(
            new Blob([response.data], { type: response.headers['content-type'] })
        );

        if (fileExtension === 'pdf') {
            // Open PDF files in a new tab
            window.open(url, '_blank');
        } else {
            // Create a link element for non-PDF files
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName; // Set the file name for download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        // Clean up the URL object
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error handling file:', error);
    }
};

// Component to display detailed information about the selected project
export const ProjectInformationCard = ({ selectedProject }) => {
    if (!selectedProject) {
        return null;
    }

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
                        Project Details
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
                        <span style={propertyStyles(pastelColors.black)}>Start Date:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedProject.startdate}
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
                        <span style={propertyStyles(pastelColors.black)}>End Date:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedProject.enddate}
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
                        <span style={propertyStyles(pastelColors.black)}>Priority:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedProject.priority}
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
                        <span style={propertyStyles(pastelColors.black)}>Team Type:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedProject.teamtype}
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
                        <span style={propertyStyles(pastelColors.black)}>Price:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedProject.price} {selectedProject.currency}
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
                        <span style={propertyStyles(pastelColors.black)}>Billing Type:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedProject.billingtype}
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
                        <span style={propertyStyles(pastelColors.black)}>Status:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedProject.status}
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
                        <span style={propertyStyles(pastelColors.black)}>Description:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedProject.description}
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
                        <span style={propertyStyles(pastelColors.black)}>Project Lead:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedProject.projectlead}
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
                                cursor: 'pointer', // Change cursor to pointer to indicate clickable
                                marginRight: 'auto',
                                marginLeft: '198px',
                                color: '#0056b3', // Darker blue color
                                textDecoration: 'underline', // Optional: Underline the link
                                display: 'flex',
                                alignItems: 'center' // Align icon and text
                            }}
                            onClick={() =>
                                handleSelectedProjectDownload(selectedProject.document.filepath)
                            } // Call handleDownload function on click
                        >
                            {/* Add some margin to the icon */}
                            <DownloadIcon />
                            Download Project File
                        </Typography>
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};
