import React from 'react';
import Modal from "react-bootstrap/Modal";
import {Row} from "react-bootstrap";
import {SuccessCheckIcon} from "../icons";

type SuccessModalProps = {
  show?: boolean
  onHide():void
};
export const SuccessModal: React.FC<SuccessModalProps>  =({ show, onHide }: SuccessModalProps) => {
  return (
    <Modal
      size="sm"
      show={show}
      centered
      onHide={onHide}
    >
      <Modal.Header closeButton style={{paddingTop:20, paddingBottom:0, paddingRight:20}}>
        <Modal.Title>

        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className={'d-flex flex-column  align-items-center   justify-content-center mt-0'}>
          <SuccessCheckIcon />
          <span className={'text-green mb-2'} style={{fontSize:30, fontWeight:"700", textAlign:"center"}}>User Added</span>
        </Row>
      </Modal.Body>
    </Modal>
  )
}

export default SuccessModal;
