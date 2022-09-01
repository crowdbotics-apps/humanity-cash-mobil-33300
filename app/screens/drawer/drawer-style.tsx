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
		color: COLOR.PALETTE.blue,
		fontSize: 16
	},
	HEADER: {},
	LINE: {
    backgroundColor: '#2E2E2E40',
    height: 2,
    marginVertical: 10,
    width: METRICS.screenWidth * 0.9
  },
  MENU_ITEM_CONTAINER: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 40
  },
  MENU_ITEM_ICON: {
    height: 20 ,
    marginLeft: 15  ,
    marginRight: 15,
    width: 20
  },
  MENU_ITEM_LABEL: {
    color: COLOR.PALETTE.black,
    fontSize: 16
  },
  ROOT: {
		flex: 1,
		justifyContent: 'space-between'
	},
  SIGN_OUT: {
    color: COLOR.PALETTE.mustard,
    fontSize: 16,
  },
  SIGN_OUT_CONTAINER: {
    height: 100,
    justifyContent: 'center'
  },
  SWITCH_ACCOUNT_CONTAINER: {
    justifyContent: 'center'
  },
  SWITCH_ACCOUNT_LABEL: {
    color: COLOR.PALETTE.black,
    fontSize: 16
  },
  SWITCH_ACCOUNT_LABEL_BLUE: {
    color: COLOR.PALETTE.black,
    fontSize: 16
  },
  TOTAL_CURRENCY: {
    color: COLOR.PALETTE.black,
    fontSize: 32,
    marginLeft: 15,
    marginVertical: 20
  },
  USER_CONTAINER: {
    flexDirection: 'row',
    height: 80,
    width: METRICS.screenWidth * 0.9,
  },
  USER_CONTAINER_CHANGE: {
    backgroundColor: COLOR.PALETTE.mustard,
    flexDirection: 'row',
    height: 80,
    width: METRICS.screenWidth * 0.9,
  },
  USER_IMAGE: {
    borderRadius: 30,
    height: 60,
    width: 60
  },
  USER_IMAGE_CONTAINER: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginVertical: 10
  },
  USER_NAME: {
    color: COLOR.PALETTE.white,
    fontSize: 16
  },
  USER_NAME_BLACK: {
    color: COLOR.PALETTE.black,
    fontSize: 16
  }
})
