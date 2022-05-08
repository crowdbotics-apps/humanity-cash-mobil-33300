import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { TextInput, View, TouchableOpacity, Image } from 'react-native';
import {
  Text,
  Button,
  Screen,
  Checkbox
} from '../../components';
import Icon from "react-native-vector-icons/MaterialIcons"
import Entypo from "react-native-vector-icons/Entypo"
import Ionicons from "react-native-vector-icons/Ionicons"
import styles from './drawer-style';
import { COLOR, TYPOGRAPHY } from '../../theme';
import { useNavigation } from "@react-navigation/native"
import { IMAGES } from "../../theme"
import { useStores } from "../../models"

export const DrawerScreen = observer(function DrawerScreen(props) {
  const navigation = useNavigation()
  const rootStore = useStores()
  const { loginStore } = rootStore

  React.useEffect(() => {
    console.log('props ===>>> ', props)
  })

  return (
    <Screen
      // preset='scroll'
      preset="fixed"
      statusBar={'dark-content'}
      unsafe={true}
    >
      <View style={styles.ROOT}>
        <View>
          <TouchableOpacity onPress={() => props.navigation.closeDrawer()} style={styles.BACK_BUTON_CONTAINER}>
            <Icon name={"close"} size={23} color={COLOR.PALETTE.blue} />
            <Text style={styles.BACK_BUTON_LABEL}>{` Menu`}</Text>
          </TouchableOpacity>
     
          <View style={styles.USER_CONTAINER}>
            <View style={styles.USER_IMAGE_CONTAINER}>
              <Image
                resizeMode="contain"
                source={IMAGES.avBee}
                style={styles.USER_IMAGE}
              />
            </View>
            <View style={styles.SWITCH_ACCOUNT_CONTAINER}>
              <Text style={styles.USER_NAME}>Dagmar van Eijk</Text>
              <TouchableOpacity>
              <Text style={styles.SWITCH_ACCOUNT_LABEL}>Switch account</Text>
              </TouchableOpacity>
            </View>
          </View>
        <Text style={styles.TOTAL_CURRENCY}>C$ 382.91</Text>

          <TouchableOpacity style={styles.MENU_ITEM_CONTAINER}>
            <Image
              resizeMode="contain"
              source={IMAGES.scanToPay}
              style={styles.MENU_ITEM_ICON}
            />
            <Text style={styles.MENU_ITEM_LABEL}>Scan to pay</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.MENU_ITEM_CONTAINER}>
            <Image
              resizeMode="contain"
              source={IMAGES.receive_payment}
              style={styles.MENU_ITEM_ICON}
            />
            <Text style={styles.MENU_ITEM_LABEL}>Receive payment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.MENU_ITEM_CONTAINER}>
            <Image
              resizeMode="contain"
              source={IMAGES.load_wallet}
              style={styles.MENU_ITEM_ICON}
            />
            <Text style={styles.MENU_ITEM_LABEL}>Load Wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.MENU_ITEM_CONTAINER}>
            <Image
              resizeMode="contain"
              source={IMAGES.cash_out}
              style={styles.MENU_ITEM_ICON}
            />
            <Text style={styles.MENU_ITEM_LABEL}>Cash out to USD</Text>
          </TouchableOpacity>

          {/* LINE */}
          <View style={styles.LINE} />

          <TouchableOpacity style={styles.MENU_ITEM_CONTAINER}>
            <Image
              resizeMode="contain"
              source={IMAGES.where_to_spend}
              style={styles.MENU_ITEM_ICON}
            />
            <Text style={styles.MENU_ITEM_LABEL}>Where to spend</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.MENU_ITEM_CONTAINER}>
            <Image
              resizeMode="contain"
              source={IMAGES.chest}
              style={styles.MENU_ITEM_ICON}
            />
            <Text style={styles.MENU_ITEM_LABEL}>Community Chest</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.MENU_ITEM_CONTAINER}>
            <Image
              resizeMode="contain"
              source={IMAGES.sign_up_your_business}
              style={styles.MENU_ITEM_ICON}
            />
            <Text style={styles.MENU_ITEM_LABEL}>Sign up your business</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.MENU_ITEM_CONTAINER}>
            <Image
              resizeMode="contain"
              source={IMAGES.settings}
              style={styles.MENU_ITEM_ICON}
            />
            <Text style={styles.MENU_ITEM_LABEL}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.MENU_ITEM_CONTAINER}>
            <Image
              resizeMode="contain"
              source={IMAGES.help_and_contact}
              style={styles.MENU_ITEM_ICON}
            />
            <Text style={styles.MENU_ITEM_LABEL}>Help and Contact</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.SIGN_OUT_CONTAINER}>
          <TouchableOpacity style={styles.MENU_ITEM_CONTAINER}>
          <Image
            resizeMode="contain"
            source={IMAGES.logout}
            style={styles.MENU_ITEM_ICON}
          />
          <Text style={styles.SIGN_OUT}>Sign out</Text>
          </TouchableOpacity>
        </View>

      </View>


    </Screen>
  )
})
