import React, { useEffect, useState } from "react"
import { Text, View, TextInput } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import styles from "./styles"
import { IMAGES } from "../../theme"

type TextInputComponentProps = {
  labelContainerStyle?: any,
  labelStyle?: any,
  label?: string,
  errorLabelStyle?: any,
  errorLabel?: string  | '',
  error?: boolean | false,
  secureTextEntry?: boolean | false,
  inputContainerStyle?: any,
  inputContainerErrorStyle?: any,
  inputStyle?: any,
  value?: any,
  onChangeText?: any,
  placeholder?: string
  inputDecoration?: any
}


export function TextInputComponent(props: TextInputComponentProps) {
  return (
    <>
      <View style={[styles.LABEL_CONTAINER, props.labelContainerStyle]}>
        <Text style={[styles.LABEL, props.labelStyle]}>{props.label}</Text>
        {(props.errorLabel !== '') &&
          <Text style={[styles.LABEL_ERROR, props.errorLabelStyle]}>
            {props.error ? props.errorLabel : ''}
          </Text>
        }
      </View>
      <View style={!props.error
        ? [styles.INPUT_CONTAINER, props.inputContainerStyle]
        : [styles.INPUT_CONTAINER_ERROR, props.inputContainerErrorStyle]}
      >
        <TextInput
          style={[styles.INPUT, props.inputStyle]}
          onChangeText={props.onChangeText}
          value={props.value}
          placeholder={props.placeholder}
          autoCapitalize={"none"}
          secureTextEntry={props.secureTextEntry}
        />
        {props.inputDecoration && props.inputDecoration}
      </View>
    </>
  )
}
