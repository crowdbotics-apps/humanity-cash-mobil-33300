import React, {useEffect, useState, useRef} from 'react';
import {observer} from 'mobx-react-lite';
import {View, TouchableOpacity, Modal, TextInput, Image, Keyboard, Alert} from 'react-native';
import {
  Text,
  Button,
  CustomSwitch,
  Screen,
} from '../../components';
import Icon from "react-native-vector-icons/MaterialIcons"
import styles from './qr-style';
import {COLOR} from '../../theme';
import {useNavigation, useIsFocused} from "@react-navigation/native"
import {useStores} from "../../models"
import {notifyMessage} from "../../utils/helpers"
import QRCodeScanner from 'react-native-qrcode-scanner';
import QRCode from 'react-native-qrcode-svg'
import Ionicons from "react-native-vector-icons/Ionicons"
import {BaseConfirmModal as UserModal} from '../../layouts'

import CurrencyInput from 'react-native-currency-input';

import TouchID from 'react-native-touch-id'
import {runInAction} from "mobx";

const optionalConfigObject = {
  title: 'Authentication Required', // Android
  imageColor: '#e00606', // Android
  imageErrorColor: '#ff0000', // Android
  sensorDescription: 'Touch sensor', // Android
  sensorErrorDescription: 'Failed', // Android
  cancelText: 'Cancel', // Android
  fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
  unifiedErrors: false, // use unified error messages (default false)
  passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
};

// steps = ['tabs', 'amount', 'pass', 'finish']
const maxAmount = 2000

export const QRScreen = observer(function QRScreen(props: any) {
  const navigation = useNavigation()
  const rootStore = useStores()
  const isFocused = useIsFocused();
  const {loginStore} = rootStore

  const userToPay = useRef(null);

  const [Step, setStep] = useState('tabs')
  const [QR, setQR] = useState(null)
  const [Amount, setAmount] = useState()
  const [RoundedAmount, setRoundedAmount] = useState(0);
  const [Loading, setLoading] = useState(false)
  const [SkipPass, setSkipPass] = useState(true) // set true to skip pass
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
  const [disableClose, setDisableClose] = useState(false)

  const [AmountError, setAmountError] = useState(false)

  const pressHandler = (round) => {
    if (loginStore.ProfileData.allow_touch_id) {
      TouchID.authenticate('tto check the user', optionalConfigObject)
        .then(success => {
          if (round) {
            setShowConfirmationModal(false)
            SkipPass ? transferCurrency(round) : setStep('pass')
          } else {
            setShowConfirmationModal(false)
            SkipPass ? transferCurrency(round) : setStep('pass')
          }
        })
        .catch(error => {
          Alert.alert('Authentication Failed');
        });
    } else {
      SkipPass ? transferCurrency(round) : setStep('pass')
    }
  }

  const transferCurrency = (round) => {

    const qrParams = props?.route?.params?.QR
    let newAmount
    if (qrParams) {
      newAmount = Amount
    } else if (qrParams === undefined) {
      newAmount = Amount
    } else {
      newAmount = QR?.amount
    }

    const roundedAmount = Math.ceil(parseFloat(newAmount))
    let diff
    if (round) {
      diff = roundedAmount - parseFloat(newAmount)
    } else {
      diff = 0
    }


    if (!QR) return

    setLoading(true)
    setTransactionErrorMsg('')

    const data = {
      "from": loginStore?.getProfilesId[loginStore.getSelectedAccount],
      "to": QR?.to,
      "from_is_consumer": loginStore.getSelectedAccount === 'consumer',
      "to_is_consumer": QR?.to_is_consumer,
      "password": Pass || null,
      "amount": newAmount,
      "roundup": diff,
    }

    __DEV__ && console.log('qr data', data)

    loginStore.environment.api
      .sendMoney(data)
      .then((result: any) => {
        setLoading(false)
        setShowConfirmationModal(false)
        if (result.kind === "ok") {
          getBalanceData()
          setTransactionSucceed(true)
          setStep('finish')
        } else if (result.kind === "bad-data") {
          setTransactionSucceed(false)
          setStep('finish')
          const errors = result.errors
          setTransactionErrorMsg(errors)
        }
      }).catch((err) => {
      notifyMessage(err)
      setShowConfirmationModal(false)
    })
  }

  const viewQR = () => {
    return (
      <UserModal
        disable={Loading}
        visible={ShowQR}
        closeModalAction={() => {
          if (!disableClose) {
            setShowQR(false)
            setPayerSetAmount(false)
          } else {
            navigation.navigate("home")
          }
        }}
        username={loginStore.getSelectedAccount === 'consumer' ? loginStore.ProfileData.full_name : loginStore.getAllData.business_name}
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
        <Text style={[styles.STEP_TITLE, {color: loginStore.getAccountColor}]}>
          {!PayerSetAmount && `C$ ${Amount}`}
        </Text>
      </UserModal>
    )
  }

  const confirmationModal = () => (
    <UserModal
      disable={Loading}
      visible={ShowConfirmationModal}
      closeModalAction={() => {
        if (!disableClose) {
          setShowConfirmationModal(false)
        } else {
          navigation.navigate("home")
        }
      }}
      username={userToPay.current?.username}
      imgSrc={userToPay.current?.photo}
      type='pay'
    >
      <View>
        <Text style={[{color: loginStore.getAccountColor}, styles.CONFIRM_MODAL_AMOUNT]}>
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
          buttonStyle={[styles.CONFIRM_MODAL_PAY_BUTTON, {borderColor: loginStore.getAccountColor}]}
          buttonLabel={`Pay C$ ${Amount} `}
          buttonLabelStyle={styles.COLOR_BLACK}
          onPress={() => pressHandler(false)}
          disabled={Loading}
        />
        <Button
          buttonStyle={[{backgroundColor: loginStore.getAccountColor}, styles.CONFIRM_MODAL_PAY_BUTTON_ROUND]}
          buttonLabel={`Round up to C$ ${RoundedAmount}`}
          onPress={() => pressHandler(true)}
          disabled={Loading}
        />
      </View>
      <Text style={styles.CONFIRM_MODAL_SECONDARY_TEXT}>THE ROUND UP IS A NON REFUNDABLE DONATION</Text>
    </UserModal>
  )

  const readQRAction = (data: any) => {
    setDisableClose(true)
    let dataJson

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
    // parsing amount
    let amount
    try {
      amount = parseFloat(dataJson?.amount)
    } catch {
      amount = 0
    }


    setQR(dataJson)
    setAmount(amount)
    if (amount > 0) {
      setStep('amount')
      setShowConfirmationModal(true)
    } else {
      setStep('amount')
    }
  }

  const getBalanceData = () => {
    loginStore.environment.api
        .getBalanceData()
        .then((result: any) => {
          if (result.kind === "ok") {
            if (loginStore?.balance?.[loginStore.getSelectedAccount] !== result.data?.[loginStore.getSelectedAccount]) {
              setShowQR(false)
              setPayerSetAmount(false)
              loginStore.setBalanceData(result.data)
              navigation.navigate('myTransactions')
            }
          } else if (result.kind === "bad-data") {
            const key = Object.keys(result?.errors)[0]
            const msg = `${key}: ${result?.errors?.[key][0]}`
            notifyMessage(msg)
          } else {
            notifyMessage(null)
          }
        })
  }

  useEffect(() => {
    const checkTransactionLoop = setInterval(() => {
      if (!ShowQR) clearInterval(checkTransactionLoop)
      getBalanceData()
    }, 10000);
    return () => clearInterval(checkTransactionLoop);

  },[ShowQR])

  useEffect(() => {
    if (Number(Amount) > 0) {
      if (parseFloat(Amount) % 1 !== 0) {
        const rounded = Math.ceil(parseFloat(Amount));
        setRoundedAmount(rounded);
      } else setRoundedAmount(parseFloat(Amount));
    } else setAmountError(true)
    setButtonDisabled(!(Number(Amount) > 0));
  }, [Amount]);

  useEffect(() => {
    if (isFocused) {

      loginStore.getSelectedAccount === 'consumer'
        ? setScanQR(true)
        : setScanQR(false)

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
    } else {
      setStep('tabs')
      setQR(null)
      setAmount(0)
      setRoundedAmount(0);
      setLoading(false)
      setSkipPass(true)
      setPass('')
      setHidePass(true)
      setTransactionSucceed(true)
      setTransactionErrorMsg('')
      setPayerSetAmount(true)
      setButtonDisabled(false)
      setScanQR(false)
      setShowQR(false)
      setShowConfirmationModal(false)
      setAmountError(false)
    }

  }, [isFocused])



  const inputQR = () => <View style={{ flex: 1, justifyContent: 'space-between' }}>
    <View>
      <View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
        <Text style={styles.INPUT_LABEL_STYLE}>AMOUNT</Text>
      </View>

      <View style={AmountError ? styles.INPUT_STYLE_CONTAINER_ERROR : styles.INPUT_STYLE_CONTAINER}>
        <Text style={[styles.INPUT_LABEL_STYLE, { fontSize: 15 }]}> C$</Text>
        <CurrencyInput
          style={styles.INPUT_STYLE}
          value={Amount}
          precision={2}
          delimiter=","
          separator="."
          onChangeValue={t => {
            if (t > maxAmount) setAmountError(true)
            else setAmountError(false)
            setAmount(t)
          }}
        />
      </View>

    </View>
    <View>
      <TouchableOpacity style={styles.NEED_HELP_CONTAINER} onPress={() => [setShowQR(true), setPayerSetAmount(true), setAmount(0)]}>
        <Text style={styles.NEED_HELP_LINK}>Let the payer choose the amount</Text>
      </TouchableOpacity>
      <Button
        buttonStyle={{
          backgroundColor: (ButtonDisabled || AmountError) ? `${loginStore.getAccountColor}40` : loginStore.getAccountColor,
        }}
        onPress={() => {
          setDisableClose(false)
          setShowQR(true)
        }}
        buttonLabel={'Next'}
        disabled={(ButtonDisabled || AmountError)}
      />
    </View>
  </View>

  const renderTabs = (scan) => <>
    <View style={styles.STEP_CONTAINER}>
      <View style={styles.SWITCH_CONTAINER}>
        <CustomSwitch
          selectionMode={scan ? 1 : 2}
          roundCorner={true}
          option1={'Pay'}
          option2={'Receive'}
          onSelectSwitch={toggleSwitch}
          selectionColor={COLOR.PALETTE.blue}
        />
      </View>
    </View>
    {scan
      ? <QRCodeScanner onRead={e => readQRAction(e.data)}/>
      : inputQR()
    }
  </>

  const renderAmount = <View style={styles.ROOT_MODAL_PASS}>
      <View style={styles.CONTAINER}>
        <Text style={[styles.STEP_TITLE_AMOUNT, {color: loginStore.getAccountColor}]}>Specify payment</Text>
        <View style={styles.LINE_AMOUNT}/>
        <Text style={styles.STEP_SUB_TITLE_AMOUNT}>Select the amount of Currents you would like to send.</Text>
        <View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
          <Text style={styles.INPUT_LABEL_STYLE}>AMOUNT</Text>
        <Text style={styles.INPUT_LABEL_STYLE}>MAX. CURRENTS 2,000</Text>
      </View>
      <View style={AmountError ? styles.INPUT_STYLE_CONTAINER_ERROR : styles.INPUT_STYLE_CONTAINER}>
        <Text style={[styles.INPUT_LABEL_STYLE, { fontSize: 15 }]}> C$</Text>
        <CurrencyInput
          style={styles.INPUT_STYLE}
          value={Amount}
          precision={2}
          delimiter=","
          separator="."
          onChangeValue={t => {
            if (t > maxAmount) setAmountError(true)
            else setAmountError(false)
            setAmount(t)
          }}
        />
      </View>
    </View>
    <View style={styles.CONTAINER}>
      <Button
        buttonStyle={{backgroundColor: (Loading || AmountError) ? `${loginStore.getAccountColor}40` : loginStore.getAccountColor}}
          loading={Loading}
          disabled={Loading || AmountError}
          onPress={() => setShowConfirmationModal(true)}
          buttonLabel={'Confirm'}
        />
      </View>
    </View>

  const renderPass = <View style={styles.ROOT_MODAL_PASS}>
    <View style={styles.CONTAINER}>
      <Text style={[styles.STEP_TITLE_AMOUNT, {color: loginStore.getAccountColor}]}>Verify with password</Text>
      <View style={styles.LINE_AMOUNT}/>
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
          <Ionicons name="eye" color={"#39534480"} size={20}/>
        </TouchableOpacity>
      </View>
    </View>
    <View style={styles.CONTAINER}>
      <Button
        buttonStyle={{backgroundColor: loginStore.getAccountColor}}
        loading={Loading}
        onPress={() => transferCurrency()}
        buttonLabel={'Confirm'}
      />
    </View>
  </View>

  const renderFinish = <View style={styles.ROOT_MODAL_PASS}>
    <View style={styles.CONTAINER}>
      <Text style={[styles.STEP_TITLE_PASS, {color: loginStore.getAccountColor}]}>
        {TransactionSucceed ? 'Succeeded' : 'Whoops, something went wrong.'}
      </Text>
      <Text style={[styles.STEP_SUB_TITLE, {margin: 10}]}>{TransactionErrorMsg}</Text>
    </View>
    <View style={styles.CONTAINER}>
      {!TransactionSucceed && <TouchableOpacity onPress={() => setStep('amount')} style={styles.NEED_HELP_CONTAINER}>
        <Text style={styles.NEED_HELP_LINK}>Try a different amount</Text>
      </TouchableOpacity>}
      <Button
        buttonStyle={{backgroundColor: loginStore.getAccountColor}}
        loading={Loading}
        onPress={() => TransactionSucceed ? navigation.navigate('home') : setStep('amount')}
        buttonLabel={'Close'}
      />
    </View>
  </View>

  const renderStep = () => {
    let step
    switch (Step) {
      case 'tabs':
        step = renderTabs(ScanQR)
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
        props?.route?.params?.QR ? navigation.navigate('contact') : setStep('tabs')
        break;
      case 'pass':
        setStep('amount')
        break;
      case 'finish':
        navigation.navigate("home")
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
      <View style={[styles.ROOT, {backgroundColor: (ScanQR && Step === 'tabs') ? '#000' : '#FFF'}]}>
        <View style={styles.CONTAINER}>
          <TouchableOpacity onPress={() => backButtonHandler()} style={styles.BACK_BUTON_CONTAINER}>
            <Icon name={"arrow-back"} size={23} color={!(ScanQR && Step === 'tabs') ? '#000' : '#FFF'}/>
            <Text style={[styles.BACK_BUTON_LABEL, {color: !(ScanQR && Step === 'tabs') ? '#000' : '#FFF'}]}>
              {(Step === 'tabs' || Step === 'finish') ? ' Home' : ' Back'}
            </Text>
          </TouchableOpacity>
        </View>
        {renderStep()}
        {viewQR()}
        {confirmationModal()}
      </View>
    </Screen>
  )
})
