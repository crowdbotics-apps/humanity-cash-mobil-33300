import { Animated, StyleSheet } from 'react-native';
import { COLOR, TYPOGRAPHY, METRICS } from '../../theme';

export default StyleSheet.create({
  AGREE_CONTAINER: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: METRICS.screenWidth * 0.85
  },
  AGREE_LABEL: {
    color: COLOR.PALETTE.black,
    fontSize: 16,
    width: METRICS.screenWidth * 0.80,
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
    marginHorizontal: 10,
    marginVertical: 10,
    width: 80
  },
  BACK_BUTON_LABEL: {
    color: COLOR.PALETTE.black,
    fontSize: 16
  },
  BACK_IMAGE_BOX: {
    borderRadius: 3,
    height: 100,
    width: METRICS.screenWidth * 0.95,
  },
  BACK_IMAGE_CONTAINER: {
    alignItems: 'flex-end',
    alignSelf: 'center',
    backgroundColor: COLOR.PALETTE.lightGreen,
    borderRadius: 3,
    height: 100,
    marginTop: 15,
    width: METRICS.screenWidth * 0.95,
  },
  BIG_INPUT_STYLE: {
    alignSelf: 'center',
    color: COLOR.PALETTE.black,
    height: 120,
    width: METRICS.screenWidth * 0.90
  },
  BIG_INPUT_STYLE_CONTAINER: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: `${COLOR.PALETTE.green}25`,
    borderRadius: 3,
    flexDirection: 'row',
    height: 120,
    justifyContent: 'center',
    marginTop: 10,
    width: METRICS.screenWidth * 0.95
  },
  BIG_INPUT_STYLE_CONTAINER_ERROR: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: `${COLOR.PALETTE.green}25`,
    borderColor: COLOR.PALETTE.pink,
    borderRadius: 3,
    borderWidth: 0.8,
    flexDirection: 'row',
    height: 120,
    justifyContent: 'center',
    marginTop: 10,
    width: METRICS.screenWidth * 0.95
  },
  BUSINESS_IMAGES_CONTAINER: {

  },
  CHECKBOX_FILL: {
    backgroundColor: `${COLOR.PALETTE.strongGreen}`,
    borderWidth: 0
  },
  CHECKBOX_OUTLINE: {},
  CHECK_INSIDE: {
    backgroundColor: COLOR.PALETTE.black,
    borderRadius: 8,
    height: 16,
    width: 16
  },
  CHECK_OUTSIDE: {
    alignItems: 'center',
    backgroundColor: COLOR.PALETTE.white,
    borderColor: COLOR.PALETTE.gray,
    borderRadius: 13,
    borderWidth: 0.5,
    elevation: 5,
    height: 26,
    justifyContent: 'center',
    marginRight: 15,
    shadowColor: COLOR.PALETTE.black,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    width: 26,
  },
  CODE_CONFIRMATION_CONTAINER: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20
  },
  CODE_CONFIRMATION_INPUT: {
    fontSize: 25,
    textAlign: 'center'
  },
  CODE_CONFIRMATION_INPUT_CONTAINER: {
    alignItems: 'center',
    backgroundColor: COLOR.PALETTE.ligthGray,
    borderRadius: 3,
    height: 55,
    justifyContent: 'center',
    width: 50
  },
  CONTAINER: {},
  HEADER_ACTIONS: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  IMAGE_BOX: {
    borderRadius: 42,
    height: 84,
    width: 84
  },
  IMAGE_BOX_LABEL: {
    color: COLOR.PALETTE.black,
    fontSize: 16,
    marginTop: 15,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  IMAGE_BOX_VALIDATION: {
    color: `${COLOR.PALETTE.strongGreen}70`,
    fontSize: 12,
    marginBottom: 15,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  IMAGE_CONTAINER: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: COLOR.PALETTE.lightGreen,
    borderRadius: 42,
    height: 84,
    justifyContent: 'center',
    width: 84,
  },
  IMAGE_CONTAINER_MARGIN: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: COLOR.PALETTE.white,
    borderRadius: 45,
    height: 90,
    justifyContent: 'center',
    marginTop: -45,
    width: 90
  },
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
    marginTop: 20,
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
    borderRadius: 3,
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
    borderRadius: 3,
    borderWidth: 0.8,
    flexDirection: 'row',
    height: 55,
    justifyContent: 'center',
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
  MODAL_BUTTON: {
    alignSelf: 'center',
    backgroundColor: COLOR.PALETTE.green,
    borderRadius: 27.5,
    height: 55,
    justifyContent: 'center',
    width: METRICS.screenWidth * 0.70,
  },
  MODAL_CONTENT: {
    alignItems: 'center',
    backgroundColor: COLOR.PALETTE.lighterGreen,
    borderRadius: 10,
    elevation: 5,
    height: 230,
    justifyContent: 'space-evenly',
    shadowColor: COLOR.PALETTE.black,
    shadowOffset: { height: 20, width: 20 },
    shadowOpacity: 0.3,
    width: METRICS.screenWidth * 0.85
  },
  NEED_HELP_CONTAINER: {
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    width: METRICS.screenWidth * 0.80
  },
  NEED_HELP_LINK: {
    color: COLOR.PALETTE.darkYellow,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    textDecorationLine: 'underline'
  },
  PASS_INPUT_STYLE: {
    alignSelf: 'center',
    color: COLOR.PALETTE.black,
    height: 55,
    width: METRICS.screenWidth * 0.80,
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
    backgroundColor: COLOR.PALETTE.lightGreen,
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
  },
  ROOT_CONTAINER: {
    backgroundColor: COLOR.PALETTE.white,
    flex: 1,
    justifyContent: 'space-between',
  },
  ROOT_MODAL: {
    alignItems: 'center',
    backgroundColor: COLOR.PALETTE.modalBackgroundColor,
    flex: 1,
    justifyContent: 'center'
  },
  SELECTS_CONTAINER: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: METRICS.screenWidth * 0.95,
  },
  SELECT_ICON: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 55,
    justifyContent: 'space-between',
    width: METRICS.screenWidth * 0.95,
  },
  SELECT_INPUT_STYLE_CONTAINER: {
    alignSelf: 'center',
    backgroundColor: `${COLOR.PALETTE.green}25`,
    borderRadius: 3,
    height: 55,
    marginTop: 10,
    width: METRICS.screenWidth * 0.95,
  },
  SELECT_INPUT_STYLE_CONTAINER_OPEN: {
    alignSelf: 'center',
    backgroundColor: `${COLOR.PALETTE.green}25`,
    borderColor: COLOR.PALETTE.orange,
    borderRadius: 3,
    borderWidth: 0.8,
    marginTop: 10,
    width: METRICS.screenWidth * 0.95,
  },
  SELECT_LABEL: {
    color: COLOR.PALETTE.orange,
    fontSize: 16,
    marginLeft: 20
  },
  SHORT_LINE: {
    backgroundColor: COLOR.PALETTE.black,
    height: 2,
    width: 10
  },
  STEP_CONTAINER: {},
  STEP_SUB_TITLE: {
    color: COLOR.PALETTE.black,
    fontSize: 16,
    marginLeft: 10,
    width: METRICS.screenWidth * 0.90,
  },
  STEP_SUB_TITLE_MODAL: {
    color: COLOR.PALETTE.black,
    fontSize: 16,
    marginLeft: 10,
    width: METRICS.screenWidth * 0.7,
  },
  STEP_TITLE: {
    color: COLOR.PALETTE.orange,
    fontSize: 32,
    marginLeft: 10,
  },
  STEP_TITLE_BLACK: {
    color: COLOR.PALETTE.black,
    fontSize: 32,
    marginLeft: 10,
    width: METRICS.screenWidth * 0.7,
  },
  SUBMIT_BUTTON: {
    backgroundColor: COLOR.PALETTE.green,
    bottom: 5,
    marginTop: 15,
  },
  SUBMIT_BUTTON_DISABLED: {
    backgroundColor: `${COLOR.PALETTE.green}40`,
    bottom: 5,
    marginTop: 15,
  },
  SUBMIT_BUTTON_LABEL: {
    color: COLOR.PALETTE.white,
    fontSize: 16,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  SUBMIT_BUTTON_OUTLINE: {
    alignSelf: 'center',
    borderColor: COLOR.PALETTE.green,
    borderRadius: 27.5,
    borderWidth: 1,
    height: 55,
    justifyContent: 'center',
    marginTop: 30,
    width: METRICS.screenWidth * 0.95
  },
  SUBMIT_BUTTON_OUTLINE_LABEL: {
    color: COLOR.PALETTE.green,
    fontSize: 16,
    textAlign: 'center',
    textAlignVertical: 'center',
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
  THANK_MODAL: {
    alignItems: 'center',
    backgroundColor: COLOR.PALETTE.white,
    flex: 1,
    justifyContent: 'space-between'
  },
})
