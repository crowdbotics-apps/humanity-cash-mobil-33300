import { observer } from "mobx-react-lite";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Button, Screen, Text, TextInputComponent, ConnectBankModal } from "../../components";
import { TouchableWithoutFeedback, TextInput, TouchableOpacity, View, Modal, Platform, KeyboardAvoidingView, ScrollView, Image } from "react-native";
import { COLOR, IMAGES, METRICS } from "../../theme";
import styles from './my-coupons-style';
import Icon from "react-native-vector-icons/MaterialIcons"
import { useStores } from "../../models";
import { CheckBox } from 'react-native-elements'
import DatePicker from 'react-native-date-picker'
import Entypo from "react-native-vector-icons/Entypo"
import { runInAction } from "mobx"
import { notifyMessage } from "../../utils/helpers"

export const MyCouponsScreen = observer(function MyCouponsScreen() {
	const navigation = useNavigation()
	const rootStore = useStores()
	const { loginStore } = rootStore
	const isFocused = useIsFocused();
	const transactionTypes = [
		'Discount percentage',
		'Discount dollar amount',
		'Special Offer',
	]

	const coupons: any = [
		{
			title: 'Super Promo',
			start_date: '12/31/2022',
			end_date: '12/31/2023',
			type_of_promo: 'Discount percentage',
			discount_input: '10%',
			image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg'
		},
		{
			title: 'Super Promo 2',
			start_date: '12/31/2022',
			end_date: '12/31/2023',
			type_of_promo: 'Discount dollar amount',
			discount_input: '$20',
			image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg'
		},
		{
			title: 'Super Promo 3',
			start_date: '12/31/2022',
			end_date: '12/31/2023',
			type_of_promo: 'Special Offer',
			discount_input: 'Free Wine',
			image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg'
		},
	]

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

	const getCoupons = () => {
		loginStore.environment.api
			.getCoupons()
			.then((result: any) => {
				console.log(' getCoupons ===>>>  ', JSON.stringify(result, null, 2))
				if (result.kind === "ok") {
					runInAction(() => {
						loginStore.setMerchantCoupons(result?.data?.results)
					})
				} else if (result.kind === "bad-data") {
					const key = Object.keys(result?.errors)[0]
					const msg = `${key}: ${result?.errors?.[key][0]}`
					notifyMessage(msg)
				}
			})
	}

	useEffect(() => {
		if (isFocused) getCoupons()
	}, [isFocused])

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
			<Text style={styles.INPUT_LABEL_STYLE}>TYPE OF DISCOUNT</Text>
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
		<TouchableWithoutFeedback onPress={() => setDetailModalVisible(false)}>
				<View style={styles.ROOT_MODAL}>
					<View style={styles.MODAL_CONTENT}>
						<Text style={styles.STEP_TITLE_BLACK}>Are you sure you want to remove this coupon</Text>
						{/* <Text style={styles.STEP_SUB_TITLE_MODAL}>Please note that unsaved data will be lost.</Text> */}
						<TouchableOpacity
							style={styles.MODAL_BUTTON}
							onPress={() => [setDetailModalVisible(false)]}>
							<Text style={styles.SUBMIT_BUTTON_LABEL}>Remove</Text>
						</TouchableOpacity>
					</View>

				</View>
			</TouchableWithoutFeedback>
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
							<View style={[styles.CONTAINER, { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
								<Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>My Coupons</Text>
								<TouchableOpacity onPress={() => navigation.navigate("createCoupon")}>
								<Entypo name={'circle-with-plus'} size={40} color={loginStore.getAccountColor} style={styles.ADD_ICON} />
								</TouchableOpacity>
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
								{loginStore.getMerchantCoupons.map((i, key) => (
									<TouchableOpacity onLongPress={() => [setSelectedReturn(i), setDetailModalVisible(true)]} key={key + '_values'} style={styles.RETURN_ITEM}>
										<Image
											source={{ uri: i.promo_image }}
											resizeMode='cover'
											style={styles.RETURN_IMAGE}
										/>
										<View style={[styles.CONTAINER, { flex: 1, justifyContent: 'center' }]}>
										<Text key={key + '_label'} style={styles.RETURNS_LABEL}>
											{ (i.start_date && i.end_date)
											 ? `${i.start_date} - ${i.end_date}`
											: '-'
											}
											 </Text>
											<Text style={styles.RETURN_ITEM_CUSTOMER}>{i.title}</Text>
										</View>
										<View style={styles.CONTAINER}>
											<Text style={styles.RETURN_ITEM_AMOUNT_CASH_OUT}>{i.discount_input}</Text>
										</View>
									</TouchableOpacity>
								))}
							</View>
						</View>
					</View>
				</ScrollView>
				{ReturnDetailModal()}
				{bankModal()}
				{ShowIndex &&
					<Button
						buttonStyle={{ backgroundColor: loginStore.getAccountColor, marginTop: 5}}
						onPress={() => navigation.navigate("createCoupon")}
						buttonLabel={'Create a coupon'}
						showBottonMenu
						accountType={loginStore.getSelectedAccount}
					/>
				}
			</KeyboardAvoidingView>
		</Screen>
	)
})
