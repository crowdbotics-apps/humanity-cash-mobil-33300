import React, { ErrorInfo } from "react"
import { TextStyle, View, ViewStyle, ScrollView, ImageStyle } from "react-native"
import { COLOR } from "../../theme"
import { Button, Icon, Text } from "../../components"

const CONTAINER: ViewStyle = {
  alignItems: "center",
  flex: 1,
  padding: 16,
  paddingVertical: 50,
  backgroundColor: COLOR.background,
}

const ERROR_DETAILS_CONTAINER: ViewStyle = {
  width: "100%",
  maxHeight: "60%",
  backgroundColor: COLOR.line,
  marginVertical: 15,
  paddingHorizontal: 10,
  paddingBottom: 15,
  borderRadius: 6,
}

const BTN_RESET: ViewStyle = {
  paddingHorizontal: 40,

  backgroundColor: COLOR.primary,
}

const TITLE_ERROR: TextStyle = {
  color: COLOR.error,
  fontWeight: "bold",
  paddingVertical: 15,
}

const FRIENDLY_SUBTITLE: TextStyle = {
  color: COLOR.PALETTE.black,
  fontWeight: "normal",
  paddingVertical: 15,
}

const CONTENT_ERROR: TextStyle = {
  color: COLOR.error,
  fontWeight: "bold",
  paddingVertical: 15,
}

// Uncomment this and the Text component in the ErrorComponent if
// you want to see a backtrace in your error reporting screen.
// const CONTENT_BACKTRACE: TextStyle = {
//   color: COLOR.dim,
// }

const ICON: ImageStyle = {
  marginTop: 30,
  width: 64,
  height: 64,
}

export interface ErrorComponentProps {
  error: Error
  errorInfo: ErrorInfo
  onReset(): void
}

/**
 * Describe your component here
 */
export const ErrorComponent = (props: ErrorComponentProps) => {
  return (
    <View style={CONTAINER}>
      <Icon style={ICON} icon="bug" />
      <Text style={TITLE_ERROR} tx={"errorScreen.title"} />
      <Text style={FRIENDLY_SUBTITLE} tx={"errorScreen.friendlySubtitle"} />
      <View style={ERROR_DETAILS_CONTAINER}>
        <ScrollView>
          <Text selectable style={CONTENT_ERROR} text={`${props.error}`} />
          {/* <Text selectable style={CONTENT_BACKTRACE} text={`${props.errorInfo.componentStack}`} /> */}
        </ScrollView>
      </View>
      <Button style={BTN_RESET} onPress={props.onReset} tx="errorScreen.reset" />
    </View>
  )
}
