import React, {useEffect, useRef, useState} from "react"
import Icon from "react-native-vector-icons/Ionicons"
import {COLOR, TYPOGRAPHY} from "../../theme"
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  Animated,
  Easing,
  TouchableOpacity, StyleProp, ViewStyle
} from "react-native"

type Props = React.ComponentProps<typeof TextInput> & {
  label: string
  errorText?: string | null
  forwardedRef?: any
  textInputStyle?: StyleProp<ViewStyle>
}

export const TextField: React.FC<Props> = (props) => {
  const [ToggleShow, setToggleShow] = useState(true)

  const {
    label,
    errorText,
    value,
    style,
    onBlur,
    onFocus,
    secureTextEntry,
    forwardedRef,
    textInputStyle,
    ...restOfProps
  } = props
  const [isFocused, setIsFocused] = useState(false)

  const focusAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: isFocused || !!value ? 1 : 0,
      duration: 150,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: true
    }).start()
  }, [focusAnim, isFocused, value])

  let borderColor = isFocused ? COLOR.PALETTE.primary : COLOR.PALETTE.lightGrey

  return (
    <View style={[style]}>
      <TextInput
        placeholderTextColor={COLOR.PALETTE.lightGrey}
        placeholder={label}
        style={[
          styles.input,
          {borderColor: borderColor}, textInputStyle
        ]}
        ref={forwardedRef}
        {...restOfProps}
        value={value}
        secureTextEntry={secureTextEntry ? ToggleShow : false}
        onBlur={(event) => {
          setIsFocused(false)
          onBlur?.(event)
        }}
        onFocus={(event) => {
          setIsFocused(true)
          onFocus?.(event)
        }}
      />
      {!!errorText && <Text style={styles.error}>{errorText}</Text>}
      {secureTextEntry && (
        <TouchableOpacity
          onPress={() => setToggleShow(!ToggleShow)}
          style={{position: "absolute", right: 0, paddingRight:10, top: 20}}
        >
          <Icon
            name={ToggleShow ? "eye-outline" : "eye-off-outline"}
            size={20}
            color={COLOR.PALETTE.gray}
          />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 2,
    fontSize: 14,
    paddingLeft: 10,
    height: 50,
    color: COLOR.PALETTE.black
  },
  labelContainer: {
    position: "absolute",
  },
  label: {
    fontSize: 14
  },
  error: {
    marginTop: 4,
    fontFamily: TYPOGRAPHY.primaryLight,
    fontSize: 11,
    color: COLOR.PALETTE.angry
  }
})

export default TextField
