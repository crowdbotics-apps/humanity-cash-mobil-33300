import {StyleSheet} from "react-native"
import { COLOR, METRICS} from "../../theme";

export default StyleSheet.create({
  ROOT: {
    flex: 1,
    backgroundColor: COLOR.PALETTE.background,
    justifyContent: 'space-between'
  },
  CONTAINER: {},
  BG_STYLE: {
    width: METRICS.screenWidth,
    bottom: 350,
    position: "absolute",
  },
  LOGO_STYLE: {
    alignSelf:'center',
    width: METRICS.screenWidth,
    bottom: 350,
    position: "absolute",
  },
  WATERMARK_STYLE: {
    width: 100,
    height: 40,
  },
  POWERED_CONTAINER_ABSOLUTE: {
    right: 30,
    width: METRICS.screenWidth,
    alignItems: 'flex-end',
    position: 'absolute',
    bottom: 250,
  },
  POWERED_CONTAINER: {
    right: 30,
    width: METRICS.screenWidth,
    alignItems: 'flex-end',
  },
  POWERED_LABEL: {
    color: COLOR.PALETTE.blue,
    fontSize: 18
  },
})
