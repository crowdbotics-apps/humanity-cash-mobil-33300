import { observer } from "mobx-react-lite";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Button, Screen, Text } from "../../components";
import { Image, TouchableOpacity, View, Modal, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { COLOR, IMAGES, METRICS } from "../../theme";
import styles from './community-chest-style';
import Icon from "react-native-vector-icons/MaterialIcons"
import { useStores } from "../../models";

const news = [
	{
		tag: 'COMMUNITY CHEST',
		date: 'JULY',
		title: 'Market Match',
		body: `Donated Currents from the Community Chest are redistributed to families in need to top up their Supplemental Nutrition Assistance Program (SNAP) benefits when used at the local farmers markets. This enables families to access high quality local food, while providing support to local farmers. 

Let’s do this together!`,
	},
	{
		tag: 'MERCHANT OF THE MONTH',
		date: 'JULY',
		title: 'Market Match',
		body: `Donated Currents from the Community Chest are redistributed to families in need to top up their Supplemental Nutrition Assistance Program (SNAP) benefits when used at the local farmers markets. This enables families to access high quality local food, while providing support to local farmers. 

Let’s do this together!`,
	}
]

export const CommunityChestScreen = observer(function CommunityChestScreen() {
	const navigation = useNavigation()
	const rootStore = useStores()
	const { loginStore } = rootStore

	const [ShowBankStepModal, setShowBankStepModal] = useState(false)
	const [ModalAgree, setModalAgree] = useState(false)

	const renderNews = () => (
		news.map((n, key) => <View key={key + '_new'} style={styles.NEWS_CONTAINER}>
			<View style={styles.NEWS_HEADER_CONTAINER}>
				<Text style={styles.NEWS_TAG}>{n.tag}</Text>
				<Text style={styles.NEWS_TAG}>{n.date}</Text>
			</View>
			<Text style={styles.NEWS_TITLE}>{n.title}</Text>
			<Text style={styles.NEWS_BODY}>{n.body}</Text>

			<View style={styles.NEWS_INFO_CONTAINER}>
				<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
					<Text style={styles.INPUT_LABEL_STYLE}>RAISED THIS MONTH</Text>
					<Text style={styles.INPUT_LABEL_STYLE_OFF}>GOAL</Text>
				</View>
				<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
					<Text style={styles.NEWS_AMOUNT}>C$ 105.67</Text>
					<Text style={styles.NEWS_AMOUNT_OFF}>C$ 1,000,00</Text>
				</View>
				<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
					{/* LINE */}
					<View
						style={[
							{ backgroundColor: COLOR.PALETTE.black, width: METRICS.screenWidth * 0.2 },
							styles.PROGRESS_LINE
						]}
					/>
					<View
						style={[
							{ backgroundColor: loginStore.getAccountColor, width: METRICS.screenWidth * 0.6 },
							styles.PROGRESS_LINE
						]}
					/>
				</View>
			</View>


			<View style={styles.NEWS_INFO_CONTAINER}>
				<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
					<Text style={styles.INPUT_LABEL_STYLE}>IMPACT TO DATE</Text>
				</View>
				<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
					<Text style={styles.NEWS_AMOUNT}>102 Families served</Text>
					<Image
						resizeMode="contain"
						source={IMAGES.family}
						style={styles.ITEM_ICON}
					/>
				</View>
			</View>


			<View style={styles.NEWS_INFO_CONTAINER}>
				<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
					<Text style={styles.NEWS_AMOUNT}>C$ 5,100 to local farms</Text>
					<Image
						resizeMode="contain"
						source={IMAGES.community}
						style={styles.ITEM_ICON}
					/>
				</View>
			</View>

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
				// behavior={Platform.OS === 'ios' ? 'padding' : null}
				style={styles.ROOT}
			>
				<ScrollView showsVerticalScrollIndicator={false} bounces={false}>
					<View style={styles.ROOT_CONTAINER}>
						<View style={styles.STEP_CONTAINER}>
							<TouchableOpacity style={styles.HEADER} onPress={() => navigation.toggleDrawer()}>
								<Icon name={"menu"} size={23} color={loginStore.getAccountColor} />
								<Text style={[styles.BACK_BUTON_LABEL, { color: loginStore.getAccountColor }]}>{` Home`}</Text>

							</TouchableOpacity>

							<Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>Community chest</Text>
							<View style={styles.LINE} />
							<Text style={styles.STEP_SUB_TITLE}>Currents is all about supporting the local community. You can choose to round up and donate your change to the community chest, which will be distributed to local projects or neighbors in need.</Text>

							{renderNews()}
							<View style={{ height: 100 }} />
						</View>
					</View>

				</ScrollView>
				<Button
					buttonStyle={{
						backgroundColor: COLOR.PALETTE.blue,
						top: METRICS.screenHeight - 100,
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
