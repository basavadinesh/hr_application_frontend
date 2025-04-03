import React, { useState ,useEffect} from 'react';
import { Box } from '@mui/material';
import { LeaveHistory } from 'components/allEmployees/components/EmployeeTabs/LeavesDetailsCard';
import { LeaveHistoryDetails } from 'components/allEmployees/components/EmployeeTabs/LeavesDetailsCard';
import { UpcomingLeaves } from 'components/allEmployees/components/EmployeeTabs/LeavesDetailsCard';
import { LeaveMetrics } from 'components/allEmployees/components/EmployeeTabs/LeavesDetailsCard';
import axios from 'axios';

import AppUtils from 'components/core/helpers/app-utils';

const EmpLeaves = () => {

    const userId = localStorage.getItem('userId');
        const _axiosSource = axios.CancelToken.source();

     const _cancelToken = { cancelToken: _axiosSource.token };

    const [leaveData, setLeaveData] = useState([]);
    const [selectedLeave, setSelectedLeave] = useState(leaveData[leaveData.length - 1]);
    const [initialRender, setInitialRender] = useState(true);
    const [upcomingLeaves, setUpcomingLeaves] = useState([]);
    const [leaveCounts, setLeaveCounts] = useState({ sick: 0, lop: 0, casual: 0 });

    const [leaveAllowances,setLeaveAllowances] = useState({})



    const onSelectLeave = (leave) => {
        setSelectedLeave(leave);
        setInitialRender(false);
    };

    const currentYear = new Date().getFullYear(); // Get the current year


    const fetchLeaveAllowances = async () => {
    try {
        const response = await axios.get(`/api/v1/leave-allowances/year/${currentYear}`); // Use currentYear for the API call
        const data = response.data;

 

        setLeaveAllowances({totalSickLeaves:data.sickLeave,
            totalLopLeaves:data.lopLeave,
            totalCasualLeaves:data.casualLeave

        });
        // Total Number of Leaves available to each employee
    } catch (error) {
        console.error('Error fetching leave allowances', error);
        // Optionally handle the error, e.g., set default values or show a notification
        setLeaveAllowances({
            totalSickLeaves: 0,
            totalLopLeaves: 0,
            totalCasualLeaves: 0
        });
    }
};

// Fetch leave allowances when the component mounts
useEffect(() => {
    fetchLeaveAllowances();
    fetchLeaveData(userId, _cancelToken);
}, []);

          // API call definition to get leaves by user ID
    const getLeavesByUserId = async (userId, cancelToken) => {
        try {
            const token = AppUtils.getIdentityAccessToken();
            const userIdInt = parseInt(userId);
            const response = await axios.get(
                `http://localhost:8080/api/v1/leave/user/${userIdInt}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    cancelToken: cancelToken.token
                }
            );
            return response.data;
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled', error.message);
            } else {
                console.error('Error fetching leave data:', error);
            }
            throw error;
        }
    };

         // Function Definition to call Leaves API call function and set the Leave Data
    const fetchLeaveData = async (userId, cancelToken) => {
        try {
            const data = await getLeavesByUserId(userId, cancelToken);
            console.log('Leave Data: ', data);

            const currentDate = new Date();
            const pastLeaves = data.filter((leave) => {
                const leaveStartDate = new Date(leave.from_date);
                return leaveStartDate < currentDate;
            });

            // Sort filtered leave data by from_date descending (assuming from_date is in ISO string format)
            pastLeaves.sort((a, b) => new Date(b.from_date) - new Date(a.from_date));

            console.log('Filtered Past Leaves: ', pastLeaves);

            if (pastLeaves.length > 0) {
                setLeaveData(data); // Set all leave data
                setSelectedLeave(pastLeaves[pastLeaves.length - 1]);
                // Selecting the latest past leave
            } else {
                console.log('No past leaves found.');
                setLeaveData(data); // Set empty array if no past leaves
                setSelectedLeave(null); // Set selectedLeave to null
            }
        } catch (error) {
            if (!axios.isCancel(error)) {
                console.error('Error fetching leave data:', error);
            }
        }
    };

     //UseEffect Defintion only to set values that need to be sent as props to Leave Details Component
    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const upcoming = leaveData.filter((leave) => new Date(leave.from_date) > new Date());
        const counts = leaveData.reduce(
            (acc, leave) => {
                const year = new Date(leave.from_date).getFullYear();
                if (year === currentYear) {
                    if (leave.leave_type === 'SickLeave') acc.sick++;
                    if (leave.leave_type === 'Lop') acc.lop++;
                    if (leave.leave_type === 'Casual') acc.casual++;
                }
                return acc;
            },
            { sick: 0, lop: 0, casual: 0 }
        );
        console.log("leave data recieved:", leaveData);
        console.log("upcoming leaves:", upcoming);
        setUpcomingLeaves(upcoming);
        setLeaveCounts(counts);
    }, [leaveData]);


  

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '94%' }}>
            {/* First Row */}
            {/* (Add your content here if needed) */}

            {/* Second Row */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', marginBottom: 2 }}>
                <Box sx={{ width: { xs: '100%', sm: '50%', md: '40%' }, padding: 2 }}>
                    <LeaveHistory leaveData={leaveData} onSelectLeave={onSelectLeave} />
                </Box>
                <Box
                    sx={{
                        width: { xs: '100%', sm: '50%', md: '60%' },
                        padding: 2,
                    }}
                >
                    <LeaveHistoryDetails
                        selectedData={selectedLeave}
                        initialRender={initialRender}
                    />
                </Box>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', marginBottom: 2 }}>
                <Box
                    sx={{
                        width: { xs: '100%', sm: '30%', md: '40%' },
                        padding: 2,
                    }}
                >
                    <UpcomingLeaves
                        upcomingLeaves={upcomingLeaves}
                        leaveCounts={leaveCounts}
                        leaveAllowances={leaveAllowances}
                    />
                </Box>
                <Box sx={{ width: { xs: '100%', sm: '70%', md: '60%' }, padding: 2 }}>
                    <LeaveMetrics
                        leaveCounts={leaveCounts}
                        leaveAllowances={leaveAllowances}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default EmpLeaves;