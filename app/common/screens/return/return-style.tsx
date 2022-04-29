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
  HEADER_ACTIONS: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 50,
  },
  LINE: {
    width: METRICS.screenWidth * 0.95,
    backgroundColor: COLOR.PALETTE.strongGreen,
    height: 1,
    alignSelf: 'center',
    marginVertical: 10
  },
  SUB_TITLE: {
    fontSize: 16,
    color: COLOR.PALETTE.black,
    marginLeft: 10,
    width: METRICS.screenWidth * 0.90,
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
    backgroundColor: '#9DA56F90',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  MODAL_CONTAINER: {
    backgroundColor: '#F8FAF6',
    width: METRICS.screenWidth * 0.80,
    height: 350,
    alignItems: 'center',
    justifyContent: 'space-around',
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
  RETURN_CONTAINER: {
    width: METRICS.screenWidth * 0.95,
    height: 140,
    backgroundColor: '#F8F6F2',
    alignSelf: 'center',
    marginVertical: 10
  },
  RETURN_AMOUNT: {
    color: '#3B88B6',
    fontSize: 32,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 30
  },
  RETURN_DETAIL_CONTAINER: {
    flexDirection: 'row',
    width: METRICS.screenWidth * 0.85,
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  RETURN_DETAIL_LABEL: { 
    fontSize: 10,
    color: COLOR.PALETTE.black,
    fontWeight: 'bold',
  },
  INPUT_LABEL_STYLE_CONTAINER: {
    flexDirection: 'row',
    width: METRICS.screenWidth * 0.95,
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginTop: 20
  },
  INPUT_LABEL_STYLE: {
    fontSize: 10,
    color: COLOR.PALETTE.black,
  },
  INPUT_LABEL_ERROR: {
    fontSize: 10,
    color: COLOR.PALETTE.pink,
  },
  INPUT_STYLE_CONTAINER_ERROR: {
    borderRadius: 3,
    height: 55,
    width: METRICS.screenWidth * 0.95,
    backgroundColor: `${COLOR.PALETTE.green}25`,
    alignSelf: 'center',
    marginTop: 10,
    borderColor: COLOR.PALETTE.pink,
    borderWidth: 0.8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  INPUT_STYLE_CONTAINER: {
    borderRadius: 3,
    height: 55,
    width: METRICS.screenWidth * 0.95,
    backgroundColor: `${COLOR.PALETTE.green}25`,
    alignSelf: 'center',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  INPUT_STYLE: {
    height: 55,
    width: METRICS.screenWidth * 0.90,
    alignSelf: 'center',
  },
  LOADING_RETURN: {
    marginTop: 50,
    height: METRICS.screenHeight - 50
  },
  ACTIVITY: {
    marginTop: METRICS.screenHeight - 200
  },
  LOGO_STYLE: {
    width: 100,
    alignSelf: 'center'
  },
  RETURNS_LABEL: {
    color: COLOR.PALETTE.purple,
    fontSize: 10,
    marginLeft: 10,
    marginVertical: 10
  },
  RETURN_ITEM: {
    width: METRICS.screenWidth * 0.95,
    height: 80,
    flexDirection: 'row',
    backgroundColor:  COLOR.PALETTE.background,
    alignSelf: 'center',
    marginVertical: 5,
    justifyContent: 'space-between',
    alignItems: 'center'
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
  RETURN_ITEM_AMOUNT: {
    color: '#681D39',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 20
  },
  AMOUNT: {
    color: '#3D88B6',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10
  }


})