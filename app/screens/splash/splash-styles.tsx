import {StyleSheet} from "react-native"
import { COLOR, METRICS} from "../../theme";

export default StyleSheet.create({
  BG_STYLE: {
    bottom: METRICS.screenHeight / 4,
    position: "absolute",
    width: METRICS.screenWidth,
  },
  CONTAINER: {
    alignItems: 'flex-end',
  },
  LOGO_STYLE: {
    alignSelf:'center',
    marginBottom: 20,
    width: METRICS.screenWidth,
  },
  POWERED_CONTAINER: {
    alignItems: 'flex-end',
    alignSelf: "flex-end",
    bottom: 50,
    right: 100
  },
  POWERED_CONTAINER_ABSOLUTE: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    width: METRICS.screenWidth
  },
  POWERED_LABEL: {
    color: COLOR.PALETTE.blue,
    fontSize: 20,
    left: 50
  },
  ROOT: {
    backgroundColor: COLOR.PALETTE.background,
    flex: 1,
    justifyContent: 'space-between'
  },
  WATERMARK_STYLE: {
    height: 70,
    left: 50,
    width: 180
  },
})
