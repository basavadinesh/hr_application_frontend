import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Button, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import moment from 'moment';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';
import DownloadFilesModal from 'components/educations/components/DownloadFilesModal ';

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

export const EmployeeExperienceCard = ({
    employeeDetails,
    handleExperienceInfoOpen,
    fetchEmployeeDetails,
    employeeValues
}) => {
    const [showModal, setShowModal] = useState(false);
    const [documents, setDocuments] = useState([]);
    const handleShowModal = (docs) => {
        console.log('DocumentType', docs);
        setDocuments(docs || []);
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

    const handleCopy = () => {
        const copyText = `
            Experience Type: ${employeeDetails.isFresher ? 'Fresher' : 'Experienced'}
            Previous Company: ${employeeDetails.employeeExperience?.[0]?.previousCompany || '-'}
            Designation: ${employeeDetails.employeeExperience?.[0]?.experienceDesignation || '-'}
            Reporting Manager: ${employeeDetails.employeeExperience?.[0]?.reportingManager || '-'}
            Start Date: ${employeeDetails.employeeExperience?.[0]?.startDate || '-'}
            End Date: ${employeeDetails.employeeExperience?.[0]?.endDate || '-'}
            UAN Number: ${employeeDetails.employeeExperience?.[0]?.uanNumber || '-'}
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

    const renderPayslipsRow = () => {
        const hasPayslips = payslipsDocuments && payslipsDocuments.length > 0;

        return (
            <Typography
                variant='body1'
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingBottom: '11px'
                }}
            >
                <span style={propertyStyles(pastelColors.black)}>Payslips:</span>
                {hasPayslips ? (
                    <Typography
                        variant='body1'
                        sx={{
                            cursor: 'pointer',
                            marginRight: 'auto',
                            marginLeft: '198px',
                            color: '#0066cc',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            '&:hover': {
                                textDecoration: 'underline'
                            }
                        }}
                        onClick={() => handleShowModal(payslipsDocuments)}
                    >
                        <DownloadIcon sx={{ fontSize: '20px' }} />
                        Payslip Documents
                    </Typography>
                ) : (
                    <Typography
                        variant='body1'
                        sx={{
                            marginRight: 'auto',
                            marginLeft: '200px',
                            color: 'text.primary'
                        }}
                    >
                        -
                    </Typography>
                )}
            </Typography>
        );
    };

    const handleOtherInfoOpen = () => {
        console.log('Edit button clicked');
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return moment(dateString).format('MM/DD/YYYY');
    };
    const payslipsDocuments =
        employeeValues?.payslipFiles || employeeDetails?.payslipsDocuments || [];

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
                        Experience Information
                    </Typography>
                    <Box>
                        <Button
                            variant=''
                            sx={{ position: 'absolute', top: '0', right: '50px', marginTop: '6px' }}
                            aria-label='edit'
                            onClick={handleExperienceInfoOpen}
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
                    {renderInformationRow(
                        'Experience Type',
                        employeeDetails.isFresher ? 'Fresher' : 'Experienced'
                    )}

                    {!employeeDetails.isFresher && (
                        <>
                            {renderInformationRow(
                                'Previous Company',
                                employeeDetails.employeeExperience?.[0]?.previousCompany || '-'
                            )}
                            {renderInformationRow(
                                'Designation',
                                employeeDetails.employeeExperience?.[0]?.experienceDesignation ||
                                    '-'
                            )}
                            {renderInformationRow(
                                'Reporting Manager',
                                employeeDetails.employeeExperience?.[0]?.reportingManager || '-'
                            )}
                            {renderInformationRow(
                                'Start Date',
                                formatDate(employeeDetails.employeeExperience?.[0]?.startDate)
                            )}
                            {renderInformationRow(
                                'End Date',
                                formatDate(employeeDetails.employeeExperience?.[0]?.endDate)
                            )}
                            {renderInformationRow(
                                'UAN Number',
                                employeeDetails.employeeExperience?.[0]?.uanNumber || '-'
                            )}
                        </>
                    )}

                    {renderPayslipsRow()}
                </Box>
            </CardContent>
        </Card>
    );
};
