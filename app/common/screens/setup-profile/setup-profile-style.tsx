import { Animated, StyleSheet } from 'react-native';
import { COLOR, TYPOGRAPHY, METRICS } from '../../theme';

export default StyleSheet.create({
  ROOT: {
    flex: 1,
    marginTop: 50,
  },
  FULL_SCREEN: {
    height: METRICS.screenHeight,
    backgroundColor: 'red'
  },
  ROOT_CONTAINER: {
    flex: 1,
    backgroundColor: COLOR.PALETTE.white,
    justifyContent: 'space-between',
    height: METRICS.screenHeight,
  },
  ROOT_MODAL: {
    flex: 1,
    backgroundColor: COLOR.PALETTE.modalBackgroundColor,
    justifyContent: 'center',
    alignItems: 'center'
  },
  THANK_MODAL: {
    flex: 1,
    backgroundColor: COLOR.PALETTE.white,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  STEP_CONTAINER: {},
  HEADER_ACTIONS: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  STEP_TITLE: {
    fontSize: 32,
    color: COLOR.PALETTE.green,
    marginLeft: 10
  },
   STEP_TITLE_BLACK: {
    fontSize: 32,
    color: COLOR.PALETTE.black,
    marginLeft: 10,
    width: METRICS.screenWidth * 0.7,
  },
  STEP_SUB_TITLE_MODAL: {
    fontSize: 16,
    color: COLOR.PALETTE.black,
    marginLeft: 10,
    width: METRICS.screenWidth * 0.7,
  },
  STEP_SUB_TITLE: {
    fontSize: 16,
    color: COLOR.PALETTE.black,
    marginLeft: 10,
    width: METRICS.screenWidth * 0.90,
  },
  MODAL_BUTTON: {
    width: METRICS.screenWidth * 0.70,
    height: 55,
    backgroundColor: COLOR.PALETTE.green,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 27.5,
  },
  BACK_BUTON_CONTAINER: {
    flexDirection: 'row',
    width: 80,
    height: 30,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 10
  },
  BACK_BUTON_LABEL: {
    fontSize: 16,
    color: COLOR.PALETTE.green
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
  BIG_INPUT_STYLE_CONTAINER_ERROR: {
    borderRadius: 5,
    height: 120,
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
  BIG_INPUT_STYLE_CONTAINER: {
    borderRadius: 5,
    height: 120,
    width: METRICS.screenWidth * 0.95,
    backgroundColor: `${COLOR.PALETTE.green}25`,
    alignSelf: 'center',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
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
  BIG_INPUT_STYLE: {
    height: 120,
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
  CHECKBOX_OUTLINE: {},
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
    textAlign: 'center',
    marginBottom: 20
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
    alignSelf: 'center'
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
  BUSINESS_IMAGES_CONTAINER: {

  },
  BACK_IMAGE_CONTAINER: {
    marginTop: 15,
    alignItems: 'flex-end',
    alignSelf: 'center',
    width: METRICS.screenWidth * 0.95,
    height: 100,
    borderRadius: 3,
    backgroundColor: COLOR.PALETTE.lightGreen,
  },
  IMAGE_CONTAINER_MARGIN: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLOR.PALETTE.white,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: -45
  },
  IMAGE_CONTAINER: {
    alignItems: 'center',
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: COLOR.PALETTE.lightGreen,
    justifyContent: 'center', 
    alignSelf: 'center',   
  },
  BACK_IMAGE_BOX: {
    width: METRICS.screenWidth * 0.95,
    height: 100,
    borderRadius: 3,
  },
  IMAGE_BOX: {
    width: 84,
    height: 84,
    borderRadius: 42
  },
  MODAL_CONTENT: {
    backgroundColor: 'white',
    width: METRICS.screenWidth*0.85,
    height: 230,
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'space-evenly'
  },
  IMAGE_BOX_LABEL: {
    fontSize: 16,
    color: COLOR.PALETTE.black,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: 15
  },
  IMAGE_BOX_VALIDATION: {
    fontSize: 12,
    color: `${COLOR.PALETTE.strongGreen}70`,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginBottom: 15
  },
})
