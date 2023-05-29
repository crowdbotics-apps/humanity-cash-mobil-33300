import { observer } from "mobx-react-lite";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Button, Screen, Text, ConnectBankModal } from "../../components";
import { ActivityIndicator, TextInput, TouchableOpacity, View, Modal, KeyboardAvoidingView } from "react-native";
import { COLOR, METRICS } from "../../theme";
import styles from './make-report';
import Icon from "react-native-vector-icons/MaterialIcons"
import { useStores } from "../../models";
import DatePicker from 'react-native-date-picker'
import Entypo from "react-native-vector-icons/Entypo"
import { notifyMessage } from "../../utils/helpers"
import { ScrollView } from "react-native-gesture-handler";

export const MakeReportScreen = observer(function MakeReportScreen() {
	const navigation = useNavigation()
	const rootStore = useStores()
	const { loginStore } = rootStore
    const [Loading, setLoading] = useState(false);
	const [Amount, setAmount] = useState('')

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
	];

	const setTodayDate = () => {
		setAmount('Today')
		setDateFrom(new Date())
		setDateTo(new Date())
	}

	const setAllCurrentWeekDate = () => {
		const now = new Date;
		const first = now.getDate() - now.getDay();
		const last = first + 6;
		const firstDay = new Date(now.setDate(first));
		const lastday = new Date(now.setDate(last));
		setAmount('Week');
		setDateFrom(firstDay);
		setDateTo(lastday);
	}

	const setAllCurrentMonth = () => {
		const now = new Date();
		const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
		const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
		setAmount('Month');
		setDateFrom(firstDay);
		setDateTo(lastDay);
	}

	const confirmDate = (date, mode = 'from') => {
		if (mode === 'from') {
			setOpenFrom(false)
			setDateFrom(date)
			return
		}
		setOpenTo(false)
		setDateTo(date)
	}

	useEffect(() => {
		// if (!loginStore.getBillingData.billing_data_added) setShowBankModal(true)
		// else setShowBankModal(false)
	}, [])

	const makeReport = () => {
		setLoading(true)
		loginStore.environment.api.sendReport({
			start_date: DateFrom.toISOString().split('T')[0],
			end_date: DateTo.toISOString().split('T')[0],
		})
			.then((result: any) => {
				setLoading(false)
				if (result.kind === "ok") {
					notifyMessage('The reports have been sent to your email')
				} else if (result.kind === "bad-data") {
					if (typeof(result.errors) === 'string') notifyMessage(result.errors)
					else {
						const key = Object.keys(result?.errors)[0]
						const msg = `${key}: ${result?.errors?.[key][0]}`
						notifyMessage(msg)
					}
				} else {
					notifyMessage(null)
				}
			})
	}

	const bankModal = () =>
		<ConnectBankModal
			visible={ShowBankModal}
			buttonStyle={{ backgroundColor: loginStore.getAccountColor }}
			buttonAction={() => {navigation.navigate("linkBank"); setShowBankModal(false)}}
			onPressHome={() => [navigation.navigate("home"), setShowBankModal(false)]}
		/>

	return (
		<Screen
			showHeader
			preset="fixed"
			statusBar={'dark-content'}
			unsafe={true}
			style={styles.ROOT}
		>
			<KeyboardAvoidingView enabled style={styles.ROOT} >
				<View style={styles.HEADER_ACTIONS}>
					<TouchableOpacity onPress={() => navigation.navigate("home")} style={styles.BACK_BUTON_CONTAINER}>
						<Icon name={"arrow-back"} size={23} color={COLOR.PALETTE.black} />
						<Text style={styles.BACK_BUTON_LABEL}>{` Home`}</Text>
					</TouchableOpacity>
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
							onPress={setTodayDate}
							buttonLabel={'Today'}
						/>
						<Button
							buttonStyle={
								Amount === 'Week'
									? [styles.BUTTON_AMOUNT_ACTIVE, { backgroundColor: loginStore.getAccountColor }]
									: [styles.BUTTON_AMOUNT, { borderColor: loginStore.getAccountColor }]
							}
							buttonLabelStyle={{ color: Amount === 'Week' ? COLOR.PALETTE.white : loginStore.getAccountColor }}
							onPress={setAllCurrentWeekDate}

							buttonLabel={'Week'}
						/>
						<Button
							buttonStyle={
								Amount === 'Month'
									? [styles.BUTTON_AMOUNT_ACTIVE, { backgroundColor: loginStore.getAccountColor }]
									: [styles.BUTTON_AMOUNT, { borderColor: loginStore.getAccountColor }]
							}
							buttonLabelStyle={Amount === 'Month' ? { color: COLOR.PALETTE.white } : { color: loginStore.getAccountColor }}
							onPress={setAllCurrentMonth}
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
									mode='date'
									onConfirm={(date) => confirmDate(date)}
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
									mode='date'
									onConfirm={(date) => confirmDate(date, 'to')}
									onCancel={() => setOpenTo(false)}
								/>
							</View>
						</View>

						<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
							<Text style={styles.INPUT_LABEL_STYLE}>TYPE OF TRANSACTIONS</Text>
						</View>
						<ScrollView style={SelectOpen ? styles.SELECT_INPUT_STYLE_CONTAINER_OPEN : styles.SELECT_INPUT_STYLE_CONTAINER}>
							<TouchableOpacity style={styles.SELECT_ICON} onPress={() => [setSelectOpen(!SelectOpen), setTransactionType('')]}>
								<Text style={styles.SELECT_LABEL}>{TransactionType || 'All'}</Text>
								<Entypo name={SelectOpen ? "chevron-up" : "chevron-down"} size={23} color={'black'} style={{ marginRight: 20 }} />
							</TouchableOpacity>
							{SelectOpen && transactionTypes.map((t, key) => (
								<TouchableOpacity key={key + 'btype'} style={styles.SELECT_ICON} onPress={() => [setSelectOpen(!SelectOpen), setTransactionType(t)]}>
									<Text style={styles.SELECT_LABEL}>{t}</Text>
								</TouchableOpacity>
							))}
						</ScrollView>
					</View>
					<Text style={styles.LINE} />
				</View>
				{bankModal()}
			</KeyboardAvoidingView>
			<Button
				buttonStyle={[styles.SUBMIT_BUTTON, { backgroundColor: Loading ? `${loginStore.getAccountColor}40` : loginStore.getAccountColor }]}
				onPress={() => makeReport()}
				loading={Loading}
				disabled={Loading}
				buttonLabel={'Send report'}
			/>
		</Screen>
	)
})
