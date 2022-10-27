/* eslint-disable prefer-const */
/* eslint-disable array-callback-return */
import { observer } from "mobx-react-lite";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Button, Screen, Text, TextInputComponent, ConnectBankModal } from "../../components";
import { ActivityIndicator, TextInput, TouchableOpacity, View, Modal, Platform, KeyboardAvoidingView, ScrollView, Image } from "react-native";
import { COLOR, IMAGES, METRICS } from "../../theme";
import styles from './my-transactions-style';
import Icon from "react-native-vector-icons/MaterialIcons"
import { useStores } from "../../models";
import { CheckBox } from 'react-native-elements'
import DatePicker from 'react-native-date-picker'
import Entypo from "react-native-vector-icons/Entypo"
import { runInAction } from "mobx"
import { notifyMessage } from "../../utils/helpers"

export const MyTransactionsScreen = observer(function MyTransactionsScreen() {
	const navigation = useNavigation()
	const rootStore = useStores()
	const { loginStore } = rootStore

	const transactionTypes = [
		'Incoming transactions',
		'Outgoing transactions',
		'Load ups',
		'Cash out to USD',
	]

	const [ShowIndex, setShowIndex] = useState(true)
	const isFocused = useIsFocused();

	const [Search, setSearch] = useState('')
	const [ShowFilter, setShowFilter] = useState(false)
	const [SelectedReturn, setSelectedReturn] = useState({})
	const [DetailModalVisible, setDetailModalVisible] = useState(false)
	const [DistanceFilter, setDistanceFilter] = useState('')
	const [SelectOpen, setSelectOpen] = useState(false)
	const [TransactionType, setTransactionType] = React.useState('All');
	const [DateFrom, setDateFrom] = useState(new Date())
	const [OpenFrom, setOpenFrom] = useState(false)
	const [DateTo, setDateTo] = useState(new Date())
	const [OpenTo, setOpenTo] = useState(false)

	const [ShowBankModal, setShowBankModal] = useState(false)

	useEffect(() => {
		// if (!loginStore.getBillingData.billing_data_added) setShowBankModal(true)
		// else setShowBankModal(false)
	}, [])

	useEffect(() => {
		if (isFocused) {
			getTransactions()
			getACHTransactions()
		}
	}, [isFocused])

	const getACHTransactions = () => {
		loginStore.environment.api
			.getACHTransactions()
			.then((result: any) => {
				console.log(' getACHTransactions ===>>>  ', JSON.stringify(result, null, 2))
				if (result.kind === "ok") {
					runInAction(() => {
						let temp = loginStore.getTransactions
						result?.data?.results.map((r: any) => {
							if (!temp.includes(r)) {
								r.ach = true
								temp.push(r) 
							} 
						})
						loginStore.setTransactions(temp)
					})
				} else if (result.kind === "bad-data") {
					const key = Object.keys(result?.errors)[0]
					const msg = `${key}: ${result?.errors?.[key][0]}`
					notifyMessage(msg)
				} else {
					notifyMessage(null)
				}
			})
	}

	const getTransactions = () => {
		loginStore.environment.api
			.getTransactions()
			.then((result: any) => {
				console.log(' getTransactions ===>>>  ', JSON.stringify(result, null, 2))
				if (result.kind === "ok") {
					runInAction(() => {
						let temp = loginStore.getTransactions
						result?.data?.results.map((r: any) => {
							if (!temp.includes(r)) {
								r.ach = false
								temp.push(r) 
							} 
						})
						loginStore.setTransactions(temp)
					})
				} else if (result.kind === "bad-data") {
					const key = Object.keys(result?.errors)[0]
					const msg = `${key}: ${result?.errors?.[key][0]}`
					notifyMessage(msg)
				} else {
					notifyMessage(null)
				}
			})
	}

	const getDataFiltered = (initialData: Array<any>, keys: Array<string>, filter: any) => {
		if (initialData === [] || !initialData) return []
		if (keys === [] || !keys) return initialData
		if (filter === '' || !filter) return initialData
		let data = []
		initialData.map(d => {
			keys.map(k => {
				try { if (d[k].toLocaleLowerCase().includes(filter.toLocaleLowerCase())) data.push(d) }
				catch {}
			})
		})
		return data
	}

	const getFormatedTransactions = () => {
		let data: any = {}
		loginStore.getTransactions.map(r => {
			const date = r.created_at.split('T')[0]
			if (data[date]) {
				data[date].data.push(r)
			} else {
				data[date] = {
					label: date,
					data: [r]
				}
			}
		})
		return data
	}

	const Filters = () => <View style={styles.FILTER_CONTAINER}>
		<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
			<Text style={styles.INPUT_LABEL_STYLE}>START DATE</Text>
			<Text style={styles.INPUT_LABEL_STYLE}>END DATE</Text>
		</View>
		<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
			<View style={styles.SMALL_INPUT_STYLE_CONTAINER}>
				<TextInput
					placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
					onFocus={() => setOpenFrom(true)}
					style={styles.SMALL_INPUT_STYLE}
					keyboardType='numeric'
					value={`${DateFrom.toLocaleDateString()}`}
					placeholder={`MM/DD/YY`}
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
					placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
					style={styles.SMALL_INPUT_STYLE}
					onFocus={() => setOpenTo(true)}
					keyboardType='numeric'
					value={`${DateTo.toLocaleDateString()}`}
					placeholder={`MM/DD/YY`}
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
		<Text onPress={() => setDistanceFilter('')} style={styles.CLEAR_FILTERS}>Clear filters</Text>
		<View style={styles.LINE} />
	</View>

	const ReturnDetailModal = () => <Modal transparent visible={DetailModalVisible}>
		<View style={styles.ROOT_MODAL}>
			<TouchableOpacity
				onPress={() => setDetailModalVisible(false)}
				style={styles.CLOSE_MODAL_BUTTON}
			>
				<Text style={styles.BACK_BUTON_LABEL}>{`Close `}</Text>
				<Icon name={"close"} size={20} color={'#0D0E21'} />
			</TouchableOpacity>
			<View style={styles.MODAL_CONTAINER}>
				<View style={styles.USER_IMAGE_CONTAINER}>
					<Image
						resizeMode="cover"
						source={{ uri: SelectedReturn.image }}
						style={styles.USER_IMAGE}
					/>
				</View>
				<Text style={[styles.RETURN_ITEM_MODAL, { color: loginStore.getAccountColor }]}>{SelectedReturn.item}</Text>
				<View style={styles.RETURN_CONTAINER}>
					<Text style={[styles.RETURN_AMOUNT, { color: loginStore.getAccountColor }]}>C$ {SelectedReturn.amount}</Text>
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
				<Text style={[styles.STEP_SUB_TITLE, { color: loginStore.getAccountColor }]}>{loginStore.ProfileData.username}</Text>
				<Text style={styles.LINK}>I want to make a return</Text>
			</View>
			<View />
		</View>
	</Modal>

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
			style={styles.ROOT}
		>
				<View style={styles.HEADER_ACTIONS}>
								<TouchableOpacity style={styles.HEADER} onPress={() => navigation.toggleDrawer()}>
									<Icon name={"menu"} size={23} color={loginStore.getAccountColor} />
									<Text style={[styles.BACK_BUTON_LABEL, { color: loginStore.getAccountColor }]}>{` Menu`}</Text>

								</TouchableOpacity>
							</View>
			<KeyboardAvoidingView enabled style={styles.ROOT}>
				<ScrollView showsVerticalScrollIndicator={false} bounces={false}>
					<View style={styles.ROOT_CONTAINER}>
						<View style={styles.CONTAINER}>

						

							<View style={styles.STEP_CONTAINER}>

								<Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor}]}>My Transactions</Text>
								<View style={styles.AMOUNT_CONTAINER}>
									<View style={{ flexDirection: 'row' }}>
										<Text style={[styles.AMOUNT, { color: loginStore.getAccountColor }]}>C$ 0</Text>
									</View>

								</View>
								<View style={styles.LINE} />
								<View style={styles.SEARCH_INPUT_CONTAINER}>
									<View style={styles.SEARCH_INPUT_STYLE_CONTAINER}>
										<Icon name={"search"} size={25} color={COLOR.PALETTE.black} />
										<TextInput
											placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
											style={styles.SEARCH_INPUT_STYLE}
											onChangeText={t => setSearch(t)}
											value={Search}
											placeholder={`Search`}
										/>
									</View>
									<TouchableOpacity style={styles.SEARCH_INPUT_ADJUSTMENTS} onPress={() => setShowFilter(!ShowFilter)}>
										<Image source={IMAGES.shortIcon} resizeMode='contain' style={{ width: 20, height: 20 }} />
										<Text>Filter</Text>
									</TouchableOpacity>
								</View>
								{ShowFilter && Filters()}
								{Object.values(getFormatedTransactions()).map((r, key) => ([
									<Text key={key + '_label'} style={styles.RETURNS_LABEL}>{r.label}</Text>,
									r.data.map((i, key2) => (
										<TouchableOpacity onPress={() => [setSelectedReturn(i), setDetailModalVisible(true)]} key={key2 + '_values'} style={styles.RETURN_ITEM}>
											<Image
												source={{ uri: i.image }}
												resizeMode='cover'
												style={styles.RETURN_IMAGE}
											/>
											<Text style={styles.RETURN_ITEM_CUSTOMER}>{i.type}</Text>
											{/* <Text style={styles.RETURN_ITEM_TIME}>{i.time}</Text> */}

											<View style={styles.CONTAINER}>
												{/* {i.credit
													? <Text style={styles.RETURN_ITEM_AMOUNT_CREDIT}>{`+ C$ ${i.credit}`}</Text>
													: i.debit
														? <Text style={styles.RETURN_ITEM_AMOUNT}>{`+ C$ ${i.debit}`}</Text>
														: <Text style={styles.RETURN_ITEM_AMOUNT_CASH_OUT}>{`+ C$ ${i.cash_out || ''}`}</Text>
												} */}
													<Text style={styles.RETURN_ITEM_AMOUNT}>{`+ C$ ${i.amount}`}</Text>
											</View>
										</TouchableOpacity>
									))
								]))}
								<View style={{ height: 100 }} />
							</View>
						</View>
					</View>
				</ScrollView>
				{ReturnDetailModal()}
				{bankModal()}
				{ShowIndex &&
					<Button
						buttonStyle={{
							backgroundColor: loginStore.getAccountColor,
						}}
						buttonLabelPre={<Icon key={'button_adornment'} name={"qr-code-2"} size={30} color={'white'} style={{ marginRight: 30 }} />}
						onPress={() => setShowIndex(false)}
						buttonLabel={'Receive or Scan to pay'}
						showBottonMenu
						hideButton
						accountType={loginStore.getSelectedAccount}
					/>
				}
			</KeyboardAvoidingView>
		</Screen>
	)
})
