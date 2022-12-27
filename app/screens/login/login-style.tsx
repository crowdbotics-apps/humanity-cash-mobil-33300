import { Animated, StyleSheet } from 'react-native';
import { COLOR, TYPOGRAPHY, METRICS } from '../../theme';

export default StyleSheet.create({
  BACK_BUTON_CONTAINER: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 30,
    justifyContent: 'flex-start',
    marginLeft: 10,
    marginVertical: 10,
    width: 80
  },
  BACK_BUTON_LABEL: {
    color: COLOR.PALETTE.green,
    fontSize: 16
  },
  INPUT_LABEL_STYLE: {
    color: COLOR.PALETTE.black,
    fontSize: 10,
  },
  INPUT_LABEL_STYLE_CONTAINER: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    width: METRICS.screenWidth * 0.95
  },
  INPUT_STYLE: {
    alignSelf: 'center',
    color: COLOR.PALETTE.black,
    height: 55,
    width: METRICS.screenWidth * 0.90,
  },
  INPUT_STYLE_CONTAINER: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: `${COLOR.PALETTE.green}25`,
    borderRadius: 5,
    flexDirection: 'row',
    height: 55,
    justifyContent: 'center',
    marginBottom: -10,
    marginTop: 10,
    width: METRICS.screenWidth * 0.95
  },
  LOGIN_OPTIONS_CONTAINER: {
    flex: 1,
    height: 200,
    justifyContent: 'space-around',
    marginTop: 20
  },
  LOGIN_TYPE: {
    height: 45,
    width: 45
  },
  LOGIN_TYPES_CONTAINER: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 230,
  },
  LOGIN_TYPES_LABEL: {
    color: COLOR.PALETTE.green,
    fontSize: 16,
    marginLeft: 10,
    marginVertical: 15,
    textAlign: 'center',
    // paddingBottom: 30
  },
  NEED_HELP_CONTAINER: {
    alignItems: 'center',
    alignSelf: 'center',
    width: METRICS.screenWidth * 0.80
  },
  NEED_HELP_LINK: {
    color: COLOR.PALETTE.darkYellow,
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline'
  },
  PASS_INPUT_STYLE: {
    width: METRICS.screenWidth * 0.80,
  },
  PASS_REQUIREMENTS: {
    color: COLOR.PALETTE.strongGreen,
    fontSize: 10,
  },
  ROOT: {
    backgroundColor: COLOR.PALETTE.white,
    justifyContent: 'space-between'
  },
  SHOW_PASS_CONTAINER: {
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
    width: 50
  },
  STEP_CONTAINER: {},
  STEP_SUB_TITLE: {
    color: COLOR.PALETTE.black,
    fontSize: 16,
    marginLeft: 10,
    width: METRICS.screenWidth * 0.90,
  },
  STEP_TITLE: {
    color: COLOR.PALETTE.green,
    fontSize: 32,
    marginLeft: 10
  }
})
