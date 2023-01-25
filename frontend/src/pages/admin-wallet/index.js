import DashboardLayout from "../../components/LayoutContainers/DashboardLayout"
import React, {useEffect, useRef, useState} from "react"
import {money_fmt, showMessage, useApi} from "../../services/helpers"
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import Icon from "@mui/material/Icon";
import MDButton from "../../components/MDButton";
import ConfirmDialogInputModal from "../../components/ConfirmDialogInputModal";
import {Search} from "@mui/icons-material";
import {CircularProgress, Grid, Input} from "@mui/material";
import MDAvatar from "../../components/MDAvatar";
import * as Yup from "yup";
import {Field, Form, Formik} from "formik";
import MDInput from "../../components/MDInput";
import ConfirmDialogModal from "../../components/ConfirmDialogModal";


const AdminWalletControl = () => {
  const api = useApi()
  const formikRef = useRef();
  const [loading, setLoading] = useState(false)
  const [showRecipientModal, setShowRecipientModal] = useState(false)
  const [showLinkBankModal, setShowLinkBankModal] = useState(false)
  const [showChangeRecipientModal, setShowChangeRecipientModal] = useState(false)
  const [showChangeBankAccountModal, setShowChangeBankAccountModal] = useState(false)
  const [showAmountModal, setShowAmountModal] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [communityAmount, setCommunityAmount] = useState(0)
  const [humanityAmount, setHumanityAmount] = useState(0)
  const [recipientSection, setRecipientSection] = useState('people')
  const [actionListModal, setActionListModal] = useState('recipient')
  const [usersPeople, setUsersPeople] = useState([])
  const [usersBusiness, setUsersBusiness] = useState([])
  const [searchedUsers, setSearchedUsers] = useState([])
  const [searchBarText, setSearchBarText] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedFormData, setSelectedFormData] = useState(null)
  const [amount, setAmount] = useState('')

  const getWalletBalances = () => {
    setLoading(true)
    api.getWalletBalances().then((result) => {
      if (result.kind === "ok") {
        let {community, humanity} = result.data
        setCommunityAmount(community)
        setHumanityAmount(humanity)
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }

  const getDwollaUsers = (searchData, page = 1, ordering = "") => {
    setLoading(true)
    api.getDwollaUsers(searchData, page, ordering, 100000).then((result) => {
      if (result.kind === "ok") {
        const {results} = result.data
        setUsersBusiness(results.filter(user => user.account_type === 'BUSINESS'))
        const people_result = results.filter(user => user.account_type === 'PERSONAL')
        setUsersPeople(people_result)
        setSearchedUsers(people_result)
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }

  const clearModalsAction = () => {
    setShowRecipientModal(false)
    setSelectedUser(null)
    setSelectedFormData(null)
    setShowChangeRecipientModal(false)
    setShowChangeBankAccountModal(false)
    setShowLinkBankModal(false)
    setShowAmountModal(false)
    setShowConfirmationModal(false)
    setAmount('')
  }

  const confirmSelectedRecipient = () => {
    setShowChangeBankAccountModal(true)
  }

  const confirmActionSelectRecipient = () => {
    const data = {...selectedUser}
    showMessage('Recipient updated successfully', 'success')
    clearModalsAction()
  }

  const confirmActionLinkBankAccount = () => {
    const data = {...selectedFormData}
    showMessage('Bank account updated successfully', 'success')
    clearModalsAction()
  }

  const confirmAmountAction = () => {
    const data = {...selectedUser, amount}
    showMessage('Money transferred successfully', 'success')
    clearModalsAction()
  }


  const searchFriendInContacts = () => {
    let usersFilter
    if (recipientSection === 'people') {
      usersFilter = [...usersPeople]
    } else {
      usersFilter = [...usersBusiness]
    }
    const result = usersFilter.filter(obj => {
      const lowerCaseName = obj.username.toLowerCase()
      return lowerCaseName.includes(searchBarText.toLowerCase())
    })
    setSearchedUsers(result)
  }


  const validationSchema =
    Yup.object().shape({
      name: Yup.string().required(),
      routing_number: Yup.string().required('Routing number is a required field'),
      account_number: Yup.string().required('Account number is a required field'),
    })

  const initialValues = {
    name: "",
    routing_number: "",
    account_number: "",
  };


  useEffect(() => {
    searchFriendInContacts()
  }, [searchBarText])

  useEffect(() => {
    if (recipientSection === 'people') {
      setSearchedUsers(usersPeople)
    } else {
      setSearchedUsers(usersBusiness)
    }
  }, [recipientSection])

  useEffect(() => {
    getWalletBalances()
    getDwollaUsers('')
  }, [])

  const renderUserDetail = (item) => {
    return (
      <MDBox
        key={'id-' + item.id}
        sx={{flex: 1, display: 'flex', height: 50, marginBottom: 3, cursor: 'pointer'}}
        onClick={() => setSelectedUser(item)}
      >
        <MDAvatar
          bgColor={'light'}
          src={item.profile_picture}
          sx={{width: 50, height: 50, borderRadius: 25, border: '1px solid #3B88B6', backgroundColor: '#EFEFEF'}}>
        </MDAvatar>
        <MDBox flex={1} display={'flex'} flexDirection={'column'} ml={2}>
          <MDTypography sx={{fontWeight: 700}}
                        fontSize={16}>{item.account_type !== 'BUSINESS' ? 'Username' : 'Business Name'}</MDTypography>
          <MDTypography sx={{fontWeight: 400}} fontSize={14} color={'gray'}>{item.username}</MDTypography>
        </MDBox>
        { item.id === selectedUser?.id && <Icon fontSize="medium" sx={{color: '#8D955D'}}>
          check
        </Icon>}
      </MDBox>
    )
  }

  return (
    <DashboardLayout
      loginRequired
      title={'Admin Wallet Control'}
      loading={loading}
    >
      <MDBox mt={3}>
        <ConfirmDialogModal
          title={'Change Recipient'}
          description={`Do you want to change the current recipient?`}
          open={showChangeRecipientModal}
          handleClose={() => setShowChangeRecipientModal(false)}
          handleConfirm={() => confirmActionSelectRecipient()}
          cancelText={'Cancel'}
          confirmText={'Confirm'}
        />
        <ConfirmDialogModal
          title={'Change Bank Account'}
          description={`Do you want to change the linked bank account?`}
          open={showChangeBankAccountModal}
          handleClose={() => setShowChangeBankAccountModal(false)}
          handleConfirm={() => confirmActionLinkBankAccount()}
          cancelText={'Cancel'}
          confirmText={'Confirm'}
        />
        <ConfirmDialogInputModal
          title={'Select amount'}
          description={'Amount to transfer'}
          open={showAmountModal}
          disabledConfirm={!amount || amount === ''}
          handleClose={() => setShowAmountModal(false)}
          handleConfirm={() => {
            setShowAmountModal(false)
            setShowConfirmationModal(true)
          }}
        >
          <MDInput
            type="number"
            label="ENTER AMOUNT"
            variant="outlined"
            fullWidth
            placeholder="input the amount"
            value={amount}
            onChange={(evt) => setAmount(evt.target.value)}
          />
        </ConfirmDialogInputModal>

        <ConfirmDialogInputModal
          title={'Confirm Amount'}
          description={`Do you want to transfer $${amount} to ${selectedUser?.username}`}
          open={showConfirmationModal}
          handleClose={() => {
            setShowConfirmationModal(false)
            setShowAmountModal(true)
          }}
          handleConfirm={confirmAmountAction}
        >

        </ConfirmDialogInputModal>

        <ConfirmDialogInputModal
          title={actionListModal === 'recipient' ? 'Select Recipient' : 'Send / Transfer'}
          description={''}
          open={showRecipientModal}
          disabledConfirm={selectedUser === null}
          handleClose={() => {
            setShowRecipientModal(false)
            setSelectedUser(null)
          }}
          handleConfirm={() => {
            if (actionListModal === 'recipient' ) {
              setShowChangeRecipientModal(true)
            } else {
              setShowAmountModal(true)
            }

          }}
        >
          <MDBox sx={{backgroundColor: '#EBEBEB', position: 'relative'}} px={5}>
            {loading === false ? <Search style={{position: 'absolute', bottom: 8, left: 10}}/> :
              <CircularProgress sx={{position: 'absolute', bottom: 10, left: 10}} size={20} color="primary"/>}
            <Input
              fullWidth
              placeholder="Search"
              type="text"
              sx={{height: 40, width: '100%'}}
              onChange={(evt) => setSearchBarText(evt?.target?.value)}
            />
          </MDBox>
          <MDBox>
            <MDButton
              color={recipientSection === "people" ? "primary" : "gray"}
              variant={"text"}
              onClick={() => setRecipientSection('people')}
              sx={{
                borderBottom: recipientSection === "people" ? '2px solid #3B88B6' : '2px solid #ffffff',
                borderRadius: 0,
                width: '50%',
                fontWeight: 600,
                marginTop: 3
              }}
            >
              PEOPLE
            </MDButton>
            <MDButton
              color={recipientSection === "merchant" ? "primary" : "gray"}
              variant={"text"}
              onClick={() => setRecipientSection('merchant')}
              sx={{
                borderBottom: recipientSection === "merchant" ? '2px solid #3B88B6' : '2px solid #ffffff',
                borderRadius: 0,
                width: '50%',
                fontWeight: 600,
                marginTop: 3
              }}
            >
              BUSINESS
            </MDButton>
            <MDBox sx={{height: 400, overflowY: 'scroll'}} pt={2}>
              {searchedUsers.map(user => renderUserDetail(user))}
              {searchedUsers.length === 0 &&
                <MDBox flex={1} display={'flex'} justifyContent={'center'} alignItems={'center'} height={400}><MDBox>No
                  users found</MDBox></MDBox>}
            </MDBox>
          </MDBox>
        </ConfirmDialogInputModal>
        <ConfirmDialogInputModal
          title={'Link Bank account'}
          description={''}
          hideButtons
          open={showLinkBankModal}
        >
          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={values => {
              setSelectedFormData(values)
              setShowChangeBankAccountModal(true)
            }}
          >
            {({errors, isValid}) => (
              <Form style={{display: 'flex', flexDirection: 'column', flex: 1}}>
                <Field name="name">
                  {({field}) => {
                    return (
                      <MDBox mb={2}>
                        <MDInput
                          type="text"
                          label="NAME"
                          variant="outlined"
                          placeholder=""
                          fullWidth
                          error={errors.name !== undefined}
                          helperText={errors.name && errors.name}
                          {...field}
                        />
                      </MDBox>
                    )
                  }
                  }
                </Field>
                <Field name="routing_number">
                  {({field}) => {
                    return (
                      <MDBox mb={2}>
                        <MDInput
                          type="text"
                          label="ROUTING NUMBER"
                          variant="outlined"
                          placeholder=""
                          fullWidth
                          error={errors.routing_number !== undefined}
                          helperText={errors.routing_number && errors.routing_number}
                          {...field}
                        />
                      </MDBox>
                    )
                  }
                  }
                </Field>
                <Field name="account_number">
                  {({field}) => {
                    return (
                      <MDBox mb={2}>
                        <MDInput
                          type="text"
                          label="ACCOUNT NUMBER"
                          variant="outlined"
                          placeholder=""
                          fullWidth
                          error={errors.account_number !== undefined}
                          helperText={errors.account_number && errors.account_number}
                          {...field}
                        />
                      </MDBox>
                    )
                  }
                  }
                </Field>
                <Grid container display={'flex'} justifyContent={'center'} mt={2}>
                  <Grid item xs={5}>
                    <MDButton color="primary" variant={'outlined'} fullWidth onClick={() => setShowLinkBankModal(false)}>
                      Cancel
                    </MDButton>
                  </Grid>
                  <Grid item xs={5} ml={2}>
                    <MDButton color="primary" fullWidth type={'submit'} disabled={!isValid}>
                      Confirm
                    </MDButton>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </ConfirmDialogInputModal>
        <MDTypography color={'primary'} sx={{fontWeight: 400}} fontSize={24}>Round Up Change Wallet</MDTypography>
        <MDBox sx={{border: "1px solid #D59B76", borderRadius: 5}} display={'flex'} mt={3}>
          <MDBox flex={1} p={5}>
            <MDTypography color={'dark'} sx={{fontWeight: 400}} fontSize={16}>ROUND UP CHANGE WALLET</MDTypography>
            <MDTypography color={'dark'} sx={{fontWeight: 700}} fontSize={23} mt={3}>Account Name</MDTypography>
            <MDTypography color={'dark'} sx={{fontWeight: 400}} fontSize={19}>**** **** **** ****</MDTypography>
            <MDBox display={'flex'} mt={3} alignItems={'center'}>
              <MDBox
                sx={{backgroundColor: '#9DA56F', borderRadius: 4, width: 54, height: 54}}
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
              >
                <Icon fontSize="medium" sx={{color: '#8D955D'}}>
                  south
                </Icon>
              </MDBox>
              <MDBox ml={2}>
                <MDTypography color={'dark'} sx={{fontWeight: 400}} fontSize={27}>0 $</MDTypography>
                <MDTypography color={'dark'} sx={{fontWeight: 400}} fontSize={17}>ROUND UP INCOME</MDTypography>
              </MDBox>
            </MDBox>
          </MDBox>
          <MDBox display={'flex'} flexDirection={'column'} flex={1} p={5}>
            <MDTypography color={'dark'} sx={{fontWeight: 400}} fontSize={16}>TOTAL ROUND UP SAVINGS</MDTypography>
            <MDTypography color={'dark'} sx={{fontWeight: 700}} fontSize={23}
                          mt={3}>{money_fmt(communityAmount)}</MDTypography>
            <MDBox display={'flex'} mt={'auto'} alignItems={'center'}>
              <MDBox
                sx={{backgroundColor: 'rgba(252,113,0,0.2)', borderRadius: 4, width: 54, height: 54}}
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
              >
                <Icon fontSize="medium" sx={{color: '#ab5b2b'}}>
                  north
                </Icon>
              </MDBox>
              <MDBox ml={2}>
                <MDTypography color={'dark'} sx={{fontWeight: 400}} fontSize={27}>0 $</MDTypography>
                <MDTypography color={'dark'} sx={{fontWeight: 400}} fontSize={17}>TRANSFERRED</MDTypography>
              </MDBox>
            </MDBox>
          </MDBox>
          <MDBox display={'flex'} flex={1} p={5} alignItems={'center'}>
            <MDButton color={"primary"} variant={"outlined"} fullWidth onClick={() => {
              setActionListModal('recipient')
              setShowRecipientModal(true)
            }}>
              <Icon fontSize="medium" sx={{marginRight: 2, transform: 'scale(1.2)'}}>
                list-all
              </Icon>
              Select Recipient
            </MDButton>
          </MDBox>
        </MDBox>
      </MDBox>
      <MDBox mt={3}>
        <MDTypography color={'primary'} sx={{fontWeight: 400}} fontSize={24}>Cash Out Fees Wallet</MDTypography>
        <MDBox sx={{border: "1px solid #D59B76", borderRadius: 5}} display={'flex'} mt={3}>
          <MDBox flex={1} p={5}>
            <MDTypography color={'dark'} sx={{fontWeight: 400}} fontSize={16}>CASH OUT FEES WALLET</MDTypography>
            <MDTypography color={'dark'} sx={{fontWeight: 700}} fontSize={23} mt={3}>Account Name</MDTypography>
            <MDTypography color={'dark'} sx={{fontWeight: 400}} fontSize={19}>**** **** **** ****</MDTypography>
            <MDBox display={'flex'} mt={3} alignItems={'center'}>
              <MDBox
                sx={{backgroundColor: '#9DA56F', borderRadius: 4, width: 54, height: 54}}
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
              >
                <Icon fontSize="medium" sx={{color: '#8D955D'}}>
                  south
                </Icon>
              </MDBox>
              <MDBox ml={2}>
                <MDTypography color={'dark'} sx={{fontWeight: 400}} fontSize={27}>0 $</MDTypography>
                <MDTypography color={'dark'} sx={{fontWeight: 400}} fontSize={17}>CASH OUT FEES INCOME</MDTypography>
              </MDBox>
            </MDBox>
          </MDBox>
          <MDBox display={'flex'} flexDirection={'column'} flex={1} p={5}>
            <MDTypography color={'dark'} sx={{fontWeight: 400}} fontSize={16}>CASH OUT FEES SAVINGS</MDTypography>
            <MDTypography color={'dark'} sx={{fontWeight: 700}} fontSize={23}
                          mt={3}>{money_fmt(humanityAmount)}</MDTypography>
            <MDBox display={'flex'} mt={'auto'} alignItems={'center'}>
              <MDBox
                sx={{backgroundColor: 'rgba(252,113,0,0.2)', borderRadius: 4, width: 54, height: 54}}
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
              >
                <Icon fontSize="medium" sx={{color: '#ab5b2b'}}>
                  north
                </Icon>
              </MDBox>
              <MDBox ml={2}>
                <MDTypography color={'dark'} sx={{fontWeight: 400}} fontSize={27}>0 $</MDTypography>
                <MDTypography color={'dark'} sx={{fontWeight: 400}} fontSize={17}>TRANSFERRED</MDTypography>
              </MDBox>
            </MDBox>
          </MDBox>
          <MDBox display={'flex'} flexDirection={'column'} flex={1} p={5} alignItems={'center'}
                 justifyContent={'space-between'}>
            <MDButton color={"success"} variant={"text"} fullWidth onClick={() => setShowLinkBankModal(true)}>
              <Icon fontSize="medium" sx={{marginRight: 2, transform: 'scale(1.5)'}}>
                attachment
              </Icon>
              Link Bank Account
            </MDButton>
            <MDButton color={"primary"} variant={"contained"} fullWidth onClick={() => {
              setActionListModal('transfer')
              setShowRecipientModal(true)
            }}>
              Send / Transfer
            </MDButton>
            <MDButton color={"primary"} variant={"outlined"} fullWidth disabled>
              Reedem to Cash
            </MDButton>
          </MDBox>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  )
}

export default AdminWalletControl
