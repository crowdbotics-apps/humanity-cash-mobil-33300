import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { TouchableOpacity, Image, Animated, View } from "react-native"
import { Screen, Text } from "../../components"
import { COLOR } from "../../theme"

import styles from "./splash-styles"
import { IMAGES } from "../../theme"
import { StackActions, useNavigation } from "@react-navigation/native"
// import { useStores } from '../../models';
// import { runInAction } from 'mobx';
// import { notifyMessage } from '../../utils/helpers';
import LottieView from "lottie-react-native"
import { useStores } from "../../models"
// import OneSignal from 'react-native-onesignal';

export const SplashScreen = observer(function SplashScreen() {
  const rootStore = useStores()
  const { loginStore } = rootStore
  const navigation = useNavigation()
  const opacity = new Animated.Value(0)

  const [Loading, setLoading] = useState(true)
  const [Error, setError] = useState(false)

  const setupDatosIniciales = () => {
    if (loginStore.isLoggedIn) {
      loginStore.setApiToken(loginStore.access_token)
    }
  }

  useEffect(() => {
    setupDatosIniciales()
    setTimeout(function () {
      setLoading(false);
    }, 2000);
  }, [])

  // useEffect(() => {
  //   Animated.timing(opacity, {
  //     toValue: 1,
  //     duration: 1000,
  //     useNativeDriver: true
  //   }).start()
  //   // oneSignalInit()
  //   setTimeout(() => {
  //     if (loginStore.isLoggedIn || loginStore.isRegistered) {
  //       navigation.dispatch(StackActions.replace("login"))
  //     } else {
  //       navigation.dispatch(StackActions.replace("slider"))
  //     }
  //   }, 1000)
  // }, [opacity])

  const LoadingSetp = () =>
    <View style={styles.ROOT}>
      <Image source={IMAGES.bgWaves} style={styles.BG_STYLE} />
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

  const LoginSetp = () => <View style={styles.ROOT}>
    <Image
      resizeMode="contain"
      source={IMAGES.logoFull}
      style={styles.LOGO_STYLE}
    />
    <View />
    <View style={styles.POWERED_CONTAINER_ABSOLUTE}>
      <Text style={styles.POWERED_LABEL}>Powered by</Text>
      <Image
        resizeMode="contain"
        source={IMAGES.humanityCashWatermark}
        style={styles.WATERMARK_STYLE}
      />
    </View>
    <View>
      <TouchableOpacity onPress={() => navigation.navigate("login", {})} style={styles.LOGIN_BUTTON}>
        <Text style={styles.LOGIN_LABEL}>Log in</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("signup", {})} style={styles.CREATE_ACCOUNT_BUTTON}>
        <Text style={styles.CREATE_ACCOUNT_LABEL}>Create an account</Text>
      </TouchableOpacity>
    </View>
  </View>

  return (
    <Screen
      // preset='scroll'
      preset="fixed"
      statusBar={'dark-content'}
      unsafe={true}
    >
      {Loading ? LoadingSetp() : LoginSetp()}
    </Screen>
  ) 

})
