import { Animated, StyleSheet } from 'react-native';
import { COLOR, TYPOGRAPHY, METRICS } from '../../theme';

export default StyleSheet.create({
	BACK_BUTON_LABEL: {
    color: COLOR.PALETTE.black,
    fontSize: 16
  },
  BUSINESS: {
    marginRight: 15
  },
  BUSINESS_CONTAINER: {
    flexDirection: 'row'
  },
  BUSINESS_IMAGE: {
    height: 130,
    width: 90,
  },
  BUSINESS_NAME: {
    color: COLOR.PALETTE.black,
    fontSize: 10,
    marginTop: 5
  },
  CLEAR_FILTERS: {
    alignSelf: 'center',
    color: COLOR.PALETTE.lightGrey,
    fontSize: 16,
    marginVertical: 10,
    textDecorationLine: 'underline'
  },
  CONTAINER: {},
  DETAIL_LINKS: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 80,
    marginBottom: 10,
    width: METRICS.screenWidth * 0.80,
  },
  DISTANCES_CONTAINER: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  DISTANCE_FILTER_LABEL: {
    color: COLOR.PALETTE.black,
    fontSize: 10,
  },
  DISTANCE_LABEL: {
    color: COLOR.PALETTE.black,
    fontSize: 16,
    right: 10,
  },
  FILTER_CONTAINER: {
    alignSelf: 'center',
    width: METRICS.screenWidth * 0.95
  },
  FIND_MAP: {
    fontSize: 16,
    marginVertical: 10,
    textDecorationLine: 'underline'
  },
  HEADER: {
    flexDirection: 'row',
    marginLeft: 10,
    marginTop: 10,
  },
  INDUSTRY_CONTAINER: {
    alignSelf: 'center',
    height: 200,
    width: METRICS.screenWidth * 0.95
  },
  SEE_ON_MAP_LABEL: {
    color: COLOR.PALETTE.blue,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right'
  },
  INDUSTRY_TITLE: {
    color: COLOR.PALETTE.orange,
    fontSize: 12,
    fontWeight: '700'
  },
  LINE: {
    alignSelf: 'center',
    backgroundColor: COLOR.PALETTE.strongGreen,
    height: 1,
    marginVertical: 10,
    width: METRICS.screenWidth * 0.95
  },
  MONTH_BUSINESS_ABOUT: {
    color: COLOR.PALETTE.black,
    fontSize: 16,
    marginTop: 5
  },
  MONTH_BUSINESS_IMAGE: {
    height: 150,
    width: 110,
  },
  MONTH_BUSINESS_NAME: {
    color: COLOR.PALETTE.black,
    fontSize: 18,
    marginTop: 5
  },
  NEWS_BODY: {
    color: COLOR.PALETTE.black,
    fontSize: 16,
    marginTop: 10,
    width: METRICS.screenWidth * 0.80,
  },
  NEWS_CONTAINER: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: COLOR.PALETTE.lightGray,
    borderRadius: 3,
    height: 480,
    justifyContent: 'space-around',
    marginVertical: 15,
    width: METRICS.screenWidth * 0.95
  },
  NEWS_IMAGE: {
    flex: 1,
    height: null,
    width: METRICS.screenWidth * 0.80,
  },
  NEWS_TITLE: {
    color: COLOR.PALETTE.black,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    width: METRICS.screenWidth * 0.80,
  },
  ROOT: {
		backgroundColor: COLOR.PALETTE.white,
	},
  ROOT_CONTAINER: {
    backgroundColor: COLOR.PALETTE.white,
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: 80,
    minHeight: METRICS.screenHeight
  },
  SEARCH_INPUT_ADJUSTMENTS: {
    alignItems: 'center',
    backgroundColor: `${COLOR.PALETTE.green}25`,
    height: 55,
    justifyContent: 'center',
    width: METRICS.screenWidth * 0.15
  },
  SEARCH_INPUT_CONTAINER: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 10,
    width: METRICS.screenWidth * 0.95
  },
  SEARCH_INPUT_STYLE: {
    alignSelf: 'center',
    height: 55,
    width: METRICS.screenWidth * 0.65,
  },
  SEARCH_INPUT_STYLE_CONTAINER: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: `${COLOR.PALETTE.green}25`,
    borderRadius: 3,
    flexDirection: 'row',
    height: 55,
    justifyContent: 'center',
    width: METRICS.screenWidth * 0.75
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
  TOP_MONTH: {
    width: METRICS.screenWidth * 0.95 - 150,
  }
})
