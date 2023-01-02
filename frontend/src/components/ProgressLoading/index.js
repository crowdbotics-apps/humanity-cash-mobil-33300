import {Box, CircularProgress} from "@mui/material";

export const ProgressLoading = ({hide}) => {
  return hide ? null : <Box
    style={{
      backgroundColor: "rgba(0,0,0,0.3)",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      position: "fixed",
      zIndex: 10000000,
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
      overflow: "auto"
    }}
  >
    <CircularProgress/>
  </Box>
}