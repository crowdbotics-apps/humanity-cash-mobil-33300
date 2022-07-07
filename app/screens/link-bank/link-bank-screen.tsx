import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite"
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, Linking, Image } from "react-native"
import { Text, Button, Screen } from "../../components"
import Icon from "react-native-vector-icons/MaterialIcons"
import styles from "./link-bank-style"
import { COLOR, METRICS, IMAGES } from "../../theme"
import { useNavigation } from "@react-navigation/native"
import Entypo from "react-native-vector-icons/Entypo"
import { WebView } from 'react-native-webview'
import { useStores } from "../../models"

import Ionicons from "react-native-vector-icons/Ionicons"
import {runInAction} from "mobx";
import {notifyMessage} from "../../utils/helpers";

export const LinkBankScreen = observer(function LinkBankScreen() {
  const navigation = useNavigation()
  const rootStore = useStores()
  const { loginStore } = rootStore

  const [Step, setStep] = useState('banks')
  const [AccountName, setAccountName] = useState("")
  const [Pass, setPass] = useState("")
  const [HidePass, setHidePass] = useState(true)

  const [Search, setSearch] = useState('')

  const [CustomerDwollaId, setCustomerDwollaId] = useState('')
  const [iavToken, setIavToken] = useState('')

  const temp = () => {
    loginStore.environment.api.getDwollaToken({"user_type": "consumer"})
        .then(result => {
          console.log('result state ===>>> ', result)
        })
  }

  const RenderBanks = () => (
    <View style={styles.CONTAINER}>
      <TouchableOpacity style={styles.HEADER} onPress={() => navigation.navigate("home", {})}>
        <Icon name={"arrow-back"} size={23} color={COLOR.PALETTE.black} />
        <Text style={styles.BACK_BUTON_LABEL}>{` Home`}</Text>
      </TouchableOpacity>
      <Text style={styles.STEP_TITLE}>{' Link Bank'}</Text>
      <View style={styles.LINE} />
      <View style={styles.SEARCH_INPUT_CONTAINER}>
        <View style={styles.SEARCH_INPUT_STYLE_CONTAINER}>
          <Icon name={"search"} size={25} color={COLOR.PALETTE.black} />
          <TextInput
            style={styles.SEARCH_INPUT_STYLE}
            onChangeText={t => setSearch(t)}
            value={Search}
            placeholder={`Search`}
          />
        </View>
      </View>
      <View style={styles.BANKS_ICON_CONTAINER}>
        {[0].map((temp, key) => (
          <TouchableOpacity onPress={() => setStep('bankLogin')} key={key} style={styles.BANK_ICON_CONTAINER}>
            <Image
              resizeMode="contain"
              source={IMAGES.lee_bank}
              style={styles.BANK_ICON}
            />
          </TouchableOpacity>
        ))}
        {/* <TouchableOpacity onPress={() => setStep('bankLoginDwolla')} style={styles.BANK_ICON_CONTAINER}> */}
        <TouchableOpacity onPress={() => getDwollaIav()} style={styles.BANK_ICON_CONTAINER}>
        <Icon name={"add"} size={50} color={COLOR.PALETTE.gray} />
          </TouchableOpacity>
      </View>
    </View>
  )

  const RenderBankLogin = () => (
    <View style={styles.CONTAINER}>
      <TouchableOpacity style={styles.HEADER} onPress={() => setStep('banks')}>
        <Icon name={"arrow-back"} size={23} color={COLOR.PALETTE.black} />
        <Text style={styles.BACK_BUTON_LABEL}>{` Back`}</Text>
      </TouchableOpacity>
      <Text style={styles.STEP_TITLE}>{'Log in to your bank'}</Text>
      <View style={styles.LINE} />
      <Text style={styles.STEP_SUB_TITLE}>By providing your bank credentials to Dwolla, you are enbaling Dwolla to retrieve your financial data.</Text>
      <View style={styles.BANK_ICON_CONTAINER_VIEW}>
            <Image
              resizeMode="contain"
              source={IMAGES.lee_bank}
              style={styles.BANK_ICON}
            />
          </View>

          <View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
          <Text style={styles.INPUT_LABEL_STYLE}>
            ACCOUNT NAME
          </Text>
        </View>
        <View style={styles.INPUT_STYLE_CONTAINER}>
          <TextInput
            style={styles.INPUT_STYLE}
            onChangeText={t => setAccountName(t)}
            value={AccountName}
            placeholder={"Account name"}
          />
        </View>
        <View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
          <Text style={styles.INPUT_LABEL_STYLE}>PASSWORD</Text>
          {/* <Text style={styles.PASS_REQUIREMENTS}>AT LEAST 12 CHARACTERS LONG,  1 NUMBER AND 1 SYMBOL</Text> */}
        </View>
        <View style={styles.INPUT_STYLE_CONTAINER}>
          <TextInput
            // ref={ref => EmailInput = ref}
            style={styles.PASS_INPUT_STYLE}
            onChangeText={t => [setPass(t)]}
            value={Pass}
            secureTextEntry={HidePass}
            placeholder={"*********"}
          />
          <TouchableOpacity onPress={() => setHidePass(!HidePass)}>
            <Ionicons name="eye" color={"#39534440"} size={20} />
          </TouchableOpacity>
        </View>

    </View>
  )

    function getIavToken(){
        // TODO: change user_type argument with the one selected at that moment, consumer o merchant
        loginStore.environment.api.getDwollaToken({"user_type": "consumer"})
            .then(result => {
                console.log('result iav ===>>> ', result)
                if (result.kind === "ok") {
                    runInAction(() => {
                        setIavToken(result.response.iav_token)
                    })
                } else if (result.kind === "bad-data") {
                    const key = Object.keys(result?.errors)[0]
                    let msg = `${key}: ${result?.errors?.[key][0]}`
                    notifyMessage(msg)
                } else {
                    loginStore.reset()
                    notifyMessage(null)
                }
            })
    }

    function bankLoginDwolla(){
        setStep('bankLoginDwolla')
    }

    function getDwollaIav() {
        getIavToken();
        bankLoginDwolla();
    }

    const jsCode = `
    window.addEventListener('message', function(t){
      if (t.data.topic === 'iav.state'){
        window.ReactNativeWebView.postMessage(t.data.payload[0].currentPage)
      }
    })
    true;
    `;

    function onMessage(event) {
        if (event.nativeEvent.data !== "undefined") {
            if (event.nativeEvent.data === 'SuccessIAV'){
                setTimeout(() => {  setStep('banks') }, 3000);
            }

        }
    }


  const RenderBankLoginDwolla = () => (
    <WebView
    style={styles.bankView}
    javascriptEnabled
    originWhitelist={['*']}
    domStorageEnabled={true}
    startInLoadingState={true}
    injectedJavaScript={jsCode}
    onMessage={onMessage}
    source={{
      uri: `https://humanity-cash-mobil-33300.botics.co/iav/?iavToken=${iavToken}`,
    }}
  />
  )

  return (
    <Screen
      // preset='scroll'
      preset="fixed"
      statusBar={"dark-content"}
      style={styles.ROOT}
      showHeader
    >
      <KeyboardAvoidingView
        enabled
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={styles.ROOT}
      >
        <ScrollView bounces={false}>
          <View style={styles.ROOT_CONTAINER}>

            {Step === 'banks' && RenderBanks()}
            {Step === 'bankLogin' && RenderBankLogin()}
            {Step === 'bankLoginDwolla' && RenderBankLoginDwolla()}

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
        {Step !== 'banks'
          ? <Button
            buttonStyle={{
              backgroundColor: COLOR.PALETTE.blue,
              bottom: 125,
              position: 'absolute'
            }}
            onPress={() => { Step === 'help' ? setStep('contact') : Linking.openURL('mailto:support@example.com') }}
            buttonLabel={'Submit'}
            showBottonMenu
            hideButton
          />
          : <Button
            buttonStyle={{
              backgroundColor: COLOR.PALETTE.blue,
              bottom: 125,
              position: 'absolute'
            }}
            buttonLabel={'Scan to Pay or Receive'}
            showBottonMenu
            hideButton
          />
        }
    </Screen>
  )
})
