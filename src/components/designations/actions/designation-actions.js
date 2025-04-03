import axios from "axios";
import { AppConfigProps } from "../../core/settings/app-config";
import { logMessage } from "../../core/actions/common-actions";

// File name for logging purposes
const actionFileName = "designation-actions.js";

// Base URL for the API (can be adjusted if needed)
const API_BASE_URL = 'http://localhost:8080';

// Function to get the list of designations
export function getDesignations(cancelToken) {
  return new Promise(function (resolve, reject) {
    axios
      .get(
        "http://localhost:8080/api/v1/designations", cancelToken
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage(
            "warn",
            actionFileName + ">getDesignations()",
            err.message
          );
        } else {
          reject(err.response);
        }
      });
  });
}

// Function to view details of a specific designation
export function viewDesignationDetails(id, cancelToken) {
  return new Promise(function (resolve, reject) {
    axios
      .get(
        AppConfigProps.serverRoutePrefix + "api/v1/designations/" + id, cancelToken
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage(
            "warn",
            actionFileName + ">viewDesignationDetails()",
            err.message
          );
        } else {
          reject(err.response);
        }
      });
  });
}

// Function to create a new designation
export function createDesignations( designationObj, cancelToken) {
  return new Promise(function (resolve, reject) {
    axios
      .post(
        AppConfigProps.serverRoutePrefix + "api/v1/designations" , designationObj, cancelToken
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage("warn", actionFileName + ">createDesignations()", err.message);
        } else {
          reject(err.response);
        }
      });
  });
}

// Function to update an existing designation
export function updateDesignations(designationId, designationObj,cancelToken) {
  return new Promise(function (resolve, reject) {
    axios
      .put(
        AppConfigProps.serverRoutePrefix + "api/v1/designations/" + designationId, designationObj, cancelToken )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage("warn", actionFileName + ">updateDesignations()", err.message);
        } else {
          reject(err.response);
        }
      });
  });
}

// Function to delete a specific designation
export function deleteDesignation(designationId, cancelToken) {
  return new Promise(function (resolve, reject) {
    axios
      .delete(
        AppConfigProps.serverRoutePrefix + "api/v1/designations/" + designationId, cancelToken )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage("warn", actionFileName + ">deleteDesignation()", err.message);
        } else {
          reject(err.response);
        }
      });
  });
}