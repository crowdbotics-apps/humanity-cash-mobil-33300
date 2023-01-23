import DashboardLayout from "../../components/LayoutContainers/DashboardLayout"
import {useEffect, useRef, useState} from "react"
import {money_fmt, showMessage, useApi} from "../../services/helpers"
import {renderTableRow} from "./utils";
import DataTable from "../../components/DataTable";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../services/constants";
import MDButtonPopover from "../../components/MDButtonPopover";
import ConfirmDialogInputModal from "../../components/ConfirmDialogInputModal";
import MDInput from "../../components/MDInput";
import {Autocomplete, CircularProgress, TextField} from "@mui/material";
import {Search} from "@mui/icons-material";

const ReconciliationActions = {
  AddAdjustment: 'AddAdjustment',
  AddAdjustmentAndMint: "AddAdjustmentAndMint",
  RevertAdjustment: "RevertAdjustment",
  ReconcileAndBurn: "ReconcileAndBurn",
  ReconcileAndTransfer: "ReconcileAndTransfer",
  RevertMint: "RevertMint"
}

const initialData = {
  columns: [
    {Header: "", accessor: "title", disableOrdering: true},
    {Header: `RESERVE WALLET`, accessor: "reserve", disableOrdering: true},
    {
      Header: "NEGATIVE ADJUSTMENT ACCOUNT", accessor: "negative", disableOrdering: true,
      component: <MDButtonPopover
        color="primary"
        size={'small'}
        style={{minWidth: 0}}
        actionList={[]}
      >+</MDButtonPopover>
    },
    {
      Header: "POSITIVE ADJUSTMENT", accessor: "positive", disableOrdering: true,
      component: <MDButtonPopover
        color="primary"
        size={'small'}
        style={{minWidth: 0}}
        actionList={[]}
      >+</MDButtonPopover>
    },
  ],
  rows: [{
    title: <div style={{
      color: "var(--green-dark)",
      fontWeight: "bold",
      height: 50,
      alignItems: 'center',
      display: 'flex'
    }}>Today's Date</div>
  }],
};

const ReconciliationActionsPage = () => {
  const api = useApi()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [numberOfItemsPage, setNumberOfItemsPage] = useState(0);
  const [recordList, setRecordList] = useState(initialData)
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
  const [Amount, setAmount] = useState("")

  const selectRecipientRef = useRef(null)
  const [loadingRecipient, setLoadingRecipient] = useState(false);
  const [RecipientList, setRecipientList] = useState([]);
  const [openRecipientList, setOpenRecipientList] = useState(false);


  const resetData = () => {
    setCurrentDocumentation("Placeholder")
    setCurrentAmount(0)
    setCurrentRecipient(null)
    setSupervisorCredential("")
  }

  const getWalletBalances = () => {
    setLoading(true)
    api.getWalletBalances().then((result) => {
      if (result.kind === "ok") {
        let {count, results, humanity, reserve, positive, negative} = result.data
        const tmp = {...dataTableModel}

        results = [{
          title: <div style={{
            color: "var(--green-dark)",
            fontWeight: "bold",
            height: 50,
            alignItems: 'center',
            display: 'flex'
          }}>Today's Date</div>,
          // humanity: <div style={{ fontWeight: 500, fontSize: "14px" }}>{money_fmt(humanity)}</div>,
          reserve: <div style={{fontWeight: 500, fontSize: "14px"}}>{money_fmt(reserve)}</div>,
          negative: <div style={{fontWeight: 500, fontSize: "14px"}}>{money_fmt(negative)}</div>,
          positive: <div style={{fontWeight: 500, fontSize: "14px"}}>{money_fmt(positive)}</div>,
        }]

        tmp.rows = results.map(e => renderTableRow(e, setDetailToShow))
        setRecordList(tmp)
        setNumberOfItems(1)
        setNumberOfItemsPage(results?.length || 0)
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }

  const apiCall = (data) => {
    api.addAdjustment(data)
      .then((result) => {
        if (result.kind === "ok") {
          showMessage('Action executed successfully', 'success')
        } else if (result.kind === "bad-data") {
          const key = Object.keys(result?.errors)[0]
          const msg = `${key}: ${result?.errors?.[key][0]}`
          showMessage(msg)
        }
      })
      .catch(err => showMessage(err))
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
    [ReconciliationActions.ReconcileAndBurn]: {
      title: "Reconcile & Burn Tokens",
      subTitle: "Enter an amount to be burned from the Negative Adjustment Account Wallet.",
      next: onAddAdjustmentAndMint,
      type: 'burn_from_negative',
      confirmTitle: "Confirm Amount",
      selectRecipient: false
    },
    [ReconciliationActions.RevertAdjustment]: {
      title: "Revert Adjustment",
      subTitle: "Enter an amount to revert a previous action (Transfer to reserve wallet).",
      next: onRevertAdjustment,
      type: 'revert_fund_negative',
      confirmTitle: "Confirm Amount",
      selectRecipient: false
    },
    [ReconciliationActions.AddAdjustmentAndMint]: {
      title: "Add Adjustment & Mint Tokens",
      subTitle: "Enter an amount to be minted to the Positive Mint Adjustment Account Wallet.",
      next: onReconcileAndBurn,
      type: 'mint_to_positive',
      confirmTitle: "Confirm Burn",
      selectRecipient: false
    },
    [ReconciliationActions.ReconcileAndTransfer]: {
      title: "Reconcile & Transfer Tokens",
      subTitle: "Enter an amount to be transferred from the Positive Mint Adjustment Account Wallet to the " +
        "Recipient wallet.",
      next: onReconcileAndTransfer,
      type: 'positive_to_user',
      confirmTitle: "Confirm Recipient",
      selectRecipient: true
    },
    [ReconciliationActions.RevertMint]: {
      title: "Revert Adjustment & Burn Tokens",
      subTitle: "Burn tokens from positive wallet to revert previous action.",
      next: onRevertMint,
      type: 'revert_mint_to_positive',
      confirmTitle: "Confirm Amount",
      selectRecipient: false
    },
  }

  const negativeActionList = [
    {
      label: actions[ReconciliationActions.AddAdjustment].title,
      action: () => {
        setCurrentAction(actions[ReconciliationActions.AddAdjustment])
        setShowPasswordModal(true)
      },
      disabled: false
    },
    {
      label: actions[ReconciliationActions.ReconcileAndBurn].title,
      action: () => {
        setCurrentAction(actions[ReconciliationActions.ReconcileAndBurn])
        setShowPasswordModal(true)
      },
      disabled: false
    },
    {
      label: actions[ReconciliationActions.RevertAdjustment].title,
      action: () => {
        setCurrentAction(actions[ReconciliationActions.RevertAdjustment])
        setShowPasswordModal(true)
      },
      disabled: false
    }
  ]
  const positiveActionList = [
    {
      label: actions[ReconciliationActions.AddAdjustmentAndMint].title,
      action: () => {
        setCurrentAction(actions[ReconciliationActions.AddAdjustmentAndMint])
        setShowPasswordModal(true)
      },
      disabled: false
    },
    {
      label: actions[ReconciliationActions.ReconcileAndTransfer].title,
      action: () => {
        setCurrentAction(actions[ReconciliationActions.ReconcileAndTransfer])
        setShowPasswordModal(true)
      },
      disabled: false
    },
    {
      label: actions[ReconciliationActions.RevertMint].title,
      action: () => {
        setCurrentAction(actions[ReconciliationActions.RevertMint])
        setShowPasswordModal(true)
      },
      disabled: false
    }
  ]

  const dataTableModel = {
    columns: [
      {Header: "", accessor: "title", disableOrdering: true},
      {Header: `RESERVE WALLET`, accessor: "reserve", disableOrdering: true},
      {
        Header: "NEGATIVE ADJUSTMENT ACCOUNT", accessor: "negative", disableOrdering: true,
        component: <MDButtonPopover
          color="primary"
          size={'small'}
          style={{minWidth: 0}}
          actionList={negativeActionList}
        >+</MDButtonPopover>
      },
      {
        Header: "POSITIVE ADJUSTMENT", accessor: "positive", disableOrdering: true,
        component: <MDButtonPopover
          color="primary"
          size={'small'}
          style={{minWidth: 0}}
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
    if (Amount > 0) {
      setCurrentAmount(Amount)
    }
    if (recipient) {
      setCurrentRecipient(recipient)
    }
    setShowAmountModal(false)
    setShowConfirmationModal(true)
  }

  const getRecipientList = () => {
    if (loadingRecipient) {
      return
    }
    setLoadingRecipient(true)
    let data = {}
    if (selectRecipientRef.current.value !== "") {
      data.search = selectRecipientRef.current.value
    }
    api.getComplianceRecipient(data).then(res => {
      if (res.kind === 'ok') {
        setRecipientList(res.data.results)
      } else {
        console.log("Error, please put the corresponding alert message")
      }
    }).finally(() => setLoadingRecipient(false))
  }

  useEffect(()=> {
    console.log("Recipient", CurrentRecipient)
  }, [CurrentRecipient])

  useEffect(() => {
    setLoadingRecipient(false)
    getWalletBalances()
  }, [])

  return (
    <DashboardLayout
      loginRequired
    >
      <DataTable
        table={recordList}
        showTotalEntries={false}
      />
      {/* PASS MODAL */}
      <ConfirmDialogInputModal
        title={'Supervisor Credentials'}
        description={'Enter your credentials to confirm'}
        open={ShowPasswordModal}
        handleClose={() => setShowPasswordModal(false)}
        disabledConfirm={!Password || Password === ''}
        handleConfirm={() => {
          setSupervisorCredential(Password)
          setShowPasswordModal(false)
          setShowAmountModal(true)
        }}
      >
        <MDInput
          type="password"
          label="PASSWORD"
          variant="outlined"
          fullWidth
          password
          placeholder="input your password"
          value={Password}
          onChange={(evt) => setPassword(evt.target.value)}
        />
      </ConfirmDialogInputModal>
      {/*  */}
      {/* AMOUNT MODAL */}
      <ConfirmDialogInputModal
        title={CurrentAction.title}
        description={CurrentAction.subTitle}
        open={ShowAmountModal}
        disabledConfirm={!Amount || Amount === ''}
        handleClose={() => setShowAmountModal(false)}
        handleConfirm={() => onConfirmAmountModal(Amount)}
      >
        {CurrentAction.selectRecipient &&
          <Autocomplete
            open={openRecipientList}
            onOpen={() => {
              getRecipientList()
              setOpenRecipientList(true);
            }}
            onClose={() => {
              setOpenRecipientList(false);
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.label}
            options={RecipientList}
            loading={loading}
            onChange={(event, value) => {
              setCurrentRecipient(value)
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                inputRef={selectRecipientRef}
                label="SELECT RECIPIENT"
                sx={{
                  marginBottom: '24px',
                  backgroundColor: 'transparent',
                  pointerEvents: "auto",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: '#D59B76',
                    borderWidth: 2
                  },
                  "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderColor: '#D59B76',
                    borderWidth: 2
                  },
                  "&:hover .MuiOutlinedInput-input": {
                    borderColor: '#D59B76',
                    borderWidth: 2,
                  },
                  "& .MuiOutlinedInput-input": {
                    height: '12px'
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#D59B76",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#666666",
                    fontSize: 16,
                    fontWeight: 700,
                  },
                  ".MuiAutocomplete-endAdornment": {
                    display: 'none',
                  },
                  ".MuiInputBase-root": {
                    paddingRight: '12px!important',
                  },
                }
                }
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingRecipient ?
                        <CircularProgress size={20} color="primary"/> :
                        <Search fontSize={"medium"}/>
                      }
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        }
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
        description={CurrentAction.selectRecipient ? CurrentRecipient?.label : `${money_fmt(Amount)}`}
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
