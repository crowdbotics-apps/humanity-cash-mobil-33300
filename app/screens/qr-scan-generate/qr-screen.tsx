import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { View, TouchableOpacity, Modal, TextInput, Image } from 'react-native';
import {
  Text,
  Button,
  CustomSwitch,
  Screen,
} from '../../components';
import Icon from "react-native-vector-icons/MaterialIcons"
import styles from './qr-style';
import { COLOR } from '../../theme';
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import { getErrorMessage, notifyMessage } from "../../utils/helpers"
import QRCodeScanner from 'react-native-qrcode-scanner';
import QRCode from 'react-native-qrcode-svg'
import Ionicons from "react-native-vector-icons/Ionicons"

export const QRScreen = observer(function QRScreen() {
  const navigation = useNavigation()
  const rootStore = useStores()
  const { loginStore } = rootStore

  const [ScanQR, setScanQR] = useState(true)
  const [QR, setQR] = useState(null)
  const [ShowQR, setShowQR] = useState(false)

  const [ShowPassModal, setShowPassModal] = useState(false)
  const [Pass, setPass] = useState('')
  const [HidePass, setHidePass] = useState(true)
  const toggleSwitch = () => setScanQR(previousState => !previousState)

  const [Amount, setAmount] = useState('0')

  const [ShowBankModal, setShowBankModal] = useState(false)

  useEffect(() => {
    if (!loginStore.getBillingData.billing_data_added) setShowBankModal(true)
    else setShowBankModal(false)
  }, [])

  const bankModal = () => <Modal visible={ShowBankModal} transparent>
    <View style={styles.ROOT_MODAL}>
      <TouchableOpacity onPress={() => setShowBankModal(false)} style={styles.CLOSE_MODAL_BUTTON}>
        <Text style={styles.BACK_BUTON_LABEL}>{`Close `}</Text>
        <Icon name={"close"} size={20} color={'#8B9555'} />
      </TouchableOpacity>
      <View style={styles.MODAL_CONTAINER}>
        <View style={styles.MODAL_CONTENT}>
          <Text style={styles.STEP_TITLE}>Whoooops. You have to link your bank account first</Text>
          <Text style={styles.STEP_SUB_TITLE_MODAL}>Before you can load your wallet you have to first link your bank account. </Text>
          <TouchableOpacity style={[styles.MODAL_BUTTON, { backgroundColor: loginStore.getAccountColor }]} onPress={() => [navigation.navigate("linkBank", {}), setShowBankModal(false)]}>
            <Text style={styles.SUBMIT_BUTTON_LABEL}>Link my bank account</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View />
    </View>
  </Modal>

const generateQR = () => {
  setShowQR(true)
}

  const formatValue = value => {
    const strFormat = parseFloat(value).toFixed(2);
    const [firstPart, secondPart] = strFormat.split(".");
    return (
      firstPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
      (secondPart ? "." + secondPart : "")
    );
  };

  const passModal = () => (
      <Modal visible={ShowPassModal} transparent>
        <View style={styles.ROOT_MODAL_PASS}>
          <View style={styles.CONTAINER}>
            <TouchableOpacity onPress={() => setShowPassModal(false)} style={styles.BACK_BUTON_CONTAINER}>
              <Icon name={"arrow-back"} size={23} color={COLOR.PALETTE.black} />
              <Text style={styles.BACK_BUTON_LABEL}>{` Back`}</Text>
            </TouchableOpacity>
            <View style={styles.STEP_CONTAINER}>
              <Text style={[styles.STEP_TITLE_PASS, { color: loginStore.getAccountColor}]}>Verify with password</Text>

              <View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
                <Text style={styles.INPUT_LABEL_STYLE}>PASSWORD</Text>
              </View>
              <View style={styles.INPUT_STYLE_CONTAINER}>
                <TextInput
                  style={styles.PASS_INPUT_STYLE}
                  onChangeText={t => [setPass(t)]}
                  value={Pass}
                  secureTextEntry={HidePass}
                  placeholder={"*********"}
                />
                <TouchableOpacity onPress={() => setHidePass(!HidePass)}>
                  <Ionicons name="eye" color={"#39534480"} size={20} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.CONTAINER}>
            <TouchableOpacity onPress={() => {}} style={styles.FORGOT_PASSWORD_CONTAINER}>
              <Text style={styles.NEED_HELP_LINK}>Forgot password</Text>
            </TouchableOpacity>
            <Button
              buttonStyle={{
                backgroundColor: loginStore.getAccountColor,
              }}
              onPress={() => transferCurrency()}
              buttonLabel={'Confirm'}
            />
          </View>
        </View>
      </Modal>
    )


  const transferCurrency = () => {
    if (!QR) return
    const qrData = JSON.parse(QR)
    const data = {
      "from" : loginStore.getAllData.id,
      "to": qrData.to,
      "from_is_consumer": loginStore.getSelectedAccount === 'consumer',
      "to_is_consumer": qrData.to_is_consumer,
      "password" : Pass,
      "amount" : qrData.amount,
      "roundup" : 0,
    }
    loginStore.environment.api
      .sendMoney(data)
      .then((result: any) => {
        console.log(' result ===>>> ', JSON.stringify(result, null, 2 ))
        if (result.kind === "ok") {
          console.log(' result ok')
        } else if (result.kind === "bad-data") {
          const errors = result.errors 
          notifyMessage(getErrorMessage(errors))
        } else {
          loginStore.reset()
          notifyMessage(null)
        }
      }).catch((err) => notifyMessage(getErrorMessage(err)))
  }

  const inputQR = () => <View style={{ flex: 1, justifyContent: 'space-between' }}>
    <View>
      <View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
        <Text style={styles.INPUT_LABEL_STYLE}>AMOUNT</Text>
        <Text style={styles.INPUT_LABEL_STYLE}>MAX. C$ 2,000</Text>
      </View>
      <View style={styles.INPUT_STYLE_CONTAINER}>
        {/* <Text style={styles.INPUT_LABEL_STYLE}> C$</Text> */}
        <TextInput
          style={styles.INPUT_STYLE}
          keyboardType='numeric'
          onChangeText={t => {
            let temp = t.replace('C', '').replace('$', '').replace(' ', '')
            temp = temp.replace(/[^0-9]/g, '')
            temp = temp.replace(",", ".")
            setAmount(temp)
          }}
          // value={`C$ ` + Amount}
          value={(Amount && Amount.split(' ')[0] === `C$ `) ? Amount : `C$ ` + Amount}
          placeholder={`Amount`}
        />
      </View>
    </View>
    <View>
      <TouchableOpacity style={styles.NEED_HELP_CONTAINER} onPress={() => setShowQR(true)}>
        <Text style={styles.NEED_HELP_LINK}>Let the payer choose the amount</Text>
      </TouchableOpacity>
      <Button
        buttonStyle={{
          backgroundColor: loginStore.getAccountColor,
        }}
        onPress={() => setShowQR(true)}
        buttonLabel={'Next'}
      />
    </View>
  </View>

  const viewQR = () => <Modal transparent visible={ShowQR}>
    <View style={styles.ROOT_MODAL}>
      <TouchableOpacity
        onPress={() => setShowQR(false)}
        style={styles.CLOSE_MODAL_BUTTON}
      >
        <Text style={styles.BACK_BUTON_LABEL}>{`Close `}</Text>
        <Icon name={"close"} size={20} color={'#0D0E21'} />
      </TouchableOpacity>
      <View style={styles.MODAL_CONTAINER}>
        <View style={styles.USER_IMAGE_CONTAINER}>
          <Image
            resizeMode="cover"
            source={{ uri: loginStore.ProfileData.profile_picture }}
            style={styles.USER_IMAGE}
          />
        </View>
        <Text style={[styles.STEP_SUB_TITLE, { color: loginStore.getAccountColor }]}>{loginStore.ProfileData.username}</Text>
        <QRCode
          value={
            JSON.stringify({
              to: loginStore.getAllData.id,
              to_is_consumer: loginStore.getSelectedAccount === 'consumer',
              amount: Amount
            })
          }
          size={200}
        />
        <Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>C$ {Amount}</Text>
      </View>
      <View />
    </View>
  </Modal>

  return (
    <Screen
      preset="fixed"
      statusBar={"dark-content"}
      unsafe={true}
      showHeader
    >
      <View style={[styles.ROOT, { backgroundColor: ScanQR ? '#000' : '#FFF' }]}>
        <View style={styles.CONTAINER}>
          <TouchableOpacity onPress={() => navigation.navigate("home", {})} style={styles.BACK_BUTON_CONTAINER}>
            <Icon name={"arrow-back"} size={23} color={!ScanQR ? '#000' : '#FFF'} />
            <Text style={[styles.BACK_BUTON_LABEL, { color: !ScanQR ? '#000' : '#FFF' }]}>{` Home`}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.STEP_CONTAINER}>
          <View style={styles.SWITCH_CONTAINER}>
            <CustomSwitch
              selectionMode={1}
              roundCorner={true}
              option1={'Pay'}
              option2={'Receive'}
              onSelectSwitch={toggleSwitch}
              selectionColor={COLOR.PALETTE.blue}
            />
          </View>
        </View>
        {ScanQR
          ? <QRCodeScanner onRead={e => setQR(e)} /> // TODO: action when read
          : inputQR()
        }
        {viewQR()}
        {bankModal()}
        {passModal()}
      </View>
    </Screen>
  )
})
