import React, { useEffect, useState, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { View, TouchableOpacity, Modal, TextInput, Image } from 'react-native';
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
import {BaseConfirmModal as UserModal} from '../../layouts'

export const QRScreen = observer(function QRScreen(props: any) {
  const navigation = useNavigation()
  const rootStore = useStores()
  const { loginStore } = rootStore
  const isFocused = useIsFocused();
  const [QR, setQR] = useState(null)
  const [Pass, setPass] = useState('')
  const [Amount, setAmount] = useState('0')
  const [RoundedAmount, setRoundedAmount] = useState(0);
  const toggleSwitch = () => setScanQR(previousState => !previousState)
  
  /* boolean states */
  const [TransactionSucceed, setTransactionSucceed] = useState(true)
  const [ShowQR, setShowQR] = useState(false)
  const [PayerSetAmount, setPayerSetAmount] = useState(true)
  const [HidePass, setHidePass] = useState(true)
  const [ButtonDisabled, setButtonDisabled] = useState(false)
  const [ScanQR, setScanQR] = useState(false)
  const [Loading, setLoading] = useState(false)
  
  /* modals */
  const [ShowAmountModal, setShowAmountModal] = useState(false)
  const [showConfirmTransactionModal, setShowConfirmTransactionModal] = useState(false);
  const [ShowPassModal, setShowPassModal] = useState(false)
  const [ShowFinishModal, setShowFinishModal] = useState(false)
  const [ShowBankModal, setShowBankModal] = useState(false)

  const userToPay = useRef(null);

  const bankModal = () =>
    <ConnectBankModal
      visible={ShowBankModal}
      buttonStyle={{ backgroundColor: loginStore.getAccountColor }}
      buttonAction={() => [navigation.navigate("linkBank"), setShowBankModal(false)]}
		  onPressHome={() => [navigation.navigate("home"), setShowBankModal(false)]}
    />

  const passModal = () => (
    <Modal visible={ShowPassModal}>
      {ShowAmountModal
      ? <View style={styles.ROOT_MODAL_PASS}>
      <View style={styles.CONTAINER}>

        <TouchableOpacity onPress={() => [
          navigation.navigate('contact'),
          setShowAmountModal(false),
          setShowPassModal(false)
        ]}
        style={styles.BACK_BUTON_CONTAINER}
        >
          <Icon name={"arrow-back"} size={23} color={COLOR.PALETTE.black} />
          <Text style={styles.BACK_BUTON_LABEL}>{` Back`}</Text>
        </TouchableOpacity>

        <Text style={[styles.STEP_TITLE_AMOUNT, { color: loginStore.getAccountColor }]}>Specify payment</Text>
        <View style={styles.LINE_AMOUNT} />
        <Text style={styles.STEP_SUB_TITLE_AMOUNT}>Select the amount of Currents you would like to send.</Text>
        <View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
          <Text style={styles.INPUT_LABEL_STYLE}>AMOUNT</Text>
          <Text style={styles.INPUT_LABEL_STYLE}>MAX. CURRENTS 2,000</Text>
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
      <View style={styles.CONTAINER}>
        <Button
          buttonStyle={{
            backgroundColor: loginStore.getAccountColor,
          }}
          loading={Loading}
          onPress={() => [
            setShowConfirmTransactionModal(true),
            setShowPassModal(false),
          ]}
          buttonLabel={'Confirm'}
        />
      </View>
    </View>
      : <View style={styles.ROOT_MODAL_PASS}>
        <View style={styles.CONTAINER}>
          <TouchableOpacity onPress={() => setShowPassModal(false)} style={styles.BACK_BUTON_CONTAINER}>
            <Icon name={"arrow-back"} size={23} color={COLOR.PALETTE.black} />
            <Text style={styles.BACK_BUTON_LABEL}>{` Back`}</Text>
          </TouchableOpacity>
          <View style={styles.STEP_CONTAINER}>
            <Text style={[styles.STEP_TITLE_PASS, { color: loginStore.getAccountColor }]}>Verify with password</Text>

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
        </View>
        <View style={styles.CONTAINER}>
          <Button
            buttonStyle={{
              backgroundColor: loginStore.getAccountColor,
            }}
            loading={Loading}
            onPress={() => transferCurrency()}
            buttonLabel={'Confirm'}
          />
        </View>
      </View>
}
    </Modal>
  )

  const FinishReturn = () => <Modal visible={ShowFinishModal}>
  <View style={styles.ROOT_MODAL_PASS}>
    <View style={styles.CONTAINER}>
      <View style={styles.BACK_BUTON_CONTAINER} />
        
      <View style={styles.STEP_CONTAINER}>
        <Text style={[styles.STEP_TITLE_PASS, { color: loginStore.getAccountColor }]}>
          {TransactionSucceed
            ? 'Succeeded'
            : 'Whoops, something went wrong.'
            }
          </Text>
      </View>
    </View>
    <View style={styles.CONTAINER}>
      <Button
        buttonStyle={{
          backgroundColor: loginStore.getAccountColor,
        }}
        loading={Loading}
        onPress={() =>  TransactionSucceed ? setShowFinishModal(false) : transferCurrency() }
        buttonLabel={TransactionSucceed
          ? 'Confirm'
          : 'Try again'}
      />
    </View>
  </View>
</Modal>

  const transferCurrency = () => {
    if (!QR) return
    setLoading(true)
    let temp = QR.replaceAll('”','"')
    temp = temp.replaceAll('“','"')
    temp = temp.replaceAll("'","")
    const qrData = JSON.parse(temp)
    const data = {
      "from": loginStore?.getProfilesId[loginStore.getSelectedAccount],
      "to": qrData.to,
      "from_is_consumer": loginStore.getSelectedAccount === 'consumer',
      "to_is_consumer": qrData.to_is_consumer,
      "password": Pass,
      "amount": props?.route?.params?.QR ? Amount : qrData.amount,
      "roundup": 0,
    }

    loginStore.environment.api
      .sendMoney(data)
      .then((result: any) => {
        setLoading(false)
        if (result.kind === "ok") {
          setTransactionSucceed(true)
          setShowFinishModal(true)
          setShowPassModal(false)
        } else if (result.kind === "bad-data") {
          setTransactionSucceed(false)
          setShowFinishModal(true)
          setShowPassModal(false)
          const errors = result.errors
          notifyMessage(errors)
        } else if (result.kind === "unauthorized") {
          notifyMessage('bad password')
        }
      }).catch((err) => notifyMessage(err))
  }

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

  const viewQR = () => 
    <UserModal 
      visible={ShowQR}
      closeModalAction={() => [setShowQR(false), setPayerSetAmount(false)]}
      username={loginStore.ProfileData.username}
      imgSrc={loginStore.ProfileData.profile_picture}
    >
      <QRCode
        value={
          JSON.stringify({
            to: loginStore?.getProfilesId[loginStore.getSelectedAccount],
            to_is_consumer: loginStore.getSelectedAccount === 'consumer',
            amount: Amount
          })
        }
        size={200}
      />
      <Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>
        { !PayerSetAmount &&
          `C$ ${Amount}`
        }
      </Text>
    </UserModal>

  const ConfirmTransactionModal = () => (
    <UserModal
      visible={showConfirmTransactionModal}
      closeModalAction={() => setShowConfirmTransactionModal(false)}
      username={userToPay.current?.username}
      imgSrc={userToPay.current?.photo}
      type='pay'
    > 
      <View>
        <Text
          style={[{color: loginStore.getAccountColor}, styles.CONFIRM_MODAL_AMOUNT]}
        >
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
          buttonStyle={styles.CONFIRM_MODAL_PAY_BUTTON}
          buttonLabel={`Pay C$ ${Amount} `}
          buttonLabelStyle={styles.COLOR_BLACK}
          onPress={() => [
            setShowConfirmTransactionModal(false), setShowAmountModal(false), setShowPassModal(true)
          ]}
        />
          <Button 
            buttonStyle={[{backgroundColor: loginStore.getAccountColor}, styles.CONFIRM_MODAL_PAY_BUTTON_ROUND]} 
            buttonLabel={`Round up to C$ ${RoundedAmount}`}
            onPress={() => [
              setShowConfirmTransactionModal(false), setShowAmountModal(false), setShowPassModal(true),
              setAmount(RoundedAmount.toString())
            ]}
          />
      </View>
      <Text style={styles.CONFIRM_MODAL_SECONDARY_TEXT}>THE ROUND UP IS A NON REFUNDABLE DONATION</Text>
    </UserModal>
  )

  useEffect(() => {
    if (isFocused) {
      // if (!loginStore.getBillingData.billing_data_added) setShowBankModal(true)
      // else setShowBankModal(false)
      if (props?.route?.params) {
        if (props?.route?.params?.QR) {
          const qrInfo = props?.route?.params?.QR;
          setQR(qrInfo)
          setShowAmountModal(true)
          // setShowConfirmTransactionModal(true)
          setShowPassModal(true)
          try {
            const userInfo = JSON.parse(qrInfo);
            userToPay.current = {
              username: userInfo?.to_username ?? '',
              photo: userInfo?.to_profile_photo ?? '',
            }
          } catch(error) {
            alert(error)
          }
        } 
      }
    }
  }, [isFocused])

  useEffect(() => {
    if(Number(Amount) > 0) {
      if(parseFloat(Amount) % 1 !== 0) {
        const rounded = Math.round(parseFloat(Amount));
        setRoundedAmount(rounded);
      } else setRoundedAmount(parseFloat(Amount));
    }
    setButtonDisabled(!(Number(Amount) > 0));
  }, [Amount]);

  return (
    <Screen
      preset="fixed"
      statusBar={"dark-content"}
      unsafe={true}
      showHeader
    >
      <View style={[styles.ROOT, { backgroundColor: ScanQR ? '#000' : '#FFF' }]}>
        <View style={styles.CONTAINER}>
          <TouchableOpacity onPress={() => navigation.navigate("home")} style={styles.BACK_BUTON_CONTAINER}>
            <Icon name={"arrow-back"} size={23} color={!ScanQR ? '#000' : '#FFF'} />
            <Text style={[styles.BACK_BUTON_LABEL, { color: !ScanQR ? '#000' : '#FFF' }]}>{` Home`}</Text>
          </TouchableOpacity>
        </View>
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
          ? <QRCodeScanner onRead={e => {
              setQR(e.data) 
              setShowPassModal(true)
            }}
            
            /> // TODO: action when read
          : inputQR()
        }
        {viewQR()}
        {bankModal()}
        {passModal()}
        {FinishReturn()}
        {ConfirmTransactionModal()}
      </View>
    </Screen>
  )
})
  