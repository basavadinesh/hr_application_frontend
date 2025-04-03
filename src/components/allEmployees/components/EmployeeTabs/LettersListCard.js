// Imports for React library and hooks
import React, { useState, useEffect } from 'react';
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
import { OfferLetterDetailsCard } from './LetterDetailsCards/OfferLetterDetailsCard';
import { AppointmentLetterDetailsCard } from './LetterDetailsCards/AppointmentLetterDetailsCard';
import { HikeLetterDetailsCard } from './LetterDetailsCards/HikeLetterDetailsCard';
import { RelievingExperienceLetterDetailsCard } from './LetterDetailsCards/RelievingExperienceLetterDetailsCard';

// Custom styling settings for the cards
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

// Automatically set the first letter as selected when lettersDetails changes
// useEffect(() => {
//     if (lettersDetails.length > 0) {
//         setSelectedLetter(lettersDetails[0]);
//         onSelectLetter(lettersDetails[0]);
//     }
// }, [lettersDetails]);

// const handleSelectLetter = (letter) => {
//     setSelectedLetter(letter);

// };

// JSX to display the list of letters

// LettersListCard component to display a list of letters
const LettersListCard = ({ onSelectLetter }) => {
    const existingLetters = [
        'Offer Letter',
        'Appointment Letter',
        'Hike Letter',
        'Relieving & Experience Letter'
    ];

    const handleSelectedLetter = (letter) => {
        onSelectLetter(letter);
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
                    Letters List
                </Typography>
                <ScrollableList>
                    <List>
                        {existingLetters.length > 0 ? (
                            existingLetters.map((letter, index) => (
                                <ListItem key={index} disablePadding>
                                    <ListItemButton
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': { backgroundColor: '#f0f0f0' }
                                        }}
                                        onClick={() => handleSelectedLetter(letter)}
                                    >
                                        <ListItemText
                                            primary={
                                                <Typography
                                                    sx={{
                                                        fontSize: '18px'
                                                    }}
                                                >
                                                    {letter}
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
                                No letters available or no details added yet.
                            </Typography>
                        )}
                    </List>
                </ScrollableList>
            </CardContent>
        </Card>
    );
};

export default LettersListCard;

export const LettersInformationCard = ({ selectedLetter, userId, employeeDetails }) => {
    const renderLetterCard = () => {
        switch (selectedLetter) {
            case 'Offer Letter':
                return <OfferLetterDetailsCard userId={userId} employeeDetails={employeeDetails} />;
            case 'Appointment Letter':
                return (
                    <AppointmentLetterDetailsCard
                        userId={userId}
                        employeeDetails={employeeDetails}
                    />
                );
            case 'Hike Letter':
                return <HikeLetterDetailsCard userId={userId} employeeDetails={employeeDetails} />;
            case 'Relieving & Experience Letter':
                return (
                    <RelievingExperienceLetterDetailsCard
                        userId={userId}
                        employeeDetails={employeeDetails}
                    />
                );
            default:
            // return <div>No letter selected.</div>;
        }
    };

    return <div>{renderLetterCard()}</div>;
};
