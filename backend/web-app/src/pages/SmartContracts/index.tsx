import React, {useEffect, useState} from 'react';
import { observer } from "mobx-react-lite";
import {Button, Tab, Tabs} from "react-bootstrap";
import AdminPanelContainer from "../../containers";
import {genericApiError} from "../../helpers";
import {useApi, useUserStore} from "../../utils";
import styles from "./SmartContracts.module.css";
import moment from 'moment'
import AdvancedTable from "../../components/Table/AdvancedTable";
import {AUTHORIZATION} from "../../services/constants";
import {truncate} from "../../utils/functions";
type StatusFieldOpts = {
    value:"pending"|"confirmed"|"completed"
}
const Keys = {
    PENDING:"PENDING",
    COMPLETED:"COMPLETED",
}


const wrapHash = (txt:string, )=>{
    if (txt === null) return ''
    txt  = truncate(txt, 23)
    const  middle:number = Math.round(txt.length/2) - 1
    return <div className={styles.textTD}>{txt.slice(0, middle)}<br/>{txt.slice(middle, txt.length)}</div>
}


const SmartContracts: React.FC = observer(() => {
    const [Items, setItems] = useState<any>([])
    const [TotalItems, setTotalItems] = useState(0)
    const [CurrentPage, setCurrentPage] = useState(1)
    const [Previous, setPrevious] = useState<string|null>(null)
    const [Next, setNext] = useState<string|null>(null)
    const [LeftOpen, setLeftOpen] = useState<any>(true);
    //const [RightOpen, setRightOpen] = useState<any>(true);
    const api = useApi()
    const [CurrentTab, setCurrentTab] = useState<string|null>(Keys.COMPLETED)
    const userStore = useUserStore()

    useEffect(() => {

        // @ts-ignore
        api.apisauce.setHeader(AUTHORIZATION, 'Bearer ' + userStore.access_token)
    },[])

    useEffect(() => {
        setItems([])
        getContracts()
    }, [CurrentTab])


    const CreatedColumn = (opts:any)=>{
        return  (
          opts.created !== null?<div>
              <span className={styles.createdTitle}>{moment(opts.created).format('MMMM DD, YYYY')}</span>
              <br/>
              <span className={styles.createdSubtitle}>{moment(opts.created).format('H:mm a').toUpperCase()}</span>
          </div>: null)
    }



    const StatusField = (opts:StatusFieldOpts)=>{

        const {value} = opts

        const getColor = (value:any)=>{
            let color = ""
            if(value === "completed"){
                color = 'var(--green)'
            }else{
                color = 'var(--mustard)'
            }
            return color
        }
        return (
          <span className={styles.decoratedSpan} style={{backgroundColor:getColor(value)}}>
       {value?value.toLowerCase():""}
      </span>
        )
    }

    const ActionButton = ()=>{
        return (
          <div className={'d-flex flex-row justify-content-end'}>
              <Button className={`${styles.actionButton} pull-right`} onClick={()=>{
                  console.log("deactivate")
              }}>
                  Active
              </Button>
          </div>

        )
    }


    const getContracts = ()=> {
        api.getContracts({}).then((response: any) => {
            console.log(response.data)
            if (response.kind === "ok") {
                setPrevious(response.data.previous)
                setNext(response.data.next)
                setTotalItems(response.data.count)
                const tableRows = []
                for (let data of response.data.results) {
                    let row: any = {
                        id: data.id,
                        name: data.contract_name,
                        version: data.version,
                        address: <div className={styles.text}>{wrapHash(data.deployed_address)}</div>,
                        deployedAt: <CreatedColumn created={moment()}/>,
                        status: <StatusField value={"completed"}/>,
                        action:<ActionButton />
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
        title={'Smart Contracts'}
        navbarTitle={""}      >
          <div id='layout'>
              <div id='main' className={`main${LeftOpen ? '' : '-closed'}`}>
                  <div className='content'>

                      <AdvancedTable
                        onClickPage={onClickPage}
                        currentPage={CurrentPage}
                        totalItems={TotalItems}
                        headerRow={['NAME', 'VERSION', 'ADDRESS', 'DEPLOYED AT','STATUS', <div className={'d-flex flex-row justify-content-end me-5'}> ACTION</div>]}
                        deletable={true} paginate={true} rows={Items}
                        onNext={onNextPage}
                        onPrevious={onPreviousPage}/>
                  </div>
              </div>
          </div>
      </AdminPanelContainer>
    )
})


export default SmartContracts;
