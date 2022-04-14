/**
 * Welcome to the main entry point of the app. In this file, we'll
 * be kicking off our app.
 *
 * Most of this file is boilerplate and you shouldn't need to modify
 * it very often. But take some time to look through and understand
 * what is going on here.
 *
 * The app navigation resides in ./app/navigators, so head over there
 * if you're interested in adding screens and navigators.
 */
import './common/utils/ignore-warnings';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import { initFonts } from './common/theme/fonts'; // expo
import * as storage from './common/utils/storage';
import {
  useBackButtonHandler,
  AppNavigator,
  canExit,
  useNavigationPersistence,
} from './common/navigators';
import { RootStore, RootStoreProvider, setupRootStore } from './common/models';
// import { ErrorBoundary } from "./screens/error/error-boundary"
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Toast, { ErrorToast } from 'react-native-toast-message';
import { useEffect, useState } from 'react';
import { Text as ReactNativeText } from 'react-native';
// eslint-disable-next-line prettier/prettier
import * as React from 'react';
Ionicons.loadFont()
MaterialIcons.loadFont()

// This puts screens in a native ViewController or Activity. If you want fully native
// stack navigation, use `createNativeStackNavigator` in place of `createStackNavigator`:
// https://github.com/kmagiera/react-native-screens#using-native-stack-navigator

export const NAVIGATION_PERSISTENCE_KEY = 'NAVIGATION_STATE';

const toastConfig = {
  error: props => <ErrorToast {...props} text1NumberOfLines={2} />
}

/**
 * This is the root component of our app.
 */
function App() {
    const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined)

  // const isNavigationStateRestored = true
  useBackButtonHandler(canExit)
  const {
    initialNavigationState,
    onNavigationStateChange,
    isRestored: isNavigationStateRestored
  } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY)

  // Kick off initial async loading actions, like loading fonts and RootStore
  useEffect(() => {
    (async () => {
      initFonts()
      setupRootStore().then(setRootStore)
    })()
  }, [])

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color.
  // In iOS: application:didFinishLaunchingWithOptions:
  // In Android: https://stackoverflow.com/a/45838109/204044
  // You can replace with your own loading component if you wish.
  if (!rootStore || !isNavigationStateRestored) {
    return null
  }

  // return <ReactNativeText>holaa</ReactNativeText>

  // otherwise, we're ready to render the app
  return (
    <RootStoreProvider value={rootStore}>
       <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <AppNavigator
          initialState={initialNavigationState}
          onStateChange={onNavigationStateChange}
        />
      </SafeAreaProvider>
      <Toast config={toastConfig} />
    </RootStoreProvider>
  )
}

export default App
