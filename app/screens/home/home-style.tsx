import { Animated, StyleSheet } from 'react-native';
import { COLOR, TYPOGRAPHY, METRICS } from '../../theme';

export default StyleSheet.create({
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
    color: COLOR.PALETTE.blue,
    fontSize: 24,
    fontWeight: 'bold',
  },
  AMOUNT_CONTAINER: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10
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
    color: COLOR.PALETTE.blue,
    fontSize: 16
  },
  CASHIER_BUTTON_BIG: {
    alignItems:"center",
    alignSelf: 'center',
    backgroundColor: COLOR.PALETTE.lightGray,
    height: 155,
    justifyContent: 'center',
    marginTop: 80,
    width: METRICS.screenWidth * 0.9
  },
  CASHIER_BUTTON_ICON: {
    height: 20,
    marginHorizontal: 20,
    width: 20
  },
  CASHIER_BUTTON_ICON_BIG: {
    height: 70,
    marginVertical: 10,
    width: 70
  },
  CASHIER_BUTTON_LABEL: {
    color: COLOR.PALETTE.black,
    fontSize: 16,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  CASHIER_BUTTON_SMALL: {
    alignItems:"center",
    alignSelf: 'center',
    backgroundColor: COLOR.PALETTE.lightGray,
    flexDirection: 'row',
    height: 55,
    marginTop: 10,
    width: METRICS.screenWidth * 0.9
  },
  CLOSE_MODAL_BUTTON: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginRight: 30
  },
  COUPON_CONTAINER: {
    marginRight: 10,
    width: 100
  },
  COUPON_TITLE: {
    color: COLOR.PALETTE.pureblack,
    fontSize: 12,
    marginVertical: 3,
    textAlign: 'center',

  },
  HEADER: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
    marginLeft: 10,
    marginTop: 10,
  },
  INDUSTRY_TITLE: {
    color: COLOR.PALETTE.orange,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 10,
    marginLeft: 10
  },
  LINE: {
    alignSelf: 'center',
    backgroundColor: COLOR.PALETTE.strongGreen,
    height: 1,
    marginVertical: 10,
    width: METRICS.screenWidth * 0.95
  },
  LOAD_WALLET_CONTAINER: {
    backgroundColor: COLOR.PALETTE.mustard,
    borderRadius: 20,
    height: 25,
    justifyContent: 'center',
    marginRight: 10,
    width: 120
  },
  LOAD_WALLET_LABEL: {
    color: COLOR.PALETTE.white,
    fontSize: 16,
    textAlign: 'center'
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
    borderRadius: 10,
    height: 330,
    width: METRICS.screenWidth * 0.80,
  },
  MODAL_CONTENT: {
    height: 330,
    justifyContent: 'space-evenly',
    width: METRICS.screenWidth * 0.70
  },
  NEED_HELP_CONTAINER: {
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 100,
    width: METRICS.screenWidth * 0.80
  },
  NEED_HELP_LINK: {
    color: COLOR.PALETTE.darkYellow,
    fontSize: 16,
    textAlign: 'center'
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
    height: 400,
    justifyContent: 'space-around',
    marginTop: 15,
    width: METRICS.screenWidth * 0.95
  },
  NEWS_HEADER_CONTAINER: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: METRICS.screenWidth * 0.80
  },
  NEWS_IMAGE: {
    flex: 1,
    height: null,
    width: METRICS.screenWidth * 0.80,
  },
  NEWS_TAG: {
    color: COLOR.PALETTE.gray,
    fontSize: 10
  },
  NEWS_TITLE: {
    color: COLOR.PALETTE.black,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    width: METRICS.screenWidth * 0.80,
  },
  RETURN_IMAGE: {
    height: 130,
    width: 100,
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
    // minHeight: METRICS.screenHeight,
  },
  ROOT_MODAL: {
    alignItems: 'center',
    backgroundColor: COLOR.PALETTE.background,
    flex: 1,
    justifyContent: 'space-around'
  },
  STEP_CONTAINER: {
    width: METRICS.screenWidth
  },
  STEP_SUB_TITLE_MODAL: {
    color: COLOR.PALETTE.black,
    fontSize: 16,
    marginLeft: 10,
    width: METRICS.screenWidth * 0.7,
  },
  STEP_TITLE: {
    color: COLOR.PALETTE.green,
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
})