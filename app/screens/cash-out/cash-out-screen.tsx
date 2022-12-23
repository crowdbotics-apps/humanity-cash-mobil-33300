import { observer } from "mobx-react-lite";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Button, Screen, Text, ConnectBankModal } from "../../components";
import { ActivityIndicator, TextInput, TouchableOpacity, View, Modal, Platform, KeyboardAvoidingView } from "react-native";
import { COLOR, IMAGES, METRICS } from "../../theme";
import { ButtonIcon } from "../../components/button-icon/button-icon";
import styles from './cash-out-style';
import Icon from "react-native-vector-icons/MaterialIcons"
import { useStores } from "../../models";
import { runInAction } from "mobx"
import { notifyMessage } from "../../utils/helpers"
import Ionicons from "react-native-vector-icons/Ionicons"

const maxAmount = 5000
const feePercentage = 1.5

export const CashOutScreen = observer(function CashOutScreen() {
	const navigation = useNavigation()
	const rootStore = useStores()
	const { loginStore } = rootStore
	const isFocused = useIsFocused();
	const [CheckMaxAmount, setCheckMaxAmount] = useState(false)
	const [Amount, setAmount] = useState('0')
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
					// runInAction(() => {
					// 	loginStore.setConsumerUser(result.data)
					// })
				} else if (result.kind === "bad-data") {
					setSucess(false)
					const msg = result?.errors
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
				]: <View style={styles.ROOT_MODAL}>
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
								onPress={() => [postCashOut(), setShowPassModal(false)]}
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

	useEffect(() => {
		if (Amount && (Number(Amount) > 0 ))
		setAmountError(!(Number(Amount) > 0));
	  }, [Amount]);

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
							<Text style={[styles.BACK_BUTON_LABEL, { color: loginStore.getAccountColor}]}>{` Home`}</Text>
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
						<TextInput
							style={styles.INPUT_STYLE}
							keyboardType='numeric'
							onChangeText={t => {
								let temp = t.replace('C', '').replace('$', '').replace(' ', '')
								temp = temp.replace(",", ".")
								// review max amount
								if (CheckMaxAmount && parseInt(temp) > maxAmount) setAmountError(true)
								else setAmountError(false)
								// calculate fee
								const tempFee = (parseFloat(temp) * feePercentage) / 100
								if (tempFee > 0.50) setFee(tempFee)
								else setFee(0.50)

								setAmount(temp)
							}}
							value={(Amount && Amount.split(' ')[0] == `C$ `) ? Amount : `C$ ` + Amount}
							placeholder={`Amount`}
							placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
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
						<Text style={styles.COSTS_LABEL}>{`$  ${parseFloat(Amount) > 0 ? (parseFloat(Amount) - Fee).toFixed(2) : 0}`}</Text>
					</View>

				</View>
				{ConfirmModal()}
				{bankModal()}
				{passModal()}
			</KeyboardAvoidingView>
			<Button
				buttonStyle={{ backgroundColor: (AmountError || !Amount || Number(Amount) === 0) ? `${loginStore.getAccountColor}50` : loginStore.getAccountColor }}
				disabled={(AmountError || !Amount || Number(Amount) === 0)}
				onPress={() => setShowPassModal(true)}
				buttonLabel={'Confirm'}
			/>
		</Screen>
	)
})
