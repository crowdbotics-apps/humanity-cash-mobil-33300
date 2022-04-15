import {StyleSheet} from "react-native"
import { COLOR, METRICS} from "../../theme";

export default StyleSheet.create({
  ROOT: {
    flex: 1,
    backgroundColor: COLOR.PALETTE.background,
    justifyContent: 'space-between',
    marginTop: 50,
  },
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
  LOGIN_BUTTON: {
    width: METRICS.screenWidth * 0.8,
    height: 55,
    backgroundColor: COLOR.PALETTE.blue,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 27.5,
    marginBottom: 10
  },
  LOGIN_LABEL: {
    fontSize: 16,
    color: COLOR.PALETTE.white,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  CREATE_ACCOUNT_BUTTON: {
    width: METRICS.screenWidth * 0.8,
    height: 55,
    backgroundColor: COLOR.PALETTE.white,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 27.5,
    marginBottom: 10
  },
  CREATE_ACCOUNT_LABEL: {
    fontSize: 16,
    color: COLOR.PALETTE.black,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
})
