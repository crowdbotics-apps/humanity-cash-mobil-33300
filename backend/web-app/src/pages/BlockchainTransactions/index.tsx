import React, {useEffect, useState} from 'react';
import { observer } from "mobx-react-lite";
import SimpleTable from '../../components/Table'
import {Badge, Button, Form, Row, Tab, Tabs} from "react-bootstrap";
import AdminPanelContainer from "../../containers";
import InputGroup from "react-bootstrap/InputGroup";
import {ArrowRightIcon, SearchIcon} from "../../components/icons";
import {Filter} from "../Employees/Filter";
import AdvancedTable, {ADV_DELETE_FIELD_NAME} from "../../components/Table/AdvancedTable";
import {useApi, useUserStore} from "../../utils";
import {UserGroup} from "../../components/Table/constants";
import {genericApiError} from "../../helpers";
import {truncate} from "../../utils/functions";
import moment from 'moment'
import styles from './BlockchainTransactions.module.css'


const wrapHash = (txt:string, )=>{
  txt  = truncate(txt, 23)
  const  middle:number = Math.round(txt.length/2) - 1
  return <div className={styles.textTD}>{txt.slice(0, middle)}<br/>{txt.slice(middle, txt.length)}</div>
}

const COLUMN_TITLES = ['HASH', 'FROM', 'TO', 'FROM ADDRESS', 'TO ADDRESS', 'TYPE', 'CREATED AT', 'AMOUNT', 'BLOCKS CONFIRMED']

const BlockTransactionsPage: React.FC = observer(() => {

    const [LeftOpen, setLeftOpen] = useState<any>(true);
    //const [RightOpen, setRightOpen] = useState<any>(true);
  const [Items, setItems] = useState<any>([])
  const [TotalItems, setTotalItems] = useState(0)
  const [CurrentPage, setCurrentPage] = useState(1)
  const [Previous, setPrevious] = useState<string|null>(null)
  const [Next, setNext] = useState<string|null>(null)
  const [ShowUsername, setShowUsername] = useState<boolean>(true)
  const [Password, setPassword] = useState<string>("holamundo")
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

  useEffect(() => {
    if(ShowUsername){
      setPassword("holamundo")

    }
  }, [ShowUsername])

  const CreatedColumn = (opts:any)=>{
    return  (<div>
              <span className={styles.createdTitle}>{moment(opts.created).format('MMMM DD, YYYY')}</span>
              <br/>
              <span className={styles.createdSubtitle}>{moment(opts.created).format('H:mm a').toUpperCase()}</span>
            </div>)
  }


  const getItem = (id:number, index:number)=>{
    let params:any = {}
    if (ShowUsername){
      params["show_username"] = true
      params["password"] = Password
    }
    api.getBlockchainTransaction(id, params).then((response: any) => {
      console.log(response)
    })

  }





  const getItems = ()=>{
    let params:any = {page:CurrentPage}
    if (ShowUsername){
      params["show_username"] = true
      params["password"] = Password
    }
    api.getBlockchainTransactions(params).then((response: any) => {
      if (response.kind === "ok") {
        setPrevious(response.data.previous)
        setNext(response.data.next)
        setTotalItems(response.data.count)
        const tableRows = []
        let index = 0
        for(let data of response.data.results){
          let row:any = {
            id: data.id,
            hash: wrapHash(data.transaction_id),
            fromUsername: wrapHash(data.from_username) ,
            toUsername: <div className={styles.toColumn}><div style={{marginRight:8}}> <ArrowRightIcon /> </div> {wrapHash(data.to_username)}</div>,
            fromAddress:wrapHash(data.from_address),
            toAddress: wrapHash(data.to_address),
            type: data.type,
            createdAt:<CreatedColumn created={data.created}/>,
            amount:data.amount,
            confirmedBlocks: data.confirmations
          }
          if (userStore.group === UserGroup.BANK.code){
            row["show"] = (<div >
                <Button type={"button"} onClick={()=>{
                  setShowUsername(true)
                  getItem(data.id,index )
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

    return (
      <AdminPanelContainer
        search={<SearchInput />}
        onclickFilter={onClickFilter}
        title={"Blockchain Transactions"}
        // filter={   <Filter
        //   bank={BankFilter}
        //   support={SupportFilter}
        //   superAdmin={SuperAdminFilter}
        //   apply={applyFilter}
        //   cancel={cancelFilter}
        //   clearAll={clearFilter}/>}
        navbarTitle={""}

      >

        <Row className={'main-row'}>
          <div className='content'>
            <AdvancedTable
              onClickPage={onClickPage}
              currentPage={CurrentPage}
              totalItems={TotalItems} headerRow={ColumnsTitles}
              deletable={true} paginate={false} rows={Items}
              onNext={onNextPage}
              onPrevious={onPreviousPage}/>
          </div>
        </Row>
      </AdminPanelContainer>
    )
})

export default BlockTransactionsPage;
