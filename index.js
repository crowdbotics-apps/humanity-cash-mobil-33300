// This is the first file that ReactNative will run when it starts up.
//
// We jump out of here immediately and into our main entry point instead.
//
// It is possible to have React Native load our main module first, but we'd have to
// change that in both AppDelegate.m and MainApplication.java.  This would have the
// side effect of breaking other tooling like mobile-center and react-native-rename.
//
// It's easier just to leave it here.
import App from './app/app'
import {AppRegistry, Platform} from 'react-native'
import * as Sentry from '@sentry/react-native'
// import messaging from '@react-native-firebase/messaging';

// @ts-ignore
// import { SENTRY_DSN } from 'react-native-dotenv'

if (!__DEV__) {
  Sentry.init({ dsn: 'SENTRY_DSN', tracesSampleRate: 1.0 })
}
// if (Platform.OS !== 'ios') {
//   messaging().setBackgroundMessageHandler(onRemoteMessage);
// }


AppRegistry.registerComponent('humanity_cash_mobil_33300', () => App)

export default App
