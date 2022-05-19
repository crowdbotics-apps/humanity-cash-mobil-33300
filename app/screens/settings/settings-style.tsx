import { Animated, StyleSheet } from 'react-native';
import { COLOR, TYPOGRAPHY, METRICS } from '../../theme';

export default StyleSheet.create({
	ROOT: {
		flex: 1,
		backgroundColor: COLOR.PALETTE.white,
		justifyContent: 'space-between'
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
    // backgroundColor: 'red'
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
    marginLeft: 10
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
    fontSize: 16,
    color: COLOR.PALETTE.black,
    marginLeft: 10,
    width: METRICS.screenWidth * 0.90,
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
    marginBottom: 50
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
  }
})
