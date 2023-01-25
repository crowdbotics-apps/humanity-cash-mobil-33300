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
import {useStores} from "../../../models";
import {observer} from "mobx-react";
import {ProgressLoading} from "../../ProgressLoading";

function DashboardLayout({
                           children,
                           loginRequired = false,
                           showNavbar = true,
                           fullSize = false,
                           searchFunc = null,
                           loading,
                           title = null,
                           goBack = null,
                           filterContent = null
                         }) {

  const [controller, dispatch] = useMaterialUIController();
  const {miniSidenav} = controller;
  const {pathname} = useLocation();
  const rootStore = useStores()
  const {loginStore} = rootStore
  const isLoggedIn = loginStore.isLoggedIn;

  useEffect(() => {
    setLayout(dispatch, "dashboard");
  }, [pathname]);

  const renderMainContent = (children) => {
    return (
      <MDBox
        sx={({breakpoints, transitions, functions: {pxToRem}}) => ({
          p: 0,
          position: "relative",
          opacity: 1,
          [breakpoints.up("xl")]: {
            marginLeft: miniSidenav ? pxToRem(96) : pxToRem(250),
            transition: transitions.create(["margin-left", "margin-right"], {
              easing: transitions.easing.easeInOut,
              duration: transitions.duration.standard,
            }),
          },
        })}
      >
        {showNavbar &&
          <DashboardNavbar
            searchFunc={searchFunc}
            title={title}
            goBack={goBack}
            loading={loading}
            filterContent={filterContent}
          />
        }
        {fullSize
          ? children
          : <div style={{
            width: '100%',
            overflowY: 'scroll',
            marginTop: 70,
            padding: '0 30px 0 50px',
          }}>
            <MDBox sx={{
              width: '100%',
              transition: '0.3s',
              height: 2,
              backgroundColor: '#3B88B6',
              marginTop: 5
            }} />
            {children}
            <ProgressLoading show={loading}/>
          </div>
        }
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
