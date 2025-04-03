import axios from "axios";
import { AppConfigProps } from "../settings/app-config";
import { logMessage } from "./common-actions";
import AppUtils from "../helpers/app-utils";
import { manageError } from "../actions/common-actions";

const actionFileName = "identity-actions.js";

// User Login Authentication
export function loginUser(loginObj, cancelToken) {
  return new Promise(async function (resolve, reject) {
    axios
      .post(
        AppConfigProps.serverRoutePrefix + "identity/authentication",
        loginObj,
        cancelToken
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage(
            "warn",
            actionFileName + ">authenticateUser()",
            err.message
          );
        } else {
          reject(err.response);
        }
      });
  });
}

// User Set New Password
export function setPassword(passwordObj, cancelToken) {
  return new Promise(async function (resolve, reject) {
    axios
      .put(
        AppConfigProps.serverRoutePrefix + "identity/authentication",
        passwordObj,
        cancelToken
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage(
            "warn",
            actionFileName + ">authenticateUser()",
            err.message
          );
        } else {
          reject(err.response);
        }
      });
  });
}

// User Recover Password initiation
export function recoverPassword(recoverObj, cancelToken) {
  return new Promise(async function (resolve, reject) {
    axios
      .post(
        AppConfigProps.serverRoutePrefix + "identity/password",
        recoverObj,
        cancelToken
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage(
            "warn",
            actionFileName + ">recoverPassword()",
            err.message
          );
        } else {
          reject(err.response);
        }
      });
  });
}

// User Recover Password update
export function resetPassword(passwordObj, cancelToken) {
  return new Promise(async function (resolve, reject) {
    axios
      .put(
        AppConfigProps.serverRoutePrefix + "identity/password",
        passwordObj,
        cancelToken
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage("warn", actionFileName + ">resetPassword()", err.message);
        } else {
          reject(err.response);
        }
      });
  });
}

// Get User Profile
export function getProfile(cancelToken) {
  return new Promise(async function (resolve, reject) {
    axios
      .get(AppConfigProps.serverRoutePrefix + "identity/profile", cancelToken)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage("warn", actionFileName + ">getProfile()", err.message);
        } else {
          reject(err.response);
        }
      });
  });
}

// User Password change
export function changePassword(passwordObj, cancelToken) {
  return new Promise(async function (resolve, reject) {
    axios
      .patch(
        AppConfigProps.serverRoutePrefix + "identity/profile",
        passwordObj,
        cancelToken
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage("warn", actionFileName + ">changePassword()", err.message);
        } else {
          reject(err.response);
        }
      });
  });
}

// User Profile Update
export function updateProfile(profileObj, cancelToken) {
  return new Promise(async function (resolve, reject) {
    axios
      .put(
        AppConfigProps.serverRoutePrefix + "identity/profile",
        profileObj,
        cancelToken
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage("warn", actionFileName + ">updateProfile()", err.message);
        } else {
          reject(err.response);
        }
      });
  });
}

// Refresh User Token
export function refreshToken(cancelToken) {
  return new Promise(async function (resolve, reject) {
    const refreshToken = AppUtils.getIdentityRefershToken();
    if (refreshToken) {
      const tokenObj = {
        refreshToken: refreshToken,
      };

      axios
        .post(
          AppConfigProps.serverRoutePrefix + "identity/token",
          tokenObj,
          cancelToken
        )
        .then((res) => {
          if (
            res &&
            res.status === AppConfigProps.httpStatusCode.ok &&
            res.data &&
            res.data.result &&
            res.data.result.AuthenticationResult
          ) {
            AppUtils.setIdentityToken(
              res.data.result.AuthenticationResult.IdToken,
              refreshToken,
              res.data.result.AuthenticationResult.AccessToken
            );
          } else {
            // TO DO : need to change
            //manageError(res, this.props.history);
          }
          resolve(res);
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            logMessage("warn", actionFileName + ">refreshToken()", err.message);
          } else {
            // TO DO : need to change
            //manageError(err, this.props.history);
          }
          reject(err.response);
        });
    }
  });
}

// User Logout
export function logoutUser(cancelToken) {
  return new Promise(async function (resolve, reject) {
    // TODO, save logout user access log
    AppUtils.removeIdentityToken();
    resolve(true);
  });
}

// Get User Role
export function getUserRole(cancelToken) {
  return new Promise(async function (resolve, reject) {
    axios
      .get(
        AppConfigProps.serverRoutePrefix + "users/roles?filterType=item",
        cancelToken
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage("warn", actionFileName + ">getUserRole()", err.message);
        } else {
          reject(err.response);
        }
      });
  });
}

// Get all User Role Parts
export function listUserRoleAppParts(cancelToken) {
  return new Promise(async function (resolve, reject) {
    axios
      .get(
        AppConfigProps.serverRoutePrefix +
          "users/roles/app-parts?filterType=list",
        cancelToken
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage(
            "warn",
            actionFileName + ">listUserRoleAppParts()",
            err.message
          );
        } else {
          reject(err.response);
        }
      });
  });
}

// Get User Role Privilege of specific Parts
export function getUserRoleAppPartsPrivilege(partCodes, cancelToken) {
  return new Promise(async function (resolve, reject) {
    axios
      .get(
        AppConfigProps.serverRoutePrefix +
          "users/roles/app-parts?filterType=items&partCodes=" +
          partCodes,
        cancelToken
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage(
            "warn",
            actionFileName + ">getUserRoleAppPartsPrivilege()",
            err.message
          );
        } else {
          reject(err.response);
        }
      });
  });
}

// Get User Role Privilege of specific Parts, used in components
export async function getPagePartsPrivilege(partCodes, cancelToken) {
  let output = {};
  if (partCodes && partCodes.length > 0) {
    await partCodes.forEach((part) => {
      output[part] = false;
    });
  }
  await getUserRoleAppPartsPrivilege(partCodes.join(","), cancelToken)
    .then(async (res) => {
      if (
        res.status === AppConfigProps.httpStatusCode.ok &&
        res.data &&
        res.data.records
      ) {
        if (res.data.records.length > 0) {
          const partPrivs = res.data.records;
          await partPrivs.forEach(async (item) => {
            if (item.privilegeStatus === 1) {
              output[item.partCode] = true;
            }
          });
        }
      } else {
        await manageError(res, this.props.history);
      }
    })
    .catch(async (err) => {
      await manageError(err, this.props.history);
    });
  return output;
}

// Check if one Part is accessible to the User
export async function isPagePartPrivileged(partCode, cancelToken) {
  let privStatus = false;

  await getUserRoleAppPartsPrivilege(partCode, cancelToken)
    .then(async (res) => {
      if (
        res.status === AppConfigProps.httpStatusCode.ok &&
        res.data &&
        res.data.records
      ) {
        if (res.data.records.length > 0) {
          const partPrivs = res.data.records;
          if (partPrivs && partPrivs.length > 0) {
            const partPriv = await partPrivs.find((item) => {
              return item.partCode === partCode;
            });
            if (partPriv.privilegeStatus === 1) {
              privStatus = true;
            }
          }
        }
      } else {
        await manageError(res, this.props.history);
      }
    })
    .catch(async (err) => {
      await manageError(err, this.props.history);
    });
  return privStatus;
}

// Check if multiple Parts is accessible to the User
export async function isPagePartsPrivileged(partCodes, condition, cancelToken) {
  let privStatus = false;
  await getUserRoleAppPartsPrivilege(partCodes.join(","), cancelToken)
    .then(async (res) => {
      if (
        res.status === AppConfigProps.httpStatusCode.ok &&
        res.data &&
        res.data.records
      ) {
        if (res.data.records.length > 0) {
          const partPrivs = res.data.records;
          let trueCount = 0;
          if (partPrivs && partPrivs.length > 0) {
            await partCodes.forEach(async (part) => {
              await partPrivs.forEach(async (item) => {
                if (part === item.partCode && item.privilegeStatus === 1) {
                  trueCount++;
                }
              });
            });
          }

          if (condition === "OR" && trueCount > 0) {
            privStatus = true;
          } else if (condition === "AND" && partCodes.length === trueCount) {
            privStatus = true;
          }
        }
      } else {
        await manageError(res, this.props.history);
      }
    })
    .catch(async (err) => {
      await manageError(err, this.props.history);
    });
  return privStatus;
}

// Get User Organization
export function getUserOrganization(cancelToken) {
  return new Promise(async function (resolve, reject) {
    axios
      .get(
        AppConfigProps.serverRoutePrefix +
          "users/organizations?filterType=item",
        cancelToken
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage(
            "warn",
            actionFileName + ">getUserOrganization()",
            err.message
          );
        } else {
          reject(err.response);
        }
      });
  });
}

// Demo Registration
export function demoRegistration(demoObj, cancelToken) {
  return new Promise(async function (resolve, reject) {
    axios
      .post(
        AppConfigProps.serverRoutePrefix + "general/demo-registration",
        demoObj,
        cancelToken
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage(
            "warn",
            actionFileName + ">demoRegistration()",
            err.message
          );
        } else {
          reject(err.response);
        }
      });
  });
}