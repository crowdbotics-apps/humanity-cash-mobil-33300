/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { View, TouchableOpacity, Image } from 'react-native';
import { Text, Screen } from '../../components';
import Icon from "react-native-vector-icons/MaterialIcons"
import styles from './drawer-style';
import { useNavigation } from "@react-navigation/native"
import { IMAGES, COLOR } from "../../theme"
import { useStores } from "../../models"

const profileTypes = [
  {
    label: 'Personal',
    value: 'personal',
    first_step: 'pic_username'
  },
  {
    label: 'Business',
    value: 'business_personal',
    first_step: 'pic_bname'
  },
]


export const DrawerScreen = observer(function DrawerScreen(props) {
  const navigation = useNavigation()
  const rootStore = useStores()
  const { loginStore } = rootStore

  const drawerRouter = {
    consumer: [
      <TouchableOpacity key={'consumer_1'} onPress={() => props.navigation.navigate("qr", {})} style={styles.MENU_ITEM_CONTAINER}>
        <Image
          resizeMode="contain"
          source={IMAGES.scanToPay}
          style={styles.MENU_ITEM_ICON}
        />
        <Text style={styles.MENU_ITEM_LABEL}>Receive payment / Scan to pay</Text>
      </TouchableOpacity>,
      <TouchableOpacity key={'consumer_2'} onPress={() => props.navigation.navigate("myTransactions", {})} style={styles.MENU_ITEM_CONTAINER}>
        <Image
          resizeMode="contain"
          source={IMAGES.receive_payment}
          style={styles.MENU_ITEM_ICON}
        />
        <Text style={styles.MENU_ITEM_LABEL}>My Transactions</Text>
      </TouchableOpacity>,
      <TouchableOpacity key={'consumer_3'} onPress={() => props.navigation.navigate("loadWallet", {})} style={styles.MENU_ITEM_CONTAINER}>
        <Image
          resizeMode="contain"
          source={IMAGES.load_wallet}
          style={styles.MENU_ITEM_ICON}
        />
        <Text style={styles.MENU_ITEM_LABEL}>Load Wallet</Text>
      </TouchableOpacity>,
      <TouchableOpacity key={'consumer_4'} onPress={() => props.navigation.navigate("cashOut", {})} style={styles.MENU_ITEM_CONTAINER}>
        <Image
          resizeMode="contain"
          source={IMAGES.cash_out}
          style={styles.MENU_ITEM_ICON}
        />
        <Text style={styles.MENU_ITEM_LABEL}>Cash out to USD</Text>
      </TouchableOpacity>,
      <View key={'consumer_line'} style={styles.LINE} />,
      <TouchableOpacity key={'consumer_5'} onPress={() => props.navigation.navigate("whereSpend", {})} style={styles.MENU_ITEM_CONTAINER}>
        <Image
          resizeMode="contain"
          source={IMAGES.where_to_spend}
          style={styles.MENU_ITEM_ICON}
        />
        <Text style={styles.MENU_ITEM_LABEL}>Where to spend</Text>
      </TouchableOpacity>,
      <TouchableOpacity key={'consumer_6'} onPress={() => props.navigation.navigate("communityChest", {})} style={styles.MENU_ITEM_CONTAINER}>
        <Image
          resizeMode="contain"
          source={IMAGES.chest}
          style={styles.MENU_ITEM_ICON}
        />
        <Text style={styles.MENU_ITEM_LABEL}>Community Chest</Text>
      </TouchableOpacity>,
      <TouchableOpacity key={'consumer_7'} style={styles.MENU_ITEM_CONTAINER} onPress={() => props.navigation.navigate("signupProfile", { profile_type: profileTypes[1] })}>
        <Image
          resizeMode="contain"
          source={IMAGES.sign_up_your_business}
          style={styles.MENU_ITEM_ICON}
        />
        <Text style={styles.MENU_ITEM_LABEL}>Sign up your business</Text>
      </TouchableOpacity>,
      <TouchableOpacity key={'consumer_8'} onPress={() => props.navigation.navigate("settings", {})} style={styles.MENU_ITEM_CONTAINER}>
        <Image
          resizeMode="contain"
          source={IMAGES.settings}
          style={styles.MENU_ITEM_ICON}
        />
        <Text style={styles.MENU_ITEM_LABEL}>Settings</Text>
      </TouchableOpacity>,
      <TouchableOpacity key={'consumer_9'} onPress={() => props.navigation.navigate("helpContact", {})} style={styles.MENU_ITEM_CONTAINER} >
        <Image
          resizeMode="contain"
          source={IMAGES.help_and_contact}
          style={styles.MENU_ITEM_ICON}
        />
        <Text style={styles.MENU_ITEM_LABEL}>Help and Contact</Text>
      </TouchableOpacity>,
    ],
    merchant: [
      <TouchableOpacity key={'merchant_1'} onPress={() => props.navigation.navigate("qr", {})} style={styles.MENU_ITEM_CONTAINER}>
        <Image
          resizeMode="contain"
          source={IMAGES.scanToPay}
          style={styles.MENU_ITEM_ICON}
        />
        <Text style={styles.MENU_ITEM_LABEL}>Receive payment / Scan to pay</Text>
      </TouchableOpacity>,
      <TouchableOpacity key={'merchant_2'} onPress={() => props.navigation.navigate("myTransactions", {})} style={styles.MENU_ITEM_CONTAINER}>
        <Image
          resizeMode="contain"
          source={IMAGES.receive_payment}
          style={styles.MENU_ITEM_ICON}
        />
        <Text style={styles.MENU_ITEM_LABEL}>My Transactions</Text>
      </TouchableOpacity>,
      <TouchableOpacity key={'merchant_3'} onPress={() => props.navigation.navigate("loadWallet", {})} style={styles.MENU_ITEM_CONTAINER}>
        <Image
          resizeMode="contain"
          source={IMAGES.load_wallet}
          style={styles.MENU_ITEM_ICON}
        />
        <Text style={styles.MENU_ITEM_LABEL}>Load Wallet</Text>
      </TouchableOpacity>,
      <TouchableOpacity key={'merchant_4'} onPress={() => props.navigation.navigate("cashOut", {})} style={styles.MENU_ITEM_CONTAINER}>
        <Image
          resizeMode="contain"
          source={IMAGES.cash_out}
          style={styles.MENU_ITEM_ICON}
        />
        <Text style={styles.MENU_ITEM_LABEL}>Cash out to USD</Text>
      </TouchableOpacity>,
      <View key={'merchant_line'} style={styles.LINE} />,
      <TouchableOpacity key={'merchant_5'} onPress={() => props.navigation.navigate("whereSpend", {})} style={styles.MENU_ITEM_CONTAINER}>
        <Image
          resizeMode="contain"
          source={IMAGES.where_to_spend}
          style={styles.MENU_ITEM_ICON}
        />
        <Text style={styles.MENU_ITEM_LABEL}>Where to spend</Text>
      </TouchableOpacity>,
      <TouchableOpacity key={'merchant_6'} onPress={() => props.navigation.navigate("communityChest", {})} style={styles.MENU_ITEM_CONTAINER}>
        <Image
          resizeMode="contain"
          source={IMAGES.make_a_report}
          style={styles.MENU_ITEM_ICON}
        />
        <Text style={styles.MENU_ITEM_LABEL}>Make a report</Text>
      </TouchableOpacity>,
      <TouchableOpacity key={'merchant_8'} onPress={() => props.navigation.navigate("settings", {})} style={styles.MENU_ITEM_CONTAINER}>
        <Image
          resizeMode="contain"
          source={IMAGES.settings}
          style={styles.MENU_ITEM_ICON}
        />
        <Text style={styles.MENU_ITEM_LABEL}>Settings</Text>
      </TouchableOpacity>,
      <TouchableOpacity key={'merchant_9'} onPress={() => props.navigation.navigate("helpContact", {})} style={styles.MENU_ITEM_CONTAINER} >
        <Image
          resizeMode="contain"
          source={IMAGES.help_and_contact}
          style={styles.MENU_ITEM_ICON}
        />
        <Text style={styles.MENU_ITEM_LABEL}>Help and Contact</Text>
      </TouchableOpacity>,
    ]
  }

  const [ChangeAccountOpen, setChangeAccountOpen] = useState(false)
  const randomImages = [IMAGES.avBass, IMAGES.avBee, IMAGES.avBird, IMAGES.avSalamander]

  useEffect(() => {
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
      headerStyle={[styles.HEADER, { backgroundColor: loginStore.getSelectedAccount === 'consumer' ? COLOR.PALETTE.background : loginStore.getAccountColor }]}
    >
      {console.log(' ====>>> ', JSON.stringify(loginStore.ProfileDataBusiness.id, null, 2))}
      <View style={[styles.ROOT, { backgroundColor: loginStore.getSelectedAccount === 'consumer' ? COLOR.PALETTE.background : loginStore.getAccountColor }]}>
        <View style={styles.HEADER}>
          <TouchableOpacity onPress={() => props.navigation.closeDrawer()} style={styles.BACK_BUTON_CONTAINER}>
            <Icon name={"close"} size={23} color={COLOR.PALETTE.black} />
            <Text style={[styles.BACK_BUTON_LABEL, { color: COLOR.PALETTE.black }]}>{` Menu`}</Text>
          </TouchableOpacity>
          {ChangeAccountOpen
            ? [
              <TouchableOpacity
                key={'consumer_profile'}
                style={styles.USER_CONTAINER_CHANGE}
                onPress={() => [
                  loginStore.setSelectedAccount('consumer'),
                  props.navigation.navigate("home"),
                  props.navigation.closeDrawer(),
                  setChangeAccountOpen(false)
                ]}
              >
                <View style={styles.USER_IMAGE_CONTAINER}>
                  <Image
                    resizeMode="cover"
                    source={loginStore.ProfileData.profile_picture ? { uri: loginStore.ProfileData.profile_picture } :
                      randomImages[loginStore.getRandomProfilePictureIndex]}
                    style={styles.USER_IMAGE}
                  />
                </View>
                <View style={styles.SWITCH_ACCOUNT_CONTAINER}>
                  <Text style={styles.USER_NAME}>{loginStore.getUserName}</Text>
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
                  props.navigation.navigate("home"),
                  props.navigation.closeDrawer(),
                  setChangeAccountOpen(false)
                ]}
              >
                <View style={styles.USER_IMAGE_CONTAINER}>
                  <Image
                    resizeMode="cover"
                    source={loginStore.ProfileDataBusiness.profile_picture_merchant ? { uri: loginStore.ProfileDataBusiness.profile_picture_merchant } :
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
              </TouchableOpacity>,
              <TouchableOpacity
                key={'cashier_profile'}
                style={[
                  styles.USER_CONTAINER_CHANGE,
                  {
                    display: loginStore.getSelectedAccount === 'merchant'
                      ? 'flex'
                      : 'none'
                  }
                ]}
                onPress={() => [
                  loginStore.setSelectedAccount('cashier'),
                  props.navigation.navigate("home"),
                  props.navigation.closeDrawer(),
                  setChangeAccountOpen(false)
                ]}
              >
                <View style={styles.USER_IMAGE_CONTAINER}>
                  <Image
                    resizeMode="cover"
                    source={loginStore.ProfileDataBusiness.profile_picture_merchant ? { uri: loginStore.ProfileDataBusiness.profile_picture_merchant } :
                      randomImages[4 - loginStore.getRandomProfilePictureIndex]}
                    style={styles.USER_IMAGE}
                  />
                </View>
                <View style={styles.SWITCH_ACCOUNT_CONTAINER}>
                  <Text style={styles.USER_NAME}>Cashier</Text>
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
                    source={loginStore.ProfileData.profile_picture ? { uri: loginStore.ProfileData.profile_picture } :
                      randomImages[loginStore.getRandomProfilePictureIndex]}
                    style={styles.USER_IMAGE}
                  />
                </View>
                <View style={styles.SWITCH_ACCOUNT_CONTAINER}>
                  <Text style={styles.USER_NAME_BLACK}>{loginStore.getUserName}</Text>
                  {loginStore.ProfileDataBusiness.id &&
                    <TouchableOpacity onPress={() => setChangeAccountOpen(!ChangeAccountOpen)}>
                      <Text style={styles.SWITCH_ACCOUNT_LABEL_BLUE}>Switch account</Text>
                    </TouchableOpacity>
                  }
                </View>
              </View>
              : <View style={styles.USER_CONTAINER}>
                <View style={styles.USER_IMAGE_CONTAINER}>
                  <Image
                    resizeMode="cover"
                    source={loginStore.ProfileDataBusiness.profile_picture_merchant ? { uri: loginStore.ProfileDataBusiness.profile_picture_merchant } :
                      randomImages[4 - loginStore.getRandomProfilePictureIndex]}
                    style={styles.USER_IMAGE}
                  />
                </View>
                <View style={styles.SWITCH_ACCOUNT_CONTAINER}>
                  <Text style={styles.USER_NAME_BLACK}>{loginStore.ProfileDataBusiness.business_name}</Text>
                  <TouchableOpacity onPress={() => setChangeAccountOpen(!ChangeAccountOpen)}>
                    <Text style={styles.SWITCH_ACCOUNT_LABEL_BLUE}>Switch account</Text>
                  </TouchableOpacity>
                </View>
              </View>
          }
          <Text style={styles.TOTAL_CURRENCY}>C$ 0</Text>

          {drawerRouter[loginStore.getSelectedAccount]}

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
