import React, { Component } from "react";
import { Input, InputGroup, InputGroupText, InputGroupAddon } from "reactstrap";
import { AppMsgResProps } from "../messages/app-properties";
import { getApiUrl, getApiKey } from "../actions/common-actions";

class GeoAddressSearchField extends Component {
  componentDidMount() {
    this.loadGoogleMap();
  }

  loadGoogleMap = () => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `${getApiUrl("google-maps")}?key=${getApiKey(
        "google-maps"
      )}&libraries=places`;
      //script.defer = "defer";
      //script.async = "async";
      var scriptItem = document.getElementsByTagName("script")[0];
      scriptItem.parentNode.insertBefore(script, scriptItem);

      /*
      var style = document.createElement("link");
      style.rel = "stylesheet";
      style.href = "https://fonts.googleapis.com/css?family=Roboto";
      var styleItem = document.getElementsByTagName("link")[0];
      styleItem.parentNode.insertBefore(style, styleItem);
      */

      // Below is important.
      //We cannot access google.maps until it's finished loading
      script.addEventListener("load", (e) => {
        this.onScriptLoad();
      });
    } else {
      this.onScriptLoad();
    }
  };

  onScriptLoad = () => {
    let autocomplete = new window.google.maps.places.Autocomplete(
      document.getElementById("addressAutocomplete"),
      { types: ["address"] } //geocode, address, establishment
    );
    autocomplete.setFields(["address_component", "geometry"]);
    autocomplete.setComponentRestrictions({ country: ["us"] });

    autocomplete.addListener("place_changed", () => {
      if (this.props.formik)
        this.props.callback(autocomplete.getPlace(), this.props.formik);
      else this.props.callback(autocomplete.getPlace());
      document.getElementById("addressAutocomplete").value = "";
    });
  };

  render() {
    return (
      <div className="form-group">
        <InputGroup>
          <Input
            type="text"
            name="addressAutocomplete"
            id="addressAutocomplete"
            placeholder={AppMsgResProps.body.form.searchAddress.label}
            maxLength="200"
            defaultValue=""
          />
          <InputGroupAddon addonType="append">
            <InputGroupText
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <i className="fa fa-search"></i>
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </div>
    );
  }
}

export default GeoAddressSearchField;
