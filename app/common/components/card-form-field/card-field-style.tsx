import {StyleSheet} from "react-native";
import {COLOR} from "../../theme";

export default StyleSheet.create({
    CONTAINER: {
        paddingLeft:5,
        alignSelf:"center",
        justifyContent:"center",
        display:"flex",
        flexDirection:"row",
        borderRadius:8,
        backgroundColor:COLOR.PALETTE.white
    },
    TEXT_CONTAINER: {
        width:"80%",
        marginLeft: 10,
        flexGrow: 1,
        flexDirection: "column",
        alignItems:"flex-start",
        marginRight: "auto",
        marginVertical: 8
    }
})