import React, { useContext, useEffect, useState, useRef } from 'react';
import { string } from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Row } from 'simple-flexbox';
import { createUseStyles, useTheme } from 'react-jss';
import { SidebarContext } from 'hooks/useSidebar';
import SLUGS from 'resources/slugs';
import axios from 'axios';
import { AppConfigProps } from '../../components/core/settings/app-config';
import { IconButton, Button, Menu, MenuItem } from '@mui/material';
// import UserRoleModal from './OsTicketLogin';

// Define styles using JSS
const useStyles = createUseStyles((theme) => ({
    avatar: {
        height: 35,
        width: 35,
        minWidth: 35,
        borderRadius: 50,
        border: `1px solid ${theme.color.lightGrayishBlue2}`,
        '@media (max-width: 768px)': {
            marginLeft: 14
        }
    },
    container: {
        height: 40
    },
    name: {
        ...theme.typography.itemTitle,
        textAlign: 'right',
        '@media (max-width: 768px)': {
            display: 'none'
        }
    },
    separator: {
        borderLeft: `1px solid ${theme.color.lightGrayishBlue2}`,
        marginLeft: 32,
        marginRight: 32,
        height: 32,
        width: 2,
        '@media (max-width: 768px)': {
            marginLeft: 14,
            marginRight: 0
        }
    },
    title: {
        ...theme.typography.title,
        fontSize: '18px',
        '@media (max-width: 1080px)': {
            marginLeft: 50
        },
        '@media (max-width: 468px)': {
            fontSize: 20
        }
    },
    iconStyles: {
        cursor: 'pointer',
        marginLeft: 25,
        '@media (max-width: 768px)': {
            marginLeft: 12
        }
    }
}));

function HeaderComponent() {
    const { push } = useHistory();
    const { currentItem } = useContext(SidebarContext);
    const theme = useTheme();
    const classes = useStyles({ theme });
    const userId = localStorage.getItem('userId');
    const [imageUrl, setImageUrl] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const currentYear = new Date().getFullYear();
    const userRole = JSON.parse(localStorage.getItem('userData'));

    // Function to open the modal based on login type

    // Function to handle user logout
    const handleLogOutUser = async () => {
        await localStorage.removeItem('EmployeeApp');
        await localStorage.removeItem('SessionStatus');
        await localStorage.clear();
        await push(SLUGS.signin);
    };

    // Determine the title based on the current item in the sidebar
    let title;
    switch (true) {
        case currentItem === SLUGS.dashboard:
            title = 'Dashboard';
            break;
        case [SLUGS.overview, SLUGS.overviewTwo, SLUGS.overviewThree].includes(currentItem):
            title = 'Overview';
            break;
        case currentItem === SLUGS.myprofile:
            title = 'My Profile';
            break;
        case currentItem === SLUGS.employees:
            title = 'All Employees';
            break;
        case currentItem === SLUGS.projects:
            title = 'Projects';
            break;
        case [SLUGS.holidays, SLUGS.timeoff].includes(currentItem):
            title = `Holidays ${currentYear}`;
            break;
        case currentItem === SLUGS.timeoffs:
            title = 'Time off';
            break;
        case currentItem === SLUGS.attendance:
            title = 'Attendance';
            break;
        case currentItem === SLUGS.agents:
            title = 'Agents';
            break;
        case currentItem === SLUGS.articles:
            title = 'Articles';
            break;
        case currentItem === SLUGS.departments:
            title = 'Departments';
            break;
        case currentItem === SLUGS.designations:
            title = 'Designations';
            break;
        case currentItem === SLUGS.admintimeoffs:
            title = 'Time off';
            break;
        case currentItem === SLUGS.educations:
            title = 'Educations';
            break;
        case currentItem === SLUGS.assets:
            title = 'Assets';
            break;
        case currentItem === SLUGS.skills:
            title = 'Skills & Expertise';
            break;
        case [SLUGS.empholidays, SLUGS.timeoffs].includes(currentItem):
            title = `Holidays ${currentYear}`;
            break;
        case currentItem === SLUGS.invoice:
            title = 'Invoice';
            break;
        case currentItem === SLUGS.empeducations:
            title = 'Educations';
            break;
        case currentItem === SLUGS.learning:
            title = 'Learning';
            break;
        case currentItem === SLUGS.LeaveAllowance:
            title = 'Leave Allowances';
            break;
        case currentItem.includes(SLUGS.employeeView('')):
            title = 'Employee View';
            break;
        default:
            title = '';
    }

    // Check if the signed URL is valid (less than 24 hours old)
    const isSignedUrlValid = (timestamp) => {
        const currentTime = new Date().getTime();
        return currentTime - timestamp < 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    };

    // Fetch user data and image URL from the server
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await axios.get(
                    `${AppConfigProps.serverRoutePrefix}/api/v1/user/${userId}`
                );
                if (userResponse.status === 200 && userResponse.data) {
                    let userImageUrl = userResponse.data.imageurl;

                    if (!userImageUrl || !userImageUrl.trim()) {
                        setImageUrl(
                            'https://a0.anyrgb.com/pngimg/1140/162/user-profile-login-avatar-heroes-user-blue-icons-circle-symbol-logo.png'
                        );
                    } else {
                        const cachedSignedUrl = localStorage.getItem(`signedUrl_${userId}`);
                        const cachedTimestamp = localStorage.getItem(
                            `signedUrlTimestamp_${userId}`
                        );

                        // Check if there's a valid signed URL in localStorage
                        if (
                            cachedSignedUrl &&
                            cachedTimestamp &&
                            isSignedUrlValid(cachedTimestamp)
                        ) {
                            userImageUrl = cachedSignedUrl;
                        } else {
                            // Request a new signed URL if cached URL is not valid
                            const fileName = userImageUrl.substring(
                                userImageUrl.lastIndexOf('/') + 1
                            );

                            // Request a signed URL from the server using only the file name
                            const signedUrlResponse = await axios.get(
                                `${AppConfigProps.serverRoutePrefix}/generate-signed-url`,
                                { params: { filePath: fileName } } // Pass only the file name
                            );

                            if (signedUrlResponse.data && signedUrlResponse.data.signedUrl) {
                                userImageUrl = signedUrlResponse.data.signedUrl;
                                localStorage.setItem(`signedUrl_${userId}`, userImageUrl);
                                localStorage.setItem(
                                    `signedUrlTimestamp_${userId}`,
                                    new Date().getTime()
                                );
                            }
                        }

                        setImageUrl(userImageUrl);
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [userId]);

    // Handle opening the menu
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Handle closing the menu
    const handleClose = () => {
        setAnchorEl(null);
    };

    //osticket handling
    const [userid, setAgentUsername] = useState('');
    const [passwd, setAgentPassword] = useState('test123');
    const [salt_key] = useState('test123');

    const [luser, setHelpdeskUsername] = useState('');
    const [lpasswd, setHelpdeskPassword] = useState('test123');

    useEffect(() => {
        if (userRole) {
            if (['ADMIN', 'Hr', 'MANAGER'].includes(userRole.role)) {
                setAgentUsername(userRole.email);
                setHelpdeskUsername(userRole.email);
            } else {
                setHelpdeskUsername(userRole.email);
            }
        }
    }, [userRole]);

    const agentFormRef = useRef(null);
    const helpdeskFormRef = useRef(null);

    const handleAgentFormLogin = (event) => {
        event.preventDefault();
        agentFormRef.current.submit();
    };

    const handleHelpdeskFormLogin = (event) => {
        event.preventDefault();
        helpdeskFormRef.current.submit();
    };

    return (
        <Row className={classes.container} vertical='center' horizontal='space-between'>
            <span className={classes.title}>{title}</span>
            <Row vertical='center'>
                <div style={{ marginRight: '20px' }}>
                    {' '}
                    {/* Spacing added between buttons and image */}
                    {(userRole.role === 'ADMIN' ||
                        userRole.role === 'Hr' ||
                        userRole.role === 'MANAGER') && (
                        <Button
                            variant='outlined'
                            onClick={handleAgentFormLogin}
                            sx={{
                                mt: 3,
                                mb: 2,
                                backgroundColor: '0070ac',
                                borderRadius: '10px',
                                height: '33px',
                                color: '#0070ac',
                                borderColor: '#0070ac',
                                width: '100px',

                                '&:hover': {
                                    backgroundColor: '#0070ac',
                                    color: '#ffffff'
                                }
                            }}
                        >
                            Agent
                        </Button>
                    )}
                    {
                        <Button
                            variant='outlined'
                            onClick={handleHelpdeskFormLogin} // Open modal and set type to 'Help Desk'
                            sx={{
                                mt: 3,
                                mb: 2,
                                backgroundColor: 'transparent',
                                borderRadius: '10px',
                                height: '33px',
                                color: '#0070ac',
                                borderColor: '#0070ac',
                                width: '150px',
                                ml: 2,
                                '&:hover': {
                                    backgroundColor: '#0070ac',
                                    color: '#ffffff'
                                }
                            }}
                        >
                            Help Desk
                        </Button>
                    }
                </div>

                <IconButton onClick={handleClick} className={classes.iconStyles}>
                    <img src={imageUrl} alt='avatar' className={classes.avatar} />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    PaperProps={{
                        style: {
                            top: 45,
                            right: 0
                        }
                    }}
                >
                    <MenuItem
                        onClick={() => {
                            handleLogOutUser();
                            handleClose();
                        }}
                    >
                        Logout
                    </MenuItem>
                </Menu>
            </Row>
            <form
                id='agentform'
                ref={agentFormRef}
                method='POST'
                action='http://localhost/osticket/scp/login.php'
                target='_blank'
                style={{ display: 'none' }}
            >
                <input type='hidden' name='userid' value={userid} />
                <input type='hidden' name='passwd' value='test123' />
                <input type='hidden' name='salt_key' value='test123' />
            </form>
            <form
                id='helpdeskform'
                ref={helpdeskFormRef}
                method='POST'
                action='http://localhost/osticket/login.php'
                target='_blank'
                style={{ display: 'none' }}
            >
                <input type='hidden' name='luser' value={luser} />
                <input type='hidden' name='lpasswd' value='test123' />
                <input type='hidden' name='salt_key' value='test123' />
            </form>
        </Row>
    );
}

// Define PropTypes for the component
HeaderComponent.propTypes = {
    title: string
};

export default HeaderComponent;
