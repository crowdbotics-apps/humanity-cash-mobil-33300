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

// react-router-dom components
import {NavLink, useLocation, useNavigate} from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";


// Custom styles for the Sidenav
// Material Dashboard 2 PRO React context
import {setIsDrawed, setMiniSidenav, setTransparentSidenav, setWhiteSidenav, useMaterialUIController} from "context";
import SidenavRoot from "./SidenavRoot";
import SidenavItem from "./SidenavItem";
import SidenavCollapse from "./SidenavCollapse";
import SidenavList from "./SidenavList";
import IconButton from "@mui/material/IconButton";
import {useStores} from "../../models";
import {observer} from "mobx-react";


const logoMini = require("../../assets/images/logo-mini.png")
const logo = require("../../assets/images/logo_humanity.png")

function Sidenav({color, brand, brandName, routes, ...rest}) {
  const rootStore = useStores()
  const navigate = useNavigate()
  const {loginStore} = rootStore
  const [openCollapse, setOpenCollapse] = useState(false);
  const [showIcon, setShowIcon] = useState(true);
  const [openNestedCollapse, setOpenNestedCollapse] = useState(false);
  const [controller, dispatch] = useMaterialUIController();
  const {miniSidenav, transparentSidenav, whiteSidenav, darkMode} = controller;
  const location = useLocation();
  const {pathname} = location;
  const collapseName = pathname.split("/").slice(1)[0];
  const items = pathname.split("/").slice(1);
  const itemParentName = items[1];
  const itemName = items[items.length - 1];

  let textColor = "white";

  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = "dark";
  } else if (whiteSidenav && darkMode) {
    textColor = "inherit";
  }

  const closeSidenav = () => [setMiniSidenav(dispatch, true), setIsDrawed(dispatch, false)];
  const openSideNav = () => [setMiniSidenav(dispatch, false), setIsDrawed(dispatch, true)];

  useEffect(() => {
    setOpenCollapse(collapseName);
    setOpenNestedCollapse(itemParentName)
  }, []);

  useEffect(() => {
    // A function that sets the mini state of the sidenav.
    function handleMiniSidenav() {
      if(!miniSidenav) setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav);
      setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav);
    }

    /**
     The event listener that's calling the handleMiniSidenav function when resizing the window.
     */
    window.addEventListener("resize", handleMiniSidenav);

    // Call the handleMiniSidenav function to set the state with the initial value.
    handleMiniSidenav();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

  const iconsStyle = ({palette: {dark, white, text}, functions: {rgba}}) => ({
    color: () => {
      let colorValue = '#000000';
      return colorValue;
    },
  });

  // Render all the nested collapse items from the routes.js
  const renderNestedCollapse = (collapse) => {
    const template = collapse.map(({name, route, key, href}) =>
      href ? (
        <Link
          key={key}
          href={href}
          target="_blank"
          rel="noreferrer"
          sx={{textDecoration: "none"}}
        >
          <SidenavItem name={name} nested/>
        </Link>
      ) : (
        <NavLink to={route} key={key} sx={{textDecoration: "none"}}>
          <SidenavItem name={name} active={route === pathname} nested/>
        </NavLink>
      )
    );

    return template;
  };
  // Render the all the collpases from the routes.js
  const renderCollapse = (collapses) =>
    collapses.map(({name, collapse, route, href, key}) => {
      let returnValue;

      if (collapse) {
        returnValue = (
          <SidenavItem
            key={key}
            color={color}
            name={name}
            active={key === itemParentName ? "isParent" : false}
            open={openNestedCollapse === key}
            onClick={({currentTarget}) =>
              openNestedCollapse === key && currentTarget.classList.contains("MuiListItem-root")
                ? setOpenNestedCollapse(false)
                : setOpenNestedCollapse(key)
            }
          >
            {renderNestedCollapse(collapse)}
          </SidenavItem>
        );
      } else {
        returnValue = href ? (
          <Link
            href={href}
            key={key}
            target="_blank"
            rel="noreferrer"
            sx={{textDecoration: "none"}}
          >
            <SidenavItem color={color} name={name} active={key === itemName}/>
          </Link>
        ) : (
          <NavLink to={route} key={key} sx={{textDecoration: "none"}}>
            <SidenavItem color={color} name={name} active={key === itemName}/>
          </NavLink>
        );
      }
      return <SidenavList key={key}>{returnValue}</SidenavList>;
    });

  // Render all the routes from the routes.js (All the visible items on the Sidenav)
  const renderRoutes = routes.map(
    ({type, name, icon, title, collapse, noCollapse, key, href, route}) => {
      let returnValue;

      if (type === "collapse") {
        if (href) {
          returnValue = (
            <Link
              href={href}
              key={key}
              target="_blank"
              rel="noreferrer"
            >
              <SidenavCollapse
                name={name}
                icon={icon}
                active={key === collapseName}
                noCollapse={noCollapse}
              />
            </Link>
          );
        } else if (noCollapse && route) {
          returnValue = (
            <NavLink
              to={route}
              key={key}
              onClick={miniSidenav && closeSidenav}
            >
              <SidenavCollapse
                name={name}
                icon={icon}
                noCollapse={noCollapse}
                active={key === collapseName}
              >
                {collapse ? renderCollapse(collapse) : null}
              </SidenavCollapse>
            </NavLink>
          );
        } else {
          returnValue = (
            <SidenavCollapse
              key={key}
              name={name}
              icon={icon}
              active={key === collapseName}
              open={openCollapse === key}
              onClick={() => (openCollapse === key ? setOpenCollapse(false) : setOpenCollapse(key))}
            >
              {collapse ? renderCollapse(collapse) : null}
            </SidenavCollapse>
          );
        }
      } else if (type === "title") {
        returnValue = (
          <MDTypography
            key={key}
            color={textColor}
            display="block"
            variant="caption"
            fontWeight="bold"
            textTransform="uppercase"
            pl={3}
            mt={2}
            mb={1}
            ml={1}
          >
            {title}
          </MDTypography>
        );
      } else if (type === "divider") {
        returnValue = (
          <Divider
            key={key}
            light={
              (!darkMode && !whiteSidenav && !transparentSidenav) ||
              (darkMode && !transparentSidenav && whiteSidenav)
            }
          />
        );
      }

      return returnValue;
    }
  );

  useEffect(() => {
    if (!miniSidenav) {
      setTimeout(() => setShowIcon(!miniSidenav), 100)
    }
  }, [miniSidenav])

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{transparentSidenav, whiteSidenav, miniSidenav, darkMode}}
    >
      <MDBox textAlign="center">
        <MDBox display={'flex'} flexDirection={'column'} sx={{height: 80}}>
          <MDBox pl={4} display={'flex'} alignItems={'center'} justifyContent={'flex-start'} mt={'auto'}>
            <div
              style={{
                height: 64,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
              <img src={logoMini} alt="" style={{height: 27, objectFit: 'cover'}}/>
            </div>
            {showIcon && <MDBox ml={1} sx={
               {
                height: 64,
                display: !miniSidenav ? 'flex' : 'none',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <img src={logo} alt="" style={{height: 27, objectFit: 'cover'}}/>
            </MDBox>}
          </MDBox>
        </MDBox>
      </MDBox>
      <List>
        <MDBox display={'flex'} alignItems={'center'} pl={4} mt={4} mb={2} justifyContent={'flex-start'}>
          <IconButton onClick={miniSidenav ? openSideNav : closeSidenav} size="small" disableRipple>
            <Icon fontSize="medium" sx={iconsStyle}>
              {miniSidenav ? "menu_open" : "menu"}
            </Icon>
          </IconButton>
        </MDBox>
        {renderRoutes}
      </List>
    </SidenavRoot>
  );
}

// Setting default values for the props of Sidenav
Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

// Typechecking props for the Sidenav
Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default observer(Sidenav);
