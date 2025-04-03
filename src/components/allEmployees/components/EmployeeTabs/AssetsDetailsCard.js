// Imports for React library and hooks
import React, { useState, useEffect } from 'react';

// Imports for material ui for pre-designed components
import {
    Card,
    CardContent,
    Typography,
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Divider,
   
} from '@mui/material';
import { styled } from '@mui/system';
import { Stepper, Step } from '@mui/material';
import { StepLabel } from '@mui/material';


// Custome stying and status display constants
const statusMap = {
    Initiated: 0,
    Pending: 1,
    Approved: 2,
    Delivered: 3
};

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

// Pre-defined steps in assets delivery process
const steps = ['Initiated', 'Pending', 'Approved', 'Delivered'];


// List Card to display the list of Assets
const AssetsListCard = ({ assetDetails, onSelectAsset }) => {
    
    // Initial state of the selected asset
    const [selectedAsset, setSelectedAsset] = useState(null);

    // useEffect hook call set the selected asset as the latest item in the list
    useEffect(() => {
        if (assetDetails.length > 0) {
            setSelectedAsset(assetDetails[0]);
        }
    }, []);

    // Handler function to view the details of the selected asset
    const handleSelectedAsset = (education) => {
        setSelectedAsset(education);
        onSelectAsset(education);
    };

   
    // JSX for displaying assets list
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
                    Assets List
                </Typography>
                <List>
                    <ScrollableList>
                        {assetDetails && assetDetails.length > 0 ? (assetDetails.map((asset, index) => (
                            <React.Fragment key={asset.id}>
                                <ListItem disablePadding selected={asset === selectedAsset}>
                                    <ListItemButton
                                        onClick={() => handleSelectedAsset(asset)}
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': { backgroundColor: '#f0f0f0' }
                                        }}
                                    >
                                        <ListItemText
                                            primary={
                                               
                                                    <Typography
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            marginBottom: '8px',
                                                            fontSize: '20px',
                                                        }}
                                                    >
                                                        {asset.asset_type} - {asset.make}
                                                    </Typography>
                                                  
                                        
                                                
                                            }
                                            secondary={
                                                <Box sx={{ width: '100%', marginTop: '20px' }}>
                                                    <Stepper
                                                        activeStep={statusMap[asset.status]}
                                                        alternativeLabel
                                                        sx={{ transform: 'scale(0.85)' }}
                                                    >
                                                        {steps.map((label) => (
                                                            <Step key={label}>
                                                                <StepLabel>{label}</StepLabel>
                                                            </Step>
                                                        ))}
                                                    </Stepper>
                                                   
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'flex-end',
                                                            alignItems: 'center',
                                                            marginTop: '15px',
                                                        }}
                                                    >
                                                   
                                                    </Box>
                                                </Box>
                                                
                                            }
                                        />
                                    </ListItemButton>
                                </ListItem>
                                {index < assetDetails.length - 1 && (
                                    <Divider sx={{ backgroundColor: '#888888' }} />
                                )}
                            </React.Fragment>
                        ))) : (
                <Typography variant="body1" sx={{ textAlign: 'center', marginTop: '20px' }}>
                  No Assets details available.
                </Typography>
              )}
                    </ScrollableList>
                </List>
            </CardContent>
        </Card>
    );
};

export default AssetsListCard;


// Information Card to display the details of the selected asset
export const AssetsInformationCard = ({ selectedAsset }) => {

    // Return nothing if there is any empty list
    if (!selectedAsset) {
        return null;
    }

    // Function definition to calculate the days left till warranty
    const calculateDaysLeft = (warrantyDate) => {
        const today = new Date();
        const endDate = new Date(warrantyDate);
        const timeDiff = endDate - today;
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        return daysLeft;
    };

    //JSX for displaying Information
    return (
        <Card
            variant='outlined'
            sx={{ ...cardStyles(pastelColors.blue), maxWidth: '800px', marginLeft: '40px' }}
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
                        Asset Details
                    </Typography>
                </Box>
                <Box
                    sx={{
                        width: '90%',
                        // border: '1px solid #e0e0e0',
                        borderRadius: '5px',
                        padding: '10px',
                        marginTop: '10px',
                        marginLeft: '' // Adjust margin as needed
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
                        <span style={propertyStyles(pastelColors.black)}>Invoice Number:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedAsset.invoice_number}
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
                        <span style={propertyStyles(pastelColors.black)}>Warranty Date:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedAsset.warranty_date}
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
                        <span style={propertyStyles(pastelColors.black)}>Warranty Expires in:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {`${calculateDaysLeft(
                                                            selectedAsset.warranty_date
                                                        )} days `}
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
                        <span style={propertyStyles(pastelColors.black)}>Invoice Date:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedAsset.invoice_date}
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
                        <span style={propertyStyles(pastelColors.black)}>Asset Type:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedAsset.asset_type}
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
                        <span style={propertyStyles(pastelColors.black)}>Make:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedAsset.make}
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
                        <span style={propertyStyles(pastelColors.black)}>Quantity:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedAsset.quantity}
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
                        <span style={propertyStyles(pastelColors.black)}>Serial Number:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedAsset.serial_number}
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
                        <span style={propertyStyles(pastelColors.black)}>RAM:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedAsset.ram}
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
                        <span style={propertyStyles(pastelColors.black)}>Processor:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedAsset.processor}
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
                        <span style={propertyStyles(pastelColors.black)}>Hard Disk Size:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedAsset.hard_disk_size}
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
                        <span style={propertyStyles(pastelColors.black)}>Hard Disk Type:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedAsset.hard_disk_type}
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
                            Amount or Invoice Wise :
                        </span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedAsset.amount_or_invoice_wise}
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
                        <span style={propertyStyles(pastelColors.black)}>Asset Approved At:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedAsset.asset_approved_at}
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
                        <span style={propertyStyles(pastelColors.black)}>Asset Given At:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedAsset.asset_given_at}
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
                        <span style={propertyStyles(pastelColors.black)}>Asset Return At:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedAsset.asset_return_at}
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
                        <span style={propertyStyles(pastelColors.black)}>Asignee Comment:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedAsset.assignee_comment}
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
                        <span style={propertyStyles(pastelColors.black)}>Return Comment:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedAsset.return_comment}
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
                        <span style={propertyStyles(pastelColors.black)}>Delivered To:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedAsset.delivered_to}
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
                        <span style={propertyStyles(pastelColors.black)}>Department:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedAsset.department}
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
                        <span style={propertyStyles(pastelColors.black)}>Project:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedAsset.project}
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
                            Hand Over Type/Courier Num:
                        </span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedAsset.handovered_type}
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
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedAsset.emp_code}
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
                        <span style={propertyStyles(pastelColors.black)}>Remarks:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '200px'
                            }}
                        >
                            {selectedAsset.remarks}
                        </Typography>
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};
