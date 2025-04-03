import axios from "axios";
import { AppConfigProps } from "../settings/app-config";
import { logMessage } from "./common-actions";

const actionFileName = "site-visitor-actions.js";

export function checkTicketApproval(alertTicketId, cancelToken) {
  return new Promise(function (resolve, reject) {
    axios
      .get(
        AppConfigProps.serverRoutePrefix +
        "general" + "/tickets-client-approval/" + alertTicketId,
        cancelToken
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage("warn", actionFileName + ">checkTicketApproval()", err.message);
        } else {
          reject(err.response);
        }
      });
  });
}

export function acceptApproval(alertTicketId, queryData, acceptData, cancelToken) {
  return new Promise(function (resolve, reject) {
    axios
      .post(
        AppConfigProps.serverRoutePrefix +
        "general" + "/tickets-client-approval/" + alertTicketId + "?approveStatus=" + queryData, acceptData,
        cancelToken
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage("warn", actionFileName + ">acceptApproval()", err.message);
        } else {
          reject(err.response);
        }
      });
  });
}

export function rejectApproval(alertTicketId, queryData, rejectData, cancelToken) {
  return new Promise(function (resolve, reject) {
    axios
      .post(
        AppConfigProps.serverRoutePrefix +
        "general" + "/tickets-client-approval/" + alertTicketId + "?approveStatus=" + queryData, rejectData,
        cancelToken
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage("warn", actionFileName + ">rejectApproval()", err.message);
        } else {
          reject(err.response);
        }
      });
  });
}

//Get User Notifications

export function getNotifications(queryData, cancelToken) {
  return new Promise(function (resolve, reject) {
    axios
      .get(
        AppConfigProps.serverRoutePrefix +
        "general/notification-types?" +
        queryData,
        cancelToken
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage("warn", actionFileName + ">getNotifications()", err.message);
        } else {
          reject(err.response);
        }
      });
  });
}

//Get User Events

export function getEvents(queryData, cancelToken) {
  return new Promise(function (resolve, reject) {
    axios
      .get(
        AppConfigProps.serverRoutePrefix +
        "general/notification-events?" +
        queryData,
        cancelToken
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage("warn", actionFileName + ">getEvents()", err.message);
        } else {
          reject(err.response);
        }
      });
  });
}

//Get User Notifications active

export function getActiveNotifications(activeQueryData, cancelToken) {
  return new Promise(function (resolve, reject) {
    axios
      .get(
        AppConfigProps.serverRoutePrefix + "general/" +
        "user-notifications?" +
        activeQueryData,
        cancelToken
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage("warn", actionFileName + ">getActiveNotifications()", err.message);
        } else {
          reject(err.response);
        }
      });
  });
}

//Test User Notifications active

export function testActiveNotifications( cancelToken) {
  return new Promise(function (resolve, reject) {
    axios
      .get(
        "http://localhost:3002/newevents",
        cancelToken
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage("warn", actionFileName + ">testActiveNotifications()", err.message);
        } else {
          reject(err.response);
        }
      });
  });
}