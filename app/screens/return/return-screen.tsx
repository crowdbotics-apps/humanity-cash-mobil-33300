import { observer } from "mobx-react-lite";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Button, Screen, Text, TextInputComponent, ConnectBankModal } from "../../components";
import { ActivityIndicator, TextInput, TouchableOpacity, View, Modal, Platform, KeyboardAvoidingView, ScrollView, Image } from "react-native";
import { COLOR, IMAGES, METRICS } from "../../theme";
import styles from './return-style';
import Icon from "react-native-vector-icons/MaterialIcons"
import { useStores } from "../../models";
import { CheckBox } from 'react-native-elements'

export const ReturnScreen = observer(function ReturnScreen() {
	const navigation = useNavigation()
	const rootStore = useStores()
	const { loginStore } = rootStore
	const isFocused = useIsFocused();
	const returns = {
		TODAY: [
			{
				item: 'Customer sale',
				time: '7 min ago',
				credit: '10.00'
			},
			{
				item: 'Carr Hardware',
				time: '3:51, Jun 17, 2021',
				debit: '10.00'
			},
			{
				item: 'Cash out',
				time: '4:51, Jun 17, 2021',
				debit: '10.00'
			},
		],
		YESTERDAY: [
			{
				item: 'Customer return',
				time: '3:51, Jun 16, 2021',
				debit: '10.00'
			},
		]
	}

	const [ShowIndex, setShowIndex] = useState(true)
	const [ShowScanModal, setShowScanModal] = useState(false)
	const [ReturnInfo, setReturnInfo] = useState({})
	const [SendingReturn, setSendingReturn] = useState(false)
	const [AmountError, setAmountError] = useState(false)
	const [Amount, setAmount] = useState('')
	const [ModalAgree, setModalAgree] = useState(false)
	const [Loading, setLoading] = useState(false)
	const [Finish, setFinish] = useState(false)
	const [Search, setSearch] = useState('')
	const [ShowFilter, setShowFilter] = useState(false)
	const [DistanceFilter, setDistanceFilter] = useState('')

	const [ShowBankModal, setShowBankModal] = useState(false)

	const Filters = () => <View style={styles.FILTER_CONTAINER}>

		<Text onPress={() => setDistanceFilter('')} style={styles.CLEAR_FILTERS}>Clear filters</Text>
		<View style={styles.LINE} />
	</View>

	const ReturnIndex = () => <View style={styles.CONTAINER}>
		<TouchableOpacity style={styles.HEADER} onPress={() => navigation.toggleDrawer()}>
			<Icon name={"menu"} size={23} color={loginStore.getAccountColor} />
			<Text style={[styles.BACK_BUTON_LABEL, { color: loginStore.getAccountColor }]}>{` Menu`}</Text>
		</TouchableOpacity>
		<ScrollView showsVerticalScrollIndicator={false} bounces={false}>
			<Image
				resizeMode="contain"
				source={IMAGES.logoFull}
				style={styles.LOGO_STYLE}
			/>
			<Text style={[styles.AMOUNT, { color: loginStore.getAccountColor }]}>C$ 0</Text>
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
				</TouchableOpacity>
			</View>
			{ShowFilter && Filters()}
			{Object.keys(returns).map((r, key) => ([
				<Text key={key + '_label'} style={styles.RETURNS_LABEL}>TODAY</Text>,
				returns[r].map((i, key2) => (
					<View key={key2 + '_values'} style={styles.RETURN_ITEM}>
						<View style={{ marginLeft: 15 }}>
							<Text style={styles.RETURN_ITEM_CUSTOMER}>{i.item}</Text>
							<Text style={styles.RETURN_ITEM_TIME}>{i.time}</Text>
						</View>
						<View style={styles.CONTAINER}>
							{i.credit
								? <Text style={styles.RETURN_ITEM_AMOUNT_CREDIT}>{`+ C$ ${i.credit}`}</Text>
								: <Text style={styles.RETURN_ITEM_AMOUNT}>{`+ C$ ${i.debit}`}</Text>
							}

						</View>
					</View>
				))
			]))}
			<View style={{ height: 100 }} />
		</ScrollView>
	</View>

	useEffect(() => {
		if (isFocused) {
			setShowScanModal(true)
			if (!loginStore.getBillingData.billing_data_added) setShowBankModal(true)
			else setShowBankModal(false)
		}
	}, [isFocused])

	const bankModal = () =>
		<ConnectBankModal
			visible={ShowBankModal}
			buttonStyle={{ backgroundColor: loginStore.getAccountColor }}
			buttonAction={() => {navigation.navigate("linkBank"); setShowBankModal(false)}}
			onPressHome={() => [navigation.navigate("home"), setShowBankModal(false)]}
		/>

	const ScanModal = () => (
		<Modal visible={ShowScanModal}>
			<View style={[styles.ROOT_MODAL, { backgroundColor: loginStore.getSelectedAccount === 'merchant' ? 'rgba(157, 165, 111, 0.50)' : 'rgba(59, 136, 182, 0.50)' }]}>
				<TouchableOpacity onPress={() => [setShowScanModal(false), setShowIndex(true)]} style={styles.CLOSE_MODAL_BUTTON}>
					<Text style={[styles.BACK_BUTON_LABEL, { color: loginStore.getAccountColor }]}>{`Close `}</Text>
					<Icon name={"close"} size={20} color={loginStore.getAccountColor} />
				</TouchableOpacity>
				<View style={styles.MODAL_CONTAINER}>
					<View style={styles.MODAL_CONTENT}>
						<Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>Scan the customer’s return receipt QR code.</Text>
						<Text style={styles.STEP_SUB_TITLE_MODAL}>The customer needs to provide the transaction receipt, and select “Make a Return” in order to generate a QR Code. Scan this QR code in order to the refund Currents to the customer. </Text>
						<TouchableOpacity
							style={[styles.MODAL_BUTTON, { backgroundColor: loginStore.getAccountColor }]}
							onPress={() => [
								setShowScanModal(false),
								setReturnInfo({
									amount: 14.34,
									transaction_id: '0567882hdjh2je20',
									type: 'customer sale',
									date: '4:22 , JUN 17, 2021'
								}),
								setSendingReturn(true)
							]}
						>
							<Text style={styles.SUBMIT_BUTTON_LABEL}>Scan</Text>
						</TouchableOpacity>
					</View>
				</View>
				<View />
			</View>
		</Modal>
	)

	const FinishReturn = () => <View style={{ height: METRICS.screenHeight }}>
		<View style={styles.HEADER_ACTIONS}>
			<View />
			<TouchableOpacity style={styles.BACK_BUTON_CONTAINER} onPress={() => [setShowIndex(true), setFinish(false)]}>
				<Text style={[styles.BACK_BUTON_LABEL, { color: loginStore.getAccountColor }]}>{`Close `}</Text>
				<Icon name={"close"} size={23} color={loginStore.getAccountColor} />
			</TouchableOpacity>
		</View>
		<Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>{`Succeeded! 
Thank you
	`}</Text>
		<Button
			buttonStyle={{
				position: 'absolute',
				marginTop: METRICS.screenHeight - 100,
				backgroundColor: loginStore.getAccountColor
			}}
			onPress={() => [setShowIndex(true), setFinish(false)]}
			buttonLabel={'Close'}
		/>
	</View>

	const LoadingReturn = () => <View style={styles.LOADING_RETURN}>
		<Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>Pending...</Text>
		<Text style={styles.SUB_TITLE}>This usually takes 5-6 seconds</Text>
		<ActivityIndicator style={styles.ACTIVITY} size="large" color={'black'} />
	</View>
	const SendReturn = () => <View style={styles.CONTAINER}>
		<Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>Send return</Text>
		<View style={styles.LINE} />
		<Text style={styles.SUB_TITLE}>TRANSACTION DETAILS</Text>
		<View style={styles.RETURN_CONTAINER}>
			<Text style={[styles.RETURN_AMOUNT, { color: loginStore.getAccountColor }]}>C$ 14.34</Text>
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
		<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
			<Text style={styles.INPUT_LABEL_STYLE}>RETURN AMOUNT</Text>
			<Text style={styles.INPUT_LABEL_ERROR}>{AmountError ? 'MAX. TOTAL TRANSACTION AMOUNT' : ''}</Text>
		</View>
		<View style={AmountError ? styles.INPUT_STYLE_CONTAINER_ERROR : styles.INPUT_STYLE_CONTAINER}>
			<TextInput
				placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
				style={styles.INPUT_STYLE}
				keyboardType='numeric'
				onChangeText={t => {
					if (t) t = t.split(' ')[1]
					else t = ''
					setAmount(t)
					if (parseFloat(t) >= 14.34) setAmountError(true)
					else setAmountError(false)
				}}
				value={(Amount && Amount.split(' ')[0] == `C$ `) ? Amount : `C$ ` + Amount}
				placeholder={`Amount`}
			/>
		</View>
		<Button
			buttonStyle={{ marginTop: 20, backgroundColor: (AmountError || Loading) ? `${loginStore.getAccountColor}40` : loginStore.getAccountColor }}
			onPress={() => {
				setLoading(true)
				setSendingReturn(false)
				setTimeout(function () {
					setLoading(false)
					setFinish(true)
				}, 5000)
			}}
			buttonLabel={'Next'}
			disabled={AmountError || Loading}
			loading={Loading}
		/>
	</View>

	return (
		<Screen
			showHeader
			preset="fixed"
			statusBar={'dark-content'}
			unsafe={true}
		>
			{(!ShowScanModal && !Loading && !Finish && !ShowIndex) &&
				<View style={styles.HEADER_ACTIONS}>
					<TouchableOpacity
						onPress={() => [setShowIndex(true)]}
						style={styles.BACK_BUTON_CONTAINER}
					>
						<Icon name={"arrow-back"} size={23} color={loginStore.getAccountColor} />
						<Text style={[styles.BACK_BUTON_LABEL, { color: loginStore.getAccountColor }]}>{` Back`}</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.BACK_BUTON_CONTAINER}>
						<Text style={[styles.BACK_BUTON_LABEL, { color: loginStore.getAccountColor }]}>{`Close `}</Text>
						<Icon name={"close"} size={23} color={loginStore.getAccountColor} />
					</TouchableOpacity>
				</View>
			}
				<View style={styles.ROOT_CONTAINER}>
					<View style={styles.CONTAINER}>
						{ShowIndex && ReturnIndex()}
						{SendingReturn && SendReturn()}
						{Loading && LoadingReturn()}
						{Finish && FinishReturn()}
					</View>
				</View>
				{ScanModal()}
				{bankModal()}
				{ShowIndex &&
					<Button
						buttonStyle={{ backgroundColor: loginStore.getAccountColor }}
						buttonLabelPre={<Icon key={'button_adornment'} name={"qr-code-2"} size={30} color={'white'} style={{ marginRight: 30 }} />}
						onPress={() => [setShowIndex(false), setShowScanModal(true)]}
						buttonLabel={'Receive or Scan to pay'}
						showBottonMenu
						hideButton
					/>
				}
		</Screen>
	)
})
