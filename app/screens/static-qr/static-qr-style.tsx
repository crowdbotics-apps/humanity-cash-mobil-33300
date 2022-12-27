import { Animated, StyleSheet } from 'react-native';
import { COLOR, TYPOGRAPHY, METRICS } from '../../theme';

export default StyleSheet.create({
	ALLOW_LABEL: {
    color: COLOR.PALETTE.black,
    fontSize: 16,
    marginLeft: 10
  },
	BACK_BUTON_LABEL: {
    color: COLOR.PALETTE.black,
    fontSize: 20,
  },
  CONTAINER: {},
  HEADER: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
    marginLeft: 10,
    marginTop: 10
  },
  INPUT_LABEL_STYLE: {
    color: COLOR.PALETTE.black,
    fontSize: 10,
  },
  INPUT_LABEL_STYLE_CONTAINER: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: METRICS.screenWidth * 0.95,
  },
  INPUT_STYLE_CONTAINER: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: `${COLOR.PALETTE.green}25`,
    borderRadius: 5,
    flexDirection: 'row',
    height: 55,
    justifyContent: 'center',
    marginBottom: 25,
    marginTop: 10,
    width: METRICS.screenWidth * 0.95
  },
  LINE: {
    alignSelf: 'center',
    backgroundColor: COLOR.PALETTE.strongGreen,
    height: 1,
    marginVertical: 15,
    width: METRICS.screenWidth * 0.95
  },
  PASS_INPUT_STYLE: {
    alignSelf: 'center',
    color: COLOR.PALETTE.black,
    height: 55,
    width: METRICS.screenWidth * 0.80,
  },
  ROOT: {
		backgroundColor: COLOR.PALETTE.white,
    flex: 1,
    justifyContent: 'space-between'
	},
  ROOT_CONTAINER: {
    backgroundColor: COLOR.PALETTE.white,
    justifyContent: 'space-between',
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
    color: COLOR.PALETTE.green,
    fontSize: 32,
    marginLeft: 10,
    marginTop: 10
  },
  SWITCH_INPUT_STYLE_CONTAINER: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: `${COLOR.PALETTE.green}25`,
    borderRadius: 5,
    flexDirection: 'row',
    height: 80,
    justifyContent: 'space-between',
    marginTop: 10,
    width: METRICS.screenWidth * 0.95
  },
})
