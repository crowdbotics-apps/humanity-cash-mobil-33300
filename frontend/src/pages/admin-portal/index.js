import DashboardLayout from "../../components/LayoutContainers/DashboardLayout"
import {useEffect, useRef, useState} from "react"
import {showMessage, useApi} from "../../services/helpers"
import {dataTableModel, renderTableRow} from "./utils";
import DataTable from "../../components/DataTable";
import {Link, useNavigate} from "react-router-dom";
import {ROUTES} from "../../services/constants";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import MDBox from "../../components/MDBox";
import ConfirmDialogInputModal from "../../components/ConfirmDialogInputModal";
import MDInput from "../../components/MDInput";
import * as Yup from "yup";
import {Field, Form, Formik} from "formik";
import {AutocompleteFormik} from "../../components/AutocompleteFormik";


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

const AdminPortal = () => {
  const api = useApi()
  const navigate = useNavigate()
  const formRef = useRef();
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [numberOfItemsPage, setNumberOfItemsPage] = useState(0);
  const [recordList, setRecordList] = useState({...dataTableModel})
  const searchQueryRef = useRef("");
  const [showUserFormModal, setShowUserFormModal] = useState(false)
  const [roles, setRoles] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)


  const getAdminUsers = (searchData, page = 1, ordering = "") => {
    setLoading(true)
    api.getAdminUsers(searchData, page, ordering, 8).then((result) => {
      if (result.kind === "ok") {
        const {count, results} = result.data
        const tmp = {...dataTableModel}
        tmp.rows = results.map(e => renderTableRow(e, setDetailToShow))
        setRecordList(tmp)
        setNumberOfItems(count)
        setNumberOfItemsPage(results.length)
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

  const setDetailToShow = (item) => {
    console.log('items')
  }

  const clearDetail = () => {
    setShowUserFormModal(false)
    // setSelectedItem(null)
    // setUserPassword('')
  }

  const confirmAction = () => {
    if (formRef.current) {
      formRef.current.handleSubmit()
    }
  }

  const validationSchema =
    Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      group: Yup.string().required(),
      role: Yup.string().required(),
    })

  const initialValues = {
    name: "",
    email: "",
    role: "",
    group: "",
  };

  useEffect(() => {
    if (selectedGroup) {
      if(selectedGroup.id === 'BANK') {
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
    >
      <MDBox display={'flex'} flex={1} alignItems={'center'} mt={5}>
        <MDTypography  color={'primary'} sx={{fontWeight: 400}} fontSize={24} >
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
      <ConfirmDialogInputModal
        title={'Add user'}
        description={'Admin user create form'}
        open={showUserFormModal}
        handleClose={() => clearDetail()}
        handleConfirm={() => confirmAction()}
      >
        <Formik
          innerRef={formRef}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={values => {
            console.log('values ', values)
          }}
        >
          {({errors, touched, setFieldValue}) => (
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
                        setFieldValue={(field, value) => setFieldValue(field, value.id)}
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
                        setFieldValue={(field, value) => setFieldValue(field, value.id)}
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
      {recordList?.rows.length > 0
        ? (<DataTable
          table={recordList}
          onColumnOrdering={onColumnOrdering}
          currentPage={currentPage}
          numberOfItems={numberOfItems}
          numberOfItemsPage={numberOfItemsPage}
          pageSize={8}
          onPageChange={page => {
            getAdminUsers('', page)
            setCurrentPage(page)
          }}
        />)
        : <p style={{display: 'flex', height: '55vh', justifyContent: 'center', alignItems: 'center', fontSize: 20}}>No
          users found</p>
      }
    </DashboardLayout>
  )
}

export default AdminPortal
