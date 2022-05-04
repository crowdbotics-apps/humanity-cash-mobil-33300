import { Animated, StyleSheet } from 'react-native';
import { COLOR, TYPOGRAPHY, METRICS } from '../../theme';

export default StyleSheet.create({
  ROOT: {
    flex: 1,
    backgroundColor: COLOR.PALETTE.white,
    marginTop: 50,
    justifyContent: 'space-between'
  },
  ROOT_CONTAINER: {
    flex: 1,
    backgroundColor: COLOR.PALETTE.white,
    justifyContent: 'space-between',
    minHeight: METRICS.screenHeight,
  },
  BACK_BUTON_LABEL: {
    fontSize: 16,
    color: COLOR.PALETTE.green
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
  CLOSE_MODAL_BUTTON: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginRight: 30
  },
  STEP_CONTAINER: {},
  STEP_TITLE: {
    fontSize: 32,
    color: COLOR.PALETTE.green,
    marginLeft: 10
  },
  ROOT_MODAL: {
    flex: 1,
    backgroundColor: COLOR.PALETTE.background,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  MODAL_CONTAINER: {
    backgroundColor: '#F8FAF6',
    width: METRICS.screenWidth * 0.80,
    height: 330,
    alignItems: 'center',
    borderRadius: 10,
  },
  MODAL_CONTENT: {
    width: METRICS.screenWidth * 0.70,
    height: 330,
    justifyContent: 'space-evenly'
  },
  STEP_TITLE_BLACK: {
    fontSize: 32,
    color: COLOR.PALETTE.black,
    marginLeft: 10,
    width: METRICS.screenWidth * 0.7,
  },
  STEP_SUB_TITLE_MODAL: {
    fontSize: 16,
    color: COLOR.PALETTE.black,
    marginLeft: 10,
    width: METRICS.screenWidth * 0.7,
  },
  MODAL_BUTTON: {
    width: METRICS.screenWidth * 0.70,
    height: 55,
    backgroundColor: COLOR.PALETTE.green,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 27.5,
    marginBottom: 20
  },
  SUBMIT_BUTTON_LABEL: {
    fontSize: 16,
    color: COLOR.PALETTE.white,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  AGREE_CONTAINER: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  AGREE_LABEL: {
    width: METRICS.screenWidth * 0.6,
    fontSize: 16,
    color: COLOR.PALETTE.black,
  },
  AGREE_LABEL_LINK: {
    fontSize: 16,
    color: COLOR.PALETTE.blue,
    textDecorationLine: 'underline'
  },
  LOGO_STYLE: {
    width: 120,
    alignSelf: 'center'
  },
  LINE: {
    width: METRICS.screenWidth * 0.95,
    backgroundColor: COLOR.PALETTE.strongGreen,
    height: 1,
    alignSelf: 'center',
    marginVertical: 10
  },
  AMOUNT: {
    color: COLOR.PALETTE.blue,
    fontSize: 24,
    fontWeight: 'bold',
  },
  AMOUNT_ICON: {
    width: 30,
    height: 30,
    marginRight: 5
  },
  AMOUNT_CONTAINER: {
    flexDirection: 'row',
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  LOAD_WALLET_LABEL: {
    color: COLOR.PALETTE.white,
    fontSize: 16,
    textAlign: 'center'
  },
  LOAD_WALLET_CONTAINER: {
    backgroundColor: COLOR.PALETTE.mustard,
    width: 120,
    height: 25,
    borderRadius: 20,
    marginRight: 10
  },
  NEWS_CONTAINER: {
    width: METRICS.screenWidth * 0.9,
    backgroundColor: COLOR.PALETTE.lightGray,
    alignItems: 'center',
    height: 500,
    alignSelf: 'center',
    justifyContent: 'space-around',
    marginTop: 15
  },
  NEWS_HEADER_CONTAINER: {
    flexDirection: 'row',
    width: METRICS.screenWidth * 0.80,
    justifyContent: 'space-between',
    marginTop: 10
  },
  NEWS_TAG: {
    fontSize: 10,
    color: COLOR.PALETTE.black
  },
  NEWS_TITLE: {
    fontSize: 18,
    color: COLOR.PALETTE.black,
    fontWeight: 'bold',
    marginTop: 15,
    width: METRICS.screenWidth * 0.80,
  },
  NEWS_BODY: {
    fontSize: 18,
    color: COLOR.PALETTE.black,
    marginTop: 10,
    width: METRICS.screenWidth * 0.80,
  },
  NEWS_IMAGE: {
    width: METRICS.screenWidth * 0.80,
    flex: 1,
    height: null,
  },
})