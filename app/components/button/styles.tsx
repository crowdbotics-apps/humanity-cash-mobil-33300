import { Animated, StyleSheet } from 'react-native';
import { COLOR, TYPOGRAPHY, METRICS } from '../../theme';

export default StyleSheet.create({
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
})
