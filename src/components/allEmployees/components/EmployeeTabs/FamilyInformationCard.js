import React from 'react';
import { Card, CardContent, Typography, Box, Button, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import moment from 'moment';

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

export const FamilyInformationCard = ({ employeeDetails, handleFamilyInfoOpen }) => {
    console.log('Employee Details in Card:', employeeDetails);
    console.log('Children Details:', employeeDetails.childrenDetails);

    const handleCopy = () => {
        const copyText = `
            Father's Name: ${employeeDetails.fathername || '-'}
            Mother's Name: ${employeeDetails.mothername || '-'}
            Contact Number: ${employeeDetails.contactNumber || '-'}
            Marital Status: ${employeeDetails.maritalStatus || '-'}
            Spouse Name: ${employeeDetails.spouseName || '-'}
            Spouse Aadhaar Number: ${employeeDetails.spouseAadharNumber || '-'}
            ${
                employeeDetails.childrenDetails
                    ?.map(
                        (kid, index) => `
            Kid ${index + 1}:
            Name: ${kid.kidName || '-'}
            Gender: ${kid.kidGender || '-'}
            Date of Birth: ${kid.kidDob || '-'}
            `
                    )
                    .join('\n') || ''
            }
        `;

        navigator.clipboard
            .writeText(copyText)
            .then(() => {
                alert('Copied to clipboard!');
            })
            .catch((err) => {
                console.error('Error copying text: ', err);
            });
    };

    const renderInformationRow = (label, value) => (
        <Typography
            variant='body1'
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingBottom: '11px'
            }}
        >
            <span style={propertyStyles(pastelColors.black)}>{label}:</span>
            <Typography variant='body1' sx={{ marginRight: 'auto', marginLeft: '200px' }}>
                {value || '-'}
            </Typography>
        </Typography>
    );

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return moment(dateString).format('MM/DD/YYYY');
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
                        Family Information
                    </Typography>
                    <Box>
                        <Button
                            variant=''
                            sx={{ position: 'absolute', top: '0', right: '50px', marginTop: '6px' }}
                            aria-label='edit'
                            onClick={handleFamilyInfoOpen}
                            startIcon={<EditIcon />}
                        >
                            Edit
                        </Button>
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
                    </Box>
                </Box>

                <Box
                    sx={{
                        width: '90%',
                        borderRadius: '5px',
                        padding: '10px',
                        marginTop: '10px'
                    }}
                >
                    {renderInformationRow("Father's Name", employeeDetails.fathername)}
                    {renderInformationRow("Mother's Name", employeeDetails.mothername)}
                    {renderInformationRow('Contact Number', employeeDetails.contactNumber)}
                    {renderInformationRow('Marital Status', employeeDetails.maritalStatus)}

                    {employeeDetails.maritalStatus === 'Married' && (
                        <>
                            {renderInformationRow('Spouse Name', employeeDetails.spouseName)}
                            {renderInformationRow(
                                'Spouse Aadhaar Number',
                                employeeDetails.spouseAadharNumber
                            )}
                        </>
                    )}

                    {employeeDetails.childrenDetails &&
                        employeeDetails.childrenDetails.length > 0 &&
                        employeeDetails.childrenDetails.map((kid, index) => (
                            <Box key={index} sx={{ mt: 2, mb: 2 }}>
                                <Typography
                                    variant='h6'
                                    sx={{
                                        fontWeight: 'bold',
                                        fontSize: '18px',
                                        marginBottom: '10px',
                                        color: pastelColors.black
                                    }}
                                >
                                    Kid {index + 1} Details
                                </Typography>
                                {renderInformationRow('Name', kid.kidName)}
                                {renderInformationRow('Gender', kid.kidGender)}
                                {renderInformationRow('Date of Birth', formatDate(kid.kidDob))}
                            </Box>
                        ))}
                </Box>
            </CardContent>
        </Card>
    );
};
