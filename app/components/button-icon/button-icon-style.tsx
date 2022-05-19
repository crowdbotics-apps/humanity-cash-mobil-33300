import {StyleSheet} from "react-native"
import {COLOR} from "../../theme";

export default StyleSheet.create({
    TOUCHABLE:{
        width: 40,
        height:40,
        borderRadius:8,
        backgroundColor: COLOR.PALETTE.marina_light,
    },
    ICON:{
        width: 20,
        height:20
    },
    ICON_CONTAINER:{
        width:"100%",
        height:"100%",
        display: "flex",
        alignItems: "center",
        justifyContent:"center"
    }
})
