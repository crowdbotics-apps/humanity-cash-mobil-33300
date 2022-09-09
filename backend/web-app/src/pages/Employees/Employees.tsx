import React, {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import AdminPanelContainer from "../../containers";
import {Button, Row} from "react-bootstrap";
import {useApi} from "../../utils";
import {genericApiError} from "../../helpers";
import AdvancedTable, {ADV_DELETE_FIELD_NAME} from "../../components/Table/AdvancedTable";

const TITLE1 = "Admin Portal Access Management"
const TITLE2 = "Search Results"
const TITLE3 = "Admin Employees / Sub - Admins"

const TABLE_HEADER = {
  fullName:"FULL NAME",
  accessType:"ACCESS TYPE",
  department:"DEPARTMENT"
}

const EmployeesPage: React.FC = observer(() => {
  const [Title, setTile] = useState(TITLE1)
  const [NavbarTitle, setNavbarTile] = useState(TITLE3)
  const [Employees, setEmployees] = useState<any>([])
  const [Loading, setLoading] = useState(false)
  const api = useApi()

  const deleteUser = (id: number)=>{
    setLoading(true)
    api.deleteUser(id, ()=>{
      setLoading(false)
      getUsers()
    })
  }

  const renderDeleteBtn = (id:any)=>{
    return (
      <Button onClick={()=>deleteUser(id)}>Delete</Button>)
  }
  const getUsers = ()=>{
    api.getUsers({}).then((response: any) => {
      if (response.kind === "ok") {
        console.log(response.data)
        const tableRows = []
        for(let data of response.data.results){
          let row:any = {
            id: data.id,
            fullName: data.name,
            accessType: data.group_name,
            department: data.role_name
          }
           // the delete field name should be called deleteCol to the css can be applied
           row[ADV_DELETE_FIELD_NAME] = renderDeleteBtn(data.id)
           tableRows.push(row)
        }
        setEmployees(tableRows)
      }
    }).catch((error: any) => {
      console.log(error)
      genericApiError()
    })
  }
  useEffect(() => {
    getUsers()
  }, [])

  const TD = ()=>(<div style={{backgroundColor:"red"}}>chau</div>)

  return (
    <AdminPanelContainer navbarTitle={NavbarTitle} title={Title}>
      <Row className={'main-row'}>
        <div className='content'>
          <AdvancedTable  headerRow={TABLE_HEADER} deletable={true} paginate={false} rows={Employees} />
        </div>
      </Row>
    </AdminPanelContainer>

  )
})

export default EmployeesPage
