import React, {useState} from 'react';
import {observer} from "mobx-react-lite";
import {PageWeb} from "../../components";
import logo from '../../assets/images/logo.png';
import "./ResetPassword.css"
import {useNavigate, useParams} from "react-router-dom";
import {useApi} from "../../utils";
import {useFormik} from "formik";
import * as Yup from "yup";
import {toast} from "react-toastify";
import {getErrorMessages} from "../../utils/functions";
import {genericApiError} from "../../helpers";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import {Spinner} from "react-bootstrap";
import {Eyes} from "../../components/icons";
import {ROUTES} from "../../constants";
import FormContent from "../../components/FormContent/FormContent";


export const ResetPasswordPage: React.FC = observer((props) => {
  const { uidb64, token } = useParams();
  const [Loading, setLoading] = useState(false)
  const api = useApi()
  const navigate = useNavigate()
  const [PasswordType, setPasswordType] = useState("password")
  const [PasswordType2, setPasswordType2] = useState("password")

  const formik = useFormik({
    initialValues: {
      password: "",
      passwordConfirm: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().min(8, 'must have at least 8 characters')
        .required("This field is required"),
      passwordConfirm:Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
    }),
    onSubmit: values => {

      let data = {
        new_password1:values.password,
        new_password2: values.passwordConfirm,
        token: token,
        uidb64: uidb64
      }
      setLoading(true)

      api.resetPassword(data).then((result: any) => {
        setLoading(false)
        if (result.kind === "ok") {
          console.log(result.response.detail)
          toast.success(result.response.detail, {
            position: toast.POSITION.TOP_CENTER
          });
          navigate(ROUTES.LOGIN, {replace:true})
        } else {
          toast.error(getErrorMessages(result.errors), {
            position: toast.POSITION.TOP_CENTER
          });
        }
      }).catch((error: any) => {
        setLoading(false)
        genericApiError()
      })
    }
  });


  return (
      <PageWeb header={false}  >
          <div style={{marginTop:50, marginBottom:20}}>
              <img src={logo} alt={"logo"} className={"logo img-fluid"} />
          </div>
        <FormContent>
          <Form
            noValidate className={'pb-5'}
            method={'post'}
            onSubmit={(event)=>  formik.handleSubmit(event)}
          >
            <Form.Group>
              <h2 className='title-start-form-primary '>Reset password</h2>
            </Form.Group>
            <Form.Group>
              <h4 className='title-start-form-secondary mb-3'>Create new password</h4>
            </Form.Group>
            <Row className="mb-3 mt-4">
              <Form.Group as={Col} md="12" className={'mt-4'}>
                <Form.Label className='form-label'>NEW PASSWORD</Form.Label>
                <InputGroup >
                  <Form.Control
                    name="password"
                    className={'input-large input-password'}
                    type={PasswordType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!formik.errors.password}
                    value={formik.values.password}
                  />
                  <Button type={"button"} variant="outline-secondary" onClick={event => {
                    setPasswordType((value) => value === "password"?"text":"password")
                  }} className={'eyes-buttons '+ (formik.errors.password?'eyes-buttons-invalid':'')}>
                    <Eyes />
                  </Button>

                </InputGroup>
                <Form.Control.Feedback type="invalid"  style={{display:formik.errors.password?'unset':'none'}}>
                  {formik.errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="12" className={'mt-4'}>
                <Form.Label className='form-label'>CONFIRM NEW PASSWORD</Form.Label>
                <InputGroup className="">
                  <Form.Control
                    name="passwordConfirm"
                    className={'input-large input-password' }
                    type={PasswordType2}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!formik.errors.passwordConfirm}
                    value={formik.values.passwordConfirm}
                  />
                  <Button type={"button"} variant="outline-secondary" onClick={event => {
                    setPasswordType2((value) => value === "password"?"text":"password")
                  }} className={'eyes-buttons '+ (formik.errors.passwordConfirm?'eyes-buttons-invalid':'')}>
                    <Eyes />
                  </Button>
                </InputGroup>
                <Form.Control.Feedback type="invalid" style={{display:formik.errors.passwordConfirm?'unset':'none'}}>
                  {formik.errors.passwordConfirm}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Form.Group className="mt-5 ">
              <Container>
                <Row>
                  <Col> <Button variant="secondary" className='button-larg' onClick={()=>navigate(ROUTES.LOGIN, {replace:false})}>Back</Button></Col>
                  <Col>  {Loading && <><Spinner animation="border" variant="light" size="sm"/><span
                    className={"ms-1"}> Loading...</span></>}
                    {!Loading && <Button variant="primary" type={"submit"} className='button-larg'>Reset</Button>}
                  </Col>
                </Row>
              </Container>
            </Form.Group>
          </Form>
        </FormContent>
      </PageWeb>
    )
})


