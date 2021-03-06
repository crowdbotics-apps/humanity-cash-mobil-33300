import React, {useEffect, useState} from 'react';
import { observer } from 'mobx-react-lite';
import { View, TouchableOpacity, Image } from 'react-native';
import { Text, Screen } from '../../components';
import Icon from "react-native-vector-icons/MaterialIcons"
import styles from './drawer-style';
import { useNavigation } from "@react-navigation/native"
import { IMAGES } from "../../theme"
import { useStores } from "../../models"

export const DrawerScreen = observer(function DrawerScreen(props) {
  const navigation = useNavigation()
  const rootStore = useStores()
  const { loginStore } = rootStore

  const [ChangeAccountOpen, setChangeAccountOpen] = useState(false)
  const randomImages = [IMAGES.avBass, IMAGES.avBee, IMAGES.avBird, IMAGES.avSalamander]

  useEffect( () => {
    if (!loginStore.getRandomProfilePictureIndex) {
      loginStore.setRandomProfilePictureIndex(Math.round(Math.random() * 3))
    }
  }, [])

  return (
    <Screen
      showHeader
      preset="scroll"
      statusBar={'dark-content'}
      unsafe={true}
      headerStyle={styles.HEADER}
    >
      <View style={styles.ROOT}>
        <View style={styles.HEADER}>
          <TouchableOpacity onPress={() => props.navigation.closeDrawer()} style={styles.BACK_BUTON_CONTAINER}>
            <Icon name={"close"} size={23} color={loginStore.getAccountColor} />
            <Text style={[styles.BACK_BUTON_LABEL, { color: loginStore.getAccountColor }]}>{` Menu`}</Text>
          </TouchableOpacity>
          {ChangeAccountOpen
            ? [
              <TouchableOpacity
                key={'consumer_profile'}
                style={styles.USER_CONTAINER_CHANGE}
                onPress={() => [
                  loginStore.setSelectedAccount('consumer'),
                  props.navigation.closeDrawer(),
                  setChangeAccountOpen(false)
                ]}
              >
                <View style={styles.USER_IMAGE_CONTAINER}>
                  <Image
                    resizeMode="cover"
                    source={loginStore.ProfileData.profile_picture? { uri: loginStore.ProfileData.profile_picture } :
                      randomImages[loginStore.getRandomProfilePictureIndex]}
                    style={styles.USER_IMAGE}
                  />
                </View>
                <View style={styles.SWITCH_ACCOUNT_CONTAINER}>
                  <Text style={styles.USER_NAME}>{loginStore.ProfileData.first_name + ' ' + loginStore.ProfileData.last_name}</Text>
                  <View>
                    <Text style={[styles.SWITCH_ACCOUNT_LABEL, { color: loginStore.getAccountColor }]}>Switch account</Text>
                  </View>
                </View>
              </TouchableOpacity>,
              <TouchableOpacity
                key={'merchant_profile'}
                style={styles.USER_CONTAINER_CHANGE}
                onPress={() => [
                  loginStore.setSelectedAccount('merchant'),
                  props.navigation.closeDrawer(),
                  setChangeAccountOpen(false)
                ]}
              >
                <View style={styles.USER_IMAGE_CONTAINER}>
                  <Image
                    resizeMode="cover"
                    source={loginStore.ProfileDataBusiness.profile_picture_merchant? { uri: loginStore.ProfileDataBusiness.profile_picture_merchant } :
                      randomImages[4 - loginStore.getRandomProfilePictureIndex]}
                    style={styles.USER_IMAGE}
                  />
                </View>
                <View style={styles.SWITCH_ACCOUNT_CONTAINER}>
                  <Text style={styles.USER_NAME}>{loginStore.ProfileDataBusiness.business_name}</Text>
                  <View>
                    <Text style={styles.SWITCH_ACCOUNT_LABEL}></Text>
                  </View>
                </View>
              </TouchableOpacity>
            ]
            : loginStore.getSelectedAccount === 'consumer'
              ? <View style={styles.USER_CONTAINER}>
                <View style={styles.USER_IMAGE_CONTAINER}>
                  <Image
                    resizeMode="cover"
                    source={loginStore.ProfileData.profile_picture? { uri: loginStore.ProfileData.profile_picture } :
                      randomImages[loginStore.getRandomProfilePictureIndex]}
                    style={styles.USER_IMAGE}
                  />
                </View>
                <View style={styles.SWITCH_ACCOUNT_CONTAINER}>
                  <Text style={styles.USER_NAME_BLACK}>{loginStore.ProfileData.first_name + ' ' + loginStore.ProfileData.last_name}</Text>
                  <TouchableOpacity onPress={() => setChangeAccountOpen(!ChangeAccountOpen)}>
                    <Text style={[styles.SWITCH_ACCOUNT_LABEL_BLUE, { color: loginStore.getAccountColor }]}>Switch account</Text>
                  </TouchableOpacity>
                </View>
              </View>
              : <View style={styles.USER_CONTAINER}>
                <View style={styles.USER_IMAGE_CONTAINER}>
                  <Image
                    resizeMode="cover"
                    source={loginStore.ProfileDataBusiness.profile_picture_merchant? { uri: loginStore.ProfileDataBusiness.profile_picture_merchant } :
                      randomImages[4 - loginStore.getRandomProfilePictureIndex]}
                    style={styles.USER_IMAGE}
                  />
                </View>
                <View style={styles.SWITCH_ACCOUNT_CONTAINER}>
                  <Text style={styles.USER_NAME_BLACK}>{loginStore.ProfileDataBusiness.business_name}</Text>
                  <TouchableOpacity onPress={() => setChangeAccountOpen(!ChangeAccountOpen)}>
                    <Text style={[styles.SWITCH_ACCOUNT_LABEL_BLUE, { color: loginStore.getAccountColor }]}>Switch account</Text>
                  </TouchableOpacity>
                </View>
              </View>
          }
          <Text style={styles.TOTAL_CURRENCY}>C$ 0</Text>

          <TouchableOpacity onPress={() => props.navigation.navigate("qr", {})} style={styles.MENU_ITEM_CONTAINER}>
            <Image
              resizeMode="contain"
              source={IMAGES.scanToPay}
              style={styles.MENU_ITEM_ICON}
            />
            <Text style={styles.MENU_ITEM_LABEL}>Receive payment / Scan to pay</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => props.navigation.navigate("return", {})} style={styles.MENU_ITEM_CONTAINER}>
            <Image
              resizeMode="contain"
              source={IMAGES.receive_payment}
              style={styles.MENU_ITEM_ICON}
            />
            <Text style={styles.MENU_ITEM_LABEL}>My Transactions</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => props.navigation.navigate("loadWallet", {})} style={styles.MENU_ITEM_CONTAINER}>
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

          <TouchableOpacity onPress={() => props.navigation.navigate("whereSpend", {})} style={styles.MENU_ITEM_CONTAINER}>
            <Image
              resizeMode="contain"
              source={IMAGES.where_to_spend}
              style={styles.MENU_ITEM_ICON}
            />
            <Text style={styles.MENU_ITEM_LABEL}>Where to spend</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => props.navigation.navigate("communityChest", {})} style={styles.MENU_ITEM_CONTAINER}>
            <Image
              resizeMode="contain"
              source={IMAGES.chest}
              style={styles.MENU_ITEM_ICON}
            />
            <Text style={styles.MENU_ITEM_LABEL}>Community Chest</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.MENU_ITEM_CONTAINER} onPress={() => props.navigation.navigate("setupProfile", {})}>
            <Image
              resizeMode="contain"
              source={IMAGES.sign_up_your_business}
              style={styles.MENU_ITEM_ICON}
            />
            <Text style={styles.MENU_ITEM_LABEL}>Sign up your business</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => props.navigation.navigate("settings", {})} style={styles.MENU_ITEM_CONTAINER}>
            <Image
              resizeMode="contain"
              source={IMAGES.settings}
              style={styles.MENU_ITEM_ICON}
            />
            <Text style={styles.MENU_ITEM_LABEL}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => props.navigation.navigate("helpContact", {})} style={styles.MENU_ITEM_CONTAINER} >
            <Image
              resizeMode="contain"
              source={IMAGES.help_and_contact}
              style={styles.MENU_ITEM_ICON}
            />
            <Text style={styles.MENU_ITEM_LABEL}>Help and Contact</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.SIGN_OUT_CONTAINER}>
          <TouchableOpacity onPress={() => [loginStore.reset(), props.navigation.navigate("login", {})]} style={styles.MENU_ITEM_CONTAINER}>
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
