import { StyleSheet } from 'react-native';
import { COLOR, METRICS } from '../../theme';

export default StyleSheet.create({
    BACK_BUTON_LABEL: {
        color: COLOR.PALETTE.white,
        fontSize: 16
    },
    BACK_BUTON_LABEL_COUPON: {
      color: COLOR.PALETTE.white,
      fontSize: 16
  },
    BACK_BUTON_LABEL_MODAL: {
      color: COLOR.PALETTE.white,
      fontSize: 16
    },
    CLOSE_MODAL_BUTTON: {
      alignItems: 'center',
      alignSelf: 'flex-end',
      flexDirection: 'row',
      height: 40,
      justifyContent: 'flex-start',
      marginRight: 30,
      marginTop: 30,
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
      height: 300,
      justifyContent: 'space-evenly',
      width: METRICS.screenWidth * 0.80,
    },
    MODAL_CONTAINER_COUPON: {
      alignItems: 'center',
      backgroundColor: COLOR.PALETTE.lighterGreen,
      borderRadius: 20,
      height: 220,
      justifyContent: 'space-evenly',
      opacity: 10,
      width: METRICS.screenWidth * 0.80,
    },
    MODAL_CONTENT: {
      height: 250,
      justifyContent: 'space-evenly',
      width: METRICS.screenWidth * 0.70
    },
    ROOT_MODAL: {
      alignItems: 'center',
      backgroundColor: COLOR.PALETTE.modalBackgroundDarkColor,
      flex: 1,
      justifyContent: 'space-between',
      
    },
    ROOT_MODAL_COUPON: {
      alignItems: 'center',
      backgroundColor: COLOR.PALETTE.modalBackgroundDarkColor,
      flex: 1,
      justifyContent: 'space-between',
    },
    STEP_SUB_TITLE_MODAL: {
      color: COLOR.PALETTE.black,
      fontSize: 16,
      marginLeft: 10,
      width: METRICS.screenWidth * 0.7,
    },
    STEP_TITLE: {
      color: COLOR.PALETTE.orange,
      fontSize: 32,
      marginLeft: 10,
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
