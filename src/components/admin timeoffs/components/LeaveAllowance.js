import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { tableCellClasses } from '@mui/material/TableCell';
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Paper,
    styled
} from '@mui/material';
import AddAllowance from './AddAllowance';

// Styled Components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.gray,
        color: theme.palette.common.black,
        textAlign: 'center', // Center text
        borderRight: '1px solid #ccc' // Apply border style
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        borderRight: '1px solid #ccc', // Apply border style
        textAlign: 'center' // Center text
    }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(even)': {
        backgroundColor: theme.palette.action.hover
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0
    }
}));

const LeaveAllowance = () => {
    const [leaveAllowances, setLeaveAllowances] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [filteredData, setFilteredData] = useState([]);
    const [buttonText, setButtonText] = useState('+ Add Leaves');
    const [open, setOpen] = useState(false); // State for modal open/close
    const [selectedMethod, setSelectedMethod] = useState('add'); // State for method (add/edit)
    const [selectedLeaveDetails, setSelectedLeaveDetails] = useState({});
    const [editMethod, setEditMethod] = useState(''); // State for selected leave details

    // Fetch all leave allowances from API
    const fetchLeaveAllowances = async () => {
        try {
            const response = await axios.get('/api/v1/leave-allowances');
            const data = response.data;
            setLeaveAllowances(data || []);

           
           
        } catch (error) {
            console.error('Error fetching leave allowances', error);
            setButtonText('+ Add Leaves');
            // Handle error (e.g., show a notification)
        }
    };


    // Update button text based on leave allowances and selected year
    useEffect(() => {
        const selectedYearData = leaveAllowances.find(allowance => allowance.year === selectedYear);
        if (selectedYearData) {
            setButtonText('Update Leaves');
        } else {
            setButtonText('+ Add Leaves');
        }
    }, [leaveAllowances, selectedYear]);

    // Filter data based on selected year
    const filterData = () => {
        const filtered = leaveAllowances.filter((allowance) => allowance.year === selectedYear);
        setFilteredData(filtered);
    };

    useEffect(() => {
        fetchLeaveAllowances();
    }, []);

    useEffect(() => {
        filterData();
    }, [selectedYear, leaveAllowances]);

    const handleOpen = (buttonText) => {
        setOpen(true);
        // Determine the method based on the presence of "+" in the buttonText
        const method = buttonText.includes('+') ? 'add' : 'edit';
        setSelectedMethod(method);

        // Find leave details for the selected year
        const leaveDetails = leaveAllowances.find(allowance => allowance.year === selectedYear) || {};

        // Clean the data to match the structure expected by the formValues in the component
        const cleanedData = {
            id: leaveDetails.id || '',
            sick: leaveDetails.sickLeave || '',
            lop: leaveDetails.lopLeave || '',
            casual: leaveDetails.casualLeave || ''
        };
        console.log("cleaned data ", cleanedData)

        setSelectedLeaveDetails(cleanedData); // Pass the cleaned data to the component
    };

    const handleClose = () => {
        setOpen(false);
        setEditMethod('');
        setSelectedLeaveDetails({});
    };

    const handleSuccess = () => {
        fetchLeaveAllowances();
    };

    const currentYear = new Date().getFullYear();

    return (
        <div style={{ padding: '20px' }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end', // Align items to the right
                    alignItems: 'flex-start', // Align items to the top
                    marginBottom: '20px'
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'center'
                    }}
                >
                    <FormControl style={{ minWidth: 120, marginRight: 15 }}>
                        <InputLabel>Year</InputLabel>
                        <Select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            label='Year'
                            style={{
                                color: '#F06D4B',
                                borderColor: '#F06D4B',
                                marginBottom: '10px',
                                borderRadius: '40px',
                                height: 43,
                                borderWidth: 2
                            }}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 200 // Set max height to allow scrolling
                                    }
                                }
                            }}
                        >
                            {Array.from({ length: 100 }, (_, i) => currentYear + i).map((year) => (
                                <MenuItem key={year} value={year}>
                                    {year}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        variant='outlined'
                        color='primary'
                        onClick={() => handleOpen(buttonText)}
                        style={{
                            color: '#F06D4B',
                            borderColor: '#F06D4B',
                            marginBottom: '10px',
                            borderRadius: '40px',
                            height: 43,
                            borderWidth: 2
                        }}
                    >
                        {buttonText}
                    </Button>
                </div>
            </div>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell sx={{ backgroundColor: '#E7E9EA' }}>
                                Leave Type
                            </StyledTableCell>
                            <StyledTableCell sx={{ backgroundColor: '#E7E9EA' }}>
                                Allowed (In days)
                            </StyledTableCell>
                            <StyledTableCell sx={{ backgroundColor: '#E7E9EA', minWidth: '120px' }}>
                                Actions
                            </StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.length > 0 ? (
                            filteredData.map((allowance) => (
                                <React.Fragment key={allowance.year}>
                                    <StyledTableRow>
                                        <StyledTableCell>Sick Leave</StyledTableCell>
                                        <StyledTableCell>
                                            {allowance.sickLeave || 0}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <Button
                                                variant='outlined'
                                                color='secondary'
                                                onClick={() => {
                                                    setEditMethod('sick');
                                                    handleOpen('update');

                                                }}
                                                style={{
                                                    color: '#F06D4B',
                                                    borderColor: '#F06D4B',
                                                    marginBottom: '10px',
                                                    borderRadius: '40px',
                                                    height: 43,
                                                    borderWidth: 2
                                                }}
                                            >
                                                Update
                                            </Button>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell>LOP</StyledTableCell>
                                        <StyledTableCell>{allowance.lopLeave || 0}</StyledTableCell>
                                        <StyledTableCell>
                                            <Button
                                                variant='outlined'
                                                color='secondary'
                                                onClick={() => {
                                                    setEditMethod('lop');
                                                    handleOpen('update')

                                                }}
                                                style={{
                                                    color: '#F06D4B',
                                                    borderColor: '#F06D4B',
                                                    marginBottom: '10px',
                                                    borderRadius: '40px',
                                                    height: 43,
                                                    borderWidth: 2
                                                }}
                                            >
                                                Update
                                            </Button>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell>Casual Leave</StyledTableCell>
                                        <StyledTableCell>
                                            {allowance.casualLeave || 0}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <Button
                                                variant='outlined'
                                                color='secondary'
                                                onClick={() => {
                                                    setEditMethod('casual');
                                                    handleOpen('update')
                                                }}
                                                style={{
                                                    color: '#F06D4B',
                                                    borderColor: '#F06D4B',
                                                    marginBottom: '10px',
                                                    borderRadius: '40px',
                                                    height: 43,
                                                    borderWidth: 2
                                                }}
                                            >
                                                Update
                                            </Button>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                </React.Fragment>
                            ))
                        ) : (
                            <StyledTableRow>
                                <StyledTableCell colSpan={3}>
                                    No leave allowances available for {selectedYear}
                                </StyledTableCell>
                            </StyledTableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add Allowance Modal */}
            <AddAllowance
                open={open}
                onClose={handleClose}
                leaveDetails={selectedLeaveDetails}
                method={selectedMethod}
                year={selectedYear}
                onSuccess={handleSuccess}
                editMethod={editMethod}
            />
        </div>
    );
};

export default LeaveAllowance;
