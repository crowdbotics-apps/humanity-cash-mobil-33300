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
    loginStore.environment.api
      .sendQR({
        qr_data: JSON.stringify({
          to: loginStore?.getProfilesId[loginStore.getSelectedAccount],
          to_is_consumer: loginStore.getSelectedAccount === 'consumer',
        }), 
        email: loginStore.getAllData.email
      })
      .then((result: any) => {
        console.log(' =====>>>> ', JSON.stringify(result, null, 2))
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
          {/* <View style={styles.ROOT_CONTAINER}> */}
          <View style={styles.CONTAINER}>

            <Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>Static QR</Text>
            <View style={styles.LINE} />
            <Text style={styles.STEP_SUB_TITLE}>{`
You can accept BerkShares without using the app at your cash register by displaying your QR code at the cash register. This QR code contains only your BerkShares wallet address and not transaction specific data. 

When you use the static QR code to receive payments, your customer must enter the correct amount. Be sure to check that the customer has entered the correct amount and that the transaction was successful. Your customer should have a transaction receipt once completed. 

You can have customers scan your static QR code as a backup in case your BerkShares app or device is not working. 

If you encounter any issue, don’t hesitate to contact us via info@berkshares.org. 
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
        buttonLabel={'Email my QR code again'}
      />
    </Screen>
  )
})
