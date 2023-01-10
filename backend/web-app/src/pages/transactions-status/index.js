import DashboardLayout from "../../components/LayoutContainers/DashboardLayout"
import {useEffect, useRef, useState} from "react"
import {showMessage, useApi} from "../../services/helpers"
import {dataTableModel, renderTableRow} from "./utils";
import DataTable from "../../components/DataTable";
import ConfirmDialogInputModal from "../../components/ConfirmDialogInputModal";
import MDInput from "../../components/MDInput";
import MDButton from "../../components/MDButton";
import MDBox from "../../components/MDBox";


const TransactionStatus = () => {
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
      } else if (result.kind === "bad-data") {
        showMessage(result?.errors)
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
      subTitle: ` to be minted to the Positive Mint Adjustment Account Wallet.`,
      type: 'burn_from_negative',
    },
    {
      subTitle: ` to revert a previous action`,
      type: 'revert_fund_negative',
    },
    {
      subTitle: `  to be burned from the Negative Adjustment Account Wallet.`,
      type: 'mint_to_positive',
    },
    {
      subTitle: `  to be transferred from the Positive Mint Adjustment Account Wallet to the Recipient wallet.`,
      type: 'positive_to_user',
    },
    {
      subTitle: ` burn to revert previous action`,
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
      <MDButton color={transactionStatus === "Pending" ? "primary" : "secondary"} variant={"text"} onClick={() => setTransactionStatus('Pending')}>PENDING</MDButton>
      <MDButton color={transactionStatus === "Approved" ? "primary" : "secondary"}  variant={"text"} onClick={() => setTransactionStatus('Approved')}>APPROVED</MDButton>
      <MDButton color={transactionStatus === "Executed" ? "primary" : "secondary"}  variant={"text"} onClick={() => setTransactionStatus('Executed')}>EXECUTED</MDButton>
      <MDBox sx={{
        width: '100%',
        transition: '0.3s',
        height: 2,
        backgroundColor: '#3B88B6',
      }}/>
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
        : <p style={{display: 'flex', height: '55vh', justifyContent: 'center', alignItems: 'center', fontSize: 20}}>No
          transactions found</p>
      }
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
      <ConfirmDialogInputModal
        title={"Confirm Transaction"}
        description={selectedAction(selectedItem)}
        open={ShowConfirmationModal}
        handleClose={() => clearDetail()}
        handleConfirm={() => confirmAction()}
      >
      </ConfirmDialogInputModal>
    </DashboardLayout>
  )
}

export default TransactionStatus
