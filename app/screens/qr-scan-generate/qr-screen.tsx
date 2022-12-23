import React, { useEffect, useState, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { View, TouchableOpacity, Modal, TextInput, Image, Keyboard } from 'react-native';
import {
  Text,
  Button,
  CustomSwitch,
  Screen,
  ConnectBankModal
} from '../../components';
import Icon from "react-native-vector-icons/MaterialIcons"
import styles from './qr-style';
import { COLOR } from '../../theme';
import { useNavigation, useIsFocused } from "@react-navigation/native"
import { useStores } from "../../models"
import { getErrorMessage, notifyMessage } from "../../utils/helpers"
import QRCodeScanner from 'react-native-qrcode-scanner';
import QRCode from 'react-native-qrcode-svg'
import Ionicons from "react-native-vector-icons/Ionicons"
import { BaseConfirmModal as UserModal } from '../../layouts'

// steps = ['tabs', 'amount', 'pass', 'finish']

export const QRScreen = observer(function QRScreen(props: any) {
  const navigation = useNavigation()
  const rootStore = useStores()
  const isFocused = useIsFocused();
  const { loginStore } = rootStore

  const userToPay = useRef(null);

  const [Step, setStep] = useState('tabs')
  const [QR, setQR] = useState(null)
  const [Amount, setAmount] = useState('0')
  const [RoundedAmount, setRoundedAmount] = useState(0);
  const [Loading, setLoading] = useState(false)
  const [Pass, setPass] = useState('')
  const [HidePass, setHidePass] = useState(true)
  const toggleSwitch = () => setScanQR(previousState => !previousState)

  const [TransactionSucceed, setTransactionSucceed] = useState(true)
  const [TransactionErrorMsg, setTransactionErrorMsg] = useState('')
  const [PayerSetAmount, setPayerSetAmount] = useState(true)
  const [ButtonDisabled, setButtonDisabled] = useState(false)
  const [ScanQR, setScanQR] = useState(false)
  const [ShowQR, setShowQR] = useState(false)
  const [ShowConfirmationModal, setShowConfirmationModal] = useState(false)

  const transferCurrency = () => {
    if (!QR) return
    setLoading(true)
    setTransactionErrorMsg('')
    const data = {
      "from": loginStore?.getProfilesId[loginStore.getSelectedAccount],
      "to": QR?.to,
      "from_is_consumer": loginStore.getSelectedAccount === 'consumer',
      "to_is_consumer": QR?.to_is_consumer,
      "password": Pass,
      "amount": props?.route?.params?.QR ? Amount : QR?.amount,
      "roundup": 0,
    }

    loginStore.environment.api
      .sendMoney(data)
      .then((result: any) => {
        setLoading(false)
        if (result.kind === "ok") {
          setTransactionSucceed(true)
          setStep('finish')
        } else if (result.kind === "bad-data") {
          setTransactionSucceed(false)
          setStep('finish')
          const errors = result.errors
          setTransactionErrorMsg(errors)
        } else if (result.kind === "unauthorized") {
          notifyMessage('bad password')
        }
      }).catch((err) => notifyMessage(err))
  }

  const viewQR = () =>
    <UserModal
      visible={ShowQR}
      closeModalAction={() => [setShowQR(false), setPayerSetAmount(false)]}
      username={loginStore.ProfileData.username}
      imgSrc={loginStore.ProfileData.profile_picture}
    >
      <QRCode
        value={JSON.stringify({
          to: loginStore?.getProfilesId[loginStore.getSelectedAccount],
          to_is_consumer: loginStore.getSelectedAccount === 'consumer',
          amount: Amount
        })}
        size={200}
      />
      <Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>
        {!PayerSetAmount && `C$ ${Amount}`}
      </Text>
    </UserModal>

  const confirmationModal = () => (
    <UserModal
      visible={ShowConfirmationModal}
      closeModalAction={() => setShowConfirmationModal(false)}
      username={userToPay.current?.username}
      imgSrc={userToPay.current?.photo}
      type='pay'
    >
      <View>
        <Text style={[{ color: loginStore.getAccountColor }, styles.CONFIRM_MODAL_AMOUNT]}>
          B$ {Amount}
        </Text>
        <Text style={styles.CONFIRM_MODAL_GENERIC_TEXT}>or</Text>
        <Text style={[styles.CONFIRM_MODAL_GENERIC_TEXT, styles.CONFIRM_MODAL_TEXT]}>
          choose to round up and directly donate to the
          <Text style={styles.TEXT_BOLD}> Community Chest Fund </Text>
          which provides Currents grants to people in the area.
        </Text>
      </View>

      <View style={styles.FULL_WIDTH}>
        <Button
          buttonStyle={[styles.CONFIRM_MODAL_PAY_BUTTON, { borderColor: loginStore.getAccountColor }]}
          buttonLabel={`Pay C$ ${Amount} `}
          buttonLabelStyle={styles.COLOR_BLACK}
          onPress={() => [
            setShowConfirmationModal(false),
            setStep('pass')
          ]}
        />
        <Button
          buttonStyle={[{ backgroundColor: loginStore.getAccountColor }, styles.CONFIRM_MODAL_PAY_BUTTON_ROUND]}
          buttonLabel={`Round up to C$ ${RoundedAmount}`}
          onPress={() => [
            setShowConfirmationModal(false),
            setStep('pass'),
            setAmount(RoundedAmount.toString())
          ]}
        />
      </View>
      <Text style={styles.CONFIRM_MODAL_SECONDARY_TEXT}>THE ROUND UP IS A NON REFUNDABLE DONATION</Text>
    </UserModal>
  )

  const readQRAction = (data: any) => {
    let dataJson

    console.log(' data ===>>> ', typeof data, data)

    try {
      dataJson = JSON.parse(data)
    } catch {
      notifyMessage('Invalid QR')
      return
    }
    if (!('to' in dataJson) || !('to_is_consumer' in dataJson)) {
      notifyMessage('Invalid QR')
      navigation.navigate('home')
      return
    }
    setQR(dataJson)
    if (dataJson.amount) {
      setStep('pass')
      setShowConfirmationModal(true)
    } else setStep('amount')
  }

  useEffect(() => {
    if (Number(Amount) > 0) {
      if (parseFloat(Amount) % 1 !== 0) {
        const rounded = Math.round(parseFloat(Amount));
        setRoundedAmount(rounded);
      } else setRoundedAmount(parseFloat(Amount));
    }
    setButtonDisabled(!(Number(Amount) > 0));
  }, [Amount]);

  useEffect(() => {
    if (isFocused) {
      // if (!loginStore.getBillingData.billing_data_added) setShowBankModal(true)
      // else setShowBankModal(false)
      if (props?.route?.params) {
        if (props?.route?.params?.QR) {
          const qrInfo = props?.route?.params?.QR;
          readQRAction(qrInfo)
          try {
            const userInfo = JSON.parse(qrInfo);
            userToPay.current = {
              username: userInfo?.to_username ?? '',
              photo: userInfo?.to_profile_photo ?? '',
            }
          } catch (error) {
            alert(error)
          }
        }
      }
    } else setStep('tabs')
  }, [isFocused])

  const inputQR = () => <View style={{ flex: 1, justifyContent: 'space-between' }}>
    <View>
      <View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
        <Text style={styles.INPUT_LABEL_STYLE}>AMOUNT</Text>
      </View>
      <View style={styles.INPUT_STYLE_CONTAINER}>
        {/* <Text style={styles.INPUT_LABEL_STYLE}> C$</Text> */}
        <TextInput
          placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
          style={styles.INPUT_STYLE}
          keyboardType='numeric'
          onChangeText={t => {
            let temp = t.replace('C', '').replace('$', '').replace(' ', '')
            temp = temp.replace(",", ".")
            setAmount(temp)
          }}
          value={(Amount && Amount.split(' ')[0] === `C$ `) ? Amount : `C$ ` + Amount}
          placeholder={`Amount`}
        />
      </View>
    </View>
    <View>
      <TouchableOpacity style={styles.NEED_HELP_CONTAINER} onPress={() => [setShowQR(true), setPayerSetAmount(true)]}>
        <Text style={styles.NEED_HELP_LINK}>Let the payer choose the amount</Text>
      </TouchableOpacity>
      <Button
        buttonStyle={{
          backgroundColor: ButtonDisabled ? `${loginStore.getAccountColor}40` : loginStore.getAccountColor,
        }}
        onPress={() => setShowQR(true)}
        buttonLabel={'Next'}
        disabled={ButtonDisabled}
      />
    </View>
  </View>
  const renderTabs = <>
    <View style={styles.STEP_CONTAINER}>
      <View style={styles.SWITCH_CONTAINER}>
        <CustomSwitch
          selectionMode={2}
          roundCorner={true}
          option1={'Pay'}
          option2={'Receive'}
          onSelectSwitch={toggleSwitch}
          selectionColor={COLOR.PALETTE.blue}
        />
      </View>
    </View>
    {ScanQR
      ? <QRCodeScanner onRead={e => readQRAction(e.data)} />
      : inputQR()
    }
  </>

  const renderAmount =
    <View style={styles.ROOT_MODAL_PASS}>
      <View style={styles.CONTAINER}>
        <Text style={[styles.STEP_TITLE_AMOUNT, { color: loginStore.getAccountColor }]}>Specify payment</Text>
        <View style={styles.LINE_AMOUNT} />
        <Text style={styles.STEP_SUB_TITLE_AMOUNT}>Select the amount of Currents you would like to send.</Text>
        <View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
          <Text style={styles.INPUT_LABEL_STYLE}>AMOUNT</Text>
          <Text style={styles.INPUT_LABEL_STYLE}>MAX. CURRENTS 2,000</Text>
        </View>
        <View style={styles.INPUT_STYLE_CONTAINER}>
          <TextInput
            placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
            style={styles.INPUT_STYLE}
            keyboardType='numeric'
            onChangeText={t => {
              let temp = t.replace('C', '').replace('$', '').replace(' ', '')
              temp = temp.replace(",", ".")
              setAmount(temp)
            }}
            value={(Amount && Amount.split(' ')[0] === `C$ `) ? Amount : `C$ ` + Amount}
            placeholder={`Amount`}
          />
        </View>
      </View>
      <View style={styles.CONTAINER}>
        <Button
          buttonStyle={{ backgroundColor: loginStore.getAccountColor }}
          loading={Loading}
          onPress={() => setShowConfirmationModal(true)}
          buttonLabel={'Confirm'}
        />
      </View>
    </View>

  const renderPass = <View style={styles.ROOT_MODAL_PASS}>
    <View style={styles.CONTAINER}>
      <Text style={[styles.STEP_TITLE_AMOUNT, { color: loginStore.getAccountColor }]}>Verify with password</Text>
      <View style={styles.LINE_AMOUNT} />
      <View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
        <Text style={styles.INPUT_LABEL_STYLE}>PASSWORD</Text>
      </View>
      <View style={styles.INPUT_STYLE_CONTAINER}>
        <TextInput
          placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
          style={styles.PASS_INPUT_STYLE}
          onChangeText={t => [setPass(t)]}
          value={Pass}
          secureTextEntry={HidePass}
          placeholder={"*********"}
        />
        <TouchableOpacity style={styles.SHOW_PASS_CONTAINER} onPress={() => setHidePass(!HidePass)}>
          <Ionicons name="eye" color={"#39534480"} size={20} />
        </TouchableOpacity>
      </View>
    </View>
    <View style={styles.CONTAINER}>
      <Button
        buttonStyle={{ backgroundColor: loginStore.getAccountColor }}
        loading={Loading}
        onPress={() => transferCurrency()}
        buttonLabel={'Confirm'}
      />
    </View>
  </View>

  const renderFinish = <View style={styles.ROOT_MODAL_PASS}>
    <View style={styles.CONTAINER}>
      <Text style={[styles.STEP_TITLE_PASS, { color: loginStore.getAccountColor }]}>
        {TransactionSucceed ? 'Succeeded' : 'Whoops, something went wrong.'}
      </Text>
      <Text style={[styles.STEP_SUB_TITLE, { margin: 10 }]}>{TransactionErrorMsg}</Text>
    </View>
    <View style={styles.CONTAINER}>
      <Button
        buttonStyle={{ backgroundColor: loginStore.getAccountColor }}
        loading={Loading}
        onPress={() => setStep('tabs')}
        buttonLabel={'Close'}
      />
    </View>
  </View>


  const renderStep = () => {
    let step
    switch (Step) {
      case 'tabs':
        step = renderTabs
        break;
      case 'amount':
        step = renderAmount
        break;
      case 'pass':
        step = renderPass
        break;
      case 'finish':
        step = renderFinish
        break;
      default:
        break;
    }
    return step
  }

  const backButtonHandler = () => {
    setButtonDisabled(false)
    setScanQR(false)
    switch (Step) {
      case 'tabs':
        navigation.navigate("home")
        break;
      case 'amount':
        setStep('tabs')
        break;
      case 'pass':
        setStep('amount')
        break;
      default:
        setStep('tabs')
        break;
    }
  }

  return (
    <Screen
      preset="fixed"
      statusBar={"dark-content"}
      unsafe={true}
      showHeader
    >
      <View style={[styles.ROOT, { backgroundColor: (ScanQR && Step === 'tabs') ? '#000' : '#FFF' }]}>
        <View style={styles.CONTAINER}>
          <TouchableOpacity onPress={() => backButtonHandler()} style={styles.BACK_BUTON_CONTAINER}>
            <Icon name={"arrow-back"} size={23} color={!(ScanQR && Step === 'tabs') ? '#000' : '#FFF'} />
            <Text style={[styles.BACK_BUTON_LABEL, { color: !(ScanQR && Step === 'tabs') ? '#000' : '#FFF' }]}>{` Home`}</Text>
          </TouchableOpacity>
        </View>
        {renderStep()}
        {viewQR()}
        {confirmationModal()}
      </View>
    </Screen>
  )
})
