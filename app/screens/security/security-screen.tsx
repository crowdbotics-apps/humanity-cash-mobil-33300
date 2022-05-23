import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import { View, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, TextInput, Switch } from "react-native"
import { Text, Button, Screen } from "../../components"
import Icon from "react-native-vector-icons/MaterialIcons"
import styles from "./security-style"
import { COLOR, METRICS } from "../../theme"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import Ionicons from "react-native-vector-icons/Ionicons"


export const SecurityScreen = observer(function SecurityScreen() {
  const navigation = useNavigation()
  const rootStore = useStores()

  const [Pass, setPass] = useState("")
  const [HidePass, setHidePass] = useState(true)

  const [NewPass, setNewPass] = useState("")
  const [HideNewPass, setHideNewPass] = useState(true)
  const [NewPassConfirmation, setNewPassConfirmation] = useState("")
  const [HideNewPassConfirmation, setHideNewPassConfirmation] = useState(true)

  const [isEnabled, setIsEnabled] = useState(false)
  const toggleSwitch = () => setIsEnabled(previousState => !previousState)


  return (
    <Screen
      // preset='scroll'
      preset="fixed"
      statusBar={"dark-content"}
      style={styles.ROOT}
      showHeader
    >
      <KeyboardAvoidingView
        enabled
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={styles.ROOT}
      >
        <ScrollView bounces={false}>
          <View style={styles.ROOT_CONTAINER}>
            <View style={styles.CONTAINER}>

              <TouchableOpacity style={styles.HEADER} onPress={() => navigation.navigate("settings", {})}>
                <Icon name={"arrow-back"} size={23} color={COLOR.PALETTE.black} />
                <Text style={styles.BACK_BUTON_LABEL}>{` Back`}</Text>

              </TouchableOpacity>

              <Text style={styles.STEP_TITLE}>Security</Text>
              <View style={styles.LINE} />

              <View style={styles.SWITCH_INPUT_STYLE_CONTAINER}>
                <Text style={styles.ALLOW_LABEL}>Allow touch ID</Text>
                <Switch
                  trackColor={{ false: "#39534480", true: "#4CD964" }}
                  thumbColor={isEnabled ? "#F8FAF6" : "#F8FAF6"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
              </View>

              <View style={styles.LINE} />
              
              <View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
                <Text style={styles.INPUT_LABEL_STYLE}>OLD PASSWORD</Text>
              </View>
              <View style={styles.INPUT_STYLE_CONTAINER}>
                <TextInput
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

              <View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
                <Text style={styles.INPUT_LABEL_STYLE}>NEW PASSWORD</Text>
              </View>
              <View style={styles.INPUT_STYLE_CONTAINER}>
                <TextInput
                  style={styles.PASS_INPUT_STYLE}
                  onChangeText={t => [setNewPass(t)]}
                  value={NewPass}
                  secureTextEntry={HideNewPass}
                  placeholder={"*********"}
                />
                <TouchableOpacity onPress={() => setHideNewPass(!HideNewPass)}>
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
                  style={styles.PASS_INPUT_STYLE}
                  onChangeText={t => [setNewPassConfirmation(t)]}
                  value={NewPassConfirmation}
                  secureTextEntry={HideNewPassConfirmation}
                  placeholder={"*********"}
                />
                <TouchableOpacity onPress={() => setHideNewPassConfirmation(!HideNewPassConfirmation)}>
                  <Ionicons name="eye" color={"#39534480"} size={20} />
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </ScrollView>
        <Button
					buttonStyle={{
						backgroundColor: COLOR.PALETTE.blue,
						top: METRICS.screenHeight - 80,
						position: 'absolute'
					}}
					onPress={() => {}}
					buttonLabel={'Save changes'}
				/>
      </KeyboardAvoidingView>
    </Screen>
  )
})
