import {Animated, StyleSheet} from "react-native"
import {COLOR, TYPOGRAPHY} from "../../theme";

export default StyleSheet.create({
    MAIN_CONTAINER: {
        flexDirection: "column",
        display:"flex",
        width: "90%",
        height:"100%",
        // justifyContent:"flex-end",
    },
    ROOT: {
        backgroundColor: COLOR.PALETTE.background,
        alignItems: "center",
    },
    FORGOT_PASSWORD:{
        fontWeight: "bold",
        fontSize: 16,
        fontFamily: TYPOGRAPHY.primarySemiBold,
        color: COLOR.PALETTE.marina_dark
    },
    SUB_TITLE: {
        color: COLOR.PALETTE.gray,
        fontSize: 16,
        fontWeight:"normal",
        fontFamily: TYPOGRAPHY.primary,
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
