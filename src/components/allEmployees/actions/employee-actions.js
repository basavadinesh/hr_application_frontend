import axios from 'axios';
import moment from 'moment';
import { AppConfigProps } from '../../core/settings/app-config';
import { logMessage } from '../../core/actions/common-actions';

const actionFileName = 'Employee-actions.js';

// Custome API call hooks to perform CRUD operations on users table
export const getEmployees = async (cancelToken) => {
    return new Promise(function (resolve, reject) {
        axios
            .get(AppConfigProps.serverRoutePrefix + 'api/v1/user/', cancelToken)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    logMessage('warn', actionFileName + '>getEmployees()', err.message);
                } else {
                    reject(err.response);
                }
            });
    });
};

export const viewEmployeeDetails = async (id, cancelToken) => {
    return new Promise(function (resolve, reject) {
        axios
            .get('http://localhost:8080/api/v1/user/' + id, cancelToken)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    logMessage('warn', actionFileName + '>viewEmployeeDetails()', err.message);
                } else {
                    reject(err.response);
                }
            });
    });
};

export const createEmployees = async (formData, config = {}) => {
    try {
        const response = await axios.post('/api/v1/user/users', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...config.headers
            },
            ...config
        });
        return response;
    } catch (error) {
        throw error;
    }
};
export const updateEmployees = async (employeeId, employeeObj, cancelToken) => {
    return new Promise(function (resolve, reject) {
        axios
            .put(
                AppConfigProps.serverRoutePrefix + 'api/v1/user/users/' + employeeId,
                employeeObj,
                cancelToken
            )
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    logMessage('warn', actionFileName + '>updateEmployees()', err.message);
                } else {
                    reject(err.response);
                }
            });
    });
};

export const deleteEmployee = async (employeeId, cancelToken) => {
    return new Promise(function (resolve, reject) {
        axios
            .delete(
                AppConfigProps.serverRoutePrefix + 'api/v1/user/users/' + employeeId,
                cancelToken
            )
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    logMessage('warn', actionFileName + '>deleteEmployee()', err.message);
                } else {
                    reject(err.response);
                }
            });
    });
};

export const restoreEmployee = async (employeeId, cancelToken) => {
    return new Promise(function (resolve, reject) {
        axios
            .put(
                AppConfigProps.serverRoutePrefix + '/api/v1/user/users/restore/' + employeeId,
                cancelToken
            )
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    logMessage('warn', actionFileName + '>restoreEmployee()', err.message);
                } else {
                    reject(err.response);
                }
            });
    });
};

export const resetEmployeePassword = async (employeeId, cancelToken) => {
    return new Promise(function (resolve, reject) {
        axios
            .put(
                AppConfigProps.serverRoutePrefix + '/api/v1/user/resetPassword/' + employeeId,
                cancelToken
            )
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    logMessage('warn', actionFileName + '>resetEmployeePassword()', err.message);
                } else {
                    reject(err.response);
                }
            });
    });
};

export const getCountries = async (cancelToken) => {
    return new Promise(function (resolve, reject) {
        axios
            .get('http://localhost:8080/api/v1/countries', cancelToken)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    logMessage('warn', actionFileName + '>getCountries()', err.message);
                } else {
                    reject(err.response);
                }
            });
    });
};

export const getStates = async (cancelToken) => {
    return new Promise(function (resolve, reject) {
        axios
            .get('http://localhost:8080/api/v1/states', cancelToken)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    logMessage('warn', actionFileName + '>getStates()', err.message);
                } else {
                    reject(err.response);
                }
            });
    });
};
export const updateProfile = async (employeeId, employeeObj, cancelToken) => {
    return new Promise(function (resolve, reject) {
        const formData = new FormData();
        Object.keys(employeeObj).forEach((key) => {
            formData.append(key, employeeObj[key]);
        });
        axios
            .put(
                AppConfigProps.serverRoutePrefix + '/api/v1/user/employee/' + employeeId,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    cancelToken
                }
            )
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    logMessage('warn', actionFileName + '>updateProfile()', err.message);
                } else {
                    reject(err.response);
                }
            });
    });
};
