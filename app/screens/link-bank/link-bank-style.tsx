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
    color: COLOR.PALETTE.blue,
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
    alignSelf:'center'
  },
  POLICY_OPEN_CONTAINER: {
    width: METRICS.screenWidth * 0.95,
    backgroundColor: COLOR.PALETTE.background,
    alignSelf: 'center',
    marginBottom: 250,
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
    width: METRICS.screenWidth * 0.95,
    backgroundColor: `${COLOR.PALETTE.green}25`,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  SEARCH_INPUT_STYLE: {
    height: 55,
    width: METRICS.screenWidth * 0.85,
    alignSelf: 'center',
  },
  SEARCH_INPUT_ADJUSTMENTS: {
    height: 55,
    width: METRICS.screenWidth * 0.15,
    backgroundColor: `${COLOR.PALETTE.green}25`,
    justifyContent: 'center',
    alignItems: 'center'
  },
  
  BANKS_ICON_CONTAINER: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: METRICS.screenWidth * 0.95,
    alignSelf: 'center'
  },
  BANK_ICON_CONTAINER: {
    backgroundColor: COLOR.PALETTE.lightGray,
    width: METRICS.screenWidth * 0.46,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  BANK_ICON_CONTAINER_VIEW: {
    backgroundColor: COLOR.PALETTE.lightGray,
    width: METRICS.screenWidth * 0.46,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 30
  },
  BANK_ICON: {
    width: 80,
    height: 80
  },
  INPUT_LABEL_STYLE_CONTAINER: {
    flexDirection: 'row',
    width: METRICS.screenWidth * 0.95,
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginTop: 30
  },
  INPUT_LABEL_STYLE: {
    fontSize: 10,
    color: COLOR.PALETTE.black,
    
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
  INPUT_STYLE: {
    height: 55,
    width: METRICS.screenWidth * 0.90,
    alignSelf: 'center',
  },
  PASS_INPUT_STYLE: {
    height: 55,
    width: METRICS.screenWidth * 0.80,
    alignSelf: 'center',
  },
})
