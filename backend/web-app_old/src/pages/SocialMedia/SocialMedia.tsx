import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {PageWeb} from "../../components/PageWeb/PageWeb";
import AdminPanelContainer from "../../containers";
import {Button, Col, Row} from "react-bootstrap";
import {ArrowBackIcon, FBIcon, InstagramIcon, LinkedIn, TwitterIcon} from "../../components/icons";
import styles from "./SocialMedia.module.css"

export const SocialMediaPage: React.FC = observer((props) => {
  const navigate = useNavigate()


  const NavbarLeft = ()=>{
    return (
      <div
        style={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center"}}
        onClick={()=>navigate(-1)}
      >
        <ArrowBackIcon  />
        <div style={{marginLeft:10}}>Contents</div></div>)
  }

  const Card = (opts:{icon:React.ReactNode, title:string, subtitle:string})=>{
    const {icon, title, subtitle} = opts
    return (
      <div className={styles.card}>
        <div className={styles.iconContainer}>
          {icon}
        </div>
        <div className={styles.middleContainer}>
          <div className={styles.title}>{title}</div>
          <div className={styles.subtitle}>{subtitle}</div>
        </div>
        <div className={styles.buttonContainer}>
          <Button className={styles.button}>Connect</Button>
        </div>
      </div>
    )
  }

  return (
    <AdminPanelContainer
      search={<span />}
      filter={<span/>}
      // onclickFilter={onClickFilter}
      title={"Connect Social Media"}
      // filter={   <Filter
      //   bank={BankFilter}
      //   support={SupportFilter}
      //   superAdmin={SuperAdminFilter}
      //   apply={applyFilter}
      //   cancel={cancelFilter}
      //   clearAll={clearFilter}/>}
      navbarTitle={<NavbarLeft/>}
    >
      <Row className={'main-row'}>
        <Col md={6}>
          <Card title={"Facebook"} subtitle={"Lorem ipsum dolor sit amet "} icon={<FBIcon/>}  />
          <Card title={"Instagram"} subtitle={"Lorem ipsum dolor sit amet "} icon={<InstagramIcon />}  />
        </Col>
        <Col>
          <Card title={"Facebook"} subtitle={"Lorem ipsum dolor sit amet "} icon={<FBIcon/>}  />
          <Card title={"LinkedIn"} subtitle={"Lorem ipsum dolor sit amet "} icon={<LinkedIn />}  />
        </Col>
      </Row>
    </AdminPanelContainer>
  )
})
