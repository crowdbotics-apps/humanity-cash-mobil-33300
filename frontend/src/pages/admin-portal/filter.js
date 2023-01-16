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
import MDTypography from "components/MDTypography";
import Checkbox from "@mui/material/Checkbox";
import MDBox from "components/MDBox";

// Material Dashboard 2 PRO React contexts
import { useMaterialUIController } from "context";
import { CircularProgress } from "@mui/material";

const MDFilterButtonPopover = forwardRef(
    ({ loading, color, variant, size, circular, iconOnly, children, actionList, filterOptions, buttonActions = {}, ...rest }, ref) => {
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

        const action = (func) => {
            func.call()
            setAnchor(null)
        }

        // POPOVER 
        const filterContent = <MDBox>
            <MDBox width={500} display={'flex'} alignItems={'center'}>
                {filterOptions.map((f, i) =>
                    <MDBox key={`filter__${i}`} width={'33%'} style={{ justifyContent: 'center' }} display={'flex'} alignItems={'center'}>
                        <MDTypography variant="h6" fontWeight="medium">
                            {f.label}
                        </MDTypography>
                        <Checkbox style={{ marginLeft: 5 }} fontSize={'small'} checked={f.value} onChange={f.action} />
                    </MDBox>
                )}
            </MDBox>
            <div style={{ background: '#3B88B6', height: 1, marginTop: 20, width: '100%', margin: 'auto' }} />
            <MDBox width={500} mt={1} display={'flex'} alignItems={'center'}>
                <MDTypography style={{ cursor: 'pointer' }} width={'60%'} color={'pink'} variant="h6" fontWeight="regular" onClick={() => action(buttonActions.clear)}>
                    Clear All Filters
                </MDTypography>
                <MDTypography style={{ cursor: 'pointer' }} width={'20%'} color={'gray'} variant="h6" fontWeight="regular"  onClick={() => action(buttonActions.cancel)}>
                    Cancel
                </MDTypography>
                <MDTypography style={{ cursor: 'pointer' }} width={'20%'} color={'primary'} variant="h6" fontWeight="regular"  onClick={() => action(buttonActions.apply)}>
                    Apply
                </MDTypography>
            </MDBox>
        </MDBox>
        //

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
                    // onClick={() => setAnchor(null)}
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
                        {filterContent}
                    </div>
                </Popover>
            </div>
        );
    }
);

export default MDFilterButtonPopover;
