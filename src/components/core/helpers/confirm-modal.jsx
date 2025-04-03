import React, { Component } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { AppMsgResProps } from "../messages/app-properties";

class ConfirmModal extends Component {
  render() {
    return (
      <Modal
        isOpen={this.props.isOpenConfirmModal}
        toggle={this.props.closeConfirmModal}
        size="md"
        backdrop="static"
        centered={false}
        className="sram-modal-content"
      >
        <ModalHeader>{AppMsgResProps.body.content.confirmation}</ModalHeader>
        <ModalBody className="mb-2">{this.props.children}</ModalBody>
        <ModalFooter className="m-1 p-2">
          <Button
            type="button"
            className="sram-btn-blue mx-2"
            onClick={this.props.handleSubmit}
          >
            {AppMsgResProps.body.form.yes.label}
          </Button>
          <Button
            type="button"
            className="sram-btn-white mx-2"
            onClick={this.props.closeConfirmModal}
          >
            {AppMsgResProps.body.form.no.label}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ConfirmModal;
