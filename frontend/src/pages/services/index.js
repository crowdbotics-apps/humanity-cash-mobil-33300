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
import {NumericFormat} from "react-number-format";
import {ReactComponent as FiltroIcon} from '../../assets/svg/FunnelSimple.svg'


const Services = () => {
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


  const getServices = (searchData, page = 1, ordering = "") => {
    setLoading(true)
    api.getServices(searchData, page, ordering, 8).then((result) => {
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

  const addService = (data) => {
    setLoading(true)
    api.addService(data).then((result) => {
      if (result.kind === "ok") {
        getServices(searchQueryRef?.current?.value, currentPage)
        cancelItemDelete()
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

  const editService = () => {
    setLoading(true)
    api.editService(selectedElement).then((result) => {
      if (result.kind === "ok") {
        getServices(searchQueryRef?.current?.value, currentPage)
        cancelItemDelete()
        showMessage('Service updated successfully', 'success')
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

  const deleteService = () => {
    setLoading(true)
    api.deleteService(selectedElement.id).then((result) => {
      if (result.kind === "ok") {
        getServices(searchQueryRef?.current?.value, currentPage)
        cancelItemDelete()
        showMessage('Service deleted successfully', 'success')
      } else {
        showMessage()
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }

  const validationSchema =
    Yup.object().shape({
      name: Yup.string().required('Service name is a required field'),
      description: Yup.string().required('Service descriptiom is a required field'),
      price: Yup.string().required('Service price is a required field')
    })

  const initialValues = {
    name: selectedElement ? selectedElement.name : "",
    description: selectedElement ? selectedElement.description : "",
    price: selectedElement ? selectedElement.price : ""
  };

  const addEditService = (data) => {
    if (selectedElement) {
      setSelectedElement({...data, id: selectedElement.id})
      setEditOpenConfirmModal(true)
    } else {
      addService(data);
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
      getServices(searchQueryRef?.current?.value)
    } else if (order === 'asce') {
      getServices(searchQueryRef?.current?.value, 1, `${column}`)
    } else {
      getServices(searchQueryRef?.current?.value, 1, `-${column}`)
    }
  }

  const prepareCall = (evt) => {
    lastKeyPressedRef.current = (new Date()).getTime()
    setTimeout(() => {
      const now = (new Date()).getTime()
      if (loading || now - lastKeyPressedRef.current < 1000) {
        return
      }
      getServices(searchQueryRef?.current?.value)
    }, 1000)
  }

  useEffect(() => {
    getServices("")
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
              placeholder="Search Service"
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
            Add Service
          </MDButton>
        </Grid>
      </Grid>

      {recordList?.rows.length > 0
       ? (<DataTable table={recordList} onColumnOrdering={onColumnOrdering}/>)
       : <p style={{display: 'flex', height: '55vh', justifyContent: 'center', alignItems: 'center', fontSize: 20}}>No services found</p>
      }

      <Pagination
        currentPage={currentPage}
        totalCount={numberOfItems}
        pageSize={8}
        onPageChange={page => {
          getServices('', page)
          setCurrentPage(page)
        }}
      />

      <ConfirmDialogModal
        title={'Do you want to delete this service?'}
        description={`${selectedElement?.id} - ${selectedElement?.name}`}
        cancelText={'Cancel'}
        confirmText={'Confirm'}
        open={openConfirmModal}
        handleClose={() => cancelItemDelete()}
        handleConfirm={() => deleteService()}
      />
      <ConfirmDialogModal
        title={'Do you want to update this service?'}
        description={`${selectedElement?.id} - ${selectedElement?.name}`}
        cancelText={'Cancel'}
        confirmText={'Confirm'}
        open={openEditConfirmModal}
        handleClose={() => setEditOpenConfirmModal(false)}
        handleConfirm={() => editService()}
      />

      <ModalItem
        open={open}
        title={selectedElement ? 'Edit Service' : 'Add Service'}
        handleClose={() => cancelItemDelete()}
        scrollable={false}
      >
        <Formik
          innerRef={formikRef}
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={values => {
            const newValues = {...values, price: values.price.replace(/,/g, '')}
            addEditService(newValues);
          }}
        >
          {({errors, touched, isValid}) => (
            <Form style={{display: 'flex', flexDirection: 'column', flex: 1}}>
              <Field name="name">
                {({field}) => {
                  return (
                    <MDBox mb={2}>
                      <MDInput
                        type="text"
                        label="Service name"
                        variant="standard"
                        fullWidth
                        error={touched.name === true && errors.name !== undefined}
                        helperText={touched.name === true && errors.name && errors.name}
                        {...field}
                      />
                    </MDBox>
                  )
                }
                }
              </Field>
              <Field name="description">
                {({field}) => {
                  return (
                    <MDBox mb={2}>
                      <MDInput
                        type="text"
                        label="Service description"
                        variant="standard"
                        fullWidth
                        error={touched.description === true && errors.description !== undefined}
                        helperText={touched.description === true && errors.description && errors.description}
                        {...field}
                      />
                    </MDBox>
                  )
                }
                }
              </Field>
              <Field name="price">
                {({field}) => {
                  return (
                    <MDBox mb={2}>
                      <NumericFormat
                        customInput={MDInput}
                        type="text"
                        label="Service price"
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
              <MDBox mx={'auto'} justifyContent={'center'} mt={'auto'}>
                <MDButton sx={{minWidth: 150}} size={'large'} loading={loading} disabled={loading || !isValid}
                          variant="gradient" color="secondary" type='submit'>
                  Save Service
                </MDButton>
              </MDBox>
            </Form>
          )}
        </Formik>
      </ModalItem>
    </DashboardLayout>
  )
}

export default Services
