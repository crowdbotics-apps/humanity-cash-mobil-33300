import React, {useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import styles from './Dashboard.module.css';
import AdminPanelContainer from "../../containers";
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from 'chart.js';
import {Pie} from 'react-chartjs-2';
import {useApi} from "../../utils";
import {Table} from "react-bootstrap";
import AdvancedTable, {ADV_DELETE_FIELD_NAME, AdvancedTableHeader} from "../../components/Table/AdvancedTable";
import Collapse from 'react-bootstrap/Collapse';
import {ChevronDownIcon} from "../../components/icons";
import Fade from 'react-bootstrap/Fade';

const addCommas = (num:number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");


export const Dashboard: React.FC = observer(() => {
    const [CurrentRow, setCurrentRow] = useState("")
    const [TodayItems, setTodayItems] = useState<any>([])
    const [Items, setItems] = useState<any>([])
    const [ShowDetail, setShowDetail] = useState(false)
    const [TodayItemsDetail, setTodayItemsDetail] = useState<any>([])
    const api = useApi()

    const TITLES = [
        '',
        <div className={styles.tableTitle}>BANK A</div>,
        <div className={styles.tableTitle}>BANK B</div>,
        <div className={styles.tableTitle}>TOTAL</div>,
        <div className={styles.tableTitle}>b$ OUTSTANDING</div>,
        <div className={styles.tableTitle}>RESERVE &gt;= TOKENS?</div>,
        <div className={styles.tableTitle}>DIFFERENCCE</div>,
    ]

    const DETAILS_TITLES = [
        '',
        <div className={styles.tableTitle}>BANK A</div>,
        <div className={styles.tableTitle}>BANK B</div>,
        <div className={styles.tableTitle}>TOTAL</div>,
        <div className={styles.tableTitle}></div>,
        <div className={styles.tableTitle}>TOTAL</div>,
        <div className={styles.tableTitle}>RESERVE &gt;= TOKENS?</div>,
        <div className={styles.tableTitle}>DIFFERENCCE</div>,
        <div className={styles.tableTitle}>COMMENTS</div>,
    ]

    const DetailRow = (props:any, index:number, key:string)=>{
        const {title1, bankA, borderTopColor, bankB, total1, total2, title2, rowColor, reserve,difference, comments} = props
        return (
          <tr style={{borderTop:"1px solid "+borderTopColor}}>
              <td><div style={{color:rowColor,  fontSize:"14px", maxWidth:"160px",fontWeight:500}}>{title1}</div></td>
              <td> <div style={{fontWeight:500, fontSize:"14px",height:"40px", display:"flex", alignItems:"center"}}>$ {addCommas(bankA)}</div></td>
              <td><div style={{fontWeight:500, fontSize:"14px",height:"40px", display:"flex", alignItems:"center"}}>$ {addCommas(bankB)}</div></td>
              <td><div style={{fontWeight:500, fontSize:"14px",height:"40px", display:"flex", alignItems:"center"}}>$ {addCommas(total1)}</div></td>
              <td><div style={{color:rowColor, fontWeight:500, fontSize:"14px", maxWidth:"120px"}}> {title2}</div></td>
              <td><div style={{fontWeight:500, fontSize:"14px", height:"40px", display:"flex", alignItems:"center"}}>$ {addCommas(total2)}</div></td>
              <td><div style={{fontWeight:500, fontSize:"14px", height:"40px", display:"flex", alignItems:"center", justifyContent:"center"}}>{reserve}</div></td>
              <td><div style={{fontWeight:500, fontSize:"14px", height:"40px", display:"flex", alignItems:"center"}}>$ {addCommas(difference)}</div></td>
              <td><div style={{fontWeight:500, fontSize:"14px", maxWidth:"200px"}}> {addCommas(comments)}</div></td>
          </tr>
        )
    }
    useEffect(() => {
        setTodayItems([{
            title:<div style={{color:"var(--green-dark)", fontWeight:"bold"}}>Today's Date <ChevronDownIcon /></div>,
            bankA:<div style={{fontWeight:500, fontSize:"14px"}}>$ {addCommas(100000.00)}</div>,
            bankB:<div style={{fontWeight:500, fontSize:"14px"}}>$ {addCommas(0.00)}</div>,
            total:<div style={{fontWeight:500, fontSize:"14px"}}>$ {addCommas(0.00)}</div>,
            outstanding:<div style={{fontWeight:500, fontSize:"14px"}}>$ {addCommas(0.00)}</div>,
            reserve:<div style={{fontWeight:500, fontSize:"14px"}}>Yes</div>,
            difference:<div style={{fontWeight:500, fontSize:"14px"}}>$ {addCommas(60000.50)}</div>,
        }])


        setItems([
            {
                title:<div style={{color:"var(--green-dark)", fontWeight:"bold"}}>Beginning balance (1/1/2022) <ChevronDownIcon/></div>,
                bankA:<div style={{fontWeight:500, fontSize:"14px"}}>$ {addCommas(30000.00)}</div>,
                bankB:<div style={{fontWeight:500, fontSize:"14px"}}>$ {addCommas(30000.00)}</div>,
                total:<div style={{fontWeight:500, fontSize:"14px"}}>$ {addCommas(600000.00)}</div>,
                outstanding:<div style={{fontWeight:500, fontSize:"14px"}}>$ {addCommas(0.00)}</div>,
                reserve:<div style={{fontWeight:500, fontSize:"14px"}}>Yes</div>,
                difference:<div style={{fontWeight:500, fontSize:"14px"}}>$ {addCommas(60000.50)}</div>,
            },
            {
                title:<div style={{color:"var(--green-dark)", fontWeight:"bold"}}>Ending balance (1/31/2022)</div>,
                bankA:<div style={{fontWeight:500, fontSize:"14px"}}>$ {addCommas(30000.00)}</div>,
                bankB:<div style={{fontWeight:500, fontSize:"14px"}}>$ {addCommas(30000.00)}</div>,
                total:<div style={{fontWeight:500, fontSize:"14px"}}>$ {addCommas(600000.00)}</div>,
                outstanding:<div style={{fontWeight:500, fontSize:"14px"}}>$ {addCommas(0.00)}</div>,
                reserve:<div style={{fontWeight:500, fontSize:"14px"}}>Yes</div>,
                difference:<div style={{fontWeight:500, fontSize:"14px"}}>$ {addCommas(60000.50)}</div>,
            },

            {
                title:<div style={{color:"var(--green-dark)", fontWeight:"bold"}}>Beginning balance (2/1/2022)<ChevronDownIcon/></div>,
                bankA:<div style={{fontWeight:500, fontSize:"14px"}}>$ {addCommas(30000.00)}</div>,
                bankB:<div style={{fontWeight:500, fontSize:"14px"}}>$ {addCommas(30000.00)}</div>,
                total:<div style={{fontWeight:500, fontSize:"14px"}}>$ {addCommas(600000.00)}</div>,
                outstanding:<div style={{fontWeight:500, fontSize:"14px"}}>$ {addCommas(0.00)}</div>,
                reserve:<div style={{fontWeight:500, fontSize:"14px"}}>Yes</div>,
                difference:<div style={{fontWeight:500, fontSize:"14px"}}>$ {addCommas(60000.50)}</div>,
            },
            {
                title:<div style={{color:"var(--green-dark)", fontWeight:"bold"}}>Ending balance (2/28/2022)</div>,
                bankA:<div style={{fontWeight:500, fontSize:"14px"}}>$ {addCommas(30000.00)}</div>,
                bankB:<div style={{fontWeight:500, fontSize:"14px"}}>$ {addCommas(30000.00)}</div>,
                total:<div style={{fontWeight:500, fontSize:"14px"}}>$ {addCommas(600000.00)}</div>,
                outstanding:<div style={{fontWeight:500, fontSize:"14px"}}>$ {addCommas(0.00)}</div>,
                reserve:<div style={{fontWeight:500, fontSize:"14px"}}>Yes</div>,
                difference:<div style={{fontWeight:500, fontSize:"14px"}}>$ {addCommas(60000.50)}</div>,
            },

        ])






        setTodayItemsDetail([
            {
                rowColor:"#9DA56F",

                title1:"Total Deposits Settled to date",
                bankA: 1234,
                bankB: 1234.43,
                total1: 1234.34,
                title2:'Total tokens minted to date',
                total2:12334,
                difference:12334,
                reserve:"Yes",
                comments:'Specila B$ 60,000 mint\n' +
                  '(matched by $60,000 in\n' +
                  'manual deposit)'
            },
            {
                rowColor:"var(--blue)",
                title1:"Total Withdrawals settled to date",
                bankA: 1234,
                bankB: 1234.43,
                total1: 1234.34,
                title2:'Total tokens minted to date',
                total2:12334,
                difference:12334,
                reserve:<div style={{color:"var(--pink)"}}>No</div>,
                comments:''
            },
            {
                borderTopColor:'var(--orange)',
                rowColor:"var(--mustard)",
                title1:"Total Withdrawals settled to date",
                bankA: 1234,
                bankB: 1234.43,
                total1: 1234.34,
                title2:'Total tokens minted to date',
                total2:12334,
                difference:12334,
                reserve:<div style={{color:"var(--pink)"}}>No</div>,
                comments:''
            }

        ])

    },[])



    const renderTR = (row:any, index:number, key:string)=>{
        return (
          <tr className={styles.tableRow} key={'table-row-'+index}
              onClick={(row)=>{
                  setShowDetail(prevState => !prevState)
              }}
          >
              {Object.keys(row).map((k, index2) => renderTD(k, row[k], index, index2) )}
          </tr>
        )
    }


    const renderTD = (fieldName:string, field:any, index1:number, index2:number)=>{
        let className = `${styles.tableData} adv-table-td  adv-table-td-${fieldName} `

        return (
          <>
              {fieldName === "id"? null : (
                <td key={`body-td-${index1}-${index2}`} className={className}>
                    {field }
                </td>

              )}
          </>
        )
    }



    return (
      <AdminPanelContainer navbarTitle={"Dashboard"} title={''} >
          <div className="title-h4"style={{marginTop:"-40px"}}>Banks</div>

          <div style={{ display:'flex', justifyContent:"flex-start", flexDirection:'column'}}>
              <Table  className={'mt-0'} >
                  <AdvancedTableHeader headers={TITLES} deletable={false}/>
                  <tbody>
                  {TodayItems.map((row:any, index:number)=>renderTR(row, index, 'today'))}
                  {ShowDetail && (
                    <tr className={ShowDetail?styles.showDetails:styles.hideDetails}>
                        <td colSpan={7} style={{border:"1px solid var(--gray)", borderRadius:"20px"}}>
                            <Table  className={'mt-0'}  >
                                <AdvancedTableHeader headers={DETAILS_TITLES} deletable={false}/>
                                <tbody>
                                {TodayItemsDetail.map((row:any, index:number)=>DetailRow(row, index, 'all'))}
                                </tbody>
                            </Table>
                        </td>

                    </tr>
                  )}
                  </tbody>
              </Table>

              <Table  className={'mt-2'} >
                  <AdvancedTableHeader headers={TITLES} deletable={false}/>
                  <tbody>
                  {Items.map((row:any, index:number)=>renderTR(row, index, 'all'))}
                  </tbody>
              </Table>

          </div>





          <div style={{marginTop:200}} />
      </AdminPanelContainer>
    );
});

export default Dashboard;
