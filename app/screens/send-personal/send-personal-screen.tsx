import { observer } from "mobx-react-lite";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Button, Screen, Text } from "../../components";
import { ActivityIndicator, TextInput, TouchableOpacity, View, Modal, KeyboardAvoidingView } from "react-native";
import { COLOR, IMAGES, METRICS } from "../../theme";
import styles from './send-personal-style';
import Icon from "react-native-vector-icons/MaterialIcons"
import { useStores } from "../../models";
import { runInAction } from "mobx"
import { notifyMessage } from "../../utils/helpers"
import Ionicons from "react-native-vector-icons/Ionicons"
import QRCodeScanner from 'react-native-qrcode-scanner';

const maxAmount = 2000

export const SendPersonalScreen = observer(function SendPersonalScreen() {
	const navigation = useNavigation()
	const rootStore = useStores()
	const { loginStore } = rootStore
	const [ButtonDisabled, setButtonDisabled] = useState(false)
	const [Amount, setAmount] = useState('0')
	const [ShowModal, setShowModal] = useState(false)
	const [TransactionConfirm, setTransactionConfirm] = useState(false)
	const [TransactionFinished, setTransactionFinished] = useState(false)

	const [ShowPassModal, setShowPassModal] = useState(false)
	const [Pass, setPass] = useState('')
	const [HidePass, setHidePass] = useState(true)
	const [Sucess, setSucess] = useState(true)
	const [ResponseMenssage, setResponseMenssage] = useState('')

	const [Step, setStep] = useState('amount') // select - amount
	const [Type, setType] = useState('self') // self - other

	const [ScanQR, setScanQR] = useState(false)
	const [QR, setQR] = useState(null)

	const [AmountError, setAmountError] = useState(false)

	const postDeposit = () => {
		setTransactionConfirm(true)
		setTransactionFinished(false)
		const data = {
			"from": loginStore?.getProfilesId.merchant,
			"to": loginStore.getProfilesId.consumer,
			"from_is_consumer": false,
			"to_is_consumer": true,
			"password": Pass,
			"amount": Amount,
			"roundup": 0,
		}
		loginStore.environment.api
			.sendMoney(data)
			.then((result: any) => {
				if (result.kind === "ok") {
					setSucess(true)
					setTransactionFinished(true)
				} else if (result.kind === "bad-data") {
					setSucess(false)
					setTransactionFinished(true)
					const errors = result.errors
					notifyMessage(errors)
				} else if (result.kind === "unauthorized") {
					setSucess(false)
					setTransactionFinished(true)
					notifyMessage('bad password')
				}
			}).catch((err) => notifyMessage(err))
	}

	const transferCurrency = () => {
		if (!QR) return
		setTransactionConfirm(true)
		setTransactionFinished(false)
		const qrData = JSON.parse(QR)
		const data = {
			"from": loginStore?.getProfilesId.merchant,
			"to": qrData.to,
			"from_is_consumer": loginStore.getSelectedAccount === 'consumer',
			"to_is_consumer": qrData.to_is_consumer,
			"password": Pass,
			"amount": Amount,
			"roundup": 0,
		}

		loginStore.environment.api
			.sendMoney(data)
			.then((result: any) => {
				if (result.kind === "ok") {
					setSucess(true)
					setTransactionFinished(true)
				} else if (result.kind === "bad-data") {
					setSucess(false)
					setTransactionFinished(true)
					const errors = result.errors
					notifyMessage(errors)
				} else if (result.kind === "unauthorized") {
					setSucess(false)
					setTransactionFinished(true)
					notifyMessage('bad password')
				}
			}).catch((err) => notifyMessage(err))
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
						onPress={() => [setShowModal(true), setShowPassModal(false), setHidePass(true)]}
						buttonLabel={'Confirm'}
					/>
				</KeyboardAvoidingView>
			</View>
		</Modal>
	)

	const ConfirmModal = () => (
		<Modal visible={ShowModal} transparent>
			{TransactionConfirm
				? [TransactionFinished
					? <View key={'confirm_header'} style={[styles.HEADER_ACTIONS, { marginTop: 20 }]}>
						<View style={styles.CLOSE_MODAL_BUTTON} />
						<TouchableOpacity
							onPress={() => [
								setShowPassModal(false),
								setShowModal(false),
								setTransactionConfirm(false),
								setAmount('0'),
								setPass(''),
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
									<Text style={[styles.PENDING_TITLE, { color: loginStore.getAccountColor }]}>{`Congratulations! You  have topped up C$ ${Amount}`}</Text>
									<Text style={styles.SUB_TITLE}>Currents will soon be available in your wallet!</Text>
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
										setPass('')
										navigation.navigate("home")
									} else postDeposit()

								}}
								buttonLabel={Sucess ? 'Explore your community' : 'Try again'}
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
						<TouchableOpacity onPress={() => [setShowModal(false), setShowPassModal(true)]} style={styles.CLOSE_MODAL_BUTTON}>
							<Icon name={"arrow-back"} size={23} color={COLOR.PALETTE.white} style={{ marginLeft: 10 }} />
							<Text style={styles.BACK_BUTON_LABEL_MODAL}>{` Back`}</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => [setShowPassModal(false), setShowModal(false)]} style={styles.CLOSE_MODAL_BUTTON}>
							<Text style={styles.BACK_BUTON_LABEL_MODAL}>{`Close `}</Text>
							<Icon name={"close"} size={23} color={COLOR.PALETTE.white} />
						</TouchableOpacity>
					</View>
					{Type === 'self'
						? <View style={styles.MODAL_CONTAINER}>
							<View style={styles.MODAL_CONTENT}>
								<Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>Please confirm your transaction.</Text>
								<Text style={styles.STEP_SUB_TITLE_MODAL}>
									{`You will transfer C$ ${Amount} to your personal account.`}
								</Text>
								<TouchableOpacity
									style={[styles.MODAL_BUTTON, { backgroundColor: loginStore.getAccountColor }]}
									onPress={() => [postDeposit(), setShowPassModal(false)]}
								>
									<Text style={styles.SUBMIT_BUTTON_LABEL}>Confirm</Text>
								</TouchableOpacity>
							</View>
						</View>
						: <View style={styles.MODAL_CONTAINER}>
							<View style={styles.MODAL_CONTENT}>
								<Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>Scan the recipients QR.</Text>
								<Text style={styles.STEP_SUB_TITLE_MODAL}>
									{`Scan the recipient’s QR code. The recipient can pull this up by clicking on “Scan to Pay or Receive” and toggling to “Receive.”`}
								</Text>
								<TouchableOpacity
									style={[styles.MODAL_BUTTON, { backgroundColor: loginStore.getAccountColor }]}
									onPress={() => [setScanQR(true), setShowPassModal(false), setShowModal(false)]}
								>
									<Text style={styles.SUBMIT_BUTTON_LABEL}>Confirm</Text>
								</TouchableOpacity>
							</View>
						</View>
					}

					<View />
				</View>
			}
		</Modal>
	)

	useEffect(() => {
		setButtonDisabled(!(Number(Amount) > 0));
	}, [Amount]);

	const renderSelect = () => <View style={styles.STEP_CONTAINER}>
		<Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>Send to Personal</Text>
		<Text style={styles.LINE} />
		<Text style={styles.SUB_TITLE}>
			Specify the amount of Currents (C$ 1 = USD 1) you would like to load up.
		</Text>
		<TouchableOpacity style={styles.SUBMIT_BUTTON_OUTLINE} onPress={() => [setStep('amount'), setType('self')]}>
			<Text style={styles.SUBMIT_BUTTON_OUTLINE_LABEL}>My personal account</Text>
		</TouchableOpacity>
	</View>

	const renderAmount = () => <View style={styles.STEP_CONTAINER}>
		<Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>
			{Type === 'self'
				? 'Send C$ to myself'
				: 'Send C$ to someone'
			}
		</Text>
		<Text style={styles.LINE} />
		<Text style={styles.SUB_TITLE}>
			{Type === 'self'
				? 'Select the amount of Currents you would like to pay out to your personal account.'
				: 'Select the amount of Currents you would like to send. '
			}
		</Text>

		<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
			<Text style={styles.INPUT_LABEL_STYLE}>AMOUNT</Text>
			<Text style={styles.INPUT_LABEL_STYLE}>MAX. C$ 2,000</Text>
		</View>
		<View style={AmountError ? styles.INPUT_STYLE_CONTAINER_ERROR : styles.INPUT_STYLE_CONTAINER}>
			<TextInput
				style={styles.INPUT_STYLE}
				keyboardType='numeric'
				onChangeText={t => {
					let temp = t.replace('C', '').replace('$', '').replace(' ', '')
					temp = temp.replace(",", ".")
					// review max amount
					if (parseInt(temp) > maxAmount) setAmountError(true)
					else setAmountError(false)

					setAmount(temp)
				}}
				value={(Amount && Amount.split(' ')[0] === `C$ `) ? Amount : `C$ ` + Amount}
				placeholder={`Amount`}
				placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
			/>
		</View>

	</View>

	const renderStep = () => {
		let render: any
		switch (Step) {
			// consumer
			case 'select':
				render = renderSelect()
				break;
			case 'amount':
				render = renderAmount()
				break;
			default:
				render = renderAmount()
				break;
		}
		return render
	}

	return (
		<Screen
			showHeader
			preset="fixed"
			statusBar={'dark-content'}
			unsafe={true}
			style={[styles.ROOT, ScanQR && { backgroundColor: COLOR.PALETTE.pureblack }]}
		>
			{ScanQR
				? <QRCodeScanner onRead={e => [
					setQR(e.data),
					setShowModal(true),
					setScanQR(false),
					transferCurrency(),
				]} />
				: [
					<View style={styles.HEADER_ACTIONS} key={'send_personal_header'}>
						{!ShowModal && (
							Step === 'select'
								? <TouchableOpacity onPress={() => navigation.navigate('home')} style={[styles.BACK_BUTON_CONTAINER, { marginTop: 10 }]}>
									<Icon name={"arrow-back"} size={23} color={loginStore.getAccountColor} />
									<Text style={[styles.BACK_BUTON_LABEL, { color: loginStore.getAccountColor }]}>{` Home`}</Text>
								</TouchableOpacity>
								: <TouchableOpacity onPress={() => navigation.navigate('home')} style={[styles.BACK_BUTON_CONTAINER, { marginTop: 10 }]}>
									<Icon name={"arrow-back"} size={23} color={loginStore.getAccountColor} />
									<Text style={[styles.BACK_BUTON_LABEL, { color: loginStore.getAccountColor }]}>{` Back`}</Text>
								</TouchableOpacity>
						)}
					</View>,
					<KeyboardAvoidingView key={'send_personal_container'} enabled style={styles.ROOT}>{renderStep()}</KeyboardAvoidingView>,
					<Button
						key={'send_personal_button'}
						buttonStyle={{ backgroundColor: ButtonDisabled ? `${loginStore.getAccountColor}40` : loginStore.getAccountColor }}
						disabled={ButtonDisabled}
						// onPress={() => setShowPassModal(true)} // removed to skip pass
						onPress={() => [setShowModal(true), setShowPassModal(false), setHidePass(true)]}
						buttonLabel={'Confirm'}
						showBottonMenu
						hideButton={Step === 'select'}
						accountType={loginStore.getSelectedAccount}
					/>
				]
			}
			{ConfirmModal()}
			{passModal()}
		</Screen>
	)
})
