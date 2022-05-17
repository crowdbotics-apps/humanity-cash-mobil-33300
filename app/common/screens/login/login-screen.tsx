import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { TextInput, View, TouchableOpacity, Image } from 'react-native';
import {
  Text,
  Button,
  Screen,
  Checkbox
} from '../../components';
import Icon from "react-native-vector-icons/MaterialIcons"
import Entypo from "react-native-vector-icons/Entypo"
import Ionicons from "react-native-vector-icons/Ionicons"
import styles from './login-style';
import { COLOR, TYPOGRAPHY } from '../../theme';
import { StackActions, useNavigation } from "@react-navigation/native"
import { IMAGES } from "../../theme"
import { useStores } from "../../models"
import { runInAction } from "mobx"
import { notifyMessage } from "../../utils/helpers"

export const LoginScreen = observer(function LoginScreen() {
  const navigation = useNavigation()
  const rootStore = useStores()
  const { loginStore } = rootStore

  const [Username, setUsername] = useState('')
  const [Pass, setPass] = useState('')
  const [HidePass, setHidePass] = useState(true)
  const [Loading, setLoading] = useState(false)

  // rafael@mail.com @Rafa1234567

  const login = () => {
    setLoading(true)
    loginStore.environment.api.login({ email: Username, password: Pass }).then(result => {
      setLoading(false)
      if (result.kind === "ok") {
        runInAction(() => {
          loginStore.setUser(result.response.user)
          loginStore.setApiToken(result.response.access_token)
          navigation.navigate("home", {})
        })
      } else if (result.kind === "bad-data") {
        const key = Object.keys(result?.errors)[0]
        let msg = `${key}: ${result?.errors?.[key][0]}`
        notifyMessage(msg)
      } else {
        loginStore.reset()
        notifyMessage(null)
      }
    })
  }

  return (
    <Screen
      // preset='scroll'
      preset="fixed"
      statusBar={'dark-content'}
      unsafe={true}
    >
      <View style={styles.ROOT}>
        <View>
          <TouchableOpacity onPress={() => navigation.navigate("splash", {})} style={styles.BACK_BUTON_CONTAINER}>
            <Icon name={"arrow-back"} size={23} color={'#8B9555'} />
            <Text style={styles.BACK_BUTON_LABEL}>{` Back`}</Text>
          </TouchableOpacity>
          <View style={styles.STEP_CONTAINER}>
            <Text style={styles.STEP_TITLE}>Log in</Text>
            <Text style={styles.STEP_SUB_TITLE}>{`Welcome back`}</Text>
            <View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
              <Text style={styles.INPUT_LABEL_STYLE}>EMAIL ADDRESS OR USER NAME</Text>
            </View>
            <View style={styles.INPUT_STYLE_CONTAINER}>
              <TextInput
                style={styles.INPUT_STYLE}
                onChangeText={t => setUsername(t)}
                value={Username}
                placeholder={'EMAIL ADDRESS OR USER NAME'}
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
                placeholder={'*********'}
              />
              <TouchableOpacity onPress={() => setHidePass(!HidePass)}>
                <Ionicons name='eye' color={'#39534440'} size={20} />
              </TouchableOpacity>
            </View>
          </View>


          <Text style={styles.LOGIN_TYPES_LABEL}>Or Log In using</Text>
          <View style={styles.LOGIN_TYPES_CONTAINER}>
            <Image source={IMAGES.appleIcon} resizeMode='contain' style={styles.LOGIN_TYPE} />
            <Image source={IMAGES.googleIcon} resizeMode='contain' style={styles.LOGIN_TYPE} />
            <Image source={IMAGES.facebookIcon} resizeMode='contain' style={styles.LOGIN_TYPE} />
          </View>
        </View>

        <View>
          <View style={styles.NEED_HELP_CONTAINER}>
            <Text onPress={() => { }} style={styles.NEED_HELP_LINK}>Forgot password</Text>
          </View>
          <Button
            buttonStyle={{
              backgroundColor: Loading ? `${COLOR.PALETTE.green}40` : COLOR.PALETTE.green,
            }}
            onPress={() => login()}
            buttonLabel={'Log in'}
            disabled={Loading}
            loading={Loading}
          />
        </View>
      </View>
    </Screen>
  )
})
