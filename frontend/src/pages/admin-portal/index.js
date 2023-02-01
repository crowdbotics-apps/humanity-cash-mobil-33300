import DashboardLayout from "../../components/LayoutContainers/DashboardLayout"
import {useEffect, useRef, useState} from "react"
import {showMessage, useApi} from "../../services/helpers"
import {dataTableModel, renderTableRow} from "./utils";
import DataTable from "../../components/DataTable";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import MDBox from "../../components/MDBox";
import ConfirmDialogInputModal from "../../components/ConfirmDialogInputModal";
import MDInput from "../../components/MDInput";
import * as Yup from "yup";
import {Field, Form, Formik} from "formik";
import {AutocompleteFormik} from "../../components/AutocompleteFormik";
import ConfirmDialogModal from "../../components/ConfirmDialogModal";
import MDFilterButtonPopover from './filter'
import Icon from "@mui/material/Icon";

const groups = [
  {id: 'BANK', title: 'Bank'},
  {id: 'MANAGER', title: 'Program manager'},
]

const rolesBank = [
  {id: 'EMPLOYEE', title: 'Employee'},
  {id: 'SUPERVISOR', title: 'Supervisor'},
]

const rolesManager = [
  {id: 'ADMIN', title: 'Admin'},
  {id: 'SUPERADMIN', title: 'Super admin'},
]

const allRoles = rolesBank.concat(rolesManager)


const AdminPortal = () => {
  const api = useApi()
  const formikRef = useRef();
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [numberOfItemsPage, setNumberOfItemsPage] = useState(0);
  const [recordList, setRecordList] = useState({...dataTableModel})
  const searchQueryRef = useRef("");
  const [showUserFormModal, setShowUserFormModal] = useState(false)
  const [showUserDeleteModal, setShowUserDeleteModal] = useState(false)
  const [showUserSendEmailModal, setShowSendEmailModal] = useState(false)
  const [roles, setRoles] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [Checked, setChecked] = useState('')

  const getAdminUsers = (searchData, page = 1, ordering = "") => {
    setLoading(true)
    api.getAdminUsers(searchData, page, ordering, 8).then((result) => {
      if (result.kind === "ok") {
        const {count, results} = result.data
        const tmp = {...dataTableModel}
        tmp.rows = results.map(e => renderTableRow(e, setDetailToShow, setEmailData, setEditShow))
        setRecordList(tmp)
        setNumberOfItems(count)
        setNumberOfItemsPage(results.length)
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }

  const createAdminUserReq = (data) => {
    setLoading(true)
    api.createAdminUser(data).then((result) => {
      if (result.kind === 'ok') {
        clearDetail()
        getAdminUsers("")
        showMessage('Admin user added successfully', 'success')
      } else if (result.kind === 'bad-data') {
        formikRef.current.setErrors(result.errors)
        showMessage('Validation errors found')
      } else {
        showMessage()
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }

  const editAdminUser = (data) => {
    setLoading(true)
    api.editadminUser(data).then((result) => {
      if (result.kind === 'ok') {
        clearDetail()
        getAdminUsers("")
        showMessage('Admin user updated successfully', 'success')
      } else if (result.kind === 'bad-data') {
        formikRef.current.setErrors(result.errors)
        showMessage('Validation errors found')
      } else {
        showMessage()
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }

  const deleteAdminUser = () => {
    setLoading(true)
    api.deleteAdminUser(selectedItem.id).then((result) => {
      if (result.kind === 'ok') {
        clearDetail()
        getAdminUsers("")
        showMessage('Admin user deleted successfully', 'success')
      } else {
        showMessage()
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }

  const reSendAdminUserEmail = () => {
    setLoading(true)
    api.reSendAdminUserEmail(selectedItem.id).then((result) => {
      if (result.kind === 'ok') {
        clearDetail()
        showMessage('Admin user password email sent successfully', 'success')
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
      getAdminUsers(searchQueryRef?.current)
    } else if (order === 'asce') {
      getAdminUsers(searchQueryRef?.current, 1, `${column}`)
    } else {
      getAdminUsers(searchQueryRef?.current, 1, `-${column}`)
    }
  }

  const setEditShow = (item) => {
    const group = groups.find(it => it.id === item.group_raw)
    const role = allRoles.find(it => it.id === item.role_raw)
    const user = {...item, group, role}
    setSelectedItem(user)
    setShowUserFormModal(true)
    if (item.group_raw === 'BANK') {
      setRoles(rolesBank)
    } else {
      setRoles(rolesManager)
    }
  }

  const setDetailToShow = (item) => {
    setSelectedItem(item)
    setShowUserDeleteModal(true)
  }

  const setEmailData = (item) => {
    setSelectedItem(item)
    setShowSendEmailModal(true)
  }

  const clearDetail = () => {
    setShowUserFormModal(false)
    setShowSendEmailModal(false)
    setShowUserDeleteModal(false)
    setSelectedItem(null)
    setRoles([])
  }

  const confirmAction = () => {
    if (formikRef.current) {
      formikRef.current.handleSubmit()
    }
  }

  const validationSchema =
    Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      group: Yup.object().required(),
      role: Yup.object().required(),
    })

  const initialValues = {
    name: selectedItem ? selectedItem.name_raw : "",
    email: selectedItem ? selectedItem.email : "",
    role: selectedItem ? selectedItem.role : "",
    group: selectedItem ? selectedItem.group : "",
  };

  const filterOptions = [
    {
      label: 'Manager',
      accessor: 'manager',
      value: Checked === 'manager',
      action: () => setChecked('manager')
    },
    {
      label: 'Bank',
      accessor: 'bank',
      value: Checked === 'bank',
      action: () => setChecked('bank')
    },
    {
      label: 'Employee',
      accessor: 'employee',
      value: Checked === 'employee',
      action: () => setChecked('employee')
    },
    {
      label: 'Supervisor',
      accessor: 'supervisor',
      value: Checked === 'supervisor',
      action: () => setChecked('supervisor')
    },
  ]

  const buttonActions = {
    clear: () => {
      setChecked(false)
      getAdminUsers("")
    },
    cancel: () => {
    },
    apply: () => getAdminUsers(Checked),
  }

  useEffect(() => {
    if (selectedGroup) {
      if (selectedGroup.id === 'BANK') {
        setRoles(rolesBank)
      } else {
        setRoles(rolesManager)
      }
    }

  }, [selectedGroup])

  useEffect(() => {
    getAdminUsers("")
  }, [])

  return (
    <DashboardLayout
      loginRequired
      title={'Admin Employees / Sub - Admins'}
      loading={loading}
      searchFunc={getAdminUsers}
      filterContent={
        <MDFilterButtonPopover filterOptions={filterOptions} buttonActions={buttonActions} variant="standard"
                               color="dark" iconOnly sx={{marginLeft: 2, backgroundColor: '#EBEBEB'}}>
          <Icon sx={{fontWeight: "bold"}}>tune</Icon>
        </MDFilterButtonPopover>
      }
    >
      <MDBox display={'flex'} flex={1} alignItems={'center'} mt={5}>
        <MDTypography color={'primary'} sx={{fontWeight: 400}} fontSize={24}>
          Admin Portal Access Management
        </MDTypography>
        <MDBox ml={'auto'}>
          <MDButton
            onClick={() => setShowUserFormModal(true)}
            color={"primary"}
            variant={"contained"}
            sx={{width: 200}}
          >
            Add User
          </MDButton>
        </MDBox>
      </MDBox>
      <ConfirmDialogModal
        title={'Delete user'}
        description={`Do you want to delete this user?`}
        open={showUserDeleteModal}
        handleClose={() => clearDetail()}
        handleConfirm={() => deleteAdminUser()}
        cancelText={'Cancel'}
        confirmText={'Delete'}
      />
      <ConfirmDialogModal
        title={'Send password set email'}
        description={`Do you want to resend the email to set user password?`}
        open={showUserSendEmailModal}
        handleClose={() => clearDetail()}
        handleConfirm={() => reSendAdminUserEmail()}
        cancelText={'Cancel'}
        confirmText={'Confirm'}
      />
      <ConfirmDialogInputModal
        title={selectedItem ? 'Edit user' : 'Add user'}
        description={selectedItem ? 'Admin user edit form' : 'Admin user create form'}
        open={showUserFormModal}
        handleClose={() => clearDetail()}
        handleConfirm={() => confirmAction()}
      >
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={values => {
            let valuesFormated = {...values}
            if (valuesFormated?.group?.id) valuesFormated.group = valuesFormated.group.id
            if (valuesFormated?.role?.id) valuesFormated.role = valuesFormated.role.id
            if (selectedItem) {
              const data = {...valuesFormated, id: selectedItem.id}
              editAdminUser(data)
            } else {
              createAdminUserReq(valuesFormated)
            }

          }}
        >
          {({errors, touched, setFieldValue, values}) => (
            <Form style={{display: 'flex', flexDirection: 'column', flex: 1}}>
              <Field name="name">
                {({field}) => {
                  return (
                    <MDBox mb={2}>
                      <MDInput
                        type="text"
                        label="USER FULL NAME"
                        variant="outlined"
                        placeholder="john Doe"
                        fullWidth
                        error={errors.name !== undefined}
                        helperText={errors.name && errors.name}
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
                        type="text"
                        label="USER EMAIL"
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
              <MDBox display={'flex'} flex={1} mb={2}>
                <MDBox sx={{width: "50%"}} mr={1}>
                  <Field name="group">
                    {({field}) => (
                      <AutocompleteFormik
                        options={groups}
                        labelFieldName={"title"}
                        field={field}
                        setFieldValue={(field, value) => {
                          setFieldValue(field, value)
                        }}
                        initialValue={initialValues.group}
                        touched={touched}
                        errors={errors}
                        label={"GROUP"}
                        onChange={(e, val) => setSelectedGroup(val)}
                      />
                    )}
                  </Field>
                </MDBox>
                <MDBox sx={{width: "50%"}} ml={1}>
                  <Field name="role">
                    {({field}) => (
                      <AutocompleteFormik
                        options={roles}
                        labelFieldName={"title"}
                        field={field}
                        disabled={values.group === ''}
                        setFieldValue={(field, value) => setFieldValue(field, value)}
                        initialValue={initialValues.role}
                        touched={touched}
                        errors={errors}
                        label={"ROLE"}
                      />
                    )}
                  </Field>
                </MDBox>
              </MDBox>
            </Form>
          )}
        </Formik>
      </ConfirmDialogInputModal>
      <DataTable
        table={recordList}
        emptyLabelText={'No users found'}
        loading={loading}
        onColumnOrdering={onColumnOrdering}
        currentPage={currentPage}
        numberOfItems={numberOfItems}
        numberOfItemsPage={numberOfItemsPage}
        onPageChange={page => {
          getAdminUsers('', page)
          setCurrentPage(page)
        }}
      />
    </DashboardLayout>
  )
}

export default AdminPortal
