import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { View, TouchableOpacity, Modal, TextInput } from 'react-native';
import {
  Text,
  Button,
  Screen,
} from '../../components';
import Icon from "react-native-vector-icons/MaterialIcons"
import styles from './settings-style';
import { COLOR } from '../../theme';
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import Ionicons from "react-native-vector-icons/Ionicons"

export const SettingsScreen = observer(function SettingsScreen() {
  const navigation = useNavigation()
  const rootStore = useStores()
  const { loginStore } = rootStore

  const [ModalVisibility, setModalVisibility] = useState(false)

  const [HadCurrency, setHadCurrency] = useState(true)
  // had_currency | confirm | password | finish
  const [ModalStep, setModalStep] = useState('confirm')


  const [Pass, setPass] = useState("")
  const [HidePass, setHidePass] = useState(true)

  const DeleteAcountModal = () => (
    <Modal visible={ModalVisibility} transparent>
      {ModalContent()}
    </Modal>
  )

  const ModalContent = () => {
    if (ModalStep === 'had_currency') {
      if (!HadCurrency) setModalStep('confirm')
      else {
        return (
          <View style={styles.ROOT_MODAL}>
            <TouchableOpacity
              onPress={() => [setModalStep('had_currency'), setModalVisibility(false)]}
              style={styles.CLOSE_MODAL_BUTTON}
            >
              <Text style={styles.BACK_BUTON_LABEL}>{`Close `}</Text>
              <Icon name={"close"} size={20} color={'#0D0E21'} />
            </TouchableOpacity>
            <View style={styles.MODAL_CONTAINER}>
              <View style={styles.MODAL_CONTENT}>
                <Text style={styles.STEP_TITLE}>You still have Currents. Spend them before closing your account. </Text>
                <TouchableOpacity
                  style={styles.MODAL_BUTTON}
                  onPress={() => { }}
                >
                  <Text style={styles.SUBMIT_BUTTON_LABEL}>Go to cash out</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View />
          </View>
        )
      }
    }
    if (ModalStep === 'confirm') {
      return (
        <View style={styles.ROOT_MODAL}>
          <TouchableOpacity
            onPress={() => [setModalStep('confirm'), setModalVisibility(false)]}
            style={styles.CLOSE_MODAL_BUTTON}
          >
            <Text style={styles.BACK_BUTON_LABEL}>{`Close `}</Text>
            <Icon name={"close"} size={20} color={'#0D0E21'} />
          </TouchableOpacity>
          <View style={styles.MODAL_CONTAINER}>
            <View style={styles.MODAL_CONTENT}>
              <Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>Are you sure you want to delete your account?</Text>
              <TouchableOpacity
                style={[styles.MODAL_BUTTON, { backgroundColor: loginStore.getAccountColor }]}
                onPress={() => setModalStep('password')}
              >
                <Text style={styles.SUBMIT_BUTTON_LABEL}>Delete account</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View />
        </View>
      )
    }
    if (ModalStep === 'password') {
      return (
        <View style={styles.ROOT}>
          <View style={styles.CONTAINER}>
            <TouchableOpacity onPress={() => [setModalStep('confirm'), setModalVisibility(false)]} style={styles.BACK_BUTON_CONTAINER}>
              <Icon name={"arrow-back"} size={23} color={COLOR.PALETTE.black} />
              <Text style={styles.BACK_BUTON_LABEL}>{` Back`}</Text>
            </TouchableOpacity>
            <View style={styles.STEP_CONTAINER}>
              <Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>Verify with password</Text>

              <View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
                <Text style={styles.INPUT_LABEL_STYLE}>PASSWORD</Text>
              </View>
              <View style={styles.INPUT_STYLE_CONTAINER}>
                <TextInput
                  placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
                  style={styles.PASS_INPUT_STYLE}
                  onChangeText={t => [setPass(t)]}
                  value={Pass}
                  secureTextEntry={HidePass}
                  placeholder={"*********"}
                />
                <TouchableOpacity onPress={() => setHidePass(!HidePass)}>
                  <Ionicons name="eye" color={"#39534480"} size={20} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.CONTAINER}>
            <TouchableOpacity onPress={() => { }} style={styles.FORGOT_PASSWORD_CONTAINER}>
              <Text style={styles.NEED_HELP_LINK}>Forgot password</Text>
            </TouchableOpacity>
            <Button
              buttonStyle={{
                backgroundColor: loginStore.getAccountColor,
              }}
              onPress={() => setModalStep('finish')}
              buttonLabel={'Confirm'}
            />
          </View>
        </View>
      )
    }
    if (ModalStep === 'finish') {
      return (
        <View style={styles.ROOT}>
          <View style={styles.CONTAINER}>
            <TouchableOpacity style={styles.BACK_BUTON_CONTAINER} />
            <View style={styles.STEP_CONTAINER}>
              <Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>{`Sad to see you leave.
Your account has been deleted. Hope to see
you back soon. `}
              </Text>
            </View>
          </View>
          <View style={styles.CONTAINER}>
            <Button
              buttonStyle={{
                backgroundColor: loginStore.getAccountColor,
              }}
              onPress={() => setModalVisibility(false)}
              buttonLabel={'Close'}
            />
          </View>
        </View>
      )
    }
    return null
  }

  return (
    <Screen
      preset="fixed"
      statusBar={"dark-content"}
      unsafe={true}
      showHeader
    >
      <View style={styles.ROOT}>
        <View style={styles.CONTAINER}>
          <TouchableOpacity onPress={() => navigation.navigate("home", {})} style={styles.BACK_BUTON_CONTAINER}>
            <Icon name={"arrow-back"} size={23} color={COLOR.PALETTE.black} />
            <Text style={styles.BACK_BUTON_LABEL}>{` Home`}</Text>
          </TouchableOpacity>
          <View style={styles.STEP_CONTAINER}>
            <Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>Settings</Text>
            <Text style={styles.LINE} />

            <Button
              buttonStyle={[styles.BUTTON_STYLE, { borderColor: loginStore.getAccountColor }]}
              buttonLabelStyle={{ color: loginStore.getAccountColor }}
              onPress={() => navigation.navigate("myProfile", {})}
              buttonLabel={'My profile'}
            />
            <Button
              buttonStyle={[styles.BUTTON_STYLE, { borderColor: loginStore.getAccountColor }]}
              buttonLabelStyle={{ color: loginStore.getAccountColor }}
              onPress={() => { }}
              buttonLabel={'Bank account'}
            />
            <Button
              buttonStyle={[styles.BUTTON_STYLE, { borderColor: loginStore.getAccountColor }]}
              buttonLabelStyle={{ color: loginStore.getAccountColor }}
              onPress={() => { }}
              buttonLabel={'Static QR '}
            />
            <Button
              buttonStyle={[styles.BUTTON_STYLE, { borderColor: loginStore.getAccountColor }]}
              buttonLabelStyle={{ color: loginStore.getAccountColor }}
              onPress={() => navigation.navigate("legal", {})}
              buttonLabel={'Legal'}
            />
            <Button
              buttonStyle={[styles.BUTTON_STYLE, { borderColor: loginStore.getAccountColor }]}
              buttonLabelStyle={{ color: loginStore.getAccountColor }}
              onPress={() => navigation.navigate("security", {})}
              buttonLabel={'Security'}
            />
          </View>
        </View>
        <View style={styles.CONTAINER}>
          <TouchableOpacity onPress={() => setModalVisibility(true)} style={styles.NEED_HELP_CONTAINER}>
            <Text style={styles.NEED_HELP_LINK}>Delete account</Text>
          </TouchableOpacity>
        </View>
      </View>
      {DeleteAcountModal()}
    </Screen>
  )
})
