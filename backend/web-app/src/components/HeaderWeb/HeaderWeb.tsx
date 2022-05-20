import React from 'react';
import {observer} from "mobx-react-lite";

import './HeaderWeb.css';
import {Container, Dropdown, Nav, Navbar, NavDropdown} from "react-bootstrap";
import bimage from '../../assets/images/background-header.png';

type HeaderWebProps = {
  header_title?: string
  left_action?: any
};

export const HeaderWeb: React.FC<HeaderWebProps> = observer((props) => {
  return (
    <div className={"row mx-0 header-container-bar"}>
      <div className={"col-md-4 col-5 d-flex align-items-center"} style={{backgroundColor: "#FF8A00"}}>
        <b className={"text-white mf-auto ps-2"}>{props?.header_title}</b>
      </div>
      <div className={"col-md-8 col-7 d-flex align-items-center background-style"} style={{ backgroundImage: `url(${bimage})`, backgroundRepeat: "no-repeat"}}>
        <div className={"ms-auto"}>
          {props.left_action && <div className={"d-flex justify-content-center align-items-center button-next-puzzle ms-auto"} onClick={() => props.left_action()}>
            Next puzzle
          </div>}
        </div>
      </div>
    </div>
  )

});

export default HeaderWeb;
