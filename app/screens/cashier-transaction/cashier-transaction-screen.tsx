import { observer } from "mobx-react-lite";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Button, Screen, Text, TextInputComponent } from "../../components";
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
	const [Search, setSearch] = useState('')
	const [ShowFilter, setShowFilter] = useState(false)
	const [DistanceFilter, setDistanceFilter] = useState('')

	const Filters = () => <View style={styles.FILTER_CONTAINER}>

		<Text onPress={() => setDistanceFilter('')} style={styles.CLEAR_FILTERS}>Clear filters</Text>
		<View style={styles.LINE} />
	</View>

	const ReturnIndex = () =>
		<View style={styles.CONTAINER}>
			<View style={styles.HEADER_ACTIONS}>
				<View />
				<TouchableOpacity style={styles.BACK_BUTON_CONTAINER} onPress={() => navigation.navigate("home", {})}>
					<Text style={[styles.BACK_BUTON_LABEL, { color: loginStore.getAccountColor }]}>{`Close `}</Text>
					<Icon name={"close"} size={23} color={loginStore.getAccountColor} />
				</TouchableOpacity>
			</View>
			<View style={styles.STEP_CONTAINER}>
				<Text style={styles.STEP_TITLE}>Transactions</Text>
			</View>
			<Text style={[styles.AMOUNT_LABEL, { color: loginStore.getAccountColor }]}>BALANCE</Text>
			<Text style={[styles.AMOUNT, { color: loginStore.getAccountColor }]}>C$ 0</Text>

			<View style={styles.INPUT_STYLE_CONTAINER}>
				<View style={styles.SEARCH_INPUT_STYLE_CONTAINER}>
					<Icon name={"search"} size={25} color={COLOR.PALETTE.black} style={{ marginLeft: 20}} />
					<TextInput
						style={styles.INPUT_STYLE}
						onChangeText={t => setSearch(t)}
						value={Search}
						placeholder={`Search`}
					/>
				</View>
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
		</View>

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

							{ReturnIndex()}
							{/* {ShowIndex && ReturnIndex()}
							{SendingReturn && SendReturn()}
							{Loading && LoadingReturn()}
							{Finish && FinishReturn()} */}
						</View>
					</View>
				</ScrollView>
				{/* {ShowIndex &&
					<Button
						buttonStyle={{
							backgroundColor: loginStore.getAccountColor,
							// bottom: 125,
							// position: 'absolute'
						}}
						buttonLabelPre={<Icon key={'button_adornment'} name={"qr-code-2"} size={30} color={'white'} style={{ marginRight: 30 }} />}
						onPress={() => [setShowIndex(false), setShowScanModal(true)]}
						buttonLabel={'Receive or Scan to pay'}
						showBottonMenu
						hideButton
					/>
				} */}
			</KeyboardAvoidingView>
		</Screen>
	)
})
