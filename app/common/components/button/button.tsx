import * as React from "react"
import { ActivityIndicator, TouchableOpacity, View } from "react-native"
import { Text } from "../text/text"
import { viewPresets, textPresets } from "./button.presets"
import { ButtonProps } from "./button.props"

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function Button(props: ButtonProps) {
  // grab the props
  const {
    preset = "primary",
    tx,
    text,
    style: styleOverride,
    textStyle: textStyleOverride,
    children,
    loading,
    iconLeft,
      iconRight,
    ...rest
  } = props

  const viewStyle = viewPresets[preset] || viewPresets.primary
  const viewStyles = [viewStyle, styleOverride]
  const textStyle = textPresets[preset] || textPresets.primary
  const textStyles = [textStyle, textStyleOverride]
  let content
  content = children || <Text tx={tx} text={text} style={textStyles} />
  if (iconLeft) {
    content = (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {iconLeft}
        {content}

      </View>
    )
  }
  if (iconRight) {

    content = (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {content}
          {iconRight}
        </View>
    )
  }

  return (
    <TouchableOpacity style={viewStyles} {...rest}>
      {!loading ? (
        content
      ) : (
        <ActivityIndicator
          size="small"
          color={preset === "primary" || preset === "disabled" ? "#ffffff" : "#000000"}
        />
      )}
    </TouchableOpacity>
  )
}
