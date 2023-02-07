import React, {useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Button, Form, Row} from "react-bootstrap";
import AdminPanelContainer from "../../containers";
import InputGroup from "react-bootstrap/InputGroup";
import {SearchIcon} from "../../components/icons";
import AdvancedTable from "../../components/Table/AdvancedTable";
import {useApi, useUserStore} from "../../utils";
import {AmountModal, CredentialsModal, ReconciliationActions, ReconciliationConfirmModal} from "./modals";
import ButtonWithPopover from "../../components/Popover";

export type RecipientType = {
  id: number,
  label: string,
  is_consumer: boolean
}

type apiSendData = {
  type: string,
  documentation: string,
  amount: number,
  profile_is_consumer: boolean,
  profile_id: number | null,
  password: string | null
}

const ReconciliationPage: React.FC = observer(() => {
  const resetData = () => {
    setCurrentDocumentation("Placeholder")
    setCurrentAmount(0)
    setCurrentRecipient(null)
    setSupervisorCredential("")
  }
  const showMessage = (res: any) => {
    if (res.kind === 'ok') {
      alert("Success")
      
    } else {
      alert("Some error occurred")
    }
  }
  const searchFn = (searchText: any) => {
    return api.getRecipients(searchText)
  }
  const onClickFilter = () => {
  }
  const onClickPage = (page: number) => {
    
    setCurrentPage(page)
  }
  const onPreviousPage = () => {
    
    if (Previous) {
      setCurrentPage(prevState => prevState - 1)
    }
  }
  const onNextPage = () => {
    
    if (Next) {
      setCurrentPage(prevState => prevState + 1)
    }
  }
  const SearchInput = () => {
    return (
      <InputGroup className="mb-0 search-button-group">
        <Button variant="outline-secondary" id="button-addon2" className='search-buttons'>
          <SearchIcon/>
        </Button>
        <Form.Control
          placeholder='Search'
          type="search" name="search" className='search-button-navbar'
        />
      </InputGroup>)
  }
  const onSubmit = () => {
    
  }
  const handleClose = () => {
    
    setShowPasswordModal(false)
  }
  const [Items, setItems] = useState<any>([])
  const [TotalItems, setTotalItems] = useState<number>(0)
  const [CurrentDocumentation, setCurrentDocumentation] = useState<string>("Placeholder")
  const [CurrentAmount, setCurrentAmount] = useState<number>(0)
  const [CurrentRecipient, setCurrentRecipient] = useState<RecipientType | null>(null)
  const [supervisorCredential, setSupervisorCredential] = useState<string | null>(null)
  const [CurrentPage, setCurrentPage] = useState<number>(1)
  const [Previous, setPrevious] = useState<string | null>(null)
  const [Next, setNext] = useState<string | null>(null)
  const [ShowPasswordModal, setShowPasswordModal] = useState<boolean>(false)
  const [ShowConfirmationModal, setShowConfirmationModal] = useState<boolean>(false)
  const [ShowAmountModal, setShowAmountModal] = useState<boolean>(false)
  const [CurrentAction, setCurrentAction] = useState<any>({})
  const api = useApi()
  const userStore = useUserStore()

  // API calls
  const apiCall = (data: apiSendData) => {
    api.addCompliance(data)
      .then(showMessage)
      .finally(resetData)
  }

  const onAddAjustment = (data: apiSendData) => {
    apiCall(data)
  }
  const onAddAdjustmentAndMint = (data: apiSendData) => {
    apiCall(data)
  }
  const onRevertAdjustment = (data: apiSendData) => {
    apiCall(data)
  }
  const onReconcileAndBurn = (data: apiSendData) => {
    apiCall(data)
  }
  const onReconcileAndTransfer = (data: apiSendData) => {
    apiCall(data)
  }
  const onRevertMint = (data: apiSendData) => {
    apiCall(data)
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
    [ReconciliationActions.ReconcileAndBurn]: {
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
      title: "Revert Mint (Burn).",
      subTitle: "Burn tokens from positive wallet to revert previous action.",
      next: onRevertMint,
      type: 'revert_mint_to_positive',
      confirmTitle: "Confirm Amount",
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
  const ColumnsTitles = [
    '',
    'RESERVE WALLET',
    (<div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
      <div>NEGATIVE ADJUSTMENT ACCOUNT</div>
      <div style={{marginLeft: "10px"}}>
        <ButtonWithPopover actionList={negativeActionList}>+</ButtonWithPopover>
      </div>
    </div>),
    (<div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
      <div>POSITIVE ADJUSTMENT</div>
      <div style={{marginLeft: "10px"}}>
        <ButtonWithPopover actionList={positiveActionList}>+</ButtonWithPopover>
      </div>
    </div>)]

  const onConfirmAmountModal = (amount: number, recipient?: any) => {
    if (amount > 0) {
      setCurrentAmount(amount)
    }
    if (recipient) {
      setCurrentRecipient(recipient)
    }
    setShowAmountModal(false)
    setShowConfirmationModal(true)
  }

  const onReconciliationConfirm = () => {
    setShowConfirmationModal(false)
    const data: apiSendData = {
      type: CurrentAction.type,
      documentation: CurrentDocumentation,
      amount: CurrentAmount,
      profile_is_consumer: CurrentRecipient ? CurrentRecipient.is_consumer : false,
      profile_id: CurrentRecipient ? CurrentRecipient.id : null,
      password: supervisorCredential
    }
    CurrentAction.next(data)
  }

  const getBalance = () => {
    userStore.environment.api.getBalances().then((res:any) => {
      if (res.kind === 'ok') {
        setItems([{
          title: <div style={{color: "var(--green-dark)", fontWeight: "bold"}}>Today's Date</div>,
          reserve: <div style={{fontWeight: 500, fontSize: "14px"}}>
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(res.data.reserve)}
          </div>,
          negative: <div style={{fontWeight: 500, fontSize: "14px"}}>
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(res.data.negative)}
          </div>,
          positive: <div style={{fontWeight: 500, fontSize: "14px"}}>
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(res.data.positive)}
          </div>,
        }])
      } else {
        
      }
    })
  }

  useEffect(() => {
    userStore.setUp()
    getBalance()
  }, [])

  return (
    <AdminPanelContainer
      search={<SearchInput/>}
      onclickFilter={onClickFilter}
      title={"Reconciliation Action"}
      navbarTitle={""}
    >
      <Row className={'main-row'}>
        <div className='content'>
          <AdvancedTable
            onClickPage={onClickPage}
            currentPage={CurrentPage}
            totalItems={TotalItems}
            headerRow={ColumnsTitles}
            deletable={true}
            paginate={false}
            rows={Items}
            onNext={onNextPage}
            onPrevious={onPreviousPage}/>
        </div>
      </Row>

      <CredentialsModal showModal={ShowPasswordModal}
                        onClose={() => setShowPasswordModal(false)}
                        onConfirm={(password: string) => {
                          setSupervisorCredential(password)
                          setShowPasswordModal(false)
                          setShowAmountModal(true)
                        }}/>

      <AmountModal showModal={ShowAmountModal}
                   title={CurrentAction.title}
                   selectRecipient={CurrentAction.selectRecipient}
                   subTitle={CurrentAction.subTitle}
                   searchFn={searchFn}
                   onClose={() => {
                     setShowAmountModal(false)
                   }}
                   onConfirm={onConfirmAmountModal}/>

      <ReconciliationConfirmModal
        showModal={ShowConfirmationModal}
        title={CurrentAction.confirmTitle}
        extraText={CurrentAction.selectRecipient ? "John Doe Wallet address 0xasdf234asdf0234" : ""}
        amount={CurrentAmount}
        onConfirm={onReconciliationConfirm}
        onClose={() => {
          setShowConfirmationModal(false)
        }}
      />
    </AdminPanelContainer>
  )
})

export default ReconciliationPage;
