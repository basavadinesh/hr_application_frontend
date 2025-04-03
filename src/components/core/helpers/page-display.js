import React from "react";
import { Button, Spinner, Alert, Label } from "reactstrap";
import { NavLink as RRNavLink } from "react-router-dom";
import { ErrorMessage } from "formik";
import classnames from "classnames";
import { AppMsgResProps } from "../messages/app-properties";

export default class PageDisplay {
  static showGoBackLink(type, url, history, objRef = null) {
    let fontClass = "";
    if (type === "L") fontClass = "sram-icon-large";
    else if (type === "M") fontClass = "sram-icon-medium";
    else fontClass = "sram-icon-small";
    return (
      <RRNavLink
        to={url}
        title={AppMsgResProps.body.form.goBack.label}
        innerRef={objRef}
        /*
        onClick={(e) => {
          e.preventDefault();
          history.goBack();
        }}
        */
        className="sram-page-action-icon"
      >
        <i
          className={`fas fa-arrow-circle-left sram-icon-back ${fontClass}`}
        ></i>
      </RRNavLink>
    );
  }

  static showAddLink(size, url, label, objRef = null) {
    let fontClass = "";
    if (size === "L") fontClass = "sram-icon-large";
    else if (size === "M") fontClass = "sram-icon-medium";
    else fontClass = "sram-icon-small";
    return (
      <RRNavLink
        to={url}
        title={label}
        innerRef={objRef}
        className="sram-page-action-icon"
      >
        <i className={`fas fa-plus-circle sram-icon-add ${fontClass}`}></i>
      </RRNavLink>
    );
  }

  static showViewLink(size, url, label, objRef = null) {
    let fontClass = "";
    if (size === "L") fontClass = "sram-icon-large";
    else if (size === "M") fontClass = "sram-icon-medium";
    else fontClass = "sram-icon-small";
    return (
      <RRNavLink
        to={url}
        title={label}
        innerRef={objRef}
        className="sram-page-action-icon ml-3"
      >
        <i
          className={`d-inline far fa-dot-circle sram-icon-view ${fontClass}`}
        ></i>
      </RRNavLink>
    );
  }

  static showEditLink(size, url, label, objRef = null) {
    let fontClass = "";
    if (size === "L") fontClass = "sram-icon-large";
    else if (size === "M") fontClass = "sram-icon-medium";
    else fontClass = "sram-icon-small";
    return (
      <RRNavLink
        to={url}
        title={label}
        innerRef={objRef}
        className="sram-page-action-icon ml-3"
      >
        <i className={`d-inline far fa-edit sram-icon-view ${fontClass}`}></i>
      </RRNavLink>
    );
  }

  static showActionLink(size, type, url, label, objRef = null) {
    let fontClass = "";
    if (size === "L") fontClass = "sram-icon-large";
    else if (size === "M") fontClass = "sram-icon-medium";
    else fontClass = "sram-icon-small";
    let iconType = "";
    if (type === "A") iconType = "fa fa-tasks";
    return (
      <RRNavLink
        to={url}
        title={label}
        innerRef={objRef}
        className="sram-page-action-icon ml-3"
      >
        <i className={`d-inline ${iconType} sram-icon-action ${fontClass}`}></i>
      </RRNavLink>
    );
  }

  static showCancelButton(history, url = null) {
    return (
      <Button
        type="button"
        className="sram-btn-white sram-form-btn mr-3"
        onClick={() => (url ? url : history.goBack())}
      >
        {AppMsgResProps.body.form.cancel.label}
      </Button>
    );
  }

  static showSaveButton(isSubmitting, buttonType = "submit") {
    return (
      <Button
        type={buttonType}
        className="sram-btn-blue sram-form-btn mr-3"
        disabled={isSubmitting}
      >
        {AppMsgResProps.body.form.save.label}
        {isSubmitting ? (
          <Spinner size="sm" color="light" className="pb-1 ml-2" />
        ) : null}
      </Button>
    );
  }

  static showWarningNotification(message) {
    return (
      <Alert
        color="warning"
        fade={true}
        className="bg-white border-warning rounded-lg text-warning mb-4"
      >
        <span className="d-inline float-left mr-3">
          <i className="fas fa-exclamation-circle font-22"></i>
        </span>
        <span>{message}</span>
      </Alert>
    );
  }
  static showErrorNotification(message) {
    return (
      <Alert
        color="danger"
        fade={true}
        className="bg-white border-danger rounded-lg text-danger mb-4"
      >
        <span className="d-inline float-left mr-3">
          <i className="fas fa-times-circle font-22"></i>
        </span>
        <span>{message}</span>
      </Alert>
    );
  }

  static showSuccessNotification(message) {
    return (
      <Alert
        color="success"
        fade={true}
        className="bg-white border-success rounded-lg text-success mb-4"
      >
        <span className="d-inline float-left mr-3">
          <i className="fas fa-check-circle font-22"></i>
        </span>
        <span>{message}</span>
      </Alert>
    );
  }

  static getFormikFieldClassName(fieldErrors, fieldTouched) {
    return classnames(
      { "form-control": true },
      {
        "is-invalid": fieldErrors && fieldTouched,
      }
    );
  }
  static getFormikFieldErrorMessage(fieldName) {
    return (
      <ErrorMessage
        name={fieldName}
        component="div"
        className="invalid-feedback d-block"
      />
    );
  }
  static getFormFieldLabelValue(label, value) {
    return (
      <>
        <Label className="d-block font-light">{label}</Label>
        <Label className="d-flex font-medium">{value ? value : "-"}</Label>
      </>
    );
  }

  static getFormEnterSubmitEvent() {
    return {
      onKeyDown: (e) => {
        if (
          e.target.type !== "textarea" &&
          e.target.type !== "submit" &&
          e.keyCode === 13
        ) {
          e.preventDefault();
        }
      },
    };
  }

  static getListPageRecordsDisplayInfo(recordCount, pageOffset, pageLimit) {
    if (recordCount !== null && recordCount > 0) {
      let start = parseInt(pageOffset * pageLimit + 1);
      let end = parseInt(pageOffset * pageLimit + pageLimit);
      if (end > recordCount) end = recordCount;
      let total = recordCount;
      return (
        <span>
          <span style={{ fontWeight: "600" }}>{start}</span>&nbsp; to &nbsp;
          <span style={{ fontWeight: "600" }}>{end}</span>&nbsp; of &nbsp;
          <span style={{ fontWeight: "600" }}>{total}</span>
        </span>
      );
    } else return "";
  }
}
