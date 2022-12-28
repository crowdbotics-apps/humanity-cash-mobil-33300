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

type RecipientType = {
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
      console.log("res", res)
    } else {
      alert("Some error occurred")
    }
  }
  const searchFn = (searchText: any) => {
    api.getRecipients(searchText).then(res => {
      if (res.kind === 'ok') {
        const {results}: any = res.data;
        setRecipientsList(results)
      } else {
        console.log("There were problems")
      }
    }).catch(reason => console.log(reason))
  }
  const onClickFilter = () => {
  }
  const onClickPage = (page: number) => {
    console.log("onclick page", page)
    setCurrentPage(page)
  }
  const onPreviousPage = () => {
    console.log("onPreviousPage page", Previous)
    if (Previous) {
      setCurrentPage(prevState => prevState - 1)
    }
  }
  const onNextPage = () => {
    console.log("onNextPage page", Next)
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
    console.log("onsubmit")
  }
  const handleClose = () => {
    console.log("handle close")
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
  const [RecipientsList, setRecipientsList] = useState<RecipientType[]>([])
  const api = useApi()
  const userStore = useUserStore()

  // API calls
  const onAddAjustment = () => {
    const data: apiSendData = {
      type: 'fund_negative',
      documentation: CurrentDocumentation,
      amount: CurrentAmount,
      profile_is_consumer: CurrentRecipient ? CurrentRecipient.is_consumer : false,
      profile_id: CurrentRecipient ? CurrentRecipient.id : null,
      password: supervisorCredential
    }
    api.addAdjustment(data)
      .then(showMessage)
      .finally(resetData)
  }
  const onAddAdjustmentAndMint = () => {
    const data: apiSendData = {
      type: 'burn_from_negative',
      documentation: CurrentDocumentation,
      amount: CurrentAmount,
      profile_is_consumer: CurrentRecipient ? CurrentRecipient.is_consumer : false,
      profile_id: CurrentRecipient ? CurrentRecipient.id : null,
      password: supervisorCredential
    }
    api.addAdjustmentAndMintTokens(data)
      .then(showMessage)
      .finally(resetData)
  }
  const onReconcileAndBurn = () => {
    const data: apiSendData = {
      type: 'mint_to_positive',
      documentation: CurrentDocumentation,
      amount: CurrentAmount,
      profile_is_consumer: CurrentRecipient ? CurrentRecipient.is_consumer : false,
      profile_id: CurrentRecipient ? CurrentRecipient.id : null,
      password: supervisorCredential
    }
    api.reconcileAndBrnTokens(data)
      .then(showMessage)
      .finally(resetData)
  }
  const onReconcileAndTransfer = () => {
    const data: apiSendData = {
      type: 'positive_to_user',
      documentation: CurrentDocumentation,
      amount: CurrentAmount,
      profile_is_consumer: CurrentRecipient ? CurrentRecipient.is_consumer : false,
      profile_id: CurrentRecipient ? CurrentRecipient.id : null,
      password: supervisorCredential
    }
    api.reconcileAndTransferTokens(data)
      .then(showMessage)
      .finally(resetData)
  }

  const actions = {
    [ReconciliationActions.AddAdjustment]: {
      title: "Add Adjustment",
      subTitle: "Enter an amount to be transferred from the Reserve Wallet to the Negative Mint Adjustment Account Wallet.",
      next: onAddAjustment,
      confirmTitle: "Confirm Amount",
      selectRecipient: false
    },
    [ReconciliationActions.AddAdjustmentAndMint]: {
      title: "Add Adjustment",
      subTitle: "Enter an amount to be minted to the Positive Mint Adjustment Account Wallet.",
      next: onAddAdjustmentAndMint,
      confirmTitle: "Confirm Amount",
      selectRecipient: false
    },
    [ReconciliationActions.ReconcileAndBurn]: {
      title: "Reconcile and burn Tokens",
      subTitle: "Enter an amount to be burned from the Negative Adjustment Account Wallet.",
      next: onReconcileAndBurn,
      confirmTitle: "Confirm Burn",
      selectRecipient: false
    },
    [ReconciliationActions.ReconcileAndTransfer]: {
      title: "Transfer funds",
      subTitle: "Enter an amount to be transferred from the Positive Mint Adjustment Account Wallet to the " +
        "Recipient wallet.",
      next: onReconcileAndTransfer,
      confirmTitle: "Confirm Recipient",
      selectRecipient: true
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
        alert("Revert Adjustment")
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
        alert("Burn Tokens")
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

  useEffect(() => {
    userStore.setUp()
    setItems([{
      title: <div style={{color: "var(--green-dark)", fontWeight: "bold"}}>Today's Date</div>,
      reserve: <div style={{fontWeight: 500, fontSize: "14px"}}>$ 100,000.00</div>,
      negative: <div style={{fontWeight: 500, fontSize: "14px"}}>$ 0.00</div>,
      positive: <div style={{fontWeight: 500, fontSize: "14px"}}>$ 0.00</div>,
    }])
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
                   results={RecipientsList}
                   onClose={() => {
                     setShowAmountModal(false)
                   }}
                   onConfirm={onConfirmAmountModal}/>

      <ReconciliationConfirmModal
        showModal={ShowConfirmationModal}
        title={CurrentAction.confirmTitle}
        extraText={CurrentAction.selectRecipient ? "John Doe Wallet address 0xasdf234asdf0234" : ""}
        amount={CurrentAmount}
        onConfirm={() => {
          setShowConfirmationModal(false)
          CurrentAction.next()
        }}
        onClose={() => {
          setShowConfirmationModal(false)
        }}
      />
    </AdminPanelContainer>
  )
})

export default ReconciliationPage;
