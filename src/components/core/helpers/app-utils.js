import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { AppConfigProps } from '../settings/app-config';
import moment from 'moment';

class AppUtils {
    static setIdentityToken(idToken, refreshToken, accessToken) {
        let token = {
            id: idToken,
            refresh: refreshToken,
            access: accessToken
        };
        if (token)
            localStorage.setItem(AppConfigProps.identitySession.tokenKey, JSON.stringify(token));
    }
    static removeIdentityToken() {
        localStorage.removeItem(AppConfigProps.identitySession.tokenKey);
    }

    static getIdentityIdToken() {
        if (localStorage.getItem(AppConfigProps.identitySession.tokenKey)) {
            const token = localStorage.getItem(AppConfigProps.identitySession.tokenKey);

            if (token) {
                const parsedToken = JSON.parse(token);
                if (parsedToken && parsedToken.id) return parsedToken.id;
            }
        }
        return null;
    }
    static getIdentityRefershToken() {
        if (localStorage.getItem(AppConfigProps.identitySession.tokenKey)) {
            const token = localStorage.getItem(AppConfigProps.identitySession.tokenKey);
            if (token) {
                const parsedToken = JSON.parse(token);
                if (parsedToken && parsedToken.refresh) return parsedToken.refresh;
            }
        }
        return null;
    }
    static getIdentityAccessToken() {
        if (localStorage.getItem(AppConfigProps.identitySession.tokenKey)) {
            const token = localStorage.getItem(AppConfigProps.identitySession.tokenKey);
            if (token) {
                const parsedToken = JSON.parse(token);
                if (parsedToken && parsedToken.refresh) return parsedToken.access;
            }
        }
        return null;
    }

    static getIdentityTokenData() {
        const token = JSON.parse(localStorage.getItem(AppConfigProps.identitySession.tokenKey));

        if (token && token.access) {
            const decodedToken = jwt_decode(token.access);
            const identityData = {
                userUUID: decodedToken.sub,
                username: decodedToken['cognito:username'],
                email: decodedToken.sub,
                tokenExpiry: decodedToken.exp
            };
            return identityData;
        }
        return null;
    }

    static setRequestHeaders() {
        axios.defaults.baseURL = process.env.REACT_APP_HR_API_URL.replace(/^\/employee/, '');

        // axios.defaults.baseURL = "http://34.203.152.119:8080/";
        // axios.defaults.headers.common['x-api-key'] = process.env.REACT_APP_API_KEY;
        axios.defaults.headers.common['Content-Type'] = 'application/json';

        const idToken = AppUtils.getIdentityIdToken();
        if (idToken) {
            // Apply authorization token to every request if logged in
            axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
        } else {
            // Delete auth header
            delete axios.defaults.headers.common['Authorization'];
        }

        /*
    axios.defaults.baseURL =
      'https://97zn0qshi5.execute-api.us-east-2.amazonaws.com/dev/'; // process.env.REACT_APP_API_URL;

    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

    axios.defaults.headers.common['Content-Type'] = 'application/json';
    axios.defaults.headers.common['x-api-key'] =
      'bryjUflFDj8rWTA23DE2d9cGZVJi8jVf2jdTMiMk'; // process.env.REACT_APP_API_KEY;

    if (token) {
      // Apply authorization token to every request if logged in
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    } else {
      // Delete auth header
      delete axios.defaults.headers.common['Authorization'];
    }
    if (loginUser) {
      axios.defaults.headers.common['Login-User'] = loginUser;
    } else {
      delete axios.defaults.headers.common['Login-User'];
    }
    */
    }
    static getDateTime(dateTime) {
        var timestamp = '';
        if (dateTime !== 'None') {
            if (dateTime && dateTime !== '0000-00-00 00:00:00') {
                timestamp = moment(dateTime).format('MM/DD/YYYY HH:mm:ss');
                // return timestamp;
            }
        }
        return timestamp;
    }
    static getDateTimeFormat(dateTime) {
        var timestamp = '';
        if (dateTime !== 'None') {
            if (dateTime && dateTime !== '0000-00-00 00:00:00') {
                timestamp = moment(dateTime).format('YYYY-MM-DD ');
                // return timestamp;
            }
        }
        return timestamp;
    }
    static getDate(dateTime) {
        if (dateTime) {
            const timestamp = moment(dateTime).format('MM/DD/YYYY');
            return timestamp;
        }
    }
    static getDateFormat(date) {
        if (date) {
            const timestamp = moment(date).format('MM/DD/YYYY');
            return timestamp;
        }
    }
    static getDateEmployeeFormat(date) {
        if (date) {
            const timestamp = moment(date).format('MM/DD/YYYY');
            return timestamp;
        }
    }
    static fixedDateEmployeeFormat(date) {
        if (date) {
            const timestamp = moment(date).format('YYYY-MM-DD');
            return timestamp;
        }
    }
    static getTime(dateTime) {
        if (dateTime) {
            const timestamp = moment(dateTime).format('HH:mm:ss');
            return timestamp;
        }
    }

    static setProfile(profile) {
        if (profile)
            localStorage.setItem(
                AppConfigProps.identityProfile.profileKey,
                JSON.stringify(profile)
            );
    }
    static getProfile() {
        if (localStorage.getItem(AppConfigProps.identityProfile.profileKey)) {
            const profile = localStorage.getItem(AppConfigProps.identityProfile.profileKey);
            if (profile) {
                const parsedProfile = JSON.parse(profile);
                if (parsedProfile) return parsedProfile;
            }
        }
        return null;
    }
}

export default AppUtils;
