import { AppMsgResProps } from "../messages/app-properties";
import { AppConfigProps } from "../settings/app-config";

export default class PageUtils {
  static getHeadTitle(title) {
    return `${AppMsgResProps.head.title.default} - ${title}`;
  }

  static scrollToTop(currProps = null, prevProps = null) {
    if (currProps && prevProps) {
      if (currProps.location.pathname !== prevProps.location.pathname) {
        window.scrollTo(0, 0);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }

  static getQueryParams(locationSearch) {
    if (locationSearch && locationSearch.trim().length > 1) {
      let queryString = locationSearch.substring(1, locationSearch.length);
      if (queryString && queryString.trim().length > 0) {
        let stringArr = queryString.split("&");
        if (stringArr && stringArr.length > 0) {
          let queryParams = {};
          for (let i = 0; i < stringArr.length; i++) {
            let paramData = stringArr[i].split("=");
            if (paramData && paramData.length === 2) {
              queryParams[paramData[0]] = paramData[1];
            }
          }
          return queryParams;
        }
      }
    }
    return null;
  }

  static sortListRecords(list, sortColumn, sortOrder, sortType) {
    return new Promise(async function (resolve, reject) {
      if (sortType === null || sortType === "") sortType = "string";
      if (list && list.length > 0) {
        let sortRecords = list.sort((firstItem, secondItem) => {
          if (sortType === "integer") {
            if (
              sortOrder === AppConfigProps.listPage.sortOrder.ascendingValue
            ) {
              return(
                secondItem[sortColumn] - firstItem[sortColumn]
              );
            } else {
              return(
                firstItem[sortColumn] - secondItem[sortColumn]
              );
            }
          } else if (sortType === "string") {
            if (
              sortOrder === AppConfigProps.listPage.sortOrder.ascendingValue
            ) {
              return firstItem[sortColumn].localeCompare(
                secondItem[sortColumn],
                "en",
                {
                  numeric: true,
                }
              );
            } else {
              return secondItem[sortColumn].localeCompare(
                firstItem[sortColumn],
                "en",
                {
                  numeric: true,
                }
              );
            }
          }
        });
        resolve(sortRecords);
      } else {
        resolve(list);
      }
    });
  }

  static sliceListRecords(list, pageOffset, pageLimit) {
    return new Promise(async function (resolve, reject) {
      if (list && list.length > 0 && pageOffset >= 0 && pageLimit > 0) {
        let start = pageOffset * pageLimit;
        let end = start + pageLimit;
        if (end > list.length) end = list.length;

        let sliceRecords = await list.slice(start, end);
        resolve(sliceRecords);
      } else {
        resolve(list);
      }
    });
  }

  static getGeoAddressFieldsData(place) {
    if (place) {
      let streetAddress1 = "",
        streetAddress2 = "",
        city = "",
        state = "",
        country = "",
        zipCode = "",
        locationLatitude = "",
        locationLongitude = "";

      for (let i = 0; i < place.address_components.length; i++) {
        let addressType = place.address_components[i].types[0];
        if (addressType === "street_number")
          streetAddress1 = place.address_components[i].long_name;

        if (addressType === "route")
          streetAddress1 !== ""
            ? (streetAddress1 =
              streetAddress1 + " " + place.address_components[i].short_name)
            : (streetAddress1 = place.address_components[i].short_name);
        /*
      if (addressType === "route")
        streetAddress1 !== ""
          ? (streetAddress1 =
              streetAddress1 + ", " + place.address_components[i].long_name)
          : (streetAddress1 = place.address_components[i].long_name);

      if (addressType === "sublocality_level_2")
        streetAddress1 !== ""
          ? (streetAddress1 =
              streetAddress1 + ", " + place.address_components[i].long_name)
          : (streetAddress1 = place.address_components[i].long_name);

      if (addressType === "sublocality_level_1")
        streetAddress1 !== ""
          ? (streetAddress1 =
              streetAddress1 + ", " + place.address_components[i].long_name)
          : (streetAddress1 = place.address_components[i].long_name);

      if (addressType === "locality")
        streetAddress2 = place.address_components[i].long_name;

      if (addressType === "administrative_area_level_2")
        city = place.address_components[i].long_name;
*/
        if (addressType === "locality")
          city = place.address_components[i].long_name;
        if (addressType === "administrative_area_level_1")
          state = place.address_components[i].long_name;

        if (addressType === "country")
          country = place.address_components[i].long_name;

        if (addressType === "postal_code")
          zipCode = place.address_components[i].short_name;
      }

      if (place.geometry && place.geometry.location) {
        locationLatitude = place.geometry.location.lat();
        locationLongitude = place.geometry.location.lng();
      }
      const address = {
        streetAddress1: streetAddress1,
        streetAddress2: streetAddress2,
        city: city,
        state: state,
        country: country,
        zipCode: zipCode,
        locationLatitude: locationLatitude,
        locationLongitude: locationLongitude,
      };
      return address;
    }
    return null;
  }

  static downloadCSVFile(csvFileName, csvFileData) {
    if (window.navigator.msSaveBlob) {
      // IE 10 and later, and Edge.
      let blobObject = new Blob([csvFileData], { type: "text/csv" });
      window.navigator.msSaveBlob(blobObject, csvFileName);
    } else {
      // Everthing else (except old IE).
      // Create a dummy anchor (with a download attribute) to click.
      let anchor = document.createElement("a");
      anchor.download = csvFileName;
      if (window.URL.createObjectURL) {
        // Everything else new.
        let blobObject = new Blob([csvFileData], { type: "text/csv" });
        anchor.href = window.URL.createObjectURL(blobObject);
      } else {
        // Fallback for older browsers (limited to 2MB on post-2010 Chrome).
        // Load up the data into the URI for "download."
        anchor.href =
          "data:text/csv;charset=utf-8," + encodeURIComponent(csvFileData);
      }
      // Now, click it.
      if (document.createEvent) {
        let event = document.createEvent("MouseEvents");
        event.initEvent("click", true, true);
        anchor.dispatchEvent(event);
      } else {
        anchor.click();
      }
    }
  }
}
