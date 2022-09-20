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
        borderRadius: 5,
        height: 55,
        width: METRICS.screenWidth * 0.95,
        // backgroundColor: `${COLOR.PALETTE.green}25`,
        backgroundColor: COLOR.PALETTE.whiteTextInput,
        alignSelf: 'center',
        marginTop: 10,
        borderColor: COLOR.PALETTE.pink,
        borderWidth: 0.8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
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
