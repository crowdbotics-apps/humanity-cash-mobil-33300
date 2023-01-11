import DashboardLayout from "../../components/LayoutContainers/DashboardLayout"
import {useEffect, useRef, useState} from "react"
import {showMessage, useApi} from "../../services/helpers"
import {dataTableModel, renderTableRow} from "./utils";
import DataTable from "../../components/DataTable";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../services/constants";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import MDBox from "../../components/MDBox";


const AdminPortal = () => {
  const api = useApi()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [numberOfItemsPage, setNumberOfItemsPage] = useState(0);
  const [recordList, setRecordList] = useState({...dataTableModel})
  const searchQueryRef = useRef("");

  const getDwollaUsers = (searchData, page = 1, ordering = "") => {
    setLoading(true)
    api.getDwollaUsers(searchData, page, ordering, 8).then((result) => {
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
      getDwollaUsers(searchQueryRef?.current)
    } else if (order === 'asce') {
      getDwollaUsers(searchQueryRef?.current, 1, `${column}`)
    } else {
      getDwollaUsers(searchQueryRef?.current, 1, `-${column}`)
    }
  }

  const setDetailToShow = (item) => {
    console.log('items')
  }

  useEffect(() => {
    getDwollaUsers("")
  }, [])

  return (
    <DashboardLayout
      loginRequired
      title={'Admin Employees / Sub - Admins'}
      loading={loading}
      searchFunc={getDwollaUsers}
    >
      <MDBox display={'flex'} flex={1} alignItems={'center'} mt={5}>
        <MDTypography  color={'primary'} sx={{fontWeight: 400}} fontSize={24} >
          Admin Portal Access Management
        </MDTypography>
        <MDBox ml={'auto'}>
          <MDButton
            color={"primary"}
            variant={"contained"}
            sx={{width: 200}}
          >
            Add User
          </MDButton>
        </MDBox>
      </MDBox>
      {recordList?.rows.length > 0
        ? (<DataTable
          table={recordList}
          onColumnOrdering={onColumnOrdering}
          currentPage={currentPage}
          numberOfItems={numberOfItems}
          numberOfItemsPage={numberOfItemsPage}
          pageSize={8}
          onPageChange={page => {
            getDwollaUsers('', page)
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
