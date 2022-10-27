import React, { RefObject } from "react";
import {
  TextInput,
  StyleSheet,
  ReturnKeyTypeOptions,
  KeyboardTypeOptions,
  Keyboard,
} from "react-native";
import MaskedInput, { Mask } from "react-native-mask-input";
import { COLOR } from '../../theme';

type MaskInputProps = {
  onChange: any;
  name?: string;
  placeholder?: string;
  placeholderTextColor?: any;
  value: string | undefined;
  mask: Mask | undefined;
  style?: any;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  onKeyPress?: any;
  maxLength?: number;
  inputRef?: RefObject<TextInput>;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: () => void;
  editable?: boolean
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: `${COLOR.PALETTE.green}25`,
    borderRadius: 3,
    borderWidth: 0,
    color: COLOR.PALETTE.black,
    fontSize: 16,
    height: 55,
    marginVertical: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
});

export function MaskInput(props: MaskInputProps) {
  return (
    <MaskedInput
      ref={props.inputRef}
      style={{
        ...styles.container,
        ...props.style,
      }}
      secureTextEntry={props.secureTextEntry || false}
      placeholderTextColor={props.placeholderTextColor || COLOR.PALETTE.gray}
      keyboardType={props.keyboardType || "default"}
      placeholder={props.placeholder}
      onChangeText={props.onChange}
      value={props.value ?? ""}
      mask={props.mask}
      onKeyPress={props.onKeyPress}
      maxLength={props.maxLength}
      autoCapitalize="none"
      autoCorrect={false}
      blurOnSubmit={false}
      returnKeyType={props.returnKeyType || "done"}
      onSubmitEditing={props.onSubmitEditing || Keyboard.dismiss}
      editable={props.editable ?? true}
    />
  )
}

export default MaskInput;
