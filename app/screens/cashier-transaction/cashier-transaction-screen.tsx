import { observer } from "mobx-react-lite";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Button, Screen, Text, ConnectBankModal } from "../../components";
import { ActivityIndicator, TextInput, TouchableOpacity, View, Modal, Platform, KeyboardAvoidingView, ScrollView, Image } from "react-native";
import { COLOR, IMAGES, METRICS } from "../../theme";
import styles from './cashier-transaction';
import Icon from "react-native-vector-icons/MaterialIcons"
import { useStores } from "../../models";
import { CheckBox } from 'react-native-elements'

export const CashierTransactionScreen = observer(function CashierTransactionScreen() {
	const navigation = useNavigation()
	const rootStore = useStores()
	const { loginStore } = rootStore
	const isFocused = useIsFocused();
	const returns = {
		TODAY: [
			{
				item: 'Customer sale',
				time: '7 min ago',
				amount: '10.00',
			},
			{
				item: 'Carr Hardware',
				time: '3:51, Jun 17, 2021',
				amount: '10.00',
			},
			{
				item: 'Cash out',
				time: '4:51, Jun 17, 2021',
				amount: '10.00',
			},
		],
		YESTERDAY: [
			{
				item: 'Customer return',
				time: '3:51, Jun 16, 2021',
				amount: '10.00',
			},
		]
	}

	const [ShowIndex, setShowIndex] = useState(true)
	const [Search, setSearch] = useState('')
	const [ShowFilter, setShowFilter] = useState(false)

	const [SelectedReturn, setSelectedReturn] = useState({})
	const [DetailModalVisible, setDetailModalVisible] = useState(false)

	const [ShowBankModal, setShowBankModal] = useState(false)

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
		if (isFocused) {
			// if (!loginStore.getBillingData.billing_data_added) setShowBankModal(true)
			// else setShowBankModal(false)
		}
	}, [isFocused])

	const bankModal = () =>
		<ConnectBankModal
			visible={ShowBankModal}
			buttonStyle={{ backgroundColor: loginStore.getAccountColor }}
			buttonAction={() => [navigation.navigate("linkBank"), setShowBankModal(false)]}
			onPressHome={() => [navigation.navigate("home"), setShowBankModal(false)]}
		/>

	const Filters = () => <View style={styles.FILTER_CONTAINER}>
		<Text style={styles.CLEAR_FILTERS}>Clear filters</Text>
		<View style={styles.LINE} />
	</View>

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
				{/* <View style={styles.USER_IMAGE_CONTAINER}>
			<Image
				resizeMode="cover"
				source={{ uri: SelectedReturn.image }}
				style={styles.USER_IMAGE}
			/>
		</View> */}
				<Text style={[styles.RETURN_ITEM_MODAL, { color: loginStore.getAccountColor }]}>{SelectedReturn.item}</Text>
				<View style={styles.RETURN_CONTAINER_MODAL}>
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
			{ShowFilter && Filters()}
			{Object.keys(returns).map((r, key) => ([
				<Text key={key + '_label'} style={styles.RETURNS_LABEL}>{r}</Text>,
				getDataFiltered(returns[r], ['item'], Search).map((i, key2) => (
					<TouchableOpacity onPress={() => [setSelectedReturn(i), setDetailModalVisible(true)]} key={key2 + '_values'} style={styles.RETURN_ITEM}>
						<View style={{ marginLeft: 15 }}>
							<Text style={styles.RETURN_ITEM_CUSTOMER}>{i.item}</Text>
							<Text style={styles.RETURN_ITEM_TIME}>{i.time}</Text>
						</View>
						<View style={styles.CONTAINER}>
							{!i.credit
								? <Text style={styles.RETURN_ITEM_AMOUNT_CREDIT}>{`+ C$ ${i.amount}`}</Text>
								: <Text style={styles.RETURN_ITEM_AMOUNT}>{`+ C$ ${i.amount}`}</Text>
							}

						</View>
					</TouchableOpacity>
				))
			]))}
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
				<ScrollView showsVerticalScrollIndicator={false} bounces={false}>
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
