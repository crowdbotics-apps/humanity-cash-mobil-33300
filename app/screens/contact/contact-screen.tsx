import { observer } from "mobx-react-lite";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Button, Screen, Text, TextInputComponent } from "../../components";
import { ActivityIndicator, TextInput, TouchableOpacity, View, Modal, Platform, KeyboardAvoidingView, ScrollView, Image } from "react-native";
import { COLOR, IMAGES, METRICS } from "../../theme";
import styles from './contact-style';
import Icon from "react-native-vector-icons/MaterialIcons"
import { useStores } from "../../models";
import { Tab, TabView } from 'react-native-elements'
import DatePicker from 'react-native-date-picker'
import Entypo from "react-native-vector-icons/Entypo"

export const ContactScreen = observer(function ContactScreen() {
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
	const [TabIndex, setTabIndex] = React.useState(0);

	const ContactList = () => Object.keys(returns).map((r, key) => ([
		returns[r].map((i, key2) => (
			<TouchableOpacity onPress={() => [setSelectedReturn(i), setDetailModalVisible(true)]} key={key2 + '_values'} style={styles.RETURN_ITEM}>
				<Image
					source={{ uri: i.image }}
					resizeMode='cover'
					style={styles.RETURN_IMAGE}
				/>
				<Text style={styles.RETURN_ITEM_CUSTOMER}>{'Name'}</Text>
				{/* <Text style={styles.RETURN_ITEM_TIME}>{i.time}</Text> */}


			</TouchableOpacity>
		))
	]))

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

								<Text style={[styles.STEP_TITLE, {color: loginStore.getAccountColor}]}>Address Book</Text>

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
								</View>

								<View style={{ width: METRICS.screenWidth * 0.95, alignSelf: 'center', marginTop: 10 }}>
									<Tab
										value={TabIndex}
										onChange={(e) => setTabIndex(e)}
										indicatorStyle={{ backgroundColor: loginStore.getAccountColor, height: 4 }}
										variant="default"
									>
										<Tab.Item
											buttonStyle={{ backgroundColor: 'white' }}
											title="PEOPLE"
											titleStyle={{ fontSize: 12, color: loginStore.getAccountColor }}
										/>
										<Tab.Item
											buttonStyle={{ backgroundColor: 'white' }}
											title="BUSINESS"
											titleStyle={{ fontSize: 12, color: loginStore.getAccountColor }}
										/>
									</Tab>
									<View style={styles.BLUE_LINE} />
									<TabView value={TabIndex} onChange={setTabIndex} animationType="spring">
										<TabView.Item style={{ height: 500, width: '100%' }}>
											<View>{ContactList()}
											</View>
										</TabView.Item>
										<TabView.Item style={{ height: 500, width: '100%' }}>
											<View>{ContactList()}
											</View>
										</TabView.Item>
									</TabView>
								</View>
								{/* {ContactList()} */}


								<View style={{ height: 100 }} />
							</View>
						</View>
					</View>
				</ScrollView>
				{ReturnDetailModal()}
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