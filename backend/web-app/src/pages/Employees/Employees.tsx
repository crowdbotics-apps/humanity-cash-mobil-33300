import React, {useEffect, useRef, useState} from "react";
import {observer} from "mobx-react-lite";
import AdminPanelContainer from "../../containers";
import {Badge, Button, Col, Form, Overlay, Row} from "react-bootstrap";
import {useApi} from "../../utils";
import {genericApiError} from "../../helpers";
import AdvancedTable, {ADV_DELETE_FIELD_NAME} from "../../components/Table/AdvancedTable";
import styles from "./Employee.module.css"
import Modal from "react-bootstrap/Modal";
import {AddStoryForm} from "../Contents/forms";
import {AddUserForm} from "./Forms";
import {UserGroup, UserRole} from "../../components/Table/constants";
import {toast} from "react-toastify";
import {getErrorMessages} from "../../utils/functions";
import SuccessModal from "../../components/SuccessModal/SuccessModal";
import {Filter} from "./Filter";
import {classNames} from "react-select/dist/declarations/src/utils";

const TITLE1 = "Admin Portal Access Management"
const TITLE2 = "Search Results"
const TITLE3 = "Admin Employees / Sub - Admins"

const TABLE_HEADER = {
  fullName:"FULL NAME",
  accessType:"ACCESS TYPE",
  department:"DEPARTMENT"
}

type UserType = {
  id?: number
  email: string
  group: string
  role: string
  name: string
}


const EmployeesPage: React.FC = observer(() => {
  const [Title, setTile] = useState(TITLE1)
  const [NavbarTitle, setNavbarTile] = useState(TITLE3)
  const [Employees, setEmployees] = useState<any>([])
  const [Loading, setLoading] = useState(false)
  const [CurrentUser, setCurrentUser] = useState<UserType | null>(null)
  const [ShowModalForm, setShowModalForm] = useState(false)
  const [ShowSuccessModal, setShowSuccessModal] = useState(false)
  const [ShowFilter, setShowFilter] = useState(false)
  const [BankFilter, setBankFilter] = useState(false)
  const [SuperAdminFilter, setSuperAdminFilter] = useState(false)
  const [SupportFilter, setSupportFilter] = useState(false)
  const [TotalItems, setTotalItems] = useState(0)
  const [CurrentPage, setCurrentPage] = useState(1)
  const [Previous, setPrevious] = useState<string|null>(null)
  const [Next, setNext] = useState<string|null>(null)
  const api = useApi()



  useEffect(() => {
    getUsers()
  }, [CurrentPage])


  const deleteUser = (id: number)=>{
    setLoading(true)
    api.deleteUser(id, ()=>{
      setLoading(false)
      getUsers()
    })
  }

  const openSuccesModal = ()=>{
    setShowSuccessModal(true)
    setTimeout(()=>{
      setShowSuccessModal(false)
    }, 1000)

  }

  const createUser = (event:any)=>{
    api.createUser(event).then((result: any) => {
      console.log(" api.createEvent", result)
      if (result.kind === "ok") {
        openSuccesModal()
        // toast.success("Saved successfully.", {
        //   position: toast.POSITION.TOP_CENTER
        // });
        getUsers()
        setShowModalForm(false)
      } else {
        toast.error(getErrorMessages(result.errors), {
          position: toast.POSITION.TOP_CENTER
        });
      }
    }).catch((error: any) => {
      genericApiError()
    })
  }


  const save = (user:UserType)=>{
    createUser(user)
  }

  const renderDeleteBtn = (id:any)=>{
    return (
      <Button className={styles.deleteBtn}
              onClick={()=>deleteUser(id)}>Delete</Button>)
  }
  const getUsers = ()=>{

    api.getUsers({
      group_manager:SupportFilter,
      group_bank:BankFilter,
      role:SuperAdminFilter,
      page:CurrentPage
    }).then((response: any) => {
      if (response.kind === "ok") {
        console.log(response.data)
        setPrevious(response.data.previous)
        setNext(response.data.next)
        setTotalItems(response.data.count)
        const tableRows = []
        for(let data of response.data.results){
          console.log(UserGroup.BANK.code, data.group)
          const className = data.group === UserGroup.BANK.code? styles.bankBadge: styles.managerBadge
          let row:any = {
            id: data.id,
            name: data.name,
            groupName: (<Badge
                               className={className}>{data.group_name}</Badge>),
            roleName: data.role_name
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


  const PageHeader = ()=>{
    return (<header>
      <div className={'header-row'}>
        <h4 className='title-h4 pt-3 mb-0  pb-3'>{Title}</h4>
        <Button variant="primary" className={styles.addBtn}
                onClick={(event) => setShowModalForm(true)}
                style={{borderRadius:50}}> Add User </Button>{' '}
      </div>
    </header>)
  }

  const onClickFilter = ()=>{
    setShowFilter(true)
  }

  const applyFilter = (data:any)=>{
    console.log(data)
    setBankFilter(data.bank)
    setSupportFilter(data.support)
    setSuperAdminFilter(data.superAdmin)
    setShowFilter(false)

  }

  const cancelFilter = ()=>{

    setShowFilter(false)

  }

  useEffect(() => {
    getUsers()
  }, [BankFilter, SupportFilter, SuperAdminFilter])

  const clearFilter = ()=>{
    setBankFilter(false)
    setSupportFilter(false)
    setSuperAdminFilter(false)
    setShowFilter(false)
  }

  const onClickPage = (page:number)=>{
    console.log("onclick page", page)
    setCurrentPage(page)
  }

  const onPreviousPage = ()=>{
    console.log("onPreviousPage page", Previous)
    if(Previous){
      setCurrentPage(prevState => prevState-1)
    }
  }


  const onNextPage = ()=>{
    console.log("onNextPage page", Next)
    if(Next){
      setCurrentPage(prevState => prevState+1)
    }
  }



  return (
    <AdminPanelContainer
      onclickFilter={onClickFilter}
      filter={   <Filter
        bank={BankFilter}
        support={SupportFilter}
        superAdmin={SuperAdminFilter}
        apply={applyFilter}
        cancel={cancelFilter}
        clearAll={clearFilter}/>}
      navbarTitle={NavbarTitle} header={<PageHeader/>}>
      <Row className={'main-row'}>
        <div className='content'>
          <AdvancedTable
            onClickPage={onClickPage}
            currentPage={CurrentPage}
            totalItems={TotalItems} headerRow={TABLE_HEADER}
            deletable={true} paginate={false} rows={Employees}
            onNext={onNextPage}
            onPrevious={onPreviousPage}/>
        </div>
      </Row>
      <Modal
        size="lg"
        show={ShowModalForm}
        centered
        onHide={() => {
          setCurrentUser(null)
          setShowModalForm(false)
        }}
      >
        <Modal.Header closeButton style={{paddingTop:30, paddingLeft:50, paddingRight:50}}>
          <Modal.Title>
            <div className={'create-modal-title'}>
              {CurrentUser?"Edit User":"Add User"}
            </div>
            <div className={'create-modal-subtitle text-gray'}>
              Lorem ipsum dolor sit amet
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <AddUserForm user={CurrentUser} save={(data:any)=>save(data)}/>
          </Row>
        </Modal.Body>
      </Modal>
      <SuccessModal show={ShowSuccessModal} onHide={()=>{
        setShowSuccessModal(false)
      }} />
    </AdminPanelContainer>

  )
})

export default EmployeesPage
