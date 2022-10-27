import { Animated, StyleSheet } from 'react-native';
import { COLOR, TYPOGRAPHY, METRICS } from '../../theme';

export default StyleSheet.create({
  AGREE_CONTAINER: {
    alignItems: 'flex-end',
    alignSelf: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    maxWidth: METRICS.screenWidth,
    minHeight: 60,
    width: METRICS.screenWidth,
  },
  AGREE_LABEL: {
    color: COLOR.PALETTE.black,
    fontSize: 16,
    width: METRICS.screenWidth * 0.70,
  },
  AGREE_LABEL_LINK: {
    color: COLOR.PALETTE.blue,
    fontSize: 16,
    textDecorationLine: 'underline'
  },
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
    color: COLOR.PALETTE.black,
    fontSize: 16
  },
  CHECKBOX_FILL: {
    backgroundColor: `${COLOR.PALETTE.strongGreen}`,
    borderWidth: 0
  },
  CHECKBOX_OUTLINE: {  },
  CODE_CONFIRMATION_CONTAINER: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20
  },
  CODE_CONFIRMATION_INPUT: {
    color: COLOR.PALETTE.strongGreen,
    fontSize: 25,
    textAlign: 'center',
    width: 45,
  },
  CODE_CONFIRMATION_INPUT_CONTAINER: {
    alignItems: 'center',
    backgroundColor: COLOR.PALETTE.ligthGray,
    borderRadius: 5,
    height: 55,
    justifyContent: 'center',
    width: 50
  },
  CONTAINER: {},
  INPUT_LABEL_ERROR: {
    color: COLOR.PALETTE.pink,
    fontSize: 10,
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
    backgroundColor: `${COLOR.PALETTE.gray}25`,
    borderRadius: 5,
    flexDirection: 'row',
    height: 55,
    justifyContent: 'center',
    marginTop: 10,
    width: METRICS.screenWidth * 0.95
  },
  INPUT_STYLE_CONTAINER_ERROR: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: `${COLOR.PALETTE.green}25`,
    borderColor: COLOR.PALETTE.pink,
    borderRadius: 5,
    borderWidth: 0.8,
    flexDirection: 'row',
    height: 55,
    justifyContent: 'center',
    marginTop: 10,
    width: METRICS.screenWidth * 0.95
  },
  LABEL: {
    color: COLOR.PALETTE.black,
    fontSize: 10,
  },
  LABEL_CONTAINER: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    width: METRICS.screenWidth * 0.95
  },
  LABEL_ERROR: {
    color: COLOR.PALETTE.pink,
    fontSize: 10,
  },
  LINE: {
    alignSelf: 'center',
    backgroundColor: COLOR.PALETTE.strongGreen,
    height: 1,
    marginVertical: 10,
    width: METRICS.screenWidth * 0.95
  },
  NEED_HELP_CONTAINER: {
    alignItems: 'center',
    alignSelf: 'center',
    flex: 0.9,
    justifyContent: 'flex-end',
    marginBottom: 20,
    width: METRICS.screenWidth * 0.80,
  },
  NEED_HELP_LINK: {
    color: COLOR.PALETTE.darkYellow,
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline'
  },
  PASS_INPUT_STYLE: {
    alignSelf: 'center',
    color: `${COLOR.PALETTE.pureblack}`,
    height: 55,
    width: METRICS.screenWidth * 0.80
  },
  PASS_REQUIREMENTS: {
    color: COLOR.PALETTE.strongGreen,
    fontSize: 10,
  },
  PASS_REQUIREMENTS_CONTAINER: {
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
    width: METRICS.screenWidth * 0.95
  },
  POLICY_CLOSE_CONTAINER: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: COLOR.PALETTE.background,
    flexDirection: 'row',
    height: 80,
    justifyContent: 'space-between',
    width: METRICS.screenWidth * 0.95
  },
  POLICY_OPEN_CONTAINER: {
    alignSelf: 'center',
    backgroundColor: COLOR.PALETTE.background,
    marginBottom: 250,
    width: METRICS.screenWidth * 0.95,
  },
  ROOT: {
    backgroundColor: COLOR.PALETTE.white,
    flex: 1,
    justifyContent: 'space-between'
  },
  SHORT_LINE: {
    backgroundColor: COLOR.PALETTE.black,
    height: 2,
    width: 10
  },
  SHOW_PASS_CONTAINER: {
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
    width: 50
  },
  STEP_CONTAINER: {
    width: METRICS.screenWidth,
  },
  STEP_SUB_TITLE: {
    color: COLOR.PALETTE.pureblack,
    fontSize: 16,
    marginLeft: 10,
    width: METRICS.screenWidth * 0.90,
  },
  STEP_TITLE: {
    color: COLOR.PALETTE.green,
    fontSize: 32,
    marginLeft: 10
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
    alignSelf:'center',
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
    color: COLOR.PALETTE.pureblack,
    fontSize: 16,
    marginLeft: 15
  },
})
