import { Animated, StyleSheet } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { COLOR, TYPOGRAPHY, METRICS } from '../../theme';

export default StyleSheet.create({
    BACK_BUTON_LABEL: {
        color: COLOR.PALETTE.white,
        fontSize: 16
    },
    BOTTON_MENU: {
        alignSelf: 'flex-end',
        backgroundColor: COLOR.PALETTE.transparent,
        bottom: -1,
        height: METRICS.screenWidth / 4,
        width: METRICS.screenWidth,
    },
    BOTTON_MENU_ICON_ADDRESS: {
        height: 55,
        width: 50,
    },
    BOTTON_MENU_ICON_HOME: {
        height: 50,
        width: 50,
    },
    BOTTON_MENU_ICON_SPEND: {
        height: 55,
        width: 60,
    },
    BOTTON_MENU_ICON_WALLET: {
        height: 50,
        width: 60,
    },
    BUTTON: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: COLOR.PALETTE.green,
        borderRadius: 27.5,
        flexDirection: 'row',
        height: 55,
        justifyContent: 'center',
        marginBottom: 30,
        width: METRICS.screenWidth * 0.95
    },
    BUTTON_DISABLED: {
        alignSelf: 'center',
        backgroundColor: `${COLOR.PALETTE.green}40`,
        borderRadius: 27.5,
        height: 55,
        justifyContent: 'center',
        marginBottom: 30,
        width: METRICS.screenWidth * 0.95
    },
    BUTTON_LABEL: {
        color: COLOR.PALETTE.white,
        fontSize: 16,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    CLOSE_MODAL_BUTTON: {
        alignItems: 'center',
        alignSelf: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'center',
        marginLeft: 15,
        marginTop: 20,
    },
    CONTAINER: {
      backgroundColor: COLOR.PALETTE.transparent
    },
    ICONS_CONTAINER: {
        alignSelf: 'center',
        bottom: 24,
        flexDirection: 'row',
        height: 50,
        justifyContent: 'space-between',
        position: 'absolute',
        width: METRICS.screenWidth * 0.9
    },
    INPUT_LABEL_STYLE: {
        color: COLOR.PALETTE.black,
        fontSize: 10,
      },
    INPUT_LABEL_STYLE_CONTAINER: {
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: METRICS.screenWidth * 0.95,
      },
    INPUT_STYLE: {
        alignSelf: 'center',
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
    NEED_HELP_CONTAINER: {
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 20,
        width: METRICS.screenWidth * 0.80
      },
      NEED_HELP_LINK: {
        color: COLOR.PALETTE.darkYellow,
        fontSize: 16,
        textAlign: 'center',
        textDecorationLine: 'underline'
      },
      QR_BUTTON: {
        alignItems: 'center',
        backgroundColor: COLOR.PALETTE.blue,
        borderRadius: 33,
        bottom: (METRICS.screenWidth / 4) - 35,
        elevation: 10,
        height: 66,
        justifyContent: 'center',
        shadowColor: COLOR.PALETTE.black,
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        width: 66
    },
      QR_BUTTON_MERCHANT: {
        alignItems: 'center',
        backgroundColor: COLOR.PALETTE.green,
        borderRadius: 33,
        bottom: (METRICS.screenWidth / 4) - 35,
        elevation: 10,
        height: 66,
        justifyContent: 'center',
        shadowColor: COLOR.PALETTE.black,
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        width: 66
    },
      ROOT_MODAL: {
        flex: 1,
    },
      SWITCH_CONTAINER: {
        alignSelf: 'center',
        marginTop: 30
    },
})
