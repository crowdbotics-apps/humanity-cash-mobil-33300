import DashboardLayout from "../../components/LayoutContainers/DashboardLayout"
import {useEffect, useRef, useState} from "react"
import {showMessage, useApi} from "../../services/helpers"
import {dataTableModel, renderTableRow} from "./utils";
import DataTable from "../../components/DataTable";
import ConfirmDialogInputModal from "../../components/ConfirmDialogInputModal";
import MDInput from "../../components/MDInput";
import MDButton from "../../components/MDButton";
import MDBox from "../../components/MDBox";
import {EmptyResponseDatatable} from "../../components/EmptyResponseDatatable";


const ACHTransactions = () => {
  const api = useApi()
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [numberOfItemsPage, setNumberOfItemsPage] = useState(0);
  const [recordList, setRecordList] = useState({...dataTableModel})
  const searchQueryRef = useRef("");

  const getACHTransactions = (searchData, page = 1, ordering = "") => {
    setLoading(true)
    api.getACHTransactions(searchData, page, ordering, 8).then((result) => {
      if (result.kind === "ok") {
        const {count, results} = result.data
        const tmp = {...dataTableModel}
        tmp.rows = results.map(e => renderTableRow(e))
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
      getACHTransactions(searchQueryRef?.current)
    } else if (order === 'asce') {
      getACHTransactions(searchQueryRef?.current, 1, `${column}`)
    } else {
      getACHTransactions(searchQueryRef?.current, 1, `-${column}`)
    }
  }

  useEffect(() => {
    getACHTransactions("")
  }, [])

  return (
    <DashboardLayout
      loginRequired
      loading={loading}
      searchFunc={getACHTransactions}
      title={'ACH Transactions'}
    >
      <DataTable
        loading={loading}
        emptyLabelText={'No ACH transactions found'}
        table={recordList}
        onColumnOrdering={onColumnOrdering}
        currentPage={currentPage}
        numberOfItems={numberOfItems}
        numberOfItemsPage={numberOfItemsPage}
        onPageChange={page => {
          getACHTransactions('', page)
          setCurrentPage(page)
        }}
      />
    </DashboardLayout>
  )
}

export default ACHTransactions
