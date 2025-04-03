import axios from 'axios';
import { AppConfigProps } from '../../core/settings/app-config';
import { logMessage } from '../../core/actions/common-actions';

const actionFileName = 'Learning-actions.js';



// Fetch all learning records
export function getLearning(id, cancelToken) {
    return new Promise(function (resolve, reject) {
        axios
            .get(AppConfigProps.serverRoutePrefix +'/api/v1/learnings', { cancelToken })
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    logMessage('warn', actionFileName + '>getLearning()', err.message);
                } else {
                    reject(err.response);
                }
            });
    });
}

// Fetch details of a specific learning record
export function viewLearningDetails(learningId, cancelToken) {
    console.log(learningId, 'helloololo')
    return new Promise(function (resolve, reject) {
        axios
            .get(AppConfigProps.serverRoutePrefix + '/api/v1/learnings/' + learningId,  cancelToken )
            .then((res) => {
                resolve(res);
                console.log('response', res)
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    logMessage('warn', actionFileName + '>viewLearningDetails()', err.message);
                } else {
                    reject(err.response);
                }
            });
    });
}

// Create a new learning record
export function createLearning(queryObj, learningObj, cancelToken) {
    var formdata = new FormData();

    // Append other fields from queryObj
    formdata.append('title', queryObj.title);
    formdata.append('completionPercentage', queryObj.completionPercentage);
    formdata.append('startDate', queryObj.startDate);
    formdata.append('completionDate', queryObj.completionDate);
    formdata.append('watchedLink', queryObj.watchedLink);
    formdata.append('user_Id', queryObj.user_id);

    // Append evidenceattachments from learningObj
    if (learningObj && learningObj.length > 0) {
        for (let i = 0; i < learningObj.length; i++) {
            formdata.append('evidenceattachments', learningObj[i]);
        }
    }

    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    };

    return new Promise(function (resolve, reject) {
        axios
            .post(
                AppConfigProps.serverRoutePrefix + "/api/v1/learnings",
                formdata,
                config,
                cancelToken
            )
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    logMessage('warn', actionFileName + '>createLearning()', err.message);
                } else {
                    reject(err.response);
                }
            });
    });
}


// Update an existing learning record
export function updateLearning(learningId, learningObj,  learningStatus, cancelToken) {
    console.log(learningId, learningObj, learningStatus, cancelToken);
      
    

    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    };

    return new Promise(function (resolve, reject) {
        axios
            .put(
                AppConfigProps.serverRoutePrefix + "/api/v1/learnings/" + learningId, learningObj,
                config,
                cancelToken
            )
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    logMessage('warn', actionFileName + '>updateLearning()', err.message);
                } else {
                    reject(err.response);
                }
            });
    });
}

// Delete a learning record
export function deleteLearning(learningId, cancelToken) {
    return new Promise(function (resolve, reject) {
        axios
            .delete(
                AppConfigProps.serverRoutePrefix + '/api/v1/learnings/' + learningId,
                cancelToken
            )
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    logMessage('warn', actionFileName + '>deleteLearning()', err.message);
                } else {
                    reject(err.response);
                }
            });
    });
}
