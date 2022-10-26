import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, TextInput, Switch } from "react-native"
import { Text, Button, Screen } from "../../components"
import Icon from "react-native-vector-icons/MaterialIcons"
import styles from "./security-style"
import { COLOR, METRICS } from "../../theme"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import Ionicons from "react-native-vector-icons/Ionicons"
import { runInAction } from "mobx";
import { notifyMessage } from "../../utils/helpers";


export const SecurityScreen = observer(function SecurityScreen() {
  const navigation = useNavigation()
  const rootStore = useStores()
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
    setAllowTouchId(loginStore.ProfileData.allow_touch_id)
  }, [])

  const updateSecurity = () => {
    setLoading(true)
    loginStore.environment.api
      .updateSecurity({
        old_password: Pass,
        new_password: NewPass,
        new_password_confirm: NewPassConfirmation,
        allow_touch_id: allowTouchId
      })
      .then((result: any) => {
        setLoading(false)
        if (result.kind === "ok") {
          runInAction(() => {
            loginStore.setAllowTouchId(result.response)
            navigation.navigate("settings")
          })
        } else if (result.kind === "bad-data") {
          const key = Object.keys(result?.errors)[0]
          const msg = `${key}: ${result?.errors?.[key][0]}`
          notifyMessage(msg)
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
            <View style={styles.SWITCH_INPUT_STYLE_CONTAINER}>
              <Text style={styles.ALLOW_LABEL}>Enable cashier view</Text>
              <Switch
                trackColor={{ false: "#39534480", true: "#4CD964" }}
                thumbColor={enableCashierView ? COLOR.PALETTE.lighterGreen : COLOR.PALETTE.lighterGreen}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitchCashier}
                value={enableCashierView}
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
        onPress={() => updateSecurity()}
        buttonLabel={'Save changes'}
      />
    </Screen>
  )
})
