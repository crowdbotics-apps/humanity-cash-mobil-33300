import { observer } from "mobx-react-lite";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Button, Screen, Text } from "../../components";
import { Image, TouchableOpacity, View, Modal, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { COLOR, IMAGES, METRICS } from "../../theme";
import { ButtonIcon } from "../../components/button-icon/button-icon";
import styles from "./home-style";
import { useStores } from "../../models";
import Icon from "react-native-vector-icons/MaterialIcons";
import { CheckBox } from "react-native-elements";
import { runInAction } from "mobx"
import { notifyMessage } from "../../utils/helpers"

const userData = {
	profile: {
		name: 'rafa',
		last_name: 'Clemente',
		mail: 'rafael@mail.com'
	},
	bankInfo: {
		// bankName: 'nombre'
	}
}

const news = [
	{
		tag: 'MERCHANT OF THE MONTH',
		date: 'SEPTEMBER',
		title: 'Dory & Ginger',
		body: 'Our motto is Live and Give. We have treasures for your home and lifestyle, along with the perfect gift for that special someone or that occasion that begs for something unique.',
		image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg'
	},
	{
		tag: 'MERCHANT OF THE MONTH',
		date: 'SEPTEMBER',
		title: 'Dory & Ginger',
		body: 'Our motto is Live and Give. We have treasures for your home and lifestyle, along with the perfect gift for that special someone or that occasion that begs for something unique.',
		image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg'
	}
]

export const HomeScreen = observer(function HomeScreen() {
	const navigation = useNavigation()
	const rootStore = useStores()
	const { loginStore } = rootStore

	const [ShowBankModal, setShowBankModal] = useState(false)
	const [ShowBankStepModal, setShowBankStepModal] = useState(false)
	const [ModalAgree, setModalAgree] = useState(false)

	const getProfileConsumer = () => {
		loginStore.environment.api
			.getProfileConsumer()
			.then((result: any) => {
				if (result.kind === "ok") {
					runInAction(() => {
						loginStore.setConsumerUser(result.data)
						// loginStore.setApiToken(result.response.access_token)
						// navigation.navigate("home", {})
					})
				} else if (result.kind === "bad-data") {
					const key = Object.keys(result?.errors)[0]
					const msg = `${key}: ${result?.errors?.[key][0]}`
					notifyMessage(msg)
				} else if (result.kind === "unauthorized") {
					loginStore.reset()
					navigation.navigate("login", {})
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
						// loginStore.setApiToken(result.response.access_token)
						// navigation.navigate("home", {})
					})
				} else if (result.kind === "bad-data") {
					const key = Object.keys(result?.errors)[0]
					const msg = `${key}: ${result?.errors?.[key][0]}`
					notifyMessage(msg)
				} else if (result.kind === "unauthorized") {
					loginStore.reset()
					navigation.navigate("login", {})
				} else {
					//   loginStore.reset()
					notifyMessage(null)
				}
			})
	}

	useEffect(() => {
		if (!userData.profile.name) navigation.navigate("setupProfile", {})
		// else if (!userData.bankInfo.bankName) setShowBankModal(true)
		// navigation.navigate("return", {})
		getProfileConsumer()
		getProfileMerchant()
	}, [])

	const bankModal = () => (
		<Modal visible={ShowBankModal} transparent>
			<View style={styles.ROOT_MODAL}>
				<TouchableOpacity onPress={() => setShowBankModal(false)} style={styles.CLOSE_MODAL_BUTTON}>
					<Text style={styles.BACK_BUTON_LABEL}>{`Close `}</Text>
					<Icon name={"close"} size={20} color={'#8B9555'} />
				</TouchableOpacity>
				<View style={styles.MODAL_CONTAINER}>
					{ShowBankStepModal
						? <View style={styles.MODAL_CONTENT}>
							<Text style={styles.STEP_TITLE}>Currents uses Dwolla to link your personal bank account.</Text>

							<View style={styles.AGREE_CONTAINER}>
								<CheckBox
									checked={ModalAgree}
									onPress={() => setModalAgree(!ModalAgree)}
									checkedColor={COLOR.PALETTE.green}
								/>
								<Text style={styles.AGREE_LABEL}>{`By checking this box, you agree to the `}
									{/* TODO */}
									<Text style={styles.AGREE_LABEL_LINK} onPress={() => console.log('dwolla')}>
										{"Dwolla Terms of Service "}
									</Text>
									{`and `}
									{/* TODO */}
									<Text style={styles.AGREE_LABEL_LINK} onPress={() => console.log('dwolla')}>
										{"Dwolla Privacy Policy"}
									</Text>
								</Text>
							</View>
							<TouchableOpacity style={styles.MODAL_BUTTON} onPress={() => [setShowBankModal(false), navigation.navigate("linkBank", {})]}>
								<Text style={styles.SUBMIT_BUTTON_LABEL}>Link my bank account</Text>
							</TouchableOpacity>
						</View>
						: <View style={styles.MODAL_CONTENT}>
							<Text style={styles.STEP_TITLE}>Whoooops. You have to link your bank account first</Text>
							<Text style={styles.STEP_SUB_TITLE_MODAL}>Before you can load your wallet you have to first link your bank account. </Text>
							<TouchableOpacity style={styles.MODAL_BUTTON} onPress={() => setShowBankStepModal(true)}>
								<Text style={styles.SUBMIT_BUTTON_LABEL}>Link my bank account</Text>
							</TouchableOpacity>
						</View>
					}

				</View>
				<View />
			</View>
		</Modal>
	)

	const renderNews = () => (
		news.map((n, key) => <View key={key + '_new'} style={styles.NEWS_CONTAINER}>
			<View style={styles.NEWS_HEADER_CONTAINER}>
				<Text style={styles.NEWS_TAG}>{n.tag}</Text>
				<Text style={styles.NEWS_TAG}>{n.date}</Text>
			</View>
			<Text style={styles.NEWS_TITLE}>{n.title}</Text>
			<Text style={styles.NEWS_BODY}>{n.body}</Text>
			<Image
				source={{ uri: n.image }}
				resizeMode="contain"
				style={styles.NEWS_IMAGE}
			/>
		</View>
		)
	)

	const ConsumerView = () => (
		<ScrollView key="consumer_view" showsVerticalScrollIndicator={false} bounces={false}>
			<View style={styles.ROOT_CONTAINER}>
				<View style={styles.STEP_CONTAINER}>
					<TouchableOpacity style={styles.HEADER} onPress={() => navigation.toggleDrawer()}>
						<Icon name={"menu"} size={23} color={loginStore.getAccountColor} />
						<Text style={[styles.BACK_BUTON_LABEL, { color: loginStore.getAccountColor }]}>{` Home`}</Text>

					</TouchableOpacity>
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
						{/* <TouchableOpacity style={styles.LOAD_WALLET_CONTAINER} onPress={() => navigation.navigate("loadWallet", {})}> */}
						{/* <TouchableOpacity style={styles.LOAD_WALLET_CONTAINER} onPress={() => setShowBankModal(true)} >
							<Text style={styles.LOAD_WALLET_LABEL}>Load Wallet</Text>
						</TouchableOpacity> */}
					</View>
					<View style={styles.LINE} />
					{renderNews()}
					<View style={{ height: 200 }} />
				</View>
			</View>
			{bankModal()}

		</ScrollView>
	)

	const CashierView = () => (
		<View style={styles.ROOT_CONTAINER}>
			<View style={styles.STEP_CONTAINER}>
				<TouchableOpacity style={styles.HEADER} onPress={() => navigation.toggleDrawer()}>
					<Icon name={"menu"} size={23} color={loginStore.getAccountColor} />
					<Text style={[styles.BACK_BUTON_LABEL, { color: loginStore.getAccountColor }]}>{` Home`}</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.CASHIER_BUTTON_BIG} onPress={() => navigation.navigate("qr", {})}>
					<Image
						resizeMode="contain"
						source={IMAGES.currentDollarIconCashier}
						style={styles.CASHIER_BUTTON_ICON_BIG}
					/>
					<Text style={styles.CASHIER_BUTTON_LABEL}>Receive payment</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.CASHIER_BUTTON_SMALL} onPress={() => navigation.navigate("cashierTransaction", {})}>
					<Image
						resizeMode="contain"
						source={IMAGES.transactions_cashier}
						style={styles.CASHIER_BUTTON_ICON}
					/>
					<Text style={styles.CASHIER_BUTTON_LABEL}>Transactions</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.CASHIER_BUTTON_SMALL} onPress={() => navigation.navigate("qr", {})}>
					<Image
						resizeMode="contain"
						source={IMAGES.return_cashier}
						style={styles.CASHIER_BUTTON_ICON}
					/>
					<Text style={styles.CASHIER_BUTTON_LABEL}>Make a return</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.CASHIER_BUTTON_SMALL} onPress={() => navigation.navigate("makeReport", {})}>
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
				<TouchableOpacity onPress={() => navigation.navigate("helpContact", {})} style={styles.NEED_HELP_CONTAINER}>
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
								// bottom: 125,
								// position: 'absolute'
							}}
							buttonLabelPre={<Icon key={'button_adornment'} name={"qr-code-2"} size={30} color={'white'} style={{ marginRight: 30 }} />}
							onPress={() => navigation.navigate("return", {})}
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
