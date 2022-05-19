import React from "react"
import {Image, Modal, View} from "react-native"
import styles from "../../screens/settings-styles"
import { IMAGES } from "../../theme/images"
import { Text } from "../text/text"
import { Button } from "../button/button"

type ModalConfirmProps = {
  action: any
  title: string
  description: string
  visible: boolean
  setVisible: any
}

export function ModalConfirm(props: ModalConfirmProps) {

  return (
    <Modal
      hardwareAccelerated
      animationType={"slide"}
      transparent={true}
      visible={props.visible}
      statusBarTranslucent
    >
      <View style={[styles.MODAL_BODY, {height: "40%"}]}>
        <Image source={IMAGES.fpLogo} style={styles.LOGO_MODAL} />
        <View style={styles.FIRST_TITLE_MODAL}>
          <Text style={{marginHorizontal: 20, fontSize: 20}}>{props.title}</Text>
        </View>
        <View style={styles.FIRST_TITLE_MODAL}>
          <Text style={{marginHorizontal: 15, fontSize: 18, marginTop: 25}}>{props.description}</Text>
        </View>
        <View style={[styles.CANCEL_CONFIRM_BUTTON_CONTAINER, {flexDirection: "row", marginBottom: 50}]}>
          <Button
            text={"CANCEL"}
            style={{ marginTop: 15 }}
            preset={"secondary"}
            onPress={() => props.setVisible(false)}
          />
          <Button
            text={"CONFIRM"}
            style={{ marginTop: 15 }}
            preset={"primary"}
            onPress={() => {
              props.setVisible(false)
              props.action()
            }}
          />
        </View>
      </View>
    </Modal>
  )
}
