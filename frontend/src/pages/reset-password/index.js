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

function ResetPassword() {
  const api = useApi()
  const navigate = useNavigate()
  const formikRef = useRef();
  const [loading, setLoading] = useState(false);
  const getUrls = window.location.href.split('set-new-password/')[1].split('/')

  const resetPassword = (data) => {
    const form = {
      new_password1: data.password,
      new_password2: data.new_password2,
      uidb64: getUrls[0],
      token: getUrls[1]
    }
    setLoading(true)
    api.resetPassword(form).then((result) => {
      if (result.kind === "ok") {
        showMessage('Password set successful', 'success')
        navigate(ROUTES.LOGIN)
      } else if(result.kind === "bad-data") {
        if (result.errors.token) {
          showMessage(result.errors.token)
        } else {
          showMessage(result.errors?.errors)
          formikRef.current.setErrors(result.errors)
        }
      } else {
        showMessage()
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }

  const validationSchema =
    Yup.object().shape({
      password: Yup.string().required('Password is required'),
      new_password2: Yup.string().required('Confirm password is required').oneOf([Yup.ref('password'), null], "Passwords doesn't match"),
    })

  const initialValues = {
    password: "",
    new_password2: "",
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
              Reset password
            </MDTypography>
            <MDTypography color="dark" sx={{fontSize: 16, fontWeight: 400}}>
              Create new password
            </MDTypography>
          </MDBox>
          <MDBox mb={5} width={{xs: '100%', md: 600}} sx={{alignSelf: 'center'}}>
        <Formik
          innerRef={formikRef}
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={values => {
            resetPassword(values);
          }}
        >
          {({errors, touched, isValid}) => (
            <Form style={{display: 'flex', flexDirection: 'column', flex: 1}}>
              <Field name="password">
                {({field}) => {
                  return (
                    <MDBox mb={2}>
                      <MDInput
                        type="password"
                        label="NEW PASSWORD"
                        variant="outlined"
                        fullWidth
                        password
                        placeholder="************"
                        error={touched.password === true && errors.password !== undefined}
                        helperText={touched.password === true && errors.password && errors.password}
                        {...field}
                      />
                    </MDBox>
                  )
                }
                }
              </Field>
              <Field name="new_password2">
                {({field}) => {
                  return (
                    <MDBox mb={2}>
                      <MDInput
                        type="password"
                        label="CONFIRM NEW PASSWORD"
                        variant="outlined"
                        fullWidth
                        password
                        placeholder="************"
                        error={touched.new_password2 === true && errors.new_password2 !== undefined}
                        helperText={touched.new_password2 === true && errors.new_password2 && errors.new_password2}
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

export default ResetPassword;
