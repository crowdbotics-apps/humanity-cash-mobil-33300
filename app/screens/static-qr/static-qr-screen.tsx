import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, TextInput, Switch } from "react-native"
import { Text, Button, Screen } from "../../components"
import Icon from "react-native-vector-icons/MaterialIcons"
import styles from "./static-qr-style"
import { COLOR, METRICS } from "../../theme"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import Ionicons from "react-native-vector-icons/Ionicons"
import { runInAction } from "mobx";
import { notifyMessage } from "../../utils/helpers";


export const StaticQRScreen = observer(function StaticQRScreen() {
  const navigation = useNavigation()
  const rootStore = useStores()
  const { loginStore } = rootStore
  const [Loading, setLoading] = useState(false)

  const updateSendMail = () => {
    setLoading(true)
    const data = {
      qr_data: {
        to: loginStore?.getProfilesId[loginStore.getSelectedAccount],
        to_is_consumer: loginStore.getSelectedAccount === 'consumer',
      },
      email: loginStore.getAllData.email
    }
    loginStore.environment.api
      .sendQR(data)
      .then((result: any) => {
        setLoading(false);
        if (result.kind === "ok") {
          runInAction(() => {
            // navigation.navigate("settings")
          })
        } else if (result.kind === "bad-data") {
          const key = Object.keys(result?.errors)[0];
          const msg = `${key}: ${result?.errors?.[key]}`;
          notifyMessage(msg);
        }
      })
  }

  return (
    <Screen
      preset="fixed"
      statusBar={"dark-content"}
      style={styles.ROOT}
      showHeader
    >
      <TouchableOpacity style={styles.HEADER} onPress={() => navigation.navigate("settings")}>
        <Icon name={"arrow-back"} size={23} color={COLOR.PALETTE.black} />
        <Text style={styles.BACK_BUTON_LABEL}>{` Back`}</Text>
      </TouchableOpacity>
      <KeyboardAvoidingView enabled style={styles.ROOT}>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          {
}
          <View style={styles.CONTAINER}>

            <Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>Static QR</Text>
            <View style={styles.LINE} />
            <Text style={styles.STEP_SUB_TITLE}>{`
Your QR code allows you to accept money from others. Ask them to scan your QR code using their app, then they'll be prompted to enter the amount they want to send you. Be sure they check that the amount entered is correct before hitting send. When sent, you and the other party will both receive transaction receipts. 

You can print out a copy of your QR code to make it easy for others to scan to pay you, especially if you're a small business. A printed QR code is a great backup in case your app or device isn't working. We're happy to email you a copy of your QR code that you can print out! 
`}</Text>
          </View>
          {/* </View> */}
        </ScrollView>
      </KeyboardAvoidingView>
      <Button
        buttonStyle={{
          backgroundColor: Loading ? `${loginStore.getAccountColor}40` : loginStore.getAccountColor
        }}
        onPress={() => updateSendMail()}
        loading={Loading}
        disabled={Loading}
        buttonLabel={'Email my QR code again'}
      />
    </Screen>
  )
})
