import React, { useState } from 'react';
// Imports from material ui for pre-designed components
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Backdrop from '@mui/material/Backdrop';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddRelievingInfo from '../AddRelievingInfo'; // Make sure this import points to the correct file

// Custom Style settings for the cards
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

const RelievingInfoCard = ({
    employeeDetails,
    relievingDetails,
    fetchEmployeeDetails,
    fetchRelievingDetails
}) => {
    const [infoopen, setInfoopen] = useState(false);
    const [selectedInfoMethod, setSelectedInfoMethod] = useState(null);
    const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(employeeDetails);
    const [selectedRelievingDetails, setSelectedRelievingDetails] = useState(relievingDetails);
    console.log('Carereliwinve', relievingDetails);

    const handleInfoClose = async () => {
        setInfoopen(false);
        const response = await fetchEmployeeDetails();

        setSelectedEmployeeDetails(response);

        const res = await fetchRelievingDetails();
        if (res) {
            console.log('res', res);
            setSelectedRelievingDetails(res);
        }
    };

    const handleInfoOpen = async (method) => {
        const res = await fetchRelievingDetails();
        if (res) {
            console.log('res', res);
            setSelectedRelievingDetails(res);
        }
        setSelectedEmployeeDetails(employeeDetails);
        setSelectedInfoMethod(method);
        setInfoopen(true);
    };

    const handleEdit = () => {
        handleInfoOpen('add');
    };

    const handleCopy = () => {
        // Prepare the text to be copied (excluding the title "Relieving Information")
        const copyText = `
          Employee Name: ${selectedEmployeeDetails.fullname}
          Employee Code: ${selectedEmployeeDetails.employeeid}
          Reporting To: ${selectedEmployeeDetails.manager}
          Designation: ${selectedEmployeeDetails.designation}
          Joining Date: ${selectedEmployeeDetails.joiningdate}
          Date of Exit: ${selectedEmployeeDetails.DateOfExit || '-'}
          Documents Issued: ${selectedRelievingDetails.documentsIssued || '-'}
          Comments: ${selectedRelievingDetails.comments || '_'}
          Last Drawn CTC: ${selectedRelievingDetails.lastDrawnCTC || '-'}
        `;

        // Copy to clipboard
        navigator.clipboard
            .writeText(copyText)
            .then(() => {
                alert('Copied to clipboard!');
            })
            .catch((err) => {
                console.error('Error copying text: ', err);
            });
    };

    return (
        <Card
            variant='outlined'
            sx={{ ...cardStyles(pastelColors.blue), minWidth: '800px', marginLeft: '20px' }}
        >
            <CardContent sx={{ padding: '20px' }}>
                <Box
                    sx={{
                        width: '90%',
                        borderRadius: '5px',
                        padding: '10px',
                        marginTop: '10px',
                        position: 'relative',
                        textAlign: 'center'
                    }}
                >
                    <Typography
                        variant='h5'
                        gutterBottom
                        sx={{ fontWeight: 'bold', paddingBottom: '5px' }}
                    >
                        Relieving Information
                    </Typography>
                    <IconButton
                        onClick={handleEdit}
                        sx={{ position: 'absolute', top: '0', right: '50px', marginTop: '6px' }}
                        aria-label='edit'
                    >
                        <EditIcon />
                    </IconButton>

                    <IconButton
                        onClick={handleCopy}
                        sx={{
                            position: 'absolute',
                            top: '0',
                            right: '0',
                            marginTop: '6px',
                            marginLeft: '8px'
                        }}
                        aria-label='copy'
                    >
                        <ContentCopyIcon />
                    </IconButton>

                    <AddRelievingInfo
                        open={infoopen}
                        handleClose={handleInfoClose}
                        Backdrop={Backdrop}
                        method={selectedInfoMethod}
                        employeeDetails={selectedEmployeeDetails}
                        relievingDetails={selectedRelievingDetails}
                    />
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
                        <span style={propertyStyles(pastelColors.black)}>Employee Name:</span>
                        <Typography
                            variant='body1'
                            sx={{ marginRight: 'auto', marginLeft: '200px' }}
                        >
                            {selectedEmployeeDetails.fullname}
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
                        <span style={propertyStyles(pastelColors.black)}>Employee Code:</span>
                        <Typography
                            variant='body1'
                            sx={{ marginRight: 'auto', marginLeft: '200px' }}
                        >
                            {selectedEmployeeDetails.employeeid}
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
                        <span style={propertyStyles(pastelColors.black)}>Reporting To:</span>
                        <Typography
                            variant='body1'
                            sx={{ marginRight: 'auto', marginLeft: '200px' }}
                        >
                            {selectedEmployeeDetails.manager}
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
                        <span style={propertyStyles(pastelColors.black)}>Designation:</span>
                        <Typography
                            variant='body1'
                            sx={{ marginRight: 'auto', marginLeft: '200px' }}
                        >
                            {selectedEmployeeDetails.designation}
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
                        <span style={propertyStyles(pastelColors.black)}>Joining Date:</span>
                        <Typography
                            variant='body1'
                            sx={{ marginRight: 'auto', marginLeft: '200px' }}
                        >
                            {selectedEmployeeDetails.joiningdate}
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
                        <span style={propertyStyles(pastelColors.black)}>Date of Exit:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedEmployeeDetails.DateOfExit
                                ? selectedEmployeeDetails.DateOfExit
                                : '-'}
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
                        <span style={propertyStyles(pastelColors.black)}>Last Drawn CTC:</span>
                        <Typography
                            variant='body1'
                            sx={{ marginRight: 'auto', marginLeft: '200px' }}
                        >
                            {selectedRelievingDetails?.lastDrawnCTC || '-'}
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
                        <span style={propertyStyles(pastelColors.black)}>Documents Issued:</span>
                        <Typography
                            variant='body1'
                            sx={{ marginRight: 'auto', marginLeft: '200px' }}
                        >
                            {selectedRelievingDetails?.documentsIssued || '-'}
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
                        <span style={propertyStyles(pastelColors.black)}>Comments:</span>
                        <Typography
                            variant='body1'
                            sx={{ marginRight: 'auto', marginLeft: '200px' }}
                        >
                            {selectedRelievingDetails?.comments || '-'}
                        </Typography>
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export { RelievingInfoCard };
