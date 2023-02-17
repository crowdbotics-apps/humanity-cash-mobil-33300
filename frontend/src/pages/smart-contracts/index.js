import DashboardLayout from "../../components/LayoutContainers/DashboardLayout"
import {useEffect, useRef, useState} from "react"
import {showMessage, useApi} from "../../services/helpers"
import {dataTableModel, renderTableRow} from "./utils";
import DataTable from "../../components/DataTable";
import ConfirmDialogModal from "../../components/ConfirmDialogModal";

const SmartContracts = () => {
  const api = useApi()
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [numberOfItemsPage, setNumberOfItemsPage] = useState(0);
  const [recordList, setRecordList] = useState({...dataTableModel})
  const [selectedItem, setSelectedItem] = useState(null)
  const [showConfirmUpdateModal, setShowConfirmUpdateModal] = useState(null)
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

  const updateContractState = () => {
    setLoading(true)
    api.updateContractState(selectedItem.id).then((result) => {
      if (result.kind === 'ok') {
        clearDetail()
        getContracts("")
        showMessage('Contract state updated successfully', 'success')
      } else {
        showMessage()
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }

  const clearDetail = () => {
    setSelectedItem(null)
    setShowConfirmUpdateModal(false)
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
    setSelectedItem(item)
    setShowConfirmUpdateModal(true)
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
      <ConfirmDialogModal
        title={'Update contract status'}
        description={`Do you want to update the state of the contract?`}
        open={showConfirmUpdateModal}
        handleClose={() => clearDetail()}
        handleConfirm={() => updateContractState()}
        cancelText={'Cancel'}
        confirmText={'Update'}
      />
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
