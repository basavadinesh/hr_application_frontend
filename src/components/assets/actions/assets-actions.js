import axios from "axios";
import { AppConfigProps } from "../../core/settings/app-config";
import { logMessage } from "../../core/actions/common-actions";

const actionFileName = "deparment-actions.js";

// Fetches a list of assets
export function getAssets(cancelToken) {
  return new Promise(function (resolve, reject) {
    axios
      .get(
        AppConfigProps.serverRoutePrefix + "/api/v1/assets", cancelToken
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage(
            "warn",
            actionFileName + ">getAssets()",
            err.message
          );
        } else {
          reject(err.response);
        }
      });
  });
}

// Fetches details of a specific asset by its ID
export function viewAssetsDetails(id, cancelToken) {
  return new Promise(function (resolve, reject) {
    axios
      .get(
        AppConfigProps.serverRoutePrefix + "/api/v1/assets/" + id, cancelToken
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage(
            "warn",
            actionFileName + ">viewAssetsDetails()",
            err.message
          );
        } else {
          reject(err.response);
        }
      });
  });
}

// Creates a new asset with the provided asset object
export function createAssets(assetObj, cancelToken) {
  return new Promise(function (resolve, reject) {
    axios
      .post(
        AppConfigProps.serverRoutePrefix + "/api/v1/assets", assetObj, cancelToken
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage("warn", actionFileName + ">createAssets()", err.message);
        } else {
          reject(err.response);
        }
      });
  });
}

// Updates an existing asset with the given asset ID and asset object
export function updateAssets(assetId, assetObj, cancelToken) {
  return new Promise(function (resolve, reject) {
    axios
      .put(
        AppConfigProps.serverRoutePrefix + "/api/v1/assets/" + assetId, assetObj, cancelToken)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage("warn", actionFileName + ">updateAssets()", err.message);
        } else {
          reject(err.response);
        }
      });
  });
}

// Returns an asset by its ID, typically used when an asset is being returned
export function returnAssets(assetId, assetObj, cancelToken) {
  return new Promise(function (resolve, reject) {
    axios
      .put(
        AppConfigProps.serverRoutePrefix + "/api/v1/assetreturn/" + assetId, assetObj, cancelToken)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage("warn", actionFileName + ">returnAssets()", err.message);
        } else {
          reject(err.response);
        }
      });
  });
}


// Deletes an asset by its ID
export function deleteAsset(assetId, cancelToken) {
  return new Promise(function (resolve, reject) {
    axios
      .delete(
        AppConfigProps.serverRoutePrefix + "/api/v1/assets/" + assetId, cancelToken)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage("warn", actionFileName + ">deleteAsset()", err.message);
        } else {
          reject(err.response);
        }
      });
  });
}