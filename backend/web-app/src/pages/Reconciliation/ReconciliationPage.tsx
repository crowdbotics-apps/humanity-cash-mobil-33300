import React, {useEffect, useRef, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Button, Form, Row} from "react-bootstrap";
import AdminPanelContainer from "../../containers";
import InputGroup from "react-bootstrap/InputGroup";
import {SearchIcon} from "../../components/icons";
import AdvancedTable from "../../components/Table/AdvancedTable";
import {useApi, useUserStore} from "../../utils";
import {AmountModal, CredentialsModal, ReconciliationActions, ReconciliationConfirmModal} from "./modals";

import ButtonWithPopover from "../../components/Popover";


const ReconciliationPage: React.FC = observer(() => {

  const [LeftOpen, setLeftOpen] = useState<any>(true);
  //const [RightOpen, setRightOpen] = useState<any>(true);
  const [Items, setItems] = useState<any>([])
  const [TotalItems, setTotalItems] = useState(0)
  const [CurrentAmount, setCurrentAmount] = useState(0)
  const [CurrentRecipient, setCurrentRecipient] = useState("")
  const [CurrentPage, setCurrentPage] = useState(1)
  const [Previous, setPrevious] = useState<string | null>(null)
  const [Next, setNext] = useState<string | null>(null)
  const [ShowPasswordModal, setShowPasswordModal] = useState<boolean>(false)
  const [ShowConfirmationModal, setShowConfirmationModal] = useState<boolean>(false)
  const [ShowAmountModal, setShowAmountModal] = useState<boolean>(false)
  const [CurrentAction, setCurrentAction] = useState<any>({})
  const [supervisorCredential, setSupervisorCredential] = useState("")
  const [profileIsConsumer, setProfileIsConsumer] = useState(false)
  const [profileID, setProfileID] = useState(null)
  const [Documentation, setDocumentation] = useState("Placeholder")
  const dataRefInitialValue = {
    type: '',
    documentation: "Placeholder to fill",
    amount: 0,
    profile_is_consumer: false,
    profile_id: null,
    password: ""
  }
  const dataRef = useRef(dataRefInitialValue)

  const api = useApi()
  const userStore = useUserStore()

  const initializeDataRef = () => {
    setCurrentAmount(0)
    setProfileIsConsumer(false)
    setProfileID(null)
    setSupervisorCredential("")
    setDocumentation("Placeholder")
    dataRef.current = dataRefInitialValue
  }

  const onAddAjustment = () => {
    dataRef.current.type = 'fund_negative'
    api.addAdjustment(dataRef.current)
      .finally(initializeDataRef)
  }

  const onAddAdjustmentAndMint = () => {
    dataRef.current.type = 'burn_from_negative'
    api.addAdjustmentAndMintTokens(dataRef.current)
      .finally(initializeDataRef)
  }


  const onReconcileAndBurn = () => {
    dataRef.current.type = 'mint_to_positive'
    api.reconcileAndBrnTokens(dataRef.current)
      .finally(initializeDataRef)
  }

  const onReconcileAndTransfer = () => {
    dataRef.current.type = 'positive_to_user'
    dataRef.current.profile_is_consumer = profileIsConsumer
    dataRef.current.profile_id = profileID
    api.reconcileAndTransferTokens(dataRef.current)
      .finally(initializeDataRef)
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
    }
  ]


  const COLUMN_TITLES = [
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


  const [ColumnsTitles, setColumnsTitles] = useState(COLUMN_TITLES)

  useEffect(() => {
    console.log(CurrentAmount, profileIsConsumer, profileID, supervisorCredential)
    dataRef.current.amount = CurrentAmount
    dataRef.current.documentation = Documentation
    dataRef.current.profile_is_consumer = profileIsConsumer
    dataRef.current.profile_id = profileID
    dataRef.current.password = supervisorCredential
  }, [CurrentAmount, profileIsConsumer, profileID, supervisorCredential, Documentation])

  useEffect(() => {
    userStore.setUp()
    setItems([{
      title: <div style={{color: "var(--green-dark)", fontWeight: "bold"}}>Today's Date</div>,
      reserve: <div style={{fontWeight: 500, fontSize: "14px"}}>$ 100,000.00</div>,
      negative: <div style={{fontWeight: 500, fontSize: "14px"}}>$ 0.00</div>,
      positive: <div style={{fontWeight: 500, fontSize: "14px"}}>$ 0.00</div>,
    }])

  }, [])

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

  return (
    <AdminPanelContainer
      search={<SearchInput/>}
      onclickFilter={onClickFilter}
      title={"Reconciliation Action"}
      // filter={   <Filter
      //   bank={BankFilter}
      //   support={SupportFilter}
      //   superAdmin={SuperAdminFilter}
      //   apply={applyFilter}
      //   cancel={cancelFilter}
      //   clearAll={clearFilter}/>}
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
                   onClose={() => {
                     setShowAmountModal(false)
                   }}
                   onConfirm={(amount: number) => {
                     setCurrentAmount(amount)
                     setShowAmountModal(false)
                     setShowConfirmationModal(true)
                   }}/>

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
