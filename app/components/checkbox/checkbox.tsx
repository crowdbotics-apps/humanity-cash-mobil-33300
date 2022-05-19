import * as React from 'react';
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Text } from '../text/text';
import { COLOR } from '../../theme';
import { CheckboxProps } from './checkbox.props';

const ROOT: ViewStyle = {
  flexDirection: 'row',
  paddingVertical: 4,
  alignSelf: 'flex-start'
}

const DIMENSIONS = { width: 16, height: 16 }

const OUTLINE: ViewStyle = {
  ...DIMENSIONS,
  marginTop: 2, // finicky and will depend on font/line-height/baseline/weather
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: COLOR.PALETTE.black,
  borderRadius: 1,
}

const FILL: ViewStyle = {
  width: DIMENSIONS.width - 4,
  height: DIMENSIONS.height - 4,
  backgroundColor: COLOR.PALETTE.primary
}

const LABEL: TextStyle = { paddingLeft: 8 }

export function Checkbox(props: CheckboxProps) {
  const numberOfLines = props.multiline ? 0 : 1
  const textLabel = props.textLabel || false

  const rootStyle = [ROOT, props.style]
  const outlineStyle = [OUTLINE, props.outlineStyle]
  const fillStyle = [FILL, props.fillStyle]

  const onPress = props.onToggle
    ? () => props.onToggle && props.onToggle(!props.value)
    : null

  return (
    <TouchableOpacity
      activeOpacity={1}
      disabled={!props.onToggle}
      onPress={onPress}
      style={rootStyle}
    >
      <View style={outlineStyle}>
        {props.value && <View style={fillStyle} />}
      </View>
      {textLabel === true && (
        <Text
          text={props.text}
          tx={props.tx}
          numberOfLines={numberOfLines}
          style={LABEL}
        />
      )}
      {textLabel === false && props.text}
    </TouchableOpacity>
  )
}
