import React, { useEffect, useState } from "react"
import { Text, TouchableOpacity, ActivityIndicator } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import styles from "./styles"
import { IMAGES } from "../../theme"

type ButtonProps = {
  onPress?: any
  buttonStyle?: any
  buttonLabelStyle?: any
  buttonLabel?: string | ''
  disabled?: boolean | false
  loading?: boolean | false
}


export function Button(props: ButtonProps) {
  // const [SelectedValue, setSelectedValue] = useState(null)

  // useEffect(() => {
  //   if (props.value === null) {
  //     setSelectedValue(null)
  //   }
  // }, [props.value])

  return (
    <TouchableOpacity disabled={props.disabled} style={[styles.BUTTON, props.buttonStyle]}
      onPress={props.onPress}
    >
      {props.loading
        ? <ActivityIndicator size="small" color={'black'} />
        : <Text style={[styles.BUTTON_LABEL, props.buttonLabelStyle]}>{props.buttonLabel}</Text>
      }
    </TouchableOpacity>
  )
}
