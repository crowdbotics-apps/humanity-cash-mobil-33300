import React, { ReactNode } from "react"
import { View, Modal, TouchableOpacity, Text } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import styles from "../screens/qr-scan-generate/qr-style"
import { useStores } from "../models"

type BaseLayoutProps = {
  visible: boolean
  IconBackText?: string
  children?: ReactNode | ReactNode[]
  showTitleCondition?: boolean
  titleContent?: string
  showErrorMessageCondition?: boolean
  errorContent?: string
  IconBackAction: () => void
}

export const BaseFinishModal = ({
  visible,
  IconBackAction,
  IconBackText = "Back",
  showTitleCondition = true,
  titleContent,
  showErrorMessageCondition = true,
  errorContent,
  children
}: BaseLayoutProps) => {
  const { loginStore } = useStores()
  return (
    <Modal visible={visible}>
      <View style={styles.ROOT_MODAL_PASS}>
        <TouchableOpacity style={styles.BACK_BUTON_CONTAINER} onPress={() => IconBackAction()}>
          <Icon name={"arrow-back"} size={23} color={"#000"} />
          <Text style={styles.BACK_BUTON_LABEL}>{IconBackText}</Text>
        </TouchableOpacity>

        {showTitleCondition && (
          <Text style={[styles.STEP_TITLE_PASS, { color: loginStore.getAccountColor }]}>
            {titleContent}
          </Text>
        )}

        {showErrorMessageCondition && (
          <View style={styles.ERROR_MESSAGE_CONTAINER}>
            <Text style={styles.STEP_SUB_TITLE}>{errorContent}</Text>
          </View>
        )}
      </View>
      {children}
    </Modal>
  )
}
