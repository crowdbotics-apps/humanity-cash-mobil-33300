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
        fontSize: 24,
        fontFamily: TYPOGRAPHY.primary,
        marginTop: 22,
        marginLeft: 0,
        marginRight: 22,
        marginBottom: 10
    },
    CODE_INPUT_TEXT: {
        fontFamily: "Montserrat-Regular",
        fontSize: 16,
        color: COLOR.PALETTE.gray,
        marginTop: 5,
        textAlign:"center"
    },
    FIRST_TITLE_MODAL: {
        flexDirection: "row",
        marginTop: 10,

        alignSelf: "center"
    },
    MODAL_BODY: {
        height: "80%",
        width: "100%",
        backgroundColor: COLOR.PALETTE.white,
        padding: 20,
        paddingBottom: 0,
        position: "absolute",
        bottom: 0,
        elevation: 5,
        borderTopStartRadius: 50,
        borderTopEndRadius: 50,
        shadowColor: COLOR.PALETTE.black,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2
    },
    MARINA_LOGO: {
        width: 34,
        height: 35,
        alignSelf: "center"
    },
    FORM_CONTAINER: {
        marginTop: 20,
        flex: 1
    },
    cellRoot: {
        width: 58,
        height: 56,
        justifyContent: "center",
        alignItems: "center",
        margin:8,
        borderColor: COLOR.PALETTE.gray,
        // borderBottomWidth: 2
        borderWidth: 2,
        // padding: 5,
        borderRadius: 8
    },
    cellText: {
        color: COLOR.PALETTE.marina_dark,
        fontSize: 32,
        textAlign: "center"
    },
    focusCell: {
        borderColor: COLOR.PALETTE.marina_dark,
        borderBottomWidth: 2,
        backgroundColor: COLOR.PALETTE.pacific_blue_light
        // padding:50
    },
    CANCEL_CONFIRM_BUTTON_CONTAINER: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: "auto",
        marginBottom: 50
    },
    codeFieldRoot: {
        // marginTop: 20,
        // width: 230,
        marginLeft: "auto",
        marginRight: "auto",
        // borderWidth: 1,
        // borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        // borderColor: COLOR.PALETTE.background,
        // shadowColor: COLOR.PALETTE.black,
        // shadowOffset: { width: 1, height: 1 },
        // shadowOpacity: 0.3,
        shadowRadius: 2,
        // elevation: 1,
        backgroundColor: COLOR.PALETTE.white
    },

})
