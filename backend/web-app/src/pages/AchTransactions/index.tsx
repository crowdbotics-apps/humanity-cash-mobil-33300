import React, {useEffect, useState} from 'react';
import { observer } from "mobx-react-lite";
import SimpleTable from '../../components/Table'
import {Tab, Tabs} from "react-bootstrap";
import {dataCompleted} from './constants';
import AdminPanelContainer from "../../containers";
import {genericApiError} from "../../helpers";
import {useApi} from "../../utils";
import styles from "./AchTransactions.module.css";
import moment from 'moment'
import AdvancedTable from "../../components/Table/AdvancedTable";
type StatusFieldOpts = {
    value:"pending"|"confirmed"|"completed"
}
const Keys = {
    PENDING:"PENDING",
    COMPLETED:"COMPLETED",
}
const AchTransactions: React.FC = observer(() => {
    const [Items, setItems] = useState<any>([])
    const [TotalItems, setTotalItems] = useState(0)
    const [CurrentPage, setCurrentPage] = useState(1)
    const [Previous, setPrevious] = useState<string|null>(null)
    const [Next, setNext] = useState<string|null>(null)
    const [LeftOpen, setLeftOpen] = useState<any>(true);
    //const [RightOpen, setRightOpen] = useState<any>(true);
    const api = useApi()
    const [CurrentTab, setCurrentTab] = useState<string|null>(Keys.COMPLETED)

    useEffect(() => {
        setItems([])
        getACHTransactions()
    }, [CurrentTab])


    const CreatedColumn = (opts:any)=>{
        return  (
          opts.created !== null?<div>
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


    const getACHTransactions = ()=> {
        const status = CurrentTab === Keys.PENDING?"pending":"processed"
        api.getACHTransactions({status:status}).then((response: any) => {
            if (response.kind === "ok") {
                setPrevious(response.data.previous)
                setNext(response.data.next)
                setTotalItems(response.data.count)
                const tableRows = []
                for (let data of response.data.results) {
                    let row: any = {
                        id: data.id,
                        ach_id: data.ach_id,
                        type: <TransactionType value={data.type.toLowerCase()}/>,
                        user: "username",
                        createdAt: <CreatedColumn created={data.created_at}/>,
                        confirmedAt: <CreatedColumn created={data.confirmed_at}/>,
                        bank: "Bank name",
                        currentsBank: "Currents Bank",
                        amount: <AmountField option={data.type.toLowerCase()} amount={data.amount}/>,
                        status: <StatusField value={data.status}/>
                    }
                    tableRows.push(row)
                }
                setItems(tableRows)

            }
        }).catch((error: any) => {
            genericApiError()
        })
    }

    const onClickPage = (page:number)=>{
        setCurrentPage(page)
    }

    const onPreviousPage = ()=>{
        if(Previous){
            setCurrentPage(prevState => prevState-1)
        }
    }




    const onNextPage = ()=>{
        if(Next){
            setCurrentPage(prevState => prevState+1)
        }
    }

    return (
      <AdminPanelContainer
        title={'ACH Transactions'}
        navbarTitle={""}      >
          <div id='layout'>
              <div id='main' className={`main${LeftOpen ? '' : '-closed'}`}>
                  <div className='content'>
                      <Tabs defaultActiveKey={Keys.COMPLETED}
                            onSelect={(k)=>setCurrentTab(k)}
                            id="uncontrolled-tab-example" className="mb-3 ">
                          <Tab eventKey={Keys.COMPLETED} title="COMPLETED" style={{ color: '#808080' }}>
                              {CurrentTab === Keys.COMPLETED && (
                                <AdvancedTable
                                  onClickPage={onClickPage}
                                  currentPage={CurrentPage}
                                  totalItems={TotalItems}
                                  headerRow={['ID', 'TYPE', 'CREATED AT', 'CONFIRMED AT', 'BANK',<div> RESERVE BANK</div>, 'AMOUNT']}
                                  deletable={true} paginate={true} rows={Items}
                                  onNext={onNextPage}
                                  onPrevious={onPreviousPage}/>
                              )}
                          </Tab>
                          <Tab eventKey={Keys.PENDING} title="PENDING" style={{ color: '#808080' }} >
                              {CurrentTab === Keys.PENDING && (
                                <AdvancedTable
                                  onClickPage={onClickPage}
                                  currentPage={CurrentPage}
                                  totalItems={TotalItems}
                                  headerRow={['ID', 'TYPE', 'CREATED AT', 'CONFIRMED AT', 'BANK',<div> RESERVE BANK</div>, 'AMOUNT']}
                                  deletable={true} paginate={true} rows={Items}
                                  onNext={onNextPage}
                                  onPrevious={onPreviousPage}/>
                              )}
                          </Tab>
                      </Tabs>
                  </div>
              </div>
          </div>
      </AdminPanelContainer>
    )
})


export default AchTransactions;
