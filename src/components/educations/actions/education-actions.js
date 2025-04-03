import axios from 'axios';
import { AppConfigProps } from '../../core/settings/app-config';
import { logMessage } from '../../core/actions/common-actions';

const actionFileName = 'Education-actions.js';


// Retrieve user data from localStorage
const userData = JSON.parse(localStorage.getItem("userData"));

/**
 * Fetch all education records.
 * @param {Object} cancelToken - Axios cancel token to handle request cancellation.
 * @returns {Promise} - Promise resolving to the response of the GET request.
 */
export function getEducation(id, cancelToken) {
    return new Promise(function (resolve, reject) {
        axios
            .get(AppConfigProps.serverRoutePrefix + 'api/v1/educationals', cancelToken)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    logMessage('warn', actionFileName + '>getEducation()', err.message);
                } else {
                    reject(err.response);
                }
            });
    });
}

/**
 * Fetch details of a specific education record.
 * @param {string} id - ID of the education record.
 * @param {Object} cancelToken - Axios cancel token to handle request cancellation.
 * @returns {Promise} - Promise resolving to the response of the GET request.
 */
export function viewEducationDetails(id, cancelToken) {
    return new Promise(function (resolve, reject) {
        axios
            .get(AppConfigProps.serverRoutePrefix + 'api/v1/educationals/' + id, cancelToken)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    logMessage('warn', actionFileName + '>viewEducationDetails()', err.message);
                } else {
                    reject(err.response);
                }
            });
    });
}


/**
 * Create a new education record.
 * @param {Object} queryObj - Query parameters for the education record.
 * @param {Array} educationObj - Array of files to be uploaded.
 * @param {Object} cancelToken - Axios cancel token to handle request cancellation.
 * @returns {Promise} - Promise resolving to the response of the POST request.
 */
export function createEducation(queryObj, educationObj, cancelToken) {
    var formdata = new FormData();
    educationObj.forEach((file) => {
        formdata.append('document', file, file.name);
    });
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    };

    return new Promise(function (resolve, reject) {
        axios
            .post(
                `${AppConfigProps.serverRoutePrefix}api/v1/educationals?education=${queryObj.education}&specification=${queryObj.specification}&institution=${queryObj.institution}&startyear=${queryObj.startyear}&endyear=${queryObj.endyear}&gpa=${queryObj.gpa}&user_id=${userData.id}`,
                formdata,
                config,
                cancelToken
            )
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    logMessage('warn', actionFileName + '>createEducation()', err.message);
                } else {
                    reject(err.response);
                }
            });
    });
}



/**
 * Update an existing education record.
 * @param {string} educationId - ID of the education record to be updated.
 * @param {Object} educationObj - Object containing updated education data.
 * @param {boolean} educationStatus - Status indicating whether documents should be updated.
 * @param {Object} cancelToken - Axios cancel token to handle request cancellation.
 * @returns {Promise} - Promise resolving to the response of the PUT request.
 */
export function updateEducation(educationId, educationObj, educationStatus, cancelToken) {
    var formdata = new FormData();

    if (educationStatus === true) {
        educationObj.documents.forEach((file) => {
            formdata.append('document', file, file.name);
        });
    } else {
        formdata.append('document', new Blob(), 'null');
    }

    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    };

    return new Promise(function (resolve, reject) {
        axios
            .put(
                `${AppConfigProps.serverRoutePrefix}api/v1/educationals/${educationId}?education=${educationObj.education}&specification=${educationObj.specification}&institution=${educationObj.institution}&startyear=${educationObj.startyear}&endyear=${educationObj.endyear}&gpa=${educationObj.gpa}`,
                formdata,
                config,
                cancelToken
            )
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    logMessage('warn', actionFileName + '>updateEducation()', err.message);
                } else {
                    reject(err.response);
                }
            });
    });
}


/**
 * Delete a specific education record.
 * @param {string} educationalId - ID of the education record to be deleted.
 * @param {Object} cancelToken - Axios cancel token to handle request cancellation.
 * @returns {Promise} - Promise resolving to the response of the DELETE request.
 */
export function deleteEducation(educationalId, cancelToken) {
    return new Promise(function (resolve, reject) {
        axios
            .delete(
                AppConfigProps.serverRoutePrefix + 'api/v1/educationals/' + educationalId,
                cancelToken
            )
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    logMessage('warn', actionFileName + '>deleteEducation()', err.message);
                } else {
                    reject(err.response);
                }
            });
    });
}
