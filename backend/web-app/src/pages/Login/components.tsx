import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import {Spinner} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import {useFormik} from "formik";
import * as Yup from "yup";
import {Eyes} from "../../components/icons";
import {useApi, useUserStore} from "../../utils";
import {genericApiError} from "../../helpers";
import {toast} from "react-toastify";
import {getErrorMessages} from "../../utils/functions";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../constants";
import {FORM_CONTENT} from "./constants";


export const FormContent: React.FC<{ children: React.ReactNode}> = ({ children}) => (
  <Container>
    <Row className="justify-content-md-center">
      <Col xs md="6" className='background-paper'>
        <Col xs md="12">
          {children}
        </Col>
      </Col>
    </Row >
  </Container>
)

type FormTypeProps = {
  updateContent(newContent:FORM_CONTENT):void
}

export const ResetForm = ({updateContent}:FormTypeProps) => {
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

      let data = { new_password1:values.password, new_password2: values.passwordConfirm }
      setLoading(true)

      api.resetPassword(data).then((result: any) => {
        setLoading(false)
        if (result.kind === "ok") {
          toast.success(result.response.detail, {
            position: toast.POSITION.TOP_CENTER
          });
          // navigate(ROUTES.DASHBOARD, {replace:true})
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
                className={'input-large'}
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
                className={'input-large'}
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
              <Col> <Button variant="secondary" className='button-larg' onClick={()=> updateContent(FORM_CONTENT.ForgotPassword)}>Back</Button></Col>
              <Col>  {Loading && <><Spinner animation="border" variant="light" size="sm"/><span
                className={"ms-1"}> Loading...</span></>}
                {!Loading && <Button variant="primary" type={"submit"} className='button-larg'>Reset</Button>}
              </Col>
            </Row>
          </Container>
        </Form.Group>

      </Form>
    </FormContent>
  )

}



export const ForgotPasswordForm = ({updateContent}:FormTypeProps) => {
  const [Loading, setLoading] = useState(false)
  const api = useApi()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email()
        .required("This field is required"),

    }),
    onSubmit: values => {
      let data = {email:values.email}
      setLoading(true)

      api.forgotPassword(data).then((result: any) => {
        setLoading(false)
        if (result.kind === "ok") {
          console.log(result.response.detail)
          toast.success(result.response.detail, {
            position: toast.POSITION.TOP_CENTER
          });
          console.log(result)
          updateContent(FORM_CONTENT.ResetPassword)
          // navigate(ROUTES.DASHBOARD, {replace:true})
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


  return (<FormContent>
    <Form noValidate className={'pb-5'}
          method={'post'}
          onSubmit={(event)=>  formik.handleSubmit(event)} >
      <Form.Group>
        <h2 className='title-start-form-primary '>Forgot password</h2>
      </Form.Group>
      <Form.Group>
        <h4 className='title-start-form-secondary mb-3'>Input email to recive a password reset link</h4>
      </Form.Group>
      <Form.Group as={Col} md="12">
        <Form.Label className='form-label mt-4'>EMAIL ADDRESS</Form.Label>
        <Form.Control
          name="email"
          type="text"
          lang={"us-US"}
          className={'input-large'}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isInvalid={!!formik.errors.email}
          value={formik.values.email}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.email}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3" >
        <div className="forgot-password">
          <a href="#" onClick={() => updateContent(FORM_CONTENT.Login)} className='link-primary'>Log in</a>
        </div>
      </Form.Group>
      <Form.Group
        className="mb-3 text-center"
        // onClick={() => setContent('reset')}
      >
        {Loading && <><Spinner animation="border" variant="light" size="sm"/><span
          className={"ms-1"}> Loading...</span></>}
        {!Loading &&   <Button disabled={Loading}  type="submit" className={'btn-save'} > reset </Button>}

      </Form.Group>
    </Form>
  </FormContent>)
}





export const LoginForm = ({updateContent}:FormTypeProps)=> {
  const [Loading, setLoading] = useState(false);
  const [PasswordType, setPasswordType] = useState("password")
  const navigate = useNavigate()
  const api = useApi()
  const userStore = useUserStore()

  const formik = useFormik({
    initialValues: {
      email: "",
      password:"",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("This field is required"),
      password: Yup.string()
        .required("This field is required")
    }),
    onSubmit: values => {
      // alert(JSON.stringify(values, null, 2));
      let data = {username:values.email, email:values.email, password:values.password}

      api.login(data).then((result: any) => {
        console.log(result)
        if (result.kind === "ok") {
          userStore.setUser(result.response.user)
          toast.success('Welcome', {
            position: toast.POSITION.TOP_CENTER
          });
          navigate(ROUTES.DASHBOARD, {replace:true})
        } else {
          toast.error(getErrorMessages(result.errors), {
            position: toast.POSITION.TOP_CENTER
          });
          // window.location.reload();
        }
      }).catch((error: any) => {
        setLoading(false)
        genericApiError()
      })
    }
  });

  useEffect(() => {
    if(userStore.isLoggedIn){
      navigate(ROUTES.DASHBOARD,{replace:true})
    }
  }, [])

  const handleSubmitFormik = (event:any)=>{
    formik.handleSubmit(event)
    // setValidated(_.isEmpty(formik.errors));
  }

  return (
    <Form noValidate className={'pb-5'}
          onSubmit={handleSubmitFormik} >
      <Form.Group >
        <h2 className='title-start-form-primary '>Log In</h2>
      </Form.Group>
      <Form.Group >
        <h4 className='title-start-form-secondary mb-3'>Welcome back</h4>
      </Form.Group>
      <Row className="mb-3 mt-4">
        <Form.Group as={Col} md="12">
          <Form.Label className='form-label'>EMAIL ADDRESS OR USERNAME</Form.Label>
          <Form.Control
            name="email"
            type="text"
            lang={"us-US"}
            className={'input-large'}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={!!formik.errors.email}
            value={formik.values.email}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.email}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="12" className={'mt-4'}>
          <Form.Label className='form-label'>PASSWORD</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              name="password"
              className={'input-large'}
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
          <Form.Control.Feedback type="invalid">
            {formik.errors.password}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" >
          <div className="forgot-password">
            <a href="#" onClick={() => updateContent(FORM_CONTENT.ForgotPassword)} className='link-primary'>Forgot password?</a>
          </div>
        </Form.Group>
      </Row>
      <div className={'mt-1 d-flex flex-row justify-content-center'}>
        {Loading && <><Spinner animation="border" variant="light" size="sm"/><span
          className={"ms-1"}> Loading...</span></>}
        {!Loading &&     <Button disabled={Loading}  type="submit" className={'btn-save'} >Log in</Button>}


      </div>
    </Form>
  );
}

