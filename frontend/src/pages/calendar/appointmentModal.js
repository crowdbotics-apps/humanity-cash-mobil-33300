import {showMessage, useApi} from "../../services/helpers";
import React, {memo, useCallback, useEffect, useRef, useState} from "react";
import moment from "moment";
import ModalItem from "../../components/ModalItem";
import {Field, Form, Formik} from "formik";
import {Autocomplete, Checkbox, debounce, Grid, TextField} from "@mui/material";
import MDBox from "../../components/MDBox";
import MDInput from "../../components/MDInput";
import InputMask from "react-input-mask";
import Typography from "@mui/material/Typography";
import MDButton from "../../components/MDButton";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AppointmentValidationSchema, RepeatedEvent, TimeRangeField} from "./appointmentFields";
import {DesktopDatePicker} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {styles} from "./calendar.styles";
import {AutocompleteFormik} from "../../components/AutocompleteFormik";
import {NumericFormat} from "react-number-format";
import {getTimeSlot} from "../../utils/helpers";
import {DeleteAppointmentModal, EditAppointmentModal} from "./modals";

export const AppointmentModal = memo((({handleClose, showModal, appointment, slotValue, onSave}) => {
  const api = useApi()
  const [loading, setLoading] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [Repeat, setRepeat] = useState(false)
  const formikRef = useRef();
  const [AppointmentDate, setAppointmentDate] = useState(new Date())
  const [Clients, setClients] = useState([])
  const [Services, setServices] = useState([])
  const [SelectedServices, setSelectedServices] = useState([])
  const [Frequencies, setFrequencies] = useState([])
  //StatesForTimePicker
  const [fromTime, setFromTime] = useState(null)
  const [toTime, setToTime] = useState(null)
  const [initialValues, setInitialValues] = useState({})
  const [RepeatConfig, setRepeatConfig] = useState(null)
  const [SelectedData, setSelectedData] = useState(null)
  const [TeamOptions, setTeamOptions] = useState([])

  useEffect(() => {
    const [newFrom, newTo] = getTimeSlot(new Date().getTime())
    setFromTime(appointment ? new Date(`${appointment.appointment_date} ${appointment.start_time}`) : newFrom)
    setToTime(appointment ? new Date(`${appointment.appointment_date} ${appointment.end_time}`) : newTo)
    setAppointmentDate(appointment ? appointment.appointment_date : new Date())
    setInitialValues({
      id: appointment ? appointment.id : "",
      date: appointment ? moment(appointment.appointment_date).format('HH:mm:ss') : moment(new Date()).format('HH:mm:ss'),
      from_time: appointment ? appointment.start : new Date(),
      to_time: appointment ? appointment.end : "",
      client_address: appointment ? appointment.client_address || '' : "",
      client_number: appointment ? appointment.client_number || '' : "",
      client_city: appointment ? appointment.client_city || '' : "",
      client_state: appointment ? appointment.client_state || '' : "",
      client_zipcode: appointment ? appointment.client_zipcode || '' : "",
      team: appointment && appointment.assigned_team ? appointment.assigned_team : {title: "", id: null},
      services: appointment && appointment.services ? appointment.services : [],
      frequency: appointment && appointment.frequency ? {
        title: appointment.frequency.title,
        id: appointment.frequency.id
      } : {title: "", id: null},
      client: appointment && appointment.client ? {
        name: appointment.client.name,
        id: appointment.client.id
      } : {name: "", id: null},
      price: appointment ? appointment.price : "",
      description: appointment ? appointment.description : "",
      notes: appointment ? appointment.notes : "",
      title: appointment ? appointment.title : "",
    })
    // setRepeat(!!appointment?.repeated)
    setRepeat(appointment?.repeat_config != null)
    setRepeatConfig(appointment?.repeat_config)
  }, [appointment])

  useEffect(() => {
    if (slotValue && slotValue.slots) {
      setAppointmentDate(slotValue.slots[0])
      if (slotValue.slots.length > 1) {
        setFromTime(slotValue.slots[0].getTime())
        setToTime(slotValue.slots[slotValue.slots.length - 1].getTime())
      } else {
        const [newFrom, newTo] = getTimeSlot(new Date().getTime())
        setFromTime(newFrom)
        setToTime(newTo)
      }
      setInitialValues({...initialValues, team: slotValue.team || {title: "", id: null}})
    }
  }, [slotValue])


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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchTeamDelayed = useCallback(debounce(getTeams, 500), [])

  const getClients = (input, q) => {
    api.getCustomers(q, 1, true).then(response => {
      if (response.kind === "ok") {
        setClients(response.data.results)
      }
    }).catch(error => console.log(error))
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchClientDelayed = useCallback(debounce(getClients, 500), [])

  const getServices = () => {
    api.getServices("").then(response => {
      if (response.kind === "ok") {
        setServices(response.data.results)
      }
    }).catch(error => console.log(error))
  }
  const getFrequencies = () => {
    api.getFrequencies("", 1, "", 10000).then(response => {
      if (response.kind === "ok") {
        setFrequencies(response.data.results)
      }
    }).catch(error => console.log(error))
  }

  const deleteAppointment = (data) => {
    setLoading(true)
    api.deleteAppointment(data).then((result) => {
      if (result.kind === "ok") {
        setOpenDeleteModal(false)
        onSave()
        showMessage('Appointment deleted successfully', 'success')
      } else {
        showMessage()
      }
    })
      .catch(err => showMessage())
      .finally(() => {
        setLoading(false)
        setInitialValues({})
      })
  }


  const addAppointment = (data) => {
    setLoading(true)
    api.addAppointment(data).then((result) => {
      if (result.kind === "ok") {
        onSave()
        setInitialValues({})
        showMessage('Appointment added successfully', 'success')
      } else if (result.kind === "bad-data") {
        formikRef.current.setErrors(result.errors)
        showMessage('Validation errors found')
      } else {
        showMessage()
      }
    })
      .catch(err => {
        showMessage()
      })
      .finally(() => setLoading(false))
  }
  const saveAppointment = (data) => {
    data.client_number = data.client_number.replace("() -", "")
    data.title = data.title !== '' ? data.title : data.client.display_company ? data.client.company_name : data.client.name
    data.appointment_date = moment(AppointmentDate).format("YYYY-MM-DD")
    data.start_time = moment(fromTime).format('HH:mm:ss')
    data.end_time = moment(toTime).format('HH:mm:ss')
    data.client_id = data.client.id
    data.client_name = data.client.name
    data.frequency_id = data.frequency.id
    data.services = SelectedServices.map(e => e.id)
    data.assigned_team_id = data.team.id
    data.status = 'Accepted'
    data.repeat_config = RepeatConfig
    if (data.id) {
      setOpenEditModal(true)
      setSelectedData(data)
      // editAppointment(data.id, data)
    } else {
      addAppointment(data)
    }
  }

  const editAppointment = (data) => {
    setLoading(true)
    api.editAppointment(data.id, data).then((result) => {
      if (result.kind === "ok") {
        setOpenEditModal(false)
        onSave()
        showMessage('Appointment updated successfully', 'success')
      } else if (result.kind === "bad-data") {
        formikRef.current.setErrors(result.errors)
        showMessage('Validation errors found')
      } else {
        showMessage()
      }
    })
      .catch(err => showMessage())
      .finally(() => {
        setLoading(false)
        setInitialValues({})
      })
  }

  useEffect(() => {
    getFrequencies()
  }, [openEditModal, openDeleteModal])


  return (
    <ModalItem
      scrollable={false}
      open={showModal}
      closeOnClickOutside={false}
      height={610}
      width={1024}
      title={appointment ? 'Edit Appointment' : 'Add Appointment'}
      handleClose={() => handleClose()}
      handleDelete={initialValues.id !== "" ? () => setOpenDeleteModal(true) : null }
    >
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
            {initialValues && (
              <Grid container spacing={5}>
                <Grid item lg={6} md={6}>
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
                        renderInput={(params) => <TextField style={{width: 150, textAlign: "center", marginLeft: '2px'}}
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
                    marginRight={'50px'}
                  />

                  <MDBox
                    sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}
                    mt={1} mb={1} ml={0} pl={0}>

                    <MDBox sx={{width: "70%", marginRight: 4}}>
                      <Field name="client">
                        {({field}) => (
                          <AutocompleteFormik
                            options={Clients}
                            labelFieldName={"name"}
                            field={field}
                            onChange={(e, value) => {
                              if (value && value.id) {
                                setFieldValue('client_number', value.phone_number || '')
                                setFieldValue('client_address', value.address || '')
                                setFieldValue('client_state', value.state || '')
                                setFieldValue('client_city', value.city || '')
                                setFieldValue('client_zipcode', value.zip_code || '')
                              }
                            }}
                            onInputChange={searchClientDelayed}
                            setFieldValue={setFieldValue}
                            initialValue={initialValues.client}
                            touched={touched}
                            errors={errors}
                            fullWidth
                            label={"Client Name"}
                          />
                        )}
                      </Field>
                    </MDBox>

                    <Field name="client_number">
                      {({field}) => {
                        return (
                          <MDBox sx={{width: "30%"}}>
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


                  <Field name="client_address">
                    {({field}) => (
                      <MDBox mb={1} mt={2} style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
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
                    }
                  </Field>
                  <Field name="client_city">
                    {({field}) => (
                      <MDBox>
                        <MDInput
                          type="text"
                          label="City"
                          variant="standard"
                          fullWidth
                          error={touched.client_city === true && errors.client_city !== undefined}
                          helperText={touched.client_city === true && errors.client_city && errors.client_city}
                          {...field}
                        />
                      </MDBox>
                    )
                    }
                  </Field>

                  <MDBox
                    sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}
                    mt={1} mb={2} ml={0} pl={0}>

                    <Field name="client_state">
                      {({field}) => (
                        <MDBox sx={{width: "50%", marginRight: 2}}>
                          <MDInput
                            type="text"
                            label="State"
                            variant="standard"
                            fullWidth
                            error={touched.client_state === true && errors.client_state !== undefined}
                            helperText={touched.client_state === true && errors.client_state && errors.client_state}
                            {...field}
                          />
                        </MDBox>
                      )
                      }
                    </Field>


                    <MDBox sx={{width: "50%"}}>
                      <Field name="client_zipcode">
                        {({field}) => (
                          <MDInput
                            type="text"
                            label="Zipcode"
                            variant="standard"
                            fullWidth
                            error={touched.client_zipcode === true && errors.client_zipcode !== undefined}
                            helperText={touched.client_zipcode === true && errors.client_zipcode && errors.client_zipcode}
                            {...field}
                          />
                        )}
                      </Field>
                    </MDBox>
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
                  <Field name="services">
                    {({field}) => {
                      return (
                        <MDBox mb={1} mt={1}>
                          <Autocomplete
                            multiple
                            filterSelectedOptions
                            options={Services}
                            defaultValue={initialValues.services}
                            getOptionLabel={option => `${option?.id} - ${option?.description}`}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            onChange={(event, value) => {
                              setSelectedServices(value)
                              if (value && value.length > 0) {
                                let sum = 0
                                value?.forEach(element => {
                                  sum += parseFloat(element.price);
                                });
                                setFieldValue('price', sum.toFixed(2).toString())
                              } else {
                                setFieldValue('price', 0)
                              }
                            }}
                            renderInput={(params) => (
                              <MDInput
                                type="text"
                                label="Services"
                                variant="standard"
                                placeholder="Select services from list"
                                fullWidth
                                error={errors.services !== undefined}
                                helperText={errors.services && errors.services}
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
                  <MDBox
                    sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}
                    mt={1} mb={1} ml={0} pl={0}>
                    <MDBox sx={{width: "50%", marginRight: 4}}>
                      <Field name="price">
                        {({field}) => {
                          return (
                            <MDBox mb={1} mt={1}>
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
                    </MDBox>

                    <MDBox sx={{width: "50%"}}>
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


                  <Field name="title">
                    {({field}) => (
                      <MDBox mb={1}>
                        <MDInput
                          type="text"
                          label="Title"
                          variant="standard"
                          fullWidth
                          error={touched.title === true && errors.title !== undefined}
                          helperText={touched.title === true && errors.title && errors.title}
                          {...field}
                        />
                      </MDBox>
                    )
                    }
                  </Field>
                </Grid>
                <Grid item lg={6} md={6}>
                  <MDBox style={{display: "flex", flexDirection: "row", alignItems: "center"}} mt={1}>
                    <Field name="description">
                      {({field}) => {
                        return (
                          <MDBox pr={2}>
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
                          <MDBox>
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

                  <MDBox style={{display: "flex", flexDirection: "row", alignItems: "center"}} mt={1}>
                    <Field name="description">
                      {({field}) => {
                        return (
                          <MDBox style={{...styles.flexRowStart, alignItems: "center"}}>
                            <Typography style={{fontSize: 14, fontWeight: "bold"}}>Repeat Event</Typography>
                            <Checkbox
                              checked={Repeat}
                              onChange={(e) => setRepeat(prevState => !prevState)}
                            />
                          </MDBox>)
                      }}
                    </Field>
                  </MDBox>
                  {Repeat && (
                    <RepeatedEvent repeatConfig={RepeatConfig} onRepeatConfigChange={setRepeatConfig}/>
                  )}

                </Grid>
              </Grid>
            )}


            <MDBox mx={'auto'} justifyContent={'center'} mt={'auto'}>
              <MDButton sx={{minWidth: 150}} size={'large'} loading={loading} disabled={loading || !isValid}
                        variant="gradient" color="secondary" type='submit'>
                Save
              </MDButton>
            </MDBox>
          </Form>
        )}
      </Formik>
      <EditAppointmentModal
        open={openEditModal}
        handleClose={() => {
          setOpenEditModal(false)
          setInitialValues({})
        }}
        handleEditOccurrence={() => editAppointment({...SelectedData, all: false})}
        handleEditSeries={() => editAppointment({...SelectedData, all: true})}
      />
      <DeleteAppointmentModal
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        handleDeleteOccurrence={() => deleteAppointment({id: initialValues.id, all: false})}
        handleDeleteSeries={() => deleteAppointment({id: initialValues.id, all: true})}
      />
    </ModalItem>
  )
}))

