import React, {useEffect, useState} from "react"
import {ActivityIndicator, Image, Modal, SectionList, TouchableOpacity, View} from "react-native"
import styles from "../../screens/settings-styles"
import { IMAGES } from "../../theme/images"
import { Text } from "../text/text"

import { Button } from "../button/button"
import { COLOR } from "../../theme"
import TextField from "../text-field/text-field"
import Icon from "react-native-vector-icons/MaterialIcons"

type ModalVerifiedUsersProps = {
  loading: boolean
  visible: boolean
  setVisible: any
  contact_list: any
  selected_contact_list: any
  invite_action: any
}

export function ModalVerifiedUsers(props: ModalVerifiedUsersProps) {
  const [SearchBar, setSearchBar] = useState(false)

  const [SearchBarText, setSearchBarText] = useState("")
  const [ContactList, setContactList] = useState([])
  const [ContactQuantity, setContactQuantity] = useState(0)
  const [LoadingSectionList, setLoadingSectionList] = useState(true)

  const renderContactsHeader = text => {
    return (
      // <LinearGradient
      //   colors={[COLOR.PALETTE.offWhite, COLOR.PALETTE.white]}
      //   style={styles.HEADER_SECTION_LIST_CONTAINER}
      //   start={{ x: 0, y: 0 }}
      //   end={{ x: 1, y: 0 }}
      //   key={"id-header-" + text}
      // >
      //   <Text style={styles.HEADER_SECTION_LIST_TEXT}>{text}</Text>
      // </LinearGradient>
        <View>
          <Text style={styles.HEADER_SECTION_LIST_TEXT}>{text}</Text>
        </View>
    )
  }

  const getContactsQuantity = () => {
    let num = 0
    ContactList.map(contact => {
      num = num + contact.data.length
    })
    setContactQuantity(num)
  }

  const SearchFriendInContacts = () => {
    setLoadingSectionList(true)
    const friends = [...props.contact_list]
    const result = friends.map(obj => {
      return {
        title: obj.title,
        data: obj.data.filter(data => {
          const lowerCaseName = data.name.toLowerCase()
          return lowerCaseName.includes(SearchBarText.toLowerCase())
        })
      }
    })
    let result2 = []
    result.map(res => {
      if (res.data.length === 0) {
        return null
      } else {
        result2.push(res)
      }
    })
    setContactList(result2)
  }

  useEffect(() => {
    SearchFriendInContacts()
  }, [SearchBarText])

  useEffect(() => {
    setContactList(props.contact_list)
  }, [props.contact_list])

  useEffect(() => {
    getContactsQuantity()
    if (LoadingSectionList) {
      setTimeout(() => {
        setLoadingSectionList(false)
      }, 500)
    }
  }, [ContactList])

  const renderItemAction = (item) => {
    if (props.selected_contact_list.some(e => e.id === item.id)) {
      return (
        <TouchableOpacity style={styles.SECTION_LIST_ITEM_BUTTON} onPress={() => {
          const currentList = [...props.selected_contact_list]
          const newList = currentList.filter(user => user.id !== item.id)
          props.invite_action(newList)
        }}>
          <Icon name={"clear"} size={15} color={COLOR.PALETTE.primary} />
          <Text style={styles.SECTION_LIST_ITEM_BUTTON_TEXT}>Remove</Text>
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity style={styles.SECTION_LIST_ITEM_BUTTON} onPress={() => {
          const currentList = [...props.selected_contact_list]
          props.invite_action([...currentList, item])
        }}>
          <Icon name={"add"} size={15} color={COLOR.PALETTE.primary} />
          <Text style={styles.SECTION_LIST_ITEM_BUTTON_TEXT}>Invite</Text>
        </TouchableOpacity>
      )
    }

  }

  const renderContactBody = item => {
    return (
      <View key={"itme-id-" + item.id}>
        <View style={styles.SECTION_LIST_ITEM_BODY}>
          {!item.image && (
            <View
              style={[
                styles.SECTION_LIST_ITEM_IMAGE,
                {
                  backgroundColor: COLOR.PALETTE.primary,
                  alignItems: "center",
                  justifyContent: "center"
                }
              ]}
            >
              <Icon name={"person"} size={20} color={COLOR.PALETTE.white} />
            </View>
          )}
          {item.image && (
            <Image source={{ uri: item.image }} style={styles.SECTION_LIST_ITEM_IMAGE} />
          )}
          <Text style={styles.SECTION_LIST_ITEM_TEXT} numberOfLines={1}>
            {item.name}
          </Text>
          {renderItemAction(item)}
        </View>
        <View style={[styles.SEPARATOR, { marginHorizontal: 20, marginBottom: 0 }]} />
      </View>
    )
  }

  return (
    <Modal
      hardwareAccelerated
      animationType={"slide"}
      transparent={true}
      visible={props.visible}
      statusBarTranslucent
    >
      <View style={[styles.MODAL_BODY, { height: "86%", paddingHorizontal: 0 }]}>
        <Image source={images.fpLogo} style={styles.LOGO_MODAL} />
        <View style={styles.FIRST_TITLE_MODAL}>
          <Text>Invite Friends</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
            paddingHorizontal: 20,
            marginBottom: !SearchBar ? 10 : 0
          }}
        >
          <Text>Contacts {ContactQuantity}</Text>
          <View style={{ flexDirection: "row" }}>
            {SearchBar && (
              <TouchableOpacity onPress={() => setSearchBarText("")}>
                <Icon name={"clear"} size={20} color={COLOR.PALETTE.black} />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => setSearchBar(!SearchBar)}>
              <Icon name={"search"} size={20} color={COLOR.PALETTE.black} />
            </TouchableOpacity>
          </View>
        </View>
        {SearchBar && (
          <View style={{ marginHorizontal: 20 }}>
            <TextField
              label={"Search"}
              value={SearchBarText}
              onChangeText={txt => setSearchBarText(txt)}
              returnKeyType={"done"}
            />
          </View>
        )}
        {LoadingSectionList && (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator size="large" color={COLOR.PALETTE.primary} />
          </View>
        )}
        {!LoadingSectionList && ContactQuantity > 0 && (
          <SectionList
            sections={ContactList}
            stickySectionHeadersEnabled
            keyExtractor={(item) => item?.id}
            renderItem={({ item }) => renderContactBody(item)}
            renderSectionHeader={({ section: { title } }) => renderContactsHeader(title)}
          />
        )}
        {ContactQuantity === 0 && (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: COLOR.PALETTE.black }}>No contacts found</Text>
          </View>
        )}
        <Button
          text={"CLOSE"}
          style={{ marginHorizontal: 20, marginBottom: 20, marginTop: 10 }}
          preset={"secondary"}
          onPress={() => {
            props.setVisible(false)
            setSearchBarText("")
          }}
        />
      </View>
    </Modal>
  )
}
