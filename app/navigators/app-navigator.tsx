/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { useColorScheme } from "react-native"
import { NavigationContainer, DefaultTheme, DarkTheme, useNavigationContainerRef } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createDrawerNavigator } from '@react-navigation/drawer'
// import {
//   SplashScreen,
//   TermsConditionsScreen,
// } from "../screens"
// import { navigationRef } from "./navigation-utilities"
import { COLOR, METRICS } from "../theme"
import React from "react";

import { SplashScreen } from "../screens";
import { SignupScreen } from "../screens/signup/signup-screen";
import { SetupProfileScreen } from "../screens/setup-profile/setup-profile-screen";
import { SignupProfileScreen } from "../screens/signup-profile/signup-profile-screen";
import { LoginScreen } from "../screens/login/login-screen";
import { LinkBankScreen } from "../screens/link-bank/link-bank-screen";
import { HomeScreen } from "../screens/home/home-screen";
import { ReturnScreen } from "../screens/return/return-screen";
import { MyProfileScreen } from "../screens/my-profile/my-profile-screen";
import { CommunityChestScreen } from "../screens/community-chest/community-chest-screen";
import { LoadWalletScreen } from "../screens/load-wallet/load-wallet-screen";
import { DrawerScreen } from "../screens/drawer/drawer-screen";
import { SettingsScreen } from "../screens/settings/settings-screen";
import { QRScreen } from "../screens/qr-scan-generate/qr-screen";
import { LegalScreen } from "../screens/legal/legal-screen";
import { SecurityScreen } from "../screens/security/security-screen";
import { HelpContactScreen } from "../screens/help-contact/help-contact-screen";
import { WhereSpendScreen } from "../screens/where-spend/where-spend-screen";
import { CashierTransactionScreen } from "../screens/cashier-transaction/cashier-transaction-screen";
import { MakeReportScreen } from "../screens/make-report/make-report-screen";
import { MyTransactionsScreen } from "../screens/my-transactions/my-transactions-screen";
import { CashOutScreen } from "../screens/cash-out/cash-out-screen" 
import { ContactScreen } from "../screens/contact/contact-screen" 

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 */
export type NavigatorParamList = {
  splash: any
  signup: any
  setupProfile: any
  login: any
  home: any
  linkBank: any
  return: any
  drawer: any
  myProfile: any
  communityChest: any
  loadWallet: any
  settings: any
  legal: any
  security: any
  helpContact: any
  whereSpend: any
  qr: any
  cashierTransaction: any
  makeReport: any
  signupProfile: any
  myTransactions: any
  cashOut: any
  contact: any
}

const DrawerNav = createDrawerNavigator<NavigatorParamList>();

const AppStackDrawer: React.FC = () => {
  return (
    <DrawerNav.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: METRICS.screenWidth * 0.9,
        },
      }}
      // initialRouteName="splash"
      initialRouteName="home"
      drawerContent={(props) => <DrawerScreen {...props} />}
    >
      <DrawerNav.Screen name="splash" component={SplashScreen} />
      <DrawerNav.Screen name="signup" component={SignupScreen} />
      <DrawerNav.Screen name="setupProfile" component={SetupProfileScreen} />
      <DrawerNav.Screen name="signupProfile" component={SignupProfileScreen} />
      <DrawerNav.Screen name="login" component={LoginScreen} />
      <DrawerNav.Screen name="home" component={HomeScreen} />
      <DrawerNav.Screen name="return" component={ReturnScreen} />
      <DrawerNav.Screen name="linkBank" component={LinkBankScreen} />
      <DrawerNav.Screen name="loadWallet" component={LoadWalletScreen} />
      <DrawerNav.Screen name="myProfile" component={MyProfileScreen} />
      <DrawerNav.Screen name="communityChest" component={CommunityChestScreen} />
      <DrawerNav.Screen name="settings" component={SettingsScreen} />
      <DrawerNav.Screen name="helpContact" component={HelpContactScreen} />
      <DrawerNav.Screen name="security" component={SecurityScreen} />
      <DrawerNav.Screen name="legal" component={LegalScreen} />
      <DrawerNav.Screen name="whereSpend" component={WhereSpendScreen} />
      <DrawerNav.Screen name="qr" component={QRScreen} />
      <DrawerNav.Screen name="makeReport" component={MakeReportScreen} />
      <DrawerNav.Screen name="cashierTransaction" component={CashierTransactionScreen} />
      <DrawerNav.Screen name="myTransactions" component={MyTransactionsScreen} />
      <DrawerNav.Screen name="cashOut" component={CashOutScreen} />
      <DrawerNav.Screen name="contact" component={ContactScreen} />
      {/* <DrawerNav.Screen name="drawer" component={DrawerScreen} /> */}

    </DrawerNav.Navigator>

  )
}

interface NavigationProps extends Partial<React.ComponentProps<typeof NavigationContainer>> { }

// -- old
// export const AppNavigator = (props: NavigationProps) => {
//   const colorScheme = useColorScheme()
//   const navigationRef = useNavigationContainerRef()
//   return (
//     <NavigationContainer
//       ref={navigationRef}
//       theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
//       {...props}
//     >
//       {/* <AppStack /> */}
//       <AppStackDrawer />
//     </NavigationContainer>
//   )
// }

// -- new
export const AppNavigator = () => {
  const ref = React.useRef<any>();
  return (
    <NavigationContainer
      ref={ref}
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: "transparent",
        },
      }}
    >
      {/* <AppStack /> */}
      <AppStackDrawer />
    </NavigationContainer>
  )
}

AppNavigator.displayName = "AppNavigator"

