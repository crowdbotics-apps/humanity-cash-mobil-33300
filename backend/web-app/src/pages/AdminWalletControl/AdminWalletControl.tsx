import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {PageWeb} from "../../components/PageWeb/PageWeb";
import AdminPanelContainer from "../../containers";
import {Button, Col, Row} from "react-bootstrap";
import {
  ArrowBackIcon, AttachmentIcon,
  FBIcon,
  IncomingIcon,
  InstagramIcon,
  LinkedIn,
  OutgoingIcon,
  TwitterIcon
} from "../../components/icons";
import styles from "./AdminWalletControl.module.css"
import {LinkBankAccountModal} from "./modals";

export const AdminWalletControlPage: React.FC = observer((props) => {
  const navigate = useNavigate()
  const [ShowLinkBankModal, setShowLinkBankModal] = useState(false)

  const MoneyBox = (opts:{kind:"in"|"out", amount:number, label:string})=>{
    const {kind, label, amount}  = opts

    return (
      <div className={`d-flex flex-row align-items-center`}>
        <div>
          {kind === "in" && (
            <IncomingIcon />
          )|| (<OutgoingIcon />)}
        </div>

        <div className={`d-flex flex-column justify-content-center  ms-3`}>
          <div className={styles.moneyBox}>
            {amount} $
          </div>
          <div className={styles.labelBox}>
            {label}
          </div>
        </div>
      </div>)
  }

  return (
    <AdminPanelContainer
      search={<span />}
      filter={<span/>}
      // onclickFilter={onClickFilter}
      title={<div className={styles.title} style={{marginTop:20}}>Round Up Change Wallet</div>}
      // filter={   <Filter
      //   bank={BankFilter}
      //   support={SupportFilter}
      //   superAdmin={SuperAdminFilter}
      //   apply={applyFilter}
      //   cancel={cancelFilter}
      //   clearAll={clearFilter}/>}
      navbarTitle={"Admin Wallet Control"}
    >
      <Row className={'main-row'}>
        <div className={`flex-column d-flex align-items-center ${styles.card}`}>
          <div className={`flex-row col-12 d-flex align-items-center ms-5 mt-4`}>
            <div className={`flex-column col-4 d-flex justify-content-center `}>
              <div className={styles.cardSubtitle}>ROUND UP WALLET</div>
              <div className={styles.cardTitle}>Account Name</div>
              <div>**** **** ****    2864</div>
            </div>

            <div className={`flex-column col-4 d-flex justify-content-center `}>
              <div className={styles.cardSubtitle}>total round up savings</div>
              <div className={`${styles.money} ${styles.moneyInt}`}>8.789<
                span className={`${styles.money} ${styles.moneyDec}`}>,56$</span></div>
            </div>

            <div className={` d-flex col-4 justify-content-center`}>
              <Button  className={`${styles.button} ${styles.buttonSecondary}`}>Select Recipient</Button>
            </div>
          </div>
          <div className={`flex-row d-flex col-12 mt-2 `}>
            <div className={` d-flex col-4 ms-4`}>
              <MoneyBox kind={"in"} amount={325} label={"round up Income"} />
            </div>
            <div className={` d-flex col-4 `}>
              <MoneyBox kind={"out"} amount={325} label={"transferred"} />
            </div>
            <div className={'col-4'}></div>
          </div>
        </div>






        <div className={styles.title} style={{marginTop:20}}>Cash Out Fees Wallet</div>
        <div className={`flex-column d-flex align-items-center ${styles.card}`}>
          <div className={`flex-row col-12 d-flex align-items-center ms-5 mt-4`}>
            <div className={`flex-column col-4 d-flex justify-content-center `}>
              <div className={styles.cardSubtitle}>cash out fees wallet</div>
              <div className={styles.cardTitle}>Account Name</div>
              <div>**** **** ****    2864</div>
            </div>

            <div className={`flex-column col-4 d-flex justify-content-center `}>
              <div className={styles.cardSubtitle}>total round up savings</div>
              <div className={`${styles.money} ${styles.moneyInt}`}>8.789<
                span className={`${styles.money} ${styles.moneyDec}`}>,56$</span></div>
            </div>

            <div className={` d-flex flex-column col-4 justify-content-center align-items-center`}>
              <div className={styles.linkBankAccount}
                   onClick={()=>{
                     setShowLinkBankModal(true)
                   }}>
                <AttachmentIcon color={"var(--green)"}/> Link Bank Account</div>

              <Button className={styles.button}>Send /Transfer</Button>
            </div>
          </div>
          <div className={`flex-row d-flex col-12 mt-2 `}>
            <div className={` d-flex col-4 ms-4`}>
              <MoneyBox kind={"in"} amount={325} label={"cash out fees Income"} />
            </div>
            <div className={` d-flex col-4 `}>
              <MoneyBox kind={"out"} amount={325} label={"transferred"} />
            </div>
            <div className={` d-flex col-4 justify-content-center`}>
              <Button className={`${styles.button} ${styles.buttonSecondary}`}>Redeem to Cash</Button>
            </div>
          </div>
        </div>
      </Row>
      <LinkBankAccountModal show={ShowLinkBankModal} onHide={()=>setShowLinkBankModal(false)} />
    </AdminPanelContainer>
  )
})
