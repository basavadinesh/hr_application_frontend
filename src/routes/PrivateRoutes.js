import React, { useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import SLUGS from 'resources/slugs';
import LoadingComponent from 'components/loading';
import AllEmployees from 'components/allEmployees/components/AllEmployees';
import Projects from 'components/projects/components/Projects';
import Departments from 'components/departments/components/Department';
import Designations from 'components/designations/components/Designation';
import Holidays from 'components/holidays/components/Holiday';
import Timeoffs from 'components/time-offs/components/Timeoff';
import Admintimeoffs from 'components/admin timeoffs/components/Timeoff1';
import Education from 'components/educations/components/Education';
import MyProfile from 'components/myprofile/components/MyProfile';
import EmpAssets from 'components/assets/components/EmpAssets';
import Assets from 'components/assets/components/Assets';
import Attendance from 'components/EmpAttendance/components/Attendance';
import Skills from 'components/skills/components/Skills';
import EmpHoliday from 'components/Empholiday/components/EmpHoliday';
import AppUtils from 'components/core/helpers/app-utils';
import AdminSkills from 'components/skills/components/AdminSkills';
import AdminLearning from 'components/Learning/components/AdminLearning';
import Learning from 'components/Learning/components/Learning';
import ViewEmployee from 'components/allEmployees/components/ViewEmployee';
import NotAuthorized from './signin/NotAuthorized';
import AdminEducations from 'components/educations/components/AdminEducation';
import { EmployeeErrorPage } from 'components/allEmployees/actions/EmployeeErrorPage';
import LeaveAllowance from 'components/admin timeoffs/components/LeaveAllowance';
import EmpLeaves from 'components/time-offs/components/EmpLeaves';
import EmploymentForm from 'components/allEmployees/components/EmployementForm';

function PrivateRoutes(props) {
    const tokenData = AppUtils.getIdentityTokenData();
    const userRole = JSON.parse(localStorage.getItem('userData'));

    // Define private routes for employee and admin roles
    const employeeRoutes = [
        { pathname: 'profile', path: SLUGS.myprofile, component: MyProfile },
        { pathname: 'holiday', path: SLUGS.holidays, component: Holidays },
        { pathname: 'learning', path: SLUGS.learning, component: Learning },
        { pathname: 'skills', path: SLUGS.skills, component: Skills },
        { pathname: 'empTimeOffs', path: SLUGS.timeoffs, component: Timeoffs },
        { pathname: 'empAttendance', path: SLUGS.attendance, component: Attendance },
        { pathname: 'empEducations', path: SLUGS.educations, component: Education },
        { pathname: 'empLeaves', path: SLUGS.empLeaves, component: EmpLeaves }
    ];

    const adminRoutes = [
        { pathname: 'dashboard', path: SLUGS.dashboard, component: 'Dashboard' },
        { pathname: 'profile', path: SLUGS.myprofile, component: MyProfile },
        { pathname: 'employees', path: SLUGS.employees, component: AllEmployees },
        { pathname: 'project', path: SLUGS.projects, component: Projects },
        { pathname: 'designations', path: SLUGS.designations, component: Designations },
        { pathname: 'departments', path: SLUGS.departments, component: Departments },
        { pathname: 'adminTimeOffs', path: SLUGS.admintimeoffs, component: Admintimeoffs },
        { pathname: 'holiday', path: SLUGS.holidays, component: Holidays },
        { pathname: 'skills', path: SLUGS.skills, component: Skills },
        { pathname: 'empEducations', path: SLUGS.educations, component: Education },
        { pathname: 'learning', path: SLUGS.learning, component: Learning },
        { pathname: 'empAttendance', path: SLUGS.attendance, component: Attendance },
        { pathname: 'assets', path: SLUGS.assets, component: Assets },
        { pathname: 'Allowances', path: SLUGS.LeaveAllowance, component: LeaveAllowance },
        { pathname: 'employmentform', path: SLUGS.employementform, component: EmploymentForm },

        {
            pathname: 'viewEmployee/:userId',
            path: SLUGS.employeeView(':userId'),
            component: ViewEmployee
        },

        {
            pathname: 'viewEmployee/:userId',
            path: SLUGS.employeeView(':userId'),
            component: ViewEmployee
        }
    ];

    useEffect(() => {
        AppUtils.setRequestHeaders();
    }, []);

    const isAdmin = userRole && userRole.role === 'ADMIN';
    const isEmployee = userRole && userRole.role === 'EMPLOYEE';
    const isManager = userRole && userRole.role === 'MANAGER';
    const isUser = userRole && userRole.role === 'USER';
    const isHr = userRole && userRole.role === 'Hr';
    const isAnonymous = userRole && userRole.role === 'ANONYMOUS';

    // Filter routes based on user role
    const getFilteredRoutes = () => {
        let filteredRoutes = [];
        if (isAdmin) {
            filteredRoutes = adminRoutes; // Admin routes
        } else if (isEmployee || isManager || isUser || isHr || isAnonymous) {
            filteredRoutes = employeeRoutes; // Employee routes
        }
        console.log('Filtered Routes:', filteredRoutes); // Log filtered routes
        return filteredRoutes;
    };

    return (
        <Switch>
            {tokenData && tokenData.userUUID && tokenData.email && tokenData.tokenExpiry ? (
                <LoadingComponent loading={getFilteredRoutes().length === 0}>
                    <Switch>
                        {getFilteredRoutes().map((route) => (
                            <Route
                                key={route.path}
                                exact
                                path={route.path}
                                component={route.component}
                            />
                        ))}
                        <Route path='*' component={NotAuthorized} />
                    </Switch>
                </LoadingComponent>
            ) : (
                <Redirect to={{ pathname: SLUGS.signin, state: { from: props.location } }} />
            )}
        </Switch>
    );
}

export default PrivateRoutes;
