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

import {useEffect} from "react";

// react-router components
import {useLocation} from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";


// Material Dashboard 2 PRO React context
import {setMiniSidenav, setTransparentNavbar, useMaterialUIController,} from "context";
import {navbar, navbarContainer, navbarMobileMenu, navbarRow} from "./styles";
import MDTypography from "../../../components/MDTypography";
import {observer} from "mobx-react";
import {Grid, Input} from "@mui/material";
import {Search} from "@mui/icons-material";
import MDButton from "../../MDButton";

const logo = require("../../../assets/images/logo.png")

function DashboardNavbar({absolute, light, isMini}) {
  const [controller, dispatch] = useMaterialUIController();
  const {miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode, isDrawed} = controller;
  const route = useLocation().pathname.split("/").slice(1);

  useEffect(() => {

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /**
     The event listener that's calling the handleTransparentNavbar function when
     scrolling the window.
     */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);


  // Styles for the navbar icons
  const iconsStyle = ({palette: {dark, white, text}, functions: {rgba}}) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  return (
    <AppBar
      color="inherit"
      sx={[(theme) => navbar(theme, {transparentNavbar, absolute, light, darkMode}),]}
    >
      <Toolbar sx={[(theme) => navbarContainer(theme)]}>
        <MDBox
          color="inherit"
          mb={{xs: 1, md: 0}}
          sx={[(theme) => navbarRow(theme, {isMini}), {marginLeft: isDrawed ? '18%' : '7%', transition: '0.3s'}]}>
          <MDTypography sx={{
            fontSize: 32,
            color: '#3B88B6',
            textTransform: 'capitalize',
            fontWeight: 700,
          }}>
            {route[0].replace(/-/g, ' ')}
          </MDTypography>
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, {isMini})}>
            <MDBox mr={4}>
              {!(window.innerWidth < 1200) &&
                <Grid container>
                  <MDBox sx={{backgroundColor: '#EBEBEB', borderRadius: 2, position: 'relative'}} px={5} mr={4}>
                    <Search style={{position: 'absolute', bottom: 8, left: 10}}/>
                    <Input
                      // ref={searchQueryBarRef}
                      // inputRef={searchQueryRef}
                      fullWidth
                      placeholder="Search"
                      type="text"
                      sx={{height: 40, width: 300}}
                      // onInputCapture={prepareCall}
                    />
                  </MDBox>
                  <MDButton variant="standard" color="dark" iconOnly>
                    <Icon sx={{ fontWeight: "bold" }}>tune</Icon>
                  </MDButton>
                </Grid>
                }
            </MDBox>
            <MDBox color={light ? "white" : "inherit"}>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
            </MDBox>
          </MDBox>
        )}

      </Toolbar>
      <MDBox sx={{
        marginLeft: isDrawed ? '18%' : '7%',
        width: isDrawed ? '79%': '92%',
        transition: '0.3s',
        height: 2,
        backgroundColor: '#3B88B6',
        marginTop: 5
      }}/>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default observer(DashboardNavbar);
