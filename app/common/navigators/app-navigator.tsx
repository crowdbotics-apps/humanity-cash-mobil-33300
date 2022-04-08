/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { useColorScheme } from "react-native"
import {NavigationContainer, DefaultTheme, DarkTheme, useNavigationContainerRef} from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
// import {
//   SplashScreen,
//   TermsConditionsScreen,
// } from "../screens"
// import { navigationRef } from "./navigation-utilities"
import { COLOR } from "../theme"
import React from "react";
import {SplashScreen} from "../screens";
import {OnboardingScreen} from "../screens/onboarding/onboarding-screen";
import {SliderScreen} from "../screens/slider/slider-screen";
import {UserStatusScreen} from "../screens/user-status/user-status-screen";
import {BoatDimensionsScreen} from "../screens/boat-dimensions/boat-dimensions-screen";
import {AreMemberMarinaScreen} from "../screens/are-member-marina/are-member-marina-screen";
import {BillingInformationScreen} from "../screens/billing-information/billing-information-screen";
import {LoginScreen} from "../screens/login/login-screen";
import {ResetPasswordScreen} from "../screens/reset-password/reset-password-screen";
import {CheckEmailScreen} from "../screens/check-email/check-email-screen";
import {SignupScreen} from "../screens/signup/signup-screen";
import {InsuranceRegistrationScreen} from "../screens/insurance-registration/insurance-registration-screen";
import {SetPasswordScreen} from "../screens/set-password/set-password-screen";
import {PrimaryNavigator} from "./primary-navigator";
import {ReservationSlipScreen} from "../screens/reservation/reserve-slip-screen";
import {MessagesScreen} from "../screens/messages/messages-screen";
import {LobbyScreen} from "../../chat/";
import Lobby from "../../chat/screens/lobby"
import Chat from "../../chat/screens/chat"
import Member from "../../chat/screens/member"
import Invite from "../../chat/screens/invite"
import Profile from "../../chat/screens/profile"
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
    splash: undefined
    slider: undefined
    onboarding: undefined
    userStatus: undefined,
    boatDimensions: undefined
    areMemberMarina: undefined
    billingInformation: undefined
    login: undefined
    resetPassword: undefined
    checkEmail: undefined
    signup: undefined
    insuranceRegistration: undefined
    setPassword: undefined
    home: undefined
    reserveSlip: undefined
    messages: undefined
    Lobby: undefined
    Chat: undefined
    Member: undefined
    Profile: undefined
    Invite: undefined
    lobbyScreen: undefined
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
                contentStyle: {backgroundColor: COLOR.PALETTE.background}
            }}
            initialRouteName={"splash"}
        >
            <Stack.Screen name="splash" component={SplashScreen} />

            <Stack.Screen name="login" component={LoginScreen} />
            <Stack.Screen name="resetPassword" component={ResetPasswordScreen} />
            <Stack.Screen name="checkEmail" component={CheckEmailScreen} />
            <Stack.Screen name="signup" component={SignupScreen} />
            <Stack.Screen name="setPassword" component={SetPasswordScreen} />
            <Stack.Screen
              name="home"
              component={PrimaryNavigator}
              options={{
                headerShown: false,
              }}
            />


            {/*<Stack.Screen name="termsAndConditions" component={TermsConditionsScreen} />*/}
        </Stack.Navigator>

    )
}

interface NavigationProps extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

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

