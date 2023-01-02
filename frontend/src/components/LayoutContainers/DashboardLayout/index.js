/**
 =========================================================
 * Material Dashboard 2 PRO React - v2.1.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
 * Copyright 2022 Creative Tim (https://www.creative-tim.com)

 Coded by www.creative-tim.com

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

import React, {useEffect} from "react";

// react-router-dom components
import {Navigate, useLocation} from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";

// Material Dashboard 2 PRO React context
import {setLayout, useMaterialUIController} from "context";
import DashboardNavbar from "../../Navbars/DashboardNavbar";
import Card from "@mui/material/Card";
import {useStores} from "../../../models";
import {observer} from "mobx-react";

function DashboardLayout({children, showCard = false, loginRequired = false, showNavbar=true, fullSize=false}) {
  const [controller, dispatch] = useMaterialUIController();
  const {miniSidenav} = controller;
  const {pathname} = useLocation();
  const rootStore = useStores()
  const {loginStore} = rootStore
  const isLoggedIn = loginStore.isLoggedIn;

  useEffect(() => {
    setLayout(dispatch, "dashboard");
  }, [pathname]);

  const renderCard = (children) => {
    return (
      <Card sx={{backgroundColor: 'rgba(255, 255, 255, 0.95)', opacity:1, padding: 3, display: 'flex', flex: 1, minHeight: '75vh'}}>
        {children}
      </Card>
    )
  }

  const renderMainContent = (children) => {
    return (
      <MDBox
        sx={({breakpoints, transitions, functions: {pxToRem}}) => ({
          p: 0,
          position: "relative",
          opacity:1,
          [breakpoints.up("xl")]: {
            marginLeft: miniSidenav ? pxToRem(96) : pxToRem(250),
            transition: transitions.create(["margin-left", "margin-right"], {
              easing: transitions.easing.easeInOut,
              duration: transitions.duration.standard,
            }),
          },
        })}
      >
        {showNavbar && (<DashboardNavbar/>)}
        {fullSize && (
          children
        )||(
          <div style={{
            height: '100vh',
            width: '100%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'left',
            padding: '11% 3% 2% 3%',
            overflowY: 'scroll'
          }}>
            {showCard ? renderCard(children) : children}
          </div>
        )}
      </MDBox>
    )
  }

  if (!loginRequired || isLoggedIn) {
    return renderMainContent(children);
  } else {
    return <Navigate to='/login'/>;
  }
}

// Typechecking props for the DashboardLayout
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default observer(DashboardLayout);
