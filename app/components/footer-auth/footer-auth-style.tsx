import {StyleSheet} from "react-native"
import {COLOR, TYPOGRAPHY} from "../../theme";

export default StyleSheet.create({
    BUTTON_CONTAINER:{
        marginBottom: 20,
        alignSelf:"center",
        display:"flex",
        flexDirection:"row",
        width: "90%"
    },
    TEXT_CONTAINER:{
        display:"flex",
        flexDirection:"row",
        alignSelf:"center",
        marginBottom:30,
        borderWidth: 0,
        alignItems:"baseline"
    },
    TEXT:{
        fontFamily: TYPOGRAPHY.primary,
        borderWidth: 0,
        alignSelf:"center",
        color: COLOR.PALETTE.gray
    },
    ACTION_TEXT:{
        fontWeight: "bold",
        fontSize: 16,
        fontFamily: TYPOGRAPHY.primarySemiBold,
        color: COLOR.PALETTE.marina_dark,
        margin:0,
        padding:0,
        alignSelf:"center",
        alignItems:"center"
    },
    TOUCHABLE:{
        borderWidth: 0,
        margin:0,
        marginLeft:5,
        padding:0
    }
})
