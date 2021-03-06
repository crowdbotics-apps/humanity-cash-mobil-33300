import { Animated, StyleSheet } from 'react-native';
import { COLOR, TYPOGRAPHY, METRICS } from '../../theme';

export default StyleSheet.create({
	ROOT: {
		flex: 1,
		backgroundColor: COLOR.PALETTE.background,
		justifyContent: 'space-between'
	},
  HEADER: {
		backgroundColor: COLOR.PALETTE.background,
	},
	BACK_BUTON_LABEL: {
		fontSize: 16,
		color: COLOR.PALETTE.blue
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
  USER_CONTAINER: {
    flexDirection: 'row',
    width: METRICS.screenWidth * 0.9,
    height: 80,
  },
  USER_CONTAINER_CHANGE: {
    flexDirection: 'row',
    width: METRICS.screenWidth * 0.9,
    height: 80,
    backgroundColor: COLOR.PALETTE.mustard,
  },
  USER_IMAGE_CONTAINER: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20
  },
  USER_IMAGE: {
    width: 60,
    height: 60,
    borderRadius: 30
  },
  SWITCH_ACCOUNT_CONTAINER: {
    justifyContent: 'center'
  },
  USER_NAME: {
    fontSize: 16,
    color: COLOR.PALETTE.white
  },
  USER_NAME_BLACK: {
    fontSize: 16,
    color: COLOR.PALETTE.black
  },
  SWITCH_ACCOUNT_LABEL: {
    fontSize: 16,
    color: COLOR.PALETTE.black
  },
  SWITCH_ACCOUNT_LABEL_BLUE: {
    fontSize: 16,
    color: COLOR.PALETTE.blue
  },
  TOTAL_CURRENCY: {
    marginLeft: 15,
    fontSize: 32,
    marginVertical: 20,
    color: COLOR.PALETTE.black
  },
  MENU_ITEM_CONTAINER: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center'
  },
  MENU_ITEM_LABEL: {
    fontSize: 16,
    color: COLOR.PALETTE.black
  },
  LINE: {
    width: METRICS.screenWidth * 0.9,
    height: 2,
    backgroundColor: '#2E2E2E40',
    marginVertical: 10
  },
  SIGN_OUT_CONTAINER: {
    justifyContent: 'center',
    height: 100
  },
  SIGN_OUT: {
    fontSize: 16,
    color: COLOR.PALETTE.mustard,
  },
  MENU_ITEM_ICON: {
    width: 20 ,
    height: 20  ,
    marginLeft: 15,
    marginRight: 15
  }
})
