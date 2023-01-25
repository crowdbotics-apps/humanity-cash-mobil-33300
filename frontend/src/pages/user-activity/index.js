import DashboardLayout from "../../components/LayoutContainers/DashboardLayout"
import {useEffect, useRef, useState} from "react"
import {showMessage, useApi} from "../../services/helpers"
import {dataTableModel, renderTableRow} from "./utils";
import DataTable from "../../components/DataTable";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../services/constants";

const UserActivities = () => {
  const api = useApi()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [numberOfItemsPage, setNumberOfItemsPage] = useState(0);
  const [recordList, setRecordList] = useState({...dataTableModel})
  const searchQueryRef = useRef("");

  const getUserActivity = (searchData, page = 1, ordering = "") => {
    setLoading(true)
    api.getUserActivity(searchData, page, ordering, 8).then((result) => {
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
      getUserActivity(searchQueryRef?.current)
    } else if (order === 'asce') {
      getUserActivity(searchQueryRef?.current, 1, `${column}`)
    } else {
      getUserActivity(searchQueryRef?.current, 1, `-${column}`)
    }
  }

  const setDetailToShow = (item) => {
    navigate(ROUTES.BLOCKCHAIN_TRANSACTION(item.id))
  }

  useEffect(() => {
    getUserActivity("")
  }, [])

  return (
    <DashboardLayout
      loginRequired
      title={'Sign-in logs'}
      loading={loading}
      searchFunc={getUserActivity}
    >
      <DataTable
        table={recordList}
        loading={loading}
        onColumnOrdering={onColumnOrdering}
        currentPage={currentPage}
        numberOfItems={numberOfItems}
        numberOfItemsPage={numberOfItemsPage}
        onPageChange={page => {
          getUserActivity('', page)
          setCurrentPage(page)
        }}
      />
    </DashboardLayout>
  )
}

export default UserActivities
