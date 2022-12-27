import DashboardLayout from "../../components/LayoutContainers/DashboardLayout"
import React, {useEffect, useRef, useState} from "react"
import MDButton from "../../components/MDButton"
import {showMessage, useApi} from "../../services/helpers"
import MDBox from "../../components/MDBox";
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {CircularProgress, FormLabel, Grid, Input} from "@mui/material";
import MDInput from "../../components/MDInput";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import styles from "./style.module.css";
import Pagination from "../../components/Pagination/Pagination";
import ConfirmDialogModal from "../../components/ConfirmDialogModal";
import ModalItem from "../../components/ModalItem";
import DataTable from "../../components/DataTable";
import {ReactComponent as Search} from "../../assets/svg/search.svg";
import MDAvatar from "../../components/MDAvatar";
import logoround from "../../assets/images/logo-round.png";
import MDTypography from "../../components/MDTypography";
import CustomInputCheckbox from '../../components/InputRadioCheckbox';
import {ReactComponent as FiltroIcon} from '../../assets/svg/FunnelSimple.svg'

const pencilIcon = require("../../assets/icons/pencil_btn.png")
const trashIcon = require("../../assets/icons/delete_btn.png")

const dataTableModel = {
  columns: [
    {Header: "", accessor: "id", width: '4%'},
    {Header: "Team Name", accessor: "title", width: '19%'},
    {Header: "Team Members", accessor: "team_members", width: '67%'},
    {Header: "", accessor: "actions", disableOrdering: true, align: "right", width: '10%'}
  ],
  rows: [],
};

const Teams = () => {
  const api = useApi()
  const [selectedElement, setSelectedElement] = useState(null)
  const currentSelectedList = useRef([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryUnassigned, setSearchQueryUnassigned] = useState("");
  const [openConfirmModal, setOpenConfirmModal] = useState(false)
  const [openEditConfirmModal, setEditOpenConfirmModal] = useState(false)
  const [openConfirmEditModal, setOpenConfirmEditModal] = useState(false)
  const [openConfirmRemoveModal, setOpenConfirmRemoveModal] = useState(false)
  const [Employees, setEmployees] = useState([])
  const [EmployeesShowedModal, setEmployeesShowedModal] = useState([])
  const [UnassignedEmployees, setUnassignedEmployees] = useState([])
  const [UnassignedEmployeesFiltered, setUnassignedEmployeesFiltered] = useState([])
  const formikRef = useRef();
  const [recordList, setRecordList] = useState({...dataTableModel})
  const [SearchBarText, setSearchBarText] = useState("")
  const [droppingEv, setDroppingEv] = useState()
  const [droppingMemberId, setDroppingMemberId] = useState()
  const [droppingTeamId, setDroppingTeamId] = useState()
  const [deletingTeamId, setDeletingTeamId] = useState()
  const [droppingId, setDroppingId] = useState()
  const [droppingCat, setDroppingCat] = useState()
  const [droppingTitle, setDroppingTitle] = useState()
  const [droppingDeleteEmployeeId, setDroppingDeleteEmployeeId] = useState()
  const [droppingDeleteEmployeeName, setDroppingDeleteEmployeeName] = useState()
  const [addingEmployee, setAddingEmployee] = useState()
  const [removingEmployee, setRemovingEmployee] = useState()
  const searchBarQuery = useRef(null);
  const lastKeyPressedRef = useRef();

  const getTeams = (searchData = "", page = 1, ordering = "") => {
    setLoading(true)
    api.getTeams(searchData, page, ordering).then(result => {
      if (result.kind === "ok") {
        const {results, count} = result.data
        setData(results)
        setNumberOfItems(count)
      }
    }).catch(error => console.log(error))
      .finally(() => setLoading(false))
  }

  const getAllEmployees = () => {
    setLoading(true)
    api.getAllEmployees().then((result) => {
      if (result.kind === "ok") {
        setEmployees(result.data)
        setEmployeesShowedModal(result.data)
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }

  const getUnassignedEmployees = () => {
    setLoading(true)
    api.getUnassignedEmployees().then((result) => {
      if (result.kind === "ok") {
        setUnassignedEmployees(result.data)
        setUnassignedEmployeesFiltered(result.data)
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }

  const addTeam = (data) => {
    if (currentSelectedList.current.length === 0) {
      showMessage('Please select at least one employee')
      return
    }
    const dataForm = {...data, team_members: currentSelectedList.current}
    setLoading(true)
    api.addTeam(dataForm).then((result) => {
      if (result.kind === "ok") {
        queryData()
        cancelItemDelete()
        showMessage('Team added successfully', 'success')
      } else if (result.kind === "bad-data") {
        formikRef.current.setErrors(result.errors)
        showMessage('Validation errors found')
      } else if (result.kind === "rejected") {
        showMessage('Check if all the required fields are correctly filled')
      } else {
        showMessage()
      }
    })
      .catch(err => {
        showMessage()
      })
      .finally(() => setLoading(false))
  }

  const editTeam = () => {
    if (currentSelectedList.current.length === 0) {
      showMessage('Please select at least one employee')
      return
    }
    const dataForm = {...selectedElement, team_members: currentSelectedList.current}
    setLoading(true)
    api.editTeam(dataForm.id, dataForm).then((result) => {
      if (result.kind === "ok") {
        queryData()
        cancelItemDelete()
        showMessage('Service updated successfully', 'success')
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

  const deleteTeam = () => {
    setLoading(true)
    api.deleteTeam(selectedElement.id).then((result) => {
      if (result.kind === "ok") {
        queryData()
        cancelItemDelete()
        showMessage('Team deleted successfully', 'success')
      } else {
        showMessage()
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }

  const addEmployeeToTeam = (team, employee, extra = null) => {
    const data = {id: team, employee_id: extra ? extra : employee}
    setLoading(true)
    api.addTeamMember(data).then((result) => {
      if (result.kind === "ok") {
        queryData()
        cancelItemDelete()
        showMessage('Team updated successfully', 'success')
      } else if (result.kind === "bad-data") {
        showMessage('Validation errors found')
      } else {
        showMessage()
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))

  }

  const removeEmployeeFromTeam = (employee_id) => {
    const data = {employee_id}
    setLoading(true)
    api.removeEmployeeFromTeam(data).then((result) => {
      if (result.kind === "ok") {
        queryData()
        cancelItemDelete()
        showMessage('Employee removed successfully', 'success')
      } else if (result.kind === "bad-data") {
        showMessage('This action is not allowed')
        queryData()
      } else {
        showMessage()
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))

  }


  const validationSchema =
    Yup.object().shape({
      title: Yup.string().required('Team name is required'),
    })

  const initialValues = {
    title: selectedElement ? selectedElement.title : "",
  };

  const addEditTeam = (data) => {
    if (selectedElement) {
      setSelectedElement({...data, id: selectedElement.id})
      setEditOpenConfirmModal(true)
    } else {
      addTeam(data);
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
    currentSelectedList.current = []
  }

  const selectItemEdit = (item) => {
    currentSelectedList.current = []
    setSelectedElement(item)
    setOpen(true)
  }

  const removeTeamDrageStart = (ev, teamId, memberId, employeeName) => {
    ev.dataTransfer.setData("memberId", memberId)
    ev.dataTransfer.setData("teamId", teamId)
    setDroppingDeleteEmployeeId(teamId)
    setDroppingDeleteEmployeeName(employeeName)
  }

  const removeTeamDrageOver = e => {
    e.preventDefault()
  }
  const removeTeamOnDrop = (ev, cat) => {
    let teamId = ev.dataTransfer.getData("teamId")
    setDeletingTeamId(teamId)
    setOpenConfirmRemoveModal(true)
  }

  const confirmRemoveTeamOnDrop = () => {
    removeEmployeeFromTeam(deletingTeamId)
    setOpenConfirmRemoveModal(false)
  }

  const addTeamDrageStart = (ev, memberId) => {
    ev.dataTransfer.setData("memberId", memberId)
  }

  const addTeamDrageOver = e => {
    e.preventDefault()
  }

  const confirmEditTeamModal = () => {
    addEmployeeToTeam(droppingId, droppingMemberId, droppingTeamId)
    setOpenConfirmEditModal(false)
  }

  const addTeamOnDrop = (ev, id, cat, title) => {
    setDroppingEv(ev)
    setDroppingId(id)
    setDroppingCat(cat)
    let memberId = ev.dataTransfer.getData("memberId")
    let teamId = ev.dataTransfer.getData("teamId")
    setDroppingTitle(title)
    setDroppingTeamId(teamId)
    setDroppingMemberId(memberId)
    setOpenConfirmEditModal(true)
  }

  const queryData = () => {
    getTeams(searchQuery, currentPage)
    getUnassignedEmployees()
    getAllEmployees()
  }

  const searchEmployeesInModal = () => {
    const employees = [...Employees]
    const result = employees.filter(obj => {
      const lowerCaseName = obj.name.toLowerCase()
      if (lowerCaseName.includes(SearchBarText.toLowerCase())) {
        return obj
      }
    })

    result.length > 0
      ? setEmployeesShowedModal(result)
      : setEmployeesShowedModal('No teams detectected')
  }

  const searchUnassignedEmployees = () => {
    const employees = [...UnassignedEmployees]
    const result = employees.filter(obj => {
      const lowerCaseName = obj.name.toLowerCase()
      if (lowerCaseName.includes(searchQueryUnassigned.toLowerCase())) {
        return obj
      }
    })
    setUnassignedEmployeesFiltered(result)
  }

  const prepareCall = (evt) => {
    lastKeyPressedRef.current = (new Date()).getTime()
    setTimeout(() => {
      const now = (new Date()).getTime()
      if (loading || now - lastKeyPressedRef.current < 1000) {
        return
      }
      getTeams(searchBarQuery.current.value)
    }, 1000)
  }

  useEffect(() => {
    searchEmployeesInModal()
  }, [SearchBarText])

  useEffect(() => {
    searchUnassignedEmployees()
  }, [searchQueryUnassigned])

  useEffect(() => {
    getTeams(searchQuery)
  }, [])

  useEffect(() => {
    queryData()
  }, [])

  const renderEmployeeRow = (item, index) => {

    if (selectedElement?.team_members?.some(el => el.id === item.id)) updateSelectedList(item, true)

    return (
      <MDBox key={item.id} display={'flex'} marginTop={2}>
        <Grid container direction={"row"} spacing={2}>
          <Grid item>
            <MDAvatar style={{placeItems: "center", width: 50, height: 50}} src={logoround} size="xl">W</MDAvatar>
          </Grid>
          <Grid item style={{justifyItems: "center", alignItems: "center"}} display={'flex'} flex={1}>
            <MDTypography sx={{fontWeight: 500, fontSize: 18, fontFamily: 'Montserrat'}}>
              {item.name}
            </MDTypography>
          </Grid>
          <Grid item style={{justifyItems: "center", alignItems: "center", marginTop: 16.5, marginRight: 30}}>
            <CustomInputCheckbox
              labelStyle={{marginLeft: 30}}
              spanStyles={{width: 20, height: 20, borderColor: 'black'}}
              defaultValueCondition={selectedElement?.team_members ? selectedElement.team_members.some(el => el.id === item.id) : false}
              handleChange={updateSelectedList}
              item={item}
            />
          </Grid>
        </Grid>
      </MDBox>
    )
  }

  const renderEmployeeCardAdd = (employee, team) => {
    return <div
      style={{margin: 5}}
      key={`employee_id__${employee.id}`}
      className={styles.employeeCard}
      draggable
      onDragStart={e => {
        removeTeamDrageStart(
          e,
          employee.id,
          team.id,
          employee.name
        )
        setRemovingEmployee(team.title)
      }
      }

    >
      <span>{employee.name !== '' ? employee.name : 'No name specified'}</span>
    </div>
  }

  const renderEmployeeCard = (employee) => {
    return <div
      style={{margin: 5}}
      key={`employee_id__${employee.id}`}
      className={styles.employeeCard}
      draggable
      onDragStart={e => {
        addTeamDrageStart(e, employee.id)
        setAddingEmployee(employee.name)
      }
      }

    >
      <span>{employee.name !== '' ? employee.name : 'No name specified'}</span>
    </div>
  }

  const renderRow = (item, idx) => {
    return (
      <TableRow
        key={item.id}
                onDragOver={e => addTeamDrageOver(e)}
                onDrop={e => {
                  addTeamOnDrop(e, item.id, "items", item.title)
                }}
      >
        <TableCell className={`${idx !== data.length - 1 && styles.rowItemBorder} ${styles.rowItem} ${styles.column1}`}>{item.id}</TableCell>
        <TableCell
          className={`${idx !== data.length - 1 && styles.rowItemBorder} ${styles.rowItem} ${styles.column2}`}>{item.title}</TableCell>
        <TableCell className={`${idx !== data.length - 1 && styles.rowItemBorder} ${styles.rowItem} ${styles.column3}`}>
          <div style={{display: 'flex', flexWrap: 'wrap'}}>
            {item.team_members.map(e => renderEmployeeCardAdd(e, item))}
          </div>
        </TableCell>
        <TableCell className={`${idx !== data.length - 1 && styles.rowItemBorder} ${styles.rowItem} ${styles.column4}`}
                   align="right">
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
        </TableCell>
      </TableRow>
    )
  }

  const updateSelectedList = (item, add = false) => {
    const presentInList = currentSelectedList.current.some(i => i === item.id)
    if (presentInList && !add) {
      currentSelectedList.current = currentSelectedList.current.filter(i => i !== item.id)
      return
    }
    if (!presentInList && add) {
      currentSelectedList.current.push(item.id)
    }
  }


  return (
    <DashboardLayout showCard loginRequired>
      <Grid container mb={3}>
        <Grid item xs={12} justifyContent={'flex-end'} display={'flex'}>
          <MDButton ml={'auto'} disabled={loading} variant="gradient" color="primary"
                    onClick={() => setOpen(true)}
          >
            Add Team
          </MDButton>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={7}>
          <MDBox sx={{backgroundColor: '#EBEBEB', borderRadius: 20, position: 'relative'}} px={5}>
            <Search style={{position: 'absolute', bottom: 7, left: 10}}/>
            <Input
              fullWidth
              placeholder="Search Team"
              type="text"
              inputRef={searchBarQuery}
              onInputCapture={prepareCall}
            />
          </MDBox>
        </Grid>
        <Grid item xs={1} display="flex" alignItems="center" justifyContent="center">
          {loading ? <CircularProgress size={24} color="primary"/> : <FiltroIcon/>}
        </Grid>
        <Grid item xs={4} justifyContent={'flex-end'} display={'flex'}>
          <MDBox sx={{backgroundColor: '#EBEBEB', borderRadius: 20, position: 'relative'}} px={7}>
            <Search style={{position: 'absolute', bottom: 7, left: 10}}/>
            <Input
              fullWidth
              placeholder="Search Employee"
              type="text"
              onChange={(event) => setSearchQueryUnassigned(event.target.value)}
            />
          </MDBox>
        </Grid>
      </Grid>

      <Table>
        <TableBody>
          <TableRow>
            <TableCell width={"80%"} className={styles.thead}>
              <DataTable table={recordList} onColumnOrdering={() => {
              }} showHeader={true} showRecords={false}/>
            </TableCell>
            <TableCell width={"20%"} className={styles.thead}>Unassigned</TableCell>
          </TableRow>
          <TableRow style={{borderBottom: 'hidden', height: '50vh'}}>
            <TableCell width={"80%"} className={styles.theadinternaltableteams}
                       sx={{position: 'relative', overflowY: 'scroll', height: '50vh'}}>
              <Table padding="none">
                <TableBody sx={{height: '50vh'}}>
                  {data.length > 0
                    ? data.map((item, index) => renderRow(item, index))
                    : (
                      <TableRow><TableCell sx={{padding: 0}}>
                        <p
                          style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 20}}
                        >
                          No teams found
                        </p>
                      </TableCell></TableRow>
                    )
                  }
                </TableBody>
              </Table>
            </TableCell>
            <TableCell className={styles.theadunassignedteams} sx={{height: '50vh'}}
                       onDrop={e => removeTeamOnDrop(e, "unAssign")}
                       onDragOver={e => removeTeamDrageOver(e)}
            >
              <Table padding="none">
                <TableBody sx={{height: '50vh'}}>
                  {UnassignedEmployeesFiltered.length > 0
                    ? UnassignedEmployeesFiltered.map(item => renderEmployeeCard(item))
                    : (
                      <TableRow><TableCell sx={{padding: 0}}>
                        <p
                          onDragOver={e => removeTeamDrageOver(e)}
                          style={{
                            display: 'flex',
                            height: '50vh',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: 20
                          }}
                        >
                          No employees found
                        </p>
                      </TableCell></TableRow>
                    )
                  }
                </TableBody>
              </Table>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Pagination
        currentPage={currentPage}
        totalCount={numberOfItems}
        pageSize={8}
        onPageChange={page => {
          getTeams('', page)
          setCurrentPage(page)
        }}
      />

      <ConfirmDialogModal
        title={'Do you want to delete this team?'}
        description={`${selectedElement?.id} - ${selectedElement?.title}`}
        cancelText={'Cancel'}
        confirmText={'Confirm'}
        open={openConfirmModal}
        handleClose={() => cancelItemDelete()}
        handleConfirm={() => deleteTeam()}
      />
      <ConfirmDialogModal
        title={'Do you want to update this team?'}
        description={`${selectedElement?.id} - ${selectedElement?.title}`}
        cancelText={'Cancel'}
        confirmText={'Confirm'}
        open={openEditConfirmModal}
        handleClose={() => setEditOpenConfirmModal(false)}
        handleConfirm={() => editTeam()}
      />
      <ConfirmDialogModal
        title={`Do you want to add ${addingEmployee} to the team?`}
        description={`${droppingId} - ${droppingTitle}`}
        cancelText={'Cancel'}
        confirmText={'Confirm'}
        open={openConfirmEditModal}
        handleClose={() => setOpenConfirmEditModal(false)}
        handleConfirm={() => confirmEditTeamModal()}
      />
      <ConfirmDialogModal
        title={`Do you want to remove this employee from the team: ${removingEmployee}?`}
        description={`${droppingDeleteEmployeeId} - ${droppingDeleteEmployeeName}`}
        cancelText={'Cancel'}
        confirmText={'Confirm'}
        open={openConfirmRemoveModal}
        handleClose={() => setOpenConfirmRemoveModal(false)}
        handleConfirm={() => confirmRemoveTeamOnDrop()}
      />
      <ModalItem
        open={open}
        title={selectedElement ? 'Edit Team' : 'Add Team'}
        handleClose={() => cancelItemDelete()}
        paddingStyle={0}
        marginRightIcon={1.5}
        marginTopIcon={1.5}
        fontSizeIcon={'medium'}
      >
        <Formik
          innerRef={formikRef}
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={values => {
            addEditTeam(values);
          }}
        >
          {({errors, touched, isValid, setFieldValue}) => (
            <Form style={{display: 'flex', flexDirection: 'column', flex: 1, padding: 30}}>
              <Field name="title">
                {({field}) => {
                  return (
                    <MDBox mb={2}>
                      <MDInput
                        type="text"
                        label="Team Name"
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
              <FormLabel sx={{fontSize: 14, marginTop: 2}}>Team Members</FormLabel>
              <MDBox sx={{backgroundColor: '#EBEBEB', borderRadius: 20, position: 'relative'}} px={5} mt={2}>
                <Search style={{position: 'absolute', bottom: 7, left: 10}}/>
                <Input
                  fullWidth
                  placeholder="Search"
                  type="text"
                  onChange={(event) => setSearchBarText(event.target.value)}
                />
              </MDBox>


              <div style={{overflowY: 'scroll', marginTop: 15,}} className='modalTeams'>
                {EmployeesShowedModal.length > 0 && EmployeesShowedModal.map((item, index) => renderEmployeeRow(item, index))}
              </div>
              <MDBox mx={'auto'} justifyContent={'center'} mt={'auto'} marginTop={3} marginBottom={-2.5}>
                <MDButton sx={{minWidth: 150}} size={'large'} loading={loading} disabled={loading || !isValid}
                          variant="gradient" color="secondary" type='submit'>
                  Save Team
                  <p style={{}}></p>
                </MDButton>
              </MDBox>
            </Form>
          )}
        </Formik>
      </ModalItem>
    </DashboardLayout>
  )
}

export default Teams
