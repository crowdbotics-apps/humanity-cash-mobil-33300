import DashboardLayout from "../../components/LayoutContainers/DashboardLayout"
import {useEffect, useRef, useState} from "react"
import {showMessage, useApi} from "../../services/helpers"
import {dataTableModel, renderTableRow} from "./utils";
import DataTable from "../../components/DataTable";

const SmartContracts = () => {
  const api = useApi()
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [numberOfItemsPage, setNumberOfItemsPage] = useState(0);
  const [recordList, setRecordList] = useState({...dataTableModel})
  const searchQueryRef = useRef("");

  const getContracts = (searchData, page = 1, ordering = "") => {
    setLoading(true)
    api.getContracts(searchData, page, ordering, 8).then((result) => {
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
      getContracts(searchQueryRef?.current)
    } else if (order === 'asce') {
      getContracts(searchQueryRef?.current, 1, `${column}`)
    } else {
      getContracts(searchQueryRef?.current, 1, `-${column}`)
    }
  }

  const setDetailToShow = (item) => {
    console.log('items')
  }

  useEffect(() => {
    getContracts("")
  }, [])

  return (
    <DashboardLayout
      loginRequired
      loading={loading}
      searchFunc={getContracts}
    >
      <DataTable
        table={recordList}
        loading={loading}
        emptyLabelText={'No smart contracts found'}
        onColumnOrdering={onColumnOrdering}
        currentPage={currentPage}
        numberOfItems={numberOfItems}
        numberOfItemsPage={numberOfItemsPage}
        onPageChange={page => {
          getContracts('', page)
          setCurrentPage(page)
        }}
      />
    </DashboardLayout>
  )
}

export default SmartContracts
