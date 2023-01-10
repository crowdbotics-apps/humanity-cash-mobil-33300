import DashboardLayout from "../../components/LayoutContainers/DashboardLayout"
import {useEffect, useRef, useState} from "react"
import {showMessage, useApi} from "../../services/helpers"
import {dataTableModel, renderTableRow} from "./utils";
import DataTable from "../../components/DataTable";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import ConfirmDialogInputModal from "../../components/ConfirmDialogInputModal";
import MDInput from "../../components/MDInput";
import {ROUTES} from "../../services/constants";


const BlockchainTransaction = () => {
  const api = useApi()
  const navigate = useNavigate()
  const {id} = useParams()
  const [loading, setLoading] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [userPassword, setUserPassword] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [numberOfItemsPage, setNumberOfItemsPage] = useState(0);
  const [recordList, setRecordList] = useState({...dataTableModel})


  const getBlockchainTransactions = (data) => {
    setLoading(true)
    api.getBlockchainTransaction(data).then((result) => {
      if (result.kind === "ok") {
        const results = [result.response]
        const tmp = {...dataTableModel}
        tmp.rows = results.map(e => renderTableRow(e, setDetailToShow))
        setRecordList(tmp)
        setNumberOfItems(1)
        setNumberOfItemsPage(results.length)
      } else if (result.kind === "bad-data"){
        showMessage(result.errors[0])
      }
      clearDetail()
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }

  const setDetailToShow = (item) => {
    setShowPrivacyModal(true)
    setSelectedItem(item)
  }

  const clearDetail = () => {
    setShowPrivacyModal(false)
    setSelectedItem(null)
    setUserPassword('')
  }

  const confirmAction = () => {
    const data = {
      id,
      show_username: true,
      password: userPassword
    }
    getBlockchainTransactions(data)
  }

  useEffect(() => {
    getBlockchainTransactions({id})
  }, [])

  return (
    <DashboardLayout
      loginRequired
      goBack={() => navigate(ROUTES.BLOCKCHAIN_TRANSACTIONS)}
      loading={loading}
    >
      {recordList?.rows.length > 0
        ? (<DataTable
          table={recordList}
          currentPage={currentPage}
          numberOfItems={numberOfItems}
          numberOfItemsPage={numberOfItemsPage}
          pageSize={8}
          onPageChange={page => {
            getBlockchainTransactions('', page)
            setCurrentPage(page)
          }}
        />)
        : <p style={{display: 'flex', height: '55vh', justifyContent: 'center', alignItems: 'center', fontSize: 20}}>No
          blockchain transactions found</p>
      }
      <ConfirmDialogInputModal
        title={'Privacy Requirement'}
        description={'Please enter your password to confirm'}
        open={showPrivacyModal}
        handleClose={() => clearDetail()}
        handleConfirm={() => confirmAction()}
        disabledConfirm={userPassword === ''}
      >
        <MDInput
          type="password"
          label="PASSWORD"
          variant="outlined"
          fullWidth
          password
          placeholder="input your password"
          value={userPassword}
          onChange={(evt) => setUserPassword(evt.target.value)}
        />
      </ConfirmDialogInputModal>
    </DashboardLayout>
  )
}

export default BlockchainTransaction
