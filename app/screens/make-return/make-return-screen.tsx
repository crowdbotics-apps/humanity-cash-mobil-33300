import React, { useEffect, useState, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { View, TouchableOpacity, Modal, TextInput, ActivityIndicator } from 'react-native';
import {
    Text,
    Button,
    CustomSwitch,
    Screen,
    ConnectBankModal
} from '../../components';
import Icon from "react-native-vector-icons/MaterialIcons"
import styles from './make-return-style';
import { COLOR } from '../../theme';
import { useNavigation, useIsFocused } from "@react-navigation/native"
import { useStores } from "../../models"
import { getErrorMessage, notifyMessage } from "../../utils/helpers"
import QRCodeScanner from 'react-native-qrcode-scanner';
import QRCode from 'react-native-qrcode-svg'
import Ionicons from "react-native-vector-icons/Ionicons"
import { BaseConfirmModal as UserModal } from '../../layouts'

// steps = ['scan', 'confirm', 'pending', 'finish']

export const MakeRetun = observer(function MakeRetun(props: any) {
    const navigation = useNavigation()
    const rootStore = useStores()
    const isFocused = useIsFocused();
    const { loginStore } = rootStore

    const userToPay = useRef(null);

    const [Step, setStep] = useState('scan')
    const [QR, setQR] = useState(null)
    const [Amount, setAmount] = useState('0')
    const [Loading, setLoading] = useState(false)

    const [TransactionSucceed, setTransactionSucceed] = useState(true)
    const [TransactionErrorMsg, setTransactionErrorMsg] = useState('')
    const [PayerSetAmount, setPayerSetAmount] = useState(true)
    const [ButtonDisabled, setButtonDisabled] = useState(false)

    const [AmountError, setAmountError] = useState(false)

    const transferCurrency = () => {
        if (!QR) return
        setLoading(true)
        setStep('pending')
        setTransactionErrorMsg('')
        const data = {
            "from": loginStore?.getProfilesId[loginStore.getSelectedAccount],
            "to": QR?.to,
            "from_is_consumer": loginStore.getSelectedAccount === 'consumer',
            "to_is_consumer": QR?.to_is_consumer,
            "password": null,
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
                }
            }).catch((err) => notifyMessage(err))
    }

    const renderConfirmation = <>
        <Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>My profile</Text>
        <View style={styles.LINE} />
        <Text style={styles.STEP_SUB_TITLE}>TRANSACTION DETAILS.</Text>
        <Text style={[styles.RETURN_ITEM_MODAL, { color: loginStore.getAccountColor }]}>{QR?.item}</Text>
        <View style={styles.RETURN_CONTAINER_MODAL}>
            <Text style={[styles.RETURN_AMOUNT, { color: loginStore.getAccountColor }]}>C$ {QR?.amount}</Text>
            <View style={styles.RETURN_DETAIL_CONTAINER}>
                <Text style={styles.RETURN_DETAIL_LABEL}>TRANSACTION ID</Text>
                <Text style={styles.RETURN_DETAIL_LABEL}>0567882HDJH2JE20</Text>
            </View>
            <View style={styles.RETURN_DETAIL_CONTAINER}>
                <Text style={styles.RETURN_DETAIL_LABEL}>TYPE</Text>
                <Text style={styles.RETURN_DETAIL_LABEL}>CUSTOMER SALE</Text>
            </View>
            <View style={styles.RETURN_DETAIL_CONTAINER}>
                <Text style={styles.RETURN_DETAIL_LABEL}>DATE</Text>
                <Text style={styles.RETURN_DETAIL_LABEL}>4:22 , JUN 17, 2021</Text>
            </View>
        </View>
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <View>
                <View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
                    <Text style={styles.INPUT_LABEL_STYLE}>RETURN AMOUNT</Text>
                    <Text style={styles.INPUT_LABEL_ERROR}>{AmountError ? 'MAX. TOTAL TRANSACTION AMOUNT' : ''}</Text>
                </View>
                <View style={AmountError ? styles.INPUT_STYLE_CONTAINER_ERROR : styles.INPUT_STYLE_CONTAINER}>
                    {/* <Text style={styles.INPUT_LABEL_STYLE}> C$</Text> */}
                    <TextInput
                        placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
                        style={styles.INPUT_STYLE}
                        keyboardType='numeric'
                        onChangeText={t => {
                            let temp = t.replace('C', '').replace('$', '').replace(' ', '')
                            temp = temp.replace(",", ".")
                            // review max amount
                            const maxAmount = QR?.amount || 0
                            if (parseFloat(temp) > maxAmount) setAmountError(true)
                            else setAmountError(false)

                            setAmount(temp)
                        }}
                        value={(Amount && Amount.split(' ')[0] === `C$ `) ? Amount : `C$ ` + Amount}
                        placeholder={`Amount`}
                    />
                </View>
            </View>
            <Button
                buttonStyle={{
                    backgroundColor: (AmountError) ? `${loginStore.getAccountColor}40` : loginStore.getAccountColor,
                }}
                onPress={() => transferCurrency()}
                buttonLabel={'Return amount'}
                disabled={(AmountError)}
            />
        </View>
    </>

    const renderPending = <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={styles.CONTAINER}>
            <Text style={[styles.PENDING_TITLE, { color: loginStore.getAccountColor }]}>Pending...</Text>
            <Text style={styles.SUB_TITLE}>This usually takes 5-6 seconds</Text>
        </View>
        <ActivityIndicator style={styles.ACTIVITY} size="large" color={'black'} />
    </View>

    const renderFinish = <View style={styles.ROOT_MODAL_PASS}>
        <View style={styles.CONTAINER}>
            <Text style={[styles.STEP_TITLE_PASS, { color: loginStore.getAccountColor }]}>
                {TransactionSucceed ? 'Succeeded' : 'Whoops, something went wrong.'}
            </Text>
            <Text style={[styles.STEP_SUB_TITLE_ERROR, { margin: 10 }]}>{TransactionErrorMsg}</Text>
        </View>
        <View style={styles.CONTAINER}>
            <TouchableOpacity onPress={() => setStep('confirm')} style={styles.NEED_HELP_CONTAINER}>
                <Text style={styles.NEED_HELP_LINK}>Try a different amount</Text>
            </TouchableOpacity>
            <Button
                buttonStyle={{ backgroundColor: loginStore.getAccountColor }}
                loading={Loading}
                onPress={() => setStep('scan')}
                buttonLabel={'Close'}
            />
        </View>
    </View>

    const readQRAction = (data: any) => {
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
        setQR(dataJson)
        setStep('confirm')
    }

    useEffect(() => {
        setButtonDisabled(!(Number(Amount) > 0));
    }, [Amount]);

    useEffect(() => {
        if (isFocused) setStep('scan')
    }, [isFocused])

    const renderStep = () => {
        let step
        switch (Step) {
            case 'scan':
                step = <QRCodeScanner 
                 onRead={e => readQRAction(e.data)} />
                break;
            case 'confirm':
                step = renderConfirmation
                break;
            case 'pending':
                step = renderPending
                break;
            case 'finish':
                step = renderFinish
                break;
            default:
                step = <QRCodeScanner 
                 onRead={e => readQRAction(e.data)} />
                break;
        }
        return step
    }

    const backButtonHandler = () => {
        setButtonDisabled(false)

        switch (Step) {
            case 'scan':
                // setSkipPass(false) // removed to skip pass
                navigation.navigate("home")
                break;
            case 'amount':
                props?.route?.params?.QR ? navigation.navigate('contact') : setStep('scan')
                break;
            case 'pass':
                setStep('amount')
                break;
            case 'finish':
                // setSkipPass(false) // removed to skip pass
                navigation.navigate("home")
                break;
            default:
                setStep('scan')
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
            <View style={[styles.ROOT, { backgroundColor: (Step === 'scan') ? '#000' : '#FFF' }]}>
                <View style={styles.CONTAINER}>

                    <TouchableOpacity onPress={() => backButtonHandler()} style={styles.BACK_BUTON_CONTAINER}>
                        <Icon name={"arrow-back"} size={23} color={!(Step === 'scan') ? '#000' : '#FFF'} />
                        <Text style={[styles.BACK_BUTON_LABEL, { color: !(Step === 'scan') ? '#000' : '#FFF' }]}>
                            {(Step === 'scan' || Step === 'finish') ? ' Home' : ' Back'}
                        </Text>
                    </TouchableOpacity>
                </View>
                {renderStep()}
            </View>
        </Screen>
    )
})
