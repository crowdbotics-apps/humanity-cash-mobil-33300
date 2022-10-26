import React, {useState} from "react"
import {Image, Modal, StyleProp, View, ViewStyle} from "react-native"
import styles from "../../screens/settings-styles"
import { IMAGES } from "../../theme/images"
import {Text} from "../text/text"
import {Button} from "../button/button"
import { COLOR } from "../../theme"
import * as ImagePicker from "react-native-image-picker"
import Icon from "react-native-vector-icons/MaterialIcons"

type ModalCodeInputProps = {
  loading: boolean
  visible: boolean
  setVisible: any
  action: any
  current_image?: string
    imageStyle?:  StyleProp<ViewStyle>
}

export function ModalCameraImagePicker(props: ModalCodeInputProps) {
  const [response, setResponse] = useState(null)
  const onButtonPress = React.useCallback(type => {
    if (type === "capture") {
      ImagePicker.launchCamera(
        {
          saveToPhotos: true,
          mediaType: "photo",
          includeBase64: false,
          maxWidth: 512,
          maxHeight: 512
        },
        setResponse
      )
    } else {
      ImagePicker.launchImageLibrary(
        {
          mediaType: "photo",
          includeBase64: false,
          maxWidth: 512,
          maxHeight: 512
        },
        setResponse
      )
    }
  }, [])

  return (
    <Modal
      hardwareAccelerated
      animationType={"slide"}
      transparent={true}
      visible={props.visible}
      statusBarTranslucent
    >
      <View style={styles.MODAL_BODY}>
        <Image source={IMAGES.logoHeader} style={styles.LOGO_MODAL} />
        <View style={styles.FIRST_TITLE_MODAL}>
          <Text>Select an option to upload an image</Text>
        </View>
        {response?.assets ? (
          response?.assets.map(({ uri }) => (
            <View
              key={uri + '_asset'}
              style={{
                marginVertical: 24,
                alignItems: "center"
              }}
            >
              <Image
                resizeMode="cover"
                resizeMethod="scale"
                style={[{ width: 150, height: 150, borderRadius: 75 }, props.imageStyle || {}]}
                source={{ uri: uri }}
              />
            </View>
          ))
        ) : props.current_image ? (
          <Image
            source={{ uri: props.current_image }}
            style={{
              width: 150,
              height: 150,
              borderRadius: 75,
              alignSelf: "center",
              marginVertical: 24
            }}
          />
        ) : (
          <View style={styles.EMPTY_IMAGE}>
            <Icon name={"add-a-photo"} size={70} color={COLOR.PALETTE.white} />
          </View>
        )}
        <Button
          text={"LAUNCH IMAGE GALLERY"}
          style={[ styles.CONTAINER, {marginTop: "auto"}]}
          preset={"primary"}
          textStyle={{fontSize: 16, borderRadius:8}}
          onPress={() => onButtonPress("gallery")}
        />
        <Button
          text={"LAUNCH CAMERA"}
          textStyle={{fontSize: 16}}
          style={styles.CONTAINER}
          preset={"primary"}
          onPress={() => onButtonPress("capture")}
        />
        <View
          style={[styles.CANCEL_CONFIRM_BUTTON_CONTAINER, { marginTop: 0, marginBottom: "5%" }]}
        >
          <Button
            text={"CANCEL"}
            textStyle={{fontSize: 16}}
            style={[styles.CONTAINER,{    backgroundColor: COLOR.PALETTE.navy}]}
            preset={"primary"}
            loading={props.loading}
            onPress={() => {
              setResponse(null)
              props.setVisible(false)
            }}
          />
          <Button
            text={"SAVE"}
            style={styles.CONTAINER}
            textStyle={{fontSize: 16}}
            disabled={response === null}
            preset={response === null ? "disabled" : "primary"}
            loading={props.loading}
            onPress={() => {
                setResponse(null)
                props.action(response)
                props.setVisible(false)
            }}

          />
        </View>
      </View>
    </Modal>
  )
}
