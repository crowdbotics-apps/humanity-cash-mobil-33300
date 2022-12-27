import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {debounce, Grid, Modal} from "@mui/material";
import Box from "@mui/material/Box";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import MDBox from "../../components/MDBox";
import {Field, Form, Formik} from "formik";
import MDInput from "../../components/MDInput";
import MDButton from "../../components/MDButton";
import * as Yup from "yup";
import TextField from '@mui/material/TextField';
import {TimeRangeField} from "./appointmentFields";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DesktopDatePicker} from "@mui/x-date-pickers";
import {AutocompleteFormik} from "../../components/AutocompleteFormik";
import {showMessage, useApi} from "../../services/helpers";
import moment from "moment";
import ConfirmDialogModal from "../../components/ConfirmDialogModal";
import {getTimeSlot} from "../../utils/helpers";


const NoteValidationSchema =
  Yup.object().shape({
    title: Yup.string().required('Note title is a required field'),
    // team: Yup.object().nullable().shape({
    //   title: Yup.string().required("The team is required")
    // }),
    description: Yup.string().required('Note description is a required field'),
  })


export const NotesModal = ({handleClose, open, note, onSave, slotValue}) => {
  const [ShowConfirmModal, setShowConfirmModal] = useState(false)
  const formikRef = useRef();
  const [loading, setLoading] = useState(false)
  const [Note, setNote] = useState()
  const [fromTime, setFromTime] = useState(null)
  const [toTime, setToTime] = useState(null)
  const [NoteDate, setNoteDate] = useState(null)
  const [TeamOptions, setTeamOptions] = useState([])
  const api = useApi()
  const [initialValues, setInitialValues] = useState(null)

  useEffect(() => {
    if (slotValue && slotValue.slots) {
      setNoteDate(slotValue.slots[0])
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

  const getTeams = (q)=>{
    api.getTeams(q).then(response => {
      if (response.kind === "ok") {
        setTeamOptions(response.data.results)
      }
    }).catch(err => console.log(err))
  }

  const onTeamInputChange = (input, q) => {
    getTeams(q)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchTeamDelayed = useCallback(debounce(onTeamInputChange, 500), [])

  useEffect(() => {
    getTeams("")
    clearForm()
    let data = {
      title: note ? note.title : "",
      description: "",
      team: {title: "", id: null},
      id: null,
      appointment_date: null,
      start_time: null,
      end_time: null
    }

    if (note) {
      const today_string = moment().format("YYYY-MM-DD")

      if (note.eventDetail) {
        data.id = note.eventDetail.id
        setFromTime(note.start || null)
        setToTime(note.end || null)
        setNoteDate(note.start || null)

        data.appointment_date = note.start
        data.description = note.eventDetail.description
        if (note.eventDetail.assigned_team) {
          data.team = note.eventDetail.assigned_team
        }
      } else {

        data.id = note.id
        data.description = note.description
        data.appointment_date = note.appointment_date

        const appointment_date = note.appointment_date ? moment(note.appointment_date) : null
        const start_time = note.start_time ? moment(`${today_string} ${note.start_time}`) : null
        const end_time = note.end_time ? moment(`${today_string} ${note.end_time}`) : null

        setNoteDate(appointment_date?appointment_date.toDate():null)
        setFromTime(start_time?start_time.toDate():null)
        setToTime(end_time?end_time.toDate():null)

        if (note.team) {
          data.team = note.team
        }
      }
    }
    setInitialValues(data)
    setNote(data)

  }, [note])

  const cancelItemDelete = () => {
    setShowConfirmModal(false)
    // setOpen(false)
    // setSelectedElement(null)
  }


  const deleteNote = () => {
    setLoading(true)
    api.deleteNote(Note.id).then((result) => {
      if (result.kind === "ok") {
        showMessage('Note deleted successfully', 'success')

        handleClose()
        onSave()
        clearForm()
        setShowConfirmModal(false)
      } else {
        showMessage('could not delete the note ', 'error')
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))

  }

  const addNote = (data) => {
    setLoading(true)
    api.addNote(data).then((result) => {
      if (result.kind === "ok") {
        showMessage('Note added successfully', 'success')
        handleClose()
        onSave()
        clearForm()
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

  const updateNote = (data) => {
    setLoading(true)
    api.editNote(data.id, data).then((result) => {
      if (result.kind === "ok") {
        onSave()
        handleClose()
        showMessage('Note updated successfully', 'success')
        clearForm()
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

  const clearForm = ()=>{
    setNoteDate(null)
    setFromTime(null)
    setToTime(null)
    setNote(null)
    setInitialValues( {
      title:  "",
      description: "",
      team: {title: "", id: null},
      id: null,
      appointment_date: null,
      start_time: null,
      end_time: null
    })
  }

  const saveNote = (values) => {
    let data = {...values}

    if(NoteDate){
      const appointment_date = moment(NoteDate.$d || NoteDate)
      data.appointment_date = appointment_date.isValid() ? appointment_date.format("YYYY-MM-DD") : null
    }else{
      data.appointment_date =  null
    }
    const start_time = moment(fromTime)
    const end_time = moment(toTime)
    data.start_time = start_time.isValid() ? start_time.format('HH:mm:ss') : null
    data.end_time = end_time.isValid() ? end_time.format('HH:mm:ss') : null
    data.assigned_team_id = data.team ? data.team.id : null
    data.team = data.team ? data.team.id : null

    // return
    if (Note && Note.id) {
      // delete data.team
      updateNote(data)
    } else {
      addNote(data);
    }
  }

  return (
    <>

      <ConfirmDialogModal
        title={'Do you want to delete this Note?'}
        description={`${Note?.id} - ${Note?.title}`}
        cancelText={'Cancel'}
        confirmText={'Confirm'}
        open={ShowConfirmModal}
        handleClose={() => {
          cancelItemDelete()
        }}
        handleConfirm={() => {
          deleteNote()
        }}
      />
      <Modal
        open={open}
        onClose={null}
      >


        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          minWidth: 500,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 5,
          display: 'flex',
          flexDirection: 'column',
          flex: 1
        }}>
          <MDBox style={{display: "flex", flexDirection: "row-reverse", justifyContent: "space-between"}}>
            <ClearIcon sx={{cursor: 'pointer'}} color={'secondary'} onClick={()=>{
              clearForm()
              handleClose()
            }}/>

            {Note && Note.id && (
              <DeleteIcon sx={{cursor: 'pointer'}} color={'secondary'} onClick={() => setShowConfirmModal(true)}/>
            )}
          </MDBox>

          <Typography variant="h3" textAlign={'center'} mb={2}>
            Notes
          </Typography>
          <MDBox display={'flex'} height={400}>
            <Formik
              innerRef={formikRef}
              enableReinitialize
              initialValues={initialValues}
              validationSchema={NoteValidationSchema}
              onSubmit={values => {
                saveNote(values)
              }}
            >
              {({errors, touched, isValid, setFieldValue, setTouched, handleChange}) => (
                <Form style={{display: 'flex', flexDirection: 'column', flex: 1}}>
                  <MDBox style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        label="Date"
                        inputFormat="MM/DD/YYYY"
                        value={NoteDate}
                        minDate={new Date()}
                        InputAdornmentProps={{position: 'start'}}
                        onChange={(newValue) => {
                          setNoteDate(newValue)
                          setFieldValue('appointment_date', newValue)
                        }}
                        renderInput={(params) => <TextField style={{width: 120, textAlign: "center"}}
                                                            variant={"standard"} {...params} />}
                      />
                    </LocalizationProvider>
                  </MDBox>
                  <MDBox style={{display: "flex", flexDirection: "row", alignItems: "center"}}>

                    <TimeRangeField
                      fromTime={fromTime}
                      toTime={toTime}
                      setFromTime={setFromTime}
                      setToTime={setToTime}
                      touched={touched}
                      errors={errors}
                      setFieldValue={setFieldValue}
                    />

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
                        label={"Team"}
                      />
                    )}
                  </Field>


                  <Field name="title">
                    {({field}) => {
                      return (
                        <MDBox mb={2} mt={2}>
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
                    }}
                  </Field>

                  <Field name="description">
                    {({field}) => {
                      return (
                        <MDBox mb={2} mt={2}>
                          <MDInput
                            rows={4}
                            type="text"
                            label="Description"
                            variant="standard"
                            fullWidth
                            multiline
                            // maxRows={10}
                            error={touched.description === true && errors.description !== undefined}
                            helperText={touched.description === true && errors.description && errors.description}
                            {...field}
                          />
                        </MDBox>
                      )
                    }}
                  </Field>

                  <MDBox mx={'auto'} justifyContent={'center'} mt={'auto'}>
                    <MDButton sx={{minWidth: 150}} size={'large'} loading={loading} disabled={loading || !isValid}
                              variant="gradient" color="secondary" type='submit'>
                      Save Note
                    </MDButton>
                  </MDBox>
                </Form>
              )}
            </Formik>
          </MDBox>
        </Box>
      </Modal>
    </>

  )

};


export const AddNoteOrServiceModal = (
  {
    open,
    handleClose,
    handleAddNote,
    handleAddAppointment,
    children = null
  }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        minWidth: 350,
        minHeight: 150,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'column',
        flex: 1
      }}>
        <MDBox style={{display: "flex", flexDirection: "row-reverse"}}>
          <ClearIcon sx={{cursor: 'pointer'}} color={'secondary'} onClick={handleClose}/>
        </MDBox>


        <Typography variant="h6" textAlign={'center'} mb={2}>
          What do you want to add?
        </Typography>
        <Grid container display={'flex'} justifyContent={'center'} mt={2}>
          <Grid item xs={5}>
            <MDButton variant="gradient" color="primary" fullWidth onClick={handleAddNote}>
              Note
            </MDButton>
          </Grid>
          <Grid item xs={5} ml={2}>
            <MDButton variant="gradient" color="secondary" fullWidth onClick={handleAddAppointment}>
              Appointment
            </MDButton>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
};

export const DeleteAppointmentModal = (
  {
    open,
    handleClose,
    handleDeleteSeries,
    handleDeleteOccurrence,
  }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700,
        minHeight: 150,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'column',
        flex: 1
      }}>
        <MDBox style={{display: "flex", flexDirection: "row-reverse"}}>
          <ClearIcon sx={{cursor: 'pointer'}} color={'secondary'} onClick={handleClose}/>
        </MDBox>


        <Typography variant="h6" textAlign={'center'} mb={2}>
          Do you want to delete the whole set of repeated events?
        </Typography>
        <Grid container mt={2} display={'flex'} justifyContent={'space-between'}>
          <Grid item xs={4}>
            <MDButton variant="gradient" color="error" onClick={handleDeleteSeries} sx={{width: 200}}>
              Delete series
            </MDButton>
          </Grid>
          <Grid item xs={4}>
            <MDButton variant="gradient" color="error" onClick={handleDeleteOccurrence} sx={{width: 200}}>
              Delete occurrence
            </MDButton>
          </Grid>
          <Grid item xs={4}>
            <MDButton variant="gradient" color="primary" onClick={handleClose} sx={{width: 200}}>
              Cancel
            </MDButton>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
};

export const EditAppointmentModal = (
  {
    open,
    handleClose,
    handleEditSeries,
    handleEditOccurrence,
  }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700,
        minHeight: 150,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'column',
        flex: 1
      }}>
        <MDBox style={{display: "flex", flexDirection: "row-reverse"}}>
          <ClearIcon sx={{cursor: 'pointer'}} color={'secondary'} onClick={handleClose}/>
        </MDBox>


        <Typography variant="h6" textAlign={'center'} mb={2}>
          Do you want to edit the whole set of repeated events?
        </Typography>
        <Grid container mt={2} display={'flex'} justifyContent={'space-between'}>
          <Grid item xs={4}>
            <MDButton variant="gradient" color="error" onClick={handleEditSeries} sx={{width: 200}}>
              Edit series
            </MDButton>
          </Grid>
          <Grid item xs={4}>
            <MDButton variant="gradient" color="error" onClick={handleEditOccurrence} sx={{width: 200}}>
              Edit occurrence
            </MDButton>
          </Grid>
          <Grid item xs={4}>
            <MDButton variant="gradient" color="primary" onClick={handleClose} sx={{width: 200}}>
              Cancel
            </MDButton>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
};
