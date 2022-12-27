import {  StyleSheet } from 'react-native';
import { COLOR, METRICS } from '../../theme';
// 6

export default StyleSheet.create({
  ACTIVITY: {
    marginTop: METRICS.screenHeight - 200
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
    marginRight: 10,
    textAlign: 'right'
  },
  AMOUNT_CONTAINER: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginLeft: 10,
    marginTop: 30
  },
  AMOUNT_ICON: {
    height: 30,
    marginRight: 5,
    width: 30
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
    fontSize: 16,
  },
  BACK_BUTON_LABEL_MODAL: {
    color: COLOR.PALETTE.white,
    fontSize: 16
  },
  BLUE_LINE: {
    alignSelf: 'center',
    backgroundColor: COLOR.PALETTE.blue,
    height: 1,
    marginBottom: 10,
    width: METRICS.screenWidth * 0.95
  },
  CLEAR_FILTERS: {
    alignSelf: 'center',
    color: COLOR.PALETTE.lightGrey,
    fontSize: 16,
    marginVertical: 10,
    textDecorationLine: 'underline'
  },
  CLOSE_MODAL_BUTTON: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginRight: 30
  },
  CONTAINER: {},
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
  EMPTY_CONTACTS: {
    alignItems: 'center', 
    marginTop: '50%'
  },
  FILTER_CONTAINER: {
    alignSelf: 'center',
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
    marginTop: 10,
    width: METRICS.screenWidth * 0.95
  },
  INPUT_STYLE: {
    alignSelf: 'center',
    color: COLOR.PALETTE.black,
    height: 55,
    width: METRICS.screenWidth * 0.90,
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
    width: METRICS.screenWidth * 0.95
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
  LINK: {
    color: COLOR.PALETTE.darkYellow,
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
    textDecorationLine: 'underline'
  },
  LOADING_RETURN: {
    height: METRICS.screenHeight - 50,
    marginTop: 50
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
    justifyContent: 'space-between',
    width: METRICS.screenWidth * 0.80,
  },
  MODAL_CONTENT: {
    height: 330,
    justifyContent: 'space-evenly',
    width: METRICS.screenWidth * 0.70
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
    height: 140,
    marginVertical: 10,
    width: METRICS.screenWidth * 0.75,
  },
  RETURN_DETAIL_CONTAINER: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: METRICS.screenWidth * 0.75,
  },
  RETURN_DETAIL_LABEL: { 
    color: COLOR.PALETTE.black,
    fontSize: 10,
    marginTop: 5
  },
  RETURN_IMAGE: {
    borderRadius: 30,
    height: 60,
    width: 60,
  },
  RETURN_ITEM: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: '5%',
    position: 'relative',
    width: '100%', 
    zIndex: 1000, 
  },
  RETURN_ITEM_AMOUNT: {
    color: COLOR.PALETTE.pink,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 20
  },
  RETURN_ITEM_AMOUNT_CASH_OUT: {
    color: COLOR.PALETTE.green,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 20
  },
  RETURN_ITEM_AMOUNT_CREDIT: {
    color: COLOR.PALETTE.activeBlue,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 20
  },
  RETURN_ITEM_CUSTOMER: {
    color:  COLOR.PALETTE.black,
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 25
  },
  RETURN_ITEM_MODAL: {
    bottom: 30,
    color: COLOR.PALETTE.activeBlue,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  RETURN_ITEM_TIME: {
    color:  COLOR.PALETTE.gray,
    fontSize: 10,
    fontWeight: 'bold',
    marginRight: 20
  },
  RETURN_ITEM_TOUCHABLE: {
    height: 60,
  },
  ROOT: {
    backgroundColor: COLOR.PALETTE.white,
    flex: 1,
    justifyContent: 'space-between'
  },
  ROOT_CONTAINER: {
    backgroundColor: COLOR.PALETTE.white,
    flex: 1,
    justifyContent: 'space-between',
    minHeight: METRICS.screenHeight,
  },
  ROOT_MODAL: {
    alignItems: 'center',
    backgroundColor: 'rgba(240, 240, 240, 0.90)',
    flex: 1,
    justifyContent: 'space-around'
  },
  SEARCH_INPUT_ADJUSTMENTS: {
    alignItems: 'center',
    backgroundColor: `${COLOR.PALETTE.green}25`,
    flexDirection: 'row',
    height: 55,
    justifyContent: 'space-evenly',
    width: METRICS.screenWidth * 0.22
  },
  SEARCH_INPUT_CONTAINER: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: METRICS.screenWidth * 0.95
  },
  SEARCH_INPUT_STYLE: {
    alignSelf: 'center',
    color: COLOR.PALETTE.black,
    height: 55,
    width: METRICS.screenWidth * 0.85,
  },
  SEARCH_INPUT_STYLE_CONTAINER: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: `${COLOR.PALETTE.green}25`,
    borderRadius: 3,
    flexDirection: 'row',
    height: 55,
    justifyContent: 'center',
    width: METRICS.screenWidth * 0.95
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
    color: COLOR.PALETTE.BLACK,
    fontSize: 16,
    marginLeft: 20
  },
  SMALL_INPUT_STYLE: {
    alignSelf: 'center',
    color: COLOR.PALETTE.black,
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
    width: METRICS.screenWidth * 0.45
  },
  STEP_CONTAINER: {},
  STEP_SUB_TITLE: {
    bottom: 20,
    color: COLOR.PALETTE.black,
    fontSize: 18,
    fontWeight: 'bold'
  },
  STEP_SUB_TITLE_MODAL: {
    color: COLOR.PALETTE.black,
    fontSize: 16,
    marginLeft: 10,
    width: METRICS.screenWidth * 0.7,
  },
  STEP_TITLE: {
    color: COLOR.PALETTE.blue,
    fontSize: 32,
    marginLeft: 10
  },
  STEP_TITLE_BLACK: {
    color: COLOR.PALETTE.black,
    fontSize: 32,
    marginLeft: 10,
    width: METRICS.screenWidth * 0.7,
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
  USER_IMAGE: {
    borderRadius: 30,
    height: 60,
    width: 60
  },

  USER_IMAGE_CONTAINER: {
    alignItems: 'center',
    backgroundColor: COLOR.PALETTE.transparent,
    borderRadius: 35,
    bottom: 35,
    height: 70,
    justifyContent: 'center',
    width: 70
  }
})
