import { observer } from "mobx-react-lite";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Button, Screen, Text, ConnectBankModal } from "../../components";
import { ActivityIndicator, TextInput, TouchableOpacity, View, Modal, Platform, KeyboardAvoidingView, ScrollView, RefreshControl } from "react-native";
import { COLOR, IMAGES, METRICS } from "../../theme";
import styles from './cashier-transaction';
import Icon from "react-native-vector-icons/MaterialIcons"
import { useStores } from "../../models";
import { runInAction } from "mobx"
import { notifyMessage } from "../../utils/helpers"
import moment from "moment";

export const CashierTransactionScreen = observer(function CashierTransactionScreen() {
	const navigation = useNavigation()
	const rootStore = useStores()
	const { loginStore } = rootStore
	const isFocused = useIsFocused();


	const [Search, setSearch] = useState('')
	const [refreshing, setRefreshing] = useState(false);
	const [SelectedReturn, setSelectedReturn] = useState({})
	const [DetailModalVisible, setDetailModalVisible] = useState(false)

	const [ShowBankModal, setShowBankModal] = useState(false)
	const [TransactionData, setTransactionData] = useState([])

	const getDataFiltered = (initialData: Array<any>, keys: Array<string>, filter: any) => {
		if (initialData === [] || !initialData) return []
		if (keys === [] || !keys) return initialData
		if (filter === '' || !filter) return initialData
		let data = []
		initialData.map(d => {
			keys.map(k => {
				try { if (d[k].toLocaleLowerCase().includes(filter.toLocaleLowerCase())) data.push(d) }
				catch { }
			})
		})
		return data
	}

	useEffect(() => {
		if (isFocused) getTransactions()
	}, [isFocused])

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		getTransactions()
	}, []);

	const getTransactions = () => {
		loginStore.environment.api
			.getMobileTransactions({ selected_account: 'merchant' })
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

	const getFormatedTransactions = () => {
		let data: any = {}
		TransactionData.map(r => {
			const date = moment(r.created.split('T')[0]).format('L')
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


	const bankModal = () =>
		<ConnectBankModal
			visible={ShowBankModal}
			buttonStyle={{ backgroundColor: loginStore.getAccountColor }}
			buttonAction={() => [navigation.navigate("linkBank"), setShowBankModal(false)]}
			onPressHome={() => [navigation.navigate("home"), setShowBankModal(false)]}
		/>

	const ReturnDetailModal = () => <Modal transparent visible={DetailModalVisible}>
		<View style={styles.ROOT_MODAL}>
			<TouchableOpacity
				onPress={() => setDetailModalVisible(false)}
				style={styles.CLOSE_MODAL_BUTTON}
			>
				<Text style={[styles.BACK_BUTON_LABEL, { color: 'black' }]}>{`Close `}</Text>
				<Icon name={"close"} size={20} color={'#0D0E21'} />
			</TouchableOpacity>
			<View style={styles.MODAL_CONTAINER}>
				<Text style={[styles.RETURN_ITEM_MODAL, { color: loginStore.getAccountColor }]}>{SelectedReturn.item}</Text>
				<View style={styles.RETURN_CONTAINER_MODAL}>
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
				<Text style={[styles.STEP_SUB_TITLE, { color: loginStore.getAccountColor }]}>{loginStore.ProfileData.username}</Text>
			</View>
			<View />
		</View>
	</Modal>

	const ReturnIndex = () =>
		<View style={styles.CONTAINER}>
			<View style={styles.STEP_CONTAINER}>
				<Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>Transactions</Text>
			</View>
			<Text style={[styles.AMOUNT_LABEL, { color: loginStore.getAccountColor }]}>BALANCE</Text>
			<Text style={[styles.AMOUNT, { color: loginStore.getAccountColor }]}>C$ 0</Text>

			<View style={styles.INPUT_STYLE_CONTAINER}>
				<View style={styles.SEARCH_INPUT_STYLE_CONTAINER}>
					<Icon name={"search"} size={25} color={COLOR.PALETTE.black} style={{ marginLeft: 20 }} />
					<TextInput
						style={styles.INPUT_STYLE}
						onChangeText={t => setSearch(t)}
						value={Search}
						placeholder={`Search`}
						placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
					/>
				</View>
			</View>
			{Object.values(getFormatedTransactions()).map((r: any, key) => {
				let data = getDataFiltered(r.data, ['amount', 'type'], Search)
				if (Array.isArray(data) && data.length > 0) {
					return ([
						<Text key={key + '_label'} style={styles.RETURNS_LABEL}>{r.label}</Text>,
						data.map((i, key2) => (
							<TouchableOpacity onPress={() => [setSelectedReturn(i), setDetailModalVisible(true)]} key={key2 + '_values'} style={styles.RETURN_ITEM}>
								<View style={{ marginLeft: 15 }}>
									<Text style={styles.RETURN_ITEM_CUSTOMER}>{i.type}</Text>
									<Text style={styles.RETURN_ITEM_TIME}>{moment(i?.created).format('llll')}</Text>
								</View>
								<View style={styles.CONTAINER}>
									{i.type === 'Deposit'
										? <Text style={styles.RETURN_ITEM_AMOUNT_CREDIT}>{`C$ +${i.amount}`}</Text>
										: i.type === 'Transfer'
											? <Text style={styles.RETURN_ITEM_AMOUNT_CREDIT}>{`C$ ${i.credit ? '+' : '-'}${i.amount}`}</Text>
											: <Text style={styles.RETURN_ITEM_AMOUNT_CREDIT}>{`C$ -${i.amount || ''}`}</Text>
									}
								</View>
							</TouchableOpacity>
						))

					])
				}
			})}
			<View style={{ height: 100 }} />
		</View>

	return (
		<Screen
			showHeader
			preset="fixed"
			statusBar={'dark-content'}
			unsafe={true}
			style={styles.ROOT}
		>
			<View style={styles.HEADER_ACTIONS}>
				<View />
				<TouchableOpacity style={styles.BACK_BUTON_CONTAINER} onPress={() => navigation.navigate("home")}>
					<Text style={[styles.BACK_BUTON_LABEL, { color: loginStore.getAccountColor }]}>{`Close `}</Text>
					<Icon name={"close"} size={23} color={loginStore.getAccountColor} />
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
							{ReturnIndex()}
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
			{bankModal()}
			{ReturnDetailModal()}

		</Screen>
	)
})
