import React, {ReactElement, ReactNode} from 'react';
import {Modal, View, Image, Text, TouchableOpacity, Pressable} from 'react-native';
import styles from "../screens/qr-scan-generate/qr-style";
import Icon from "react-native-vector-icons/MaterialIcons";
import {useStores} from '../models';
import {IMAGES} from '../theme';
import { getRandomProfileImage } from "../utils/helpers"

type ModalConfirmProps = {
    children: ReactNode[] | ReactElement,
    visible: boolean,
    closeModalAction: () => void,
    username: string,
    imgSrc?: string,
    type?: string,
    transparent?: boolean,
    dark?: boolean,
    disable?: boolean,
}

export const BaseConfirmModal = ({
  visible,
  closeModalAction,
  children,
  transparent = true,
  imgSrc = '',
  username = '',
  type='QR',
  dark = false,
  disable = false
}: ModalConfirmProps) => {

  const { loginStore } = useStores()
  const userText = username?.includes('@') ? username.replace('@', '') : username;
  const profilePictureSrc = imgSrc ? {uri: imgSrc} : getRandomProfileImage();

  return (
    <Modal visible={visible} transparent={transparent}>
      <Pressable style={dark ? styles.DARK_ROOT_MODAL : styles.ROOT_MODAL} onPress={closeModalAction} disabled={disable}>
        <TouchableOpacity
          onPress={closeModalAction}
          style={styles.CLOSE_MODAL_BUTTON}
          disabled={disable}
        >
          <Text style={styles.BACK_BUTON_LABEL}>{`Close`}</Text>
          <Icon name={"close"} size={20} color={"#0D0E21"} />
        </TouchableOpacity>
        <Pressable
          style={[styles.MODAL_CONTAINER, type !== 'QR' && styles.MODAL_CONTAINER_CONFIRMATION]}
          onPress={() => null}
        >
          <View style={styles.USER_IMAGE_CONTAINER}>
            <Image
              resizeMode="cover"
              source={profilePictureSrc}
              style={styles.USER_IMAGE}
            />
          </View>
          <Text
            style={[type === 'QR' ? styles.STEP_SUB_TITLE : styles.STEP_SUB_TITLE_USERNAME,
              { color: loginStore.getAccountColor }
            ]}
          >
            {userText}
          </Text>
            {children}
        </Pressable>
        <View />
      </Pressable>
    </Modal>
  )
}
