import React, { Component } from "react";
import {
  Form,
  Input,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
} from "reactstrap";
import { AppMsgResProps } from "../messages/app-properties";

class PageListSearchField extends Component {
  handleChange = (e) => {
    this.props.handleSearchChange(e);
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.props.searchValue) {
      this.props.handleSearchSubmit(e);
    }
  };

  handleCancel = (e) => {
    e.preventDefault();
    this.props.handleSearchCancel(e);
  };

  render() {
    return (
      <Form noValidate onSubmit={this.handleSubmit}>
        <InputGroup style={{ paddingRight: "10px" }}>
          <Input
            type="text"
            id="searchKeyword"
            placeholder="Search"
            size="15"
            maxLength="50"
            style={{
              fontSize: "0.8rem",
              height: "32px",
            }}
            value={this.props.searchValue}
            onChange={this.handleChange}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                this.handleSubmit(e);
              }
            }}
          />
          <InputGroupAddon addonType="append">
            <InputGroupText
              title={AppMsgResProps.body.form.search.label}
              style={{
                paddingLeft: "10px",
                paddingRight: "10px",
                cursor: "pointer",
                color: "#888888",
              }}
              onClick={(e) => {
                this.handleSubmit(e);
              }}
            >
              <i className="fa fa-search"></i>
            </InputGroupText>
          </InputGroupAddon>
          {this.props.searchKeyword ? (
            <InputGroupAddon addonType="append">
              <InputGroupText
                title={AppMsgResProps.body.form.clear.label}
                style={{
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  cursor: "pointer",
                  color: "#888888",
                }}
                onClick={(e) => {
                  this.handleCancel(e);
                }}
              >
                <i className="fa fa-times"></i>
              </InputGroupText>
            </InputGroupAddon>
          ) : null}
        </InputGroup>
      </Form>
    );
  }
}

export default PageListSearchField;
