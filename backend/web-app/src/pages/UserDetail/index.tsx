import React, {useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Button, Col, Form, Row, Tab, Tabs} from "react-bootstrap";
import AdminPanelContainer from "../../containers";
import InputGroup from "react-bootstrap/InputGroup";
import {SearchIcon} from "../../components/icons";
import AdvancedTable from "../../components/Table/AdvancedTable";
import {useApi, useUserStore} from "../../utils";
import {UserGroup} from "../../components/Table/constants";
import {genericApiError} from "../../helpers";
import {truncate} from "../../utils/functions";
import moment from 'moment'
import styles from './UsersDetail.module.css'
import {useLocation, useParams} from "react-router-dom";
import SimpleTable from "../../components/Table";
import {dataCompleted} from "../Dashboard/constants";
import {USER_DETAIL} from "./data";


const wrapHash = (txt:string)=>{
  if (!txt) return ''
  txt  = truncate(txt, 30)
  const  middle:number = Math.round(txt.length/2) - 1

  return <div className={styles.textTD}>{txt}</div>
}

const COLUMN_TITLES = [
  'ACCOUNT CREATED', 'DWOLLA ID', 'WALLET ADDRESS',
  'BALANCE', 'ADDRESS', 'EMAIL'
]

const UserDetailPage: React.FC = observer(() => {

  const params = useParams();
  const {id} = params
  console.log("USE LOCATION",params, id)


  const [LeftOpen, setLeftOpen] = useState<any>(true);
  //const [RightOpen, setRightOpen] = useState<any>(true);
  const [Items, setItems] = useState<any>([])
  const [TotalItems, setTotalItems] = useState(0)
  const [CurrentPage, setCurrentPage] = useState(1)
  const [Previous, setPrevious] = useState<string|null>(null)
  const [Next, setNext] = useState<string|null>(null)
  const [ShowUsername, setShowUsername] = useState<boolean>(true)
  const [User, setUser] = useState<any>(null)
  const [ShowPasswordModal, setShowPasswordModal] = useState<boolean>(false)
  const [CurrentIndex, setCurrentIndex] = useState<number|null>(null)
  const [CurrentItem, setCurrentItem] = useState<any|null>(null)
  const [Password, setPassword] = useState<string>("holamundo")
  const [Title, setTitle] = useState<string>("John Travolta")
  const [ColumnsTitles, setColumnsTitles] = useState(COLUMN_TITLES)
  const api = useApi()
  const userStore = useUserStore()


  useEffect(() => {
    console.log("useEffect", userStore.access_token, userStore.group, userStore.role)
    userStore.setUp()
    if (userStore.group === UserGroup.BANK.code){
      setColumnsTitles(COLUMN_TITLES.concat(['USERNAME']))
    }
    getUserData()
  },[])


  const CreatedColumn = (opts:any)=>{
    return  ( opts.created !== null?<div>
      <span className={styles.createdTitle}>{moment(opts.created).format('MMMM DD, YYYY')}</span>
      <br/>
      <span className={styles.createdSubtitle}>{moment(opts.created).format('H:mm a').toUpperCase()}</span>
    </div>: null)
  }


  const getItem = ()=>{
    if(CurrentItem === null){
      return
    }
    let params:any = {}
    if (ShowUsername){
      params["show_username"] = true
      params["password"] = Password
    }
  }

  const getUserData = ()=>{
    api.getDwollaUser(id).then((response: any) => {
      console.log("cosumers", response.data)
      if (response.kind === "ok") {
        const data = response.data
        setUser({
          id: data.id,
          fullName: data.full_name,
          email: data.email,
          userDwollaId: wrapHash(data.dwolla_id),
          balance: <div className={styles.balance}> $ {data.balance}</div>,
          lastLogin:<CreatedColumn created={data.last_login}/>,
          accountCreated:<CreatedColumn created={data.date_joined}/>,
          walletAddress: wrapHash(data.crypto_wallet_id),
          address: data.address,
          accountType: data.account_type
        })
      }
    }).catch((error: any) => {
      console.log(error)
      genericApiError()
    })
  }





  const onClickFilter = ()=>{

  }

  const applyFilter = (data:any)=>{
    console.log(data)


  }

  const cancelFilter = ()=>{



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

  const SearchInput = ()=>{
    return (
      <InputGroup className="mb-0 search-button-group">
        <Button variant="outline-secondary" id="button-addon2" className='search-buttons'>
          <SearchIcon />
        </Button>
        <Form.Control
          placeholder='Search'
          type="search" name="search" className='search-button-navbar'
        />
      </InputGroup>)
  }

  const onSubmit = ()=>{
    console.log("onsubmit")
  }

  const handleClose = ()=>{
    console.log("handle close")
    setShowPasswordModal(false)
  }

  return (
    <AdminPanelContainer
      search={<SearchInput />}
      onclickFilter={onClickFilter}
      title={Title}
      // filter={   <Filter
      //   bank={BankFilter}
      //   support={SupportFilter}
      //   superAdmin={SuperAdminFilter}
      //   apply={applyFilter}
      //   cancel={cancelFilter}
      //   clearAll={clearFilter}/>}
      navbarTitle={""}

    >

      <Col>
        <div id='layout'>
          <div id='main' className={`main${LeftOpen ? '' : '-closed'}`}>
            <div className='content'>
              <Tabs defaultActiveKey="details" id="user-detail" className="mb-2 ">
                <Tab eventKey="details" title="USER DETAILS" style={{ color: '#808080' }}>

                  <div className={styles.tableContainer}>
                    <table className={`table table-responsive mt-3 mb-3 ${styles.table}`}  >
                      <thead>
                      <tr>

                      {COLUMN_TITLES.map(((value, index) => <th key={"th-"+index} className={styles.th}>{value}</th>))}

                      </tr>
                      </thead>
                      <tbody style={{border:"none"}}>

                      {User && (
                        <tr key={"tbody"} style={{border:"none"}}>
                          <td key={"td-1"} style={{borderStyle:"none"}}>{User.accountCreated}</td>
                          <td key={"td-2"} style={{borderStyle:"none"}}>{User.userDwollaId}</td>
                          <td key={"td-3"} style={{borderStyle:"none"}}>{User.walletAddress}</td>
                          <td key={"td-4"} style={{borderStyle:"none"}}>{User.balance}</td>
                          <td key={"td-5"} style={{borderStyle:"none"}}>{User.address}</td>
                          <td key={"td-6"} style={{borderStyle:"none"}}>{User.email}</td>
                        </tr>
                      )}


                      </tbody>
                    </table>

                  </div>
                  {/*<SimpleTable rows={USER_DETAIL} delete_items={false}/>*/}

                </Tab>
                <Tab eventKey="ach_transactions" title="ACH TRANSACTIONS" style={{ color: '#808080' }} >
                  <SimpleTable rows={dataCompleted} />
                </Tab>
                <Tab eventKey="blockchain_transactions" title="BLOCKCHAIN TRANSACTIONS" style={{ color: '#808080' }} >
                  <SimpleTable rows={dataCompleted} />
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </Col>



    </AdminPanelContainer>
  )
})

export default UserDetailPage;
