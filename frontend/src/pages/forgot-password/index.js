/**
 =========================================================
 * Material Dashboard 2 PRO React - v2.1.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
 * Copyright 2022 Creative Tim (https://www.creative-tim.com)

 Coded by www.creative-tim.com

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

import {useRef, useState} from "react";

import {useNavigate} from "react-router-dom";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";


import ImageContainer from "../../components/AuthContainer";
import {showMessage, useApi} from "../../services/helpers";
import {ROUTES} from "../../services/constants";
import * as Yup from "yup";
import {Field, Form, Formik} from "formik";
import Card from "@mui/material/Card";

const logo = require("../../assets/images/logo.png")

function ForgotPassword() {
  const api = useApi()
  const navigate = useNavigate()
  const formikRef = useRef();
  const [loading, setLoading] = useState(false);

  const forgotPassword = (data) => {
    setLoading(true)
    api.forgotPassword(data.email).then((result) => {
      if (result.kind === "ok") {
        showMessage('Password reset e-mail has been sent.', 'success')
        navigate(ROUTES.LOGIN)
      } else if (result.kind === "bad-data") {
        formikRef.current.setErrors(result.errors)
        showMessage('Validation errors found')
      } else {
        showMessage()
      }
    })
      .catch(err => showMessage(err.message))
      .finally(() => setLoading(false))
  }

  const validationSchema =
    Yup.object().shape({
      email: Yup.string().email().required(),
    })

  const initialValues = {
    email: "",
  };

  return (
    <ImageContainer>
      <MDBox pt={4} pb={3} px={3} width={{xs: '100%', md: 780}}>
        <MDBox mb={5} textAlign={'center'}>
          <img
            alt="logo"
            src={logo}
            style={{width: 370, height: 'auto', objectFit: 'cover'}}
          />
        </MDBox>
        <Card>
            <MDBox mt={3} mb={5} textAlign="center">
              <MDTypography color="primary" sx={{fontSize: 32, fontWeight: 400}}>
                Forgot password
              </MDTypography>
              <MDTypography color="dark" sx={{fontSize: 16, fontWeight: 400}}>
                Input your email to receive a password reset link
              </MDTypography>
            </MDBox>
          <MDBox mb={5} width={{xs: '100%', md: 600}} sx={{alignSelf: 'center'}}>
            <Formik
              innerRef={formikRef}
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={values => {
                forgotPassword(values);
              }}
            >
              {({errors, touched, isValid}) => (
                <Form style={{display: 'flex', flexDirection: 'column', flex: 1}}>
                  <Field name="email">
                    {({field}) => {
                      return (
                        <MDBox mb={2}>
                          <MDInput
                            type="email"
                            label="EMAIL ADDRESS"
                            variant="outlined"
                            placeholder="john@example.com"
                            fullWidth
                            error={touched.email === true && errors.email !== undefined}
                            helperText={touched.email === true && errors.email && errors.email}
                            {...field}
                          />
                        </MDBox>
                      )
                    }
                    }
                  </Field>
                  <MDBox mt={6} mb={1} sx={{ display: 'flex', flex: 1 }}>
                    <MDButton
                      sx={{width: 290}}
                      color="primary"
                      size={'large'}
                      variant={'outlined'}
                      onClick={() => navigate(ROUTES.LOGIN)}
                    >
                      Back
                    </MDButton>
                    <MDButton
                      sx={{width: 290, marginLeft: 'auto'}}
                      loading={loading}
                      disabled={loading || !isValid}
                      color="primary"
                      type='submit'
                      size={'large'}
                      ml={'auto'}
                    >
                      Reset
                    </MDButton>
                  </MDBox>
                </Form>
              )}
            </Formik>
          </MDBox>
        </Card>
      </MDBox>
    </ImageContainer>
  );
}

export default ForgotPassword;
