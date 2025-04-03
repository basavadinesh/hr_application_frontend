import axios from 'axios';
import { AppConfigProps } from '../../core/settings/app-config';
import { logMessage } from '../../core/actions/common-actions';

const actionFileName = 'Project-action.js';
const API_BASE_URL = 'http://localhost:8080';

// Fetch all projects
export function getProjects(_cancelToken) {
    return new Promise(function (resolve, reject) {
        axios
            .get(AppConfigProps.serverRoutePrefix + '/api/v1/projects/', _cancelToken)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    logMessage('warn', actionFileName + '>getProjects()', err.message);
                } else {
                    reject(err.response);
                }
            });
    });
}


// View details of a specific project
export function viewProjectDetails(id) {
    return new Promise(function (resolve, reject) {
        axios
            .get(AppConfigProps.serverRoutePrefix + '/api/v1/projects/' + id)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    logMessage('warn', actionFileName + '>viewProjectDetails()', err.message);
                } else {
                    reject(err.response);
                }
            });
    });
}


// Fetch projects by name
export function getProjectsNames(_cancelToken, projectName) {
    return new Promise(function (resolve, reject) {
        axios
            .get(
                AppConfigProps.serverRoutePrefix + `/api/v1/projects/name/` + projectName,
                { _cancelToken }
            )

            .then((res) => {
                resolve(res);
                console.log(res.data);
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    logMessage('warn', actionFileName + '>getProjectsNames()', err.message);
                } else {
                    reject(err.response);
                }
            });
    });
}


// Create a new project
export function createProjects(projectObj) {
    return new Promise(function (resolve, reject) {
        axios
            .post(AppConfigProps.serverRoutePrefix + '/api/v1/projects', projectObj)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    logMessage('warn', actionFileName + '>createProjects()', err.message);
                } else {
                    reject(err.response);
                }
            });
    });
}


// Update an existing project
export function updateProjects(projectId, projectObj) {
    console.log('Project ID:', projectId);
    return new Promise(function (resolve, reject) {
        axios
            .put(AppConfigProps.serverRoutePrefix + '/api/v1/projects/' + projectId, projectObj)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    logMessage('warn', actionFileName + '>updateProjects()', err.message);
                } else {
                    reject(err.response);
                }
            });
    });
}

// Delete a project
export function deleteProject(projectId) {
    return new Promise(function (resolve, reject) {
        axios
            .delete(AppConfigProps.serverRoutePrefix + '/api/v1/projects/' + projectId)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    logMessage('warn', actionFileName + '>deleteProjects()', err.message);
                } else {
                    reject(err.response);
                }
            });
    });
}
