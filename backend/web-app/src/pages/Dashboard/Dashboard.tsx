import React, {useState} from 'react';
import {observer} from "mobx-react-lite";
import styles from './Dashboard.module.css';
import AdminPanelContainer from "../../containers";
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from 'chart.js';
import {Pie} from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
    labels: [],
    legend:{
        display:false
    },

    datasets: [
        {
            data: [3635.22, 3500.33],
            tooltips: {
                enabled: true,
                callbacks: {
                    label:"hola"
                }
            },
            backgroundColor: [
                '#1c638d',
                '#9DA56F',
            ],
            borderColor: [
                '#1c638d',
                '#9DA56F',
            ],
            borderWidth: 1,
        },
    ],
};

const plugins = {
    tooltip: {
        usePointStyle: true,
        callbacks: {
            labelPointStyle: function(context:any) {
                return {
                    pointStyle: 'triangle',
                    rotation: 0
                };
            }
        }
    }
}
const addCommas = (num:number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");


export const Dashboard: React.FC = observer(() => {

    const [LeftOpen, setLeftOpen] = useState<any>(true);
    const [RightOpen, setRightOpen] = useState<any>(true);

    const Dot = (opts:any)=>{
        const {color} = opts
        return (
          <div className={styles.dot} style={{backgroundColor:color}}>
          </div>
        )
    }



    const AmountField = (opts:any)=>{
        const {label, amount, color,backgroundColor} = opts
        let style:any = { borderColor:color, color:color}
        if(backgroundColor){
            style.color = "white"
            style["backgroundColor"] = backgroundColor
        }
        return (
          <div className={'d-flex flex-column justify-content-center ms-4 me-4 mt-4'}>
              <h2 className={`text-uppercase ${styles.amountLabel}`}>{label}</h2>
              <div className={`${styles.amountContainer}`} style={style}>
                  ${addCommas(amount)}
              </div>
          </div>
        )
    }

    return (
      <AdminPanelContainer navbarTitle={"Dashboard"} title={''} >
          <div className={'d-flex flex-row justify-content-between'} >
              <div className={`d-flex flex-column col-md-5 col-sm-12 ${styles.colContainer}`} >
                  <div className={`${styles.title} mt-2`}>Total Deposits vs total Tokens Outstanding</div>
                  <div className={'ms-4 mt-2 mb-2'}>Lorem ipsum dolor sit amet.</div>
                  <div className={'d-flex flex-row ms-4 align-items-center mt-2 '} style={{color:"var(--gray)", fontSize:16}}> <Dot color={"var(--blue-dark)"} />Total Deposits</div>
                  <div className={'d-flex flex-row ms-4 align-items-center mt-2 '}  style={{color:"var(--gray)", fontSize:16}}> <Dot color={"var(--green-dark)"} />Total Tokens Outstanding</div>
                  <div className={styles.pieContainer}>
                      <Pie   data={data} style={{maxHeight:300, maxWidth:300}}/>

                  </div>
              </div>


              <div className={`d-flex flex-column col-md-7 col-sm-12 ms-4 ${styles.colContainer}`}>
                  <div className={`${styles.title} mt-2`}>Redemption Fees</div>
                  <div className={'ms-4 mt-2 mb-2'}>Lorem ipsum dolor sit amet.</div>

              </div>
          </div>
          <div style={{backgroundColor:"white", width:"100%", marginTop:50}}>

              <div className={`d-flex flex-row ${styles.borderBottom}`} >
                  <div className={'col-md-3 sol-sm-6 d-flex flex-column justify-content-between'}>
                      <AmountField
                        amount={250000}
                        label={"total cumulative deposits (settled)"}
                        color={"var(--green)"}
                      />

                      <AmountField
                        amount={250000}
                        label={"total cumulative tokens (minted)"}
                        color={"var(--green)"}
                      />
                  </div>

                  <div className={'col-md-3 col-sm-6 d-flex flex-column'}>
                      <AmountField
                        amount={8000}
                        label={"total cumulative deposits (settled)"}
                        color={"var(--pink)"}
                      />

                      <AmountField
                        amount={10000}
                        label={"total cumulative tokens (minted)"}
                        color={"var(--pink)"}
                      />
                  </div>

                  <div className={'col-md-3 col-sm-6 d-flex flex-column  justify-content-between'}>
                      <AmountField
                        amount={8000}
                        label={"net deposits"}
                        color={"var(--green)"}
                      />

                      <AmountField
                        amount={10000}
                        label={"total tokens outstanding"}
                        color={"var(--green)"}
                      />
                  </div>

                  <div className={'col-md-3 col-sm-6 d-flex flex-column justify-content-center'}>
                      <AmountField
                        amount={2000}
                        label={"total tokens outstanding"}
                        color={"var(--green)"}
                        backgroundColor={"var(--green)"}
                      />
                  </div>

              </div>
              <div className={`d-flex flex-row `} >
                  <div className={'col-md-3 col-sm-6 d-flex flex-column  justify-content-between'}>
                      <AmountField
                        amount={5000}
                        label={"TOTAL PENDING DEPOSITS"}
                        color={"var(--green)"}
                      />
                  </div>
                  <div className={'col-md-3 col-sm-6 d-flex flex-column  justify-content-between'}>

                      <AmountField
                        amount={2000}
                        label={"TOTAL PENDING WITHDRAWALS"}
                        color={"var(--pink)"}
                      />
                  </div>
              </div>
          </div>
          <div style={{marginTop:200}}></div>
      </AdminPanelContainer>
    );
});

export default Dashboard;
