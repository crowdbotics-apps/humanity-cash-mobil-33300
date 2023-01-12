/**
 * This is the navigator you will modify to display the logged-in screens of your app.
 * You can use RootNavigator to also display an auth flow or other user flows.
 *
 * You'll likely spend most of your time in this file.
 */
import * as React from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import {
//   HomeScreen,
//   AddScreen,
//   BalancesScreen,
//   P2PScreen,
//   SettingsScreen,
// } from '../screens';
import { COLOR } from '../theme';
import {Platform, Text, TextStyle, View, ViewStyle} from 'react-native';
import {Icon} from "../components";
import {FilesScreen} from "../screens/files/files-screen";
import {HomeScreen} from "../screens/home/home-screen";

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
export type PrimaryParamList = {
    splash: undefined
}

// Documentation: https://github.com/software-mansion/react-native-screens/tree/master/native-stack
const Tab = createBottomTabNavigator<PrimaryParamList>();
//
// const CIRCULO_MENU: ViewStyle = {
//   position: 'absolute',
//   bottom: 10,
//   width: 60,
//   height: 60,
//   backgroundColor: 'white',
//   borderRadius: 30,
//   alignItems: 'center',
//   justifyContent: 'center',
//   shadowColor: '#000',
//   shadowOffset: {width: 0, height: 2},
//   shadowOpacity: 0.8,
//   shadowRadius: 2,
//   elevation: 5,
// };
//
// const LABEL_STYLE: TextStyle = {
//   fontSize: 12,
//   fontFamily: 'AvenirLTStd-Roman',
//   marginTop: 5,
// };
//
// const ITEM_CONTAINER: ViewStyle = {
//   borderBottomWidth: 2, flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',
// };
const TAB_ICON_SIZE = 25

export function PrimaryNavigator() {
  return (
    <Tab.Navigator
      initialRouteName={'splash'}
      sceneContainerStyle={{backgroundColor: COLOR.PALETTE.white}}
      screenOptions={{
        tabBarInactiveTintColor: COLOR.PALETTE.marina_light,
        tabBarActiveTintColor: COLOR.PALETTE.white,
        tabBarActiveBackgroundColor: COLOR.PALETTE.white,
        tabBarInactiveBackgroundColor: COLOR.PALETTE.white,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
            backgroundColor: COLOR.PALETTE.marina_dark,
            minHeight: Platform.OS === 'ios' ? 100 : 85,
          borderTopEndRadius: 20,
          borderTopStartRadius: 20 ,
          // borderWidth: 1,
          // borderTopWidth: 1,
          // borderTopColor: '#c4c4c4',
          // borderColor: '#c4c4c4',
          // elevation: 0,
          // borderBottomWidth: 0
        },

        tabBarItemStyle: {backgroundColor: 'transparent'},
      }}
    >


      <Tab.Screen
        name="Home"
        component={HomeScreen}

        options={{
          tabBarIcon: ({color}) => {
            return (
                <Icon icon={ color === COLOR.PALETTE.marina_light ? 'map' : 'mapActive'} style={{width: TAB_ICON_SIZE}} />
            );
          }
        }}
      />

        <Tab.Screen
            name="Files"
            component={FilesScreen}
            options={{
                tabBarIcon: ({color}) => {
                    return (
                        <Icon icon={ color === COLOR.PALETTE.marina_light ? 'file' : 'fileActive'}
                              style={{width: TAB_ICON_SIZE}} />
                    );
                },
            }}
        />
    </Tab.Navigator>
  );
}

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 *
 * `canExit` is used in ./app/app.tsx in the `useBackButtonHandler` hook.
 */
const exitRoutes = ['home'];
export const canExit = (routeName: string) => exitRoutes.includes(routeName);
