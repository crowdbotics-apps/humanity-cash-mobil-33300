import React, { useEffect, useState } from "react"
import { Text, TouchableOpacity, TextInput, ActivityIndicator, View, Image, Modal } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import styles from "./styles"
import { IMAGES, COLOR } from "../../theme"
import { useNavigation } from "@react-navigation/native";

import QRCodeScanner from 'react-native-qrcode-scanner';
import QRCode from 'react-native-qrcode-svg'

import { CustomSwitch } from '../../components'

type ButtonProps = {
  onPress?: any
  buttonStyle?: any
  buttonLabelStyle?: any
  buttonLabel?: string | ''
  buttonLabelPre?: any
  buttonLabelPos?: any
  disabled?: boolean | false
  loading?: boolean | false
  showBottonMenu?: boolean | false
  hideButton?: boolean | false
  accountType?: string | 'consumer'
}


export function Button(props: ButtonProps) {
  const navigation = useNavigation()

  const BottomMenu = () => <View key={"key-for-array"} style={styles.ICONS_CONTAINER}>
    <TouchableOpacity onPress={() => navigation.navigate("home", {})}>
      <Image
        source={IMAGES.menu_home_inactive}
        style={styles.BOTTON_MENU_ICON_HOME}
      />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate("loadWallet", {})}>
      <Image
        source={IMAGES.menu_load_wallet_inactive}
        style={styles.BOTTON_MENU_ICON_WALLET}
      />
    </TouchableOpacity>
    <TouchableOpacity style={props.accountType === 'merchant' ? styles.QR_BUTTON_MERCHANT : styles.QR_BUTTON} onPress={() => navigation.navigate("qr", {})}>
      <Icon key={'button_adornment'} name={"qr-code-2"} size={35} color={'white'} style={{ marginBottom: 3 }} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate("whereSpend", {})}>
      <Image
        resizeMode="contain"
        source={IMAGES.menu_where_spend_inactive}
        style={styles.BOTTON_MENU_ICON_SPEND}
      />
    </TouchableOpacity>
    <TouchableOpacity>
      <Image
        source={IMAGES.menu_address_inactive}
        style={styles.BOTTON_MENU_ICON_ADDRESS}
      />
    </TouchableOpacity>
  </View>


  return (
    <View style={styles.CONTAINER}>
      {!props.hideButton &&
        <TouchableOpacity disabled={props.disabled} style={[styles.BUTTON, props.buttonStyle]}
          onPress={props.onPress}
        >
          {props.loading
            ? <ActivityIndicator size="small" color={'black'} />
            : [
              props.buttonLabelPre && props.buttonLabelPre,
              <Text key={'button_label'} style={[styles.BUTTON_LABEL, props.buttonLabelStyle]}>{props.buttonLabel}</Text>,
              props.buttonLabelPos && props.buttonLabelPos,
            ]
          }
        </TouchableOpacity>
      }
      {props.showBottonMenu && [
        <Image
          key='button_img'
          resizeMode='contain'
          source={props.accountType === 'merchant' ? IMAGES.menu_merchant : IMAGES.menu_consumer}
          style={styles.BOTTON_MENU}
        />,
        BottomMenu()
      ]}
    </View>
  )
}
