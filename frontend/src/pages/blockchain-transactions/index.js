import DashboardLayout from "../../components/LayoutContainers/DashboardLayout"
import {useEffect, useRef, useState} from "react"
import {showMessage, useApi} from "../../services/helpers"
import {dataTableModel, renderTableRow} from "./utils";
import DataTable from "../../components/DataTable";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../services/constants";

const BlockchainTransactions = () => {
  const api = useApi()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [numberOfItemsPage, setNumberOfItemsPage] = useState(0);
  const [recordList, setRecordList] = useState({...dataTableModel})
  const searchQueryRef = useRef("");

  const getBlockchainTransactions = (searchData, page = 1, ordering = "") => {
    setLoading(true)
    api.getBlockchainTransactions(searchData, page, ordering, 8).then((result) => {
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
      getBlockchainTransactions(searchQueryRef?.current)
    } else if (order === 'asce') {
      getBlockchainTransactions(searchQueryRef?.current, 1, `${column}`)
    } else {
      getBlockchainTransactions(searchQueryRef?.current, 1, `-${column}`)
    }
  }

  const setDetailToShow = (item) => {
    navigate(ROUTES.BLOCKCHAIN_TRANSACTION(item.id))
  }

  useEffect(() => {
    getBlockchainTransactions("")
  }, [])

  return (
    <DashboardLayout
      loginRequired
      loading={loading}
      searchFunc={getBlockchainTransactions}
    >
      <DataTable
        table={recordList}
        loading={loading}
        emptyLabelText={'No blockchain transactions found'}
        onColumnOrdering={onColumnOrdering}
        currentPage={currentPage}
        numberOfItems={numberOfItems}
        numberOfItemsPage={numberOfItemsPage}
        onPageChange={page => {
          getBlockchainTransactions('', page)
          setCurrentPage(page)
        }}
      />
    </DashboardLayout>
  )
}

export default BlockchainTransactions
