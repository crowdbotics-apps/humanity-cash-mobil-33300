import React, {useEffect, useRef, useState} from "react";
import {useFormik} from "formik";
import * as Yup from "yup";
import {Grid} from '@mui/material';
import MDTypography from "components/MDTypography";
import MDInput from "../../components/MDInput";
import * as _ from 'lodash'
import {AttachmentIcon} from "../../assets/svg";
import MDBox from "../../components/MDBox";
import moment from 'moment'
import {Field, Form, Formik} from "formik";
import {AutocompleteFormik} from "components/AutocompleteFormik";
import MDButton from "components/MDButton";

const fileToDataUri = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    resolve(event.target.result)
  };
  reader.readAsDataURL(file);
})

export const AddEventForm = (props) => {
  const {event} = props
  const fileInputRef = useRef(null)
  const [file, setFile] = useState(null)
  const formikRef = useRef();


  const initialValues = {
    startDate: event ? moment(event.startDate).format("YYYY-MM-DD") : "",
    endDate: event ? moment(event.endDate).format("YYYY-MM-DD") : "",
    startTime: event ? moment(event.startTime).format("hh:mm") : "",
    endTime: event ? moment(event.startTime).format("hh:mm") : "",
    location: event ? event.location : "",
    description: event ? event.description : "",
    title: event ? event.title : ""
  }

  const validationSchema = Yup.object({
    startDate: Yup.string()
      .required("Please select a start date"),
    endDate: Yup.string()
      .required("Please select a end date"),
    startTime: Yup.string()
      .required("Please select a start time"),
    endTime: Yup.string()
      .required("Please select a end time"),
    description: Yup.string()
      .required("This field is required"),
    title: Yup.string()
      .required("This field is required")
  })

  const onSubmit = values => {
    console.log('file ', file)
    let data = {...values, ...{img: file}}

    data['eventType'] = 'event'
    data['startDate'] = moment(`${data.startDate} ${data.startTime}`).format()
    data['endDate'] = moment(`${data.endDate} ${data.endTime}`).format()
    data['date'] = data.startDate

    data = {...event, ...data}
    props.save(data)
  }

  const onFilechange = (e) => {
    /*Selected files data can be collected here.*/
    console.log(e.target.files);

    if (e.target.files.length > 0) {

      let file = e.target.files[0] || null
      if (!file) {
        return;
      }
      setFile(file)
    }
  }

  return <Formik
    innerRef={formikRef}
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={onSubmit}
  >
    {({errors, touched, setFieldValue}) => (
      <Form style={{display: 'flex', flexDirection: 'column', flex: 1}}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={6} sm={6}>
            <MDTypography variant="h6" fontWeight="bold">
              START DATE
            </MDTypography>
            <Field name="startDate">
              {({field}) =>
                <MDInput
                  type="date"
                  lang={"us-US"}
                  variant="outlined"
                  fullWidth
                  error={errors.startDate !== undefined}
                  helperText={errors.startDate && errors.startDate}
                  {...field}
                />}
            </Field>
          </Grid>
          <Grid item xs={6} md={6} sm={6}>
            <MDTypography variant="h6" fontWeight="bold">
              END DATE
            </MDTypography>
            <Field name="endDate">
              {({field}) =>
                <MDInput
                  type="date"
                  lang={"us-US"}
                  variant="outlined"
                  fullWidth
                  error={errors.endDate !== undefined}
                  helperText={errors.endDate && errors.endDate}
                  {...field}
                />}
            </Field>
          </Grid>

          <Grid item xs={6} md={6} sm={6}>
            <MDTypography variant="h6" fontWeight="bold">
              START TIME
            </MDTypography>
            <Field name="startTime">
              {({field}) =>
                <MDInput
                  type="time"
                  lang={"us-US"}
                  variant="outlined"
                  fullWidth
                  error={errors.startTime !== undefined}
                  helperText={errors.startTime && errors.startTime}
                  {...field}
                />}
            </Field>
          </Grid>
          <Grid item xs={6} md={6} sm={6}>
            <MDTypography variant="h6" fontWeight="bold">
              END TIME
            </MDTypography>
            <Field name="endTime">
              {({field}) =>
                <MDInput
                  type="time"
                  lang={"us-US"}
                  variant="outlined"
                  fullWidth
                  error={errors.endTime !== undefined}
                  helperText={errors.endTime && errors.endTime}
                  {...field}
                />}
            </Field>
          </Grid>

          <Grid item xs={12} md={12} sm={12}>
            <Field name="location">
              {({field}) =>
                <MDInput
                  type="text"
                  variant="outlined"
                  label="LOCATION (OPTIONAL)"
                  fullWidth
                  error={errors.location !== undefined}
                  helperText={errors.location && errors.location}
                  {...field}
                />}
            </Field>
          </Grid>

          <Grid item xs={12} md={12} sm={12}>

            <Field name="title">
              {({field}) =>
                <MDInput
                  label={'EVENT NAME'}
                  type="text"
                  variant="outlined"
                  fullWidth
                  error={errors.title !== undefined}
                  helperText={errors.title && errors.title}
                  {...field}
                />}
            </Field>
          </Grid>

          <Grid item xs={12} md={12} sm={12}>

            <Field name="description">
              {({field}) =>
                <MDInput
                  label={'DESCRIPTION'}
                  type="text"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={5}
                  error={errors.description !== undefined}
                  helperText={errors.description && errors.description}
                  {...field}
                />}
            </Field>
          </Grid>
        </Grid>
        <Grid container display={'flex'} justifyContent={'space-evenly'} mt={2}>

          <Grid item xs={4}>
            <input accept="image/png, image/jpeg" type="file" id="upload"
                   onChange={onFilechange}
                   hidden ref={fileInputRef}/>
            <div>
              <MDButton color="primary" variant={'outlined'} fullWidth
                        onClick={() => {
                          fileInputRef.current.click()
                        }}
              > <AttachmentIcon/> Add Attachment</MDButton>
            </div>
          </Grid>

          <Grid item xs={4}>
            <MDButton color="primary" fullWidth type="submit">
              Save
            </MDButton>
          </Grid>

        </Grid>

      </Form>
    )}
  </Formik>
}


export const AddStoryForm = (props) => {
  const {event} = props
  const fileInputRef = useRef(null)
  const [file, setFile] = useState(null)
  const formikRef = useRef();


  const initialValues = {
    title: event ? event.title : "",
    link: event ? event.link : "",
    description: event ? event.description : ""
  }

  const validationSchema = Yup.object({
    title: Yup.string()
      .required("This field is required"),
    description: Yup.string()
      .required("This field is required")
  })

  const onSubmit = values => {
    let data = {...values, ...{img: file}}
    if (!event) {
      data['eventType'] = 'story'
      data['date'] = moment().format();
    }
    data = {...event, ...data}
    props.save(data)
  }

  const onFilechange = (e) => {
    /*Selected files data can be collected here.*/
    console.log(e.target.files);

    if (e.target.files.length > 0) {

      let file = e.target.files[0] || null
      if (!file) {
        return;
      }

      setFile(file)
    }
  }

  return <Formik
    innerRef={formikRef}
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={onSubmit}
  >
    {({errors, touched, setFieldValue}) => (
      <Form style={{display: 'flex', flexDirection: 'column', flex: 1}}>
        <Grid container spacing={2}>

          <Grid item xs={12} md={12} sm={12}>

            <Field name="title">
              {({field}) =>
                <MDInput
                  label={'TITLE'}
                  type="text"
                  variant="outlined"
                  fullWidth
                  error={errors.title !== undefined}
                  helperText={errors.title && errors.title}
                  {...field}
                />}
            </Field>
          </Grid>

          <Grid item xs={12} md={12} sm={12}>

            <Field name="link">
              {({field}) =>
                <MDInput
                  label={'LINK (OPTIONAL)'}
                  type="text"
                  variant="outlined"
                  fullWidth
                  error={errors.link !== undefined}
                  helperText={errors.link && errors.link}
                  {...field}
                />}
            </Field>
          </Grid>

          <Grid item xs={12} md={12} sm={12}>

            <Field name="description">
              {({field}) =>
                <MDInput
                  label={'DESCRIPTION'}
                  type="text"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={5}
                  error={errors.description !== undefined}
                  helperText={errors.description && errors.description}
                  {...field}
                />}
            </Field>
          </Grid>
        </Grid>
        <Grid container display={'flex'} justifyContent={'space-evenly'} mt={2}>

          <Grid item xs={4}>
            <input accept="image/png, image/jpeg" type="file" id="upload"
                   onChange={onFilechange}
                   hidden ref={fileInputRef}/>
            <div>
              <MDButton color="primary" variant={'outlined'} fullWidth
                        disabled={props.loading ? props.loading : false}
                        onClick={() => {
                          fileInputRef.current.click()
                        }}
              > <AttachmentIcon/> Add Attachment</MDButton>
            </div>
          </Grid>

          <Grid item xs={4}>
            <MDButton color="primary" fullWidth type="submit" disabled={props.loading ? props.loading : false} loading={props.loading ? props.loading : false}>
              Save
            </MDButton>
          </Grid>

        </Grid>

      </Form>
    )}
  </Formik>
}

