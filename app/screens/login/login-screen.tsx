import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import {TextInput, View, TouchableOpacity, Image, ScrollView, Alert, Platform} from "react-native"
import { Text, Button, Screen, Checkbox, TextInputComponent } from "../../components"
import Icon from "react-native-vector-icons/MaterialIcons"
import Ionicons from "react-native-vector-icons/Ionicons"
import styles from "./login-style"
import { COLOR, IMAGES } from "../../theme"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import { runInAction } from "mobx"
import { getErrorMessage, notifyMessage } from "../../utils/helpers"
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin'
import {
  appleAuth
} from '@invertase/react-native-apple-authentication'

import { AccessToken, LoginManager } from 'react-native-fbsdk-next'

import TouchID from 'react-native-touch-id'

export const LoginScreen = observer(function LoginScreen() {
  const navigation = useNavigation()
  const rootStore = useStores()
  const { loginStore } = rootStore

  const [Username, setUsername] = useState("")
  const [Pass, setPass] = useState("")
  const [HidePass, setHidePass] = useState(true)
  const [Loading, setLoading] = useState(false)

  const [UsernameError, setUsernameError] = useState(false)
  const [UsernameErrorMessage, setUsernameErrorMessage] = useState("")
  const [PassError, setPassError] = useState(false)
  const [PassErrorMessage, setPassErrorMessage] = useState("")

  const login = () => {
    setLoading(true)
    loginStore.environment.api
      .login({ email: Username, password: Pass })
      .then((result: any) => {
        setLoading(false)
        console.log(' setPassword ===>>> ', JSON.stringify({ email: Username, password: Pass }, null, 2))
        if (result.kind === "ok") {
          runInAction(() => {
            loginStore.setUser(result.response)
            loginStore.setApiToken(result.response.access_token)
            loginStore.setSelectedAccount('consumer')
            loginStore.setMerchantUser(result?.response?.user?.merchant_data)
            loginStore.setConsumerUser(result?.response?.user)
            if ((result?.response?.user?.first_name === '' || result?.response?.user?.first_name === null) &&
              (result?.response?.user?.merchant_data?.business_name === '' || result?.response?.user?.merchant_data?.business_name === null)) navigation.navigate("setupProfile")
            else navigation.navigate("home")
          })
        } else if (result.kind === "bad-data") {
          const errors = result.errors
          if (result?.errors?.password) {
            setPassError(true)
            setPassErrorMessage(result?.errors?.password?.[0])
          } else {
            setPassError(false)
            setPassErrorMessage('')
          }
          if (result?.errors?.email) {
            setUsernameError(true)
            setUsernameErrorMessage(result?.errors?.email?.[0])
          } else {
            setUsernameError(false)
            setUsernameErrorMessage('')
          }
          notifyMessage(getErrorMessage(errors))
        } else {
          loginStore.reset()
          notifyMessage(null)
        }
      }).catch((err) => notifyMessage(getErrorMessage(err)))
  }

  const loginGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      const user = await GoogleSignin.getCurrentUser();
      console.log('user ', user)
      loginStore.environment.api.loginGoogle(user.user, user.idToken).then((result) => {

        setLoading(false)
        if (result.kind === "ok") {
          runInAction(() => {
            loginStore.setUser(result.response)
            loginStore.setApiToken(result.response.access_token)
            loginStore.setSelectedAccount('consumer')
            navigation.navigate("home")
          })
        } else if (result.kind === "bad-data") {
          const errors = result.errors
          notifyMessage(getErrorMessage(errors))
        } else {
          setLoading(false)
          notifyMessage(null)
        }
      })
    } catch (error) {
      console.log('error ', error)
      setLoading(false)
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // errorMessage("Login con Google cancelado")
      } else {
        notifyMessage(getErrorMessage(error))
      }
    }
  }

  const loginFacebook = () => {
    setLoading(true)
    LoginManager.logInWithPermissions(["public_profile", "email"]).then(
      function (result) {
        if (result.isCancelled) {
          setLoading(false)
        } else {
          AccessToken.getCurrentAccessToken().then((data) => {
            loginStore.environment.api.loginFacebook(data.accessToken).then((result) => {
              setLoading(false)
              if (result.kind === "ok") {
                runInAction(() => {
                  loginStore.setUser(result.response)
                  loginStore.setApiToken(result.response.token.access)
                  loginStore.setSelectedAccount('consumer')
                  navigation.navigate("home")
                })
              } else if (result.kind === "bad-data") {
                const errors = result.errors
                notifyMessage(getErrorMessage(errors))
              } else {
                setLoading(false)
                notifyMessage(null)
              }
            }).catch((err) => notifyMessage(getErrorMessage(err)))
          })
        }
      }
    )
  }

  const loginApple = (identityToken, fullName) => {
    setLoading(true)
    loginStore.environment.api
      .loginApple(identityToken, fullName)
      .then((result: any) => {
        setLoading(false)
        if (result.kind === "ok") {
          runInAction(() => {
            loginStore.setUser(result.response)
            loginStore.setApiToken(result.response.access_token)
            loginStore.setSelectedAccount('consumer')
            navigation.navigate("home")
          })
        } else if (result.kind === "bad-data") {
          const errors = result.errors
          notifyMessage(getErrorMessage(errors))
        } else {
          loginStore.reset()
          notifyMessage(null)
        }
      }).catch((err) => notifyMessage(getErrorMessage(err)))
  }

  async function onAppleButtonPress() {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user
    );

    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // user is authenticated
      loginApple(appleAuthRequestResponse.identityToken, appleAuthRequestResponse.fullName);
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
      preset="fixed"
      statusBar={"dark-content"}
      style={styles.ROOT}
      showHeader
    >
      <TouchableOpacity
        onPress={() => navigation.navigate("splash")}
        style={styles.BACK_BUTON_CONTAINER}
      >
        <Icon name={"arrow-back"} size={23} color={"#8B9555"} />
        <Text style={styles.BACK_BUTON_LABEL}>{" Back"}</Text>
      </TouchableOpacity>
      <ScrollView bounces={false}>
        <View style={styles.STEP_CONTAINER}>
          <View style={styles.STEP_CONTAINER}>
            <Text style={styles.STEP_TITLE}>Log in</Text>
            <Text style={styles.STEP_SUB_TITLE}>{"Welcome back"}</Text>
          </View>
          <TextInputComponent
            label='EMAIL ADDRESS OR USER NAME'
            errorLabel={UsernameError
              ? UsernameErrorMessage === ""
                ? "ENTER EMAIL ADDRESS OR USER NAME"
                : UsernameErrorMessage
              : ""}
            error={UsernameError}
            onChangeText={t => setUsername(t)}
            value={Username}
            placeholder={"EMAIL ADDRESS OR USER NAME"}
          />
          <TextInputComponent
            label='PASSWORD'
            errorLabel={PassError ? PassErrorMessage : ""}
            error={PassError}
            onChangeText={t => setPass(t)}
            value={Pass}
            placeholder={"*********"}
            secureTextEntry={HidePass}
            inputStyle={styles.PASS_INPUT_STYLE}
            inputDecoration={<TouchableOpacity style={styles.SHOW_PASS_CONTAINER} onPress={() => setHidePass(!HidePass)}>
              <Ionicons name="eye" color={"#39534440"} size={20} />
            </TouchableOpacity>}
          />
        </View>
        <View style={styles.LOGIN_OPTIONS_CONTAINER}>
          <Text style={styles.LOGIN_TYPES_LABEL}>Or Log In using</Text>
          <View style={styles.STEP_CONTAINER}>
            <View style={styles.LOGIN_TYPES_CONTAINER}>
              {Platform.OS === 'ios' && <TouchableOpacity onPress={() => onAppleButtonPress()}>
                <Image
                  source={IMAGES.apple_icon}
                  resizeMode="contain"
                  style={styles.LOGIN_TYPE}
                />
              </TouchableOpacity>}
              <TouchableOpacity onPress={() => loginGoogle()}>
                <Image
                  source={IMAGES.googleIcon}
                  resizeMode="contain"
                  style={styles.LOGIN_TYPE}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => loginFacebook()}>
                <Image
                  source={IMAGES.facebookIcon}
                  resizeMode="contain"
                  style={styles.LOGIN_TYPE}
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("forgotPass")} style={styles.NEED_HELP_CONTAINER}>
            <Text style={styles.NEED_HELP_LINK}>
              Forgot password
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Button
        buttonStyle={{
          backgroundColor: Loading ? `${COLOR.PALETTE.green}40` : COLOR.PALETTE.green
        }}
        onPress={() => login()}
        buttonLabel={"Log in"}
        disabled={Loading}
        loading={Loading}
      />
    </Screen>
  )
})
