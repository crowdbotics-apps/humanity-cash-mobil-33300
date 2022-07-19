import { Animated, StyleSheet } from 'react-native';
import { COLOR, TYPOGRAPHY, METRICS } from '../../theme';

export default StyleSheet.create({
	ROOT: {
		flex: 1,
	},
  CONTAINER: {},
	BACK_BUTON_LABEL: {
		fontSize: 16,
		color: COLOR.PALETTE.black
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
	STEP_CONTAINER: {
  },
  LOGIN_TYPES_LABEL: {
    fontSize: 16,
    color: COLOR.PALETTE.green,
    marginLeft: 10,
    textAlign: 'center',
    marginTop: 70,
    marginBottom: 30
  },
  LOGIN_TYPES_CONTAINER: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 250,
    alignSelf: 'center',
  },
  LOGIN_TYPE: {
    width: 50,
    height: 50
  },
	STEP_TITLE: {
    fontSize: 32,
    color: COLOR.PALETTE.orange,
    marginBottom: 20,
    fontWeight: 'bold'
  },
  LINE: {
    width: METRICS.screenWidth * 0.95,
    backgroundColor: COLOR.PALETTE.purple,
    height: 1,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 40
  },
	STEP_SUB_TITLE: {
    fontSize: 18,
    color: COLOR.PALETTE.black,
    bottom: 20,
    fontWeight: 'bold'
  },
	INPUT_LABEL_STYLE: {
    fontSize: 10,
    color: COLOR.PALETTE.black,
  },
	PASS_REQUIREMENTS: {
    color: COLOR.PALETTE.strongGreen,
    fontSize: 10,
  },
  INPUT_LABEL_STYLE_CONTAINER: {
    flexDirection: 'row',
    width: METRICS.screenWidth * 0.95,
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginTop: 30
  },
  INPUT_STYLE: {
    height: 55,
    width: METRICS.screenWidth * 0.90,
    alignSelf: 'center',
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
    alignItems: 'center',
    marginBottom: -10
  },
	PASS_INPUT_STYLE: {
    height: 55,
    width: METRICS.screenWidth * 0.80,
    alignSelf: 'center',
  },
  NEED_HELP_CONTAINER: {
    width: METRICS.screenWidth * 0.80,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20
  },
  FORGOT_PASSWORD_CONTAINER: {
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 25
  },
  NEED_HELP_LINK: {
    fontSize: 16,
    color: COLOR.PALETTE.darkYellow,
    textDecorationLine: 'underline',
    textAlign: 'center'
  },
  BUTTON_STYLE: { 
    borderColor: COLOR.PALETTE.green, 
    backgroundColor: 'transparent', 
    borderWidth: 1,
  },
  USER_IMAGE_CONTAINER: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAF6',
    bottom: 35,
    width: 70,
    height: 70,
    borderRadius: 35
  },
  USER_IMAGE: {
    width: 60,
    height: 60,
    borderRadius: 30
  },

  ROOT_MODAL: {
    flex: 1,
    backgroundColor: 'rgba(240, 240, 240, 0.80)',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  MODAL_CONTAINER: {
    backgroundColor: '#F8FAF6',
    width: METRICS.screenWidth * 0.80,
    height: 380,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 20,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  MODAL_CONTENT: {
    width: METRICS.screenWidth * 0.70,
    height: 330,
    justifyContent: 'space-evenly'
  },
  CLOSE_MODAL_BUTTON: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginRight: 30
  },
  MODAL_BUTTON: {
    width: METRICS.screenWidth * 0.70,
    height: 55,
    backgroundColor: COLOR.PALETTE.green,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 27.5,
    marginBottom: 20
  },
  SUBMIT_BUTTON_LABEL: {
    fontSize: 16,
    color: COLOR.PALETTE.white,
    textAlign: 'center',
    textAlignVertical: 'center',
  },

  SWITCH_CONTAINER: {
    alignSelf: 'center',
    marginTop: 30
},




})
