import DashboardLayout from "../../components/LayoutContainers/DashboardLayout"
import {useEffect, useRef, useState} from "react"
import {showMessage, useApi} from "../../services/helpers"
import {dataTableModel, renderTableRow} from "./utils";
import DataTable from "../../components/DataTable";
import ConfirmDialogInputModal from "../../components/ConfirmDialogInputModal";
import MDInput from "../../components/MDInput";
import MDButton from "../../components/MDButton";
import MDBox from "../../components/MDBox";
import ConfirmDialogModal from "../../components/ConfirmDialogModal";

const TransactionStatus = () => {
  const api = useApi()
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [currentOrdering, setCurrentOrdering] = useState('');
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [numberOfItemsPage, setNumberOfItemsPage] = useState(0);
  const [recordList, setRecordList] = useState({...dataTableModel})
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [ShowConfirmationModal, setShowConfirmationModal] = useState(false)
  const [ShowErrorModal, setShowErrorModal] = useState(false)
  const [userPassword, setUserPassword] = useState('')
  const [transactionStatus, setTransactionStatus] = useState('Pending')
  const searchQueryRef = useRef("");

  const getTransactions = (searchData, page = 1, ordering = "") => {
    setLoading(true)
    api.getTransactions(searchData, page, ordering, 8, {transaction_status: transactionStatus}).then((result) => {
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

  const signoffTransaction = (data) => {
    setLoading(true)
    api.signoffTransaction(data).then((result) => {
      if (result.kind === "ok") {

        showMessage('Action executed successfully', 'success')
        clearDetail()
        const action_result = result.response
        if (action_result === 'signed'){
          getTransactions('', currentPage, currentOrdering)
        }else if (action_result === 'executed'){
          setTransactionStatus('Executed')
        }else if (action_result === 'failed') {
          setTransactionStatus('Approved')
        }
      } else if (result.kind === "bad-data") {
        showMessage(result?.errors || result[0] || result)
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }
  const onColumnOrdering = (ordering) => {
    const {column, order} = ordering
    if (column === '') {
      setCurrentOrdering('')
      getTransactions(searchQueryRef?.current)
    } else if (order === 'asce') {
      setCurrentPage(1)
      setCurrentOrdering(`${column}`)
      getTransactions(searchQueryRef?.current, 1, `${column}`)
    } else {
      setCurrentPage(1)
      setCurrentOrdering(`-${column}`)
      getTransactions(searchQueryRef?.current, 1, `-${column}`)
    }
  }

  const setDetailToShow = (item) => {
    setSelectedItem(item)
    if (item.status === 'Pending' && item.signable) {
      setShowPrivacyModal(true)
    } else if (item.status === 'Approved') {
      setShowErrorModal(true)
    }
  }

  const clearDetail = () => {
    setShowConfirmationModal(false)
    setShowPrivacyModal(false)
    setShowErrorModal(false)
    setSelectedItem(null)
    setUserPassword('')
  }

  const confirmAction = () => {
    const data = {
      id: selectedItem?.id,
      password: userPassword,
    }
    signoffTransaction(data)
  }

  const nextStep = () => {
    setShowConfirmationModal(true)
    setShowPrivacyModal(false)
  }

  const actions  = [
    {
      subTitle: ` to be transferred from the Reserve Wallet to the Negative Mint Adjustment Account Wallet.`,
      type: 'fund_negative',
    },
    {
      subTitle: ` to be burned from the Negative Adjustment Account Wallet.`,
      type: 'burn_from_negative',
    },
    {
      subTitle: ` to be transferred from the Negative Mint Adjustment Account Wallet to the Reserve Wallet.`,
      type: 'revert_fund_negative',
    },
    {
      subTitle: `  to be minted to the Positive Mint Adjustment Account Wallet.`,
      type: 'mint_to_positive',
    },
    {
      subTitle: `  to be transferred from the Positive Mint Adjustment Account Wallet to the Recipient wallet.`,
      type: 'positive_to_user',
    },
    {
      subTitle: ` to be burned from the Positive Mint Adjustment Account Wallet`,
      type: 'revert_mint_to_positive',
    },
  ]

  const selectedAction = (selectedItem) => {
    if (selectedItem === null) return ''
    const action = actions.find(item => selectedItem.type === item.type)
    const amount = selectedItem?.amount
    return amount + action.subTitle
  }


  useEffect(() => {
    getTransactions("")
  }, [transactionStatus])

  return (
    <DashboardLayout
      loginRequired
      loading={loading}
      searchFunc={getTransactions}
    >
      <MDButton
        color={transactionStatus === "Pending" ? "primary" : "gray"}
        variant={"text"}
        onClick={() => setTransactionStatus('Pending')}
        sx={{ borderBottom: transactionStatus === "Pending" ? '2px solid #3B88B6' : '2px solid #ffffff', borderRadius: 0, minWidth: 300, fontWeight: 600, marginTop: 3 }}
      >
        PENDING
      </MDButton>
      <MDButton
        color={transactionStatus === "Approved" ? "primary" : "gray"}
        variant={"text"}
        onClick={() => setTransactionStatus('Approved')}
        sx={{borderBottom: transactionStatus === "Approved" ? '2px solid #3B88B6' : '2px solid #ffffff', borderRadius: 0, minWidth: 300, fontWeight: 600, marginTop: 3}}
      >
        FAILED
      </MDButton>
      <MDButton
        color={transactionStatus === "Executed" ? "primary" : "gray"}
        variant={"text"}
        onClick={() => setTransactionStatus('Executed')}
        sx={{borderBottom: transactionStatus === "Executed" ? '2px solid #3B88B6' : '2px solid #ffffff', borderRadius: 0, minWidth: 300, fontWeight: 600, marginTop: 3}}
      >
        EXECUTED
      </MDButton>
      <MDBox sx={{
        width: '100%',
        transition: '0.3s',
        height: 2,
        backgroundColor: '#3B88B6',
      }}/>
      <DataTable
          loading={loading}
          emptyLabelText={'No reconciliation transactions found'}
          table={recordList}
          onColumnOrdering={onColumnOrdering}
          currentPage={currentPage}
          numberOfItems={numberOfItems}
          numberOfItemsPage={numberOfItemsPage}
          onPageChange={page => {
            getTransactions('', page)
            setCurrentPage(page)
          }}
        />
      <ConfirmDialogInputModal
        title={'Supervisor Credentials'}
        description={'Please enter your password to confirm'}
        open={showPrivacyModal}
        handleClose={() => clearDetail()}
        handleConfirm={() => nextStep()}
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
      <ConfirmDialogModal
          title={"Confirm Transaction"}
          description={selectedAction(selectedItem)}
          open={ShowConfirmationModal}
          handleClose={() => clearDetail()}
          handleConfirm={() => confirmAction()}
          confirmText={'Confirm'}
          cancelText={'Cancel'}
      >
      </ConfirmDialogModal>
      <ConfirmDialogModal
          title={"Transaction Latest Error"}
          description={selectedItem && <pre style={{
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word'
          }}
          >{selectedItem.latest_error?.replaceAll(':', '\n')}</pre>}
          open={ShowErrorModal}
          cancelText={'Close'}
          handleClose={() => clearDetail()}
      >
      </ConfirmDialogModal>
    </DashboardLayout>
  )
}

export default TransactionStatus
