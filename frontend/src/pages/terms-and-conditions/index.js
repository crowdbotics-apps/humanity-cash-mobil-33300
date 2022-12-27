import DashboardLayout from "../../components/LayoutContainers/DashboardLayout"
import {useEffect, useState} from "react"
import {showMessage, useApi} from "../../services/helpers"
import MDBox from "../../components/MDBox";


const TermsAndCondition = () => {
  const api = useApi()
  const [data, setData] = useState(null)

  const getTermsConditions = () => {
    api.getTermsConditions().then((result) => {
      if (result.kind === "ok") {
        const {results, count} = result.data
        setData(results[count - 1] )
      }
    })
      .catch(err => showMessage())
  }

  useEffect(() => {
    getTermsConditions()
  }, [])

  return (
    <DashboardLayout showCard={false} loginRequired>
      <MDBox>
        {data && <div
          dangerouslySetInnerHTML={{__html: data.terms}}
        /> }
      </MDBox>
    </DashboardLayout>
  )
}

export default TermsAndCondition
