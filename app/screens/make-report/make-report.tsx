import { Animated, StyleSheet } from 'react-native';
import { COLOR, TYPOGRAPHY, METRICS } from '../../theme';

export default StyleSheet.create({
  ACTIVITY: {
    marginTop: METRICS.screenHeight - 250
  },
  AGREE_CONTAINER: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  AGREE_LABEL: {
    color: COLOR.PALETTE.black,
    fontSize: 16,
    width: METRICS.screenWidth * 0.6,
  },
  AGREE_LABEL_LINK: {
    color: COLOR.PALETTE.blue,
    fontSize: 16,
    textDecorationLine: 'underline'
  },
  AMOUNT: {
    color: COLOR.PALETTE.activeBlue,
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10
  },
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
  BACK_BUTON_LABEL_MODAL: {
    color: COLOR.PALETTE.white,
    fontSize: 16
  },
  BUTTON_AMOUNT: {
    backgroundColor: COLOR.PALETTE.transparent,
    borderColor: COLOR.PALETTE.green,
    borderWidth: 1,
    height: 40,
    marginBottom: 0,
    marginRight: 15,
    width: 105
  },
  BUTTON_AMOUNT_ACTIVE: {
    backgroundColor: COLOR.PALETTE.green, 
    height: 40,
    marginBottom: 0,
    marginRight: 15,
    width: 105
  },
  CLOSE_MODAL_BUTTON: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginRight: 30
  },
  COSTS_LABEL: {
    color: COLOR.PALETTE.blue,
    fontSize: 16,
  },
  FILTER_CONTAINER: {
    alignSelf: 'center',
    marginBottom: 10,
    width: METRICS.screenWidth * 0.95
  },
  HEADER: {
    flexDirection: 'row',
    marginLeft: 10,
    marginTop: 10,
  },
  HEADER_ACTIONS: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    width: METRICS.screenWidth
  },
  INPUT_AMOUNT_STYLE_CONTAINER: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 20,
    width: METRICS.screenWidth * 0.95
  },
  INPUT_LABEL_ERROR: {
    color: COLOR.PALETTE.pink,
    fontSize: 10,
  },
  INPUT_LABEL_STYLE: {
    color: COLOR.PALETTE.black,
    fontSize: 10,
  },
  INPUT_LABEL_STYLE_CONTAINER: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 0,
    width: METRICS.screenWidth * 0.95,
  },
  INPUT_STYLE: {
    alignSelf: 'center',
    height: 55,
    width: METRICS.screenWidth * 0.40,
  },
  INPUT_STYLE_CONTAINER: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: `${COLOR.PALETTE.green}25`,
    borderRadius: 3,
    flexDirection: 'row',
    height: 55,
    justifyContent: 'center',
    marginTop: 10,
    width: METRICS.screenWidth * 0.45
  },
  INPUT_STYLE_CONTAINER_ERROR: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: `${COLOR.PALETTE.green}25`,
    borderColor: COLOR.PALETTE.pink,
    borderRadius: 3,
    borderWidth: 0.8,
    flexDirection: 'row',
    height: 55,
    justifyContent: 'center',
    marginTop: 10,
    width: METRICS.screenWidth * 0.95
  },
  LINE: {
    alignSelf: 'center',
    backgroundColor: COLOR.PALETTE.strongGreen,
    height: 1,
    marginVertical: 10,
    width: METRICS.screenWidth * 0.95
  },
  LOADING_RETURN: {
    backgroundColor: COLOR.PALETTE.white,
    height: METRICS.screenHeight
  },
  LOGO_STYLE: {
    alignSelf: 'center',
    height: 60,
    width: 130,
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
    height: 350,
    justifyContent: 'space-around',
    width: METRICS.screenWidth * 0.80,
  },
  MODAL_CONTENT: {
    height: 330,
    justifyContent: 'space-evenly',
    width: METRICS.screenWidth * 0.70
  },
  PENDING_TITLE: {
    color: COLOR.PALETTE.orange,
    fontSize: 32,
    marginLeft: 10,
    marginTop: 80,
    width: METRICS.screenWidth * 0.8
  },
  RETURNS_LABEL: {
    color: COLOR.PALETTE.purple,
    fontSize: 10,
    marginLeft: 10,
    marginVertical: 10
  },
  RETURN_AMOUNT: {
    color: COLOR.PALETTE.activeBlue,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 10,
    textAlign: 'center'
  },
  RETURN_CONTAINER: {
    alignSelf: 'center',
    backgroundColor: '#F8F6F2',
    height: 140,
    marginVertical: 10,
    width: METRICS.screenWidth * 0.95
  },
  RETURN_DETAIL_CONTAINER: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: METRICS.screenWidth * 0.85,
  },
  RETURN_DETAIL_LABEL: { 
    color: COLOR.PALETTE.black,
    fontSize: 10,
    fontWeight: 'bold',
  },
  RETURN_ITEM: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor:  COLOR.PALETTE.background,
    flexDirection: 'row',
    height: 80,
    justifyContent: 'space-between',
    marginVertical: 5,
    width: METRICS.screenWidth * 0.95
  },
  RETURN_ITEM_AMOUNT: {
    color: '#681D39',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 20
  },
  RETURN_ITEM_AMOUNT_CREDIT: {
    color: COLOR.PALETTE.black,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 20
  },
  RETURN_ITEM_CUSTOMER: {
    color:  COLOR.PALETTE.black,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 20
  },
  RETURN_ITEM_TIME: {
    color:  COLOR.PALETTE.gray,
    fontSize: 10,
    fontWeight: 'bold',
    marginRight: 20
  },
  ROOT: {
    backgroundColor: COLOR.PALETTE.white,
    flex: 1,
  },
  ROOT_CONTAINER: {
    backgroundColor: COLOR.PALETTE.white,
    flex: 1,
    justifyContent: 'space-between',
    minHeight: METRICS.screenHeight,
  },
  ROOT_MODAL: {
    alignItems: 'center',
    backgroundColor: 'rgba(157, 165, 111, 0.90)',
    flex: 1,
    justifyContent: 'space-between'
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
  SELECT_ICON: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 55,
    justifyContent: 'space-between',
    width: METRICS.screenWidth * 0.95,
  },
  SELECT_INPUT_STYLE_CONTAINER: {
    alignSelf: 'center',
    backgroundColor: `${COLOR.PALETTE.green}25`,
    borderRadius: 3,
    height: 55,
    marginTop: 10,
    width: METRICS.screenWidth * 0.95,
  },
  SELECT_INPUT_STYLE_CONTAINER_OPEN: {
    alignSelf: 'center',
    backgroundColor: `${COLOR.PALETTE.green}25`,
    borderColor: COLOR.PALETTE.orange,
    borderRadius: 3,
    borderWidth: 0.8,
    marginTop: 10,
    width: METRICS.screenWidth * 0.95,
  },
  SELECT_LABEL: {
    color: COLOR.PALETTE.black,
    fontSize: 16,
    marginLeft: 20
  },
  SMALL_INPUT_STYLE: {
    alignSelf: 'center',
    height: 55,
    width: METRICS.screenWidth * 0.40,
  },
  SMALL_INPUT_STYLE_CONTAINER: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: `${COLOR.PALETTE.green}25`,
    borderRadius: 3,
    flexDirection: 'row',
    height: 55,
    justifyContent: 'center',
    marginBottom: 15,
    marginTop: 5,
    width: METRICS.screenWidth * 0.45
  },
  STEP_CONTAINER: {},
  STEP_SUB_TITLE_MODAL: {
    color: COLOR.PALETTE.black,
    fontSize: 16,
    marginLeft: 10,
    width: METRICS.screenWidth * 0.7,
  },
  STEP_TITLE: {
    color: COLOR.PALETTE.orange,
    fontSize: 32,
    marginLeft: 10
  },
  STEP_TITLE_BLACK: {
    color: COLOR.PALETTE.black,
    fontSize: 32,
    marginLeft: 10,
    width: METRICS.screenWidth * 0.7,
  },
  SUBMIT_BUTTON: {
    bottom: 5,
  },
  SUBMIT_BUTTON_LABEL: {
    color: COLOR.PALETTE.white,
    fontSize: 16,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  SUB_TITLE: {
    color: COLOR.PALETTE.black,
    fontSize: 16,
    marginLeft: 10,
    width: METRICS.screenWidth * 0.90,
  },
})