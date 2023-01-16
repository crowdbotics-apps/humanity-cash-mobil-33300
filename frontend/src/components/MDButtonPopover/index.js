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

import { forwardRef, useState } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Custom styles for MDButton
import MDButtonRoot from "components/MDButton/MDButtonRoot";
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import MDButton from "components/MDButton";

// Material Dashboard 2 PRO React contexts
import { useMaterialUIController } from "context";
import { CircularProgress } from "@mui/material";

const MDButtonPopover = forwardRef(
  ({ loading, color, variant, size, circular, iconOnly, children, actionList, customPopoverContent, ...rest }, ref) => {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const popoverStyle = { border: "1px solid #3B88B6", borderRadius: "14px", maxWidth: "90vw" }
    const buttonContainerStyle = { display: "flex", flexDirection: "column", padding: "1rem", gap: "1rem" }
    const popoverButtonStyle = {
      margin: 'auto !important',
      minWidth: '200px',
      height: '35px',
      background: '#3C88B7',
      borderRadius: '30px',
      fontWeight: 'bold',
      fontSize: '12px',
      cursor: 'default',
      lineHeight: '75%',
    }

    const [anchor, setAnchor] = useState(null);
    const openPopover = (event) => {
      event.preventDefault()
      setAnchor(event.currentTarget);
    };

    return (
      <div>
        <MDButtonRoot
          {...rest}
          ref={ref}
          onClick={openPopover}
          color="primary"
          variant={variant === "gradient" ? "contained" : variant}
          size={size}
          ownerState={{ color, variant, size, circular, iconOnly, darkMode }}
        >
          {loading ? <CircularProgress color="inherit" size={15} /> : children}
        </MDButtonRoot>
        <Popover
          sx={{
            '.MuiPopover-paper': {
              border: "1px solid #3B88B6",
              borderRadius: "14px",
              maxWidth: "90vw",
              background: 'white',
              marginTop: "2px"
            },
          }}
          open={Boolean(anchor)}
          onClick={() => setAnchor(null)}
          anchorEl={anchor}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <div style={buttonContainerStyle}>
            {customPopoverContent
              ? customPopoverContent
              : Array.isArray(actionList) && actionList.map((action, idx) =>
                <MDButton key={`key_btn_${idx}`} style={popoverButtonStyle} color="primary" onClick={action.action} disabled={action.disabled}>
                  {action.label}
                </MDButton>
              )
            }
          </div>
        </Popover>
      </div>
    );
  }
);

// Setting default values for the props of MDButtonPopover
MDButtonPopover.defaultProps = {
  size: "medium",
  variant: "contained",
  color: "white",
  circular: false,
  iconOnly: false,
};

// Typechecking props for the MDButtonPopover
MDButtonPopover.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  variant: PropTypes.oneOf(["text", "contained", "outlined", "gradient", "standard"]),
  color: PropTypes.oneOf([
    "white",
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "pink",
    "light",
    "dark",
  ]),
  circular: PropTypes.bool,
  iconOnly: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default MDButtonPopover;
