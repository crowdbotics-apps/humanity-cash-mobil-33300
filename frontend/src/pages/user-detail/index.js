import DashboardLayout from "../../components/LayoutContainers/DashboardLayout"
import {useEffect, useRef, useState} from "react"
import {showMessage, useApi} from "../../services/helpers"
import {
  dataTableModel,
  dataTableModelACH,
  dataTableModelBlockChain,
  renderTableRow, renderTableRowACH,
  renderTableRowBlockchain
} from "./utils";
import DataTable from "../../components/DataTable";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {ROUTES} from "../../services/constants";
import ConfirmDialogInputModal from "../../components/ConfirmDialogInputModal";
import MDInput from "../../components/MDInput";
import MDButton from "../../components/MDButton";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import {Grid} from "@mui/material";
import moment from "moment/moment";

const UserDetail = () => {
  const api = useApi()
  const navigate = useNavigate()
  const {id} = useParams()
  const location = useLocation();
  const { state } = location
  const { type } = state
  const [loading, setLoading] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [userPassword, setUserPassword] = useState('')
  const [userDetailSection, setUserDetailSection] = useState('detail')
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [numberOfItemsPage, setNumberOfItemsPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordListBlockchain, setRecordListBlockchain] = useState({...dataTableModelBlockChain})
  const [recordListACH, setRecordListACH] = useState({...dataTableModelACH})

  const getDwollaUser = (data) => {
    setLoading(true)
    api.getDwollaUser(data).then((result) => {
      if (result.kind === "ok") {
        clearDetail()
        const {ach_transactions, blockchain_transactions} = result.response
        const tmpblockchain = {...dataTableModelBlockChain}
        const tmpACH = {...dataTableModelACH}
        tmpblockchain.rows = blockchain_transactions.map(e => renderTableRowBlockchain(e))
        tmpACH.rows = ach_transactions.map(e => renderTableRowACH(e))
        setRecordListBlockchain(tmpblockchain)
        setRecordListACH(tmpACH)
        setSelectedItem(result.response)

      } else if (result.kind === "bad-data"){
        showMessage(result.errors?.password[0])
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }

  const clearDetail = () => {
    setShowPrivacyModal(false)
    setSelectedItem(null)
    setUserPassword('')
  }

  const confirmAction = () => {
    const data = {
      id,
      type,
      password: userPassword
    }
    getDwollaUser(data)
  }

  useEffect(() => {
    setShowPrivacyModal(true)
  }, [])

  return (
    <DashboardLayout
      loginRequired
      goBack={() => navigate(ROUTES.USERS)}
    >
      <MDTypography mt={5} color={'primary'} sx={{fontWeight: 400}} fontSize={24}>
        {userDetailSection === "detail" && 'User details'}
        {userDetailSection === "ach" && 'ACH Transactions'}
        {userDetailSection === "blockchain" && 'Blockchain transactions'}
      </MDTypography>
      <MDButton
        color={userDetailSection === "detail" ? "primary" : "gray"}
        variant={"text"}
        onClick={() => setUserDetailSection('detail')}
        sx={{borderBottom: userDetailSection === "detail" ? '2px solid #3B88B6' : '2px solid #ffffff', borderRadius: 0, minWidth: 300, fontWeight: 600, marginTop: 3}}
      >
        USER DETAILS
      </MDButton>
      <MDButton
        color={userDetailSection === "ach" ? "primary" : "gray"}
        variant={"text"}
        onClick={() => setUserDetailSection('ach')}
        sx={{borderBottom: userDetailSection === "ach" ? '2px solid #3B88B6' : '2px solid #ffffff', borderRadius: 0, minWidth: 300, fontWeight: 600, marginTop: 3}}
      >
        ACH TRANSACTIONS
      </MDButton>
      <MDButton
        color={userDetailSection === "blockchain" ? "primary" : "gray"}
        variant={"text"}
        onClick={() => setUserDetailSection('blockchain')}
        sx={{borderBottom: userDetailSection === "blockchain" ? '2px solid #3B88B6' : '2px solid #ffffff', borderRadius: 0, minWidth: 300, fontWeight: 600, marginTop: 3}}
      >
        BLOCKCHAIN TRANSACTIONS
      </MDButton>
      <MDBox sx={{
        width: '100%',
        transition: '0.3s',
        height: 2,
        backgroundColor: '#3B88B6',
      }}/>
      {selectedItem && userDetailSection === "detail" && <MDBox sx={{border: "1px solid #D59B76", borderRadius: 5}} display={'flex'} mt={3} p={2}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={2}>
            <MDTypography color={'gray'} sx={{fontWeight: 500}} fontSize={14}>ACCOUNT CREATED</MDTypography>
            <MDBox sx={{color: '#000000', fontSize: 14, fontWeight: 500}}>
              {moment(selectedItem?.date_joined).format('MMMM DD, YYYY')}
            </MDBox>
            <MDBox sx={{color: '#666666', fontSize: 12, fontWeight: 700}}>
              {moment(selectedItem?.date_joined).format('H:mm a').toUpperCase()}
            </MDBox>
          </Grid>
          <Grid item xs={6} md={2}>
            <MDTypography color={'gray'} sx={{fontWeight: 500}} fontSize={14}>DWOLLA ID</MDTypography>
            <MDTypography color={'primary'} sx={{fontWeight: 500}} fontSize={14}>{selectedItem?.dwolla_id}</MDTypography>
          </Grid>
          <Grid item xs={6} md={2}>
            <MDTypography color={'gray'} sx={{fontWeight: 500}} fontSize={14}>WALLET ADDRESS</MDTypography>
            <MDTypography color={'primary'} sx={{fontWeight: 500}} fontSize={14}>{selectedItem?.crypto_wallet_id}</MDTypography>
          </Grid>
          <Grid item xs={6} md={2}>
            <MDTypography color={'gray'} sx={{fontWeight: 500}} fontSize={14}>BALANCE</MDTypography>
            <MDTypography color={'success'} sx={{fontWeight: 500}} fontSize={14}>{selectedItem?.balance}</MDTypography>
          </Grid>
          <Grid item xs={6} md={2}>
            <MDTypography color={'gray'} sx={{fontWeight: 500}} fontSize={14}>ADDRESS</MDTypography>
            <MDTypography color={'dark'} sx={{fontWeight: 500}} fontSize={14}>{selectedItem?.address}</MDTypography>
          </Grid>
          <Grid item xs={6} md={2}>
            <MDTypography color={'gray'} sx={{fontWeight: 500}} fontSize={14}>EMAIL</MDTypography>
            <MDTypography color={'dark'} sx={{fontWeight: 500}} fontSize={14}>{selectedItem?.email}</MDTypography>
          </Grid>
        </Grid>
      </MDBox> }
      {selectedItem && (userDetailSection === "ach" || userDetailSection === "blockchain") && <>
        <DataTable
          table={userDetailSection === "ach" ? recordListACH : recordListBlockchain}
          currentPage={currentPage}
          numberOfItems={userDetailSection === "ach" ? recordListACH.rows.length : recordListBlockchain.rows.length}
          numberOfItemsPage={numberOfItemsPage}
          pageSize={8}
          onPageChange={page => {
            setCurrentPage(page)
          }}
        />
      </>}
        <ConfirmDialogInputModal
        title={'Privacy Requirement'}
        description={'Please enter your password to confirm'}
        open={showPrivacyModal}
        handleClose={() => navigate(ROUTES.USERS)}
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

export default UserDetail
