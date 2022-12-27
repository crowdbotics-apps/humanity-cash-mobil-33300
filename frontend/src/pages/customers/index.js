import DashboardLayout from "../../components/LayoutContainers/DashboardLayout"
import React, {Fragment, useEffect, useRef, useState} from "react"
import MDButton from "../../components/MDButton"
import {APISuccessMessage, showMessage, useApi} from "../../services/helpers"
import MDBox from "../../components/MDBox";
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {Autocomplete, CircularProgress, FormLabel, Grid, Input, Tooltip} from "@mui/material";
import MDInput from "../../components/MDInput";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import styles from "./style.module.css";
import {ReactComponent as Search} from '../../assets/svg/search.svg'
import Pagination from "../../components/Pagination/Pagination";
import ConfirmDialogModal from "../../components/ConfirmDialogModal";
import ModalItem from "../../components/ModalItem";
import InputMask from "react-input-mask";
import MuiSwitch from "@mui/material/Switch";
import {ReactComponent as TrashIcon} from '../../assets/svg/trash.svg'
import {ReactComponent as PencilIcon} from '../../assets/svg/pencil.svg'
import {ReactComponent as FiltroIcon} from '../../assets/svg/FunnelSimple.svg'
import CheckboxInput from '../../components/InputRadioCheckbox';


const Customers = () => {
  const api = useApi()
  const [selectedElement, setSelectedElement] = useState(null)
  const [loading, setLoading] = useState(false)
  const [openAddEditModal, setOpenAddEditModal] = useState(false)
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const searchQueryBarRef = useRef(null);
  const searchQueryRef = useRef("");
  const lastKeyPressedRef = useRef(null);
  const [openDeleteConfirmModal, setOpenDeleteConfirmModal] = useState(false)
  const [openEditConfirmModal, setEditOpenConfirmModal] = useState(false)
  const formikRef = useRef();
  const selectedStyle = {background: 'linear-gradient(155.56deg, rgba(230, 222, 24, 0.21) -55%, rgba(67, 139, 68, 0.19) 127.5%)', width: '100%', overflow: 'hidden'}
  const [extendHeightOfRows, setExtendHeightOfRows] = useState({});
  const [normalHeight, maxHeight] = [166, 250]
  const pageSize = 5
  const [services, setServices] = useState([])
  const [SelectedServices, setSelectedServices] = useState([])
  const inputTrue = useRef('');
  const inputFalse = useRef('');


  const getServices = () => {
    if (loading) {
      return
    }
    setLoading(true)
    api.getServices('', 1, '', 100).then((result) => {
      if (result.kind === 'ok') {
        setServices(result.data.results)
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }

  const getCustomers = (searchData = "", page = 1) => {
    if (loading) {
      return
    }
    setLoading(true)
    api.getCustomersFullData(searchData, page, pageSize).then((result) => {
      if (result.kind === "ok") {
        const {count, results} = result.data
        setData(results)
        const tmp = {}
        results.forEach((item) => {
          tmp[`${item.id}`] = normalHeight
          tmp[`${item.id}_overflow`] = 'hidden'
        })
        setExtendHeightOfRows(tmp)
        setNumberOfItems(count)
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }

  const addCustomer = (data) => {
    if (loading) {
      return
    }
    data.services = data.services.map(e => e.id)
    setLoading(true)
    api.addCustomer(data).then((result) => {
      if (result.kind === "ok") {
        getCustomers(searchQueryRef.current.value, currentPage)
        cancelItemEditDelete()
        showMessage('Customer added successfully', 'success')
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

  const editCustomer = () => {
    if (loading) {
      return
    }
    setLoading(true)
    const data = {...selectedElement}
    data.services = SelectedServices.map(e => e.id)
    api.editCustomer(data.id, data).then((result) => {
      if (result.kind === "ok") {
        getCustomers(searchQueryRef.current.value, currentPage)
        cancelItemEditDelete()
        showMessage('Customer updated successfully', 'success')
      } else if (result.kind === "bad-data") {
        setEditOpenConfirmModal(false)
        formikRef.current.setErrors(result.errors)
        showMessage('Validation errors found')
      } else {
        showMessage()
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }

  const deleteCustomer = () => {
    if (loading) {
      return
    }
    setLoading(true)
    api.deleteCustomer(selectedElement.id).then((result) => {
      if (result.kind === "ok") {
        getCustomers(searchQueryRef.current.value, currentPage)
        cancelItemEditDelete()
        showMessage('Customer deleted successfully', 'success')
      } else {
        showMessage()
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }

  const validationSchema =
    Yup.object().shape({
      first_name: Yup.string().required('First name is required'),
      last_name: Yup.string().required('Last name is required'),
      email: Yup.string().required('Email is required'),
      company_name: Yup.string().nullable(),
      phone_number: Yup.string().required('Cell phone is required'),
      zip_code: Yup.string().required('Zip code is required'),
      address: Yup.string().required('Street address is required'),
      services: Yup.array().nullable(),
      other: Yup.string().nullable(),
      notifications: Yup.bool(),
      state: Yup.string().required('State is required'),
      city: Yup.string().required('City is required'),
    })

  const initialValues = {
    first_name: selectedElement ? selectedElement.first_name : "",
    last_name: selectedElement ? selectedElement.last_name : "",
    email: selectedElement ? selectedElement.email : "",
    company_name: selectedElement ? selectedElement.company_name : "",
    phone_number: selectedElement ? selectedElement.phone_number : "",
    zip_code: selectedElement ? selectedElement.zip_code : "",
    address: selectedElement ? selectedElement.address : "",
    services: selectedElement ? selectedElement.services : [],
    other: selectedElement ? selectedElement.other !== null ? selectedElement.other : "" : "",
    notifications_enabled: selectedElement ? selectedElement.notifications_enabled : true,
    state: selectedElement ? selectedElement.state : "",
    city: selectedElement ? selectedElement.city : "",
    display_company: selectedElement ? selectedElement.display_company : false,
  };


  const addEditCustomer = (data) => {
    if (selectedElement) {
      setSelectedElement({...data, id: selectedElement.id})
      setEditOpenConfirmModal(true)
    } else {
      addCustomer(data);
    }
  }

  const cancelItemEditDelete = () => {
    setEditOpenConfirmModal(false)
    setOpenDeleteConfirmModal(false)
    setOpenAddEditModal(false)
    setSelectedElement(null)
  }

  const handleChangeNotificacionsSettings = (e, v, id) => {
    if (loading) {
      return
    }
    setLoading(true)
    api.setNotificationSetting(id, v).then(res => {
      if (res.kind === 'ok') {
        APISuccessMessage(v ? "Activating Notifications" : "Deactivating Notifications")
      } else {
        showMessage()
      }
    }).catch(e => showMessage())
      .finally(() => setLoading(false))
    return v
  }

  const handleEditItem = (item) => {
    getServices()
    setOpenAddEditModal(true)
  }

  const handleDeleteItem = () => {
    setOpenDeleteConfirmModal(true)
  }

  const changeHeight = (item) => {
    const currentValue = extendHeightOfRows[`${item.id}`]
    if (currentValue === undefined || currentValue === normalHeight) {
      setExtendHeightOfRows(v => ({...v, [`${item.id}`]: maxHeight}))
    } else {
      setExtendHeightOfRows(v => ({...v, [`${item.id}`]: normalHeight}))
    }
  }

  const handleChange = (inputElem) => {
    const inputYes = document.getElementById('yes-checkbox');
    const inputNo = document.getElementById('no-checkbox');
    const spanYes = document.getElementById('yes');
    const spanNo = document.getElementById('no')
    if(inputElem.current.id === 'yes-checkbox') {
      inputNo.checked = false;
      spanYes.style.border = 'none';
      spanNo.style.background = 'white';
      spanYes.style.background = 'rgba(136, 174, 49, 0.68)';
      spanNo.style.border = '1px solid #ccc';
    }
    else if(inputElem.current.id === 'no-checkbox') {
      inputYes.checked = false
      spanNo.style.border = 'none'
      spanYes.style.background = 'white'
      spanNo.style.background = 'rgba(136, 174, 49, 0.68)';
      spanYes.style.border = '1px solid #ccc';
    }
  }

  const prepareCall = (evt) => {
    lastKeyPressedRef.current = (new Date()).getTime()
    setTimeout(() => {
      const now = (new Date()).getTime()
      if (loading || now - lastKeyPressedRef.current < 1000) {
        return
      }
      getCustomers(searchQueryRef.current.value)
    }, 1000)
  }

  useEffect(() => {
    getCustomers()
  }, [])

  const tagFrecuency = (title, color_code) => {
    return <Tooltip title={title}>
      <div style={{
        width: '15px',
        height: '15px',
        background: color_code,
        borderRadius: '20px',
      }}>
      </div>
    </Tooltip>
  }

  const editCustomerElement = (
    <Formik
      innerRef={formikRef}
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={values => {
        addEditCustomer(values);
      }}
    >
      {({errors, touched, isValid, setFieldValue, values}) => {
        return (
          <Form style={{display: 'flex', flexDirection: 'column', flex: 1}}>
            <Field name="first_name">
              {({field}) => {
                return (
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="First name *"
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
                      label="Last name *"
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
            <Field name="email">
              {({field}) => {
                return (
                  <MDBox mb={2}>
                    <MDInput
                      type="email"
                      label="Email *"
                      variant="standard"
                      fullWidth
                      error={ errors.email !== undefined}
                      helperText={ errors.email && errors.email}
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
                      label="Company name"
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
            {values.company_name !== '' && <Field name="display_company">
              {() => {
                return (
                  <MDBox display={'flex'} alignItems={'center'} mb={2}>
                    <FormLabel sx={{fontSize: 13}}>Display Company Name:</FormLabel>
                    <CheckboxInput
                      labelText='Yes'
                      inputId='yes-checkbox'
                      formikField='display_company'
                      labelStyle={{marginLeft: '4%', display: 'flex', gap: 2, fontSize: 13}}
                      checkedCondition={values['display_company']}
                      inputRef={inputTrue}
                      handleChange={handleChange}
                      setFieldValue={setFieldValue}
                      spanId='yes'
                    />

                    <CheckboxInput
                      labelText='No'
                      inputId='no-checkbox'
                      labelStyle={{marginLeft: '10%', display: 'flex', gap: 5, fontSize: 13}}
                      formikField='display_company'
                      value={false}
                      checkedCondition={!values['display_company']}
                      inputRef={inputFalse}
                      handleChange={handleChange}
                      setFieldValue={setFieldValue}
                      spanId='no'
                    />

                  </MDBox>
                )}}
            </Field>}
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
                      label="Cell phone *"
                      variant="standard"
                      fullWidth
                      error={errors.phone_number !== undefined}
                      helperText={errors.phone_number && errors.phone_number}

                    />
                    </InputMask>
                  </MDBox>
                )
              }
              }
            </Field>
            <Field name="address">
              {({field}) => {
                return (
                  <MDBox mb={2} mr={1}>
                    <MDInput
                      type="text"
                      label="Street addres *"
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
            <Field name="city">
              {({field}) => {
                return (
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="City"
                      variant="standard"
                      fullWidth
                      error={touched.city === true && errors.city !== undefined}
                      helperText={touched.city === true && errors.city && errors.city}
                      {...field}
                    />
                  </MDBox>
                )
              }
              }
            </Field>
            <Field name="state">
              {({field}) => {
                return (
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="State"
                      variant="standard"
                      fullWidth
                      error={touched.state === true && errors.state !== undefined}
                      helperText={touched.state === true && errors.state && errors.state}
                      {...field}
                    />
                  </MDBox>
                )
              }
              }
            </Field>
              <Field name="zip_code">
                {({field}) => {
                  return (
                    <MDBox mb={2}>
                      <MDInput
                        fullWidth
                        type="text"
                        label="Zip Code *"
                        variant="standard"
                        error={touched.zip_code === true && errors.zip_code !== undefined}
                        helperText={touched.zip_code === true && errors.zip_code && errors.zip_code}
                        {...field}
                      />
                    </MDBox>
                  )
                }
                }
              </Field>
            <Field name="services">
              {({field}) => {
                return (
                  <MDBox mb={2}>
                    <Autocomplete
                      multiple
                      filterSelectedOptions
                      options={services}
                      defaultValue={initialValues.services}
                      getOptionLabel={option => `${option?.id} - ${option?.description}`}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      onChange={(event, value) => {
                        setSelectedServices(value)
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
            <Field name="other">
              {({field}) => {
                return (
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="Other"
                      variant="standard"
                      fullWidth
                      error={touched.other === true && errors.other !== undefined}
                      helperText={touched.other === true && errors.other && errors.other}
                      {...field}
                    />
                  </MDBox>
                )
              }
              }
            </Field>
            <MDBox sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: 'space-between'}}
                   mb={2}>
              <span style={{fontSize: '0.8em'}}>Notifications</span>
              <Field name="notifications_enabled">
                {({field}) => {
                  return (
                    <MDBox>
                      <MuiSwitch
                        name={field.name}
                        value={true}
                        checked={field.value === true}
                        onChange={field.onChange}
                        color="primary"
                      />

                    </MDBox>
                  )
                }
                }
              </Field>
            </MDBox>
            <MDBox mx={'auto'} justifyContent={'center'} mt={'auto'}>
              <MDButton sx={{minWidth: 150}} size={'large'} loading={loading} disabled={loading || !isValid}
                        variant="gradient" color="secondary" type='submit'>
                Save Customer
              </MDButton>
            </MDBox>
          </Form>
        )
      }}
    </Formik>
  )

  const renderRow = (item) => {
    const currentRowStyle = selectedElement?.id === item.id ? selectedStyle : {}
    extendHeightOfRows[`${item.id}_overflow`] = selectedElement?.id === item.id ? 'auto' : 'hidden'
    return (
      <TableRow key={item.id} onClick={() => setSelectedElement(item)}
                style={currentRowStyle}>
        {/* N */}
        <TableCell className={styles.rowItem}>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            maxHeight: `${extendHeightOfRows[item.id]}px`
          }}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <span
                style={
                  {
                    fontFamily: 'Montserrat',
                    fontStyle: 'normal',
                    fontWeight: '500',
                    fontSize: '14px',
                    lineHeight: '17px',
                    color: 'black'
                  }
                }
              >
                {item.id}.
              </span>
            </div>
          </div>
        </TableCell>
        {/* Client Information */}
        <TableCell className={styles.rowItem} align="left">
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            overflowY: 'hidden',
            maxHeight: `${extendHeightOfRows[item.id]}px`
          }}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              {[
                {title: 'Full name', value: item.name},
                {title: 'Email', value: item.email === '' ? 'Not specified' : item.email},
                {title: 'Company Name', value: item.company_name},
                {title: 'Phone number', value: item.phone_number},
                {title: 'Zip Code', value: item.zip_code},
                {title: 'Address', value: item.address}
              ].map((e, i) =>
                [
                  (
                    <Fragment key={e.title}>
                      <span
                        style={
                          {
                            fontFamily: 'Montserrat',
                            fontStyle: 'normal',
                            fontWeight: '500',
                            fontSize: '10px',
                            lineHeight: '12px',
                            color: 'black',
                            opacity: '0.4'
                          }
                        }
                      >
                        {e.title}
                      </span>

                      <span
                        style={
                          {
                            paddingBottom: '12px',
                            fontFamily: 'Montserrat',
                            fontStyle: 'normal',
                            fontWeight: '500',
                            fontSize: '12px',
                            lineHeight: '15px',
                            color: 'black'
                          }
                        }
                      >
                        {e.value}
                      </span>
                    </Fragment>
                  )
                ]
              )}
            </div>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <div>
                {selectedElement?.id === item.id ?
                  <div style={{display: 'flex', flexDirection: 'row', columnGap: '10px', alignItems: 'end'}}>
                    <TrashIcon onClick={handleDeleteItem}/>
                    <PencilIcon onClick={() => handleEditItem(item)}/>
                  </div>
                  : null
                }
              </div>
            </div>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
            <span
              style={
                {
                  fontFamily: 'Montserrat',
                  fontStyle: 'normal',
                  fontWeight: '400',
                  fontSize: '36px',
                  lineHeight: '44px',
                  color: 'black',
                  opacity: '0.5',
                  textAlign: 'right',
                  marginTop: '15px'
                }
              }
              onClick={() => changeHeight(item)}
            >
              ...
            </span>
          </div>
        </TableCell>
        {/* Service History */}
        <TableCell className={styles.rowItem} align="left">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            overflowY: extendHeightOfRows[`${item.id}_overflow`],
            maxHeight: `${extendHeightOfRows[item.id]}px`
          }}>
            {item.service_history.map((e, i) => (
              <div key={e.id} style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <span>{`${e.appointment_date} - ${e.service?.description}`}</span>
                  <span>{`($${e.price})`}</span>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                  {tagFrecuency(e.frequency.title, e.frequency.color_code)}
                </div>
              </div>))}
          </div>
        </TableCell>
        {/* Preferred services */}
        <TableCell className={styles.rowItem} align="left">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            overflowY: extendHeightOfRows[`${item.id}_overflow`],
            maxHeight: `${extendHeightOfRows[item.id]}px`
          }}>
            {item.preferred_services.map((e, i) => (
              <div key={`${i}-${e}}`}
                   style={{display: 'flex', flexDirection: 'column'}}>
                <span>{`- ${e}`}</span>
              </div>))}
          </div>
        </TableCell>
        {/* Notes */}
        <TableCell className={styles.rowItem}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            overflowY: extendHeightOfRows[`${item.id}_overflow`],
            maxHeight: `${extendHeightOfRows[item.id]}px`
          }}>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: "center", justifyContent: 'space-between'}}>
            <span style={{
              fontFamily: 'Montserrat',
              fontStyle: 'normal',
              fontWeight: '500',
              fontSize: '12px',
              lineHeight: '15px',
              color: 'black'
            }}>
              Notifications
            </span>
              <MuiSwitch defaultChecked={item.notifications_enabled}
                         onChange={(e, v) => handleChangeNotificacionsSettings(e, v, item.id)}/>
            </div>
            {item.notes.length === 0 ?
              <span style={{
                fontFamily: 'Montserrat',
                fontStyle: 'normal',
                fontWeight: '500',
                fontSize: '10px',
                lineHeight: '12px',
                color: 'black',
                opacity: '0.4'
              }}>No notes</span> :
              item.notes.map((note, idx) =>
                (
                  <div key={`${note}-${idx}`} style={{display: 'flex', flexDirection: 'column'}}>
                  <span style={{
                    fontFamily: 'Montserrat',
                    fontStyle: 'normal',
                    fontWeight: '500',
                    fontSize: '10px',
                    lineHeight: '12px',
                    color: 'black',
                    opacity: '0.4'
                  }}>
                    {note.title}
                  </span>
                    <span style={{
                      fontFamily: 'Montserrat',
                      fontStyle: 'normal',
                      fontWeight: '500',
                      fontSize: '12px',
                      lineHeight: '15px',
                      color: 'black'
                    }}>
                    {note?.description}
                  </span>
                  </div>
                )
              )
            }
          </div>
        </TableCell>
      </TableRow>
    )
  }

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
              placeholder="Search Customer"
              type="text"
              onInputCapture={prepareCall}
            />
          </MDBox>
        </Grid>
        <Grid item xs={1} display="flex" alignItems="center" justifyContent="center">
          {loading ? <CircularProgress size={24} color="primary"/> : <FiltroIcon/>}
        </Grid>
        <Grid item xs={3} justifyContent={'flex-end'} display={'flex'}>
          <MDButton ml={'auto'} disabled={loading} variant="gradient" color="primary" onClick={() => {
            cancelItemEditDelete()
            getServices()
            setOpenAddEditModal(true)
          }}>
            Add Customer
          </MDButton>
        </Grid>
      </Grid>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className={styles.thead} style={{width: '3%'}}>N</TableCell>
            <TableCell className={styles.thead} align="left" style={{width: '15%'}}>Client Information</TableCell>
            <TableCell className={styles.thead} align="left" style={{width: '15%'}}>Service History</TableCell>
            <TableCell className={styles.thead} align="left" style={{width: '15%'}}>Preferred services</TableCell>
            <TableCell className={styles.thead} style={{width: '15%'}}>Notes</TableCell>
          </TableRow>
          {data.map((item) => renderRow(item))}
          {(!loading && data.length === 0) && (
            <TableRow>
              <TableCell colSpan={5} align={'center'}>
                No items found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalCount={numberOfItems}
        pageSize={pageSize}
        onPageChange={page => {
          getCustomers('', page)
          setCurrentPage(page)
        }}
      />
      <ConfirmDialogModal
        title={'Do you want to delete this customer?'}
        description={`${selectedElement?.id} - ${selectedElement?.name}`}
        cancelText={'Cancel'}
        confirmText={'Confirm'}
        open={openDeleteConfirmModal}
        handleClose={cancelItemEditDelete}
        handleConfirm={deleteCustomer}
      />
      <ConfirmDialogModal
        title={'Do you want to update this customer?'}
        description={`${selectedElement?.id} - ${selectedElement?.first_name} ${selectedElement?.last_name}`}
        cancelText={'Cancel'}
        confirmText={'Confirm'}
        open={openEditConfirmModal}
        handleClose={() => setEditOpenConfirmModal(false)}
        handleConfirm={editCustomer}
      />
      <ModalItem
        width={500}
        open={openAddEditModal}
        title={selectedElement ? 'Edit Customer' : 'Add Customer'}
        handleClose={cancelItemEditDelete}
      >
        {editCustomerElement}
      </ModalItem>
    </DashboardLayout>
  )
}

export default Customers
