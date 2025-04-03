import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Grid,
    Paper,
    Divider
} from '@mui/material';
import { Print as PrintIcon } from '@mui/icons-material';
import moment from 'moment';

const EmployeePreview = ({ employeeDetails, handleClose, open, Backdrop }) => {
    const educationalDetails = employeeDetails?.educationList || [];
    console.log(educationalDetails, 'sai');

    const hasEducationalDetails = () => {
        return Array.isArray(educationalDetails) && educationalDetails.length > 0;
    };

    const handlePrint = async () => {
        try {
            const printContent = document.getElementById('printableArea').innerHTML;

            // Create a new window for printing
            const printWindow = window.open('', '_blank', 'width=800,height=600');
            const styles = Array.from(document.styleSheets)
                .map((styleSheet) => {
                    try {
                        return Array.from(styleSheet.cssRules)
                            .map((rule) => rule.cssText)
                            .join('\n');
                    } catch (e) {
                        console.warn(`Unable to access stylesheet: ${styleSheet.href}`, e);
                        return '';
                    }
                })
                .join('\n');

            printWindow.document.open();
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Employee Preview</title>
                        <style>
                            ${styles} /* Include all existing styles */
                        </style>
                    </head>
                    <body>
                        ${printContent}
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();

            // Close the print window after printing
            printWindow.close();
        } catch (error) {
            console.error('An error occurred during printing:', error);
        }
    };

    const formatDate = (date) => {
        return date ? moment(date).format('MM/DD/YYYY') : '-';
    };
    // Add a safety check for the component render
    if (!employeeDetails) {
        return (
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth='md'
                fullWidth
                BackdropComponent={Backdrop}
            >
                <DialogContent>
                    <Typography>Loading employee details...</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color='primary'>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth='md'
            fullWidth
            BackdropComponent={Backdrop}
        >
            <DialogTitle>
                <Typography variant='h6'>Employee Preview Page</Typography>
            </DialogTitle>

            <DialogContent>
                <div id='printableArea'>
                    <Paper elevation={0} sx={{ p: 2 }}>
                        <Grid container spacing={3}>
                            {/* Personal Information */}
                            <Grid item xs={12}>
                                <Typography variant='h6' gutterBottom color='primary'>
                                    Personal Information
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            Full Name:
                                        </Typography>
                                        <Typography>{employeeDetails?.fullname || '-'}</Typography>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            Personal Email:
                                        </Typography>
                                        <Typography>{employeeDetails?.email || '-'}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            Phone:
                                        </Typography>
                                        <Typography>{employeeDetails?.phone || '-'}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            Date of Birth:
                                        </Typography>
                                        <Typography>
                                            {formatDate(employeeDetails?.employeeDateOfBirth)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            Gender:
                                        </Typography>
                                        <Typography>{employeeDetails?.gender || '-'}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            Blood Group:
                                        </Typography>
                                        <Typography>
                                            {employeeDetails?.bloodGroup || '-'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            Aadhar Number:
                                        </Typography>
                                        <Typography>
                                            {employeeDetails?.aadharNumber || '-'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            Name As Per Aadhar:
                                        </Typography>
                                        <Typography>
                                            {employeeDetails?.nameAsPerAadhar || '-'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            Pan Number:
                                        </Typography>
                                        <Typography>{employeeDetails?.panNumber || '-'}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                <Divider />
                            </Grid>

                            {/* Employment Details */}
                            <Grid item xs={12}>
                                <Typography variant='h6' gutterBottom color='primary'>
                                    Employment Information
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            Employee ID:
                                        </Typography>
                                        <Typography>
                                            {employeeDetails?.employeeid || '-'}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            Department:
                                        </Typography>
                                        <Typography>
                                            {employeeDetails?.department || '-'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            Designation:
                                        </Typography>
                                        <Typography>
                                            {employeeDetails?.designation || '-'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            Join Date:
                                        </Typography>
                                        <Typography>
                                            {formatDate(employeeDetails?.joiningdate)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            Work Email:
                                        </Typography>
                                        <Typography>{employeeDetails?.workEmail || '-'}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            Employee Type:
                                        </Typography>
                                        <Typography>
                                            {employeeDetails?.employeeType || '-'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            Employee Status:
                                        </Typography>
                                        <Typography>
                                            {employeeDetails?.employeeStatus || '-'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            Projects:
                                        </Typography>
                                        <Typography>{employeeDetails?.projects || '-'}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            Company:
                                        </Typography>
                                        <Typography>{employeeDetails?.company || '-'}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            Role:
                                        </Typography>
                                        <Typography>{employeeDetails?.role || '-'}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            Work Location:
                                        </Typography>
                                        <Typography>
                                            {employeeDetails?.workLocationName || '-'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            Manager:
                                        </Typography>
                                        <Typography>{employeeDetails?.manager || '-'}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            Reference:
                                        </Typography>
                                        <Typography>{employeeDetails?.reference || '-'}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            Date Of Exit:
                                        </Typography>
                                        <Typography>
                                            {employeeDetails?.dateOfExit || '-'}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                <Divider />
                            </Grid>

                            {/* Experience Details */}
                            {employeeDetails?.hasExperience && (
                                <Grid item xs={12}>
                                    <Typography variant='h6' gutterBottom color='primary'>
                                        Experience Details
                                    </Typography>
                                    {employeeDetails.employeeExperience?.map((exp, index) => (
                                        <Grid container spacing={2} key={index}>
                                            <Grid item xs={6}>
                                                <Typography
                                                    variant='subtitle1'
                                                    color='textSecondary'
                                                >
                                                    Previous Company:
                                                </Typography>
                                                <Typography>
                                                    {exp.previousCompany || '-'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography
                                                    variant='subtitle1'
                                                    color='textSecondary'
                                                >
                                                    Experienced Designation:
                                                </Typography>
                                                <Typography>
                                                    {exp.experienceDesignation || '-'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography
                                                    variant='subtitle1'
                                                    color='textSecondary'
                                                >
                                                    Reporting Manager:
                                                </Typography>
                                                <Typography>
                                                    {exp.reportingManager || '-'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography
                                                    variant='subtitle1'
                                                    color='textSecondary'
                                                >
                                                    Start Date:
                                                </Typography>
                                                <Typography>{formatDate(exp.startDate)}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography
                                                    variant='subtitle1'
                                                    color='textSecondary'
                                                >
                                                    End Date:
                                                </Typography>
                                                <Typography>{formatDate(exp.endDate)}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography
                                                    variant='subtitle1'
                                                    color='textSecondary'
                                                >
                                                    UAN Number:
                                                </Typography>
                                                <Typography>{exp.uanNumber}</Typography>
                                            </Grid>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}

                            {/* Fresher Information */}
                            {!employeeDetails?.hasExperience && (
                                <Grid item xs={12}>
                                    <Typography variant='h6' gutterBottom color='primary'>
                                        Fresher Details
                                    </Typography>
                                    <Typography>Employee is a fresher</Typography>
                                </Grid>
                            )}

                            <Grid item xs={12}>
                                <Divider />
                            </Grid>

                            {/* Educational Details */}
                            <Grid item xs={12}>
                                <Typography variant='h6' gutterBottom color='primary'>
                                    Educational Details
                                </Typography>
                                {hasEducationalDetails() ? (
                                    <Grid container spacing={2}>
                                        {educationalDetails.map((edu, index) => (
                                            <React.Fragment key={index}>
                                                {index > 0 && (
                                                    <Grid item xs={12}>
                                                        <Divider sx={{ my: 2 }} />
                                                    </Grid>
                                                )}
                                                <Grid item xs={6}>
                                                    <Typography
                                                        variant='subtitle1'
                                                        color='textSecondary'
                                                    >
                                                        Education:
                                                    </Typography>
                                                    <Typography>{edu?.education || '-'}</Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography
                                                        variant='subtitle1'
                                                        color='textSecondary'
                                                    >
                                                        Institution:
                                                    </Typography>
                                                    <Typography>
                                                        {edu?.institution || '-'}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography
                                                        variant='subtitle1'
                                                        color='textSecondary'
                                                    >
                                                        Specification:
                                                    </Typography>
                                                    <Typography>
                                                        {edu?.specification || '-'}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography
                                                        variant='subtitle1'
                                                        color='textSecondary'
                                                    >
                                                        Start Year:
                                                    </Typography>
                                                    <Typography>
                                                        {formatDate(edu?.eduStartYear)}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography
                                                        variant='subtitle1'
                                                        color='textSecondary'
                                                    >
                                                        End Year:
                                                    </Typography>
                                                    <Typography>
                                                        {formatDate(edu?.eduEndYear)}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography
                                                        variant='subtitle1'
                                                        color='textSecondary'
                                                    >
                                                        GPA:
                                                    </Typography>
                                                    <Typography>{edu?.gpa || '-'}</Typography>
                                                </Grid>
                                            </React.Fragment>
                                        ))}
                                    </Grid>
                                ) : (
                                    <Typography>No educational details available.</Typography>
                                )}
                            </Grid>

                            <Grid item xs={12}>
                                <Divider />
                            </Grid>
                            {/* Contact Information */}
                            <Grid item xs={12}>
                                <Typography variant='h6' gutterBottom color='primary'>
                                    Contact Information
                                </Typography>
                                <Grid container spacing={2}>
                                    {/* Country */}
                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            Country:
                                        </Typography>
                                        <Typography>{employeeDetails?.country || '-'}</Typography>
                                    </Grid>

                                    {/* State */}
                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            State:
                                        </Typography>
                                        <Typography>{employeeDetails?.state || '-'}</Typography>
                                    </Grid>

                                    {/* City */}
                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            City:
                                        </Typography>
                                        <Typography>{employeeDetails?.city || '-'}</Typography>
                                    </Grid>

                                    {/* Zipcode */}
                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            Zipcode:
                                        </Typography>
                                        <Typography>{employeeDetails?.zipcode || '-'}</Typography>
                                    </Grid>

                                    {/* Address */}
                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            Address:
                                        </Typography>
                                        <Typography>{employeeDetails?.address || '-'}</Typography>
                                    </Grid>

                                    {/* Permanent Address */}
                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            Permanent Address:
                                        </Typography>
                                        <Typography>
                                            {employeeDetails?.permanentAddress || '-'}
                                        </Typography>
                                    </Grid>

                                    {/* Emergency Contact */}
                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            Emergency Contact:
                                        </Typography>
                                        <Typography>
                                            {employeeDetails?.emergencyContactNumber || '-'}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Divider */}
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>

                            {/* Bank Details */}
                            <Grid item xs={12}>
                                <Typography variant='h6' gutterBottom color='primary'>
                                    Bank Details
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            Bank Name:
                                        </Typography>
                                        <Typography>{employeeDetails?.bankName || '-'}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            Account Number:
                                        </Typography>
                                        <Typography>
                                            {employeeDetails?.accountNumber || '-'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            IFSC Code:
                                        </Typography>
                                        <Typography>{employeeDetails?.ifscCode || '-'}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Divider */}
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>

                            {/* Family Information */}
                            <Grid item xs={12}>
                                <Typography variant='h6' gutterBottom color='primary'>
                                    Family Information
                                </Typography>
                                <Grid container spacing={2}>
                                    {/* Father's Name */}
                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            Father's Name:
                                        </Typography>
                                        <Typography>
                                            {employeeDetails?.fathername || '-'}
                                        </Typography>
                                    </Grid>

                                    {/* Mother's Name */}
                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            Mother's Name:
                                        </Typography>
                                        <Typography>
                                            {employeeDetails?.mothername || '-'}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            Contact Number:
                                        </Typography>
                                        <Typography>
                                            {employeeDetails?.contactNumber || '-'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant='subtitle1' color='textSecondary'>
                                            Marital Status:
                                        </Typography>
                                        <Typography>
                                            {employeeDetails?.maritalStatus || '-'}
                                        </Typography>
                                    </Grid>

                                    {/* Spouse Information */}
                                    {employeeDetails?.maritalStatus === 'Married' && (
                                        <>
                                            <Grid item xs={6}>
                                                <Typography
                                                    variant='subtitle1'
                                                    color='textSecondary'
                                                >
                                                    Spouse Name:
                                                </Typography>
                                                <Typography>
                                                    {employeeDetails?.spouseName || '-'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography
                                                    variant='subtitle1'
                                                    color='textSecondary'
                                                >
                                                    Spouse Aadhar Number:
                                                </Typography>
                                                <Typography>
                                                    {employeeDetails?.spouseAadharNumber || '-'}
                                                </Typography>
                                            </Grid>
                                        </>
                                    )}

                                    {/* Children Details */}
                                    {employeeDetails?.childrenDetails?.length > 0 && (
                                        <Grid item xs={12}>
                                            <Typography variant='subtitle1' color='textSecondary'>
                                                Children Details:
                                            </Typography>
                                            {employeeDetails.childrenDetails.map((child, index) => (
                                                <Grid
                                                    container
                                                    spacing={2}
                                                    key={index}
                                                    style={{ marginBottom: '1rem' }}
                                                >
                                                    <Grid item xs={6}>
                                                        <Typography
                                                            variant='subtitle2'
                                                            color='textSecondary'
                                                        >
                                                            Name:
                                                        </Typography>
                                                        <Typography>
                                                            {child.kidName || '-'}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Typography
                                                            variant='subtitle2'
                                                            color='textSecondary'
                                                        >
                                                            Gender:
                                                        </Typography>
                                                        <Typography>
                                                            {child.kidGender || '-'}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Typography
                                                            variant='subtitle2'
                                                            color='textSecondary'
                                                        >
                                                            Date of Birth:
                                                        </Typography>
                                                        <Typography>
                                                            {child.kidDob || '-'}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                </div>
            </DialogContent>

            <DialogActions>
                <Button
                    startIcon={<PrintIcon />}
                    onClick={handlePrint}
                    variant='contained'
                    color='primary'
                >
                    Print
                </Button>
                <Button onClick={handleClose} color='primary'>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EmployeePreview;
