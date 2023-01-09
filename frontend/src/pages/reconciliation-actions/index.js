import DashboardLayout from "../../components/LayoutContainers/DashboardLayout"
import { useEffect, useRef, useState } from "react"
import { showMessage, useApi } from "../../services/helpers"
import { renderTableRow } from "./utils";
import DataTable from "../../components/DataTable";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../services/constants";
import MDButtonPopover from "../../components/MDButtonPopover";
import ConfirmDialogInputModal from "../../components/ConfirmDialogInputModal";
import MDInput from "../../components/MDInput";

const ReconciliationActions = {
  AddAdjustment: 'AddAdjustment',
  AddAdjustmentAndMint: "AddAdjustmentAndMint",
  RevertAdjustment: "RevertAdjustment",
  ReconcileAndBurn: "ReconcileAndBurn",
  ReconcileAndTransfer: "ReconcileAndTransfer",
  RevertMint: "RevertMint"
}

const ReconciliationActionsPage = () => {
  const api = useApi()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [numberOfItemsPage, setNumberOfItemsPage] = useState(0);
  const [recordList, setRecordList] = useState({})
  const searchQueryRef = useRef("");

  const [CurrentAction, setCurrentAction] = useState({})
  const [ShowPasswordModal, setShowPasswordModal] = useState(false)
  const [ShowAmountModal, setShowAmountModal] = useState(false)
  const [ShowConfirmationModal, setShowConfirmationModal] = useState(false)

  const [CurrentDocumentation, setCurrentDocumentation] = useState("Placeholder")
  const [CurrentAmount, setCurrentAmount] = useState(0)
  const [CurrentRecipient, setCurrentRecipient] = useState(null)
  const [supervisorCredential, setSupervisorCredential] = useState(null)

  const [Password, setPassword] = useState("")
  const [Password2, setPassword2] = useState("")
  const [Amount, setAmount] = useState("")


  const resetData = () => {
    setCurrentDocumentation("Placeholder")
    setCurrentAmount(0)
    setCurrentRecipient(null)
    setSupervisorCredential("")
  }

  const getAdjustments = (searchData, page = 1, ordering = "asc") => {
    setLoading(true)
    api.getAdjustment(searchData, page, ordering, 8).then((result) => {
      console.log(' result -> ', result)
      if (result.kind === "ok") {
        const { count, results } = result.data
        const tmp = { ...dataTableModel }
        tmp.rows = [{
          title: <div style={{ color: "var(--green-dark)", fontWeight: "bold" }}>Today's Date</div>,
          reserve: <div style={{ fontWeight: 500, fontSize: "14px" }}>$ 100,000.00</div>,
          negative: <div style={{ fontWeight: 500, fontSize: "14px" }}>$ 0.00</div>,
          positive: <div style={{ fontWeight: 500, fontSize: "14px" }}>$ 0.00</div>,
        }].map(e => renderTableRow(e, setDetailToShow))
        setRecordList(tmp)
        setNumberOfItems(count)
        setNumberOfItemsPage(results?.length || 0)
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }
  const onColumnOrdering = (ordering) => {
    const { column, order } = ordering
    if (column === '') {
      getAdjustments(searchQueryRef?.current)
    } else if (order === 'asce') {
      getAdjustments(searchQueryRef?.current, 1, `${column}`)
    } else {
      getAdjustments(searchQueryRef?.current, 1, `-${column}`)
    }
  }

  const apiCall = (data) => {
    api.addAdjustment(data)
      .then(showMessage)
      .finally(resetData)
  }

  const onAddAjustment = (data) => {
    apiCall(data)
  }
  const onAddAdjustmentAndMint = (data) => {
    apiCall(data)
  }
  const onRevertAdjustment = (data) => {
    apiCall(data)
  }
  const onReconcileAndBurn = (data) => {
    apiCall(data)
  }
  const onReconcileAndTransfer = (data) => {
    apiCall(data)
  }
  const onRevertMint = (data) => {
    apiCall(data)
  }

  const onReconciliationConfirm = () => {
    setShowConfirmationModal(false)
    const data = {
      type: CurrentAction.type,
      documentation: CurrentDocumentation,
      amount: CurrentAmount,
      profile_is_consumer: CurrentRecipient ? CurrentRecipient.is_consumer : false,
      profile_id: CurrentRecipient ? CurrentRecipient.id : null,
      password: supervisorCredential
    }
    CurrentAction.next(data)
  }

  const actions = {
    [ReconciliationActions.AddAdjustment]: {
      title: "Add Adjustment",
      subTitle: "Enter an amount to be transferred from the Reserve Wallet to the Negative Mint Adjustment Account Wallet.",
      next: onAddAjustment,
      type: 'fund_negative',
      confirmTitle: "Confirm Amount",
      selectRecipient: false
    },
    [ReconciliationActions.AddAdjustmentAndMint]: {
      title: "Add Adjustment",
      subTitle: "Enter an amount to be minted to the Positive Mint Adjustment Account Wallet.",
      next: onAddAdjustmentAndMint,
      type: 'burn_from_negative',
      confirmTitle: "Confirm Amount",
      selectRecipient: false
    },
    [ReconciliationActions.RevertAdjustment]: {
      title: "Revert Adjustment",
      subTitle: "Enter an amount to revert a previous action",
      next: onRevertAdjustment,
      type: 'revert_fund_negative',
      confirmTitle: "Confirm Amount",
      selectRecipient: false
    },
    [ReconciliationActions.ReconcileAndBurn]: {
      title: "Reconcile and burn Tokens",
      subTitle: "Enter an amount to be burned from the Negative Adjustment Account Wallet.",
      next: onReconcileAndBurn,
      type: 'mint_to_positive',
      confirmTitle: "Confirm Burn",
      selectRecipient: false
    },
    [ReconciliationActions.ReconcileAndTransfer]: {
      title: "Transfer funds",
      subTitle: "Enter an amount to be transferred from the Positive Mint Adjustment Account Wallet to the " +
        "Recipient wallet.",
      next: onReconcileAndTransfer,
      type: 'positive_to_user',
      confirmTitle: "Confirm Recipient",
      selectRecipient: true
    },
    [ReconciliationActions.RevertMint]: {
      title: "Revert Mint",
      subTitle: "Burn tokens to revert previous action",
      next: onRevertMint,
      type: 'revert_mint_to_positive',
      confirmTitle: "Confirm Recipient",
      selectRecipient: false
    },
  }

  const negativeActionList = [
    {
      label: "Add Adjustment",
      action: () => {
        setCurrentAction(actions[ReconciliationActions.AddAdjustment])
        setShowPasswordModal(true)
      },
      disabled: false
    },
    {
      label: "Reconcile & Burn Tokens",
      action: () => {
        setCurrentAction(actions[ReconciliationActions.ReconcileAndBurn])
        setShowPasswordModal(true)
      },
      disabled: false
    },
    {
      label: "Revert Adjustment",
      action: () => {
        setCurrentAction(actions[ReconciliationActions.RevertAdjustment])
        setShowPasswordModal(true)
      },
      disabled: false
    }
  ]
  const positiveActionList = [
    {
      label: "Add Adjustment & Mint Tokens",
      action: () => {
        setCurrentAction(actions[ReconciliationActions.AddAdjustmentAndMint])
        setShowPasswordModal(true)
      },
      disabled: false
    },
    {
      label: "Reconcile & Transfer Tokens",
      action: () => {
        setCurrentAction(actions[ReconciliationActions.ReconcileAndTransfer])
        setShowPasswordModal(true)
      },
      disabled: false
    },
    {
      label: "Revert Adjustment & Burn Tokens",
      action: () => {
        setCurrentAction(actions[ReconciliationActions.RevertMint])
        setShowPasswordModal(true)
      },
      disabled: false
    }
  ]

  const dataTableModel = {
    columns: [
      { Header: "", accessor: "title", disableOrdering: true },
      { Header: `RESERVE WALLET`, accessor: "reserve", align: 'center', disableOrdering: true },
      {
        Header: "NEGATIVE ADJUSTMENT ACCOUNT", accessor: "negative", disableOrdering: true,
        component: <MDButtonPopover
          color="primary"
          size={'small'}
          style={{ minWidth: 0 }}
          actionList={negativeActionList}
        >+</MDButtonPopover>
      },
      {
        Header: "POSITIVE ADJUSTMENT", accessor: "positive", disableOrdering: true,
        component: <MDButtonPopover
          color="primary"
          size={'small'}
          style={{ minWidth: 0 }}
          actionList={positiveActionList}
        >+</MDButtonPopover>
      },
    ],
    rows: [],
  };

  const setDetailToShow = (item) => {
    navigate(ROUTES.BLOCKCHAIN_TRANSACTION(item.id))
  }

  const onConfirmAmountModal = (Amount, recipient) => {
    console.log(' aca estoy ', Amount, recipient)
    if (Amount > 0) {
      setCurrentAmount(Amount)
    }
    if (recipient) {
      setCurrentRecipient(recipient)
    }
    setShowAmountModal(false)
    setShowConfirmationModal(true)
  }

  useEffect(() => {
    getAdjustments("")
  }, [])

  return (
    <DashboardLayout
      loginRequired
      loading={loading}
      searchFunc={getAdjustments}
    >
      {recordList?.rows?.length > 0
        ? (<DataTable
          table={recordList}
          onColumnOrdering={onColumnOrdering}
          currentPage={currentPage}
          numberOfItems={numberOfItems}
          numberOfItemsPage={numberOfItemsPage}
          pageSize={8}
          onPageChange={page => {
            getAdjustments('', page)
            setCurrentPage(page)
          }}
        />)
        : <p style={{ display: 'flex', height: '55vh', justifyContent: 'center', alignItems: 'center', fontSize: 20 }}>No
          blockchain transactions found</p>
      }
      {/* PASS MODAL */}
      <ConfirmDialogInputModal
        title={'Supervisor Credentials'}
        description={'Enter your credentials to confirm'}
        open={ShowPasswordModal}
        handleClose={() => setShowPasswordModal(false)}
        handleConfirm={() => {
          setSupervisorCredential('asd')
          setShowPasswordModal(false)
          setShowAmountModal(true)
        }}
      >
        <MDInput
          type="password"
          label="PASSWORD 1"
          variant="outlined"
          fullWidth
          password
          placeholder="input your password 1"
          value={Password}
          onChange={(evt) => setPassword(evt.target.value)}
        />
        <MDInput
          type="password"
          label="PASSWORD 1"
          variant="outlined"
          fullWidth
          password
          placeholder="input your password 2"
          value={Password2}
          onChange={(evt) => setPassword2(evt.target.value)}
        />
      </ConfirmDialogInputModal>
      {/*  */}
      {/* AMOUNT MODAL */}
      <ConfirmDialogInputModal
        title={CurrentAction.title}
        description={CurrentAction.subTitle}
        open={ShowAmountModal}
        handleClose={() => setShowAmountModal(false)}
        handleConfirm={() => onConfirmAmountModal(Amount)}
      >
        <MDInput
          type="number"
          label="ENTER AMOUNT"
          variant="outlined"
          fullWidth
          placeholder="input the amount"
          value={Amount}
          onChange={(evt) => setAmount(evt.target.value)}
        />
      </ConfirmDialogInputModal>
      {/*  */}
      {/* CONFIRMATION MODAL */}
      <ConfirmDialogInputModal
        title={CurrentAction.confirmTitle}
        description={CurrentAction.selectRecipient ? "John Doe Wallet address 0xasdf234asdf0234" : `${Amount}`}
        open={ShowConfirmationModal}
        handleClose={() => setShowConfirmationModal(false)}
        handleConfirm={onReconciliationConfirm}
      >

      </ConfirmDialogInputModal>
      {/*  */}
    </DashboardLayout>
  )
}

export default ReconciliationActionsPage
