// @ts-ignore

import Toast from "react-native-toast-message"
import { Platform, ToastAndroid, Alert } from "react-native"
import { checkMultiple, requestMultiple, PERMISSIONS } from "react-native-permissions"

export const notifyMessage = (msg: any, type = "error") => {
  if (msg === null) {
    msg = "An error occurred while communicating with the server, please try again in a few moments"
  }
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT)
  } else {
    Alert.alert(msg);
  }
  Toast.show({
    type: type,
    text1: msg,
    // topOffset: Platform.OS === "ios" ? 50 : 50
  })
}

export const checkPermissions = async () => {
  if (Platform.OS === "ios") {
    const res = await checkMultiple([
      PERMISSIONS.IOS.CAMERA,
      PERMISSIONS.IOS.PHOTO_LIBRARY,
      PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY
    ])
    if (
      res["ios.permission.CAMERA"] === "denied" ||
      res["ios.permission.CAMERA"] === "blocked" ||
      res["ios.permission.PHOTO_LIBRARY"] === "denied" ||
      res["ios.permission.PHOTO_LIBRARY"] === "blocked" ||
      res["ios.permission.PHOTO_LIBRARY_ADD_ONLY"] === "denied" ||
      res["ios.permission.PHOTO_LIBRARY_ADD_ONLY"] === "blocked"
    ) {
      await requestMultiple([
        PERMISSIONS.IOS.CAMERA,
        PERMISSIONS.IOS.PHOTO_LIBRARY,
        PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY
      ])
    }
    __DEV__ && console.tron.log("===Ios====", res)
  } else {
    const res = await checkMultiple([
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
    ])
    if (
      res["android.permission.CAMERA"] === "denied" ||
      res["android.permission.READ_EXTERNAL_STORAGE"] === "denied" ||
      res["android.permission.WRITE_EXTERNAL_STORAGE"] === "denied"
    ) {
      await requestMultiple([
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
      ])
    }
    __DEV__ &&
      console.log(
        "===Android====",
        res["android.permission.CAMERA"],
        res["android.permission.READ_EXTERNAL_STORAGE"],
        res["android.permission.WRITE_EXTERNAL_STORAGE"]
      )
  }
}

export const compare = (a, b) => {
  if (a.name < b.name) {
    return -1
  }
  if (a.name > b.name) {
    return 1
  }
  return 0
}

export const getInitials = (words) => {
  if (words.length === 0) {
    return []
  }
  const listOfInitials = []
  words.map(word => {
    if (word.name === undefined) {
      return false
    }
    const firstLetter = word.name[0].toLowerCase()
    if (!listOfInitials.includes(firstLetter)){
      listOfInitials.push(firstLetter)
    }
  })
  return listOfInitials
}

export const modifyContactList = contacts => {
  const newRawContactList = []
  contacts.map(contact => {
    const newContact = {
      id: contact.recordID,
      name:
        Platform.OS === "android"
          ? contact.displayName
          : contact.givenName + " " + contact.familyName,
      image: contact.hasThumbnail ? contact.thumbnailPath : null,
      email: contact.emailAddresses.length > 0 ? contact.emailAddresses[0].email : null,
      phone_number: contact.phoneNumbers.length > 0 ? contact.phoneNumbers[0].number : null,
      exists: false
    }
    if (newContact.name !== " ") {
      newRawContactList.push(newContact)
    }
  })
  newRawContactList.sort(compare)
  return newRawContactList
}

export const orderContactList = contacts => {
  const orderedContactList = []
  const initialTitles = getInitials(contacts).sort()
  initialTitles.map(tit => {
    const item = {
      title: tit.toUpperCase(),
      data: contacts.filter(cont => cont.name[0].toLowerCase() === tit )
    }
    if (item.title !== " ") {
      orderedContactList.push(item)
    }
  })
  return orderedContactList
}

export const normalizeProfilePictureImage = contacts => {
  const newRawContactList = []
  contacts.map(contact => {
    const newContact = {
      id: contact.id,
      name: contact.name,
      image: contact.profile_picture
    }
    if (newContact.name !== " ") {
      newRawContactList.push(newContact)
    }
  })
  newRawContactList.sort(compare)
  return newRawContactList
}

export const processApiResult = (result:any, onSuccess:any, onBadData:any, onError:any, extra:any=null)=>{
  // extra is extra data that you want to use on the callbacks
  if(result.kind === "ok"){
    onSuccess(result, extra)
  }else if(result.kind === "bad-data"){
    if (result.errors.non_field_errors) {
      notifyMessage(result.errors.non_field_errors[0])
    }
    onBadData(result, extra)
  } else if (result.kind === "cannot-connect" || result.kind === "timeout") {
    onError(result, extra)
    notifyMessage("Please check your internet connection and try again", "error")
  }  else {
    notifyMessage(null)
    onError(null)
  }

}
