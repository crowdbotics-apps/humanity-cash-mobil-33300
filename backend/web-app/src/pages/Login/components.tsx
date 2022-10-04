import React, {useEffect, useState} from "react";
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
import FormContent from "../../components/FormContent/FormContent";
import {AUTHORIZATION} from "../../services/constants";





export const LoginForm = ()=> {
  const [Loading, setLoading] = useState(false);
  const [PasswordType, setPasswordType] = useState("password")
  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")
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
          userStore.setApiToken(result.response.access_token, result.response.refresh_token)
          // toast.success('Welcome', {
          //   position: toast.POSITION.TOP_CENTER
          // });
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
            onChange={(event)=>{
              setEmail(event.target.value)
              formik.setFieldValue('email', event.target.value)
            }}
            onBlur={formik.handleBlur}
            isInvalid={!!formik.errors.email}
            value={Email}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.email}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="12" className={'mt-4'}>
          <Form.Label className='form-label'>PASSWORD</Form.Label>
          <InputGroup className="mb-3 ">
            <Form.Control
              name="password"
              className={'input-large input-password'}
              type={PasswordType}
              // onChange={formik.handleChange}
              onChange={(event)=>{
                setPassword(event.target.value)
                formik.setFieldValue('password', event.target.value)
              }}
              onBlur={formik.handleBlur}
              isInvalid={!!formik.errors.password && !!formik.touched.password}
              value={Password}
            />
            <Button type={"button"} variant="outline-secondary"
                    onClick={event => {
                      setPasswordType((value) => value === "password"?"text":"password")
                    }}
                    className={'eyes-buttons '+ (formik.errors.password && formik.touched.password ?'eyes-buttons-invalid':'')}>
              <Eyes />
            </Button>
          </InputGroup>
          <Form.Control.Feedback type="invalid">
            {formik.errors.password}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" >
          <div className="forgot-password">
            <a href="#"
               onClick={()=>navigate(ROUTES.FORGOT_PASSWORD, {replace:false})}
               className='link-primary'>Forgot password?</a>
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

