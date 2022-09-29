import { observer } from "mobx-react-lite";
import {useIsFocused, useNavigation} from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Button, Screen, Text } from "../../components";
import { Image, TouchableOpacity, View, Modal, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { COLOR, IMAGES, METRICS } from "../../theme";
import styles from './community-chest-style';
import Icon from "react-native-vector-icons/MaterialIcons"
import moment from 'moment'
import { useStores } from "../../models";
import {plata_fmt} from "../../utils/helpers";

const news = [
	{
		tag: 'COMMUNITY CHEST',
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
	const isFocused = useIsFocused()
	const [communityChest, setCommunityChest] = useState(null)

	const renderProgressData = () => {


		const balance = communityChest?.balance || 0
		const goal =  communityChest?.goal || 1
		const total = ((balance * 100) / goal)
		const currentPosition = total / 100
		const lastPositon = 0.8 - currentPosition
		return (
			<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
				{/* LINE */}
				<View
					style={[
						{ backgroundColor: COLOR.PALETTE.black, width: METRICS.screenWidth * currentPosition },
						styles.PROGRESS_LINE
					]}
				/>
				<View
					style={[
						{ backgroundColor: loginStore.getAccountColor, width: METRICS.screenWidth * lastPositon },
						styles.PROGRESS_LINE
					]}
				/>
			</View>
		)
	}

	const getCommunityChestData = () => {
		loginStore.environment.api.getCommunityChestData()
			.then((result: any) => {
				if (result.kind === 'ok') {
					setCommunityChest(result.data)
				}
			})
	}

	useEffect(() => {
		console.log('asd')
		if(isFocused) {
			getCommunityChestData()
		}
	}, [isFocused])

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

							<View  style={styles.NEWS_CONTAINER}>
								<View style={styles.NEWS_HEADER_CONTAINER}>
									<Text style={styles.NEWS_TAG}>COMMUNITY CHEST</Text>
									<Text style={styles.NEWS_TAG}>{moment().format('MMMM')}</Text>
								</View>
								<Text style={styles.NEWS_TITLE}>Market Match</Text>
								<Text style={styles.NEWS_BODY}>Donated Currents from the Community Chest are redistributed to families in need to top up their Supplemental Nutrition Assistance Program (SNAP) benefits when used at the local farmers markets. This enables families to access high quality local food, while providing support to local farmers.

									Let’s do this together!</Text>

								<View style={styles.NEWS_INFO_CONTAINER}>
									<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
										<Text style={styles.INPUT_LABEL_STYLE}>RAISED THIS MONTH</Text>
										<Text style={styles.INPUT_LABEL_STYLE_OFF}>GOAL</Text>
									</View>
									<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
										<Text style={styles.NEWS_AMOUNT}>{plata_fmt(communityChest?.balance)}</Text>
										<Text style={styles.NEWS_AMOUNT_OFF}>{plata_fmt(communityChest?.goal)}</Text>
									</View>
									{renderProgressData()}
								</View>


								<View style={styles.NEWS_INFO_CONTAINER}>
									<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
										<Text style={styles.INPUT_LABEL_STYLE}>IMPACT TO DATE</Text>
									</View>
									<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
										<Text style={styles.NEWS_AMOUNT}>
											{communityChest?.achievements1}
										</Text>
										<Image
											resizeMode="contain"
											source={IMAGES.family}
											style={styles.ITEM_ICON}
										/>
									</View>
								</View>


								<View style={styles.NEWS_INFO_CONTAINER}>
									<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
										<Text style={styles.NEWS_AMOUNT}>{communityChest?.achievements2}</Text>
										<Image
											resizeMode="contain"
											source={IMAGES.community}
											style={styles.ITEM_ICON}
										/>
									</View>
								</View>

							</View>
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
