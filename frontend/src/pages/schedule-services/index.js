import DashboardLayout from "../../components/LayoutContainers/DashboardLayout"
import React, {useEffect, useMemo, useRef, useState} from "react"
import MDButton from "../../components/MDButton"
import {showMessage, useApi} from "../../services/helpers"
import MDBox from "../../components/MDBox";
import Box from "@mui/material/Box";
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";
import MDInput from "../../components/MDInput";
import moment from "moment";
import InputMask from "react-input-mask";
import {Autocomplete, Checkbox, debounce, Grid, TextField} from "@mui/material";
import {AppointmentValidationSchema, RepeatedEvent, TimeRangeField} from "../calendar/appointmentFields";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DesktopDatePicker} from "@mui/x-date-pickers";
import {AutocompleteFormik} from "../../components/AutocompleteFormik";
import {NumericFormat} from "react-number-format";
import {styles} from "../calendar/calendar.styles";
import Typography from "@mui/material/Typography";


const ScheduleServicesPage = () => {
  const api = useApi()
  const [loading, setLoading] = useState(false)
  const [Repeat, setRepeat] = useState(false)
  const formikRef = useRef();
  const [AppointmentDate, setAppointmentDate] = useState(new Date())
  const [Clients, setClients] = useState([])
  const [Services, setServices] = useState([])
  const [Frequencies, setFrequencies] = useState([])
  const [Cities, setCities] = useState([])
  const [Regions, setRegions] = useState([])
  const [SelectedRegion, setSelectedRegion] = useState(null)
  const [SelectedCity, setSelectedCity] = useState(null)
  //StatesForTimePicker
  const [fromTime, setFromTime] = useState(null)
  const [toTime, setToTime] = useState(null)
  const [RepeatConfig, setRepeatConfig] = useState(null)


  const initialValues = {
    id: "",
    date: moment(new Date()).format('HH:mm:ss'),
    from_time: new Date(),
    to_time: "",
    client_address: "",
    client_number: "",
    team: {title: "", id: null},
    service: {name: "", id: null},
    frequency: {title: "", id: null},
    client: {name: "", id: null},
    price: "",
    description: "",
    notes: "",
  }

  useEffect(() => {
    setFromTime(new Date())
    setToTime(new Date())
    setAppointmentDate(new Date())
    getRegions()
  }, [])

  useEffect(() => {
  }, [initialValues])


  const [TeamOptions, setTeamOptions] = useState([])

  useEffect(() => {
    getServices()
    getTeams(null, "")
    getClients(null, "")
    getFrequencies()
  }, [])


  const getTeams = (input, q) => {
    api.getTeams(q).then(response => {
      if (response.kind === "ok") {
        setTeamOptions(response.data.results)
      }
    }).catch(err => console.log(err))
  }

  const searchTeamDelayed = useMemo(
    () => debounce(getTeams, 500),
    [getTeams]
  )

  const getClients = (input, q) => {
    api.getCustomers(q, 1, true).then(response => {
      if (response.kind === "ok") {
        setClients(response.data.results)
      }
    }).catch(error => console.log(error))
  }


  const searchClientDelayed = useMemo(
    () => debounce(getClients, 500),
    [getClients]
  )


  const getServices = () => {
    api.getServices("").then(response => {
      if (response.kind === "ok") {
        setServices(response.data.results)
      }
    }).catch(error => console.log(error))
  }
  const getFrequencies = () => {
    api.getFrequencies().then(response => {
      if (response.kind === "ok") {
        setFrequencies(response.data.results)
      }
    }).catch(error => console.log(error))
  }


  const addAppointment = (data) => {
    setLoading(true)
    api.addAppointment(data).then((result) => {
      if (result.kind === "ok") {
        // onSave()
        showMessage('Service added successfully', 'success')
      } else if (result.kind === "bad-data") {
        formikRef.current.setErrors(result.errors)
        showMessage('Validation errors found')
      } else {
        showMessage()
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }

  const getRegions = () => {
    api.getRegions().then((result) => {
      if (result.kind === "ok") {
        const {results} = result.data
        setRegions(results)
      }
    })
  }

  useEffect(() => {
    if (SelectedRegion){
      getCities(SelectedRegion?.id)
    }
  }, [SelectedRegion])

  const getCities = (id) => {
    api.getCities({region: id}).then((result) => {
      if (result.kind === "ok") {
        const {results} = result.data
        setCities(results)
      }
    })
  }

  const saveAppointment = (data) => {
    data.client_number = data.client_number.replace("() -", "")
    data.title = data.client.name
    data.appointment_date = moment(AppointmentDate).format("YYYY-MM-DD")
    data.start_time = moment(fromTime).format('HH:mm:ss')
    data.end_time = moment(toTime).format('HH:mm:ss')
    data.client_id = data.client.id
    data.client_name = data.client.name
    data.frequency_id = data.frequency.id
    data.service_id = data.service.id
    data.assigned_team_id = data.team.id
    data.status = 'Accepted'
    data.repeat_config = RepeatConfig
    addAppointment(data)

  }

  return (
    <DashboardLayout showCard loginRequired>
      <Formik
        innerRef={formikRef}
        enableReinitialize
        initialValues={initialValues}
        validationSchema={AppointmentValidationSchema}
        onSubmit={values => {
          saveAppointment(values);
        }}
      >
        {({errors, touched, values, isValid, setFieldValue, setTouched}) => (
          <Form style={{display: 'flex', flexDirection: 'column', flex: 1}}>
            <MDBox style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="Date"
                  inputFormat="MM/DD/YYYY"
                  value={AppointmentDate}
                  minDate={new Date()}
                  InputAdornmentProps={{position: 'start'}}
                  onChange={(newValue) => {
                    setFieldValue('date', moment(newValue.$d).format("YYYY-MM-DD"))
                    setAppointmentDate(newValue.$d)
                  }}
                  renderInput={(params) => <TextField style={{width: 150, textAlign: "center"}}
                                                      variant={"standard"} {...params} />}
                />
              </LocalizationProvider>
            </MDBox>

            <TimeRangeField
              fromTime={fromTime}
              toTime={toTime}
              setFromTime={setFromTime}
              setToTime={setToTime}
              touched={touched}
              errors={errors}
              setFieldValue={setFieldValue}
            />

            <Field name="client_address">
              {({field}) => {
                return (
                  <MDBox mb={2} mt={2} style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                    <MDInput
                      type="text"
                      label="Street address"
                      variant="standard"
                      fullWidth
                      error={touched.client_address === true && errors.client_address !== undefined}
                      helperText={touched.client_address === true && errors.client_address && errors.client_address}
                      {...field}
                    />
                  </MDBox>
                )
              }}
            </Field>

            <MDBox sx={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between"}} mt={1} mb={2} ml={0} pl={0} >


              <Field name="client_state">
                {({field}) => {
                  return (
                    <MDBox sx={{width:"45%", marginRight:2}}>
                      <Autocomplete
                        disablePortal
                        includeInputInList
                        options={Regions}
                        value={SelectedRegion}
                        onChange={(event, value) => {
                          setSelectedRegion(value)
                          setSelectedCity(null)
                          setFieldValue('client_state', value.id)
                        }}
                        isOptionEqualToValue={(option, value) => [option.id === value.id]}
                        disableClearable
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                          <MDInput
                            type="text"
                            label="State"
                            variant="standard"
                            fullWidth
                            error={errors.client_state !== undefined}
                            helperText={errors.client_state && errors.client_state}
                            {...field}
                            {...params}
                          />
                        )}
                      />
                    </MDBox>

                  )
                }
                }
              </Field>
              <Field name="client_city">
                {({field}) => {
                  return (
                    <MDBox sx={{width:"45%", marginRight:2}}>
                      <Autocomplete
                        disablePortal
                        options={Cities}
                        value={SelectedCity}
                        onChange={(event, value) => {
                          setSelectedCity(value)
                          setFieldValue('client_city', value.id)
                        }}
                        isOptionEqualToValue={(option, value) => [option.id === value.id]}
                        disableClearable
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                          <MDInput
                            type="text"
                            label="City"
                            variant="standard"
                            fullWidth
                            error={errors.client_city !== undefined}
                            helperText={ errors.client_city && errors.client_city}
                            {...field}
                            {...params}
                          />
                        )}
                      />
                    </MDBox>

                  )
                }
                }
              </Field>

              <MDBox sx={{width:"15%"}}>
                <Field name="client_zipcode" >
                  {({field}) => (
                    <MDInput
                      type="number"
                      label="Zipcode"
                      variant="standard"
                      fullWidth
                      field={field}
                      error={touched.client_zipcode === true && errors.client_zipcode !== undefined}
                      helperText={touched.client_zipcode === true && errors.client_zipcode && errors.client_zipcode}
                    />
                  )}
                </Field>
              </MDBox>
            </MDBox>
            <MDBox sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
              <MDBox sx={{width: "50%"}}>
                <Field name="client">
                  {({field}) => (
                    <AutocompleteFormik
                      options={Clients}
                      labelFieldName={"name"}
                      field={field}
                      onChange={(e, value) => {
                        if (value && value.id) {
                          setFieldValue('client_number', value.phone_number)
                          setFieldValue('client_address', value.address)
                        }
                      }}
                      onInputChange={searchClientDelayed}
                      setFieldValue={setFieldValue}
                      initialValue={initialValues.client}
                      touched={touched}
                      errors={errors}
                      label={"Client Name"}
                    />
                  )}
                </Field>
              </MDBox>


              <Field name="client_number">
                {({field}) => {
                  return (
                    <MDBox sx={{width: "50%"}} ml={2}>
                      <InputMask
                        mask="+1(999)-999-9999"
                        disabled={false}
                        {...field}
                      ><MDInput
                        type="text"
                        label="Cell phone"
                        variant="standard"
                        fullWidth
                        error={touched.client_number === true && errors.client_number !== undefined}
                        helperText={touched.client_number === true && errors.client_number && errors.client_number}
                      />
                      </InputMask>
                    </MDBox>
                  )
                }}
              </Field>
            </MDBox>

            <Field name="team">
              {({field}) => (
                <AutocompleteFormik
                  options={TeamOptions}
                  labelFieldName={"title"}
                  field={field}
                  onInputChange={searchTeamDelayed}
                  setFieldValue={setFieldValue}
                  initialValue={initialValues.team}
                  touched={touched}
                  errors={errors}
                  label={"Assigned Employee/Team"}
                />
              )}
            </Field>

            <MDBox sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}
                   mt={1} mb={2} >

              <MDBox sx={{width: "50%"}}>
                <Field name="service">
                  {({field}) => (
                    <AutocompleteFormik
                      options={Services}
                      labelFieldName={"name"}
                      field={field}
                      onChange={(e, value) => {
                        if (value && value.id) {
                          setFieldValue('price', value.price)
                        }
                      }}
                      setFieldValue={setFieldValue}
                      initialValue={initialValues.service}
                      touched={touched}
                      errors={errors}
                      label={"Service"}
                    />
                  )}
                </Field>
              </MDBox>

              <MDBox sx={{width: "50%"}} ml={2}>
                <Field name="frequency">
                  {({field}) => (
                    <AutocompleteFormik
                      options={Frequencies}
                      labelFieldName={"title"}
                      field={field}
                      setFieldValue={setFieldValue}
                      initialValue={initialValues.frequency}
                      touched={touched}
                      errors={errors}
                      label={"Frequency"}
                    />
                  )}
                </Field>
              </MDBox>
            </MDBox>


            <Field name="price">
              {({field}) => {
                return (
                  <MDBox mb={2} mt={1}>

                    <NumericFormat
                      customInput={MDInput}
                      type="text"
                      label="Price"
                      variant="standard"
                      fullWidth
                      thousandsGroupStyle="thousand"
                      thousandSeparator=","
                      decimalScale={2}
                      error={touched.price === true && errors.price !== undefined}
                      helperText={touched.price === true && errors.price && errors.price}
                      {...field}
                    />


                  </MDBox>
                )
              }
              }
            </Field>
            <MDBox style={{display: "flex", flexDirection: "row"}} mt={1}>
              <Field name="description">
                {({field}) => {
                  return (
                    <MDBox pr={2} style={{width: "50%"}}>
                      <MDInput
                        type="text"
                        label="description"
                        multiline
                        rows={3}
                        fullWidth
                        error={touched.description === true && errors.description !== undefined}
                        helperText={touched.description === true && errors.description && errors.description}
                        {...field}
                      />
                    </MDBox>
                  )
                }}
              </Field>

              <Field name="notes">
                {({field}) => {
                  return (
                    <MDBox style={{width: "50%"}}>
                      <MDInput
                        type="text"
                        label="notes"
                        multiline
                        rows={3}
                        fullWidth
                        error={touched.notes === true && errors.notes !== undefined}
                        helperText={touched.notes === true && errors.notes && errors.notes}
                        {...field}
                      />
                    </MDBox>
                  )
                }}
              </Field>
            </MDBox>

            <MDBox style={{marginBottom: 'auto'}} mt={1}>
              <Field name="description">
                {({field}) => {
                  return (
                    <MDBox style={{...styles.flexRowStart, alignItems: "center"}}>
                      <Typography style={{fontSize: 14, fontWeight: "bold"}}>Repeat Event</Typography>
                      <Checkbox
                        value={Repeat}
                        onChange={(e) => setRepeat(prevState => !prevState)}
                      />
                    </MDBox>)
                }}
              </Field>
            </MDBox>
            {Repeat && (
              <RepeatedEvent onRepeatConfigChange={setRepeatConfig}/>
            )}
            <MDBox mx={'auto'} justifyContent={'center'} mt={'auto'}>
              <MDButton sx={{minWidth: 150}} size={'large'} loading={loading} disabled={loading || !isValid}
                        variant="gradient" color="secondary" type='submit'>
                Save
                {/*{errors && JSON.stringify(errors)}*/}
              </MDButton>
            </MDBox>
          </Form>
        )}
      </Formik>
    </DashboardLayout>
  )
}

export default ScheduleServicesPage
