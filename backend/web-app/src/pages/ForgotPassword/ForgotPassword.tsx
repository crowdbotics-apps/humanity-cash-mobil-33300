import React, {useState} from "react";
import {useApi} from "../../utils";
import {useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import * as Yup from "yup";
import {toast} from "react-toastify";
import {FORM_CONTENT} from "../Login/constants";
import {getErrorMessages} from "../../utils/functions";
import {genericApiError} from "../../helpers";
import {observer} from "mobx-react-lite";
import FormContent from "../../components/FormContent/FormContent";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import {Spinner} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {ROUTES} from "../../constants";
import {PageWeb} from "../../components/PageWeb/PageWeb";
import logo from "../../assets/images/logo.png";
import {LoginForm} from "../Login/components";

export const ForgotPasswordPage: React.FC = observer((props) => {
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
    <PageWeb header={false}  >
      <div style={{marginTop:50, marginBottom:20}}>
        <img src={logo} alt={"logo"} className={"logo img-fluid"} />
      </div>
      <FormContent>
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
              <a href="#"  onClick={()=>navigate(ROUTES.LOGIN, {replace:false})}className='link-primary'>Log in</a>
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
      </FormContent>
    </PageWeb>
  )
})
