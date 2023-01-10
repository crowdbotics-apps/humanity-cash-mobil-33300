import DashboardLayout from "../../components/LayoutContainers/DashboardLayout"
import {useEffect, useRef, useState} from "react"
import {money_fmt, showMessage, useApi} from "../../services/helpers"
import {dataTableModel, renderTableRow} from "./utils";
import DataTable from "../../components/DataTable";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../services/constants";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import Icon from "@mui/material/Icon";
import MDButton from "../../components/MDButton";


const AdminWalletControl = () => {
  const api = useApi()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [communityAmount, setCommunityAmount] = useState(0)
  const [humanityAmount, setHumanityAmount] = useState(0)
  const getWalletBalances = () => {
    setLoading(true)
    api.getWalletBalances().then((result) => {
      if (result.kind === "ok") {
        let { community, humanity } = result.data
        setCommunityAmount(community)
        setHumanityAmount(humanity)
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getWalletBalances()
  }, [])

  return (
    <DashboardLayout
      loginRequired
      title={'Admin Wallet Control'}
    >
      <MDBox mt={3}>
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
            <MDTypography color={'dark'} sx={{fontWeight: 700}} fontSize={23} mt={3}>{money_fmt(communityAmount)}</MDTypography>
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
          <MDBox display={'flex'}  flex={1} p={5} alignItems={'center'}>
            <MDButton color={"primary"} variant={"outlined"} fullWidth>
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
            <MDTypography color={'dark'} sx={{fontWeight: 700}} fontSize={23} mt={3}>{money_fmt(humanityAmount)}</MDTypography>
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
          <MDBox display={'flex'} flexDirection={'column'}  flex={1} p={5} alignItems={'center'} justifyContent={'space-between'}>
            <MDButton color={"success"} variant={"text"} fullWidth>
              <Icon fontSize="medium" sx={{marginRight: 2, transform: 'scale(1.5)'}}>
                attachment
              </Icon>
              Link Bank Account
            </MDButton>
            <MDButton color={"primary"} variant={"contained"} fullWidth>
              Send / Transfer
            </MDButton>
            <MDButton color={"primary"} variant={"outlined"} fullWidth>
              Reedem to Cash
            </MDButton>
          </MDBox>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  )
}

export default AdminWalletControl
