import { Animated, StyleSheet } from 'react-native';
import { COLOR, TYPOGRAPHY, METRICS } from '../../theme';

export default StyleSheet.create({
  ROOT: {
    flex: 1,
    backgroundColor: COLOR.PALETTE.white,
    marginTop: 50,
    justifyContent: 'space-between'
  },
  STEP_CONTAINER: {

  },
  STEP_TITLE: {
    fontSize: 32,
    color: COLOR.PALETTE.green,
    marginLeft: 10
  },
  STEP_SUB_TITLE: {
    fontSize: 16,
    color: COLOR.PALETTE.black,
    marginLeft: 10,
    width: METRICS.screenWidth * 0.90,
  },
  BACK_BUTON_CONTAINER: {
    flexDirection: 'row',
    width: 80,
    height: 30,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 10,
    marginVertical: 10
  },
  BACK_BUTON_LABEL: {
    fontSize: 16,
    color: COLOR.PALETTE.black
  },
  SUBMIT_BUTTON_OUTLINE: {
    width: METRICS.screenWidth * 0.95,
    height: 55,
    borderColor: COLOR.PALETTE.green,
    borderWidth: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 27.5,
    marginTop: 30
  },
  SUBMIT_BUTTON_OUTLINE_LABEL: {
    fontSize: 16,
    color: COLOR.PALETTE.green,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  SUBMIT_BUTTON: {
    width: METRICS.screenWidth * 0.95,
    height: 55,
    backgroundColor: COLOR.PALETTE.green,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 27.5,
    marginBottom: 30
  },
  SUBMIT_BUTTON_DISABLED: {
    width: METRICS.screenWidth * 0.95,
    height: 55,
    backgroundColor: `${COLOR.PALETTE.green}40`,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 27.5,
    marginBottom: 30
  },
  SUBMIT_BUTTON_LABEL: {
    fontSize: 16,
    color: COLOR.PALETTE.white,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  INPUT_STYLE_CONTAINER_ERROR: {
    borderRadius: 5,
    height: 55,
    width: METRICS.screenWidth * 0.95,
    backgroundColor: `${COLOR.PALETTE.green}25`,
    alignSelf: 'center',
    marginTop: 10,
    borderColor: COLOR.PALETTE.pink,
    borderWidth: 0.8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  INPUT_LABEL_STYLE_CONTAINER: {
    flexDirection: 'row',
    width: METRICS.screenWidth * 0.95,
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginTop: 30
  },
  INPUT_STYLE_CONTAINER: {
    borderRadius: 5,
    height: 55,
    width: METRICS.screenWidth * 0.95,
    backgroundColor: `${COLOR.PALETTE.green}25`,
    alignSelf: 'center',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  INPUT_STYLE: {
    height: 55,
    width: METRICS.screenWidth * 0.90,
    alignSelf: 'center',
  },
  INPUT_LABEL_STYLE: {
    fontSize: 10,
    color: COLOR.PALETTE.black,
  },
  INPUT_LABEL_ERROR: {
    fontSize: 10,
    color: COLOR.PALETTE.pink,
  },
  AGREE_CONTAINER: {
    width: METRICS.screenWidth * 0.85,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  CHECKBOX_OUTLINE: {  },
  CHECKBOX_FILL: {
    backgroundColor: `${COLOR.PALETTE.strongGreen}`,
    borderWidth: 0
  },
  AGREE_LABEL: {
    width: METRICS.screenWidth * 0.80,
    fontSize: 16,
    color: COLOR.PALETTE.black,
  },
  AGREE_LABEL_LINK: {
    fontSize: 16,
    color: COLOR.PALETTE.blue,
    textDecorationLine: 'underline'
  },
  NEED_HELP_CONTAINER: {
    width: METRICS.screenWidth * 0.80,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20
  },
  NEED_HELP_LINK: {
    fontSize: 16,
    color: COLOR.PALETTE.darkYellow,
    textDecorationLine: 'underline',
    textAlign: 'center'
  },
  LINE: {
    width: METRICS.screenWidth * 0.95,
    backgroundColor: COLOR.PALETTE.strongGreen,
    height: 1,
    alignSelf: 'center',
    marginVertical: 10
  },
  TERMS_CLOSE_CONTAINER: {
    width: METRICS.screenWidth * 0.95,
    height: 80,
    backgroundColor: COLOR.PALETTE.background,
    alignSelf: 'center',
    marginBottom: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  TERMS_TITLE: {
    color: COLOR.PALETTE.strongGreen,
    fontSize: 16,
    marginLeft: 15
  },
  TERMS_OPEN_CONTAINER: {
    width: METRICS.screenWidth * 0.95,
    backgroundColor: COLOR.PALETTE.background,
    alignSelf: 'center',
    marginBottom: 15
  },
  TERMS_OPEN_TITLE_CONTAINER: {
    height: 60,
    width: METRICS.screenWidth * 0.95,
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  TERMS_OPEN_CONTENT: {
    color: COLOR.PALETTE.strongGreen,
    fontSize: 10,
    width: METRICS.screenWidth * 0.80,
    alignSelf:'center'
  },
  POLICY_CLOSE_CONTAINER: {
    width: METRICS.screenWidth * 0.95,
    height: 80,
    backgroundColor: COLOR.PALETTE.lightGreen,
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  POLICY_OPEN_CONTAINER: {
    width: METRICS.screenWidth * 0.95,
    backgroundColor: COLOR.PALETTE.background,
    alignSelf: 'center',
    marginBottom: 250,
  },
  CODE_CONFIRMATION_CONTAINER: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
    alignItems: 'center'
  },
  CODE_CONFIRMATION_INPUT_CONTAINER: {
    backgroundColor: COLOR.PALETTE.ligthGray,
    width: 50,
    height: 55,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  CODE_CONFIRMATION_INPUT: {
    fontSize: 25,
    textAlign: 'center'
  },
  SHORT_LINE: {
    backgroundColor: COLOR.PALETTE.black,
    height: 2,
    width: 10
  },
  PASS_REQUIREMENTS_CONTAINER: {
    width: METRICS.screenWidth * 0.95,
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginTop: 30
  },
  PASS_REQUIREMENTS: {
    color: COLOR.PALETTE.strongGreen,
    fontSize: 10,
  },
  PASS_INPUT_STYLE: {
    height: 55,
    width: METRICS.screenWidth * 0.80,
    alignSelf: 'center',
  },
})
