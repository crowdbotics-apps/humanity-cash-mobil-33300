import { observer } from "mobx-react-lite";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Button, Screen, Text } from "../../components";
import { Image, TouchableOpacity, View, KeyboardAvoidingView, ScrollView, BackHandler } from "react-native";
import { IMAGES } from "../../theme";
import styles from "./home-style";
import { useStores } from "../../models";
import Icon from "react-native-vector-icons/MaterialIcons";
import { runInAction } from "mobx"
import { notifyMessage } from "../../utils/helpers"

export const HomeScreen = observer(function HomeScreen() {
	const navigation = useNavigation()
	const rootStore = useStores()
	const { loginStore } = rootStore

	const isFocused = useIsFocused();
	const [Events, setEvents] = useState([])

	const getProfileConsumer = () => {
		loginStore.environment.api
			.getProfileConsumer()
			.then((result: any) => {
				if (result.kind === "ok") {
					runInAction(() => {
						loginStore.setConsumerUser(result.data)
					})
					if (loginStore.ProfileData.first_name === '' || loginStore.ProfileData.first_name === null) navigation.navigate("setupProfile")
				} else if (result.kind === "bad-data") {
					const key = Object.keys(result?.errors)[0]
					const msg = `${key}: ${result?.errors?.[key][0]}`
					notifyMessage(msg)
				} else if (result.kind === "unauthorized") {
					loginStore.reset()
					navigation.navigate("login")
				} else {
					//   loginStore.reset()
					notifyMessage(null)
				}
			})
	}
	const getProfileMerchant = () => {
		loginStore.environment.api
			.getProfileMerchant()
			.then((result: any) => {
				if (result.kind === "ok") {
					runInAction(() => {
						loginStore.setMerchantUser(result.data)
					})
				} else if (result.kind === "bad-data") {
					const key = Object.keys(result?.errors)[0]
					const msg = `${key}: ${result?.errors?.[key][0]}`
					notifyMessage(msg)
				} else if (result.kind === "unauthorized") {
					loginStore.reset()
					navigation.navigate("login")
				} else {
					notifyMessage(null)
				}
			})
	}
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

	const getEvents = () => {
		loginStore.environment.api
			.getEvents()
			.then((result: any) => {
				if (result.kind === "ok") {
					runInAction(() => {
						loginStore.setEvents(result.data?.results)
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

	const getConsumerCoupons = () => {
		loginStore.environment.api
			.getConsumerCoupons()
			.then((result: any) => {
				if (result.kind === "ok") {
					runInAction(() => {
						loginStore.setConsumerCoupons(result.data?.results)
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

	const getFundingSources = () => {
		loginStore.environment.api
			.getFundingSources({ "user_type": loginStore.getSelectedAccount })
			.then((result: any) => {
				if (result.kind === "ok") {
					runInAction(() => {
						loginStore.setFundingSources(result.data)
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

	useEffect(() => {
		if (isFocused) {
			getEvents()
			getBalanceData()
			getConsumerCoupons()
			getProfileConsumer()
			getProfileMerchant()
			getFundingSources()
		}
	}, [isFocused])

	useEffect(() => {
		const backAction = () => true
		const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
		return () => backHandler.remove();
	}, []);

	function DateFormat(date: string) {
		const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
		return monthNames[new Date(date).getMonth()]
	}

	const renderNews = () => (
		loginStore.getEvents.map((n, key) => <View key={key + '_new'} style={styles.NEWS_CONTAINER}>
			<View style={styles.NEWS_HEADER_CONTAINER}>
				<Text style={styles.NEWS_TAG}>{n.tag}</Text>
				<Text style={styles.NEWS_TAG}>{DateFormat(n.start_date)}</Text>
			</View>
			<Text style={styles.NEWS_TITLE}>{n.title}</Text>
			<Text style={styles.NEWS_BODY}>{n.description}</Text>
			<Image
				source={{ uri: n.image }}
				resizeMode="contain"
				style={styles.NEWS_IMAGE}
			/>
		</View>
		)
	)

	const ConsumerView = () => (
		<View style={styles.ROOT_CONTAINER}>
			<TouchableOpacity style={styles.HEADER} onPress={() => navigation.toggleDrawer()}>
				<Icon name={"menu"} size={23} color={loginStore.getAccountColor} />
				<Text style={[styles.BACK_BUTON_LABEL, { color: loginStore.getAccountColor }]}>{` Home`}</Text>

			</TouchableOpacity>

			<ScrollView key="consumer_view" showsVerticalScrollIndicator={false} bounces={false}>
				<View style={styles.STEP_CONTAINER}>
					<Image
						resizeMode="contain"
						source={IMAGES.logoFull}
						style={styles.LOGO_STYLE}
					/>
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
					<Text style={styles.INDUSTRY_TITLE}>MY SAVED COUPONS</Text>
					<ScrollView showsHorizontalScrollIndicator={false} horizontal style={{ marginHorizontal: 10 }}>
						{loginStore.getConsumerCoupons.map((c, key) => (
							<View key={key} style={styles.COUPON_CONTAINER}>
								<Image
									// source={{ uri: c.promo_image }}
									source={{ uri: 'http://192.168.183.155:8000/mediafiles/coupons-pictures/rn_image_picker_lib_temp_a15bad5a-147f-43aa-89ef-cab52793e680_89hmvqs.jpg' }}
									
									resizeMode='cover'
									style={styles.RETURN_IMAGE}
								/>
								<Text style={styles.COUPON_TITLE} >{c.title}</Text>
							</View>
						))}
					</ScrollView>
					{renderNews()}
					<View style={{ height: 20 }} />
				</View>
			</ScrollView>
		</View>
	)

	const CashierView = () => (
		<View style={styles.ROOT_CONTAINER}>
			<View style={styles.STEP_CONTAINER}>
				<TouchableOpacity style={styles.HEADER} onPress={() => navigation.toggleDrawer()}>
					<Icon name={"menu"} size={23} color={loginStore.getAccountColor} />
					<Text style={[styles.BACK_BUTON_LABEL, { color: loginStore.getAccountColor }]}>{` Home`}</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.CASHIER_BUTTON_BIG} onPress={() => navigation.navigate("qr")}>
					<Image
						resizeMode="contain"
						source={IMAGES.currentDollarIconCashier}
						style={styles.CASHIER_BUTTON_ICON_BIG}
					/>
					<Text style={styles.CASHIER_BUTTON_LABEL}>Receive payment</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.CASHIER_BUTTON_SMALL} onPress={() => navigation.navigate("cashierTransaction")}>
					<Image
						resizeMode="contain"
						source={IMAGES.transactions_cashier}
						style={styles.CASHIER_BUTTON_ICON}
					/>
					<Text style={styles.CASHIER_BUTTON_LABEL}>Transactions</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.CASHIER_BUTTON_SMALL} onPress={() => navigation.navigate("qr")}>
					<Image
						resizeMode="contain"
						source={IMAGES.return_cashier}
						style={styles.CASHIER_BUTTON_ICON}
					/>
					<Text style={styles.CASHIER_BUTTON_LABEL}>Make a return</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.CASHIER_BUTTON_SMALL} onPress={() => navigation.navigate("makeReport")}>
					<Image
						resizeMode="contain"
						source={IMAGES.report_cashier}
						style={styles.CASHIER_BUTTON_ICON}
					/>
					<Text style={styles.CASHIER_BUTTON_LABEL}>Make a report</Text>
				</TouchableOpacity>

				<View style={{ height: 200 }} />
			</View>
			<View style={styles.STEP_CONTAINER}>
				<TouchableOpacity onPress={() => navigation.navigate("helpContact")} style={styles.NEED_HELP_CONTAINER}>
					<Text style={styles.NEED_HELP_LINK}>Need help?</Text>
				</TouchableOpacity>
			</View>
		</View>
	)

	return (
		<Screen
			preset="fixed"
			statusBar={'dark-content'}
			unsafe={true}
			showHeader
		>
			<KeyboardAvoidingView
				enabled
				// behavior={Platform.OS === 'ios' ? 'padding' : null}
				style={styles.ROOT}
			>
				{loginStore.getSelectedAccount === 'cashier'
					? CashierView()
					: [
						ConsumerView(),
						<Button
							key="button_botton"
							buttonStyle={{
								backgroundColor: loginStore.getAccountColor,
							}}
							buttonLabelPre={<Icon key={'button_adornment'} name={"qr-code-2"} size={30} color={'white'} style={{ marginRight: 30 }} />}
							onPress={() => navigation.navigate("return")}
							buttonLabel={'Scan to Pay or Receive'}
							showBottonMenu
							hideButton
							accountType={loginStore.getSelectedAccount}
						/>
					]
				}
			</KeyboardAvoidingView>
		</Screen>
	)
})
