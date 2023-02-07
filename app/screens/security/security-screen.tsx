import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TextInput,
  Switch,
  Alert
} from "react-native"
import { Text, Button, Screen } from "../../components"
import Icon from "react-native-vector-icons/MaterialIcons"
import styles from "./security-style"
import { COLOR, METRICS } from "../../theme"
import { useNavigation, useIsFocused } from "@react-navigation/native"
import { useStores } from "../../models"
import Ionicons from "react-native-vector-icons/Ionicons"
import { runInAction } from "mobx";
import { notifyMessage } from "../../utils/helpers";

import TouchID from 'react-native-touch-id'

const optionalConfigObject = {
  title: 'Authentication Required', // Android
  imageColor: '#e00606', // Android
  imageErrorColor: '#ff0000', // Android
  sensorDescription: 'Touch sensor', // Android
  sensorErrorDescription: 'Failed', // Android
  cancelText: 'Cancel', // Android
  fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
  unifiedErrors: false, // use unified error messages (default false)
  passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
};

export const SecurityScreen = observer(function SecurityScreen() {
  const navigation = useNavigation()
  const rootStore = useStores()
  const isFocused = useIsFocused();

  const { loginStore } = rootStore
  const [Loading, setLoading] = useState(false)

  const [Pass, setPass] = useState("")
  const [HidePass, setHidePass] = useState(true)

  const [NewPass, setNewPass] = useState("")
  const [HideNewPass, setHideNewPass] = useState(true)
  const [NewPassConfirmation, setNewPassConfirmation] = useState("")
  const [HideNewPassConfirmation, setHideNewPassConfirmation] = useState(true)

  const [allowTouchId, setAllowTouchId] = useState(false)
  const [enableCashierView, setenableCashierView] = useState(false)
  const toggleSwitch = () => setAllowTouchId(previousState => !previousState)
  const toggleSwitchCashier = () => setenableCashierView(previousState => !previousState)

  useEffect(() => {
    if (isFocused) {
      setAllowTouchId(loginStore.ProfileData.allow_touch_id || false)
    }
  }, [isFocused])

  const pressHandler = () => {
    if (loginStore.ProfileData.allow_touch_id) {
      TouchID.authenticate('to check the user', optionalConfigObject)
          .then(success => updateSecurity())
          .catch(error => {
            Alert.alert('Authentication Failed');
          });
    } else updateSecurity()
  }

  const updateSecurity = () => {
    setLoading(true)
    loginStore.environment.api
      .updateSecurity({
        old_password: Pass,
        new_password: NewPass,
        new_password_confirm: NewPassConfirmation,
        allow_touch_id: allowTouchId || false
      })
      .then((result: any) => {
        setLoading(false);
        if (result.kind === "ok") {
          setPass('');
          setNewPass('');
          setNewPassConfirmation('');  
          notifyMessage('The information has been updated');
          runInAction(() => {
            loginStore.setAllowTouchId(result.response)
            navigation.navigate("settings")
          })
        } else if (result.kind === "bad-data") {
          const key = Object.keys(result?.errors)[0];
          // alert(JSON.stringify(result.errors));
          let msg;
          msg = `${key}: ${result?.errors?.[key]}`;
          if(result?.errors?.old_password?.old_password) {
            msg = `${key}: ${result?.errors?.[key]?.old_password}`;
          }
          notifyMessage(msg);
        }
      })
  }

  return (
    <Screen
      preset="fixed"
      statusBar={"dark-content"}
      style={styles.ROOT}
      showHeader
    >
      <TouchableOpacity style={styles.HEADER} onPress={() => navigation.navigate("settings")}>
        <Icon name={"arrow-back"} size={23} color={COLOR.PALETTE.black} />
        <Text style={styles.BACK_BUTON_LABEL}>{` Back`}</Text>
      </TouchableOpacity>
      <KeyboardAvoidingView enabled style={styles.ROOT}>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          {/* <View style={styles.ROOT_CONTAINER}> */}
          <View style={styles.CONTAINER}>

            <Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>Security</Text>
            <View style={styles.LINE} />
            <View style={styles.SWITCH_INPUT_STYLE_CONTAINER}>
              <Text style={styles.ALLOW_LABEL}>Allow touch ID</Text>
              <Switch
                trackColor={{ false: "#39534480", true: "#4CD964" }}
                thumbColor={allowTouchId ? COLOR.PALETTE.lighterGreen : COLOR.PALETTE.lighterGreen}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={allowTouchId}
                style={{ marginRight: 10 }}
              />
            </View>
            <View style={styles.LINE} />
            <View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
              <Text style={styles.INPUT_LABEL_STYLE}>OLD PASSWORD</Text>
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
              <TouchableOpacity style={styles.SHOW_PASS_CONTAINER} onPress={() => setHidePass(!HidePass)}>
                <Ionicons name="eye" color={"#39534480"} size={20} />
              </TouchableOpacity>
            </View>
            <View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
              <Text style={styles.INPUT_LABEL_STYLE}>NEW PASSWORD</Text>
            </View>
            <View style={styles.INPUT_STYLE_CONTAINER}>
              <TextInput
                placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
                style={styles.PASS_INPUT_STYLE}
                onChangeText={t => [setNewPass(t)]}
                value={NewPass}
                secureTextEntry={HideNewPass}
                placeholder={"*********"}
              />
              <TouchableOpacity style={styles.SHOW_PASS_CONTAINER} onPress={() => setHideNewPass(!HideNewPass)}>
                <Ionicons name="eye" color={"#39534480"} size={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
              <Text style={styles.INPUT_LABEL_STYLE}>CONFIRM NEW PASSWORD</Text>
            </View>
            <View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
              <Text style={styles.INPUT_LABEL_STYLE}>AT LEAST 12 CHARACTERS LONG,  1 NUMBER AND 1 SYMBOL</Text>
            </View>
            <View style={styles.INPUT_STYLE_CONTAINER}>
              <TextInput
                placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
                style={styles.PASS_INPUT_STYLE}
                onChangeText={t => [setNewPassConfirmation(t)]}
                value={NewPassConfirmation}
                secureTextEntry={HideNewPassConfirmation}
                placeholder={"*********"}
              />
              <TouchableOpacity style={styles.SHOW_PASS_CONTAINER} onPress={() => setHideNewPassConfirmation(!HideNewPassConfirmation)}>
                <Ionicons name="eye" color={"#39534480"} size={20} />
              </TouchableOpacity>
            </View>

          </View>
          {/* </View> */}
        </ScrollView>
      </KeyboardAvoidingView>
      <Button
        buttonStyle={{
          backgroundColor: loginStore.getAccountColor,
        }}
        // onPress={() => updateSecurity()}
        onPress={() => pressHandler()}
        buttonLabel={'Save changes'}
      />
    </Screen>
  )
})
