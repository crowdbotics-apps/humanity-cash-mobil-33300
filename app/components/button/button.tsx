import React, { useEffect, useState } from "react"
import { Text, TouchableOpacity, ActivityIndicator, View, Image } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import styles from "./styles"
import { IMAGES } from "../../theme"
import { useNavigation } from "@react-navigation/native";

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
}


export function Button(props: ButtonProps) {
  const navigation = useNavigation()
  // const [SelectedValue, setSelectedValue] = useState(null)

  // useEffect(() => {
  //   if (props.value === null) {
  //     setSelectedValue(null)
  //   }
  // }, [props.value])

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
          resizeMode='contain'
          source={IMAGES.menu_consumer}
          style={styles.BOTTON_MENU}
        />,
        <View style={styles.ICONS_CONTAINER}>
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
          <TouchableOpacity style={styles.QR_BUTTON}>
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
      ]}
    </View>
  )
}
