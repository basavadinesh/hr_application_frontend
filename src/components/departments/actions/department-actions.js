import axios from 'axios';
import { AppConfigProps } from '../../core/settings/app-config';
import { logMessage } from '../../core/actions/common-actions';

const actionFileName = 'deparment-actions.js';

// Base URL for the API
const API_BASE_URL = 'http://localhost:8080';

// Fetch the list of departments
export function getDepartments(cancelToken) {
    return new Promise(function (resolve, reject) {
        axios
            .get("http://localhost:8080/api/v1/departments", cancelToken)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    logMessage('warn', actionFileName + '>getDepartments()', err.message);
                } else {
                    reject(err.response);
                }
            });
    });
}

// Fetch details of a specific department by ID
export function viewDepartmentDetails(id, cancelToken) {
    return new Promise(function (resolve, reject) {
        axios
            .get(AppConfigProps.serverRoutePrefix + 'api/v1/departments/' + id, cancelToken)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    logMessage('warn', actionFileName + '>viewDepartmentDetails()', err.message);
                } else {
                    reject(err.response);
                }
            });
    });
}

// Create a new department
export function createDepartments(departmentObj, cancelToken) {
    return new Promise(function (resolve, reject) {
        axios
            .post(
                AppConfigProps.serverRoutePrefix + 'api/v1/departments',
                departmentObj,
                cancelToken
            )
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    logMessage('warn', actionFileName + '>createDepartments()', err.message);
                } else {
                    reject(err.response);
                }
            });
    });
}

// Update an existing department by ID
export function updateDepartments(departmentId, departmentObj, cancelToken) {
    return new Promise(function (resolve, reject) {
        axios
            .put(
                AppConfigProps.serverRoutePrefix + 'api/v1/departments/' + departmentId,
                departmentObj,
                cancelToken
            )
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    logMessage('warn', actionFileName + '>updateDepartments()', err.message);
                } else {
                    reject(err.response);
                }
            });
    });
}

// Delete a department by ID
export function deleteDepartment(departmentId, cancelToken) {
    return new Promise(function (resolve, reject) {
        axios
            .delete(
                AppConfigProps.serverRoutePrefix + 'api/v1/departments/' + departmentId,
                cancelToken
            )
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    logMessage('warn', actionFileName + '>deleteDepartment()', err.message);
                } else {
                    reject(err.response);
                }
            });
    });
}
