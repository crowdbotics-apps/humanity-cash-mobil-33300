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
import { LoginScreen } from "../screens/login/login-screen";
import { LinkBankScreen } from "../screens/link-bank/link-bank-screen";
import { HomeScreen } from "../screens/home/home-screen";
import { ReturnScreen } from "../screens/return/return-screen";
import { MyProfileScreen } from "../screens/my-profile/my-profile-screen";
import { CommunityChestScreen } from "../screens/community-chest/community-chest-screen";
import { LoadWalletScreen } from "../screens/load-wallet/load-wallet-screen";
import { DrawerScreen } from "../screens/drawer/drawer-screen";
import { SettingsScreen } from "../screens/settings/settings-screen";
import { LegalScreen } from "../screens/legal/legal-screen";
import { SecurityScreen } from "../screens/security/security-screen";
import { HelpContactScreen } from "../screens/help-contact/help-contact-screen";
import { WhereSpendScreen } from "../screens/where-spend/where-spend-screen";

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
}

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<NavigatorParamList>()
const Drawer = createDrawerNavigator<NavigatorParamList>();


const AppStackDrawer = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: METRICS.screenWidth * 0.9,
        },
      }}
      initialRouteName="splash"
      drawerContent={(props) => <DrawerScreen {...props} />}
    >
      <Drawer.Screen  name="splash" component={SplashScreen} />
      <Drawer.Screen name="signup" component={SignupScreen} />
      <Drawer.Screen name="setupProfile" component={SetupProfileScreen} />

      <Drawer.Screen name="login" component={LoginScreen} />
      <Drawer.Screen name="home" component={HomeScreen} />
      <Drawer.Screen name="return" component={ReturnScreen} />
      <Drawer.Screen name="linkBank" component={LinkBankScreen} />
      <Drawer.Screen name="loadWallet" component={LoadWalletScreen} />
      <Drawer.Screen name="myProfile" component={MyProfileScreen} />
      <Drawer.Screen name="communityChest" component={CommunityChestScreen} />
      <Drawer.Screen name="settings" component={SettingsScreen} />
      <Drawer.Screen name="helpContact" component={HelpContactScreen} />
      <Drawer.Screen name="security" component={SecurityScreen} />
      <Drawer.Screen name="legal" component={LegalScreen} />
      <Drawer.Screen name="whereSpend" component={WhereSpendScreen} />
      {/* <Drawer.Screen name="drawer" component={DrawerScreen} /> */}

    </Drawer.Navigator>

  )
}

const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLOR.PALETTE.background }
      }}
      initialRouteName={"splash"}
    >
      <Stack.Screen name="splash" component={SplashScreen} />
      <Stack.Screen name="signup" component={SignupScreen} />
      <Stack.Screen name="setupProfile" component={SetupProfileScreen} />

      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="home" component={HomeScreen} />
      <Stack.Screen name="return" component={ReturnScreen} />
      <Stack.Screen name="linkBank" component={LinkBankScreen} />
    </Stack.Navigator>

  )
}

interface NavigationProps extends Partial<React.ComponentProps<typeof NavigationContainer>> { }

export const AppNavigator = (props: NavigationProps) => {
  const colorScheme = useColorScheme()
  const navigationRef = useNavigationContainerRef()
  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      {/* <AppStack /> */}
      <AppStackDrawer />
    </NavigationContainer>
  )
}

AppNavigator.displayName = "AppNavigator"

