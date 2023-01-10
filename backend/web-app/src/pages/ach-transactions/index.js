import DashboardLayout from "../../components/LayoutContainers/DashboardLayout"
import {useEffect, useRef, useState} from "react"
import {showMessage, useApi} from "../../services/helpers"
import {dataTableModel, renderTableRow} from "./utils";
import DataTable from "../../components/DataTable";
import ConfirmDialogInputModal from "../../components/ConfirmDialogInputModal";
import MDInput from "../../components/MDInput";
import MDButton from "../../components/MDButton";
import MDBox from "../../components/MDBox";


const ACHTransactions = () => {
  const api = useApi()
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [numberOfItemsPage, setNumberOfItemsPage] = useState(0);
  const [recordList, setRecordList] = useState({...dataTableModel})
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [ShowConfirmationModal, setShowConfirmationModal] = useState(false)
  const [userPassword, setUserPassword] = useState('')
  const [transactionStatus, setTransactionStatus] = useState('Pending')
  const searchQueryRef = useRef("");

  const getACHTransactions = (searchData, page = 1, ordering = "") => {
    setLoading(true)
    api.getACHTransactions(searchData, page, ordering, 8, {transaction_status: transactionStatus}).then((result) => {
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
      getACHTransactions(searchQueryRef?.current)
    } else if (order === 'asce') {
      getACHTransactions(searchQueryRef?.current, 1, `${column}`)
    } else {
      getACHTransactions(searchQueryRef?.current, 1, `-${column}`)
    }
  }

  const setDetailToShow = (item) => {
    setShowPrivacyModal(true)
    setSelectedItem(item)
  }

  const clearDetail = () => {
    setShowConfirmationModal(false)
    setShowPrivacyModal(false)
    setSelectedItem(null)
    setUserPassword('')
  }

  const confirmAction = () => {

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
      {recordList?.rows.length > 0
        ? (<DataTable
          table={recordList}
          onColumnOrdering={onColumnOrdering}
          currentPage={currentPage}
          numberOfItems={numberOfItems}
          numberOfItemsPage={numberOfItemsPage}
          pageSize={8}
          onPageChange={page => {
            getACHTransactions('', page)
            setCurrentPage(page)
          }}
        />)
        : <p style={{display: 'flex', height: '55vh', justifyContent: 'center', alignItems: 'center', fontSize: 20}}>No
          ACH transactions found</p>
      }
    </DashboardLayout>
  )
}

export default ACHTransactions
