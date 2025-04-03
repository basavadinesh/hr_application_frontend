import axios from "axios";
import { AppConfigProps } from "../../core/settings/app-config";
import { logMessage } from "../../core/actions/common-actions";

const actionFileName = "holiday-actions.js";

// Fetch the list of holidays
export function getHolidays(cancelToken) {
  return new Promise(function (resolve, reject) {
    axios
      .get(
        AppConfigProps.serverRoutePrefix + "api/v1/holidays", cancelToken
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage(
            "warn",
            actionFileName + ">getHolidays()",
            err.message
          );
        } else {
          reject(err.response);
        }
      });
  });
}

// Fetch details of a specific holiday by ID
export function viewHolidayDetails(id, cancelToken) {
  return new Promise(function (resolve, reject) {
    axios
      .get(
        AppConfigProps.serverRoutePrefix + "api/v1/holidays/" + id, cancelToken
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage(
            "warn",
            actionFileName + ">viewHolidayDetails()",
            err.message
          );
        } else {
          reject(err.response);
        }
      });
  });
}

// Create a new holiday
export function createholidays( holidayObj, cancelToken) {
  return new Promise(function (resolve, reject) {
    axios
      .post(
        AppConfigProps.serverRoutePrefix + "api/v1/holidays/" , holidayObj, cancelToken
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage("warn", actionFileName + ">createHolidays()", err.message);
        } else {
          reject(err.response);
        }
      });
  });
}

// Update an existing holiday by ID
export function updateHolidays(holidayId, holidayObj, cancelToken) {
  return new Promise(function (resolve, reject) {
    axios
      .put(
        AppConfigProps.serverRoutePrefix + "api/v1/holidays/" + holidayId, holidayObj, cancelToken )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage("warn", actionFileName + ">updateHolidays()", err.message);
        } else {
          reject(err.response);
        }
      });
  });
}


// Delete a holiday by ID
export function deleteHoliday(holidayId, cancelToken) {
  return new Promise(function (resolve, reject) {
    axios
      .delete(
        AppConfigProps.serverRoutePrefix + "api/v1/holidays/" + holidayId, cancelToken )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage("warn", actionFileName + ">deleteHoliday()", err.message);
        } else {
          reject(err.response);
        }
      });
  });
}