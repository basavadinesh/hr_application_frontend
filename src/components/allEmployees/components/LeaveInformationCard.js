import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';

/**
 * LeaveInformationCard is a React component that displays leave information in a card format.
 * It takes in leave data and styling properties as props and displays them in a styled card.
 * 
 * @param {Object} props - The component props.
 * @param {number} props.annualLeave - The amount of annual leave available.
 * @param {number} props.sickLeave - The amount of sick leave available.
 * @param {number} props.casualLeave - The amount of casual leave available.
 * @param {number} props.maternityLeave - The amount of maternity leave available.
 * @param {Object} props.pastelColors - The pastel color theme used for styling.
 * @param {Function} props.propertyStyles - A function to generate styles for properties.
 * @param {Function} props.cardStyles - A function to generate styles for the card.
 * 
 * @returns {JSX.Element} The LeaveInformationCard component.
 */
const LeaveInformationCard = ({ annualLeave, sickLeave, casualLeave, maternityLeave, pastelColors, propertyStyles, cardStyles }) => (
    <Card variant='outlined' sx={cardStyles(pastelColors.red)}>
        <CardContent>
            <Typography variant='h5' gutterBottom>
                Leave Information
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant='body1'>
                        <span style={propertyStyles(pastelColors.red)}>Annual Leave:</span>
                        {annualLeave || '-'}
                    </Typography>
                    <Typography variant='body1'>
                        <span style={propertyStyles(pastelColors.red)}>Sick Leave:</span>
                        {sickLeave || '-'}
                    </Typography>
                    <Typography variant='body1'>
                        <span style={propertyStyles(pastelColors.red)}>Casual Leave:</span>
                        {casualLeave || '-'}
                    </Typography>
                    <Typography variant='body1'>
                        <span style={propertyStyles(pastelColors.red)}>Maternity Leave:</span>
                        {maternityLeave || '-'}
                    </Typography>
                </Grid>
            </Grid>
        </CardContent>
    </Card>
);

export default LeaveInformationCard;
