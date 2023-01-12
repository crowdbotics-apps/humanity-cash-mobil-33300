import {observer} from "mobx-react-lite";
import {useNavigation, useIsFocused} from "@react-navigation/native";
import React, {useEffect, useState} from "react";
import {Button, Screen, Text, ConnectBankModal, ConfirmCouponModal} from "../../components";
import {TouchableWithoutFeedback, TextInput, TouchableOpacity, View, Modal, KeyboardAvoidingView, ScrollView, Image, ViewStyle} from "react-native";
import {COLOR, IMAGES} from "../../theme";
import styles from './my-coupons-style';
import Icon from "react-native-vector-icons/MaterialIcons"
import {useStores} from "../../models";
import DatePicker from 'react-native-date-picker'
import Entypo from "react-native-vector-icons/Entypo"
import {runInAction} from "mobx"
import {notifyMessage} from "../../utils/helpers"

export const MyCouponsScreen = observer(function MyCouponsScreen() {
	const navigation = useNavigation()
	const rootStore = useStores()
	const { loginStore } = rootStore
	const isFocused = useIsFocused();
	const transactionTypes = [
		'All',
		'Discount percentage',
		'Discount dollar amount',
		'Special Offer',
	];

	const [ShowIndex, setShowIndex] = useState(true)
	const [Search, setSearch] = useState('')
	const [ShowFilter, setShowFilter] = useState(false)
	const [SelectedReturn, setSelectedReturn] = useState({})
	const [DetailModalVisible, setDetailModalVisible] = useState(false)
	const [DistanceFilter, setDistanceFilter] = useState('')
	const [SelectOpen, setSelectOpen] = useState(false)
	const [TransactionType, setTransactionType] = React.useState('All');
	const [DateFrom, setDateFrom] = useState(new Date(new Date().getFullYear(), 0, 1))
	const [OpenFrom, setOpenFrom] = useState(false)
	const [DateTo, setDateTo] = useState(new Date(new Date().getFullYear(), 11, 31))
	const [OpenTo, setOpenTo] = useState(false);
	const [couponsModalConfig, setCouponsModalConfig] = useState({couponSelected: null, showCouponModalInfo: false});
	const {couponSelected, showCouponModalInfo} = couponsModalConfig;
	const [ShowBankModal, setShowBankModal] = useState(false);
	const transactionStyle: ViewStyle = {display: SelectOpen ? 'flex' : 'none'}

	const getCoupons = () => {
		loginStore.environment.api
			.getCoupons({merchant_id: loginStore.merchant_id})
			.then((result: any) => {
				if (result.kind === "ok") {
					runInAction(() => {
						const filteredCouponsByLoguedMerchant = result?.data?.results.filter(c => c.merchant === loginStore.merchant_id)
						loginStore.setMerchantCoupons(filteredCouponsByLoguedMerchant);
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

	const getDataFiltered = (initialData: Array<any>, keys: Array<string>, filter: any) => {
		if (initialData === [] || !initialData) return []
		if (keys === [] || !keys) return initialData
		if (filter === "" || !filter) return initialData
		let data = []
		initialData.map(d => {
			keys.map(k => {
				try {
					if (d[k].toLocaleLowerCase().includes(filter.toLocaleLowerCase())) {
						if (!data.includes(d)) data.push(d)
					}
				}
				catch { }
			})
		})
		// added
		if (TransactionType !== 'All' && TransactionType !== '')
			data = data.filter(d => d.type_of_promo === TransactionType)
		if (DateFrom && DateTo)
			data = data.filter(d => (DateFrom <= new Date(d.start_date) && new Date(d.end_date) <= DateTo))

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
					mode={'date'}
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
					mode={'date'}
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
			<TouchableOpacity style={styles.SELECT_ICON} onPress={() => [setSelectOpen(!SelectOpen)]}>
				<Text style={styles.SELECT_LABEL}>{TransactionType || 'All'}</Text>
				<Entypo name={SelectOpen ? "chevron-up" : "chevron-down"} size={23} color={'black'} style={styles.ENTYPO} />
			</TouchableOpacity>
			{transactionTypes.map((t, key) => (
				<TouchableOpacity
				  key={key + 'btype'}
				  style={[styles.SELECT_ICON, transactionStyle]}
				  onPress={() => [setSelectOpen(!SelectOpen), setTransactionType(t), setSearch(Search)]}
				>
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
			// @ts-ignore
			buttonAction={() => [navigation.navigate("linkBank"), setShowBankModal(false)]}
			// @ts-ignore
			onPressHome={() => [navigation.navigate("home"), setShowBankModal(false)]}
		/>

	const couponInfoModal = () =>
		<ConfirmCouponModal
		  visible={showCouponModalInfo}
		  couponSelected={couponSelected}
		  buttonAction={() => setCouponsModalConfig({showCouponModalInfo: false, couponSelected: null})}
		/>

	const dateFormat = (date) => {
		let dateFormated = ''
		if (date && date.split('-')) {
			const t = date.split('-')
			dateFormated = `${t[2]}/${t[1]}/${t[0]}`
		}
		return dateFormated
	}

	return (
		<Screen
			showHeader
			preset="fixed"
			statusBar={'dark-content'}
			unsafe={true}
			style={styles.ROOT}
		>
			<View style={styles.HEADER_ACTIONS}>
				<TouchableOpacity
				  style={styles.HEADER}
				  // @ts-ignore
				  onPress={() => navigation.navigate('home')}>
					<Icon name={"arrow-back"} size={23} color={loginStore.getAccountColor} />
					<Text style={[styles.BACK_BUTON_LABEL, { color: loginStore.getAccountColor }]}>{` Home`}</Text>

				</TouchableOpacity>
			</View>
			<KeyboardAvoidingView enabled style={styles.ROOT}>
				<ScrollView showsVerticalScrollIndicator={false} bounces={false}>
					<View style={styles.ROOT_CONTAINER}>
						<View style={styles.CONTAINER}>
							<View style={styles.STEP_CONTAINER}>
								<View style={styles.TITLE_CONTAINER}>
									<Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>My Coupons</Text>
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
										<Image source={IMAGES.shortIcon} resizeMode='contain' style={styles.COUPON_IMAGE} />
										<Text>Filter</Text>
									</TouchableOpacity>
								</View>
								{ShowFilter && Filters()}
								{getDataFiltered(loginStore.getMerchantCoupons, ['title', 'description', 'discount_input'], Search).map((i, key) => (
									<TouchableOpacity
									  onLongPress={() => [setSelectedReturn(i), setDetailModalVisible(true)]}
									  onPress={() => setCouponsModalConfig({showCouponModalInfo: true, couponSelected: i})}
									  key={key + '_values'}
									  style={styles.RETURN_ITEM}
									>
										<Image
											source={{ uri: i.promo_image }}
											resizeMode='cover'
											style={styles.RETURN_IMAGE}
										/>
										<View style={styles.DATE_INFO_CONTAINER}>
											<Text key={key + '_label'} style={styles.RETURNS_LABEL}>
												{(i.start_date && i.end_date)
													? `${dateFormat(i.start_date)} - ${dateFormat(i.end_date)}`
													: '-'
												}
											</Text>
											<Text style={styles.RETURN_ITEM_CUSTOMER}>{i.title}</Text>
										</View>
									</TouchableOpacity>
								))}

								{showCouponModalInfo && couponInfoModal()}
							</View>
						</View>
					</View>
				</ScrollView>
				{ReturnDetailModal()}
				{bankModal()}
				{ShowIndex &&
					<Button
						buttonStyle={[styles.BUTTON_CREATE, {backgroundColor: loginStore.getAccountColor}]}
						// @ts-ignore
						onPress={() => navigation.navigate("createCoupon")}
						buttonLabel={'Create a coupon'}
						accountType={loginStore.getSelectedAccount}
					/>
				}
			</KeyboardAvoidingView>
		</Screen>
	)
})
