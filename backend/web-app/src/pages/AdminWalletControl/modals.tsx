import React from 'react';
import Modal from "react-bootstrap/Modal";
import {Form, Row} from "react-bootstrap";
import {SuccessCheckIcon} from "../../components/icons";
import {useFormik} from "formik";
import * as Yup from "yup";
import {AUTHORIZATION} from "../../services/constants";
import {ROUTES} from "../../constants";
import {toast} from "react-toastify";
import {getErrorMessages} from "../../utils/functions";
import {genericApiError} from "../../helpers";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import styles from "./AdminWalletControl.module.css"

type SuccessModalProps = {
  show?: boolean
  onHide():void
};
const LinkBankAccountModal: React.FC<SuccessModalProps>  =({ show, onHide }: SuccessModalProps) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      routing:"",
      account:"",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("This field is required"),
      routing: Yup.string()
        .required("This field is required"),
      account: Yup.string()
        .required("This field is required")
    }),
    onSubmit: values => {
      // alert(JSON.stringify(values, null, 2));
      let data = {name:values.name, email:values.routing, password:values.account}
      console.log("data", data)

    }
  });
  const handleSubmitFormik = (event:any)=>{
    formik.handleSubmit(event)
    // setValidated(_.isEmpty(formik.errors));
  }


  return (
    <Modal
      size="lg"
      show={show}
      centered
      onHide={onHide}
    >
      <Modal.Header closeButton style={{paddingTop:20, paddingBottom:0, paddingRight:20}}>
        <Modal.Title className={'d-flex flex-column mb-0'}>
          <span className={'text-blue mb-2 ms-4 mb-0'} style={{fontSize:24, fontWeight:"700"}}>Link Bank Account</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>

        <Row className={'d-flex flex-column  mt-0 ms-2 p-2'}>
          <Form noValidate className={'pb-5'}
                onSubmit={handleSubmitFormik} >

            <Row>
              <Form.Group as={Col} md="12">
                <Form.Label className='form-label'>NAME</Form.Label>
                <Form.Control
                  name="name"
                  type="text"
                  lang={"us-US"}
                  className={'input-large'}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.name && !!formik.touched.name}
                  value={formik.values.name}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row>
              <Form.Group as={Col} md="12">
                <Form.Label className='form-label'>ROUTING NUMBER</Form.Label>
                <Form.Control
                  name="routing"
                  type="text"
                  lang={"us-US"}
                  className={'input-large'}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.routing && !!formik.touched.routing}
                  value={formik.values.routing}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.routing}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row>
              <Form.Group as={Col} md="12">
                <Form.Label className='form-label'>ACCOUNT NUMBER</Form.Label>
                <Form.Control
                  name="account"
                  type="text"
                  lang={"us-US"}
                  className={'input-large'}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.account && !!formik.touched.account}
                  value={formik.values.account}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.account}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className={'mt-5 d-flex flex-row justify-content-center'}>
              <Button variant="primary" className={styles.button} type="submit"  >
                Add
              </Button>
            </Row>


          </Form>
        </Row>
      </Modal.Body>
    </Modal>
  )
}


export {LinkBankAccountModal}
