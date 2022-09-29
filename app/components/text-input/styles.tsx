import { Animated, StyleSheet } from 'react-native';
import { COLOR, TYPOGRAPHY, METRICS } from '../../theme';

export default StyleSheet.create({
    INPUT: {
        alignSelf: 'center',
        color: COLOR.PALETTE.pureblack,
        height: 55,
        width: METRICS.screenWidth * 0.90
    },
    INPUT_CONTAINER: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: COLOR.PALETTE.whiteTextInput,
        borderRadius: 5,
        flexDirection: 'row',
        height: 55,
        justifyContent: 'center',
        marginTop: 10,
        width: METRICS.screenWidth * 0.95
    },
    INPUT_CONTAINER_ERROR: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: COLOR.PALETTE.whiteTextInput,
        borderColor: COLOR.PALETTE.pink,
        borderRadius: 5,
        borderWidth: 0.8,
        flexDirection: 'row',
        height: 55,
        justifyContent: 'center',
        marginTop: 10,
        width: METRICS.screenWidth * 0.95
    },
    LABEL: {
        color: COLOR.PALETTE.black,
        fontSize: 10,
    },
    LABEL_CONTAINER: {
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        width: METRICS.screenWidth * 0.95
    },
    LABEL_ERROR: {
        color: COLOR.PALETTE.pink,
        fontSize: 10,
    },
})
