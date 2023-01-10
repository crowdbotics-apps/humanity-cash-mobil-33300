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

import React from "react";
import ReactDOM from "react-dom/client"
import {BrowserRouter} from "react-router-dom";
import App from "App";
import * as Sentry from "@sentry/react";
import {BrowserTracing} from "@sentry/tracing";

// Material Dashboard 2 PRO React Context Provider
import {MaterialUIControllerProvider} from "context";
import StoreApp from "./StoreApp";


if (process.env.NODE_ENV !== 'development'){
  Sentry.init({
    dsn: "https://20b5418e777943358b1e2d05c37aa783@sentry.innovatica.com.py//19",
    integrations: [new BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //  <React.StrictMode>
  <BrowserRouter>
    <MaterialUIControllerProvider>
      <StoreApp>
        <App/>
      </StoreApp>
    </MaterialUIControllerProvider>
  </BrowserRouter>
  // </React.StrictMode>
);
