import React, { Suspense, lazy, useEffect } from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import AppUtils from 'components/core/helpers/app-utils';
import { useLocation } from 'react-router-dom';
import SLUGS from 'resources/slugs';
import LoadingComponent from 'components/loading';
import PublicRoutes from './PublicRoutes';
import PrivateSection from './PrivateSection';
import Reset from 'routes/signin/Resetpassword';
import Forgot from 'routes/signin/Forgot password';
import ForgotPasswordForm from 'routes/signin/ForgotPasswordForm';
import EmailReq from 'routes/signin/emailrequest';
import { EmployeeErrorPage } from 'components/allEmployees/actions/EmployeeErrorPage';
import ViewEmployee from 'components/allEmployees/components/ViewEmployee';
import PublicEmployee from 'components/allEmployees/components/PublicEmployee'; // Import ViewEmployee component
import NotAuthorized from './signin/NotAuthorized';

// Lazy load SigninComponent
const SigninComponent = lazy(() => import('../routes/signin/SigninComponent'));

function Routes() {
    const { pathname } = useLocation();

    // Set request headers on path change
    useEffect(() => {
        AppUtils.setRequestHeaders();
    }, [pathname]);

    return (
        <Suspense fallback={<LoadingComponent loading />}>
            <BrowserRouter basename='/'>
                <Switch>
                    <Route path={SLUGS.signin} component={SigninComponent} />
                    <Route exact path={SLUGS.resetpassword} component={Reset} />
                    <Route exact path={SLUGS.forgotPassword} component={Forgot} />
                    <Route exact path={SLUGS.forgotpasswordform} component={ForgotPasswordForm} />
                    <Route exact path={SLUGS.emailrequest} component={EmailReq} />

                    <Route exact path={SLUGS.employeeAdd} component={PublicEmployee} />

                    <PublicRoutes path={'/'} component={PrivateSection} />
                </Switch>
            </BrowserRouter>
        </Suspense>
    );
}

export default Routes;
