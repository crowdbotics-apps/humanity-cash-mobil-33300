import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite"
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, ActivityIndicator, Linking, Image } from "react-native"
import { Text, Button, Screen } from "../../components"
import Icon from "react-native-vector-icons/MaterialIcons"
import styles from "./link-bank-style"
import { COLOR, IMAGES } from "../../theme"
import { useNavigation, useIsFocused } from "@react-navigation/native"
import { WebView } from 'react-native-webview'
import { useStores } from "../../models"

import Ionicons from "react-native-vector-icons/Ionicons"
import { runInAction } from "mobx";
import { notifyMessage } from "../../utils/helpers";
import { DEFAULT_API_CONFIG } from "../../services/api/api-config";

export const LinkBankScreen = observer(function LinkBankScreen() {
  const navigation = useNavigation()
  const rootStore = useStores()
  const { loginStore } = rootStore
  const isFocused = useIsFocused();
  const [Step, setStep] = useState('banks')
  const [AccountName, setAccountName] = useState("")
  const [Pass, setPass] = useState("")
  const [HidePass, setHidePass] = useState(true)
  const [Loading, setLoading] = useState(false)

  const [Search, setSearch] = useState('')

  const [CustomerDwollaId, setCustomerDwollaId] = useState('')

  useEffect(() => {
    if (CustomerDwollaId === '' || !CustomerDwollaId) {
      loginStore.environment.api.getDwollaToken({
        "user_type": "merchant"
      })
        .then((result: any) => {
          if (result.kind === 'ok') {
            setCustomerDwollaId(result.response.iav_token)
          }
        })
    }
  }, [CustomerDwollaId]);

  useEffect(() => {
    if (isFocused) getFundingSourcesList()
  }, [isFocused])

  const [iavToken, setIavToken] = useState('')

  const getDataFiltered = (initialData: Array<any>, keys: Array<string>, filter: any) => {
    if (initialData === [] || !initialData) return []
    if (keys === [] || !keys) return initialData
    if (filter === '' || !filter) return initialData
    let data = []
    initialData.map(d => {
      keys.map(k => {
        try { if (d[k].toLocaleLowerCase().includes(filter.toLocaleLowerCase())) data.push(d) }
        catch { }
      })
    })
    return data
  }

  const RenderBanks = () => (
    <View style={styles.CONTAINER}>
      <TouchableOpacity style={styles.HEADER} onPress={() => navigation.navigate("settings")}>
        <Icon name={"arrow-back"} size={23} color={COLOR.PALETTE.black} />
        <Text style={styles.BACK_BUTON_LABEL}>{` Back`}</Text>
      </TouchableOpacity>
      <Text style={styles.STEP_TITLE}>Select your bank</Text>
      <View style={styles.LINE} />
      <View style={styles.SEARCH_INPUT_CONTAINER}>
        <View style={styles.SEARCH_INPUT_STYLE_CONTAINER}>
          <Icon name={"search"} size={25} color={COLOR.PALETTE.black} />
          <TextInput
            style={styles.SEARCH_INPUT_STYLE}
            onChangeText={t => setSearch(t)}
            value={Search}
            placeholder={`Search`}
            placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
          />
        </View>
      </View>
      <View style={styles.BANKS_ICON_CONTAINER}>
        {getDataFiltered(loginStore.getFundingSources, ['bankName', 'name'], Search).map((bank, key) => (
          <TouchableOpacity onPress={() => setStep('bankLogin')} key={key + '_bank'} style={styles.BANK_ICON_CONTAINER}>
            {/* <Image
              resizeMode="contain"
              source={IMAGES.lee_bank}
              style={styles.BANK_ICON}
            /> */}
            <Text style={styles.BANK_NAME}>{bank.bankName}</Text>
            <Text style={styles.BANK_ACC_NAME}>{bank.name}</Text>
          </TouchableOpacity>
        ))}
        {/* <TouchableOpacity onPress={() => setStep('bankLoginDwolla')} style={styles.BANK_ICON_CONTAINER}> */}
        <TouchableOpacity onPress={() => {
          getDwollaIav()
          setLoading(true)
          setTimeout(() => {
            setLoading(false)
          }, 3000);
        }}
          style={styles.BANK_ICON_CONTAINER}
        >
          {Loading
            ? <ActivityIndicator size="small" color={'black'} />
            : <Icon name={"add"} size={50} color={COLOR.PALETTE.gray} />
          }


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
          placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
        />
        <TouchableOpacity style={styles.SHOW_PASS_CONTAINER} onPress={() => setHidePass(!HidePass)}>
          <Ionicons name="eye" color={"#39534440"} size={20} />
        </TouchableOpacity>
      </View>

    </View>
  )

  const getFundingSourcesList = async () => {
    // TODO: change user_type argument with the one selected at that moment, consumer o merchant
    loginStore.environment.api.getFundingSources({ "user_type": loginStore.getSelectedAccount })
      .then((result: any) => {
        if (result.kind === "ok") {
          runInAction(() => {
            loginStore.setFundingSources(result.data)
          })
        }
      })
  }

  const getIavToken = () => {
    loginStore.environment.api.getDwollaToken({ "user_type": loginStore.getSelectedAccount })
      .then((result: any) => {
        if (result.kind === "ok") {
          runInAction(() => {
            setIavToken(result.response.iav_token)
          })
          bankLoginDwolla();
        } else if (result.kind === "bad-data") {
          const key = Object.keys(result?.errors)[0]
          const msg = `${key}: ${result?.errors?.[key]}`
          notifyMessage(msg)
        }
      })
  }

  function bankLoginDwolla() {
    setStep('bankLoginDwolla')
  }

  function getDwollaIav() {
    getIavToken();
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
      if (event.nativeEvent.data === 'SuccessIAV') {
        setTimeout(() => {
          setStep('banks')
          getFundingSourcesList()
        }, 3000);
      }

    }
  }


  const RenderBankLoginDwolla = () => (
    <WebView
      key={'webview_contet'}
      style={styles.bankView}
      javascriptEnabled
      originWhitelist={['*']}
      domStorageEnabled={true}
      startInLoadingState={true}
      injectedJavaScript={jsCode}
      onMessage={onMessage}
      source={{
        uri: `${DEFAULT_API_CONFIG.url}/iav/?iavToken=${iavToken}`,
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
        // behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={styles.ROOT}
      >
        <ScrollView bounces={false}>
          <View style={styles.ROOT_CONTAINER}>

            {Step === 'banks' && RenderBanks()}
            {Step === 'bankLogin' && RenderBankLogin()}
            {Step === 'bankLoginDwolla' && [
              <View key={'webview_close'} style={{ justifyContent: 'center', height: 50 }}>
                <TouchableOpacity onPress={() => setStep('banks')} style={styles.CLOSE_MODAL_BUTTON}>
                  <Text style={styles.BACK_BUTON_LABEL}>{`Close `}</Text>
                  <Icon name={"close"} size={20} color={'#000'} />
                </TouchableOpacity>
              </View>,
              RenderBankLoginDwolla()
            ]}

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {Step !== 'bankLoginDwolla' && (Step !== 'banks'
        ? <Button
          buttonStyle={styles.buttonStyle}
          onPress={() => { Step === 'help' ? setStep('contact') : Linking.openURL('mailto:support@example.com') }}
          buttonLabel={'Submit'}
          showBottonMenu
          hideButton
        />
        : <Button
          buttonStyle={styles.buttonStyle}
          buttonLabel={'Scan to Pay or Receive'}
          showBottonMenu
          hideButton
        />
      )}
    </Screen>
  )
})
