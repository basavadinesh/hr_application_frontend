import axios from "axios";
import { logMessage } from "./common-actions";
import { getApiUrl, getApiKey } from "./common-actions";

const actionFileName = "geo-actions.js";

// Get timezone
export function getPlaceTimezone(latitude, longitude, cancelToken) {
  return new Promise(function (resolve, reject) {
    const queryParams =
      "?location=" +
      latitude +
      "," +
      longitude +
      "&timestamp=0&key=" +
      getApiKey("google-maps");
    fetch(getApiUrl("google-timezone") + queryParams, {
      mode: "cors",
    })
      .then((res) => {
        if (!res.ok) {
          reject(res.statusText);
        }
        // Read the response as json.
        return res.json();
      })
      .then((json) => {
        resolve(json);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          logMessage(
            "warn",
            actionFileName + ">getPlaceTimezone()",
            err.message
          );
        } else {
          reject(err.response);
        }
      });
  });
}
