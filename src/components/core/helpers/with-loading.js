import React, { Component } from "react";
import { Spinner } from "reactstrap";

class WithLoading extends Component {
  render() {
    if (this.props.isPageDataFetched) {
      return this.props.children;
    } else {
      let size = "md";
      if (this.props.size) {
        size = this.props.size;
      }
      let type = "page";
      if (this.props.type) {
        type = this.props.type;
      }
      let divClass = "";
      let divStyle = {};
      if (type === "page") {
        divClass = "page-content-space";
      } else if (type === "layout") {
        divClass = "d-flex no-block justify-content-center align-items-center";
        divStyle = { minHeight: "100vh" };
      } else if (type === "field") {
      }
      return (
        <div className={divClass} style={divStyle}>
          <Spinner size={size} color="secondary" />
        </div>
      );
    }
  }
}

export default WithLoading;
