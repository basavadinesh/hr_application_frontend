import axios from "axios";
import { AppConfigProps } from "../../core/settings/app-config";
import { logMessage } from "../../core/actions/common-actions";

const actionFileName = "Empattendance-actions.js";

// List of users
export function getCheckin(cancelToken) {
  return new Promise(function (resolve, reject) {
    axios
      .get(
        AppConfigProps.serverRoutePrefix + "api/v1/checkin",cancelToken
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage(
            "warn",
            actionFileName + ">getCheckin()",
            err.message
          );
        } else {
          reject(err.response);
        }
      });
  });
}

export function viewCheckinDetails(id,cancelToken) {
  return new Promise(function (resolve, reject) {
    axios
      .get(
        AppConfigProps.serverRoutePrefix + "/api/v1/employee_attendance/check_in/" + id,cancelToken
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage(
            "warn",
            actionFileName + ">viewCheckinDetails()",
            err.message
          );
        } else {
          reject(err.response);
        }
      });
  });
}

export function getCheckout(cancelToken) {
    return new Promise(function (resolve, reject) {
      axios
        .get(
          AppConfigProps.serverRoutePrefix + "api/v1/checkout",cancelToken
        )
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            logMessage(
              "warn",
              actionFileName + ">getCheckout()",
              err.message
            );
          } else {
            reject(err.response);
          }
        });
    });
  }
  
  export function viewCheckoutDetails(id,cancelToken) {
    return new Promise(function (resolve, reject) {
      axios
        .get(
          AppConfigProps.serverRoutePrefix + "/api/v1/employee_attendance/check_out/" + id,cancelToken
        )
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            logMessage(
              "warn",
              actionFileName + ">viewCheckoutDetails()",
              err.message
            );
          } else {
            reject(err.response);
          }
        });
    });
  }
  
  