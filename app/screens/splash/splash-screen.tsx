import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { TouchableOpacity, Image, View } from "react-native"
import { Screen, Text, Button } from "../../components"

import styles from "./splash-styles"
import { IMAGES, COLOR, METRICS } from "../../theme"
import {CommonActions, useNavigation} from "@react-navigation/native"
import { useStores } from "../../models"
import { GoogleSignin } from "@react-native-google-signin/google-signin";

// import OneSignal from 'react-native-onesignal';

export const SplashScreen = observer(function SplashScreen() {
  const rootStore = useStores()
  const { loginStore } = rootStore
  const navigation = useNavigation()
  //TODO: ESCONDER VARIABLE
  GoogleSignin.configure({
    webClientId:
      "65270403402-0jngo19j7o6t7tsej7qt4qkoq0h8pg5i.apps.googleusercontent.com"
  });

  const [Loading, setLoading] = useState(true)

  const setupDatosIniciales = () => {
    if (loginStore.isLoggedIn) {
      loginStore.setApiToken(loginStore.access_token)
    }
  }

  useEffect(() => {
    const step = loginStore.getStep
    setupDatosIniciales()
    setTimeout(function () {
      if (step !== '' && step !== null) {
        navigation.navigate(step)
      }
      if (loginStore.isLoggedIn) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'home' }],
          })
        );
      }
      setLoading(false)
    }, 2000)
  }, [])

  const LoadingSetp = () => (
    <View style={styles.ROOT}>
      <Image resizeMode="contain" source={IMAGES.bgWaves} style={styles.BG_STYLE} />
      <View />
      <Image
        resizeMode="contain"
        source={IMAGES.logoFull}
        style={styles.LOGO_STYLE}
      />
      <View style={styles.POWERED_CONTAINER}>
        <Text style={styles.POWERED_LABEL}>Powered by</Text>
        <Image
          resizeMode="contain"
          source={IMAGES.humanityCashWatermark}
          style={styles.WATERMARK_STYLE}
        />
      </View>
    </View>
  )

  const LoginSetp = () => (
    <View style={styles.ROOT}>
      <View style={styles.POWERED_CONTAINER_ABSOLUTE} />
      <Image
        resizeMode="contain"
        source={IMAGES.logoFull}
        style={styles.LOGO_STYLE}
      />
      <View style={styles.POWERED_CONTAINER_ABSOLUTE}>
        <View style={styles.CONTAINER}>
          <Text style={styles.POWERED_LABEL}>Powered by</Text>
          <Image
            resizeMode="contain"
            source={IMAGES.humanityCashWatermark}
            style={styles.WATERMARK_STYLE}
          />
        </View>
        <View style={styles.CONTAINER}>
          <Button
            buttonStyle={{
              backgroundColor: COLOR.PALETTE.blue,
              marginBottom: 10
            }}
            onPress={() => navigation.navigate("login")}
            buttonLabel={'Log in'}
          />
          <Button
            buttonStyle={{
              backgroundColor: COLOR.PALETTE.white,
            }}
            buttonLabelStyle={{ color: COLOR.PALETTE.black }}
            onPress={() => navigation.navigate("signup")}
            buttonLabel={'Create an account'}
          />
        </View>
      </View>
    </View>
  )

  return (
    <Screen preset="fixed" statusBar={"dark-content"} unsafe={true}>
      {Loading ? LoadingSetp() : LoginSetp()}
    </Screen>
  )
})
