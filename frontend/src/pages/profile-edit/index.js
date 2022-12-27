import DashboardLayout from "../../components/LayoutContainers/DashboardLayout"
import {useRef, useState} from "react"
import MDButton from "../../components/MDButton"
import {useNavigate} from "react-router-dom"
import {showMessage, useApi} from "../../services/helpers"
import MDBox from "../../components/MDBox";
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";
import MDInput from "../../components/MDInput";
import {ROUTES} from "../../services/constants";
import {useStores} from "../../models";
import ImageUpload from "../../components/ImageUpload";
import InputMask from "react-input-mask";
import {runInAction} from "mobx";
import {observer} from "mobx-react";

const ProfileEdit = () => {
  const api = useApi()
  const navigate = useNavigate()
  const rootStore = useStores()
  const formikRef = useRef();
  const {loginStore} = rootStore
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(loginStore.profile_picture)

  const editProfile = (data, keys) => {
    setLoading(true)
    api.editUser(data, keys).then((result) => {
      if (result.kind === "ok") {
        runInAction(() => {
          loginStore.setUser(result.response)
        })
        showMessage('Profile updated successfully', 'success')
        navigate(ROUTES.MY_PROFILE)
      } else if(result.kind === "bad-data") {
        showMessage('Validation errors found')
        formikRef.current.setErrors(result.errors)
      } else {
        showMessage()
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }

  const addEditService = (data) => {
    let keys = []
    let updatedData = data
    if (selectedImage && typeof selectedImage !== 'string') {
      updatedData = {...data, profile_picture: selectedImage}
      keys = ['profile_picture']
    }
    editProfile(updatedData, keys)
  }

  const validationSchema =
    Yup.object().shape({
      first_name: Yup.string().required('First name is a required field'),
      last_name: Yup.string().required('Last name is a required field'),
      company_name: Yup.string().nullable().required('Company name is a required field'),
      address: Yup.string().nullable().required('Address is a required field'),
      phone_number: Yup.string().required('Phone number is a required field')
    })

  const initialValues = {
    first_name:  loginStore.first_name ? loginStore.first_name : '' ,
    last_name:  loginStore.last_name ? loginStore.last_name : '' ,
    company_name:  loginStore.company_name,
    address:  loginStore.address,
    phone_number:  loginStore.phone_number,
  };

  return (
    <DashboardLayout showCard loginRequired>
      <MDBox display={'flex'} flexDirection={'column'} alignItems={'center'} flex={1} sx={{ width: 500, marginLeft: 'auto', marginRight: 'auto', flex: 1}}>
        <ImageUpload
          height={109}
          width={109}
          profileImage={selectedImage && selectedImage}
          mainImg={true}
          mainImage={(data) => {
            setSelectedImage(data)
          }}
        />
        <Formik
          innerRef={formikRef}
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={values => {
            addEditService(values);
          }}
        >
          {({errors, touched, isValid}) => (
            <Form style={{display: 'flex', flexDirection: 'column', flex: 1, width: '100%'}}>
              <Field name="first_name">
                {({field}) => {
                  return (
                    <MDBox mb={2}>
                      <MDInput
                        type="text"
                        label="First name"
                        variant="standard"
                        fullWidth
                        error={touched.first_name === true && errors.first_name !== undefined}
                        helperText={touched.first_name === true && errors.first_name && errors.first_name}
                        {...field}
                      />
                    </MDBox>
                  )
                }
                }
              </Field>
              <Field name="last_name">
                {({field}) => {
                  return (
                    <MDBox mb={2}>
                      <MDInput
                        type="text"
                        label="Last name"
                        variant="standard"
                        fullWidth
                        error={touched.last_name === true && errors.last_name !== undefined}
                        helperText={touched.last_name === true && errors.last_name && errors.last_name}
                        {...field}
                      />
                    </MDBox>
                  )
                }
                }
              </Field>
              <Field name="company_name">
                {({field}) => {
                  return (
                    <MDBox mb={2}>
                      <MDInput
                        type="text"
                        label="Company Name"
                        variant="standard"
                        fullWidth
                        error={touched.company_name === true && errors.company_name !== undefined}
                        helperText={touched.company_name === true && errors.company_name && errors.company_name}
                        {...field}
                      />
                    </MDBox>
                  )
                }
                }
              </Field>
              <Field name="address">
                {({field}) => {
                  return (
                    <MDBox mb={2}>
                      <MDInput
                        type="text"
                        label="Address"
                        variant="standard"
                        fullWidth
                        error={touched.address === true && errors.address !== undefined}
                        helperText={touched.address === true && errors.address && errors.address}
                        {...field}
                      />
                    </MDBox>
                  )
                }
                }
              </Field>
              <Field name="phone_number">
                {({field}) => {
                  return (
                    <MDBox mb={2}>
                      <InputMask
                        mask="+1(999)-999-9999"
                        disabled={false}
                        {...field}
                      ><MDInput
                        type="text"
                        label="Contact Number"
                        variant="standard"
                        fullWidth
                        error={touched.phone_number === true && errors.phone_number !== undefined}
                        helperText={touched.phone_number === true && errors.phone_number && errors.phone_number}

                      />
                      </InputMask>
                    </MDBox>
                  )
                }
                }
              </Field>
              <MDBox mx={'auto'} justifyContent={'center'} mt={'auto'} mb={10}>
                <MDButton sx={{minWidth: 150}} size={'large'} loading={loading} disabled={loading} variant="gradient" color="secondary" type='submit'>
                  Save
                </MDButton>
              </MDBox>
            </Form>
          )}
        </Formik>
      </MDBox>
    </DashboardLayout>
  )
}

export default observer(ProfileEdit);
