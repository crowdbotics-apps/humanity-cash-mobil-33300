/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { useColorScheme } from "react-native"
import { NavigationContainer, DefaultTheme, DarkTheme, useNavigationContainerRef } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
// import {
//   SplashScreen,
//   TermsConditionsScreen,
// } from "../screens"
// import { navigationRef } from "./navigation-utilities"
import { COLOR } from "../theme"
import React from "react";

import { SplashScreen } from "../screens";
import { SignupScreen } from "../screens/signup/signup-screen";
import { SetupProfileScreen } from "../screens/setup-profile/setup-profile-screen";
import { LoginScreen } from "../screens/login/login-screen";
import { LinkBankScreen } from "../screens/link-bank/link-bank-screen";
import { HomeScreen } from "../screens/home/home-screen";
import { ReturnScreen } from "../screens/return/return-screen";

import { ResetPasswordScreen } from "../screens/reset-password/reset-password-screen";
import { CheckEmailScreen } from "../screens/check-email/check-email-screen";
import { PrimaryNavigator } from "./primary-navigator";
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
}

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<NavigatorParamList>()


const defaultHeaderOptions = {
	headerStyle: {
		backgroundColor: '#742ddd',
	},
	headerTintColor: '#fff',
};



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
			<AppStack />
		</NavigationContainer>
	)
}

AppNavigator.displayName = "AppNavigator"

