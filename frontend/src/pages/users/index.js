import DashboardLayout from "../../components/LayoutContainers/DashboardLayout"
import {useEffect, useRef, useState} from "react"
import {showMessage, useApi} from "../../services/helpers"
import {dataTableModel, renderTableRow} from "./utils";
import DataTable from "../../components/DataTable";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../services/constants";
import MDBox from "../../components/MDBox";
import {EmptyResponseDatatable} from "../../components/EmptyResponseDatatable";

const Users = () => {
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
        console.log('results ', results)
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
    console.log('item ', item)
    navigate(ROUTES.USER(item.id), {state: {type: item.account_type}})
  }

  useEffect(() => {
    getDwollaUsers("")
  }, [])

  return (
    <DashboardLayout
      loginRequired
      loading={loading}
      searchFunc={getDwollaUsers}
    >
      <DataTable
        table={recordList}
        loading={loading}
        emptyLabelText={'No users found'}
        onColumnOrdering={onColumnOrdering}
        currentPage={currentPage}
        numberOfItems={numberOfItems}
        numberOfItemsPage={numberOfItemsPage}
        onPageChange={page => {
          getDwollaUsers('', page)
          setCurrentPage(page)
        }}
      />
    </DashboardLayout>
  )
}

export default Users
