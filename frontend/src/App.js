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

import {useEffect, useState} from "react";

// react-router components
import {Navigate, Route, Routes, useLocation} from "react-router-dom";

// @mui material components
import {ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import theme from "assets/theme";

import routes from "routes";

import {useMaterialUIController} from "context";

import 'chart.js/auto';

import SignIn from "./pages/sign-in";
import Logout from "./pages/logout";
import Sidenav from "./components/Sidenav";
import {ROUTES} from "./services/constants";
import ForgotPassword from "./pages/forgot-password";
import ResetPassword from "./pages/reset-password";
import NotFound from "./pages/not-found";
import TermsAndCondition from "./pages/terms-and-conditions";
import PrivacyPolicy from "./pages/privacy-policy";
import ProfileDetail from "./pages/profile-detail";
import ProfileEdit from "./pages/profile-edit";
import {setupRootStore} from "./models";

import icon from './assets/icons/favicon.png';
import {observer} from "mobx-react";


function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    direction,
    layout,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const {pathname} = useLocation();

  const [rootStore, setRootStore] = useState(undefined)
  const [isLoggedIn, setIsLoggedIn] = useState(false)


  useEffect(() => {
    const favicon = document.getElementById('favicon');
    favicon.setAttribute('href', icon);
  }, []);

  useEffect(() => {
    (async () => {
      setupRootStore().then((rootStore)=>{
        setRootStore(rootStore)
        setIsLoggedIn(rootStore.loginStore.isLoggedIn)
      })
    })()
  }, [])


  useEffect(() => {
    if(rootStore){
      rootStore.loginStore.setUp()
    }
  },[rootStore])


  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key}/>;
      }

      return null;
    });


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode)}
            brandName=""
            routes={routes}
          />
        </>
      )}
      <Routes>
        {getRoutes(routes)}
        <Route path={ROUTES.LOGIN} element={<SignIn />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={ROUTES.SET_NEW_PASSWORD} element={<ResetPassword />} />
        <Route path={ROUTES.TERMS_AND_CONDITIONS} element={<TermsAndCondition />} />
        <Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicy />} />
        <Route path={ROUTES.MY_PROFILE} element={<ProfileDetail />} />
        <Route path={ROUTES.EDIT_PROFILE} element={<ProfileEdit />} />
        <Route path={ROUTES.LOGOUT} element={<Logout />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Navigate to={ROUTES.CALENDAR} replace />} />
      </Routes>
    </ThemeProvider>
  )
}

export default observer(App);
