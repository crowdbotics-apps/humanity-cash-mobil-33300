import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { StatusBar, Image, Animated, View } from 'react-native';
import { Button, Text } from '../../components';
import { COLOR } from '../../theme';

import styles from './splash-styles';
import { IMAGES } from '../../theme';
import { StackActions, useNavigation } from '@react-navigation/native';
// import { useStores } from '../../models';
// import { runInAction } from 'mobx';
// import { notifyMessage } from '../../utils/helpers';
import LottieView from 'lottie-react-native';
import {useStores} from "../../models";
// import OneSignal from 'react-native-onesignal';

export const SplashScreen = observer(function SplashScreen() {
  const rootStore = useStores()
  const { loginStore } = rootStore
  const navigation = useNavigation()
  const opacity = new Animated.Value(0)
  const [Loading, setLoading] = useState(false)
  const [Error, setError] = useState(false)

    const setupDatosIniciales = () => {
        if (loginStore.isLoggedIn) {
            loginStore.setApiToken(loginStore.access_token)
        }
    }

  useEffect(() => {
      setupDatosIniciales()
  },[])

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true
    }).start()
    // oneSignalInit()
    setTimeout(() => {
        if (loginStore.isLoggedIn || loginStore.isRegistered) {
            navigation.dispatch(StackActions.replace('login'))
        }else{
            navigation.dispatch(StackActions.replace('slider'))
        }

    }, 1000)
  }, [opacity])

  return (
    <View style={styles.ROOT} >

        <StatusBar translucent backgroundColor={'transparent'} animated />
        <Animated.View
          style={{
            opacity: opacity,
            transform: [
              {
                scale: opacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.85, 1]
                })
              }
            ]
          }}
        >
          <Image source={IMAGES.splash_logo}  style={styles.LOGO_STYLE} />

        </Animated.View>
        {Loading && (
          <View style={{ height: 150 }}>
            <LottieView
              source={require('../../../../assets/svg/loader2.json')}
              autoPlay
              loop
              style={{ width: 100, height: 100 }}
            />
          </View>
        )}
        {!Loading && (
          <View style={{ height: 150 }}>
            {Error && (
              <>
                <Button
                  text={'Retry'}
                  style={{ marginTop: 50 }}
                  preset={'secondary'}
                  loading={Loading}
                  // onPress={() => verifyToken()}
                />
              </>
            )}
          </View>
        )}
    </View>
  )
})
