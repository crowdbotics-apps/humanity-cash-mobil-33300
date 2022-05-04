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

export const LoginScreen = observer(function LoginScreen() {
  const navigation = useNavigation()
  const rootStore = useStores()
  const { loginStore } = rootStore

  const [Username, setUsername] = useState('')
  const [Pass, setPass] = useState('')
  const [HidePass, setHidePass] = useState(true)

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
              backgroundColor: COLOR.PALETTE.green,
            }}
            onPress={() => [
              navigation.navigate("home", {}),
              loginStore.setApiToken('123')
            ]}
            buttonLabel={'Log in'}
          />
        </View>
      </View>
    </Screen>
  )
})
