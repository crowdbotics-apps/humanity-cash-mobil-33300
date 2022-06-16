import { Animated, StyleSheet } from 'react-native';
import { COLOR, TYPOGRAPHY, METRICS } from '../../theme';

export default StyleSheet.create({
    CONTAINER: {},
    BUTTON: {
        width: METRICS.screenWidth * 0.95,
        height: 55,
        backgroundColor: COLOR.PALETTE.green,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 27.5,
        marginBottom: 30
    },
    BUTTON_DISABLED: {
        width: METRICS.screenWidth * 0.95,
        height: 55,
        backgroundColor: `${COLOR.PALETTE.green}40`,
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 27.5,
        marginBottom: 30
    },
    BUTTON_LABEL: {
        fontSize: 16,
        color: COLOR.PALETTE.white,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    BOTTON_MENU: {
        position: 'absolute',
        bottom: 0,
        height: METRICS.screenWidth / 4,
        width: METRICS.screenWidth,
        backgroundColor: 'transparent',
        alignSelf: 'flex-end',
    },
    ICONS_CONTAINER: {
        position: 'absolute',
        bottom: 25,
        height: 50,
        width: METRICS.screenWidth * 0.9,
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    QR_BUTTON: {
        width: 66,
        height: 66,
        borderRadius: 33,
        backgroundColor: COLOR.PALETTE.blue,
        bottom: (METRICS.screenWidth / 4) - 35,
        elevation: 10,
        shadowColor: 'black',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        justifyContent: 'center',

        alignItems: 'center'
    },
    BOTTON_MENU_ICON_HOME: {
        width: 50,
        height: 50,
    },
    BOTTON_MENU_ICON_WALLET: {
        width: 60,
        height: 50,
    },
    BOTTON_MENU_ICON_SPEND: {
        width: 60,
        height: 55,
    },
    BOTTON_MENU_ICON_ADDRESS: {
        width: 50,
        height: 55,
    },
})
