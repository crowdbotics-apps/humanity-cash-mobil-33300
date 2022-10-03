import { observer } from "mobx-react-lite";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Button, Screen, Text, TextInputComponent } from "../../components";
import { ActivityIndicator, TextInput, TouchableOpacity, View, Modal, Platform, KeyboardAvoidingView, ScrollView, Image } from "react-native";
import { COLOR, IMAGES, METRICS } from "../../theme";
import styles from './my-transactions-style';
import Icon from "react-native-vector-icons/MaterialIcons"
import { useStores } from "../../models";
import { CheckBox } from 'react-native-elements'
import DatePicker from 'react-native-date-picker'
import Entypo from "react-native-vector-icons/Entypo"

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

	const returns = {
		TODAY: [
			{
				item: 'Customer sale',
				time: '7 min ago',
				credit: '10.00',
				amount: '10.00',
				image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg'
			},
			{
				item: 'Carr Hardware',
				time: '3:51, Jun 17, 2021',
				debit: '10.00',
				amount: '10.00',
				image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg'
			},
			{
				item: 'Cash out',
				time: '4:51, Jun 17, 2021',
				cash_out: '10.00',
				amount: '10.00',
				image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg'
			},
		],
		YESTERDAY: [
			{
				item: 'Customer return',
				time: '3:51, Jun 16, 2021',
				debit: '10.00',
				amount: '10.00',
				image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg'
			},
		]
	}

	const [ShowIndex, setShowIndex] = useState(true)

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
		if (!loginStore.getBillingData.billing_data_added) setShowBankModal(true)
		else setShowBankModal(false)
	}, [])

	const Filters = () => <View style={styles.FILTER_CONTAINER}>
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
				<ScrollView showsVerticalScrollIndicator={false} bounces={false}>
					<View style={styles.ROOT_CONTAINER}>
						<View style={styles.CONTAINER}>

							<View style={styles.HEADER_ACTIONS}>
								<TouchableOpacity style={styles.HEADER} onPress={() => navigation.toggleDrawer()}>
									<Icon name={"menu"} size={23} color={loginStore.getAccountColor} />
									<Text style={[styles.BACK_BUTON_LABEL, { color: loginStore.getAccountColor }]}>{` Menu`}</Text>

								</TouchableOpacity>
							</View>

							<View style={styles.STEP_CONTAINER}>

								<Text style={styles.STEP_TITLE}>My Transactions</Text>
								<View style={styles.AMOUNT_CONTAINER}>
									<View style={{ flexDirection: 'row' }}>
										<Image
											resizeMode="contain"
											source={IMAGES.currentDollarIcon}
											style={styles.AMOUNT_ICON}
										/>
										<Text style={[styles.AMOUNT, { color: loginStore.getAccountColor }]}>0</Text>
									</View>

								</View>
								<View style={styles.LINE} />
								<View style={styles.SEARCH_INPUT_CONTAINER}>
									<View style={styles.SEARCH_INPUT_STYLE_CONTAINER}>
										<Icon name={"search"} size={25} color={COLOR.PALETTE.black} />
										<TextInput
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
								{Object.keys(returns).map((r, key) => ([
									<Text key={key + '_label'} style={styles.RETURNS_LABEL}>{r}</Text>,
									returns[r].map((i, key2) => (
										<TouchableOpacity onPress={() => [setSelectedReturn(i), setDetailModalVisible(true)]} key={key2 + '_values'} style={styles.RETURN_ITEM}>
											<Image
												source={{ uri: i.image }}
												resizeMode='cover'
												style={styles.RETURN_IMAGE}
											/>
											<Text style={styles.RETURN_ITEM_CUSTOMER}>{i.item}</Text>
											{/* <Text style={styles.RETURN_ITEM_TIME}>{i.time}</Text> */}

											<View style={styles.CONTAINER}>
												{i.credit
													? <Text style={styles.RETURN_ITEM_AMOUNT_CREDIT}>{`+ C$ ${i.credit}`}</Text>
													: i.debit
														? <Text style={styles.RETURN_ITEM_AMOUNT}>{`+ C$ ${i.debit}`}</Text>
														: <Text style={styles.RETURN_ITEM_AMOUNT_CASH_OUT}>{`+ C$ ${i.cash_out || ''}`}</Text>
												}

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
					/>
				}
			</KeyboardAvoidingView>
		</Screen>
	)
})
