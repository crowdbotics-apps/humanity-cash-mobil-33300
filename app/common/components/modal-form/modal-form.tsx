import React, {createRef, useEffect, useRef, useState} from "react"
import { Image, Modal, View } from "react-native"
import styles from "../../screens/settings-styles"
import { IMAGES } from "../../theme/images"
import { Text } from "../text/text"
import { Button } from "../button/button"
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view"
import TextField from "../text-field/text-field"

type ModalFormProps = {
  loading: boolean
  visible: boolean
  setVisible: any
  action: any
  errors: any
  form: any
  title: string
  initialValue?: any
}

export function ModalForm(props: ModalFormProps) {
  const initialFormData = props.initialValue || null
  const [FormData, setFormData] = useState(initialFormData)
  const [FieldErrors, setFieldErrors] = useState()
  const myRefs = useRef([])

  const setInputFormData = (field: string, val: string) => {
    const userData = { ...FormData }
    userData[field] = val
    setFormData(userData)
  }

  useEffect(() => {
    myRefs.current = props.form.map((element, i) => myRefs.current[i] ?? createRef())
  }, [])

  useEffect(() => {
    setFieldErrors(props.errors)
  }, [props.errors])

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
          <Text>{props.title}</Text>
        </View>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          enableOnAndroid
          extraScrollHeight={10}
          style={{ flex: 1 }}
        >
          {props.form.map((input, idx) => {
            const objectId = idx
            let nextObjectId
            if (objectId < props.form.length){
              nextObjectId = objectId + 1
            } else {
              nextObjectId = objectId
            }

            return (
              <TextField
                forwardedRef={myRefs.current[objectId]}
                key={"id-form-" + objectId}
                value={FormData ? FormData[input.name] : null}
                label={input.label}
                errorText={(FieldErrors !== null && FieldErrors !== undefined) ? FieldErrors[input.name] : null}
                onChangeText={value => setInputFormData(input.name, value)}
                keyboardType={input.keyboardType ? input.keyboardType : "default"}
                autoCapitalize={input.autoCapitalize ? input.autoCapitalize : "sentences"}
                returnKeyType={input.returnKeyType ? input.returnKeyType : props.form.length === nextObjectId ? "done" : "next"}
                secureTextEntry={input.secureTextEntry ? input.secureTextEntry : false}
                onSubmitEditing={() => {
                  if (myRefs.current[nextObjectId] !== undefined){
                    myRefs.current[nextObjectId].current.focus()
                  }
                }}
              />
            )
          })}
        </KeyboardAwareScrollView>
        <View style={styles.CANCEL_CONFIRM_BUTTON_CONTAINER}>
          <Button
            text={"CANCEL"}
            style={{ marginTop: 15 }}
            preset={"secondary"}
            loading={props.loading}
            onPress={() => {
              props.setVisible(false)
              setFormData(initialFormData)
              setFieldErrors(null)
            }}
          />
          <Button
            text={"UPDATE"}
            style={{ marginTop: 15 }}
            disabled={props.loading}
            preset={props.loading ? "disabled" : "primary"}
            loading={props.loading}
            onPress={() => props.action(FormData)}
          />
        </View>
      </View>
    </Modal>
  )
}
