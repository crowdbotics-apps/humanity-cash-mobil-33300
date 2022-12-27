import DashboardLayout from "../../components/LayoutContainers/DashboardLayout"
import {useEffect, useRef, useState} from "react"
import MDButton from "../../components/MDButton"
import {showMessage, useApi} from "../../services/helpers"
import MDBox from "../../components/MDBox";
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {CircularProgress, Grid, Input} from "@mui/material";
import MDInput from "../../components/MDInput";
import {ReactComponent as Search} from '../../assets/svg/search.svg'
import Pagination from "../../components/Pagination/Pagination";
import ConfirmDialogModal from "../../components/ConfirmDialogModal";
import ModalItem from "../../components/ModalItem";
import {dataTableModel, renderTableRow} from "./utils";
import DataTable from "../../components/DataTable";
import {ReactComponent as FiltroIcon} from '../../assets/svg/FunnelSimple.svg'
import {SketchPicker} from "react-color";


const Frequencies = () => {
  const api = useApi()
  const [selectedElement, setSelectedElement] = useState(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [openConfirmModal, setOpenConfirmModal] = useState(false)
  const [openEditConfirmModal, setEditOpenConfirmModal] = useState(false)
  const formikRef = useRef();
  const [recordList, setRecordList] = useState({...dataTableModel})
  const searchQueryBarRef = useRef(null);
  const searchQueryRef = useRef("");
  const lastKeyPressedRef = useRef(null);


  const getFrequencies = (searchData, page = 1, ordering = "") => {
    setLoading(true)
    api.getFrequencies(searchData, page, ordering, 9).then((result) => {
      if (result.kind === "ok") {
        const {count, results} = result.data
        const tmp = {...dataTableModel}
        tmp.rows = results.map(e => renderTableRow(e, selectItemEdit, selectItemDelete))
        setRecordList(tmp)
        setNumberOfItems(count)
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }

  const addFrequency = (data) => {
    setLoading(true)
    api.addFrequency(data).then((result) => {
      if (result.kind === "ok") {
        getFrequencies(searchQueryRef?.current?.value, currentPage)
        cancelItemDelete()
        showMessage('Frequency added successfully', 'success')
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

  const editFrequency = () => {
    setLoading(true)
    api.editFrequency(selectedElement).then((result) => {
      if (result.kind === "ok") {
        getFrequencies(searchQueryRef?.current?.value, currentPage)
        cancelItemDelete()
        showMessage('Frequency updated successfully', 'success')
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

  const deleteFrequency = () => {
    setLoading(true)
    api.deleteFrequency(selectedElement.id).then((result) => {
      if (result.kind === "ok") {
        getFrequencies(searchQueryRef?.current?.value, currentPage)
        cancelItemDelete()
        showMessage('Frequency deleted successfully', 'success')
      } else {
        showMessage()
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }

  const validationSchema =
    Yup.object().shape({
      title: Yup.string().required('Frequency title is a required field'),
      color_code: Yup.string().required('Frequency color is a required'),
    })

  const initialValues = {
    title: selectedElement ? selectedElement.title : "",
    color_code: selectedElement ? selectedElement.color_code : "",
  };

  const addeditFrequency = (data) => {
    if (selectedElement) {
      setSelectedElement({...data, id: selectedElement.id})
      setEditOpenConfirmModal(true)
    } else {
      addFrequency(data);
    }
  }

  const selectItemDelete = (item) => {
    setOpenConfirmModal(true)
    setSelectedElement(item)
  }

  const cancelItemDelete = () => {
    setEditOpenConfirmModal(false)
    setOpenConfirmModal(false)
    setOpen(false)
    setSelectedElement(null)
  }

  const selectItemEdit = (item) => {
    setSelectedElement(item)
    setOpen(true)
  }

  const onColumnOrdering = (ordering) => {
    const {column, order} = ordering
    if (column === '') {
      getFrequencies(searchQueryRef?.current?.value)
    } else if (order === 'asce') {
      getFrequencies(searchQueryRef?.current?.value, 1, `${column}`)
    } else {
      getFrequencies(searchQueryRef?.current?.value, 1, `-${column}`)
    }
  }

  const prepareCall = (evt) => {
    lastKeyPressedRef.current = (new Date()).getTime()
    setTimeout(() => {
      const now = (new Date()).getTime()
      if (loading || now - lastKeyPressedRef.current < 1000) {
        return
      }
      getFrequencies(searchQueryRef?.current?.value)
    }, 1000)
  }

  useEffect(() => {
    getFrequencies("")
  }, [])

  return (
    <DashboardLayout showCard loginRequired>
      <Grid container>
        <Grid item xs={8}>
          <MDBox sx={{backgroundColor: '#EBEBEB', borderRadius: 20, position: 'relative'}} px={5}>
            <Search style={{position: 'absolute', bottom: 7, left: 10}}/>
            <Input
              ref={searchQueryBarRef}
              inputRef={searchQueryRef}
              fullWidth
              placeholder="Search Frequency"
              type="text"
              onInputCapture={prepareCall}
            />
          </MDBox>
        </Grid>
        <Grid item xs={1} display="flex" alignItems="center" justifyContent="center">
          {loading ? <CircularProgress size={24} color="primary"/> : <FiltroIcon/>}
        </Grid>
        <Grid item xs={3} justifyContent={'flex-end'} display={'flex'}>
          <MDButton ml={'auto'} disabled={loading} variant="gradient" color="primary" onClick={() => setOpen(true)}>
            Add Frequency
          </MDButton>
        </Grid>
      </Grid>

      {recordList?.rows.length > 0
       ? (<DataTable table={recordList} onColumnOrdering={onColumnOrdering}/>)
       : <p style={{display: 'flex', height: '55vh', justifyContent: 'center', alignItems: 'center', fontSize: 20}}>No frequencies found</p>
      }

      <Pagination
        currentPage={currentPage}
        totalCount={numberOfItems}
        pageSize={8}
        onPageChange={page => {
          getFrequencies('', page)
          setCurrentPage(page)
        }}
      />

      <ConfirmDialogModal
        title={'Do you want to delete this frequency?'}
        description={`${selectedElement?.id} - ${selectedElement?.title}`}
        cancelText={'Cancel'}
        confirmText={'Confirm'}
        open={openConfirmModal}
        handleClose={() => cancelItemDelete()}
        handleConfirm={() => deleteFrequency()}
      />
      <ConfirmDialogModal
        title={'Do you want to update this frequency?'}
        description={`${selectedElement?.id} - ${selectedElement?.title}`}
        cancelText={'Cancel'}
        confirmText={'Confirm'}
        open={openEditConfirmModal}
        handleClose={() => setEditOpenConfirmModal(false)}
        handleConfirm={() => editFrequency()}
      />

      <ModalItem
        open={open}
        title={selectedElement ? 'Edit Frequency' : 'Add Frequency'}
        handleClose={() => cancelItemDelete()}
        scrollable={false}
      >
        <Formik
          innerRef={formikRef}
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={values => {
            addeditFrequency(values);
          }}
        >
          {({errors, touched, isValid, setFieldValue, values}) => (
            <Form style={{display: 'flex', flexDirection: 'column', flex: 1}}>
              <Field name="title">
                {({field}) => {
                  return (
                    <MDBox mb={2}>
                      <MDInput
                        type="text"
                        label="Frequency name"
                        variant="standard"
                        fullWidth
                        error={touched.title === true && errors.title !== undefined}
                        helperText={touched.title === true && errors.title && errors.title}
                        {...field}
                      />
                    </MDBox>
                  )
                }
                }
              </Field>
              <Field name="color_code">
                {({field, value}) => {
                  console.log('values ===> ', values)
                  console.log('value ===> ', value)
                  return (
                    <MDBox mb={2} mt={4} sx={{display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center'}}>
                      <SketchPicker
                        color={field.value}
                        onChange={(color) => {
                          setFieldValue('color_code', color.hex)
                        }}
                      />
                      <span style={{marginTop: 10}} className={"MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium css-redp94-MuiFormHelperText-root"}>
                        {errors.color_code ? errors.color_code : ''}
                      </span>
                    </MDBox>
                  )
                }
                }
              </Field>
              <MDBox mx={'auto'} justifyContent={'center'} mt={'auto'}>
                <MDButton sx={{minWidth: 150}} size={'large'} loading={loading} disabled={loading || !isValid}
                          variant="gradient" color="secondary" type='submit'>
                  Save Frequency
                </MDButton>
              </MDBox>
            </Form>
          )}
        </Formik>
      </ModalItem>
    </DashboardLayout>
  )
}

export default Frequencies
