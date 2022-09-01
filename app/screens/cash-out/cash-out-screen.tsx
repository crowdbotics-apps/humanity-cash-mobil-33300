import { observer } from "mobx-react-lite";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Button, Screen, Text } from "../../components";
import { ActivityIndicator, TextInput, TouchableOpacity, View, Modal, Platform, KeyboardAvoidingView } from "react-native";
import { COLOR, IMAGES, METRICS } from "../../theme";
import { ButtonIcon } from "../../components/button-icon/button-icon";
import styles from './cash-out-style';
import Icon from "react-native-vector-icons/MaterialIcons"
import { useStores } from "../../models";

const maxAmount = 5000

export const CashOutScreen = observer(function CashOutScreen() {
	const navigation = useNavigation()
	const rootStore = useStores()
	const { loginStore } = rootStore

	const [Amount, setAmount] = useState('')
	const [ShowModal, setShowModal] = useState(false)
	const [AmountError, setAmountError] = useState(false)
	const [TransactionConfirm, setTransactionConfirm] = useState(false)
	const [TransactionFinished, setTransactionFinished] = useState(false)

	const ConfirmModal = () => (
		<Modal transparent visible={ShowModal}>
			{TransactionConfirm
				? <View style={styles.LOADING_RETURN}>
					{TransactionFinished
						? [
							<Text key={'congrat_title'} style={[styles.PENDING_TITLE, {color: loginStore.getAccountColor}]}>{`Your redemption is in process!
							`}</Text>,
							<Text key={'congrat_sub_title'} style={styles.SUB_TITLE}>You’ll get an email once your funds are available in your bank account. This should take 1-3 business days.</Text>,
							<Button
								key={'congrat_button'}
								buttonStyle={{
									backgroundColor: loginStore.getAccountColor,
									marginTop: METRICS.screenHeight * 0.6,
									position: 'absolute'
								}}
								onPress={() => [
									setTransactionConfirm(false),
									setShowModal(false),
									setTransactionFinished(false),
									setAmount(''),
									navigation.navigate("home", {})
								]}
								buttonLabel={'Go back to home'}
							/>
						]
						: [
							<Text key={'pending_title'} style={[styles.PENDING_TITLE, {color: loginStore.getAccountColor}]}>Pending...</Text>,
							<Text key={'pending_sub_title'} style={styles.SUB_TITLE}>This usually takes 5-6 seconds</Text>,
							<ActivityIndicator key={'pending_ind'} style={styles.ACTIVITY} size="large" color={'black'} />
						]
					}

				</View>
				: <View style={styles.ROOT_MODAL}>
					<View style={styles.HEADER_ACTIONS}>
						<TouchableOpacity onPress={() => setShowModal(false)} style={styles.CLOSE_MODAL_BUTTON}>
							<Icon name={"arrow-back"} size={23} color={COLOR.PALETTE.white} style={{ marginLeft: 10 }} />
							<Text style={styles.BACK_BUTON_LABEL_MODAL}>{` Back`}</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => setShowModal(false)} style={styles.CLOSE_MODAL_BUTTON}>
							<Text style={styles.BACK_BUTON_LABEL_MODAL}>{`Close `}</Text>
							<Icon name={"close"} size={23} color={COLOR.PALETTE.white} />
						</TouchableOpacity>
					</View>
					<View style={styles.MODAL_CONTAINER}>
						<View style={styles.MODAL_CONTENT}>
							<Text style={[styles.STEP_TITLE, {color: loginStore.getAccountColor}]}>Are you sure you want to cash out?</Text>
							<Text style={styles.STEP_SUB_TITLE_MODAL}>{`You will redeem C$ ${Amount} for USD $${parseFloat(Amount) - 0.50} after a $0.50 fee.`}</Text>
							<TouchableOpacity
								style={[styles.MODAL_BUTTON, { backgroundColor: loginStore.getAccountColor}]}
								onPress={() => {
									setTransactionConfirm(true)
									setTimeout(function () {
										setTransactionFinished(true)
									}, 5000)
								}}
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

	return (
		<Screen
			showHeader
			preset="fixed"
			statusBar={'dark-content'}
			unsafe={true}
		>
			<KeyboardAvoidingView
				enabled
				// behavior={Platform.OS === 'ios' ? 'padding' : null}
				style={styles.ROOT}
			>
				<View style={styles.HEADER_ACTIONS}>
					{!ShowModal &&
						<TouchableOpacity onPress={() => navigation.navigate("home", {})} style={styles.BACK_BUTON_CONTAINER}>
							<Icon name={"arrow-back"} size={23} color={COLOR.PALETTE.black} />
							<Text style={styles.BACK_BUTON_LABEL}>{` Home`}</Text>
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
						<Text style={styles.INPUT_LABEL_STYLE}>MAX. C$ {maxAmount}</Text>
					</View>
					<View style={AmountError ? styles.INPUT_STYLE_CONTAINER_ERROR : styles.INPUT_STYLE_CONTAINER}>
						<TextInput
							style={styles.INPUT_STYLE}
							keyboardType='numeric'
							
							onChangeText={t => {
								let temp = t.replace('C', '').replace('$', '').replace(' ', '')
								temp = temp.replace(/[^0-9]/g, '')
								if (parseInt(temp) > maxAmount) setAmountError(true)
								else setAmountError(false)
								setAmount(temp.replace(",", "."))
							}}
							value={(Amount && Amount.split(' ')[0] == `C$ `) ? Amount : `C$ ` + Amount}
							placeholder={`Amount`}
						/>
					</View>
					<View style={styles.INPUT_LABEL_ERROR_STYLE_CONTAINER}>
				<Text style={styles.INPUT_LABEL_ERROR}>{AmountError ? 'CANNOT EXCEED BALANCE AND/OR MAXIMUM CASHOUT' : ''}</Text>
			</View>

					<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
						<Text style={styles.COSTS_FEE_LABEL}>Cash out fee</Text>
						<Text style={styles.COSTS_FEE_LABEL}>{`$ 0.50`}</Text>
					</View>
					<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
						<Text style={styles.COSTS_LABEL}>Net cash out</Text>
						<Text style={styles.COSTS_LABEL}>{`$ ${Amount}`}</Text>
					</View>

				</View>
				{ConfirmModal()}
			</KeyboardAvoidingView>
				<Button
					buttonStyle={{
						backgroundColor: loginStore.getAccountColor,
						bottom: 5,
						position: 'absolute'
					}}
					onPress={() => setShowModal(true)}
					buttonLabel={'Confirm'}
				/>
		</Screen>
	)
})