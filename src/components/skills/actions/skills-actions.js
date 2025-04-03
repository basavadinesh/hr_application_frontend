import axios from "axios";
import { AppConfigProps } from "../../core/settings/app-config";
import { logMessage } from "../../core/actions/common-actions";

const actionFileName = "Skill-actions.js";


// List of users
export const getSkills = async (cancelToken) => {
  return new Promise(function (resolve, reject) {
    axios
    
      .get(
        AppConfigProps.serverRoutePrefix + "api/v1/skills",cancelToken
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage(
            "warn",
            actionFileName + ">getSkills()",
            err.message
          );
        } else {
          reject(err.response);
        }
      });
  });
};

export const viewSkillDetails  = async (id, cancelToken) => {
  return new Promise(function (resolve, reject) {
    axios
      .get(
        AppConfigProps.serverRoutePrefix + "api/v1/skills/" + id,cancelToken
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage(
            "warn",
            actionFileName + ">viewSkillDetails()",
            err.message
          );
        } else {
          reject(err.response);
        }
      });
  });
}

export const createSkills = async (skillObj, cancelToken) =>{
  return new Promise(function (resolve, reject) {
    axios
    //  .get(
    //    AppConfigProps.serverRoutePrefix + "skills" , skillObj,
    //  )
      .post(
        AppConfigProps.serverRoutePrefix + "api/v1/skills" , skillObj,cancelToken
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage("warn", actionFileName + ">createSkills()", err.message);
        } else {
          reject(err.response);
        }
      });
  });
}

export const updateSkills = async (skillId, skillObj,cancelToken) => {
  return new Promise(function (resolve, reject) {
    axios
    // .get(
    //       AppConfigProps.serverRoutePrefix + "skills/" +skillId, skillObj,
    //     )
      .put(
        AppConfigProps.serverRoutePrefix + "api/v1/skills/" + skillId, skillObj,cancelToken )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage("warn", actionFileName + ">updateSkills()", err.message);
        } else {
          reject(err.response);
        }
      });
  });
}

export const deleteSkill = async(skillId,cancelToken) => {
  return new Promise(function (resolve, reject) {
    axios
      .delete(
        AppConfigProps.serverRoutePrefix + "api/v1/skills/" + skillId,cancelToken )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage("warn", actionFileName + ">deleteSkill()", err.message);
        } else {
          reject(err.response);
        }
      });
  });
}