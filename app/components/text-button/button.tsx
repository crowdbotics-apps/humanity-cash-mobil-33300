import * as React from "react"
import { TouchableOpacity, View } from "react-native"
import { Text } from "../text/text"
import { COLOR } from "../../theme"
import Icon from "react-native-vector-icons/MaterialIcons"

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function TextButton(props) {
  // grab the props
  let iconLeft = props.iconLeft || null
  let content
  content = <Text>{props.text}</Text>
  if (iconLeft) {
    content = (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {iconLeft}
        {content}
      </View>
    )
  }

  return (
    <TouchableOpacity
      style={{ flexDirection: "row", alignItems: "center", marginVertical: 8 }}
      {...props}
    >
      {content}
      <Icon
        style={{ marginLeft: "auto" }}
        name={"keyboard-arrow-right"}
        size={25}
        color={COLOR.PALETTE.primary}
      />
    </TouchableOpacity>
  )
}
