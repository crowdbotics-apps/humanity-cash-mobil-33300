import {Animated, StyleSheet} from "react-native"
import { COLOR} from "../../theme";

export default StyleSheet.create({
        FORWARD_CONTAINER:{
            alignSelf:"center",
            alignContent:"center",
            alignItems:"center",
        },
        FORWARD_ICON:{
            flex:1,
            width: 7,
            height: 10,
            marginRight: 4,
            alignSelf:"center",
            alignItems:"center"
        },
        CARD_HEADER_TEXT:{
            alignSelf:"center",
            fontSize: 16,
            marginLeft: 10,
            color: COLOR.PALETTE.gray
        },
        CARD_IMAGE:{ width: 32, height: 32 },
        CARD_CONTAINER: {
            maxHeight: 150,
            margin: 15,
            borderRadius: 8,
            shadowColor: COLOR.PALETTE.black,
            backgroundColor: COLOR.PALETTE.white,
            display:"flex",
            flexDirection:"row",
            minHeight: 20,
            padding: 15,
            paddingLeft: 15,
            overflow: "hidden",
            marginRight: 22,
            marginLeft: 22
        }
    }
)
