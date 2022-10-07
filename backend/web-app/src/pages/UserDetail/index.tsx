import React, {useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Button, Col, Form, Tab, Tabs} from "react-bootstrap";
import AdminPanelContainer from "../../containers";
import InputGroup from "react-bootstrap/InputGroup";
import {ArrowRightIcon, SearchIcon} from "../../components/icons";
import {useApi, useUserStore} from "../../utils";
import {genericApiError} from "../../helpers";
import {truncate} from "../../utils/functions";
import moment from 'moment'
import styles from './UsersDetail.module.css'
import {useParams} from "react-router-dom";
import SimpleTable from "../../components/Table";
import {dataCompleted} from "../Dashboard/constants";
import AdvancedTable from "../../components/Table/AdvancedTable";
import {UserGroup} from "../../components/Table/constants";

type StatusFieldOpts = {
  value:"pending"|"confirmed"|"completed"
}

const wrapHash = (txt:string)=>{
  if (!txt) return ''
  txt  = truncate(txt, 23)
  const  middle:number = Math.round(txt.length/2) - 1
  return <div className={styles.textTD}>{txt.slice(0, middle)}<br/>{txt.slice(middle, txt.length)}</div>
}

const COLUMN_TITLES = [
  'ACCOUNT CREATED', 'DWOLLA ID', 'WALLET ADDRESS',
  'BALANCE', 'ADDRESS', 'EMAIL'
]

const Keys = {
  ACH:"ach_transactions",
  USER:"user_details",
  BLOCKCHAIN: "blockchain_transactions"
}
const UserDetailPage: React.FC = observer(() => {

  const params = useParams();
  const {id} = params
  console.log("USE LOCATION",params, id)


  const [LeftOpen, setLeftOpen] = useState<any>(true);
  const [Items, setItems] = useState<any>([])
  const [TotalItems, setTotalItems] = useState(0)
  const [CurrentPage, setCurrentPage] = useState(1)
  const [Previous, setPrevious] = useState<string|null>(null)
  const [Next, setNext] = useState<string|null>(null)
  const [ShowUsername, setShowUsername] = useState<boolean>(true)
  const [User, setUser] = useState<any>(null)
  const [Title, setTitle] = useState<string>("")
  const [ColumnsTitles, setColumnsTitles] = useState(COLUMN_TITLES)
  const [CurrentTab, setCurrentTab] = useState<string|null>(Keys.USER)
  const api = useApi()
  const userStore = useUserStore()


  useEffect(() => {
    userStore.setUp()
    getUserData()
  },[])

  useEffect(() => {
    setItems([])
    if (CurrentTab === Keys.BLOCKCHAIN){
      setTitle("Blockchain Transactions")
      getTransactions()
    }else if (CurrentTab === Keys.ACH){
      setTitle("ACH Transactions")
      getACHTransactions()
    }else{
      setTitle(User && User.fullName || "")
    }
  }, [CurrentTab])


  const CreatedColumn = (opts:any)=>{
    return  ( opts.created !== null?<div>
      <span className={styles.createdTitle}>{moment(opts.created).format('MMMM DD, YYYY')}</span>
      <br/>
      <span className={styles.createdSubtitle}>{moment(opts.created).format('H:mm a').toUpperCase()}</span>
    </div>: null)
  }

  const TransactionType = (opts:{value:"deposit"|"withdraw"})=>{
    const {value} = opts
    return (
      <span className={styles.decoratedSpan}
            style={{backgroundColor:value === "deposit"?"var(--blue)":"var(--pink)"}}>
       {value?value.toLowerCase():""}
      </span>
    )
  }

  const AmountField = (data:{amount:number, option:string})=>{
    const  {option, amount} = data
    return (
      <span style={{color:option ==="deposit"?"var(--blue)":"var(--pink)"}}>
        B${amount}
      </span>
    )
  }

  const StatusField = (opts:StatusFieldOpts)=>{

    const {value} = opts

    const getColor = (value:any)=>{
      let color = ""
      if(value === "completed"){
        color = 'var(--green)'
      }else if(value ==="pending"){
        color = 'var(--mustard)'
      }else{
        color = 'var(--gray)'
      }
      return color
    }
    return (
      <span className={styles.decoratedSpan} style={{backgroundColor:getColor(value)}}>
       {value?value.toLowerCase():""}
      </span>
    )
  }


  const getUserData = ()=>{
    api.getDwollaUser(id).then((response: any) => {
      console.log("cosumers", response.data)
      if (response.kind === "ok") {

        const data = response.data
        setTitle(data.name)
        setUser({
          id: data.id,
          fullName: data.name,
          email: data.email,
          userDwollaId:  <div className={styles.textTD}>{truncate(data.dwolla_id, 25)}</div>,
          balance: <div className={styles.balance}> $ {data.balance}</div>,
          lastLogin:<CreatedColumn created={data.last_login}/>,
          accountCreated:<CreatedColumn created={data.date_joined}/>,
          walletAddress: <div className={styles.textTD}>{truncate(data.crypto_wallet_id, 25)}</div>,
          address: data.address,
          accountType: data.account_type
        })
      }
    }).catch((error: any) => {
      console.log(error)
      genericApiError()
    })
  }

  const getACHTransactions = ()=>{
    api.getACHTransactions({user:User.id}).then((response:any)=>{
      console.log(response.data)
      if (response.kind === "ok") {
        setPrevious(response.data.previous)
        setNext(response.data.next)
        setTotalItems(response.data.count)
        const tableRows = []
        for(let data of response.data.results){
          let row:any = {
            id: data.id,
            ach_id: data.ach_id,
            type: <TransactionType value={data.type} />,
            user:"username",
            createdAt:<CreatedColumn created={data.created_at}/>,
            confirmedAt:<CreatedColumn created={data.confirmed_at}/>,
            bank:"Bank name",
            currentsBank:"Currents Bank",
            amount: <AmountField  option={data.type} amount={data.amount} /> ,
            status:<StatusField value={data.status} />
          }
          tableRows.push(row)
        }
        setItems(tableRows)

      }
    }).catch((error: any) => {
      console.log(error)
      genericApiError()
    })
  }

  const getTransactions = ()=>{
    api.getBlockchainTransactions({user:User.id}).then((response: any) => {
      if (response.kind === "ok") {
        setPrevious(response.data.previous)
        setNext(response.data.next)
        setTotalItems(response.data.count)
        const tableRows = []
        for(let data of response.data.results){
          let row:any = {
            id: data.id,
            hash: wrapHash(data.transaction_id),
            fromUsername: wrapHash(data.from_username) ,
            toUsername: (<div className={styles.toColumn}>
                          <div style={{marginRight:8}}>
                          <ArrowRightIcon /> </div> {wrapHash(data.to_username)}
                         </div>),
            fromAddress: wrapHash(data.from_address),
            toAddress: wrapHash(data.to_address),
            type: data.type,
            createdAt:<CreatedColumn created={data.created}/>,
            amount:data.amount,
            confirmedBlocks: <div style={{textAlign:"center"}}>{data.confirmations}</div>
          }
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
              <Tabs defaultActiveKey={Keys.USER} id="user-detail"
                    className="mb-2 "
                    onSelect={(k)=>setCurrentTab(k)}>
                <Tab eventKey={Keys.USER} title="USER DETAILS" style={{ color: '#808080' }}>

                  <div className={styles.tableContainer}>
                    <table className={`table table-responsive mt-0 mb-3 ${styles.table}`}  >
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
                <Tab eventKey={Keys.ACH} title="ACH TRANSACTIONS" style={{ color: '#808080' }} >
                  {CurrentTab === Keys.ACH && (
                    <AdvancedTable
                      onClickPage={onClickPage}
                      currentPage={CurrentPage}
                      totalItems={TotalItems}
                      headerRow={['ID', 'TYPE', 'USER', 'CREATED AT', 'CONFIRMED AT', 'BANK',<div> HUDSON VALLEY<br/>CURRENTS BANK</div>, 'AMOUNT', 'STATUS']}
                      deletable={true} paginate={false} rows={Items}
                      onNext={onNextPage}
                      onPrevious={onPreviousPage}/>
                  )}
                </Tab>
                <Tab eventKey={Keys.BLOCKCHAIN} title="BLOCKCHAIN TRANSACTIONS" style={{ color: '#808080' }} >
                  {CurrentTab === Keys.BLOCKCHAIN && (
                    <AdvancedTable
                      onClickPage={onClickPage}
                      currentPage={CurrentPage}
                      totalItems={TotalItems}
                      headerRow={['HASH', 'FROM', 'TO', 'FROM ADDRESS', 'TO ADDRESS', 'TYPE', 'CREATED AT', 'AMOUNT', 'BLOCKS CONFIRMED']}
                      deletable={true} paginate={false} rows={Items}
                      onNext={onNextPage}
                      onPrevious={onPreviousPage}/>
                  )}

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
