import React, { useState, useEffect ,useRef} from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Grid,
    CircularProgress,
    List,
    ListItem,
    ListItemButton,
    ListItemText
} from '@mui/material';
import { Chip } from '@mui/material';
import { styled } from '@mui/system';


// Styles for the card component    
const cardStyles = (backgroundColor) => ({
    borderWidth: 2,
    borderStyle: 'solid',
    boxShadow: 3,
    borderRadius: 2,
    borderColor: backgroundColor,
    backgroundColor: `${backgroundColor}20`,
    padding: '12px',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    width: '100%',
    maxWidth: '100%'
});

// Pastel colors used for styling  
const pastelColors = {
    blue: '#AEDFF7',
    black: '#000',
    white: '#ffffff'
};


// Styled List component with scrollable area
const ScrollableList = styled(List)({
    maxHeight: '250px', // Set a height for the scrollable area
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
        width: '8px',
    },
    '&::-webkit-scrollbar-track': {
        background: '#f1f1f1',
    },
    '&::-webkit-scrollbar-thumb': {
        background: '#888',
        borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
        background: '#555',
    },
});


// Component to display upcoming leaves
export const UpcomingLeaves = ({
    leaveCounts,
    upcomingLeaves,
}) => {
    // Leave types and their corresponding colors
    const leaveTypes = [
        { type: 'SickLeave', taken: leaveCounts.sick, color: '#5072A7' },
        { type: 'Lop', taken: leaveCounts.lop, color: '#0039a6' },
        { type: 'Casual', taken: leaveCounts.casual, color: '#13274F' }
    ];

    return (
        <Card variant='outlined' sx={{ ...cardStyles(pastelColors.blue), minHeight: '340px', maxHeight: '340px' }}>
            <CardContent>
                <Typography variant='h6' component='div' gutterBottom>
                    Upcoming Leaves
                </Typography>
                {upcomingLeaves.length > 0 ? (
                    <ScrollableList>
                        {upcomingLeaves.map((leave, index) => (
                            <ListItem key={index}>
                                <ListItemText
                                    primary={
                                        <Box>
                                            <Typography variant='body2' sx={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px' }}>
                                                From: {leave.from_date} - To: {leave.to_date}
                                                <Chip
                                                    label={leave.status}
                                                    color={getStatusColor(leave.status)}
                                                    size='small'
                                                />
                                            </Typography>
                                            <Typography variant='body2' sx={{ paddingBottom: '4px' }}>Type: {leave.leave_type}</Typography>
                                            <Typography variant='body2' sx={{ paddingBottom: '4px' }}>Description: {leave.description}</Typography>
                                            <Typography variant='body2' sx={{ paddingBottom: '4px' }}>No. of Days: {leave.no_of_days}</Typography>
                                            {leave?.rejectreason && (
                                                <Typography variant='body2' sx={{ paddingBottom: '4px' }}>
                                                    Reject Reason: {leave?.rejectreason}
                                                </Typography>
                                            )}
                                        </Box>
                                    }
                                />
                            </ListItem>
                        ))}
                    </ScrollableList>
                ) : (
                    <Box sx={{ textAlign: 'center', marginTop: '70px' }}>
                        <Typography variant='h6' sx={{ color: 'black' }}>
                            "You have no upcoming leaves"
                        </Typography>
                        <Typography variant='body1' sx={{ color: 'gray', marginTop: '10px' }}>
                            {"You have taken "}
                            {leaveTypes.map((leaveType, index) => (
                                <React.Fragment key={index}>
                                    <span
                                        style={{
                                            width: '10px',
                                            height: '10px',
                                            backgroundColor: leaveType.color,
                                            display: 'inline-block',
                                            marginRight: '5px',
                                            marginBottom: '2px',
                                            borderRadius: '2px'
                                        }}
                                    ></span>
                                    {leaveType.taken} {leaveType.type.toLowerCase()} leaves
                                    {index < leaveTypes.length - 1 ? ',' : '.'}
                                </React.Fragment>
                            ))}
                            {" so far."}
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

// Component to display leave metrics
export const LeaveMetrics = ({
    leaveCounts,
   leaveAllowances
}) => {
    // Leave types and their corresponding colors
    console.log("leaveAllowances",leaveAllowances);
    const leaveTypes = [
        { type: 'Sick', total: leaveAllowances.totalSickLeaves, color: '#5072A7' },
        { type: 'Lop', total:leaveAllowances.totalLopLeaves, color: '#0039a6' },
        { type: 'Casual', total: leaveAllowances.totalCasualLeaves, color: '#13274F' }
    ];
    const totalHolidaysThisYear = 30;

    const [animationStart, setAnimationStart] = useState(false);

    // Start animation on component mount
    useEffect(() => {
        setAnimationStart(true);
    }, []);

    return (
        <Card variant='outlined' sx={cardStyles(pastelColors.blue)}>
            <CardContent>
                <Typography
                    variant='h6'
                    component='div'
                    gutterBottom
                    sx={{ paddingBottom: '20px', display: 'flex', justifyContent: 'space-between' }}
                >
                    Available Leaves
                    <Typography
                        variant='body1'
                        component='div'
                        sx={{ fontWeight: 'bold', color: '#666' }}
                    >
                        Year-2024
                    </Typography>
                </Typography>
                <Grid container spacing={2}>
                    {leaveTypes.map((leaveType, index) => {
                        const takenLeaves = leaveCounts[leaveType.type.toLowerCase()] || 0;
                        const remainingLeaves = leaveType.total - takenLeaves;
                        const percentage = (remainingLeaves / leaveType.total) * 100;

                        return (
                            <Grid item xs={12} sm={4} key={index}>
                                <Box sx={{ position: 'relative', textAlign: 'center' }}>
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            width: '120px',
                                            height: '120px',
                                            margin: '0 auto'
                                        }}
                                    >
                                        <CircularProgress
                                            variant='determinate'
                                            value={animationStart ? percentage : 0}
                                            size={120}
                                            thickness={8}
                                            sx={{
                                                color: leaveType.color,
                                                animationDuration: animationStart ? '1s' : '0s',
                                                transition: 'none'
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                width: '100%',
                                                textAlign: 'center'
                                            }}
                                        >
                                            <Typography
                                                variant='body2'
                                                component='div'
                                                sx={{
                                                    color: 'black',
                                                    fontSize: '16px'
                                                }}
                                            >
                                                {`${remainingLeaves} / ${leaveType.total}`}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Typography
                                        variant='body2'
                                        sx={{
                                            fontWeight: 'bold',
                                            fontSize: '1rem',
                                            color: 'black',
                                            marginTop: '8px'
                                        }}
                                    >
                                        {leaveType.type}
                                    </Typography>
                                </Box>
                            </Grid>
                        );
                    })}
                    <Grid item xs={12}>
                        <Typography
                            variant='body2'
                            sx={{ color: 'black', textAlign: 'center', marginTop: '20px' }}
                        >
                            Total number of holidays this year: {totalHolidaysThisYear}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

//1


// Styled component for a custom scrollable list
const CustomScrollableList = styled('div')({
    maxHeight: '250px',
    minHeight: '100px', // Set a max height for the scrollable area
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
        width: '8px',
    },
    '&::-webkit-scrollbar-track': {
        background: '#f1f1f1',
    },
    '&::-webkit-scrollbar-thumb': {
        background: '#888',
        borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
        background: '#555',
    },
});

// Utility function to get the status color for the Chip component
const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
        case 'approved':
            return 'success';
        case 'rejected':
            return 'error';
        case 'pending':
            return 'warning';
        default:
            return 'default';
    }
};



// Component to display leave history
export const LeaveHistory = ({ leaveData, onSelectLeave }) => {
    const currentDate = new Date();
    const listRef = useRef(null); // Ref to the scrollable list
    console.log("leave history", leaveData);
    // State to track the selected leave
    const [selectedLeave, setSelectedLeave] = useState(null);

    // Filter past leaves based on current date
    const pastLeaves = leaveData.filter((leave) => {
        const leaveStartDate = new Date(leave.from_date);
        return leaveStartDate < currentDate;
    });

    // Effect to scroll to the bottom of the list on initial render or when pastLeaves changes
    useEffect(() => {
        if (pastLeaves.length > 0) {
            setSelectedLeave(pastLeaves[pastLeaves.length-1]);
        }
    
    }, []);

    // Effect to handle scrolling
    useEffect(() => {
       
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    
    }, []);

    // Function to handle selection of leave
    const handleSelectLeave = (leave) => {
        setSelectedLeave(leave); 
        onSelectLeave(leave);
    };

    return (
        <Card variant='outlined' sx={{ ...cardStyles(pastelColors.blue), minHeight: '395px', maxHeight: '395px' }}>
            <CardContent>
                <Typography variant='h6' component='div' gutterBottom>
                    Leave History
                </Typography>
                {pastLeaves.length === 0 ? (
                    <Typography variant='body1' sx={{ textAlign: 'center', paddingTop: '79px' }}>
                        No leave history found
                    </Typography>
                ) : (
                    <CustomScrollableList ref={listRef}>
                        {pastLeaves.map((leave, index) => (
                            <ListItem
                                disablePadding
                                key={index}
                                selected={leave === selectedLeave} // Condition to highlight selected leave
                            >
                                <ListItemButton onClick={() => handleSelectLeave(leave)}>
                                    <ListItemText
                                        primary={
                                            <React.Fragment>
                                                <Typography
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        marginBottom: '8px',
                                                        fontSize: '16px'
                                                    }}
                                                >
                                                    <span>{leave.leave_type}</span>
                                                    <Chip
                                                        label={leave.status}
                                                        color={getStatusColor(leave.status)}
                                                        size='small'
                                                        sx={{ marginLeft: '8px' }}
                                                    />
                                                </Typography>
                                            </React.Fragment>
                                        }
                                        secondary={
                                            <Typography
                                                sx={{
                                                    marginBottom: '8px',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                From: {leave.from_date} - To: {leave.to_date}
                                            </Typography>
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </CustomScrollableList>
                )}
            </CardContent>
        </Card>
    );
};

// Styles for the leave history details card
const propertyStyles = (color) => ({
    fontWeight: 'bold',
    color: color,
    width: '150px',
    fontSize: '18px', // Adjust the size as needed
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    whiteSpace: 'nowrap'
});


// Component to display details of the selected leave
export const LeaveHistoryDetails = ({ selectedData ,initialRender}) => {
    console.log('Selected Leave', selectedData);
    if (!selectedData) {
        return (
            <Card variant='outlined' sx={{ ...cardStyles(pastelColors.blue), minHeight: '395px', maxHeight: '395px' }}>
                <CardContent>
                    <Typography variant='h6' component='div' gutterBottom>
                    {initialRender ? 'Recent Leave Details' : 'Leave Details'}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        
                        <Typography variant='body1' sx={{ textAlign: 'center', paddingTop: '80px' }}>
                            Select a leave history item
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    // Render details of the selected leave if available
    return (
        <Card variant='outlined' sx={{ ...cardStyles(pastelColors.blue), minHeight: '395px', maxHeight: '395px' }}>
            <CardContent>
                <Typography variant='h6' component='div' gutterBottom>
                {initialRender ? 'Recent Leave Details' : 'Leave Details'}
                </Typography>
                <Box sx={{ padding: '10px' }}>
                    <Typography
                        variant='body1'
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingBottom: '11px'
                        }}
                    >
                        <span style={propertyStyles(pastelColors.black)}>Leave Type:</span>
                        <Typography
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '80px'
                            }}
                            variant='body1'
                        >
                            {selectedData.leave_type}
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
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '80px'
                            }}
                            variant='body1'
                        >
                            {selectedData.description}
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
                        <span style={propertyStyles(pastelColors.black)}>From Date:</span>
                        <Typography
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '80px'
                            }}
                            variant='body1'
                        >
                            {selectedData.from_date}
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
                        <span style={propertyStyles(pastelColors.black)}>To Date:</span>
                        <Typography
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '80px'
                            }}
                            variant='body1'
                        >
                            {selectedData.to_date}
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
                        <span style={propertyStyles(pastelColors.black)}>Number of Days:</span>
                        <Typography
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '80px'
                            }}
                            variant='body1'
                        >
                            {selectedData.no_of_days}
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
                            sx={{
                                marginRight: 'auto',
                                marginLeft: '80px'
                            }}
                            variant='body1'
                        >
                            {selectedData.status}
                        </Typography>
                    </Typography>
                    {selectedData.status.toLowerCase() === 'rejected' && (
                        <Typography
                            variant='body1'
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                paddingBottom: '11px'
                            }}
                        >
                            <span style={propertyStyles(pastelColors.black)}>Reject Reason:</span>
                            <Typography
                                sx={{
                                    marginRight: 'auto',
                                    marginLeft: '80px'
                                }}
                                variant='body1'
                            >
                                {selectedData.rejectreason}
                            </Typography>
                        </Typography>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};