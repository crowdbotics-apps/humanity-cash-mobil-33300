import {Animated, StyleSheet} from "react-native"
import {COLOR, TYPOGRAPHY} from "../../theme";

const ICON_MARGIN = 12

export default StyleSheet.create({
    DOWN_RIGHT_MENU_CONTAINER:{
        position:"absolute",
        right: ICON_MARGIN,
        bottom: 20,
        zIndex:3,
        display:"flex",
        flexDirection:"column",
    },
    TOP_RIGHT_MENU_CONTAINER:{
        position:"absolute",
        right: ICON_MARGIN,
        zIndex:2,
        marginTop:80,
        display:"flex",
        flexDirection:"column",
    },
    MIDDLE_NAV_BAR_TEXT:{
        alignSelf:"center",
        marginLeft: 12,
        fontSize: 16,
        color:"white"
    },
    DOWN_ICON:{
        alignSelf:"center",
        marginRight: 12,
        width:30,
        height:30,
        tintColor:"white"
    },
    MIDDLE_NAV_BAR:{
        flexGrow: 1,
        backgroundColor: COLOR.PALETTE.marina_light,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 8,
        display:"flex",
        justifyContent:"space-between",
        flexDirection:"row"
    },
    SERVICE_BUTTON: {
        marginTop:ICON_MARGIN,
        shadowColor: COLOR.PALETTE.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: COLOR.PALETTE.white
    },
    NAV_BAR: {
        backgroundColor:"transparent",
        display:"flex",
        marginTop:35,
        position:"absolute",
        flexDirection:"row",
        zIndex: 2,
        justifyContent:"space-between"
    },




    page: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLOR.PALETTE.background
    },
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: COLOR.PALETTE.background,
    },
    map: {
        flex: 1
    },

    //
    // markerContainer: {
    //     alignItems: "center",
    //     width: 60,
    //     backgroundColor: "transparent",
    //     height: 70,
    // },
    // textContainer: {
    //     backgroundColor: "white",
    //     borderRadius: 5,
    //     flex: 1,
    //     flexDirection: "row",
    //     alignItems: "center",
    // },
    // text: {
    //     textAlign: "center",
    //     paddingHorizontal: 5,
    //     flex: 1,
    // },
    //

})