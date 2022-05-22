import React, { useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { View, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from "react-native"
import { Text, Button, Screen } from "../../components"
import Icon from "react-native-vector-icons/MaterialIcons"
import styles from "./help-contact-style"
import { COLOR } from "../../theme"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import Entypo from "react-native-vector-icons/Entypo"

export const HelpContactScreen = observer(function HelpContactScreen() {
  const navigation = useNavigation()
  const rootStore = useStores()
  const { loginStore } = rootStore


  const [Show1, setShow1] = useState(false)
  const [Show2, setShow2] = useState(false)
  const [Show3, setShow3] = useState(false)
  const [Show4, setShow4] = useState(false)
  const [Show5, setShow5] = useState(false)
  const [Show6, setShow6] = useState(false)


  const Render1 = () => (!Show1 ? (
    <TouchableOpacity
      onPress={() => setShow1(!Show1)}
      style={styles.TERMS_CLOSE_CONTAINER}
    >
      <Text style={styles.TERMS_TITLE}>{"How to pay with Currents?"}</Text>
      <Entypo
        name={"chevron-down"}
        size={23}
        color={"black"}
        style={{ marginRight: 20 }}
      />
    </TouchableOpacity>
  ) : (
    <View style={styles.TERMS_OPEN_CONTAINER}>
      <TouchableOpacity
        onPress={() => setShow1(!Show1)}
        style={styles.TERMS_OPEN_TITLE_CONTAINER}
      >
        <Text style={styles.TERMS_TITLE}>{"How to pay with Currents?"}</Text>
        <Entypo
          name={"chevron-up"}
          size={23}
          color={"black"}
          style={{ marginRight: 20 }}
        />
      </TouchableOpacity>
      <Text style={styles.TERMS_OPEN_CONTENT}>
        {`
First you click on ‘scan to pay or receive' on the home screen. Then you can scan the qr code shown the merchant. You confirm the amount and the berkshares will be transferred. 
`}
      </Text>
    </View>
  ))
  const Render2 = () => (!Show2 ? (
    <TouchableOpacity
      onPress={() => setShow2(!Show2)}
      style={styles.TERMS_CLOSE_CONTAINER}
    >
      <Text style={styles.TERMS_TITLE}>{"How to make a return?"}</Text>
      <Entypo
        name={"chevron-down"}
        size={23}
        color={"black"}
        style={{ marginRight: 20 }}
      />
    </TouchableOpacity>
  ) : (
    <View style={styles.TERMS_OPEN_CONTAINER}>
      <TouchableOpacity
        onPress={() => setShow2(!Show2)}
        style={styles.TERMS_OPEN_TITLE_CONTAINER}
      >
        <Text style={styles.TERMS_TITLE}>{"How to make a return?"}</Text>
        <Entypo
          name={"chevron-up"}
          size={23}
          color={"black"}
          style={{ marginRight: 20 }}
        />
      </TouchableOpacity>
      <Text style={styles.TERMS_OPEN_CONTENT}>
        {`
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
`}
      </Text>
    </View>
  ))
  const Render3 = () => (!Show3 ? (
    <TouchableOpacity
      onPress={() => setShow3(!Show3)}
      style={styles.TERMS_CLOSE_CONTAINER}
    >
      <Text style={styles.TERMS_TITLE}>{"How to partially return a transaction?"}</Text>
      <Entypo
        name={"chevron-down"}
        size={23}
        color={"black"}
        style={{ marginRight: 20 }}
      />
    </TouchableOpacity>
  ) : (
    <View style={styles.TERMS_OPEN_CONTAINER}>
      <TouchableOpacity
        onPress={() => setShow3(!Show3)}
        style={styles.TERMS_OPEN_TITLE_CONTAINER}
      >
        <Text style={styles.TERMS_TITLE}>{"How to partially return a transaction?"}</Text>
        <Entypo
          name={"chevron-up"}
          size={23}
          color={"black"}
          style={{ marginRight: 20 }}
        />
      </TouchableOpacity>
      <Text style={styles.TERMS_OPEN_CONTENT}>
        {`
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
`}
      </Text>
    </View>
  ))
  const Render4 = () => (!Show4 ? (
    <TouchableOpacity
      onPress={() => setShow4(!Show4)}
      style={styles.TERMS_CLOSE_CONTAINER}
    >
      <Text style={styles.TERMS_TITLE}>{"How to cash out to USD?"}</Text>
      <Entypo
        name={"chevron-down"}
        size={23}
        color={"black"}
        style={{ marginRight: 20 }}
      />
    </TouchableOpacity>
  ) : (
    <View style={styles.TERMS_OPEN_CONTAINER}>
      <TouchableOpacity
        onPress={() => setShow4(!Show4)}
        style={styles.TERMS_OPEN_TITLE_CONTAINER}
      >
        <Text style={styles.TERMS_TITLE}>{"How to cash out to USD?"}</Text>
        <Entypo
          name={"chevron-up"}
          size={23}
          color={"black"}
          style={{ marginRight: 20 }}
        />
      </TouchableOpacity>
      <Text style={styles.TERMS_OPEN_CONTENT}>
        {`
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
`}
      </Text>
    </View>
  ))
  const Render5 = () => (!Show5 ? (
    <TouchableOpacity
      onPress={() => setShow5(!Show5)}
      style={styles.TERMS_CLOSE_CONTAINER}
    >
      <Text style={styles.TERMS_TITLE}>{"What if a transaction fails?"}</Text>
      <Entypo
        name={"chevron-down"}
        size={23}
        color={"black"}
        style={{ marginRight: 20 }}
      />
    </TouchableOpacity>
  ) : (
    <View style={styles.TERMS_OPEN_CONTAINER}>
      <TouchableOpacity
        onPress={() => setShow5(!Show5)}
        style={styles.TERMS_OPEN_TITLE_CONTAINER}
      >
        <Text style={styles.TERMS_TITLE}>{"What if a transaction fails?"}</Text>
        <Entypo
          name={"chevron-up"}
          size={23}
          color={"black"}
          style={{ marginRight: 20 }}
        />
      </TouchableOpacity>
      <Text style={styles.TERMS_OPEN_CONTENT}>
        {`
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
`}
      </Text>
    </View>
  ))
  const Render6 = () => (!Show6 ? (
    <TouchableOpacity
      onPress={() => setShow6(!Show6)}
      style={styles.TERMS_CLOSE_CONTAINER}
    >
      <Text style={styles.TERMS_TITLE}>{"How much BerkShares can I spend in one day?"}</Text>
      <Entypo
        name={"chevron-down"}
        size={23}
        color={"black"}
        style={{ marginRight: 20 }}
      />
    </TouchableOpacity>
  ) : (
    <View style={styles.TERMS_OPEN_CONTAINER}>
      <TouchableOpacity
        onPress={() => setShow6(!Show6)}
        style={styles.TERMS_OPEN_TITLE_CONTAINER}
      >
        <Text style={styles.TERMS_TITLE}>{"How much BerkShares can I spend in one day?"}</Text>
        <Entypo
          name={"chevron-up"}
          size={23}
          color={"black"}
          style={{ marginRight: 20 }}
        />
      </TouchableOpacity>
      <Text style={styles.TERMS_OPEN_CONTENT}>
        {`
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
`}
      </Text>
    </View>
  ))

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

              <Text style={styles.STEP_TITLE}>{'Help & Contact'}</Text>
              <View style={styles.LINE} />

              {Render1()}
              {Render2()}
              {Render3()}
              {Render4()}
              {Render5()}
              {Render6()}


            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
})
