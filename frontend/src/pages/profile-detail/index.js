import DashboardLayout from "../../components/LayoutContainers/DashboardLayout"
import MDButton from "../../components/MDButton"
import {useNavigate} from "react-router-dom"
import MDBox from "../../components/MDBox";
import {ROUTES} from "../../services/constants";
import styles from "./style.module.css";
import MDTypography from "../../components/MDTypography";
import {useStores} from "../../models";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const phoneIcon = require("assets/icons/phone_img.png")
const mapIcon = require("assets/icons/mapPin.png")

const ProfileDetail = () => {
  const rootStore = useStores()
  const {loginStore} = rootStore
  const navigate = useNavigate()

  return (
    <DashboardLayout showCard loginRequired>
      <MDBox display={'flex'} flexDirection={'column'} alignItems={'center'} flex={1}>
        <div
          className={styles.imageContainer}>
        {loginStore.profile_picture ? (
          <img src={loginStore?.profile_picture} alt="" className={styles.image}/>
        ) : (<AccountCircleIcon color={'white'}  sx={{width: 200, height: 200}}/>)}
        </div>
        <MDTypography className={styles.name}>{loginStore.name}</MDTypography>
        <MDTypography className={styles.company}>{loginStore.company_name}</MDTypography>
        <MDTypography className={styles.companyInfo}><img alt={''} src={mapIcon} style={{marginRight: 10}}/> {loginStore.address}</MDTypography>
        <MDTypography className={styles.companyInfo}><img alt={''} src={phoneIcon} style={{marginRight: 10}}/> {loginStore.phone_number}</MDTypography>
        <MDButton sx={{minWidth: 170, marginTop: 'auto', marginBottom: 10}}  variant="gradient" color="secondary" onClick={() => navigate(ROUTES.EDIT_PROFILE)}>
          Edit
        </MDButton>
      </MDBox>
    </DashboardLayout>
  )
}

export default ProfileDetail
