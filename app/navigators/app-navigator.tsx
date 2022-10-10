import { useColorScheme } from "react-native"
import { NavigationContainer, DefaultTheme, DarkTheme, useNavigationContainerRef } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createDrawerNavigator } from '@react-navigation/drawer'
import { COLOR, METRICS } from "../theme"
import React from "react";

import {
  SplashScreen,
  SignupScreen,
  SetupProfileScreen,
  SignupProfileScreen,
  LoginScreen,
  LinkBankScreen,
  HomeScreen,
  ReturnScreen,
  MyProfileScreen,
  CommunityChestScreen,
  LoadWalletScreen,
  DrawerScreen,
  SettingsScreen,
  QRScreen,
  LegalScreen,
  SecurityScreen, 
  HelpContactScreen,
  WhereSpendScreen,
  CashierTransactionScreen,
  MakeReportScreen,
  MyTransactionsScreen,
  CashOutScreen,
  MyCouponsScreen,
  CreateCouponScreen,
  ContactScreen
} from "../screens";

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
  createCoupon: any,
  myCoupons: any
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
      initialRouteName="splash"
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
      <DrawerNav.Screen name="myCoupons" component={MyCouponsScreen} />
      <DrawerNav.Screen name="createCoupon" component={CreateCouponScreen} />
    </DrawerNav.Navigator>
  )
}

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
      <AppStackDrawer />
    </NavigationContainer>
  )
}

AppNavigator.displayName = "AppNavigator"

