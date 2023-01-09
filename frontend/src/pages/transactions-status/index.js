import DashboardLayout from "../../components/LayoutContainers/DashboardLayout"
import {useEffect, useRef, useState} from "react"
import {showMessage, useApi} from "../../services/helpers"
import {dataTableModel, renderTableRow} from "./utils";
import DataTable from "../../components/DataTable";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../services/constants";


const TransactionStatus = () => {
  const api = useApi()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [numberOfItemsPage, setNumberOfItemsPage] = useState(0);
  const [recordList, setRecordList] = useState({...dataTableModel})
  const searchQueryRef = useRef("");

  const getTransactions = (searchData, page = 1, ordering = "") => {
    setLoading(true)
    api.getTransactions(searchData, page, ordering, 8).then((result) => {
      console.log('result ', result)
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
      getTransactions(searchQueryRef?.current)
    } else if (order === 'asce') {
      getTransactions(searchQueryRef?.current, 1, `${column}`)
    } else {
      getTransactions(searchQueryRef?.current, 1, `-${column}`)
    }
  }

  const setDetailToShow = (item) => {
    navigate(ROUTES.BLOCKCHAIN_TRANSACTION(item.id))
  }

  useEffect(() => {
    getTransactions("")
  }, [])

  return (
    <DashboardLayout
      loginRequired
      loading={loading}
      searchFunc={getTransactions}
    >
      {recordList?.rows.length > 0
        ? (<DataTable
          table={recordList}
          onColumnOrdering={onColumnOrdering}
          currentPage={currentPage}
          numberOfItems={numberOfItems}
          numberOfItemsPage={numberOfItemsPage}
          pageSize={8}
          onPageChange={page => {
            getTransactions('', page)
            setCurrentPage(page)
          }}
        />)
        : <p style={{display: 'flex', height: '55vh', justifyContent: 'center', alignItems: 'center', fontSize: 20}}>No transactions found</p>
      }
    </DashboardLayout>
  )
}

export default TransactionStatus
