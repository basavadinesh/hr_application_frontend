import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Tooltip
} from '@mui/material';
import { styled } from '@mui/system';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

// Define pastel colors for card backgrounds and text
const pastelColors = {
    blue: '#AEDFF7',
    black: '#000',
    white: '#ffffff'
};

// Define colors for skill levels
const skillLevelColors = {
    Beginner: '#FFB6C1', // Light Pink
    Intermediate: '#FFD700', // Gold
    Competent: '#90EE90', // Light Green
    Proficient: '#87CEFA', // Light Sky Blue
    Expert: '#8A2BE2' // Blue Violet
};

// Define styles for property labels
const propertyStyles = (color) => ({
    fontWeight: 'bold',
    color: color,
    width: '150px',
    fontSize: '18px', // Adjust the size as needed
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    whiteSpace: 'nowrap'
});

// Define styles for the card component
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

// Styled component for a scrollable list with a custom scrollbar
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

// Main component for displaying the list of skills
const SkillsListCard = ({ skillsDetails, onSelectSkill }) => {
    // State to manage the currently selected skill
    const [selectedSkill, setSelectedSkill] = useState(null);

    // Effect to select the first skill on initial render
    useEffect(() => {
        if (skillsDetails.length > 0) {
            setSelectedSkill(skillsDetails[0]);
        }
    }, [skillsDetails]);

    // Handler to select a skill and notify the parent component
    const handleSelectSkill = (skill) => {
        setSelectedSkill(skill);
        onSelectSkill(skill);
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
                    Skills List
                </Typography>
                <ScrollableList>
                    {skillsDetails && skillsDetails.length > 0 ? (
                        skillsDetails.map((skill) => (
                            <ListItem key={skill.id} disablePadding selected={skill === selectedSkill}>
                                <ListItemButton
                                    onClick={() => handleSelectSkill(skill)}
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
                                                <span>{skill.skill}</span>
                                                <WorkspacePremiumIcon
                                                    sx={{
                                                        color: skillLevelColors[skill.level_type],
                                                        marginLeft: '10px'
                                                    }}
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
                                                {skill.level_type}
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
                            You have not added skills details or no skills information available.
                        </Typography>
                    )}
                </ScrollableList>
            </CardContent>
        </Card>
    );
};

// Component to display detailed information about a selected skill
export const SkillsInformationCard = ({ selectedSkill }) => {
    if (!selectedSkill) {
        return null; // Return null if no skill is selected
    }

    return (
        <Card
            variant='outlined'
            sx={{ ...cardStyles(pastelColors.blue), minWidth: '500px', margin: '6px auto' }}
        >
            <CardContent sx={{ padding: '20px' }}>
                <Typography variant='h5' gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                    Skill Details
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '10px'
                    }}
                >
                    <WorkspacePremiumIcon
                        sx={{
                            color: skillLevelColors[selectedSkill.level_type],
                            width: 60,
                            height: 60,
                            marginBottom: '20px'
                        }}
                    />
                    <Typography
                        variant='body1'
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingBottom: '11px',
                            width: '100%'
                        }}
                    >
                        <span style={propertyStyles(pastelColors.black)}>Skill:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '20px'
                            }}
                        >
                            {selectedSkill.skill}
                        </Typography>
                    </Typography>
                    <Typography
                        variant='body1'
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingBottom: '11px',
                            width: '100%'
                        }}
                    >
                        <span style={propertyStyles(pastelColors.black)}>Level:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '20px'
                            }}
                        >
                            {selectedSkill.level_type}
                        </Typography>
                    </Typography>
                    <Typography
                        variant='body1'
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingBottom: '11px',
                            width: '100%'
                        }}
                    >
                        <span style={propertyStyles(pastelColors.black)}>Approved Status:</span>
                        <Typography
                            variant='body1'
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '20px'
                            }}
                        >
                            {selectedSkill.status}
                        </Typography>
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '' }}>
                    <Tooltip
                        title={
                            <Box>
                                {Object.keys(skillLevelColors).map((level) => (
                                    <Typography key={level} variant='body2' sx={{ display: 'flex', alignItems: 'center' }}>
                                        <WorkspacePremiumIcon sx={{ color: skillLevelColors[level], marginRight: '8px' }} />
                                        {level}
                                    </Typography>
                                ))}
                            </Box>
                        }
                    >
                        <HelpOutlineIcon sx={{ cursor: 'pointer' }} />
                    </Tooltip>
                </Box>
            </CardContent>
        </Card>
    );
};

// Export the SkillsListCard as default
export default SkillsListCard;
