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

import QRCodeScanner from 'react-native-qrcode-scanner';
import QRCode from 'react-native-qrcode-svg'

export const QRScreen = observer(function QRScreen() {
  const navigation = useNavigation()
  const rootStore = useStores()
  const { loginStore } = rootStore

  const [ScanQR, setScanQR] = useState(true)
  const [ShowQR, setShowQR] = useState(false)
  const toggleSwitch = () => setScanQR(previousState => !previousState)

  const [Amount, setAmount] = useState('')

  const generateQR = () => {
    setShowQR(true)
  }

  const inputQR = () => <View style={{ flex: 1, justifyContent: 'space-between' }}>
    <View>
      <View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
        <Text style={styles.INPUT_LABEL_STYLE}>AMOUNT</Text>
        <Text style={styles.INPUT_LABEL_STYLE}>MAX. C$ 2,000</Text>
      </View>
      <View style={[styles.INPUT_STYLE_CONTAINER]}>
        <TextInput
          style={styles.INPUT_STYLE}
          keyboardType='numeric'
          onChangeText={t => {
            if (t) t = t.split(' ')[1]
            else t = ''
            setAmount(t)
          }}
          value={(Amount && Amount.split(' ')[0] == `C$ `) ? Amount : `C$ ` + Amount}
          placeholder={`Amount`}
        />
      </View>
    </View>
    <View>
      <TouchableOpacity onPress={() => setModalVisibility(true)} style={styles.NEED_HELP_CONTAINER}>
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
          value="http://awesome.link.qr"
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
          ? <QRCodeScanner onRead={e => console.log(' ===>>>>> ', e)} />
          : inputQR()
        }
        {viewQR()}
      </View>
    </Screen>
  )
})
