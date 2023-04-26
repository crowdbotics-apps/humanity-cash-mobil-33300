/* eslint-disable prefer-const */
import { observer } from "mobx-react-lite"
import { useNavigation, useIsFocused } from "@react-navigation/native"
import React, {useEffect, useState} from "react"
import { Button, Screen, Text} from "../../components"
import {
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  KeyboardAvoidingView,
  Image,
  ScrollView
} from "react-native"
import { COLOR, IMAGES, METRICS } from "../../theme"
import styles from "./contact-style"
import Icon from "react-native-vector-icons/MaterialIcons"
import { useStores } from "../../models"
import {Tab} from "react-native-elements"
import { runInAction } from "mobx"
import { notifyMessage } from "../../utils/helpers"

const randomImages = [IMAGES.avBass, IMAGES.avBee, IMAGES.avBird, IMAGES.avSalamander]

export const ContactScreen = observer(function ContactScreen() {
  const navigation = useNavigation()
  const rootStore = useStores()
  const { loginStore } = rootStore
  const isFocused = useIsFocused()

  const [ShowIndex, setShowIndex] = useState(true)

  const [Search, setSearch] = useState("")
  const [TabIndex, setTabIndex] = React.useState(0)

  const ContactList = ({ data }) => {
    return data.map((i, key2) => (
      <TouchableOpacity
        key={key2 + "_values"}
        style={styles.RETURN_ITEM}
        onPress={() => navigation.navigate("qr", {
          QR: JSON.stringify({
            to_is_consumer: TabIndex === 0,
            to: i.id,
            to_username: i.username,
            to_profile_photo: i.profile_picture
          }),
          skip_pass: true
        })}
      >
        <Image
          source={
            i.profile_picture
              ? { uri: i.profile_picture }
              : randomImages[Math.round(Math.random() * 3)]
          }
          resizeMode="cover"
          style={styles.RETURN_IMAGE}
        />
        <Text style={styles.RETURN_ITEM_CUSTOMER}>
        {(i.first_name && i.first_name !== "") || (i.last_name && i.last_name !== "")
            ? i.first_name + " " + i.last_name
            : i.business_name && i.business_name !== ""
              ? i.business_name
              : i.username
          }
        </Text>
      </TouchableOpacity>
    ))
  }

  const formatUsersData = (users = []) => {
    let consumers = []
    let merchants = []
    users.map((user) => {
      if (user.consumer_data)
        consumers.push({
          ...user.consumer_data,
          first_name: user.first_name,
          last_name: user.last_name,
          username: user.username,
        })
      if (user.merchant_data) merchants.push({ ...user.merchant_data, username: user.username })
    })
    return { consumers, merchants }
  }

  const getDataFiltered = (initialData: Array<any>, keys: Array<string>, filter: any) => {
    if (initialData === [] || !initialData) return []
    if (keys === [] || !keys) return initialData
    if (filter === "" || !filter) return initialData
    let data = []
    initialData.map((d) => {
      keys.map((k) => {
        try {
          if (d[k].toLocaleLowerCase().includes(filter.toLocaleLowerCase())) data.push(d)
        } catch {}
      })
    })
    return data
  }

  const getUsers = () => {
    loginStore.environment.api.getUsers().then((result: any) => {
      if (result.kind === "ok") {
        runInAction(() => loginStore.setUsers(formatUsersData(result.data?.results)))
      } else if (result.kind === "bad-data") {
        const key = Object.keys(result?.errors)[0]
        const msg = `${key}: ${result?.errors?.[key][0]}`
        notifyMessage(msg)
      } else notifyMessage(null)
    })
  }

  const OnEmptyContactList = () => <View style={styles.EMPTY_CONTACTS}><Text>No contacts to show</Text></View> 

  const peopleData = getDataFiltered(loginStore.getUsers.consumers, ["first_name", "last_name", "business_name"], Search);
  const businessData = getDataFiltered( loginStore.getUsers.merchants, ["first_name", "last_name", "business_name"], Search);
  // const businessData = []; // ? This variable is used for check if on empty contact list works and his styles.

  useEffect(() => {
    if (isFocused) getUsers()
  }, [isFocused])

  return (
    <Screen showHeader preset="fixed" statusBar={"dark-content"} unsafe={true}>
      <KeyboardAvoidingView
        enabled
        style={styles.ROOT}
      >
        <View>
          <View style={styles.ROOT_CONTAINER}>
            <View style={styles.CONTAINER}>
              <View style={styles.HEADER_ACTIONS}>
                <TouchableOpacity style={styles.HEADER} onPress={() => navigation.navigate('home')}>
                  <Icon name={"arrow-back"} size={23} color={loginStore.getAccountColor} />
                  <Text style={[styles.BACK_BUTON_LABEL, { color: loginStore.getAccountColor }]}>{` Home`}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.STEP_CONTAINER}>
                <Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>
                  Address Book
                </Text>

                <View style={styles.LINE} />
                <View style={styles.SEARCH_INPUT_CONTAINER}>
                  <View style={styles.SEARCH_INPUT_STYLE_CONTAINER}>
                    <Icon name={"search"} size={25} color={COLOR.PALETTE.black} />
                    <TextInput
                      style={styles.SEARCH_INPUT_STYLE}
                      onChangeText={(t) => setSearch(t)}
                      value={Search}
                      placeholder={`Search`}
                      placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
                    />
                  </View>
                </View>
                <View style={{ width: METRICS.screenWidth * 0.95, alignSelf: "center", marginTop: 10 }}>
                  <Tab
                    value={TabIndex}
                    onChange={(e) => setTabIndex(e)}
                    indicatorStyle={{ backgroundColor: loginStore.getAccountColor, height: 4 }}
                    variant="default"
                  >
                    <Tab.Item
                      buttonStyle={{ backgroundColor: "white" }}
                      title="PEOPLE"
                      titleStyle={{ fontSize: 12, color: loginStore.getAccountColor }}
                    />
                    <Tab.Item
                      buttonStyle={{ backgroundColor: "white" }}
                      title="BUSINESS"
                      titleStyle={{ fontSize: 12, color: loginStore.getAccountColor }}
                    />
                  </Tab>
                  <ScrollView style={styles.CONTACT_CONTAINER}>
                    { TabIndex === 0 
                      ? (Array.isArray(peopleData) && peopleData.length > 0) 
                        ? <ContactList data={peopleData} />
                        : <OnEmptyContactList />

                      : (Array.isArray(businessData) && businessData.length > 0) 
                        ? <ContactList data={businessData} />
                        : <OnEmptyContactList />
                    }
                    <View style={styles.RETURN_ITEM} />
                  </ScrollView>
                </View>
              </View>
            </View>
          </View>
        </View>
        {ShowIndex && (
          <Button
            buttonStyle={{ backgroundColor: loginStore.getAccountColor }}
            buttonLabelPre={
              <Icon
                key={"button_adornment"}
                name={"qr-code-2"}
                size={30}
                color={"white"}
                style={{ marginRight: 30 }}
              />
            }
            onPress={() => setShowIndex(false)}
            buttonLabel={"Receive or Scan to pay"}
            showBottonMenu
            hideButton
            accountType={loginStore.getSelectedAccount}
          />
        )}
      </KeyboardAvoidingView>
    </Screen>
  )
})
