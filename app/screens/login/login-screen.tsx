import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextInput, View, TouchableOpacity, Image, Keyboard, Alert } from "react-native"
import { Text, Button, Screen, Checkbox } from "../../components"
import Icon from "react-native-vector-icons/MaterialIcons"
import Entypo from "react-native-vector-icons/Entypo"
import Ionicons from "react-native-vector-icons/Ionicons"
import styles from "./login-style"
import { COLOR, TYPOGRAPHY } from "../../theme"
import { StackActions, useNavigation } from "@react-navigation/native"
import { IMAGES } from "../../theme"
import { useStores } from "../../models"
import { runInAction } from "mobx"
import { notifyMessage } from "../../utils/helpers"
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin'
import { AppleButton } from '@invertase/react-native-apple-authentication'
import { appleAuth } from '@invertase/react-native-apple-authentication'
import { LoginButton, AccessToken, LoginManager, Profile } from 'react-native-fbsdk-next'

import TouchID from 'react-native-touch-id'

export const LoginScreen = observer(function LoginScreen() {
  const navigation = useNavigation()
  const rootStore = useStores()
  const { loginStore } = rootStore

  const [Username, setUsername] = useState("")
  const [Pass, setPass] = useState("")
  const [HidePass, setHidePass] = useState(true)
  const [Loading, setLoading] = useState(false)

  const login = () => {
    setLoading(true)
    loginStore.environment.api
      .login({ email: Username, password: Pass })
      .then(result => {
        console.log(' =====>>>>>>> ', JSON.stringify(result))
        setLoading(false)
        if (result.kind === "ok") {
          runInAction(() => {
            loginStore.setUser(result.response.user)
            loginStore.setApiToken(result.response.access_token)
            loginStore.setSelectedAccount('consumer')
            navigation.navigate("home", {})
          })
        } else if (result.kind === "bad-data") {
          const key = Object.keys(result?.errors)[0]
          let msg = `${key}: ${result?.errors?.[key][0]}`
          console.log('msg -> ', Keyboard)
          notifyMessage(msg)
        } else {
          loginStore.reset()
          notifyMessage(null)
        }
      })
  }

  async function onAppleButtonPress() {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // user is authenticated
    }
  }

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

  const pressHandler = () => {
    console.log(' ==>> ', TouchID)
    TouchID.authenticate('to demo this react-native component', optionalConfigObject)
    .then(success => {
      Alert.alert('Authenticated Successfully');
    })
    .catch(error => {
      Alert.alert('Authentication Failed');
    });
  }


  return (
    <Screen
      // preset='scroll'
      preset="scroll"
      statusBar={"dark-content"}
      style={styles.ROOT}
      showHeader
    >
      <View style={styles.STEP_CONTAINER}>
        <TouchableOpacity
          onPress={() => navigation.navigate("splash", {})}
          style={styles.BACK_BUTON_CONTAINER}
        >
          <Icon name={"arrow-back"} size={23} color={"#8B9555"} />
          <Text style={styles.BACK_BUTON_LABEL}>{" Back"}</Text>
        </TouchableOpacity>
        <View style={styles.STEP_CONTAINER}>
          <Text style={styles.STEP_TITLE}>Log in</Text>
          <Text style={styles.STEP_SUB_TITLE}>{"Welcome back"}</Text>
        </View>
        <View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
          <Text style={styles.INPUT_LABEL_STYLE}>
            EMAIL ADDRESS OR USER NAME
          </Text>
        </View>
        <View style={styles.INPUT_STYLE_CONTAINER}>
          <TextInput
            style={styles.INPUT_STYLE}
            onChangeText={t => setUsername(t)}
            value={Username}
            placeholder={"EMAIL ADDRESS OR USER NAME"}
          />
        </View>
        <View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
          <Text style={styles.INPUT_LABEL_STYLE}>PASSWORD</Text>
          {/* <Text style={styles.PASS_REQUIREMENTS}>AT LEAST 12 CHARACTERS LONG,  1 NUMBER AND 1 SYMBOL</Text> */}
        </View>
        <View style={styles.INPUT_STYLE_CONTAINER}>
          <TextInput
            // ref={ref => EmailInput = ref}
            style={styles.PASS_INPUT_STYLE}
            onChangeText={t => [setPass(t)]}
            value={Pass}
            secureTextEntry={HidePass}
            placeholder={"*********"}
          />
          <TouchableOpacity onPress={() => setHidePass(!HidePass)}>
            <Ionicons name="eye" color={"#39534440"} size={20} />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => pressHandler()}>
        <Text style={styles.LOGIN_TYPES_LABEL}>Authenticate with Touch ID</Text>
        </TouchableOpacity>
      <Text style={styles.LOGIN_TYPES_LABEL}>Or Log In using</Text>
      <View style={styles.STEP_CONTAINER}>
        <View style={styles.LOGIN_TYPES_CONTAINER}>
          <TouchableOpacity onPress={() => onAppleButtonPress()}>
            <Image
              source={IMAGES.appleIcon}
              resizeMode="contain"
              style={styles.LOGIN_TYPE}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={IMAGES.googleIcon}
              resizeMode="contain"
              style={styles.LOGIN_TYPE}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => LoginManager.logInWithPermissions(["public_profile"]).then(
            function (result) {
              if (result.isCancelled) {
                console.log("Login cancelled");
              } else {
                console.log(
                  "Login success with permissions: ",
                  JSON.stringify(result, null, 2)
                );
                const currentProfile = Profile.getCurrentProfile().then(
                  function (currentProfile) {
                    if (currentProfile) {
                      console.log("The current logged user is: " +
                        currentProfile.name
                        + ". His profile id is: " +
                        JSON.stringify(currentProfile, null, 2)
                      );
                    }
                  }
                )
              }
            },
            function (error) {
              console.log("Login fail with error: " + error);
            }
          )}>
            <Image
              source={IMAGES.facebookIcon}
              resizeMode="contain"
              style={styles.LOGIN_TYPE}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.NEED_HELP_CONTAINER}>
        <Text onPress={() => {
        }} style={styles.NEED_HELP_LINK}>
          Forgot password
        </Text>
      </View>
      {/* <View style={styles.STEP_CONTAINER}>
</View> */}
      <Button
        buttonStyle={{
          bottom: 5,
          // position: 'absolute',
          backgroundColor: Loading
            ? `${COLOR.PALETTE.green}40`
            : COLOR.PALETTE.green
        }}
        onPress={() => login()}
        buttonLabel={"Log in"}
        disabled={Loading}
        loading={Loading}
      />
    </Screen>
  )
})
