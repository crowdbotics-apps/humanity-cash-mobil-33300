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

import {useState} from "react";

import {Link, useNavigate} from "react-router-dom";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

import {useStores} from "../../models";
import {runInAction} from "mobx";
import ImageContainer from "../../components/AuthContainer";
import {showMessage, useApi} from "../../services/helpers";
import {ROUTES} from "../../services/constants";
import * as Yup from "yup";
import {Field, Form, Formik} from "formik";
import Card from "@mui/material/Card";

const logo = require("../../assets/images/logo.png")

function SignIn() {
  const rootStore = useStores()
  const {loginStore} = rootStore
  const api = useApi()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);

  const login = (data) => {
    setLoading(true)
    api.login(data.email, data.password).then((result) => {
      if (result.kind === "ok") {
        const {response} = result
        if ((response.user.role !== null && response.user.group !== null) || response.user.is_superuser ) {
          runInAction(() => {
            loginStore.setUser(response.user)
            loginStore.setApiToken(response.access_token)
          })
          navigate(ROUTES.DASHBOARD)
        } else {
          showMessage('Invalid credentials')
        }
      } else {
        if (result.kind === "bad-data") {
          if (result.errors.non_field_errors) {
            showMessage('Invalid credentials')
          }
        } else {
          showMessage()
        }
      }
    })
      .catch(err => console.log(err))
      .finally(() => setLoading(false))
  }

  const validationSchema =
    Yup.object().shape({
      email: Yup.string().required(),
      password: Yup.string().required(),
    })

  const initialValues = {
    email: "",
    password: "",
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
              Log in
            </MDTypography>
            <MDTypography color="dark" sx={{fontSize: 16, fontWeight: 400}}>
              Welcome back
            </MDTypography>
          </MDBox>
          <MDBox mb={5} width={{xs: '100%', md: 600}} sx={{alignSelf: 'center'}}>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              // validateOnChange={false}
              validateOnBlur={false}
              onSubmit={values => {
                login(values);
              }}
            >
              {({errors, touched, isValid}) => (
                <Form style={{display: 'flex', flexDirection: 'column', flex: 1}}>
                  <Field name="email">
                    {({field}) => {
                      return (
                        <MDBox mb={2}>
                          <MDInput
                            type="text"
                            label="EMAIL ADDRESS OR USERNAME"
                            variant="outlined"
                            placeholder="john@example.com"
                            fullWidth
                            error={errors.email !== undefined}
                            helperText={errors.email && errors.email}
                            {...field}
                          />
                        </MDBox>
                      )
                    }
                    }
                  </Field>
                  <Field name="password">
                    {({field}) => {
                      return (
                        <MDBox>
                          <MDInput
                            type="password"
                            label="PASSWORD"
                            variant="outlined"
                            fullWidth
                            password
                            placeholder="************"
                            error={errors.password !== undefined}
                            helperText={errors.password && errors.password}
                            {...field}
                          />
                        </MDBox>
                      )
                    }
                    }
                  </Field>
                  <MDBox mt={1} mb={1} textAlign="right">
                    <MDTypography
                      component={Link}
                      to={ROUTES.FORGOT_PASSWORD}
                      variant="button"
                      color="secondary"
                      sx={{fontSize: 16, fontWeight: 400}}
                    >
                      Forgot your password?
                    </MDTypography>
                  </MDBox>
                  <MDBox mt={5} mb={1} mx={'auto'}>
                    <MDButton
                      sx={{width: 335}}
                      size={'large'}
                      loading={loading}
                      disabled={loading || !isValid}
                      color="primary"
                      type='submit'
                    >
                      Log In
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

export default SignIn;
