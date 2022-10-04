import { observer } from "mobx-react-lite";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Button, Screen, Text } from "../../components";
import { ActivityIndicator, TextInput, TouchableOpacity, View, Modal, Platform, KeyboardAvoidingView } from "react-native";
import { COLOR, IMAGES, METRICS } from "../../theme";
import { ButtonIcon } from "../../components/button-icon/button-icon";
import styles from './make-report';
import Icon from "react-native-vector-icons/MaterialIcons"
import { useStores } from "../../models";
import DatePicker from 'react-native-date-picker'
import Entypo from "react-native-vector-icons/Entypo"

export const MakeReportScreen = observer(function MakeReportScreen() {
	const navigation = useNavigation()
	const rootStore = useStores()
	const { loginStore } = rootStore

	const [Amount, setAmount] = useState('')
	const [ShowModal, setShowModal] = useState(false)
	const [TransactionConfirm, setTransactionConfirm] = useState(false)
	const [TransactionFinished, setTransactionFinished] = useState(false)

	const [ShowBankModal, setShowBankModal] = useState(false)

	const [SelectOpen, setSelectOpen] = useState(false)
	const [TransactionType, setTransactionType] = React.useState('All');
	const [DateFrom, setDateFrom] = useState(new Date())
	const [OpenFrom, setOpenFrom] = useState(false)
	const [DateTo, setDateTo] = useState(new Date())
	const [OpenTo, setOpenTo] = useState(false)

	const transactionTypes = [
		'Incoming transactions',
		'Outgoing transactions',
		'Load ups',
		'Cash out to USD',
	]

	useEffect(() => {
		// if (!loginStore.getBillingData.billing_data_added) setShowBankModal(true)
		// else setShowBankModal(false)
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
									setAmount(''),
									navigation.navigate("home", {})
								]}
								buttonLabel={'Explore BerkShares'}
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
					<Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>Make a report</Text>
					<Text style={styles.LINE} />
					<Text style={styles.SUB_TITLE}>
						{`Select the time period and the type of transactions you want to create a report for.`}
					</Text>

					<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
						<Text style={styles.INPUT_LABEL_STYLE}>AMOUNT</Text>
					</View>

					<View style={styles.INPUT_AMOUNT_STYLE_CONTAINER}>
						<Button
							buttonStyle={
								Amount === 'Today'
									? [styles.BUTTON_AMOUNT_ACTIVE, { backgroundColor: loginStore.getAccountColor }]
									: [styles.BUTTON_AMOUNT, { borderColor: loginStore.getAccountColor }]
							}
							buttonLabelStyle={{ color: Amount === 'Today' ? COLOR.PALETTE.white : loginStore.getAccountColor }}
							onPress={() => setAmount('Today')}
							buttonLabel={'Today'}
						/>
						<Button
							buttonStyle={
								Amount === 'Week'
									? [styles.BUTTON_AMOUNT_ACTIVE, { backgroundColor: loginStore.getAccountColor }]
									: [styles.BUTTON_AMOUNT, { borderColor: loginStore.getAccountColor }]
							}
							buttonLabelStyle={{ color: Amount === 'Week' ? COLOR.PALETTE.white : loginStore.getAccountColor }}
							onPress={() => setAmount('Week')}
							buttonLabel={'Week'}
						/>
						<Button
							buttonStyle={
								Amount === 'Month'
									? [styles.BUTTON_AMOUNT_ACTIVE, { backgroundColor: loginStore.getAccountColor }]
									: [styles.BUTTON_AMOUNT, { borderColor: loginStore.getAccountColor }]
							}
							buttonLabelStyle={Amount === 'Month' ? { color: COLOR.PALETTE.white } : { color: loginStore.getAccountColor }}
							onPress={() => setAmount('Month')}
							buttonLabel={'Month'}
						/>
					</View>

					<View style={styles.FILTER_CONTAINER}>
						<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
							<Text style={styles.INPUT_LABEL_STYLE}>START DATE</Text>
							<Text style={styles.INPUT_LABEL_STYLE}>END DATE</Text>
						</View>
						<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
							<View style={styles.SMALL_INPUT_STYLE_CONTAINER}>
								<TextInput
									onFocus={() => setOpenFrom(true)}
									style={styles.SMALL_INPUT_STYLE}
									keyboardType='numeric'
									value={`${DateFrom.toLocaleDateString()}`}
									placeholder={`MM/DD/YY`}
									placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
								/>
								<DatePicker
									modal
									open={OpenFrom}
									date={DateFrom}
									onConfirm={(date) => {
										setOpenFrom(false)
										setDateFrom(date)
									}}
									onCancel={() => setOpenFrom(false)}
								/>
							</View>
							<View style={styles.SMALL_INPUT_STYLE_CONTAINER}>
								<TextInput
									style={styles.SMALL_INPUT_STYLE}
									onFocus={() => setOpenTo(true)}
									keyboardType='numeric'
									value={`${DateTo.toLocaleDateString()}`}
									placeholder={`MM/DD/YY`}
									placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
								/>
								<DatePicker
									modal
									open={OpenTo}
									date={DateTo}
									onConfirm={(date) => {
										setOpenTo(false)
										setDateTo(date)
									}}
									onCancel={() => setOpenTo(false)}
								/>
							</View>
						</View>

						<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
							<Text style={styles.INPUT_LABEL_STYLE}>TYPE OF TRANSACTIONS</Text>
						</View>
						<View style={SelectOpen ? styles.SELECT_INPUT_STYLE_CONTAINER_OPEN : styles.SELECT_INPUT_STYLE_CONTAINER}>
							<TouchableOpacity style={styles.SELECT_ICON} onPress={() => [setSelectOpen(!SelectOpen), setTransactionType('')]}>
								<Text style={styles.SELECT_LABEL}>{TransactionType || 'All'}</Text>
								<Entypo name={SelectOpen ? "chevron-up" : "chevron-down"} size={23} color={'black'} style={{ marginRight: 20 }} />
							</TouchableOpacity>
							{SelectOpen && transactionTypes.map((t, key) => (
								<TouchableOpacity key={key + 'btype'} style={styles.SELECT_ICON} onPress={() => [setSelectOpen(!SelectOpen), setTransactionType(t)]}>
									<Text style={styles.SELECT_LABEL}>{t}</Text>
								</TouchableOpacity>
							))}
						</View>
					</View>
					<Text style={styles.LINE} />
				</View>
				{ConfirmModal()}
				{bankModal()}
			</KeyboardAvoidingView>
			<Button
				buttonStyle={{
					backgroundColor: loginStore.getAccountColor,
					bottom: 5,
				}}
				onPress={() => setShowModal(true)}
				buttonLabel={'Send report'}
			/>
		</Screen>
	)
})
