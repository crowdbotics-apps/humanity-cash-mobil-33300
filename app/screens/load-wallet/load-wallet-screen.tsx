import { observer } from "mobx-react-lite";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Button, Screen, Text } from "../../components";
import { ActivityIndicator, TextInput, TouchableOpacity, View, Modal, Platform, KeyboardAvoidingView } from "react-native";
import { COLOR, IMAGES, METRICS } from "../../theme";
import { ButtonIcon } from "../../components/button-icon/button-icon";
import styles from './load-wallet-style';
import Icon from "react-native-vector-icons/MaterialIcons"
import { useStores } from "../../models";

export const LoadWalletScreen = observer(function LoadWalletScreen() {
	const navigation = useNavigation()
	const rootStore = useStores()
	const { loginStore } = rootStore

	const [ButtonDisabled, setButtonDisabled] = useState(false)
	const [Amount, setAmount] = useState('0')
	const [ShowModal, setShowModal] = useState(false)
	const [TransactionConfirm, setTransactionConfirm] = useState(false)
	const [TransactionFinished, setTransactionFinished] = useState(false)

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

	const ConfirmModal = () => (
		<Modal visible={ShowModal}>
			{TransactionConfirm
				? <View style={styles.LOADING_RETURN}>
					{TransactionFinished
						? [
							<Text key={'congrat_title'} style={[styles.PENDING_TITLE, { color: loginStore.getAccountColor }]}>{`Congratulations! You 
have topped up 
C$ ${Amount}`}
							</Text>,
							<Text key={'congrat_sub_title'} style={styles.SUB_TITLE}>Currents will soon be available in your wallet!</Text>,
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
									setAmount('0'),
									navigation.navigate("home", {})
								]}
								buttonLabel={'Explore your community'}
							/>
						]
						: [
							<Text key={'pending_title'} style={[styles.PENDING_TITLE, { color: loginStore.getAccountColor }]}>Pending...</Text>,
							<Text key={'pending_sub_title'} style={styles.SUB_TITLE}>This usually takes 5-6 seconds</Text>,
							<ActivityIndicator key={'pending_ind'} style={styles.ACTIVITY} size="large" color={'black'} />
						]
					}

				</View>
				: <View style={[
					styles.ROOT_MODAL,
					{
						backgroundColor:
							loginStore.getSelectedAccount === 'merchant'
								? 'rgba(157, 165, 111, 0.50)'
								: 'rgba(59, 136, 182, 0.50)'
					}
				]}>
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
							<Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>Please confirm your transaction.</Text>
							<Text style={styles.STEP_SUB_TITLE_MODAL}>{`You will load up C$ ${Amount} to your wallet.`}</Text>
							<TouchableOpacity
								style={[styles.MODAL_BUTTON, { backgroundColor: loginStore.getAccountColor }]}
								onPress={() => {
									setTransactionConfirm(true)
									setTimeout(function () {
										setTransactionFinished(true)
									}, 5000)
								}}
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
		setButtonDisabled(!(Number(Amount) > 0));
	  }, [Amount]);

	return (
		<Screen
			showHeader
			preset="fixed"
			statusBar={'dark-content'}
			unsafe={true}
			style={styles.ROOT}
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
					<View style={[styles.INPUT_STYLE_CONTAINER]}>
						<TextInput
							style={styles.INPUT_STYLE}
							keyboardType='numeric'
							onChangeText={t => {
								let temp = t.replace('C', '').replace('$', '').replace(' ', '')
								temp = temp.replace(",", ".")
								setAmount(temp)
							  }}
							  value={(Amount && Amount.split(' ')[0] === `C$ `) ? Amount : `C$ ` + Amount}
							placeholder={`Amount`}
							placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
						/>
					</View>

					<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
						<Text style={styles.COSTS_LABEL}>Total costs</Text>
						<Text style={styles.COSTS_LABEL}>{`$ ${Amount}`}</Text>
					</View>

				</View>
				{ConfirmModal()}
				{bankModal()}
			</KeyboardAvoidingView>
			<Button
				buttonStyle={{
					backgroundColor: ButtonDisabled ? `${loginStore.getAccountColor}40` : loginStore.getAccountColor,
					bottom: 5,
				}}
				disabled={ButtonDisabled}
				onPress={() => setShowModal(true)}
				buttonLabel={'Load up'}
			/>
		</Screen>
	)
})
