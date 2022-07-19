import { Animated, StyleSheet } from 'react-native';
import { COLOR, TYPOGRAPHY, METRICS } from '../../theme';

export default StyleSheet.create({
	ROOT: {
		backgroundColor: COLOR.PALETTE.white,
	},
  CONTAINER: {},
  ROOT_CONTAINER: {
    flex: 1,
    backgroundColor: COLOR.PALETTE.white,
    justifyContent: 'space-between',
    minHeight: METRICS.screenHeight,
    marginBottom: 80
  },
  HEADER: {
    marginLeft: 10,
    marginTop: 10,
    flexDirection: 'row',
  },
  STEP_TITLE: {
    fontSize: 32,
    color: COLOR.PALETTE.green,
    marginLeft: 10,
    marginTop: 10
  },
  BACK_BUTON_LABEL: {
    fontSize: 16,
    color: COLOR.PALETTE.black
  },
  LINE: {
    width: METRICS.screenWidth * 0.95,
    backgroundColor: COLOR.PALETTE.strongGreen,
    height: 1,
    alignSelf: 'center',
    marginVertical: 10
  },
  STEP_SUB_TITLE: {
    fontSize: 16,
    color: COLOR.PALETTE.black,
    marginLeft: 10,
    width: METRICS.screenWidth * 0.90,
  },
  SEARCH_INPUT_CONTAINER: {
    width: METRICS.screenWidth * 0.95,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20
  },
  SEARCH_INPUT_STYLE_CONTAINER: {
    borderRadius: 3,
    height: 55,
    width: METRICS.screenWidth * 0.75,
    backgroundColor: `${COLOR.PALETTE.green}25`,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  SEARCH_INPUT_STYLE: {
    height: 55,
    width: METRICS.screenWidth * 0.65,
    alignSelf: 'center',
  },
  SEARCH_INPUT_ADJUSTMENTS: {
    height: 55,
    width: METRICS.screenWidth * 0.15,
    backgroundColor: `${COLOR.PALETTE.green}25`,
    justifyContent: 'center',
    alignItems: 'center'
  },
  INDUSTRY_CONTAINER: {
    width: METRICS.screenWidth * 0.95,
    height: 200,
    alignSelf: 'center'
  },
  BUSINESS_CONTAINER: {
    flexDirection: 'row'
  },
  INDUSTRY_TITLE: {
    fontSize: 12,
    color: COLOR.PALETTE.orange,
    fontWeight: '700'
  },
  BUSINESS_IMAGE: {
    width: 90,
    height: 130,
  },
  MONTH_BUSINESS_IMAGE: {
    width: 110,
    height: 150,
  },
  BUSINESS_NAME: {
    fontSize: 10,
    color: COLOR.PALETTE.black,
    marginTop: 5
  },
  BUSINESS: {
    marginRight: 15
  },
  TOP_MONTH: {
    width: METRICS.screenWidth * 0.95 - 150,
  },
  MONTH_BUSINESS_NAME: {
    fontSize: 18,
    color: COLOR.PALETTE.black,
    marginTop: 5
  },
  MONTH_BUSINESS_ABOUT: {
    fontSize: 16,
    color: COLOR.PALETTE.black,
    marginTop: 5
  },
  DISTANCES_CONTAINER: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  DISTANCE_LABEL: {
    right: 10,
    fontSize: 16,
    color: COLOR.PALETTE.black,
  },
  DISTANCE_FILTER_LABEL: {
    fontSize: 10,
    color: COLOR.PALETTE.black,
  },
  FILTER_CONTAINER: {
    width: METRICS.screenWidth * 0.95,
    alignSelf: 'center'
  },
  FIND_MAP: {
    fontSize: 16,
    textDecorationLine: 'underline',
    marginVertical: 10
  },
  CLEAR_FILTERS: {
    fontSize: 16,
    textDecorationLine: 'underline',
    marginVertical: 10,
    alignSelf: 'center',
    color: COLOR.PALETTE.lightGrey
  }
})
