import axios from 'axios';
import { AppConfigProps } from '../../core/settings/app-config';
import { logMessage } from '../../core/actions/common-actions';

const actionFileName = 'Timeoff-actions.js';

// Function to fetch list of leave requests
export function getLeave(cancelToken) {
    return new Promise(function (resolve, reject) {
        axios
            .get(AppConfigProps.serverRoutePrefix + 'api/v1/leave', cancelToken)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    logMessage('warn', actionFileName + '>getLeave()', err.message);
                } else {
                    reject(err.response);
                }
            });
    });
}

// Function to fetch list of leave requests
export function viewLeaveDetails(id, cancelToken) {
    return new Promise(function (resolve, reject) {
        axios
            .get(AppConfigProps.serverRoutePrefix + 'api/v1/leave/' + id, cancelToken)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    logMessage('warn', actionFileName + '>viewLeaveDetails()', err.message);
                } else {
                    reject(err.response);
                }
            });
    });
}


// Function to create a new leave request
export function createLeaves(leaveObj, cancelToken) {
    return new Promise(function (resolve, reject) {
        axios
            .post(AppConfigProps.serverRoutePrefix + 'api/v1/leave', leaveObj, cancelToken)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    logMessage('warn', actionFileName + '>createLeaves()', err.message);
                } else {
                    reject(err.response);
                }
            });
    });
}


// Function to update an existing leave request by ID
export function updateLeave(leaveId, leaveObj, cancelToken) {
    return new Promise(function (resolve, reject) {
        axios
            .put(AppConfigProps.serverRoutePrefix + 'api/v1/leave/' + leaveId, leaveObj, cancelToken)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    logMessage('warn', actionFileName + '>updateLeave()', err.message);
                } else {
                    reject(err.response);
                }
            });
    });
}

// Function to delete a leave request by ID
export function deleteLeave(leaveId, cancelToken) {
    return new Promise(function (resolve, reject) {
        axios
            .delete(AppConfigProps.serverRoutePrefix + 'api/v1/leave/' + leaveId, cancelToken)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    logMessage('warn', actionFileName + '>deleteLeave()', err.message);
                } else {
                    reject(err.response);
                }
            });
    });
}
