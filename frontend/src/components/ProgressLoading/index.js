import {Box, CircularProgress} from "@mui/material";
import Lottie from "react-lottie";
import animationLoader from "../../assets/svg/loader.json";

export const ProgressLoading = ({show}) => {

  const loaderAnimationOptions = {
    loop: true,
    autoplay: true,
    animationData: animationLoader,
  };

  return show ? <Box
    style={{
      backgroundColor: "rgba(255, 255, 255, 0.7)",
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
    {/*<CircularProgress size={50} style={{color: 'white'}}/>*/}
    <Lottie
      options={loaderAnimationOptions}
      height={100}
      width={100}
    />
  </Box> : null
}
