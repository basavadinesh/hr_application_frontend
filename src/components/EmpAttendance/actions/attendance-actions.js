import axios from "axios";
import { AppConfigProps } from "../../core/settings/app-config";
import { logMessage } from "../../core/actions/common-actions";

const actionFileName = "Attendance-actions.js"; 

// List of users
export function getAttendances(cancelToken) {
  return new Promise(function (resolve, reject) {
    axios
      .get(
        AppConfigProps.serverRoutePrefix + "api/v1/attendance",cancelToken
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage(
            "warn",
            actionFileName + ">getAttendances()",
            err.message
          );
        } else {
          reject(err.response);
        }
      });
  });
}

export function viewAttendanceDetails(id,cancelToken) {
  return new Promise(function (resolve, reject) {
    axios
      .get(
        AppConfigProps.serverRoutePrefix + "api/v1/attendance/" + id,cancelToken
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage(
            "warn",
            actionFileName + ">viewAttendanceDetails()",
            err.message
          );
        } else {
          reject(err.response);
        }
      });
  });
}

export function createAttendance( attendanceObj,cancelToken) {
  return new Promise(function (resolve, reject) {
    axios
      .post(
        AppConfigProps.serverRoutePrefix + "api/v1/attendance" , attendanceObj,cancelToken
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage("warn", actionFileName + ">createAttendance()", err.message);
        } else {
          reject(err.response);
        }
      });
  });
}

export function updateEmployees(attendanceId, attendanceObj,cancelToken) {
  return new Promise(function (resolve, reject) {
    axios
      .put(
        AppConfigProps.serverRoutePrefix + "api/v1/attendance/" + attendanceId, attendanceObj,cancelToken )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage("warn", actionFileName + ">updateAttendance()", err.message);
        } else {
          reject(err.response);
        }
      });
  });
}

export function deleteAttendance(attendanceId,cancelToken) {
  return new Promise(function (resolve, reject) {
    axios
      .delete(
        AppConfigProps.serverRoutePrefix + "api/v1/attendance/" + attendanceId,cancelToken )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage("warn", actionFileName + ">deleteAttendance()", err.message);
        } else {
          reject(err.response);
        }
      });
  });
}