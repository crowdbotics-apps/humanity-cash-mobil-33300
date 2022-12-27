import DashboardLayout from "../../components/LayoutContainers/DashboardLayout"
import React, {useEffect, useRef, useState} from "react"
import MDButton from "../../components/MDButton"
import {showMessage, useApi} from "../../services/helpers"
import MDBox from "../../components/MDBox";
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {CircularProgress, FormLabel, Grid, Input,} from "@mui/material";
import MDInput from "../../components/MDInput";
import {ReactComponent as Search} from '../../assets/svg/search.svg'
import Pagination from "../../components/Pagination/Pagination";
import CheckboxInput from '../../components/InputRadioCheckbox';
import ConfirmDialogModal from "../../components/ConfirmDialogModal";
import ModalItem from "../../components/ModalItem";
import InputMask from "react-input-mask";
import Autocomplete from "@mui/material/Autocomplete";
import DataTable from "../../components/DataTable";
import {ReactComponent as FiltroIcon} from '../../assets/svg/FunnelSimple.svg'
import './style.css'


const pencilIcon = require("../../assets/icons/pencil_btn.png")
const trashIcon = require("../../assets/icons/delete_btn.png")

const dataTableModel = {
  columns: [
    {Header: "N", accessor: "id", width: '2%'},
    {Header: "Employee Name", accessor: "name", width: '13%'},
    {Header: "Address", accessor: "address", width: '20%'},
    {Header: "Company", accessor: "company_name", width: '10%'},
    {Header: "Phone number", accessor: "phone_number", width: '10%'},
    {Header: "Team", accessor: "assigned_team", width: '12%'},
    {Header: "Actions", accessor: "actions", width: '7%', disableOrdering: true}
  ],
  rows: [],
};

const renderTableRow = (item, selectItemEdit, selectItemDelete) => {
  item.assigned_team_bkp = item.assigned_team
  item.assigned_team = item.assigned_team?.title
  item.actions = (<>
    <img
      alt="..."
      onClick={() => selectItemEdit(item)} style={{cursor: 'pointer'}}
      src={pencilIcon}
    />
    <img
      alt="..."
      onClick={() => selectItemDelete(item)} style={{cursor: 'pointer', marginLeft: 5}}
      src={trashIcon}
    />
  </>)
  return item
}

const Employees = () => {
  const api = useApi();
  const [selectedElement, setSelectedElement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openEditConfirmModal, setEditOpenConfirmModal] = useState(false);
  const [Teams, setTeams] = useState([]);
  const [SelectedTeam, setSelectedTeam] = useState(null);
  const formikRef = useRef();
  const [recordList, setRecordList] = useState({...dataTableModel});
  const inputTrue = useRef('');
  const inputFalse = useRef('');
  const searchQueryRef = useRef("");
  const lastKeyPressedRef = useRef(null);

  const getEmployees = (searchData, page = 1, ordering = "") => {
    setLoading(true)
    api.getEmployees(searchData, page, ordering).then((result) => {
      if (result.kind === "ok") {
        const {count, results} = result.data
        setNumberOfItems(count)
        const tmp = {...dataTableModel}
        tmp.rows = results.map(e => renderTableRow(e, selectItemEdit, selectItemDelete))
        setRecordList(tmp)
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }

  const getTeams = ()=>{
    api.getTeams("", 1, "", 10000, {all_teams: true}).then(response => {
      if (response.kind === "ok") {
        setTeams(response.data.results)
      }
    }).catch(error => console.log(error))
  }

  const addEmployee = (data) => {
    setLoading(true)
    api.addEmployee(data).then((result) => {
      if (result.kind === "ok") {
        getEmployees(searchQuery, currentPage)
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

  const editEmployee = () => {
    setLoading(true)
    api.editEmployee(selectedElement).then((result) => {
      if (result.kind === "ok") {
        getEmployees(searchQuery, currentPage)
        cancelItemDelete()
        showMessage('Service updated successfully', 'success')
      } else if (result.kind === "bad-data") {
        formikRef.current.setErrors(result.errors);
        showMessage('Validation errors found');
        setEditOpenConfirmModal(false);
      } else {
        showMessage()
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }

  const deleteEmployee = () => {
    setLoading(true)
    api.deleteEmployee(selectedElement.id).then((result) => {
      if (result.kind === "ok") {
        getEmployees(searchQuery, currentPage)
        cancelItemDelete()
        showMessage('Employee deleted successfully', 'success')
      } else {
        showMessage()
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }

  const onColumnOrdering = (ordering) => {
    const {column, order} = ordering
    if (column === '') {
      getEmployees(searchQuery)
    } else if (order === 'asce') {
      getEmployees(searchQuery, 1, `${column}`)
    } else {
      getEmployees(searchQuery, 1, `-${column}`)
    }
  }

  const validationSchema =
    Yup.object().shape({
      first_name: Yup.string().required('First name is required'),
      last_name: Yup.string().required('Last name is required'),
      phone_number: Yup.string().required('Cell phone is required'),
      email: Yup.string().required('Email is required'),
      company_name: Yup.string().nullable(),
      address: Yup.string().nullable(),
      assigned_team: Yup.string(),
      state: Yup.string().nullable(),
      city: Yup.string().nullable(),
      zip_code: Yup.string().nullable(),
    })

  const initialValues = {
    first_name: selectedElement ? selectedElement.first_name : "",
    last_name: selectedElement ? selectedElement.last_name : "",
    company_name: selectedElement ? selectedElement.company_name : "",
    address: selectedElement ? selectedElement.address : "",
    phone_number: selectedElement ? selectedElement.phone_number : "",
    email: selectedElement ? selectedElement.email : "",
    display_company: selectedElement ? selectedElement.display_company : false,
    assigned_team: selectedElement && selectedElement.assigned_team ? selectedElement.assigned_team.id : "",
    state: selectedElement ? selectedElement.state : "",
    city: selectedElement ? selectedElement.city : "",
    zip_code: selectedElement ? selectedElement.zip_code : ""
  };

  const addEditEmployee = (data) => {
    if (selectedElement) {
      setSelectedElement({...data, id: selectedElement.id})
      setEditOpenConfirmModal(true)
    } else {
      addEmployee(data);
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
    setSelectedTeam(null)
  }

  const selectItemEdit = (item) => {
    setSelectedElement(item)
    if (item.assigned_team_bkp) {
      setSelectedTeam(item.assigned_team_bkp)
    }
    setOpen(true)
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

  const prepareCall = () => {
    lastKeyPressedRef.current = (new Date()).getTime()
    setTimeout(() => {
      const now = (new Date()).getTime()
      if (loading || now - lastKeyPressedRef.current < 1000) {
        return
      }
      getEmployees(searchQueryRef.current.value)
    }, 1000)
  }

  useEffect(() => {
    getEmployees(searchQuery)
  }, [])

  useEffect(() => {
    getTeams()
  }, [])

  return (
    <DashboardLayout showCard loginRequired>
      <Grid container>
        <Grid item xs={8}>
          <MDBox sx={{backgroundColor: '#EBEBEB', borderRadius: 20, position: 'relative'}} px={5}>
            <Search style={{position: 'absolute', bottom: 7, left: 10}}/>
            <Input
              inputRef={searchQueryRef}
              fullWidth
              placeholder="Search Employee"
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
            Add Employee
          </MDButton>
        </Grid>
      </Grid>

      {recordList.rows.length > 0
        ? <DataTable table={recordList} onColumnOrdering={onColumnOrdering}/>
        : <p style={{display: 'flex', height: '60vh', justifyContent: 'center', alignItems: 'center', fontSize: 20}}>No employees found</p>
      }

      <Pagination
        currentPage={currentPage}
        totalCount={numberOfItems}
        pageSize={8}
        onPageChange={page => {
          getEmployees('', page)
          setCurrentPage(page)
        }}
      />
      <ConfirmDialogModal
        title={'Do you want to delete this employee?'}
        description={`${selectedElement?.id} - ${selectedElement?.name}`}
        cancelText={'Cancel'}
        confirmText={'Confirm'}
        open={openConfirmModal}
        handleClose={() => cancelItemDelete()}
        handleConfirm={() => deleteEmployee()}
      />
      <ConfirmDialogModal
        title={'Do you want to update this employee?'}
        description={`${selectedElement?.id} - ${selectedElement?.first_name} ${selectedElement?.last_name}`}
        cancelText={'Cancel'}
        confirmText={'Confirm'}
        open={openEditConfirmModal}
        handleClose={() => setEditOpenConfirmModal(false)}
        handleConfirm={() => editEmployee()}
      />
      <ModalItem
        open={open}
        title={selectedElement ? 'Edit Employee' : 'Add Employee'}
        handleClose={() => cancelItemDelete()}
        scrollable={false}
      >
        <Formik
          innerRef={formikRef}
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={values => {
            addEditEmployee(values)
          }}
        >
          {({errors, touched, isValid, setFieldValue, values}) => (
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
                        error={errors.email !== undefined}
                        helperText={errors.email && errors.email}
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
              <Field name="address">
                {({field}) => {
                  return (
                    <MDBox mb={2}>
                      <MDInput
                        type="text"
                        label="Street address"
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
                        label="Zip Code"
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
              <Field name="phone_number">
                {({field}) => {
                  touched.phone_number = true
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
                        error={touched.phone_number === true && errors.phone_number !== undefined}
                        helperText={(touched.phone_number === true && errors.phone_number) && errors.phone_number}

                      />
                      </InputMask>
                    </MDBox>
                  )
                }
                }
              </Field>
              <Field name="assigned_team">
                {({field}) => {
                  return (
                    <MDBox mb={2}>
                      <Autocomplete
                        disablePortal
                        options={Teams}
                        value={SelectedTeam}
                        onChange={(event, value) => {
                          setSelectedTeam(value)
                          setFieldValue('assigned_team', value.id)
                        }}
                        isOptionEqualToValue={(option, value) => [option.id === value.id]}
                        disableClearable
                        getOptionLabel={(option) => option.title}
                        renderInput={(params) => (
                          <MDInput
                            type="text"
                            label="Team"
                            variant="standard"
                            fullWidth
                            error={touched.assigned_team === true && errors.assigned_team !== undefined}
                            helperText={touched.assigned_team === true && errors.assigned_team && errors.assigned_team}
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
              <MDBox mx={'auto'} justifyContent={'center'} mt={'auto'}>
                <MDButton sx={{minWidth: 150}} size={'large'} loading={loading} disabled={loading || !isValid} variant="gradient" color="secondary" type='submit'>
                  Save Employee
                </MDButton>
              </MDBox>
            </Form>
          )}
        </Formik>
      </ModalItem>
    </DashboardLayout>
  )
}

export default Employees
