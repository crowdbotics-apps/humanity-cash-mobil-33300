import DashboardLayout from "../../components/LayoutContainers/DashboardLayout"
import {useEffect, useRef, useState} from "react"
import {showMessage, useApi} from "../../services/helpers"
import {dataTableModel, renderTableRow} from "./utils";
import DataTable from "../../components/DataTable";
import {useNavigate, useParams} from "react-router-dom";
import {ROUTES} from "../../services/constants";


const UserDetail = () => {
  const api = useApi()
  const navigate = useNavigate()
  const {id} = useParams()
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [numberOfItemsPage, setNumberOfItemsPage] = useState(0);
  const [recordList, setRecordList] = useState({...dataTableModel})
  const searchQueryRef = useRef("");

  const getDwollaUser = (data) => {
    setLoading(true)
    api.getDwollaUser(data).then((result) => {
      if (result.kind === "ok") {
        console.log('data ', data)
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    const data ={
      id,
    }
    getDwollaUser(data)
  }, [])

  return (
    <DashboardLayout
      loginRequired
      goBack={() => navigate(ROUTES.USERS)}
    >
-
    </DashboardLayout>
  )
}

export default UserDetail
