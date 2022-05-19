import {Animated, StyleSheet} from "react-native"
import {COLOR, TYPOGRAPHY} from "../../theme";

export default StyleSheet.create({
    MAIN_CONTAINER: {
        flexDirection: "column",
        display:"flex",
        width: "90%",
    },
    ROOT: {
        backgroundColor: COLOR.PALETTE.background,
        alignItems: "center"
    },
    FORGOT_PASSWORD:{
        fontWeight: "bold",
        fontSize: 16,
        alignSelf:"flex-end",
        color: COLOR.PALETTE.marina_dark,
        fontFamily: TYPOGRAPHY.primarySemiBold,
    },
    SUB_TITLE: {
        color: COLOR.PALETTE.gray,
        fontSize: 16,
        fontFamily: TYPOGRAPHY.primary,
        marginTop: 5,
        marginLeft: 0,
        marginRight: 22,
        marginBottom: 10
    },
    TITLE: {
        color: COLOR.PALETTE.marina_dark,
        fontSize: 25,
        fontFamily: TYPOGRAPHY.primary,
        marginTop: 22,
        marginLeft: 0,
        marginRight: 22,
        marginBottom: 10
    },

})
