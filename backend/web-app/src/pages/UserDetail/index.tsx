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


const wrapHash = (txt:string, )=>{
  if (txt === null) return ''
  txt  = truncate(txt, 23)
  const  middle:number = Math.round(txt.length/2) - 1
  return <div className={styles.textTD}>{txt.slice(0, middle)}<br/>{txt.slice(middle, txt.length)}</div>
}

const COLUMN_TITLES = [
  'FULL NAME', 'EMAIL', 'USER DWOLLA ID',
  'BALANCE', 'LAST LOG IN', 'WALLET ADDRESS',
  'PHYSICAL ADDRESS', 'ACCOUNT TYPE'
]

const UserDetailPage: React.FC = observer(() => {

  const params = useParams();
 console.log("USE LOCATION",params)


  const [LeftOpen, setLeftOpen] = useState<any>(true);
    //const [RightOpen, setRightOpen] = useState<any>(true);
  const [Items, setItems] = useState<any>([])
  const [TotalItems, setTotalItems] = useState(0)
  const [CurrentPage, setCurrentPage] = useState(1)
  const [Previous, setPrevious] = useState<string|null>(null)
  const [Next, setNext] = useState<string|null>(null)
  const [ShowUsername, setShowUsername] = useState<boolean>(true)
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
    getItems()
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





  const getItems = ()=>{
    let params:any = {page:CurrentPage}
    // if (ShowUsername){
    //   params["show_username"] = true
    //   params["password"] = Password
    // }
    api.getConsumers(params).then((response: any) => {
      console.log("cosumers", response.data)
      if (response.kind === "ok") {
        setPrevious(response.data.previous)
        setNext(response.data.next)
        setTotalItems(response.data.count)
        const tableRows = []
        let index = 0
        for(let data of response.data.results){
          let row:any = {
            id: data.id,
            fullName: data.full_name,
            email: data.email,
            userDwollaId: wrapHash(data.dwolla_id),
            balance: data.balance,
            lastLogin:<CreatedColumn created={data.last_login}/>,
            walletAddress: wrapHash(data.crypto_wallet_id),
            address: data.address_1,
            accountType: "Personal",
            show:  (<div >
              <Button type={"button"} onClick={()=>{
                setShowUsername(true)
                setShowPasswordModal(true)
                setCurrentItem(row)
                setCurrentIndex(index)

              }} className={styles.showButton}>show</Button>
            </div>)
          }

          index ++;
          tableRows.push(row)
        }
        setItems(tableRows)
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
                <Tabs defaultActiveKey="details" id="uncontrolled-tab-example" className="mb-3 ">
                  <Tab eventKey="details" title="USER DETAILS" style={{ color: '#808080' }}>
                    <SimpleTable rows={USER_DETAIL} delete_items={false}/>
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
