import Card from '@mui/material/Card';
import axios from 'axios';
import CardContent from '@mui/material/CardContent';
import time from 'assets/time.png';
import timeicom from 'assets/timeicom.png';
import Button from '@mui/material/Button';
import './Attendance.css';
import { AttendanceMsgResProps } from '../messeges/attendance-properties';
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
    getAttendances,
    viewAttendanceDetails,
    deleteAttendance
} from '../actions/attendance-actions';
import { manageError } from '../../core/actions/common-actions';
import { AppConfigProps } from '../../core/settings/app-config';
import Grid from '@mui/material/Grid';
import {
    getCheckin,
    viewCheckinDetails,
    getCheckout,
    viewCheckoutDetails
} from '../actions/empattendance-actions';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.gray,
        color: theme.palette.common.black
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14
    }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(even)': {
        backgroundColor: theme.palette.action.hover
    },
    '&:last-child td, &:last-child th': {
        border: 0
    }
}));

export default function CustomizedTables(props) {
    const _axiosSource = axios.CancelToken.source();
    const _cancelToken = { cancelToken: _axiosSource.token };
    const [dateState, setDateState] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState(null);

    // const [attendanceValue, setAttendanceValue] = useState({
    //     checkIn: [],
    //     checkOut: []
    // });
    const [attendanceValue, setAttendanceValue] = useState([]);
    const [attendances, setAttendances] = useState(null);
    const [open, setOpen] = React.useState(false);
    const handleOpen = async (event) => {
        if (event === 'add') {
            await setSelectedAttendanceDetails(null);
        }
        await setSelectedMethod(event);
        await setOpen(true);
    };
    // const handleClose = () => {
    //     setOpen(false);
    //     loadPageData();
    
    // };
    // const [anchorEl, setAnchorEl] = useState(null);
    const [selectedAttendanceID, setSelectedAttendanceID] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [selectedAttendanceDetails, setSelectedAttendanceDetails] = useState(null);

    const loadPageData = async () => {
        await getAttendances(_cancelToken)
            .then(async (res) => {
                if (
                    res &&
                    res.status === AppConfigProps.httpStatusCode.ok &&
                    res.data &&
                    res.data
                ) {
                    setAttendances(res.data);
                } else {
                    await manageError(res, props.history);
                }
            })
            .catch(async (err) => {
                await manageError(err, props.history);
            });
    };

    useEffect(() => {
        setInterval(() => setDateState(new Date()), 1000);
        loadPageData();
    }, []);

    

    const handleChange = async (event) => {
        await setSelectedEvent(event.target.name);
        if (event.target.name === 'punchin_at') {
            attendanceValue.push({[event.target.name]: event.target.value});
        } else if (event.target.name === 'punchout_at') {
            attendanceValue.push({[event.target.name]: event.target.value});
        }
        
    };

    return (
        <div>
            <Card
                sx={{
                    width: '450px',
                    height: '330px',
                    margin: '0px 6px 4px 0px',
                    display: 'inline-block'
                }}
            >
                <CardContent style={{ textAlign: 'center', overflow: 'hidden' }}>
                    <img src={time} alt={'time logo'} />
                    <div className='background'>
                        <h1 style={{ padding: '35px' }}>
                            {dateState.toLocaleString('en-US', {
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true,
                                second: 'numeric'
                            })}
                        </h1>
                    </div>
                    <div>
                        <Button
                            className='checkin'
                            value={dateState.toLocaleString('en-US', {
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true,
                                second: 'numeric'
                            })}
                            name='punchin_at'
                            disabled={selectedEvent === 'punchin_at'}
                            onClick={(e) => handleChange(e)}
                        >
                            Checkin
                        </Button>
                        <Button
                            className='checkout'
                            value={dateState.toLocaleString('en-US', {
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true,
                                second: 'numeric'
                            })}
                            name='punchout_at'
                            disabled={selectedEvent === 'punchout_at'}
                            onClick={(e) => handleChange(e)}
                        >
                            Checkout
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <Card
                sx={{
                    width: '685px',
                    height: '330px',
                    margin: '0px 6px 4px 35px',
                    display: 'inline-block',
                    overflow: 'hidden'
                }}
            >
                <CardContent>
                <Grid container rowSpacing={1} >
                    {/* <span>
                        <div> */}
                        <Grid item xs className='gridscrollbar'>
                            {attendanceValue &&
                                attendanceValue.map((obj, index) => {
                                    return <div key={index}>{Object.keys(obj)} : {obj['punchin_at'] ? obj['punchin_at'] : obj['punchout_at'] ? obj['punchout_at'] : '-'}</div>;
                                })}
</Grid>
                        {/* </div>
                    </span> */}
                    {/* <span>
                        <img style={{ float: 'right' }} src={timeicom} alt={'time icon logo'} />
                    </span> */}
                    
      <Grid item xs>
        <div><img src={timeicom} alt={'time icon logo'} /></div>
      </Grid>
      </Grid>
                </CardContent>
            </Card>

            <div>
                <Card
                    sx={{
                        width: '1170px',
                        height: '220px',
                        margin: '0px 6px 4px 0px',
                        display: 'inline-block'
                    }}
                >
                    <CardContent style={{ textAlign: 'center' }}>
                        <TableContainer
                            component={Paper}
                            style={{ margin: '46px 2px 4px 0px' }}
                            className='tablecardscroll'
                        >
                            <Table sx={{ minWidth: 700 }} aria-label='customized table'>
                                <TableHead sx={{ backgroundColor:"#E7E9EA"}}>
                                    <TableRow>
                                        <StyledTableCell>
                                            {AttendanceMsgResProps.body.form.id.label}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {AttendanceMsgResProps.body.form.date.label}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {AttendanceMsgResProps.body.form.startTime.label}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {AttendanceMsgResProps.body.form.endTime.label}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {AttendanceMsgResProps.body.form.loginhours.label}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {AttendanceMsgResProps.body.form.breakhours.label}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {AttendanceMsgResProps.body.form.overtimehours.label}
                                        </StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {attendances && attendances.length > 0 ? (
                                        attendances.map((attendance, index) => {
                                            return (
                                                <StyledTableRow key={index}>
                                                    <StyledTableCell component='th' scope='row'>
                                                        {attendance.id.toString()
                                                            ? attendance.id.toString()
                                                            : '-'}
                                                    </StyledTableCell>
                                                    <StyledTableCell component='th' scope='row'>
                                                        {attendance.date ? attendance.date : '-'}
                                                    </StyledTableCell>
                                                    <StyledTableCell component='th' scope='row'>
                                                        {attendance.startTime.toString()
                                                            ? attendance.startTime.toString()
                                                            : '-'}
                                                    </StyledTableCell>
                                                    <StyledTableCell component='th' scope='row'>
                                                        {attendance.endTime.toString()
                                                            ? attendance.endTime.toString()
                                                            : '-'}
                                                    </StyledTableCell>
                                                    <StyledTableCell component='th' scope='row'>
                                                        {attendance.loginhours.toString()
                                                            ? attendance.loginhours.toString()
                                                            : '-'}
                                                    </StyledTableCell>
                                                    <StyledTableCell component='th' scope='row'>
                                                        {attendance.breakhours.toString()
                                                            ? attendance.breakhours.toString()
                                                            : '-'}
                                                    </StyledTableCell>
                                                    <StyledTableCell component='th' scope='row'>
                                                        {attendance.overtimehours.toString()
                                                            ? attendance.overtimehours.toString()
                                                            : '-'}
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            );
                                        })
                                    ) : (
                                        <StyledTableRow>
                                            <StyledTableCell>No Data Found.</StyledTableCell>
                                        </StyledTableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
