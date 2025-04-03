import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import AppUtils from 'components/core/helpers/app-utils';
import SLUGS from 'resources/slugs';

const _axiosSource = axios.CancelToken.source();

export const PrivateRoute = ({ component: Component, ...rest }) => {
    useEffect(() => {}, []);
    return (
        <Route
            {...rest}
            render={(props) => {
                const tokenData = AppUtils.getIdentityTokenData();
                if (
                    tokenData &&
                    tokenData.userUUID &&
                    tokenData.email &&
                    tokenData.tokenExpiry >= Date.now() / 1000
                ) {
                    AppUtils.setRequestHeaders();
                    // authorised so return component
                    return <Component {...props} />;
                } else {
                    return (
                        // Un-authorised so Push back to SignIn
                        <Redirect
                            to={{
                                pathname: SLUGS.signin,
                                state: { from: props.location }
                            }}
                        />
                    );
                }
            }}
        />
    );
};

export default PrivateRoute;
