import { observer } from "mobx-react-lite";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Button, Screen, Text, ConnectBankModal } from "../../components";
import { Platform, TextInput, TouchableOpacity, View, Image, ScrollView, KeyboardAvoidingView } from "react-native";
import { COLOR, IMAGES, METRICS } from "../../theme";
import styles from './create-coupons';
import Icon from "react-native-vector-icons/MaterialIcons"
import { useStores } from "../../models";
import DatePicker from 'react-native-date-picker'
import Entypo from "react-native-vector-icons/Entypo"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import { launchImageLibrary } from 'react-native-image-picker';
import { notifyMessage } from "../../utils/helpers"

// a) Discount percentage, b) Discount dollar amount, c) Special Offer. 
// Depending on the pull down choice, this would prompt user to enter either the discount percentage 
// (e.g. 10% every Tuesday),
// the discount amount (e.g. $10 off when you spend $50 or more this week)
// or special offer (e.g. get a free glass of wine on your birthday). 

export const CreateCouponScreen = observer(function CreateCouponScreen() {
	const navigation = useNavigation()
	const rootStore = useStores()
	const { loginStore } = rootStore

	const [Loading, setLoading] = useState(false)
	const [Title, setTitle] = React.useState('');
	const [DateFrom, setDateFrom] = useState(new Date())
	const [OpenFrom, setOpenFrom] = useState(false)
	const [DateTo, setDateTo] = useState(new Date())
	const [OpenTo, setOpenTo] = useState(false)
	const [SelectOpen, setSelectOpen] = useState(false)
	const [TypeOfPromo, setTypeOfPromo] = React.useState('');
	const [DiscountInput, setDiscountInput] = React.useState('');
	const [PromoImage, setPromoImage] = React.useState<any>(null);
	const [Description, setDescription] = React.useState('');

	function selectImage(type: string) {
		const options: any = {
			mediaType: "photo",
			includeBase64: false,
			maxWidth: 512,
			maxHeight: 512
		};

		launchImageLibrary(options, (response: any) => {
			if (response.didCancel) {
				return;
			} else if (response.errorCode === 'camera_unavailable') {
				return;
			} else if (response.errorCode === 'permission') {
				return;
			} else if (response.errorCode === 'others') {
				return;
			}
			if (type === 'image') setPromoImage(response.assets[0]);

		});
	}

	const postCoupon = () => {
		setLoading(true)
		const promoImage = {
			uri:
				Platform.OS === "android"
					? PromoImage?.uri
					: PromoImage?.uri.replace("file://", ""),
			type: PromoImage?.type,
			name: PromoImage?.fileName
		}
		loginStore.environment.api.postCoupons({
			title: Title,
			start_date: DateFrom.toISOString().split('T')[0],
			end_date: DateTo.toISOString().split('T')[0],
			type_of_promo: TypeOfPromo,
			discount_input: DiscountInput,
			description: Description,
			promo_image: promoImage,
			merchant: loginStore.getAllData.merchant_id
		})
			.then((result: any) => {
				setLoading(false)
				if (result.kind === "ok") {
					navigation.navigate("myCoupons")
				} else if (result.kind === "bad-data") {
					const key = Object.keys(result?.errors)[0]
					const msg = `${key}: ${result?.errors?.[key][0]}`
					notifyMessage(msg)
				} else {
					notifyMessage(null)
				}
			})
	}

	

	const TypeOfPromos = [
		'Discount percentage',
		'Discount dollar amount',
		'Special Offer',
	]

	return (
		<Screen
			showHeader
			preset="fixed"
			statusBar={'dark-content'}
			unsafe={true}
			style={styles.ROOT}
		>
			<View style={styles.HEADER_ACTIONS}>

				<TouchableOpacity onPress={() => navigation.navigate("myCoupons")} style={styles.BACK_BUTON_CONTAINER}>
					<Icon name={"arrow-back"} size={23} color={COLOR.PALETTE.black} />
					<Text style={styles.BACK_BUTON_LABEL}>{` Back`}</Text>
				</TouchableOpacity>

			</View>
			<KeyboardAvoidingView
				enabled
				style={styles.ROOT}
			>
				<ScrollView>

					<View style={styles.STEP_CONTAINER}>
						<Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>Create a new promo</Text>
						<Text style={styles.LINE} />

						<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
							<Text style={styles.INPUT_LABEL_STYLE}>TITLE</Text>
						</View>
						<View style={[styles.INPUT_STYLE_CONTAINER, { backgroundColor: `${loginStore.getAccountColor}25` }]}>
							<TextInput
								placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
								style={styles.INPUT_STYLE}
								onChangeText={t => setTitle(t)}
								value={Title}
								placeholder={'Title'}
							/>
						</View>

						<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
							<Text style={styles.INPUT_LABEL_STYLE}>START DATE</Text>
							<Text style={styles.INPUT_LABEL_STYLE}>END DATE</Text>
						</View>
						<View style={[styles.INPUT_LABEL_STYLE_CONTAINER, { marginTop: 5 }]}>
							<View style={styles.SMALL_INPUT_STYLE_CONTAINER}>
								<TextInput
									onFocus={() => setOpenFrom(true)}
									style={styles.SMALL_INPUT_STYLE}
									keyboardType='numeric'
									value={`${DateFrom.toLocaleDateString()}`}
									placeholder={`MM/DD/YY`}
									placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
								/>
								<DatePicker
									modal
									open={OpenFrom}
									date={DateFrom}
									mode='date'
									onConfirm={(date) => {
										setOpenFrom(false)
										setDateFrom(date)
									}}
									onCancel={() => setOpenFrom(false)}
								/>
							</View>
							<View style={styles.SMALL_INPUT_STYLE_CONTAINER}>
								<TextInput
									style={styles.SMALL_INPUT_STYLE}
									onFocus={() => setOpenTo(true)}
									keyboardType='numeric'
									value={`${DateTo.toLocaleDateString()}`}
									placeholder={`MM/DD/YY`}
									placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
								/>
								<DatePicker
									modal
									open={OpenTo}
									date={DateTo}
									mode='date'
									onConfirm={(date) => {
										setOpenTo(false)
										setDateTo(date)
									}}
									onCancel={() => setOpenTo(false)}
								/>
							</View>
						</View>

						<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
							<Text style={styles.INPUT_LABEL_STYLE}>TYPE OF PORMO</Text>
						</View>
						<View style={SelectOpen ? styles.SELECT_INPUT_STYLE_CONTAINER_OPEN : styles.SELECT_INPUT_STYLE_CONTAINER}>
							<TouchableOpacity style={styles.SELECT_ICON} onPress={() => [setSelectOpen(!SelectOpen), setTypeOfPromo('')]}>
								<Text style={styles.SELECT_LABEL}>{TypeOfPromo || '-'}</Text>
								<Entypo name={SelectOpen ? "chevron-up" : "chevron-down"} size={23} color={'black'} style={{ marginRight: 20 }} />
							</TouchableOpacity>
							{SelectOpen && TypeOfPromos.map((t, key) => (
								<TouchableOpacity key={key + 'btype'} style={styles.SELECT_ICON} onPress={() => [setSelectOpen(!SelectOpen), setTypeOfPromo(t)]}>
									<Text style={styles.SELECT_LABEL}>{t}</Text>
								</TouchableOpacity>
							))}
						</View>
						<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
							<Text style={styles.INPUT_LABEL_STYLE}>
								{TypeOfPromo === 'Discount percentage'
									? 'INPUT DISCOUNT (%)'
									: TypeOfPromo === 'Discount dollar amount'
										? 'INPUT DISCOUNT ($)'
										: 'INPUT SPECIAL OFFER'
								}
							</Text>
						</View>
						<View style={[styles.INPUT_STYLE_CONTAINER, { backgroundColor: `${loginStore.getAccountColor}25` }]}>
							<TextInput
								placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
								style={styles.INPUT_STYLE}
								keyboardType={TypeOfPromo === 'Special Offer' ? 'default' : 'decimal-pad'}
								onChangeText={t => {
									TypeOfPromo === 'Special Offer'
										? setDiscountInput(t)
										: setDiscountInput(t.replace(/[^0-9]/g, ''))
								}}
								value={DiscountInput}
								placeholder={''}
							/>
						</View>

						<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
							<Text style={styles.INPUT_LABEL_STYLE}>IMAGE</Text>
						</View>
						<TouchableOpacity
							onPress={() => selectImage('image')}
							style={[styles.BACK_IMAGE_CONTAINER, { backgroundColor: `${loginStore.getAccountColor}25` }]}
						>
							{!PromoImage?.uri
								? <FontAwesome name={"camera"} size={23} color={COLOR.PALETTE.orange} style={{ marginTop: 15, marginRight: 15 }} />
								: <Image
									source={{ uri: PromoImage?.uri }}
									resizeMode='cover'
									style={styles.BACK_IMAGE_BOX}
								/>

							}
						</TouchableOpacity>

						<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
							<Text style={styles.INPUT_LABEL_STYLE}>DESCRIPTION</Text>
						</View>
						<View style={[styles.BIG_INPUT_STYLE_CONTAINER, { backgroundColor: `${loginStore.getAccountColor}25` }]}>
							<TextInput
								placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
								style={styles.BIG_INPUT_STYLE}
								onChangeText={t => setDescription(t)}
								value={Description}
								multiline
								scrollEnabled={false}
								numberOfLines={3}
								placeholder=''
							/>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
			<Button
				buttonStyle={{
					rbackgroundColor: Loading ? `${loginStore.getAccountColor}40` : loginStore.getAccountColor,
					marginTop: 5
				}}
				loading={Loading}
				onPress={() => postCoupon()}
				buttonLabel={'Add Coupon'}
			/>
		</Screen>
	)
})
