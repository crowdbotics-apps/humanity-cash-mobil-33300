import * as React from "react"
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  View
} from "react-native"
import { ScreenProps } from "./screen.props"
import { isNonScrolling, offsets, presets } from "./screen.presets"
import { Header } from "../header/header"
import { COLOR } from "../../theme"

const isIos = Platform.OS === "ios"

function ScreenWithoutScrolling(props: ScreenProps) {
  const preset = presets.fixed
  const style = props.style || {}
  const backgroundStyle = props.backgroundColor
    ? { backgroundColor: props.backgroundColor }
    : {}
  const bigHeader = props.bigHeader || false

  return (
    <>
      <KeyboardAvoidingView
        style={[preset.outer, backgroundStyle]}
        behavior={isIos ? "padding" : undefined}
        keyboardVerticalOffset={offsets[props.keyboardOffset || "none"]}
      >
        <StatusBar
          barStyle={props.statusBar || "light-content"}
          translucent
          backgroundColor={COLOR.PALETTE.whiteBackground}
          animated
        />
        {props.showHeader && (
          <Header
            headerText={props.headerTitle}
            onRightPress={props.onRightPress}
            style={props.headerStyle}
            bigHeader={bigHeader}
          />
        )}

        <View style={[preset.inner, style, { flex: 1 }]}>{props.children}</View>
      </KeyboardAvoidingView>
    </>
  )
}

function ScreenWithScrolling(props: ScreenProps) {
  const preset = presets.scroll
  const style = props.style || {}
  const backgroundStyle = props.backgroundColor
    ? { backgroundColor: props.backgroundColor }
    : {}
  const bigHeader = props.bigHeader || false
  return (
    <>
      <KeyboardAvoidingView
        style={[preset.outer, backgroundStyle]}
        behavior={isIos ? "padding" : undefined}
        keyboardVerticalOffset={offsets[props.keyboardOffset || "none"]}
      >
        <View style={{ flex: 1 }}>
          <StatusBar
            barStyle={props.statusBar || "dark-content"}
            translucent
            backgroundColor={COLOR.PALETTE.whiteBackground}
            animated
          />
          {props.showHeader && (
            <Header
              headerText={props.headerTitle}
              style={props.headerStyle}
              onRightPress={props.onRightPress}
              showImage={props.showHeaderImage}
              bigHeader={bigHeader}
            />
          )}

          <ScrollView
            style={[preset.outer, backgroundStyle]}
            contentContainerStyle={[preset.inner, style, { flexGrow: 1 }]}
            keyboardShouldPersistTaps={
              props.keyboardShouldPersistTaps || "handled"
            }
          >
            {props.children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </>
  )
}

/**
 * The starting component on every screen in the app.
 *
 * @param props The screen props
 */
export function Screen(props: ScreenProps) {
  if (isNonScrolling(props.preset)) {
    return <ScreenWithoutScrolling {...props} />
  } else {
    return <ScreenWithScrolling {...props} />
  }
}
