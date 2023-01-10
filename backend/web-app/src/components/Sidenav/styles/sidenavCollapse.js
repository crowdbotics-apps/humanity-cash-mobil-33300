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

function collapseItem(theme, ownerState) {
  const { palette, transitions, breakpoints, boxShadows, borders, functions } = theme;
  const { active, transparentSidenav, whiteSidenav, darkMode } = ownerState;

  const { white, transparent, dark, grey } = palette;
  const { md } = boxShadows;
  const { borderRadius } = borders;
  const { pxToRem, rgba } = functions;

  return {
    background: () => {
      let backgroundValue;

      if (transparentSidenav && darkMode) {
        backgroundValue = active ? rgba(white.main, 0.2) : transparent.main;
      } else if (transparentSidenav && !darkMode) {
        backgroundValue = active ? grey[300] : transparent.main;
      } else if (whiteSidenav) {
        backgroundValue = active ? grey[200] : transparent.main;
      } else {
        backgroundValue = active ? rgba(white.main, 0.2) : transparent.main;
      }

      return backgroundValue;
    },
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: `${pxToRem(8)} ${pxToRem(16)}`,
    margin: `${pxToRem(1.5)} ${pxToRem(16)}`,
    borderRadius: borderRadius.md,
    cursor: "pointer",
    userSelect: "none",
    whiteSpace: "nowrap",
    boxShadow:  "none",
    marginBottom: 2,
    [breakpoints.up("xl")]: {
      transition: transitions.create(["box-shadow", "background-color"], {
        easing: transitions.easing.easeInOut,
        duration: transitions.duration.shorter,
      }),
    },

    "&:hover, &:focus": {
      backgroundColor:
        transparentSidenav && !darkMode
          ? grey[300]
          : rgba(whiteSidenav ? grey[400] : white.main, 0.2),
    },
  };
}

function collapseIconBox(theme, ownerState, active) {
  const { palette, transitions, borders, functions } = theme;
  const { borderRadius } = borders;
  const { pxToRem } = functions;

  return {
    minWidth: pxToRem(32),
    minHeight: pxToRem(32),
    color: '#999999',
    borderRadius: borderRadius.md,
    display: "grid",
    placeItems: "center",
    transition: transitions.create("margin", {
      easing: transitions.easing.easeInOut,
      duration: transitions.duration.standard,
    }),

    "& svg, svg g": {
      // fill: active ? '#3B88B6' : '#000000',
      stroke: active ? '#3B88B6' : '#000000',
      // transform: 'scale(1.2)',
      strokeWidth: 0
    },
  };
}

const collapseIcon = ({ palette: { white, gradients } }, { active }) => ({
  color: '#999999',
});

function collapseText(theme, ownerState) {
  const { typography, transitions, breakpoints, functions } = theme;
  const { miniSidenav, transparentSidenav, active } = ownerState;
  const { pxToRem } = functions;

  return {
    marginLeft: pxToRem(10),

    [breakpoints.up("xl")]: {
      opacity: miniSidenav || (miniSidenav && transparentSidenav) ? 0 : 1,
      maxWidth: miniSidenav || (miniSidenav && transparentSidenav) ? 0 : "100%",
      marginLeft: miniSidenav || (miniSidenav && transparentSidenav) ? 0 : pxToRem(10),
      transition: transitions.create(["opacity", "margin"], {
        easing: transitions.easing.easeInOut,
        duration: transitions.duration.standard,
      }),
    },

    "& span": {
      fontFamily: 'Montserrat',
      fontWeight: 400,
      fontSize: 14,
      lineHeight: 0,
      color: active ? '#3B88B6' : '#000000',
    },
  };
}

function collapseArrow(theme, ownerState) {
  const { palette, typography, transitions, breakpoints, functions } = theme;
  const { noCollapse, transparentSidenav, whiteSidenav, miniSidenav, open, active, darkMode } = ownerState;

  const { size } = typography;
  const { pxToRem, rgba } = functions;

  return {
    fontSize: `${size.lg} !important`,
    fontWeight: 700,
    marginBottom: pxToRem(-1),
    transform: open ? "rotate(0)" : "rotate(-180deg)",
    color: '#999999',
    transition: transitions.create(["color", "transform", "opacity"], {
      easing: transitions.easing.easeInOut,
      duration: transitions.duration.shorter,
    }),

    [breakpoints.up("xl")]: {
      display:
        noCollapse || (transparentSidenav && miniSidenav) || miniSidenav
          ? "none !important"
          : "block !important",
    },
  };
}

export { collapseItem, collapseIconBox, collapseIcon, collapseText, collapseArrow };
