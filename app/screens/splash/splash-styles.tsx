import {StyleSheet} from "react-native"
import { COLOR, METRICS} from "../../theme";

export default StyleSheet.create({
  BG_STYLE: {
    bottom: METRICS.screenHeight / 4,
    position: "absolute",
    width: METRICS.screenWidth,
  },
  CONTAINER: {},
  LOGO_STYLE: {
    alignSelf:'center',
    bottom: METRICS.screenHeight / 2.2,
    position: "absolute",
    width: METRICS.screenWidth,
  },
  POWERED_CONTAINER: {
    alignItems: 'flex-end',
    bottom: 40,
    right: 30,
    width: METRICS.screenWidth,
    
  },
  POWERED_CONTAINER_ABSOLUTE: {
    alignItems: 'flex-end',
    bottom: 250,
    position: 'absolute',
    right: 30,
    width: METRICS.screenWidth,
  },
  POWERED_LABEL: {
    color: COLOR.PALETTE.blue,
    fontSize: 20
  },
  ROOT: {
    backgroundColor: COLOR.PALETTE.background,
    flex: 1,
    justifyContent: 'space-between'
  },
  WATERMARK_STYLE: {
    height: 70,
    width: 180,
  },
})
