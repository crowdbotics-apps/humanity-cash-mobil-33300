import { observer } from "mobx-react-lite";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Button, Screen, Text } from "../../components";
import { Image, TouchableOpacity, View, Modal, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { COLOR, IMAGES, METRICS } from "../../theme";
import { ButtonIcon } from "../../components/button-icon/button-icon";
import styles from "./home-style";
import {useStores} from "../../models";
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
		bankName: 'nombre'
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
	const {loginStore} = rootStore

	const [ShowBankModal, setShowBankModal] = useState(false)
	const [ShowBankStepModal, setShowBankStepModal] = useState(false)
	const [ModalAgree, setModalAgree] = useState(false)

	const getProfileConsumer = () => {
		loginStore.environment.api
			.getProfileConsumer()
			.then(result => {
				if (result.kind === "ok") {
					runInAction(() => {
						console.log(' result ===>>> ', JSON.stringify(result.data, null, 2))
						loginStore.setConsumerUser(result.data)
						// loginStore.setApiToken(result.response.access_token)
						// navigation.navigate("home", {})
					})
				} else if (result.kind === "bad-data") {
					const key = Object.keys(result?.errors)[0]
					let msg = `${key}: ${result?.errors?.[key][0]}`
					notifyMessage(msg)
				} else {
					//   loginStore.reset()
					notifyMessage(null)
				}
			})
	}

	const getProfileMerchant = () => {
		loginStore.environment.api
			.getProfileMerchant()
			.then(result => {
				if (result.kind === "ok") {
					console.log('  Merchant ===>>> ', JSON.stringify(result.data, null, 2))
					runInAction(() => {
						// loginStore.setConsumerUser(result.data)
						// loginStore.setApiToken(result.response.access_token)
						// navigation.navigate("home", {})
					})
				} else if (result.kind === "bad-data") {
					const key = Object.keys(result?.errors)[0]
					let msg = `${key}: ${result?.errors?.[key][0]}`
					notifyMessage(msg)
				} else {
					//   loginStore.reset()
					notifyMessage(null)
				}
			})
	}
	

	useEffect(() => {
		if (!userData.profile.name) navigation.navigate("setupProfile", {})
		else if (!userData.bankInfo.bankName) setShowBankModal(true)
		// navigation.navigate("return", {})
		getProfileConsumer()
		getProfileMerchant()
		console.log(' loginStore ===>>> ', loginStore.getAllData)
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
									<Text style={styles.AGREE_LABEL_LINK} onPress={() => console.log('dwolla')}>
										{"Dwolla Terms of Service "}
									</Text>
									{`and `}
									<Text style={styles.AGREE_LABEL_LINK} onPress={() => console.log('dwolla')}>
										{"Dwolla Privacy Policy"}
									</Text>
								</Text>
							</View>


							<TouchableOpacity style={styles.MODAL_BUTTON} onPress={() => navigation.navigate("splash", {})}>
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

	return (
		<Screen
			preset="fixed"
			statusBar={'dark-content'}
			unsafe={true}
			showHeader
		>
			<KeyboardAvoidingView
				enabled
				behavior={Platform.OS === 'ios' ? 'padding' : null}
				style={styles.ROOT}
			>
				<ScrollView bounces={false}>
					<View style={styles.ROOT_CONTAINER}>
							<View style={styles.STEP_CONTAINER}>
								<TouchableOpacity style={styles.HEADER} onPress={() => navigation.toggleDrawer()}>
									<Icon name={"menu"} size={23} color={COLOR.PALETTE.blue} />
									<Text style={styles.BACK_BUTON_LABEL}>{` Home`}</Text>

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
										<Text style={styles.AMOUNT}>382.91</Text>
									</View>
									{/* <TouchableOpacity style={styles.LOAD_WALLET_CONTAINER} onPress={() => navigation.navigate("loadWallet", {})}> */}
									<TouchableOpacity style={styles.LOAD_WALLET_CONTAINER} onPress={() => loginStore.getAllData}>
										<Text style={styles.LOAD_WALLET_LABEL}>Load Wallet</Text>
									</TouchableOpacity>
								</View>
								<View style={styles.LINE} />
								{renderNews()}
								<View style={{ height: 100 }} />
							</View>
					</View>
					{bankModal()}

				</ScrollView>
				<Button
					buttonStyle={{
						backgroundColor: COLOR.PALETTE.blue,
						bottom: 5,
						position: 'absolute'
					}}
					buttonLabelPre={<Icon key={'button_adornment'} name={"qr-code-2"} size={30} color={'white'} style={{ marginRight: 30 }} />}
					onPress={() => navigation.navigate("return", {})}
					buttonLabel={'Scan to Pay or Receive'}
				/>
			</KeyboardAvoidingView>
		</Screen>
	)
})
