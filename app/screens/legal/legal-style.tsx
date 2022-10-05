import { Animated, StyleSheet } from 'react-native';
import { COLOR, TYPOGRAPHY, METRICS } from '../../theme';

export default StyleSheet.create({
	BACK_BUTON_LABEL: {
    color: COLOR.PALETTE.black,
    fontSize: 16
  },
  CONTAINER: {},
  HEADER: {
    flexDirection: 'row',
    marginBottom: 10,
    marginLeft: 10,
    marginTop: 10
  },
  LINE: {
    alignSelf: 'center',
    backgroundColor: COLOR.PALETTE.strongGreen,
    height: 1,
    marginVertical: 10,
    width: METRICS.screenWidth * 0.95
  },
  POLICY_OPEN_CONTAINER: {
    alignSelf: 'center',
    backgroundColor: COLOR.PALETTE.background,
    marginBottom: 50,
    width: METRICS.screenWidth * 0.95,
  },
  ROOT: {
		backgroundColor: COLOR.PALETTE.white,
	},
  ROOT_CONTAINER: {
    backgroundColor: COLOR.PALETTE.white,
    flex: 1,
    justifyContent: 'space-between',
  },
  STEP_TITLE: {
    color: COLOR.PALETTE.green,
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
    color: COLOR.PALETTE.strongGreen,
    fontSize: 16,
    marginLeft: 15
  },
})
