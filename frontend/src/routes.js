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
import {ReactComponent as Bell} from './assets/svg/notificacion.svg'
import {ReactComponent as Calendar} from './assets/svg/calendar.svg'
import {ReactComponent as People} from './assets/svg/usuarios.svg'
import {ReactComponent as Edit} from './assets/svg/edit.svg'
import {ReactComponent as HandPeople} from './assets/svg/cliente.svg'
import {ReactComponent as Schedule} from './assets/svg/Schedule.svg'
import {ReactComponent as Briefcase} from './assets/svg/Briefcase.svg'
import Services from "./pages/services";
import CalendarPage from "./pages/calendar";
import PendingRequests from "./pages/pending-requests";
import Employees from "./pages/employees";
import Customers from "./pages/customers";
import Teams from "./pages/teams";
import Notifications from "./pages/notifications";
import PendingRequestsNumber from "components/BadgePendingRequests"
import Frequencies from "./pages/frequencies";


const routes = [
  {
    type: "collapse",
    name: "Calendar",
    key: "calendar",
    icon: <Calendar />,
    route: "/calendar/",
    component: <CalendarPage />,
    noCollapse: true
  },

  {
    type: "collapse",
    name: "Services",
    key: "services",
    route: "/services/",
    component: <Services/>,
    icon: <Edit/>,
    noCollapse: true,
  },

  {
    type: "collapse",
    name: "Customers",
    key: "customers",
    route: "/customers/",
    component: <Customers/>,
    icon: <HandPeople/>,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Teams",
    key: "teams",
    route: "/teams/",
    component: <Teams/>,
    icon: <People/>,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Employees",
    key: "employees",
    route: "/employees/",
    component: <Employees/>,
    icon: <Briefcase/>,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Frequencies",
    key: "frequencies",
    route: "/frequencies/",
    component: <Frequencies/>,
    icon: <Schedule/>,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Pending Requests",
    key: "pending-requests",
    route: "/pending-requests/",
    component: <PendingRequests/>,
    icon: <PendingRequestsNumber />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    route: "/notifications/",
    component: <Notifications/>,
    icon: <Bell/>,
    noCollapse: true,
  },
];

export default routes;
