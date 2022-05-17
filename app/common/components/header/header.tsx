import React from "react"
import {
  View,
  ViewStyle,
  TextStyle,
  Image,
  NativeModules,
  Platform,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  ImageStyle
} from "react-native"

const { StatusBarManager } = NativeModules
import { HeaderProps } from "./header.props"
import { Text } from "../text/text"
import { COLOR } from "../../theme"
// import { translate } from "../../i18n/"
import { IMAGES } from "../../theme/images"
const window = Dimensions.get("window")
import { useStores } from "../../models"
import { observer } from "mobx-react-lite"
import Icon from "react-native-vector-icons/MaterialIcons"
import { useNavigation } from "@react-navigation/native"

const STATUSBAR_HEIGHT = StatusBarManager.HEIGHT

const ROOT: ViewStyle = {
  flexDirection: "row",
  paddingHorizontal: 8,
  alignItems: "center",
  paddingTop: 24,
  paddingBottom: 16,
  justifyContent: "flex-start",
  backgroundColor: COLOR.PALETTE.white
}
const TITLE: TextStyle = {
  textAlign: "center",
  fontSize: 18,
  fontFamily: "AvenirLTStd-Roman",
  color: COLOR.PALETTE.white
}
const TITLE_MIDDLE: ViewStyle = { flex: 1, justifyContent: "center" }
const LEFT: ViewStyle = { marginTop: 5, width: 60 }
const RIGHT: ViewStyle = { flexDirection: "row", width: 60, marginTop: 20 }
const STATUS_BAR_PADDING: ViewStyle = { paddingTop: STATUSBAR_HEIGHT }

/**
 * Header that appears on many screens. Will hold navigation buttons and screen title.
 */
export const Header = observer(function Header(props: HeaderProps) {
  // const rootStore = useStores()
  const {
    headerText,
    headerTx,
    style,
    titleStyle,
    bigHeader,
    showImage,
    onRightPress
  } = props
  // const header = headerText || (headerTx && translate(headerTx)) || '';
  const header = headerText || headerTx || ""

  return (
    <View style={[ROOT, style, STATUS_BAR_PADDING]}>
      <View style={LEFT}>
        {showImage && (
          <Image
            source={IMAGES.logoHeader}
            style={{ width: 32, height: 32, marginLeft: 10, marginTop: 20 }}
          />
        )}
        {/*</View>*/}
      </View>
      <View style={TITLE_MIDDLE}>
        <Text style={[TITLE, titleStyle]} text={header} />
      </View>
      <View style={RIGHT}>
        {onRightPress && (
          <TouchableOpacity
            onPress={() => {
              if (onRightPress) {
                onRightPress()
              }
            }}
          >
            {/*<Search width={30} height={30} style={TEXT_SHADOW} />*/}
            <Text style={{ fontSize: 20, fontWeight: "400" }}>skip</Text>
          </TouchableOpacity>
        )}

        {/*<TouchableOpacity*/}
        {/*  onPress={() => navigation.navigate('notifications')}*/}
        {/*>*/}
        {/*  <Bell width={32} height={32} />*/}
        {/*</TouchableOpacity>*/}
      </View>
    </View>
  )
})
