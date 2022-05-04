import { Animated, StyleSheet } from 'react-native';
import { COLOR, TYPOGRAPHY, METRICS } from '../../theme';

export default StyleSheet.create({
  ROOT: {
    flex: 1,
    backgroundColor: COLOR.PALETTE.white,
    marginTop: 50,
    justifyContent: 'space-between'
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
})