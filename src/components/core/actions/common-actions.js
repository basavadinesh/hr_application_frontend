import { AppURLProps } from "../settings/app-urls";
import { AppConfigProps } from "../settings/app-config";

// Manage Errors
export function manageError(err, history) {
  return new Promise(function (resolve, reject) {
    // console.error(err);
    let path = "";
    if (history.location.pathname && history.location.pathname.length > 0)
      path = path + history.location.pathname;
    if (history.location.search && history.location.search.length > 0)
      path = path + history.location.search;
    if (history.location.hash && history.location.hash.length > 0)
      path = path + history.location.hash;
    let statusCode = "";
    if (err && err.status) statusCode = err.status;
    let message = "";
    if (err && err.message) message = err.message;

    logMessage("error", path, statusCode, message);
    if (
      err &&
      (err.status === AppConfigProps.httpStatusCode.notFound ||
        err.status === AppConfigProps.httpStatusCode.unauthorized)
    ) {
      history.push(AppURLProps.pageNotFound);
    } else {
      history.push(AppURLProps.error);
    }
  });
}

export function manageImportError(err, history) {
  return new Promise((resolve) => {
    const statusCode = err && err.status ? err.status : "";
    const message = err && err.data && err.data.message ? err.data.message : "";

    // Log the error
    logMessage("error", history.location.pathname, statusCode, message);

    // Store error details in localStorage
    localStorage.setItem(
      "processingErrors",
      JSON.stringify([{ statusCode, message }])
    );

    // Redirect to the error page
    history.push("/importError");

    resolve({ statusCode, message });
  });
}



export function logMessage(type, path, statusCode, message) {
  console.log(type, path, statusCode, message);
  /*
    return new Promise(function(resolve, reject) {
      const logObj = {
        mode: "WEB",
        type: type,
        path: path,
        message: message
      };
      axios
        .post(AppConfigProps.serverRoutePrefix + "/utils/log", logObj)
        .then(res => {
          resolve(null);
        })
        .catch(err => {
          console.error(err);
          resolve(null);
        });
    });
    */
}

// Get API Key
export function getApiKey(type) {
  switch (type) {
    case "google-maps":
      //return "AIzaSyAyYm0T8IMwz5wGd1oi4BLxk2kw4-AH_8w"; old site-iq
      return process.env.REACT_APP_GOOGLE_API_KEY;
    default:
      return null;
  }
}

// Get API Key
export function getApiUrl(type) {
  switch (type) {
    case "google-maps":
      return process.env.REACT_APP_GOOGLE_MAPS_API_URL;
    case "google-timezone":
      return process.env.REACT_APP_GOOGLE_TIMEZONE_API_URL;
    default:
      return null;
  }
}
