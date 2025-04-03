import React, { useEffect } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { useHistory } from 'react-router-dom';
import SLUGS from 'resources/slugs';
import {
    IconAgents,
    IconArticles,
    IconBell,
    IconContacts,
    IconIdeas,
    IconOverview,
    IconSettings,
    IconSubscription,
    IconTickets
} from 'assets/icons';
import LogoComponent from './LogoComponent';
import Menu from './MenuComponent';
import MenuItem from './MenuItemComponent';
import AppUtils from 'components/core/helpers/app-utils';
import iconBellNew from 'assets/icons/icon-bell-new';


// Styles
const useStyles = createUseStyles({
    separator: {
        borderTop: ({ theme }) => `1px solid ${theme.color.lightGrayishBlue}`,
        marginTop: 16,
        marginBottom: 16,
        opacity: 0.06
    }
});

// Main Component
function SidebarComponent() {
    // Hooks
    const { push } = useHistory();
    const theme = useTheme();
    const classes = useStyles({ theme });

    // Window width check for mobile
    const isMobile = window.innerWidth <= 1080;

    // Retrieve token and user role data
    const tokenData = AppUtils.getIdentityTokenData();
    const userRole = JSON.parse(localStorage.getItem('userData'));

    // Handle logout
    async function logout() {
        push(SLUGS.login);
    }

    // Navigate to a given slug
    function onClick(slug, parameters = {}) {
        window.location.href = slug;
    }

    useEffect(() => {}, []);

    
    // Role-based access checks
    const isAdmin = userRole && userRole.role === 'ADMIN';
    const isEmployeeOrManager = userRole && (userRole.role === 'EMPLOYEE' || userRole.role === 'MANAGER');

    return (
        <Menu isMobile={isMobile}>
            <div style={{ paddingTop: 30, paddingBottom: 30 }}>
                <LogoComponent />
            </div>

            {tokenData &&
            tokenData.userUUID &&
            tokenData.email &&
            tokenData.tokenExpiry &&
            isAdmin && (
                <MenuItem
                    id={SLUGS.dashboard}
                    title='Dashboard'
                    icon={IconSubscription}
                    onClick={() => onClick(SLUGS.dashboard)}
                />
            )}

            <MenuItem
                id={SLUGS.myprofile}
                title='My Profile'
                icon={IconAgents}
                onClick={() => onClick(SLUGS.myprofile)}
            />

            {tokenData &&
            tokenData.userUUID &&
            tokenData.email &&
            tokenData.tokenExpiry &&
            isAdmin && (
                <>
                    <MenuItem
                        id={SLUGS.employees}
                        title='All Employees'
                        icon={IconOverview}
                        onClick={() => onClick(SLUGS.employees)}
                    />
                    <MenuItem
                        id={SLUGS.projects}
                        title='Projects'
                        icon={IconTickets}
                        onClick={() => onClick(SLUGS.projects)}
                    />

                    <MenuItem
                        id={SLUGS.admintimeoffs}
                        items={[SLUGS.holidays, SLUGS.admintimeoffs,SLUGS.LeaveAllowance]}
                        title='Time Off'
                        icon={IconIdeas}
                    >
                        <MenuItem
                            id={SLUGS.holidays}
                            title='Holidays'
                            level={2}
                            icon={IconAgents}
                            onClick={() => onClick(SLUGS.holidays)}
                        />
                        <MenuItem
                            id={SLUGS.admintimeoffs}
                            title='Time Off'
                            level={2}
                            icon={IconContacts}
                            onClick={() => onClick(SLUGS.admintimeoffs)}
                        />
                        <MenuItem
                            id={SLUGS.LeaveAllowance}
                            title='Allowances'
                            level={2}
                            icon={IconOverview}
                            onClick={() => onClick(SLUGS.LeaveAllowance)}
                        />
                    </MenuItem>
                </>
            )}

            {tokenData &&
            tokenData.userUUID &&
            tokenData.email &&
            tokenData.tokenExpiry &&
            isEmployeeOrManager && (
                <>
                    <MenuItem
                        id={SLUGS.timeoff}
                        items={[SLUGS.holidays, SLUGS.timeoffs,SLUGS.empLeaves]}
                        title='Time Off'
                        icon={IconIdeas}
                    >
                        <MenuItem
                            id={SLUGS.holidays}
                            title='Holidays'
                            level={2}
                            icon={IconAgents}
                            onClick={() => onClick(SLUGS.holidays)}
                        />
                        <MenuItem
                            id={SLUGS.timeoffs}
                            title='Time Off'
                            level={2}
                            icon={IconContacts}
                            onClick={() => onClick(SLUGS.timeoffs)}
                        />
                         <MenuItem
                            id={SLUGS.empLeaves}
                            title='Leaves'
                            level={2}
                            icon={IconOverview}
                            onClick={() => onClick(SLUGS.empLeaves)}
                        />
                    
                    </MenuItem>
                    
                    <MenuItem
                        id={SLUGS.attendance}
                        title='Attendance'
                        icon={IconContacts}
                        onClick={() => onClick(SLUGS.attendance)}
                    />
                </>
            )}

            {tokenData &&
            tokenData.userUUID &&
            tokenData.email &&
            tokenData.tokenExpiry &&
            isAdmin && (
                <>
                    <MenuItem
                        id={SLUGS.departments}
                        title='Departments'
                        icon={IconSubscription}
                        onClick={() => onClick(SLUGS.departments)}
                    />
                    <MenuItem
                        id={SLUGS.designations}
                        title='Designations'
                        icon={IconSettings}
                        onClick={() => onClick(SLUGS.designations)}
                    />
                    <MenuItem
                        id={SLUGS.skills}
                        title='Skills & Expertise'
                        icon={IconContacts}
                        onClick={() => onClick(SLUGS.skills)}
                    />
                    <MenuItem
                        id={SLUGS.educations}
                        title='Educations'
                        icon={IconSettings}
                        onClick={() => onClick(SLUGS.educations)}
                    />
                    <MenuItem
                        id={SLUGS.learning}
                        title='Learning'
                        icon={IconArticles}
                        onClick={() => onClick(SLUGS.learning)}
                    />
                    <MenuItem
                        id={SLUGS.attendance}
                        title='Attendance'
                        icon={IconContacts}
                        onClick={() => onClick(SLUGS.attendance)}
                    />
                    <MenuItem
                        id={SLUGS.assets}
                        title='Assets'
                        icon={IconArticles}
                        onClick={() => onClick(SLUGS.assets)}
                    />
                </>
            )}

            {tokenData &&
            tokenData.userUUID &&
            tokenData.email &&
            tokenData.tokenExpiry &&
            isEmployeeOrManager && (
                <>
                    <MenuItem
                        id={SLUGS.educations}
                        title='Educations'
                        icon={IconSettings}
                        onClick={() => onClick(SLUGS.educations)}
                    />
                    <MenuItem
                        id={SLUGS.skills}
                        title='Skills & Expertise'
                        icon={IconContacts}
                        onClick={() => onClick(SLUGS.skills)}
                    />
                    <MenuItem
                        id={SLUGS.learning}
                        title='Learning'
                        icon={IconArticles}
                        onClick={() => onClick(SLUGS.learning)}
                    />
                </>
            )}
        </Menu>
    );
}

export default SidebarComponent;

