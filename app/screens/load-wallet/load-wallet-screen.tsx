import { observer } from "mobx-react-lite";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Button, Screen, Text, ConnectBankModal } from "../../components";
import { ActivityIndicator, TextInput, TouchableOpacity, View, Modal, KeyboardAvoidingView, Alert } from "react-native";
import { COLOR } from "../../theme";
import styles from './load-wallet-style';
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
const maxAmount = 2000

export const LoadWalletScreen = observer(function LoadWalletScreen() {
	const navigation = useNavigation()
	const rootStore = useStores()
	const { loginStore } = rootStore
	const isFocused = useIsFocused();
	const [ButtonDisabled, setButtonDisabled] = useState(false)
	const [Amount, setAmount] = useState(0)
	const [ShowModal, setShowModal] = useState(false)
	const [TransactionConfirm, setTransactionConfirm] = useState(false)
	const [TransactionFinished, setTransactionFinished] = useState(false)

	const [ShowBankModal, setShowBankModal] = useState(false)

	const [ShowPassModal, setShowPassModal] = useState(false)
	const [Pass, setPass] = useState('')
	const [HidePass, setHidePass] = useState(true)
	const [Sucess, setSucess] = useState(true)
	const [ResponseMenssage, setResponseMenssage] = useState('')

	const [AmountError, setAmountError] = useState(false)

	useEffect(() => {
		if (isFocused) {
			if (!loginStore.getBillingData.billing_data_added) setShowBankModal(true)
			else setShowBankModal(false)
		}
	}, [isFocused])

	const pressHandler = () => {
		if (loginStore.ProfileData.allow_touch_id) {
			TouchID.authenticate('to check the user', optionalConfigObject)
				.then(success => {
					postDeposit()
					setShowPassModal(false)
				})
				.catch(error => {
					Alert.alert('Authentication Failed');
				});
		} else {
			postDeposit()
			setShowPassModal(false)
		}
	}

	const postDeposit = () => {
		setTransactionConfirm(true)
		setTransactionFinished(false)
		const data = {
			"user": loginStore.getSelectedAccount === 'consumer' ? loginStore.getAllData.consumer_id : loginStore.getAllData.merchant_id,
			"user_as_consumer": loginStore.getSelectedAccount === 'consumer',
			"password": Pass,
			"amount": Amount
		}
		loginStore.environment.api
			.postDeposit(data)
			.then((result: any) => {
				setTransactionFinished(true)
				if (result.kind === "ok") setSucess(true)
				else if (result.kind === "bad-data") {
					setSucess(false)
					const msg = result?.errors
					setResponseMenssage(msg)
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
						onPress={() => [setShowModal(true), setShowPassModal(false), setHidePass(true)]}
						buttonLabel={'Confirm'}
					/>
				</KeyboardAvoidingView>
			</View>
		</Modal>
	)

	const bankModal = () =>
		<ConnectBankModal
			visible={ShowBankModal}
			buttonStyle={{ backgroundColor: loginStore.getAccountColor }}
			buttonAction={() => {navigation.navigate("linkBank"); setShowBankModal(false)}}
			onPressHome={() => [navigation.navigate("home"), setShowBankModal(false)]}
		/>

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
					<View style={styles.MODAL_CONTAINER}>
						<View style={styles.MODAL_CONTENT}>
							<Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>Please confirm your transaction.</Text>
							<Text style={styles.STEP_SUB_TITLE_MODAL}>{`You will load up C$ ${Amount} to your wallet.`}</Text>
							<TouchableOpacity
								style={[styles.MODAL_BUTTON, { backgroundColor: loginStore.getAccountColor }]}
								onPress={() => pressHandler()}
							>
								<Text style={styles.SUBMIT_BUTTON_LABEL}>Confirm</Text>
							</TouchableOpacity>
						</View>
					</View>
					<View />
				</View>
			}
		</Modal>
	)

	useEffect(() => {
		setButtonDisabled(!(Amount > 0) || Amount > maxAmount)
		if (Amount > maxAmount) setAmountError(true)
		else setAmountError(false)
	}, [Amount]);

	return (
		<Screen
			showHeader
			preset="fixed"
			statusBar={'dark-content'}
			unsafe={true}
			style={styles.ROOT}
		>
				<View style={styles.HEADER_ACTIONS}>
					{!ShowModal &&
						<TouchableOpacity onPress={() => navigation.navigate('home')} style={[styles.BACK_BUTON_CONTAINER, { marginTop: 10 }]}>
							<Icon name={"arrow-back"} size={23} color={loginStore.getAccountColor} />
							<Text style={[styles.BACK_BUTON_LABEL, { color: loginStore.getAccountColor }]}>{` Home`}</Text>
						</TouchableOpacity>
					}
				</View>
			<KeyboardAvoidingView enabled style={styles.ROOT}>
				<View style={styles.STEP_CONTAINER}>
					<Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>Load Wallet</Text>
					<Text style={styles.LINE} />
					<Text style={styles.SUB_TITLE}>
						{`Specify the amount of Currents 
(C$ 1 = USD 1) you would like to load up. `}
					</Text>
					<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
						<Text style={styles.INPUT_LABEL_STYLE}>AMOUNT</Text>
					</View>
					<View style={styles.INPUT_AMOUNT_STYLE_CONTAINER}>
						<Button
							buttonStyle={
								(Number(Amount) === 50)
									? [styles.BUTTON_AMOUNT_ACTIVE, { backgroundColor: loginStore.getAccountColor }]
									: [styles.BUTTON_AMOUNT, { borderColor: loginStore.getAccountColor }]
							}
							buttonLabelStyle={{ color: (Number(Amount) === 50) ? COLOR.PALETTE.white : loginStore.getAccountColor }}
							onPress={() => setAmount('50.00')}
							buttonLabel={'C$ 50'}
						/>
						<Button
							buttonStyle={
								(Number(Amount) === 100)
									? [styles.BUTTON_AMOUNT_ACTIVE, { backgroundColor: loginStore.getAccountColor }]
									: [styles.BUTTON_AMOUNT, { borderColor: loginStore.getAccountColor }]
							}
							buttonLabelStyle={{ color: (Number(Amount) === 100) ? COLOR.PALETTE.white : loginStore.getAccountColor }}
							onPress={() => setAmount('100.00')}
							buttonLabel={'C$ 100'}
						/>
						<Button
							buttonStyle={
								(Number(Amount) === 200)
									? [styles.BUTTON_AMOUNT_ACTIVE, { backgroundColor: loginStore.getAccountColor }]
									: [styles.BUTTON_AMOUNT, { borderColor: loginStore.getAccountColor }]
							}
							buttonLabelStyle={(Number(Amount) === 200) ? { color: COLOR.PALETTE.white } : { color: loginStore.getAccountColor }}
							onPress={() => setAmount('200.00')}
							buttonLabel={'C$ 200'}
						/>
					</View>
					<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
						<Text style={styles.INPUT_LABEL_STYLE}>AMOUNT</Text>
						<Text style={styles.INPUT_LABEL_STYLE}>MAX. C$ 2,000</Text>
					</View>

					<View style={AmountError ? styles.INPUT_STYLE_CONTAINER_ERROR : styles.INPUT_STYLE_CONTAINER}>
						<Text style={[styles.INPUT_LABEL_STYLE, { fontSize: 15, marginLeft: 15 }]}> C$</Text>
						<CurrencyInput
							style={styles.INPUT_STYLE}
							value={Amount}
							precision={2}
							delimiter=","
          					separator="."
							onChangeValue={t => setAmount(t)}
						/>
					</View>

					<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
						<Text style={styles.COSTS_LABEL}>Total costs</Text>
						<Text style={styles.COSTS_LABEL}>{`$ ${Amount}`}</Text>
					</View>
				</View>
				{ConfirmModal()}
				{bankModal()}
				{passModal()}
			</KeyboardAvoidingView>
			<Button
				buttonStyle={{ backgroundColor: (ButtonDisabled || AmountError) ? `${loginStore.getAccountColor}40` : loginStore.getAccountColor }}
				disabled={(ButtonDisabled || AmountError)}
				// onPress={() => setShowPassModal(true)} // remove to skip password
				onPress={() => [setShowModal(true), setShowPassModal(false), setHidePass(true)]}
				buttonLabel={'Load up'}
			/>
		</Screen>
	)
})
