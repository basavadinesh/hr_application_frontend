import React, { useState, useRef, useEffect } from 'react';
import { TextField, Grid, Box, Typography, Button, Paper } from '@mui/material';
import { useDropzone } from 'react-dropzone';

const BankDetails = ({
    employeeValues,
    setEmployeeValues,
    handleChange,
    textFieldStyle,
    method,
    employeeDetails
}) => {
    const [isDragActive, setIsDragActive] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (method === 'edit' && employeeDetails?.passbookChequeDocuments) {
            setEmployeeValues((prev) => ({
                ...prev,
                passbookOrCheque: employeeDetails.passbookChequeDocuments
            }));
        } else if (!employeeValues.passbookOrCheque) {
            setEmployeeValues((prev) => ({
                ...prev,
                passbookOrCheque: []
            }));
        }
    }, [method, employeeDetails]);

    const getFileName = (file) => {
        if (file instanceof File) {
            return file.name;
        } else if (typeof file === 'string') {
            return file.split('/').pop();
        } else if (file.filename) {
            return file.filename;
        } else if (file.name) {
            return file.name;
        } else if (file.filepath) {
            return file.filepath.split('/').pop();
        }
        return 'Unknown file';
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            handleFileUpload(acceptedFiles);
        },
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png'],
            'application/pdf': ['.pdf']
        }
    });

    const handleFileUpload = (files) => {
        const uploadedFiles = Array.from(files);
        setEmployeeValues((prev) => ({
            ...prev,
            passbookOrCheque: [...(prev.passbookOrCheque || []), ...uploadedFiles]
        }));
    };

    const removeFile = (index) => {
        setEmployeeValues((prev) => ({
            ...prev,
            passbookOrCheque: prev.passbookOrCheque.filter((_, i) => i !== index)
        }));
    };

    const handleFileInputClick = () => {
        fileInputRef.current.click();
    };

    return (
        <Paper
            elevation={3}
            sx={{
                padding: '20px',
                borderRadius: '12px',
                backgroundColor: '#edf3fc',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                marginBottom: '20px'
            }}
        >
            <Typography variant='h6' sx={{ marginBottom: '16px', fontWeight: 600 }}>
                Bank Details
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={4}>
                    <TextField
                        label='Account Number'
                        name='accountNumber'
                        value={employeeValues.accountNumber || ''}
                        onChange={handleChange}
                        size='small'
                        sx={textFieldStyle}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label='IFSC Code'
                        name='ifscCode'
                        value={employeeValues.ifscCode || ''}
                        onChange={handleChange}
                        size='small'
                        sx={textFieldStyle}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label='Bank Name'
                        name='bankName'
                        value={employeeValues.bankName || ''}
                        onChange={handleChange}
                        size='small'
                        sx={textFieldStyle}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12}>
                    <Typography sx={{ marginBottom: '8px' }}>
                        Upload Files <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <div
                        {...getRootProps()}
                        style={{
                            border: '2px dashed #0056b3',
                            padding: '20px',
                            textAlign: 'center',
                            borderRadius: '8px',
                            background: isDragActive ? '#f0f8ff' : '#ffffff'
                        }}
                    >
                        <input {...getInputProps()} />
                        <Typography
                            variant='body1'
                            color='textSecondary'
                            style={{
                                textAlign: 'center',
                                color: '#0056b3',
                                marginBottom: '16px',
                                cursor: 'pointer'
                            }}
                            onClick={handleFileInputClick}
                        >
                            {isDragActive
                                ? 'Drop your Passbook/Cheque files here...'
                                : 'Drag and drop your Passbook/Cheque here, or click to select files'}
                        </Typography>

                        {employeeValues.passbookOrCheque?.length > 0 && (
                            <Box
                                style={{
                                    marginTop: '16px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px'
                                }}
                            >
                                {employeeValues.passbookOrCheque.map((file, index) => (
                                    <Box
                                        key={index}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '8px',
                                            backgroundColor: '#fff',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        <Typography
                                            variant='body2'
                                            style={{ wordBreak: 'break-all' }}
                                        >
                                            {getFileName(file)}
                                        </Typography>
                                        <Button
                                            size='small'
                                            color='error'
                                            onClick={() => removeFile(index)}
                                            style={{
                                                minWidth: '24px',
                                                padding: '0',
                                                marginLeft: '8px'
                                            }}
                                        >
                                            ✕
                                        </Button>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </div>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default BankDetails;
