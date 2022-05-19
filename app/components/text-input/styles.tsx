import { Animated, StyleSheet } from 'react-native';
import { COLOR, TYPOGRAPHY, METRICS } from '../../theme';

export default StyleSheet.create({
    LABEL_CONTAINER: {
        flexDirection: 'row',
        width: METRICS.screenWidth * 0.95,
        justifyContent: 'space-between',
        alignSelf: 'center',
        marginTop: 30
    },
    LABEL: {
        fontSize: 10,
        color: COLOR.PALETTE.black,
    },
    LABEL_ERROR: {
        fontSize: 10,
        color: COLOR.PALETTE.pink,
    },
    INPUT_CONTAINER: {
        borderRadius: 5,
        height: 55,
        width: METRICS.screenWidth * 0.95,
        backgroundColor: `${COLOR.PALETTE.green}25`,
        alignSelf: 'center',
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    INPUT_CONTAINER_ERROR: {
        borderRadius: 5,
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
    INPUT: {
        height: 55,
        width: METRICS.screenWidth * 0.90,
        alignSelf: 'center',
    },
})
