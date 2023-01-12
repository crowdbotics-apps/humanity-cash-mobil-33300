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

/**
 All of the routes for the Material Dashboard 2 PRO React are added here,
 You can add a new route, customize the routes and delete the routes here.

 Once you add a new route on this file it will be visible automatically on
 the Sidenav.

 For adding a new route you can follow the existing routes in the routes array.
 1. The `type` key with the `collapse` value is used for a route.
 2. The `type` key with the `title` value is used for a title inside the Sidenav.
 3. The `type` key with the `divider` value is used for a divider between Sidenav items.
 4. The `name` key is used for the name of the route on the Sidenav.
 5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
 6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
 7. The `collapse` key is used for making a collapsible item on the Sidenav that contains other routes
 inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
 8. The `route` key is used to store the route location which is used for the react router.
 9. The `href` key is used to store the external links location.
 10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
 10. The `component` key is used to store the component of its route.
 */


// Material Dashboard 2 PRO React components
// @mui icons
import Services from "./pages/dashboard";

import Logout from "./pages/logout";
import {ROUTES} from "./services/constants";
import {
  BlockChainIcon,
  CarsRemoveIcon,
  CashoutIcon,
  DashboardIcon, DocumentIcon, LogoutIcon,
  NoteIcon,
  ReconciliationIcon, SubtAdminIcon,
  UsersIcons, WalletIcon
} from "./assets/svg";
import BlockchainTransactions from "./pages/blockchain-transactions";
import ReconciliationActionsPage from "./pages/reconciliation-actions";
import ContentsPage from "./pages/contents";
import SmartContracts from "./pages/smart-contracts";
import Users from "./pages/users";
import AdminPortal from "./pages/admin-portal";
import TransactionStatus from "./pages/transactions-status";
import ACHTransactions from "./pages/ach-transactions";
import AdminWalletControl from "./pages/admin-wallet";


const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboard/",
    component: <Services/>,
    icon: <DashboardIcon />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Reconciliation Action",
    key: "reconciliation",
    route: "/reconciliation/",
    component: <ReconciliationActionsPage/>,
    icon: <ReconciliationIcon/>,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Transaction Status",
    key: "transaction-status",
    route: "/transaction-status/",
    component: <TransactionStatus/>,
    icon: <CashoutIcon/>,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "ACH Transaction",
    key: "ach-transactions",
    route: "/ach-transactions/",
    component: <ACHTransactions/>,
    icon: <CarsRemoveIcon/>,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Blockchain Transactions",
    key: "blockchain-transactions",
    route: "/blockchain-transactions/",
    component: <BlockchainTransactions/>,
    icon: <BlockChainIcon/>,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Users",
    key: "users",
    route: "/users/",
    component: <Users/>,
    icon: <UsersIcons />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Smart Contracts",
    key: "smart-contracts",
    route: "/smart-contracts/",
    component: <SmartContracts/>,
    icon: <NoteIcon/>,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Content",
    key: "content",
    route: "/content/",
    component: <ContentsPage/>,
    icon: <DocumentIcon/>,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Admin Employees",
    key: "admin-employees",
    route: "/admin-employees/",
    component: <AdminPortal/>,
    icon: <SubtAdminIcon/>,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Admin Wallet Control",
    key: "admin-wallet",
    route: "/admin-wallet/",
    component: <AdminWalletControl/>,
    icon: <WalletIcon/>,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Sign out",
    key: "sing-out",
    route: ROUTES.LOGOUT,
    component: <Logout/>,
    icon: <LogoutIcon/>,
    noCollapse: true,
  },
];

export default routes;
