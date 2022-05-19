import React, {useEffect, useState} from "react"
import { Image, Modal, View } from "react-native"
import styles from "../../screens/settings-styles"
import { IMAGES } from "../../theme/images"
import { Text } from "../text/text"
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell
} from "react-native-confirmation-code-field"
import { Button } from "../button/button"

type ModalVerifyCodeInputProps = {
  loading: boolean
  visible: boolean
  setVisible: any
  action: any
}

export function ModalVerifyCodeInput(props: ModalVerifyCodeInputProps) {
  const [value, setValue] = useState("")
  const ref = useBlurOnFulfill({ value, cellCount: 4 })
  const [codeProps, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue })

  useEffect(() => {
    if (!props.visible){
      setValue("")
    }
  }, [props.visible])

  return (
    <Modal
      hardwareAccelerated
      animationType={"slide"}
      transparent={true}
      visible={props.visible}
      statusBarTranslucent
    >
      <View style={styles.MODAL_BODY}>
        <Image source={IMAGES.fpLogo} style={styles.LOGO_MODAL} />
        <View style={styles.FIRST_TITLE_MODAL}>
          <Text>Verify passcode</Text>
        </View>
        <Text style={styles.CODE_INPUT_TEXT}>
          Please enter your passcode to verify it.
        </Text>
        <View style={styles.FORM_CONTAINER}>
          <CodeField
            ref={ref}
            {...codeProps}
            value={value}
            onChangeText={setValue}
            cellCount={4}
            returnKeyType={"done"}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => (
              <View
                onLayout={getCellOnLayoutHandler(index)}
                key={index}
                style={[styles.cellRoot, isFocused && styles.focusCell]}
              >
                <Text style={styles.cellText}>{symbol || (isFocused ? <Cursor /> : null)}</Text>
              </View>
            )}
          />
          <View style={styles.CANCEL_CONFIRM_BUTTON_CONTAINER}>
            <Button
              text={"CANCEL"}
              style={{ marginTop: 15 }}
              preset={"secondary"}
              loading={props.loading}
              onPress={() => props.setVisible(false)}
            />
            <Button
              text={"CONTINUE"}
              style={{ marginTop: 15 }}
              disabled={value === ""}
              preset={value === "" ? "disabled" : "primary"}
              loading={props.loading}
              onPress={() => props.action(value)}
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}
