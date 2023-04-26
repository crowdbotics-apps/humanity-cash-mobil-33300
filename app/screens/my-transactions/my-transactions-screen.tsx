/* eslint-disable prefer-const */
/* eslint-disable array-callback-return */
import { observer } from "mobx-react-lite";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Button, Screen, Text, TextInputComponent, ConnectBankModal } from "../../components";
import { ActivityIndicator, TextInput, TouchableOpacity, View, Modal, Platform, KeyboardAvoidingView, ScrollView, Image, RefreshControl } from "react-native";
import { COLOR, IMAGES, METRICS } from "../../theme";
import styles from './my-transactions-style';
import Icon from "react-native-vector-icons/MaterialIcons"
import { useStores } from "../../models";
import { CheckBox } from 'react-native-elements'
import DatePicker from 'react-native-date-picker'
import Entypo from "react-native-vector-icons/Entypo"
import { runInAction } from "mobx"
import { notifyMessage, getRandomProfileImage } from "../../utils/helpers"
import QRCode from 'react-native-qrcode-svg'
import { BaseConfirmModal as UserModal } from '../../layouts'
import moment from "moment";

export const MyTransactionsScreen = observer(function MyTransactionsScreen() {
	const navigation = useNavigation()
	const rootStore = useStores()
	const { loginStore } = rootStore

	const transactionTypes = [
		{ label: 'Incoming transactions', value: 'Transfer' },
		{ label: 'Outgoing transactions', value: 'Transfer' },
		{ label: 'Load ups', value: 'Deposit' },
		{ label: 'Cash out to USD', value: 'Withdraw' },
	]

	const [ShowIndex, setShowIndex] = useState(true)
	const isFocused = useIsFocused();

	const [Search, setSearch] = useState('')
	const [ShowFilter, setShowFilter] = useState(false)
	const [SelectedReturn, setSelectedReturn] = useState({})
	const [DetailModalVisible, setDetailModalVisible] = useState(false)
	const [DistanceFilter, setDistanceFilter] = useState('')
	const [SelectOpen, setSelectOpen] = useState(false)
	const [TransactionType, setTransactionType] = useState('All');
	const [DateFrom, setDateFrom] = useState(new Date((new Date).getFullYear(), 0, 1))
	const [OpenFrom, setOpenFrom] = useState(false)
	const [DateTo, setDateTo] = useState(new Date((new Date).getFullYear(), 11, 31))
	const [OpenTo, setOpenTo] = useState(false)
	const [refreshing, setRefreshing] = useState(false);
	const [ReturnQR, setReturnQR] = useState(false)

	const [ShowBankModal, setShowBankModal] = useState(false)

	const [TransactionData, setTransactionData] = useState([])

	useEffect(() => {
		if (isFocused) {
			getTransactions()
			getBalanceData()
		}
	}, [isFocused])

	useEffect(() => {
		if (DetailModalVisible && ReturnQR) {
			const intervalId = setInterval(() => {
				loginStore.environment.api
					.getBalanceData()
					.then((result: any) => {
						if (result.kind === "ok") {
							const currentBalance = loginStore?.balance?.[loginStore.getSelectedAccount] || 0
							const newBalance = result.data?.[loginStore.getSelectedAccount] || 0
							if (currentBalance !== newBalance) {
								setDetailModalVisible(false)
								setReturnQR(false)
								loginStore.setBalanceData(result.data)
								getTransactions()
								notifyMessage('You receive a transaction')
							}
						}
					})
			}, 5000)
			return () => clearInterval(intervalId); 
		}
	  }, [DetailModalVisible, ReturnQR])

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		getTransactions()
	}, []);

	const getBalanceData = () => {
		loginStore.environment.api
			.getBalanceData()
			.then((result: any) => {
				if (result.kind === "ok") {
					runInAction(() => {
						loginStore.setBalanceData(result.data)
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
			.getMobileTransactions({ selected_account: loginStore.selected_account })
			.then((result: any) => {
				setRefreshing(false)
				if (result.kind === "ok") {
					runInAction(() => {
						let temp = []
						if (Array.isArray(result?.data)) {
							result?.data.map((r: any) => {
								if (!temp.find(t => t.id === r.id)) {
									r.ach = false
									temp.push(r)
								}
							})
							setTransactionData(temp)
						}
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
		let data = initialData

		if (filter !== '' || filter) {
			initialData.map(d => {
				keys.map(k => {
					try { if (d[k].toLocaleLowerCase().includes(filter.toLocaleLowerCase())) data.push(d) }
					catch { }
				})
			})
		}
		if (TransactionType !== 'All' && TransactionType !== '' && TransactionType?.value)
			data = data.filter(d => d.type === TransactionType?.value)
		if (DateFrom && DateTo)
			data = data.filter(d => (DateFrom <= new Date(d.created) && new Date(d.created) <= DateTo))
		return data
	}

	const getFormatedTransactions = () => {
		let data: any = {}
		TransactionData.map(r => {
			const date = r.created.split('T')[0]
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

	const ReturnDetailModal = () => ReturnQR
		? <UserModal
			visible={DetailModalVisible}
			dark
			closeModalAction={() => [setDetailModalVisible(false), setReturnQR(false)]}
			username={loginStore.getSelectedAccount === 'consumer' ? loginStore.ProfileData.full_name : loginStore.getAllData.business_name}
			imgSrc={SelectedReturn?.counterpart_data?.profile_picture}
		>
			<QRCode
				value={JSON.stringify({
					...SelectedReturn,
					to: loginStore?.getProfilesId[loginStore.getSelectedAccount],
					to_is_consumer: loginStore.getSelectedAccount === 'consumer',
					amount: SelectedReturn.amount
				})}
				size={200}
			/>
			<Text style={styles.LINK}>Show QR code to the cashier </Text>
		</UserModal>
		: <Modal transparent visible={DetailModalVisible}>
			<View style={styles.ROOT_MODAL}>
				<TouchableOpacity
					onPress={() => setDetailModalVisible(false)}
					style={styles.CLOSE_MODAL_BUTTON}
				>
					<Text style={[styles.BACK_BUTON_LABEL, { color: 'white' }]}>{`Close `}</Text>
					<Icon name={"close"} size={20} color={'white'} />
				</TouchableOpacity>

				<View style={styles.MODAL_CONTAINER}>
					<View style={styles.USER_IMAGE_CONTAINER}>
						<Image
							resizeMode="cover"
							source={SelectedReturn?.counterpart_data?.profile_picture
								? { uri: SelectedReturn?.counterpart_data?.profile_picture }
								: getRandomProfileImage()
							}
							style={styles.USER_IMAGE}
						/>
					</View>
					{/* <Text style={[styles.RETURN_ITEM_MODAL, { color: loginStore.getAccountColor }]}>{SelectedReturn.item}</Text> */}

					<Text style={[styles.RETURN_ITEM_MODAL, { color: loginStore.getAccountColor }]}>{SelectedReturn?.counterpart_data?.name}</Text>
					<View style={styles.RETURN_CONTAINER}>
						<Text style={[styles.RETURN_AMOUNT, { color: loginStore.getAccountColor }]}>C$ {SelectedReturn.amount}</Text>
						<View style={styles.RETURN_DETAIL_CONTAINER}>
						<Text style={styles.RETURN_DETAIL_LABEL}>COUNTERPART NAME</Text>
						<Text style={styles.RETURN_DETAIL_LABEL}>{SelectedReturn?.counterpart_data?.name}</Text>
					</View>
						<View style={styles.RETURN_DETAIL_CONTAINER}>
							<Text style={styles.RETURN_DETAIL_LABEL}>TRANSACTION ID</Text>
							<Text style={styles.RETURN_DETAIL_LABEL}>{SelectedReturn.transaction_id}</Text>
						</View>
						<View style={styles.RETURN_DETAIL_CONTAINER}>
							<Text style={styles.RETURN_DETAIL_LABEL}>TYPE</Text>
							<Text style={styles.RETURN_DETAIL_LABEL}>{SelectedReturn.type}</Text>
						</View>
						<View style={styles.RETURN_DETAIL_CONTAINER}>
							<Text style={styles.RETURN_DETAIL_LABEL}>DATE</Text>
							<Text style={styles.RETURN_DETAIL_LABEL}>{moment(SelectedReturn?.created).format('llll')}</Text>
						</View>
					</View>
					<Text onPress={() => setReturnQR(true)} style={styles.LINK}>{SelectedReturn.type === 'Transfer' ? 'I want to make a return' : ' '}</Text>

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
				<TouchableOpacity style={styles.HEADER} onPress={() => navigation.navigate('home')}>
					<Icon name={"arrow-back"} size={23} color={loginStore.getAccountColor} />
					<Text style={[styles.BACK_BUTON_LABEL, { color: loginStore.getAccountColor }]}>{` Home`}</Text>
				</TouchableOpacity>
			</View>
			<KeyboardAvoidingView enabled style={styles.ROOT}>
				<ScrollView
					showsVerticalScrollIndicator={false}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
							enabled={true}
						/>
					}
				>
					<View style={styles.ROOT_CONTAINER}>
						<View style={styles.CONTAINER}>
							<View style={styles.STEP_CONTAINER}>
								<Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>My Transactions</Text>
								<View style={styles.AMOUNT_CONTAINER}>
									<View style={{ flexDirection: 'row' }}>
										<Text style={[styles.AMOUNT, { color: loginStore.getAccountColor }]}>C$ {loginStore?.balance?.[loginStore.getSelectedAccount] || 0}</Text>
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
								{ShowFilter && <View style={styles.FILTER_CONTAINER}>
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
											<Text style={styles.SELECT_LABEL}>{TransactionType?.label || 'All'}</Text>
											<Entypo name={SelectOpen ? "chevron-up" : "chevron-down"} size={23} color={'black'} style={{ marginRight: 20 }} />
										</TouchableOpacity>
										{SelectOpen && transactionTypes.map((t, key) => (
											<TouchableOpacity key={key + 'btype'} style={styles.SELECT_ICON} onPress={() => [setSelectOpen(!SelectOpen), setTransactionType(t)]}>
												<Text style={styles.SELECT_LABEL}>{t.label}</Text>
											</TouchableOpacity>
										))}
									</View>
									<Text onPress={() => setDistanceFilter('')} style={styles.CLEAR_FILTERS}>Clear filters</Text>
									<View style={styles.LINE} />
								</View>}
								{Object.values(getFormatedTransactions()).map((r: any, key) => {
									let data = getDataFiltered(r.data, ['amount', 'type'], Search)
									if (Array.isArray(data) && data.length > 0) {
										return (
											[
												<Text key={key + '_label'} style={styles.RETURNS_LABEL}>{r.label}</Text>,
												data.map((i, key2) =>
													<TouchableOpacity onPress={() => [setSelectedReturn(i), setDetailModalVisible(true)]} key={key2 + '_values'} style={styles.RETURN_ITEM}>
														<Image
															source={i?.counterpart_data?.profile_picture ? { uri: i?.counterpart_data?.profile_picture } : getRandomProfileImage()}
															resizeMode='cover'
															style={styles.RETURN_IMAGE}
														/>
														<Text style={styles.RETURN_ITEM_CUSTOMER}>{i.type}</Text>
														<View style={styles.CONTAINER}>
															{i.type === 'Deposit'
																? <Text style={styles.RETURN_ITEM_AMOUNT_CREDIT}>{`C$ +${i.amount}`}</Text>
																: i.type === 'Transfer'
																	? <Text style={styles.RETURN_ITEM_AMOUNT}>{`C$ ${i.credit ? '+' : '-'}${i.amount}`}</Text>
																	: <Text style={styles.RETURN_ITEM_AMOUNT_CASH_OUT}>{`C$ -${i.amount || ''}`}</Text>
															}
														</View>
													</TouchableOpacity>
												),

												<View key={key + '_line'} style={styles.LINE} />
											]
										)
									}
								})}
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
