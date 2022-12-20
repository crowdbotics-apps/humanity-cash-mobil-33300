import { observer } from "mobx-react-lite";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Button, Screen, Text, ConfirmCouponModal } from "../../components";
import { Image, TouchableOpacity, View, KeyboardAvoidingView, ScrollView, Modal, TouchableWithoutFeedback,  BackHandler } from "react-native";
import { COLOR, IMAGES } from "../../theme";
import styles from "./home-style";
import { useStores } from "../../models";
import Icon from "react-native-vector-icons/MaterialIcons";
import { runInAction } from "mobx"
import { notifyMessage } from "../../utils/helpers";
import { profileTypes } from '../drawer/drawer-screen'

export const HomeScreen = observer(function HomeScreen() {
	const [ShowConfirmLogoutModal, setShowConfirmLogoutModal] = useState(false);
	const [couponsConfig, setCouponsConfig] = useState({
		coupons: [],
		couponSelected: {},
		ShowConfirmCoupon: false
	});
	const {coupons, couponSelected, ShowConfirmCoupon} = couponsConfig;

	const rootStore = useStores();
	const { loginStore } = rootStore;

	const navigation = useNavigation();
	const isFocused = useIsFocused();

	const getProfileConsumer = () => {
		loginStore.environment.api
			.getProfileConsumer()
			.then((result: any) => {
				if (result.kind === "ok") {
					runInAction(() => {
						loginStore.setConsumerUser(result.data)
					})
					if (
						(loginStore.ProfileData.first_name === '' || loginStore.ProfileData.first_name === null)
						&& (loginStore.getAllData.business_name === '' || loginStore.getAllData.business_name === null)
					) navigation.navigate("setupProfile")
				} else if (result.kind === "bad-data") {
					const key = Object.keys(result?.errors)[0]
					const msg = `${key}: ${result?.errors?.[key][0]}`
					notifyMessage(msg)
				} else if (result.kind === "unauthorized") {
					loginStore.reset()
					navigation.navigate("login")
				}
			})
	}
	const getProfileMerchant = () => {
		loginStore.environment.api
			.getProfileMerchant()
			.then((result: any) => {
				getProfileConsumer()
				if (result.kind === "ok") {
					console.log(' getProfileMerchant ===>>> ', JSON.stringify(result, null, 2))
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
	const getAllCoupons = () =>
		loginStore.environment.api.getCoupons()
			.then((result) => {
				if (result.kind === 'ok') {
					setCouponsConfig({ ...couponsConfig, coupons: result.data.results })
				}
			})
			.catch(error => console.log('GET ALL COUPONS ERROR ', error.message))

	const getFundingSources = () => {
		loginStore.environment.api
			.getFundingSources({ "user_type": loginStore.getSelectedAccount })
			.then((result: any) => {
				if (result.kind === "ok") {
					runInAction(() => {
						loginStore.setFundingSources(result.data)
					})
				}
			})
	}
	const openModal = (c: any) => setCouponsConfig({
		...couponsConfig, 
		ShowConfirmCoupon: !ShowConfirmCoupon,
		couponSelected: c
	});

	useEffect(() => {
		if (isFocused) {
			getEvents()
			getBalanceData()
			getConsumerCoupons()
			getProfileMerchant()
			getFundingSources()
			getAllCoupons();
		}
	}, [isFocused, ShowConfirmCoupon])

	useEffect(() => {
		const backAction = () => true
		const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
		return () => backHandler.remove();
	}, []);

	function DateFormat(date: string) {
		const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
		return monthNames[new Date(date).getMonth()]
	}

	const confirmLogoutModal = () => (
		<Modal visible={ShowConfirmLogoutModal} transparent>
			<TouchableWithoutFeedback onPress={() => setShowConfirmLogoutModal(false)}>
				<View style={styles.ROOT_MODAL}>
					<View style={styles.MODAL_CONTENT}>
						<Text style={styles.STEP_TITLE_BLACK}>Are you sure you want to log out?</Text>
						<Text style={styles.STEP_SUB_TITLE_MODAL}>Please note that unsaved data will be lost.</Text>
						<TouchableOpacity
							style={[styles.MODAL_BUTTON, { backgroundColor: loginStore.getAccountColor }]}
							onPress={() => [
								loginStore.setSelectedAccount('consumer'),
								setShowConfirmLogoutModal(false)
							]}>
							<Text style={styles.SUBMIT_BUTTON_LABEL}>Log out</Text>
						</TouchableOpacity>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	)

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
			<TouchableOpacity style={[styles.HEADER, { marginLeft: 10 }]} onPress={() => navigation.toggleDrawer()}>
				<Icon name={"menu"} size={23} color={loginStore.getAccountColor} />
				<Text style={[styles.BACK_BUTON_LABEL, { color: loginStore.getAccountColor }]}>{` Menu`}</Text>
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

					{(!loginStore.getAllData.first_name && loginStore.getSelectedAccount === 'merchant') &&
						<TouchableOpacity
							style={[styles.WARNING_CONTAINER, {marginBottom: 10}]}
							onPress={() => navigation.navigate('signupProfile', { profile_type: profileTypes[0] })}
						>
							<View style={styles.ICON_WARNING_CONTAINER}>
								<Text style={styles.ICON_WARNING}>!</Text>
							</View>
							<Text style={styles.TEXT_WARNING}>
								Create a personal profile so you can easily switch accounts.{' '}
								<Text style={styles.TEXT_WARNING_LINK}>
									Go to set up
								</Text>
							</Text>
						</TouchableOpacity>
					}
					{(!loginStore.getBillingData.billing_data_added) &&
						<TouchableOpacity
							style={styles.WARNING_CONTAINER}
							onPress={() => navigation.navigate('linkBank')}
						>
							<View style={styles.ICON_WARNING_CONTAINER}>
								<Text style={styles.ICON_WARNING}>!</Text>
							</View>
							<Text style={styles.TEXT_WARNING}>
								Load up your wallet to start spending Currents.{' '}
								<Text style={styles.TEXT_WARNING_LINK}>Load up Currents.</Text>
							</Text>
						</TouchableOpacity>
					}
					<Text style={[styles.INDUSTRY_TITLE, { marginTop: 15 }]}>MY SAVED COUPONS</Text>

					<ScrollView showsHorizontalScrollIndicator={false} horizontal style={{ marginHorizontal: 10 }}>
						{coupons.map((c, key) => (
							<TouchableOpacity
								key={key + '_coupon'}
								style={styles.COUPON_CONTAINER}
								onPress={() => openModal(c)}
							>
								<Image
									source={{ uri: c.promo_image }}
									resizeMode='cover'
									style={styles.RETURN_IMAGE}
								/>
								{loginStore.getConsumerCoupons.find(coupon => coupon.id_cupon === c.id)
									&& <Icon style={styles.FAVORITE_ICON} name={"star"} size={25} color={COLOR.PALETTE.mustard} />
								}
								<Text style={styles.COUPON_TITLE}>
									{c.title}
								</Text>
							</TouchableOpacity>
						))}
					</ScrollView>

					{renderNews()}

					{ ShowConfirmCoupon &&

						<ConfirmCouponModal 
							couponsConfig={couponsConfig}
							setCouponsConfig={setCouponsConfig}
							visible={ShowConfirmCoupon} 
							buttonAction={() => setCouponsConfig({...couponsConfig, ShowConfirmCoupon: !ShowConfirmCoupon})} 
							couponSelected={couponSelected}
							//@ts-ignore
							mode={!loginStore.getConsumerCoupons.some(c => c.id_cupon === couponSelected.id) ? 'ADD' : 'DELETE'}
							goBack={async () => {

								await getAllCoupons()
								//@ts-ignore
								navigation.navigate('home')
								setCouponsConfig({...couponsConfig, ShowConfirmCoupon: !ShowConfirmCoupon})
							}}
						/>
					}

					<View style={{ height: 20 }} />
				</View>
			</ScrollView>

		</View>
	)

	const CashierView = () => (
		<View style={styles.ROOT_CONTAINER}>
			<View style={styles.STEP_CONTAINER}>
				<TouchableOpacity style={[styles.HEADER, { justifyContent: 'flex-end' }]} onPress={() => setShowConfirmLogoutModal(true)}>
					<Text style={[styles.BACK_BUTON_LABEL, { color: loginStore.getAccountColor }]}>{`Log out`}</Text>
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
				style={styles.ROOT}
			>
				{confirmLogoutModal()}
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


