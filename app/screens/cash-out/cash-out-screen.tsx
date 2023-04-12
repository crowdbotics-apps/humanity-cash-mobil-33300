import { observer } from "mobx-react-lite";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Button, Screen, Text, ConnectBankModal } from "../../components";
import { ActivityIndicator, TextInput, TouchableOpacity, View, Modal, KeyboardAvoidingView, Alert } from "react-native";
import { COLOR } from "../../theme";
import styles from './cash-out-style';
import Icon from "react-native-vector-icons/MaterialIcons"
import { useStores } from "../../models";
import { notifyMessage } from "../../utils/helpers"
import Ionicons from "react-native-vector-icons/Ionicons"
import CurrencyInput from 'react-native-currency-input'

import TouchID from 'react-native-touch-id'

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

const maxAmount = 5
const feePercentage = 1.5

export const CashOutScreen = observer(function CashOutScreen() {
	const navigation = useNavigation()
	const rootStore = useStores()
	const { loginStore } = rootStore
	const isFocused = useIsFocused();
	const [CheckMaxAmount, setCheckMaxAmount] = useState(false)
	const [Amount, setAmount] = useState(0)
	const [Fee, setFee] = useState(0.50)
	const [ShowModal, setShowModal] = useState(false)
	const [AmountError, setAmountError] = useState(false)
	const [TransactionConfirm, setTransactionConfirm] = useState(false)
	const [TransactionFinished, setTransactionFinished] = useState(false)
	const [ShowBankModal, setShowBankModal] = useState(false)

	const [ShowPassModal, setShowPassModal] = useState(false)
	const [Pass, setPass] = useState('')
	const [HidePass, setHidePass] = useState(true)
	const [Sucess, setSucess] = useState(true)
	const [ResponseMenssage, setResponseMenssage] = useState('')

	useEffect(() => {
		if (isFocused) {
			if (!loginStore.getBillingData.billing_data_added) setShowBankModal(true)
			else setShowBankModal(false)

			if (loginStore.getSelectedAccount === 'consumer') setCheckMaxAmount(true)
			else setCheckMaxAmount(false)
		}
	}, [isFocused])

	const pressHandler = () => {
		if (loginStore.ProfileData.allow_touch_id) {
			TouchID.authenticate('to check the user', optionalConfigObject)
				.then(success => {
					postCashOut()
					setShowPassModal(false)
				})
				.catch(error => {
					Alert.alert('Authentication Failed');
				});
		} else {
			postCashOut()
			setShowPassModal(false)
		}
	}

	const postCashOut = () => {
		setTransactionConfirm(true)
		setTransactionFinished(false)
		const data = {
			"user": loginStore.getSelectedAccount === 'consumer' ? loginStore.getAllData.consumer_id : loginStore.getAllData.merchant_id,
			"user_as_consumer": loginStore.getSelectedAccount === 'consumer',
			"password": Pass,
			"amount": Amount
		}
		loginStore.environment.api
			.postCashOut(data)
			.then((result: any) => {
				setTransactionFinished(true)
				if (result.kind === "ok") {
					setSucess(true)
				} else if (result.kind === "bad-data") {
					setSucess(false)
					let msg = result?.errors
					if (Array.isArray(msg)) msg = msg[0]
					setResponseMenssage(msg)
					notifyMessage(msg)
				} else {
					setSucess(false)
					notifyMessage(null)
				}
			})
	}

	const passModal = () => (
		<Modal visible={ShowPassModal} transparent>
			<View style={styles.ROOT_MODAL_PASS}>

				<View style={styles.CONTAINER}>
					<TouchableOpacity onPress={() => setShowPassModal(false)} style={styles.BACK_BUTON_CONTAINER}>
						<Icon name={"close"} size={23} color={COLOR.PALETTE.black} />
						<Text style={styles.BACK_BUTON_LABEL}>{` Close`}</Text>
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
				<KeyboardAvoidingView style={styles.CONTAINER}>
					<Button
						buttonStyle={{
							backgroundColor: !Pass || Pass === '' ? `${loginStore.getAccountColor}40` : loginStore.getAccountColor,
						}}
						disabled={!Pass || Pass === ''}
						onPress={() => [setShowModal(true), setPass(''), setShowPassModal(false)]}
						buttonLabel={'Confirm'}
					/>
				</KeyboardAvoidingView>
			</View>
		</Modal>
	)

	const ConfirmModal = () => (
		<Modal transparent visible={ShowModal}>
			{TransactionConfirm
				? [TransactionFinished
					? <View key={'confirm_header'} style={[styles.HEADER_ACTIONS, { marginTop: 20 }]}>
						<View style={styles.CLOSE_MODAL_BUTTON} />
						<TouchableOpacity
							onPress={() => [
								setShowPassModal(false),
								setShowModal(false),
								setTransactionConfirm(false),
								setAmount('0')
							]}
							style={styles.CLOSE_MODAL_BUTTON}
						>
							<Text style={[styles.BACK_BUTON_LABEL_MODAL, { color: COLOR.PALETTE.pureblack }]}>{`Close `}</Text>
							<Icon name={"close"} size={23} color={COLOR.PALETTE.pureblack} />
						</TouchableOpacity>
					</View>
					: <View key={'confirm_header'} style={styles.HEADER_ACTIONS} />,
				<View key={'confirm_content'} style={styles.LOADING_RETURN}>
					{TransactionFinished
						? [
							Sucess
								? <View style={styles.CONTAINER} key={'congrat_title'} >
									<Text style={[styles.PENDING_TITLE, { color: loginStore.getAccountColor }]}>{`Your redemption is in process!`}</Text>
									<Text style={styles.SUB_TITLE}>You’ll get an email once your funds are available in your bank account. This should take 5 business days.</Text>
								</View>
								: <View style={styles.CONTAINER} key={'congrat_title'} >
									<Text style={[styles.PENDING_TITLE, { color: loginStore.getAccountColor }]}>Whoops, something went wrong.</Text>
									<Text style={[styles.SUB_TITLE, { color: COLOR.PALETTE.red }]}>{ResponseMenssage}</Text>
								</View>
							, <Button
								key={'congrat_button'}
								buttonStyle={{
									backgroundColor: loginStore.getAccountColor,
								}}
								onPress={() => {
									if (Sucess) {
										setTransactionConfirm(false)
										setShowModal(false)
										setTransactionFinished(false)
										setAmount('0')
										navigation.navigate("home")
									} else postCashOut()

								}}
								buttonLabel={Sucess ? 'Go back to home' : 'Try again'}
							/>
						]
						: [
							<View style={styles.CONTAINER} key={'pending_title'}>
								<Text style={[styles.PENDING_TITLE, { color: loginStore.getAccountColor }]}>Pending...</Text>
								<Text style={styles.SUB_TITLE}>This usually takes 5-6 seconds</Text>
							</View>,
							<ActivityIndicator key={'pending_ind'} style={styles.ACTIVITY} size="large" color={'black'} />
						]
					}

				</View>,
				] : <View style={styles.ROOT_MODAL}>
					<View style={[styles.HEADER_ACTIONS, { marginTop: 35 }]}>
						<TouchableOpacity onPress={() => setShowModal(false)} style={styles.CLOSE_MODAL_BUTTON}>
							<Icon name={"arrow-back"} size={23} color={COLOR.PALETTE.white} style={{ marginLeft: 10 }} />
							<Text style={styles.BACK_BUTON_LABEL_MODAL}>{` Back`}</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => [setShowPassModal(false), setShowModal(false)]} style={styles.CLOSE_MODAL_BUTTON}>
							<Text style={styles.BACK_BUTON_LABEL_MODAL}>{`Close `}</Text>
							<Icon name={"close"} size={23} color={COLOR.PALETTE.white} />
						</TouchableOpacity>
					</View>
					<View style={styles.MODAL_CONTAINER}>
						<View style={styles.MODAL_CONTENT}>
							<Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>Are you sure you want to cash out?</Text>
							<Text style={styles.STEP_SUB_TITLE_MODAL}>{`You will redeem C$ ${Amount} for USD $${(parseFloat(Amount) - Fee).toFixed(2)} after a $${Fee.toFixed(2)} fee.`}</Text>
							<TouchableOpacity
								style={[styles.MODAL_BUTTON, { backgroundColor: loginStore.getAccountColor }]}
								onPress={() => pressHandler()}
							>
								<Text style={styles.SUBMIT_BUTTON_LABEL}>Cash out to USD</Text>
							</TouchableOpacity>
						</View>
					</View>
					<View />
				</View>
			}
		</Modal>
	)


	const bankModal = () =>
		<ConnectBankModal
			visible={ShowBankModal}
			buttonStyle={{ backgroundColor: loginStore.getAccountColor }}
			buttonAction={() => [navigation.navigate("linkBank"), setShowBankModal(false)]}
			onPressHome={() => [navigation.navigate("home"), setShowBankModal(false)]}
		/>

	return (
		<Screen
			showHeader
			preset="fixed"
			statusBar={'dark-content'}
			style={styles.ROOT}
			unsafe={true}
		>
			<KeyboardAvoidingView
				enabled
				style={styles.ROOT}
			>
				<View style={styles.HEADER_ACTIONS}>
					{!ShowModal &&
						<TouchableOpacity onPress={() => navigation.navigate("home")} style={[styles.BACK_BUTON_CONTAINER, { marginTop: 10 }]}>
							<Icon name={"arrow-back"} size={23} color={loginStore.getAccountColor} />
							<Text style={[styles.BACK_BUTON_LABEL, { color: loginStore.getAccountColor }]}>{` Home`}</Text>
						</TouchableOpacity>
					}
				</View>
				<View style={styles.STEP_CONTAINER}>
					<Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>Cash Out</Text>
					<Text style={styles.LINE} />
					<Text style={styles.SUB_TITLE}>
						{`Select the amount of Currents you would like to redeem to USD. You can only cash out when your balance is C$ 5.00 or less and you cannot exceed your balance. `}
					</Text>

					<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
						<Text style={styles.INPUT_LABEL_STYLE}>AMOUNT</Text>
						{CheckMaxAmount &&
							<Text style={styles.INPUT_LABEL_STYLE}>MAX. C$ {maxAmount}</Text>
						}
					</View>

					<View style={AmountError ? styles.INPUT_STYLE_CONTAINER_ERROR : styles.INPUT_STYLE_CONTAINER}>
						<Text style={[styles.INPUT_LABEL_STYLE, { fontSize: 15, marginLeft: 15 }]}> C$</Text>
						<CurrencyInput
							style={styles.INPUT_STYLE}
							value={Amount}
							precision={2}
							onChangeValue={t => {
								// calculate fee
								const tempFee = (t * feePercentage) / 100
								if (tempFee > 0.50) setFee(tempFee)
								
								if ((CheckMaxAmount && t > maxAmount) || ((t - Fee) < 0) ) setAmountError(true)
								else setAmountError(false)

								setAmount(t)
							}}
						/>
					</View>

					<View style={styles.INPUT_LABEL_ERROR_STYLE_CONTAINER}>
						<Text style={styles.INPUT_LABEL_ERROR}>{AmountError ? 'CANNOT EXCEED BALANCE AND/OR MAXIMUM CASHOUT' : ''}</Text>
					</View>

					<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
						<Text style={styles.COSTS_FEE_LABEL}>Cash out fee</Text>
						<Text style={styles.COSTS_FEE_LABEL}>{`$ ${Fee.toFixed(2)}`}</Text>
					</View>
					<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
						<Text style={styles.COSTS_LABEL}>Net cash out</Text>
						<Text style={styles.COSTS_LABEL}>{`$  ${Amount > 0 ? (Amount - Fee).toFixed(2) : 0}`}</Text>
					</View>

				</View>
				{ConfirmModal()}
				{bankModal()}
				{passModal()}
			</KeyboardAvoidingView>
			<Button
				buttonStyle={{ backgroundColor: (AmountError || !Amount || Number(Amount) === 0) ? `${loginStore.getAccountColor}50` : loginStore.getAccountColor }}
				disabled={(AmountError || !Amount || Number(Amount) === 0)}
				// onPress={() => setShowPassModal(true)} // remove to skip password
				onPress={() => [setShowModal(true), setPass(''), setShowPassModal(false)]}
				buttonLabel={'Confirm'}
			/>
		</Screen>
	)
})
