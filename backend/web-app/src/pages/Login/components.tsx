import React, {useEffect, useRef, useState} from "react";
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
//
//
//
// const ResetContent = () => (
//   <FormContent>
//     <Form>
//       <Form.Group >
//         <h2 className='title-start-form-primary '>Reset password</h2>
//       </Form.Group>
//       <Form.Group >
//         <h4 className='title-start-form-secondary mb-3'>Create new password</h4>
//       </Form.Group>
//       <Form.Group className="mb-3" >
//         <Form.Label className='form-label'>NEW PASSWORD</Form.Label>
//         <Form.Control className='input-large' type="password" name="password" onChange={e => setPassword(e.target.value)} />
//       </Form.Group>
//       <Form.Group className="mb-3" >
//         <Form.Label className='form-label'>CONFIRM NEW PASSWORD</Form.Label>
//         <Form.Control className='input-large' type="password" name="password" onChange={e => setPassword(e.target.value)} />
//
//
//       </Form.Group>
//       <Form.Group className="mt-5 mb-3">
//         <Container>
//           <Row>
//             <Col> <Button variant="secondary" className='button-larg' >Back</Button></Col>
//             <Col>  {Loading && <><Spinner animation="border" variant="light" size="sm" /><span
//               className={"ms-1"}> Loading...</span></>}
//               {!Loading && <Button variant="primary" className='button-larg' >Reset</Button>}
//             </Col>
//           </Row>
//         </Container>
//       </Form.Group>
//
//     </Form>
//   </FormContent>
// )
//
// const ForgotContent = () => (
//   <FormContent>
//     <Form>
//       <Form.Group >
//         <h2 className='title-start-form-primary '>Forgot password</h2>
//       </Form.Group >
//       <Form.Group >
//         <h4 className='title-start-form-secondary mb-3'>Input email to recive a password reset link</h4>
//       </Form.Group>
//       <Form.Group className="mb-3">
//         <Form.Label className='form-label'>EMAIL ADDRESS</Form.Label>
//         <Form.Control className='input-large' type="text" name="username" onChange={e => setEmail(e.target.value)} />
//       </Form.Group>
//       <Form.Group
//         className="mb-3 text-center"
//         onClick={() => setContent('reset')}
//       >
//         {Loading && <><Spinner animation="border" variant="light" size="sm" /><span
//           className={"ms-1"}> Loading...</span></>}
//         {!Loading && <Button variant="primary" className='button-larg' >Reset</Button>}
//
//       </Form.Group>
//     </Form>
//   </FormContent>
// )
//
//
//
//
// const LoginContent = () => (
//   <FormContent>
//     <Form>
//       <Form.Group >
//         <h2 className='title-start-form-primary '>Log In</h2>
//       </Form.Group>
//       <Form.Group >
//         <h4 className='title-start-form-secondary mb-3'>Welcome back</h4>
//       </Form.Group>
//       <Form.Group className="mb-3" >
//         <Form.Label className='form-label'>EMAIL ADDRESS OR USER NAME</Form.Label>
//         <Form.Control autoComplete="off" className='input-large' name="username"
//                       style={{color:"var(--dark)"}}
//           // onChange={(event:any) => etsEmail(event.target.value)}
//           // onChange={e => setEmail(e.target.value)}
//         />
//       </Form.Group>
//       <Form.Group className="mb-3" >
//         <Form.Label className='form-label'>PASSWORD</Form.Label>
//         <InputGroup className="mb-3">
//           <Form.Control
//             autoComplete="off"
//             type={PasswordType} name="password" className='input-large'
//             style={{color:"var(--dark)"}}
//             // onChange={e => setPassword(e.target.value)}
//           />
//           <Button type={"button"} variant="outline-secondary" onClick={event => {
//             setShowPassword(prevState => !prevState)
//             setPasswordType((value) => value === "password"?"text":"password")
//           }} className='eyes-buttons'>
//             <Eyes />
//           </Button>
//         </InputGroup>

//         {/*
//                                     < /> */}
//       </Form.Group>
//       <Form.Group className="mb-3" >
//         <div className="forgot-password">
//           <a href="#" onClick={() => setContent('forgot')} className='link-primary'>Forgot password?</a>
//         </div>
//
//       </Form.Group>
//       <Form.Group
//         className="mb-3 text-center"
//         onClick={() => handleSubmit()}
//       >
//
//         {Loading && <><Spinner animation="border" variant="light" size="sm" /><span
//           className={"ms-1"}> Loading...</span></>}
//         {!Loading &&
//
//         <Button variant="primary" className='button-larg' >Log in</Button>
//         }
//
//       </Form.Group>
//     </Form>
//   </FormContent>
//
// )
//
//
//


export const LoginForm = ()=> {

  const [Loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
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
        if (result.kind === "ok") {
          console.log(result)
            userStore.setUser(result.response.user)
            navigate(ROUTES.DASHBOARD, {replace:true})
        } else {
          console.log(' ===>>>> ', result)
          toast.error(getErrorMessages(result.errors), {
            position: toast.POSITION.TOP_CENTER
          });
        }
      }).catch((error: any) => {
        setLoading(false)
        genericApiError()
      })

      // setFormState(values);
    }
  });

  useEffect(() => {
    console.log("userStore", userStore.access_token)
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
          validated={validated}
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
            <a href="#" onClick={() => console.log("forgot")} className='link-primary'>Forgot password?</a>
          </div>
        </Form.Group>
      </Row>
      <div className={'mt-1 d-flex flex-row justify-content-center'}>
          <Button disabled={Loading}  type="submit" className={'btn-save'} >Log in</Button>
      </div>
    </Form>
  );
}

