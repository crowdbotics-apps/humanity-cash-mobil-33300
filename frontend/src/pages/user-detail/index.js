import DashboardLayout from "../../components/LayoutContainers/DashboardLayout"
import {useEffect, useRef, useState} from "react"
import {showMessage, useApi} from "../../services/helpers"
import {dataTableModel, renderTableRow} from "./utils";
import DataTable from "../../components/DataTable";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {ROUTES} from "../../services/constants";
import ConfirmDialogInputModal from "../../components/ConfirmDialogInputModal";
import MDInput from "../../components/MDInput";


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

  const getDwollaUser = (data) => {
    setLoading(true)
    api.getDwollaUser(data).then((result) => {
      console.log('result ', result)
      if (result.kind === "ok") {
        clearDetail()
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
