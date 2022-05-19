import {StyleSheet} from "react-native"
import {TYPOGRAPHY} from "../../theme";

export default StyleSheet.create({
    CONTAINER:{
        borderRadius:8,
        height: 20,
        padding: 0,
        alignItems:"center",
        width: "100%"
    },
    TEXT:{
        fontFamily: TYPOGRAPHY.primary,
        fontSize: 18,
        paddingTop: 0,
    }
})
