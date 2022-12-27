import Modal from "react-bootstrap/Modal";
import {Button, Col, Form, ListGroup, Row, Tab} from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import Stack from "react-bootstrap/Stack";
import styles from "./BlockchainTransactions.module.css";
import React, {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {Eyes, SearchIcon} from "../../components/icons";

export enum ReconciliationActions {
  AddAdjustment = 'AddAdjustment',
  AddAdjustmentAndMint = "AddAdjustmentAndMint",
  ReconcileAndBurn = "ReconcileAndBurn",
  ReconcileAndTransfer = "ReconcileAndTransfer"
}

export const CredentialsModal = observer((props: any) => {
  const {showModal, onConfirm, onClose} = props
  const [DisableCredentialBtn, setDisableCredentialBtn] = useState<boolean>(true)
  const [ShowPasword, setShowPassword] = useState<boolean>(false)
  const [ShowPasword2, setShowPassword2] = useState<boolean>(false)
  const [Password, setPassword] = useState<string>("")
  const [Password2, setPassword2] = useState<string>("")


  useEffect(() => {
    setDisableCredentialBtn(!Password || Password !== Password2)
  }, [Password2, Password])


  return (
    <Modal
      show={showModal}
      onHide={onClose}
      className={''}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className='title-modal m-2'>Supervisor Credentials</Modal.Title>
      </Modal.Header>
      <form>
        <Modal.Body style={{paddingLeft: 30, paddingRight: 30}}>
          <div>
            <h6 className='title-h6'>Enter your credentials to confirm</h6>
          </div>

          <Form.Group className="mb-3 mt-3">
            <Form.Label className='form-label'>PASSWORD 1</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type="password"
                name="password"
                value={Password}
                className='input-large'
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button variant="outline-secondary"
                      onClick={() => setShowPassword(prevState => !prevState)}
                      className='eyes-buttons'>
                <Eyes/>
              </Button>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className='form-label'>PASSWORD 2</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type="password"
                name="password"
                value={Password2}
                className='input-large'
                onChange={(e) => setPassword2(e.target.value)}
              />
              <Button variant="outline-secondary"
                      className='eyes-buttons'
                      onClick={() => setShowPassword2(prevState => !prevState)}>
                <Eyes/>
              </Button>
            </InputGroup>
          </Form.Group>

        </Modal.Body>
        <Modal.Footer>
          <Stack gap={2} className="col-md-5 mx-auto modal-button mb-4">
            <Button variant="primary"
                    className={!Password || Password !== Password2 ? styles.btnDisabled : ''}
                    disabled={DisableCredentialBtn}
                    onClick={() => onConfirm(Password)}
                    type="button">
              Confirm
            </Button>
          </Stack>

        </Modal.Footer>
      </form>
    </Modal>
  )
})

export const ListResultData = ({data, callback}: any) => {
  const [hidden, setHidden] = useState(true)

  const handleClick = (element: any) => {
    setHidden(true)
    callback(element)
  }

  useEffect(() => {
    console.log("hidden", hidden)
  }, [hidden])

  useEffect(() => {
    console.log("data", data)
    setHidden(data.length === 0)
  }, [])

  return (<Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
    <Row>
      <Col sm={12}>
        <ListGroup hidden={hidden}>
          {data.map((e: any, k: number) =>
            <ListGroup.Item key={`k_${k}`} onClick={() => handleClick(e)}>
              {e.label}
            </ListGroup.Item>
          )}
        </ListGroup>
      </Col>
    </Row>
  </Tab.Container>)
}

export const AmountModal = observer((props: any) => {
  const {showModal, onConfirm, onClose, title, subTitle, selectRecipient, searchFn, results} = props
  const [Recipient, setRecipient] = useState<any>(null)
  const [Amount, setAmount] = useState<string>("0")

  return (
    <Modal
      show={showModal}
      onHide={onClose}
      className={''}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className='title-modal m-2 ml-3' style={{width: "500px"}}>{title}</Modal.Title>
      </Modal.Header>
      <form>
        <Modal.Body style={{paddingLeft: 30, paddingRight: 30, marginTop: -25}}>
          <h6 className='title-h6'
              style={{fontWeight: 400, fontSize: "14px", lineHeight: "unset", width: "100%"}}>{subTitle}</h6>

          <Form.Group className="mb-3 mt-5">
            <Form.Label className='form-label'>ENTER AMOUNT</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type="number"
                name="amount"
                max={"999999"}
                value={Amount}
                className='input-large'
                min={"0"}
                maxLength={8}
                onChange={(e) => {
                  setAmount(e.target.value)
                }}
              />
            </InputGroup>
          </Form.Group>

          {selectRecipient && <Row className={'ps-3 pe-3 mt-4 mb-4'}>
            <InputGroup className="mb-0 search-button-group" style={{border: "2px solid var(--headings) !important"}}>

              <Form.Control
                placeholder='search by name, email and wallet address'
                type="search" name="search" className='search-button-navbar'
                onChange={(e) => searchFn(e.target.value)}
              />
              <Button variant="secondary" id="button-addon2" className='search-buttons'>
                <SearchIcon/>
              </Button>
            </InputGroup>
            <ListResultData data={results} callback={(recipient: any) => setRecipient(recipient)}/>
          </Row>}
        </Modal.Body>
        <Modal.Footer>
          <Stack gap={2} className="col-md-5 mx-auto modal-button mb-4">
            <Button variant="primary"
                    onClick={() => {
                      if (onConfirm)
                        onConfirm(parseFloat(Amount))
                    }}
                    type="button">
              Confirm
            </Button>
          </Stack>
        </Modal.Footer>
      </form>

    </Modal>)
})


export const ReconciliationConfirmModal = observer((props: any) => {
  const {showModal, onConfirm, onClose, title, amount, extraText = null} = props
  return (
    <Modal
      show={showModal}
      onHide={onClose}
      className={''}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className='title-modal m-2 ml-3' style={{width: "500px"}}>{title}</Modal.Title>
      </Modal.Header>
      <form>
        <Modal.Body style={{paddingLeft: 30, paddingRight: 30, marginTop: -25}}>
          <h6 className='title-h6'
              style={{fontWeight: 600, fontSize: "14px", lineHeight: "unset", width: "100%"}}>${amount} {extraText}</h6>
        </Modal.Body>
        <Modal.Footer>
          <Stack gap={2} className="col-md-5 mx-auto modal-button mb-4">
            <Button variant="primary"
                    onClick={() => onConfirm()}
                    type="button">
              Confirm
            </Button>
          </Stack>
        </Modal.Footer>
      </form>
    </Modal>
  )
})
