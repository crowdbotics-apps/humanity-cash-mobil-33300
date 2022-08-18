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
		color: COLOR.PALETTE.black,
		fontSize: 16
	},
	BUTTON_STYLE: { 
    backgroundColor: COLOR.PALETTE.transparent, 
    borderColor: COLOR.PALETTE.green, 
    borderWidth: 1,
  },
	CLOSE_MODAL_BUTTON: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginRight: 30
  },
	CONTAINER: {},
  FORGOT_PASSWORD_CONTAINER: {
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 25
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
    backgroundColor: COLOR.PALETTE.purple,
    height: 1,
    marginBottom: 40,
    marginTop: 10,
    width: METRICS.screenWidth * 0.95
  },
	LOGIN_TYPE: {
    height: 50,
    width: 50
  },
	LOGIN_TYPES_CONTAINER: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 250,
  },
  LOGIN_TYPES_LABEL: {
    color: COLOR.PALETTE.green,
    fontSize: 16,
    marginBottom: 30,
    marginLeft: 10,
    marginTop: 70,
    textAlign: 'center'
  },
  MODAL_BUTTON: {
    alignSelf: 'center',
    backgroundColor: COLOR.PALETTE.green,
    borderRadius: 27.5,
    height: 55,
    justifyContent: 'center',
    marginBottom: 20,
    width: METRICS.screenWidth * 0.70
  },
	MODAL_CONTAINER: {
    alignItems: 'center',
    backgroundColor: COLOR.PALETTE.lighterGreen,
    borderRadius: 20,
    elevation: 2,
    height: 350,
    justifyContent: 'space-around',
    shadowColor: COLOR.PALETTE.black,
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    width: METRICS.screenWidth * 0.80,
  },
	MODAL_CONTENT: {
    height: 330,
    justifyContent: 'space-evenly',
    width: METRICS.screenWidth * 0.70
  },
  NEED_HELP_CONTAINER: {
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 50,
    width: METRICS.screenWidth * 0.80
  },
  NEED_HELP_LINK: {
    color: COLOR.PALETTE.darkYellow,
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline'
  },
  PASS_INPUT_STYLE: {
    alignSelf: 'center',
    height: 55,
    width: METRICS.screenWidth * 0.80,
  },
  PASS_REQUIREMENTS: {
    color: COLOR.PALETTE.strongGreen,
    fontSize: 10,
  },
  ROOT: {
		backgroundColor: COLOR.PALETTE.white,
		flex: 1,
		justifyContent: 'space-between'
	},
  ROOT_MODAL: {
    alignItems: 'center',
    backgroundColor: 'rgba(240, 240, 240, 0.90)',
    flex: 1,
    justifyContent: 'space-around'
  },
  STEP_CONTAINER: {
    // backgroundColor: 'red'
  },
  STEP_SUB_TITLE: {
    color: COLOR.PALETTE.black,
    fontSize: 16,
    marginLeft: 10,
    width: METRICS.screenWidth * 0.90,
  },
  STEP_TITLE: {
    color: COLOR.PALETTE.orange,
    fontSize: 32,
    marginLeft: 10
  },
  SUBMIT_BUTTON_LABEL: {
    color: COLOR.PALETTE.white,
    fontSize: 16,
    textAlign: 'center',
    textAlignVertical: 'center',
  },






})
