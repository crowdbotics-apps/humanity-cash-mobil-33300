import {Animated, StyleSheet} from "react-native"
import {COLOR} from "../../theme";

const ICON_MARGIN = 12

export default StyleSheet.create({
    ICON_RIGHT: {
        tintColor:COLOR.PALETTE.primary,
        marginRight:15,
        width: 18
    },
    ICON_LEFT:{
        width: 20,
        marginLeft:15,
        tintColor:COLOR.PALETTE.primary
    },
    SEARCH_CONTAINER:{
        flexDirection: "row",
        marginBottom:20,
        alignItems: "center",
        backgroundColor: COLOR.PALETTE.white,
        borderRadius: 8,
        height: 48,
        marginTop: 20
    },
})