import { Animated, StyleSheet } from 'react-native';
import { COLOR, TYPOGRAPHY, METRICS } from '../../theme';

export default StyleSheet.create({
  BACK_BUTON_LABEL: {
    color: COLOR.PALETTE.black,
    fontSize: 16
  },
  BANKS_ICON_CONTAINER: {
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: METRICS.screenWidth * 0.95
  },
  BANK_ICON: {
    height: 80,
    width: 80
  },
  BANK_ICON_CONTAINER: {
    alignItems: 'center',
    backgroundColor: COLOR.PALETTE.lightGray,
    height: 100,
    justifyContent: 'center',
    marginBottom: 10,
    width: METRICS.screenWidth * 0.46
  },
  BANK_ICON_CONTAINER_VIEW: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: COLOR.PALETTE.lightGray,
    height: 100,
    justifyContent: 'center',
    marginTop: 30,
    width: METRICS.screenWidth * 0.46
  },
  CONTAINER: {},
  HEADER: {
    flexDirection: 'row',
    marginLeft: 10,
    marginTop: 10,
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
  LINE: {
    alignSelf: 'center',
    backgroundColor: COLOR.PALETTE.strongGreen,
    height: 1,
    marginVertical: 10,
    width: METRICS.screenWidth * 0.95
  },
  PASS_INPUT_STYLE: {
    alignSelf: 'center',
    height: 55,
    width: METRICS.screenWidth * 0.80,
  },
  POLICY_OPEN_CONTAINER: {
    alignSelf: 'center',
    backgroundColor: COLOR.PALETTE.background,
    marginBottom: 250,
    width: METRICS.screenWidth * 0.95,
  },
  ROOT: {
    backgroundColor: COLOR.PALETTE.white,
    flex: 1
  },
  ROOT_CONTAINER: {
    backgroundColor: COLOR.PALETTE.white,
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: 80,
  },
  SEARCH_INPUT_ADJUSTMENTS: {
    alignItems: 'center',
    backgroundColor: `${COLOR.PALETTE.green}25`,
    height: 55,
    justifyContent: 'center',
    width: METRICS.screenWidth * 0.15
  },
  SEARCH_INPUT_CONTAINER: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 10,
    width: METRICS.screenWidth * 0.95
  },
  SEARCH_INPUT_STYLE: {
    alignSelf: 'center',
    height: 55,
    width: METRICS.screenWidth * 0.85,
  },

  SEARCH_INPUT_STYLE_CONTAINER: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: `${COLOR.PALETTE.green}25`,
    borderRadius: 3,
    flexDirection: 'row',
    height: 55,
    justifyContent: 'center',
    width: METRICS.screenWidth * 0.95
  },
  SHOW_PASS_CONTAINER: {
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
    width: 50
  },
  STEP_SUB_TITLE: {
    color: COLOR.PALETTE.black,
    fontSize: 16,
    marginLeft: 10,
    width: METRICS.screenWidth * 0.90,
  },
  STEP_TITLE: {
    color: COLOR.PALETTE.blue,
    fontSize: 32,
    marginLeft: 10,
    marginTop: 10
  },
  TERMS_CLOSE_CONTAINER: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: COLOR.PALETTE.background,
    flexDirection: 'row',
    height: 80,
    justifyContent: 'space-between',
    marginBottom: 15,
    width: METRICS.screenWidth * 0.95
  },
  TERMS_OPEN_CONTAINER: {
    alignSelf: 'center',
    backgroundColor: COLOR.PALETTE.background,
    marginBottom: 15,
    width: METRICS.screenWidth * 0.95
  },
  TERMS_OPEN_CONTENT: {
    alignSelf: 'center',
    color: COLOR.PALETTE.strongGreen,
    fontSize: 10,
    width: METRICS.screenWidth * 0.80
  },
  TERMS_OPEN_TITLE_CONTAINER: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-between',
    width: METRICS.screenWidth * 0.95,
  },
  TERMS_TITLE: {
    color: COLOR.PALETTE.strongGreen,
    fontSize: 16,
    marginLeft: 15
  },
  bankView: {
    flex: 1,
    height: METRICS.screenHeight - 200,
    paddingBottom: 10,
  },
  buttonStyle: {
    backgroundColor: COLOR.PALETTE.blue,
    bottom: 125,
    position: 'absolute'
  }
})
