import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, Linking } from "react-native"
import { Text, Button, Screen } from "../../components"
import Icon from "react-native-vector-icons/MaterialIcons"
import styles from "./help-contact-style"
import { COLOR, METRICS } from "../../theme"
import { useNavigation } from "@react-navigation/native"
import Entypo from "react-native-vector-icons/Entypo"
import { useStores } from "../../models"

export const HelpContactScreen = observer(function HelpContactScreen() {
  const rootStore = useStores()
	const navigation = useNavigation()
	const { loginStore } = rootStore

  const [Step, setStep] = useState('help')

  const [Show1, setShow1] = useState(false)
  const [Show2, setShow2] = useState(false)
  const [Show3, setShow3] = useState(false)
  const [Show4, setShow4] = useState(false)
  const [Show5, setShow5] = useState(false)
  const [Show6, setShow6] = useState(false)

  const [Search, setSearch] = useState('')

  const Render1 = () => {
    const title = "How to pay with Currents?"
    if (Search === '' || title.toLocaleLowerCase().includes(Search.toLocaleLowerCase())) {
      return (!Show1 ? (
        <TouchableOpacity
          onPress={() => setShow1(!Show1)}
          style={styles.TERMS_CLOSE_CONTAINER}
        >
          <Text style={styles.TERMS_TITLE}>{title}</Text>
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
            <Text style={styles.TERMS_TITLE}>{title}</Text>
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
    } else return null
  }
  const Render2 = () => {
    const title = "How to make a return?"
    if (Search === '' || title.toLocaleLowerCase().includes(Search.toLocaleLowerCase())) {
      return (!Show2 ? (
        <TouchableOpacity
          onPress={() => setShow2(!Show2)}
          style={styles.TERMS_CLOSE_CONTAINER}
        >
          <Text style={styles.TERMS_TITLE}>{title}</Text>
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
            <Text style={styles.TERMS_TITLE}>{title}</Text>
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
    } else return null
  }
  const Render3 = () => {
    const title = "How to partially return a transaction?"
    if (Search === '' || title.toLocaleLowerCase().includes(Search.toLocaleLowerCase())) {
      return (!Show3 ? (
        <TouchableOpacity
          onPress={() => setShow3(!Show3)}
          style={styles.TERMS_CLOSE_CONTAINER}
        >
          <Text style={styles.TERMS_TITLE}>{title}</Text>
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
            <Text style={styles.TERMS_TITLE}>{title}</Text>
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
    } else return null
  }
  const Render4 = () => {
    const title = "How to cash out to USD?"
    if (Search === '' || title.toLocaleLowerCase().includes(Search.toLocaleLowerCase())) {
      return (!Show4 ? (
        <TouchableOpacity
          onPress={() => setShow4(!Show4)}
          style={styles.TERMS_CLOSE_CONTAINER}
        >
          <Text style={styles.TERMS_TITLE}>{title}</Text>
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
            <Text style={styles.TERMS_TITLE}>{title}</Text>
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
    } else return null
  }
  const Render5 = () => {
    const title = "What if a transaction fails?"
    if (Search === '' || title.toLocaleLowerCase().includes(Search.toLocaleLowerCase())) {
      return (!Show5 ? (
        <TouchableOpacity
          onPress={() => setShow5(!Show5)}
          style={styles.TERMS_CLOSE_CONTAINER}
        >
          <Text style={styles.TERMS_TITLE}>{title}</Text>
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
            <Text style={styles.TERMS_TITLE}>{title}</Text>
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
    } else return null
  }
  const Render6 = () => {
    const title = "How much BerkShares can I spend in one day?"
    if (Search === '' || title.toLocaleLowerCase().includes(Search.toLocaleLowerCase())) {
      return (!Show6 ? (
        <TouchableOpacity
          onPress={() => setShow6(!Show6)}
          style={styles.TERMS_CLOSE_CONTAINER}
        >
          <Text style={styles.TERMS_TITLE}>{title}</Text>
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
            <Text style={styles.TERMS_TITLE}>{title}</Text>
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
    } else return null
  }

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
        // behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={styles.ROOT}
      >
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          <View style={styles.ROOT_CONTAINER}>

            {(Step === 'help')
              ? <View style={styles.CONTAINER}>
                <TouchableOpacity style={styles.HEADER} onPress={() => navigation.navigate("home")}>
                  <Icon name={"arrow-back"} size={23} color={COLOR.PALETTE.black} />
                  <Text style={styles.BACK_BUTON_LABEL}>{` Home`}</Text>
                </TouchableOpacity>
                <Text style={[styles.STEP_TITLE, {color: loginStore.getAccountColor}]}>{'Help & Contact'}</Text>
                <View style={styles.LINE} />
                <Text style={styles.STEP_SUB_TITLE}>We are here to help you with anything and everything on the Currents app.</Text>
                <View style={styles.SEARCH_INPUT_CONTAINER}>
                  <View style={styles.SEARCH_INPUT_STYLE_CONTAINER}>
                    <Icon name={"search"} size={25} color={COLOR.PALETTE.black} />
                    <TextInput
                      style={styles.SEARCH_INPUT_STYLE}
                      onChangeText={t => setSearch(t)}
                      value={Search}
                      placeholder={`Search`}
                      placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
                    />
                  </View>
                </View>
                {Render1()}
                {Render2()}
                {Render3()}
                {Render4()}
                {Render5()}
                {Render6()}
              </View>
              : <View style={styles.CONTAINER}>
              <TouchableOpacity style={styles.HEADER} onPress={() => setStep('help')}>
                <Icon name={"arrow-back"} size={23} color={COLOR.PALETTE.black} />
                <Text style={styles.BACK_BUTON_LABEL}>{` Back`}</Text>
              </TouchableOpacity>
              <Text style={styles.STEP_TITLE}>{'Contact'}</Text>
              <View style={styles.LINE} />
              <Text style={styles.STEP_SUB_TITLE}>If you have questions, complaints, remarks, or just like to chat, please send an email to [Hudson Valley Currents contact] or contact the Hudson Valley Currents by calling (845) 663-2286.</Text>
            </View>
            }

          </View>
        </ScrollView>
          <Button
					buttonStyle={{
						backgroundColor: loginStore.getAccountColor,
						bottom: 5,
						position: 'absolute'
					}}
					onPress={() => {Step === 'help' ? setStep('contact') : Linking.openURL('mailto:support@example.com') }}
					buttonLabel={Step === 'help' ? 'Contact' : 'Send mail'}
				/>
      </KeyboardAvoidingView>
    </Screen>
  )
})
