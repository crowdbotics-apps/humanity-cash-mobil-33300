import { observer } from "mobx-react-lite";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Button, Screen, Text, ModalSelector, MaskInput } from "../../components";
import { TextInput, TouchableOpacity, View, Platform, KeyboardAvoidingView, ScrollView, Image } from "react-native";
import { COLOR, IMAGES, METRICS } from "../../theme";
import { launchImageLibrary } from 'react-native-image-picker';
import styles from './my-profile-style';
import Icon from "react-native-vector-icons/MaterialIcons"
import { notifyMessage } from "../../utils/helpers"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import { useStores } from "../../models"
import { runInAction } from "mobx"
import {Masks} from "react-native-mask-input";

export const MyProfileScreen = observer(function MyProfileScreen() {
	const navigation = useNavigation()
	const rootStore = useStores()
	const { loginStore } = rootStore
	const isFocused = useIsFocused();
	const [Loading, setLoading] = useState(false)
	const [Email, setEmail] = useState('')

	// personal
	const [Username, setUsername] = useState('')
	const [imageSource, setImageSource] = React.useState<any>(null);
	const [UsernameError, setUsernameError] = useState(false);
	const [Name, setName] = useState('')
	const [LastName, setLastName] = useState('')

	// business
	const [BusinessImageSource, setBusinessImageSource] = React.useState<any>(null);
	const [BackBusinessImageSource, setBackBusinessImageSource] = React.useState<any>(null);
	const [BusinessName, setBusinessName] = React.useState('');
	const [BusinessStory, setBusinessStory] = React.useState('');
	const [BusinessCategory, setBusinessCategory] = React.useState('');
	const [BusinessWebsite, setBusinessWebsite] = React.useState('');
	const [Address1, setAddress1] = React.useState('');
	const [Address2, setAddress2] = React.useState('');
	const [PostalCode, setPostalCode] = React.useState('');
	const [PhoneNumber, setPhoneNumber] = React.useState('');

	const [Citys, setCitys] = React.useState([]);
	const [City, setCity] = React.useState({});
	const [States, setStates] = React.useState([]);
	const [State, setState] = React.useState('');
	const [SelectStateOpen, setSelectStateOpen] = React.useState(false);
	const [SelectCityOpen, setSelectCityOpen] = React.useState(false);

	function selectImage(type: string) {
		const options: any = {
			mediaType: 'photo',
			maxWidth: 300,
			maxHeight: 550,
			quality: 1,
			includeBase64: true,
		};

		launchImageLibrary(options, (response: any) => {
			if (response.didCancel) return
			else if (response.errorCode === 'camera_unavailable') return
			else if (response.errorCode === 'permission') return
			else if (response.errorCode === 'others') return
			if (type === 'user_image') setImageSource(response.assets[0]);
			if (type === 'business') setBusinessImageSource(response.assets[0]);
			if (type === 'business_back') setBackBusinessImageSource(response.assets[0]);
		});
	}

	const fetchCity = (data?: string) => {
		loginStore.environment.api.getCities({ value: data })
			.then((result: any) => {
				result?.data?.results && setCitys(result.data.results.map(r => ({ id: r.city_id, title: r.city_name })))
			})
	}
	const fetchState = (data?: string) => {
		loginStore.environment.api.getStates({ value: data })
			.then((result: any) => {
				result?.data?.results && setStates(result.data.results.map(r => ({ id: r.state_id, title: r.state_name })))
			})
	}

	const PersonalProfile = () => (
		<View style={styles.EDIT_CONTAINER}>
			<TouchableOpacity
				onPress={() => selectImage('user_image')}
				style={styles.IMAGE_CONTAINER}
			>
				{!imageSource?.uri
					? <Image
						source={IMAGES.noImage}
						style={styles.IMAGE_BOX}
					/>
					: <Image
						source={{ uri: imageSource.uri }}
						style={styles.IMAGE_BOX}
						resizeMode='cover'
					/>
				}
			</TouchableOpacity>
			<Text style={styles.IMAGE_BOX_LABEL}>Upload profile picture</Text>
			<Text style={styles.IMAGE_BOX_VALIDATION}>(Max 200 MB / .jpeg, .jpg, .png)</Text>
			<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
				<Text style={styles.INPUT_LABEL_STYLE}>USER NAME*</Text>
				<Text style={styles.INPUT_LABEL_ERROR}>{UsernameError ? 'SORRY, THAT NAME IS ALREADY TAKEN' : ''}</Text>
			</View>
			<View style={[UsernameError ? styles.INPUT_STYLE_CONTAINER_ERROR : styles.INPUT_STYLE_CONTAINER, { backgroundColor: `${loginStore.getAccountColor}25` }]}>
				<TextInput
					placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
					style={styles.INPUT_STYLE}
					onChangeText={t => {
						setUsername(t)
						if (t === '@rafa') setUsernameError(true)
						else setUsernameError(false)
					}}
					value={Username?.charAt(0) == '@' ? Username : '@' + (Username || '')}
					placeholder={'@username'}
				/>
			</View>
			<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
				<Text style={styles.INPUT_LABEL_STYLE}>FIRST NAME</Text>
			</View>
			<View style={[styles.INPUT_STYLE_CONTAINER, { backgroundColor: `${loginStore.getAccountColor}25` }]}>
				<TextInput
					placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
					style={styles.INPUT_STYLE}
					onChangeText={t => setName(t)}
					value={Name}
					placeholder={'First name'}
				/>
			</View>
			<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
				<Text style={styles.INPUT_LABEL_STYLE}>LAST NAME</Text>
			</View>
			<View style={[styles.INPUT_STYLE_CONTAINER, { backgroundColor: `${loginStore.getAccountColor}25` }]}>
				<TextInput
					placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
					style={styles.INPUT_STYLE}
					onChangeText={t => setLastName(t)}
					value={LastName}
					placeholder={'Last name'}
				/>
			</View>
		</View>
	)

	const BusinessProfile = () => (
		<View style={styles.EDIT_CONTAINER}>
			<View style={styles.BUSINESS_IMAGES_CONTAINER}>
				<TouchableOpacity
					onPress={() => selectImage('business_back')}
					style={[styles.BACK_IMAGE_CONTAINER, { backgroundColor: `${loginStore.getAccountColor}25` }]}
				>
					{!BackBusinessImageSource?.uri
						? <FontAwesome name={"camera"} size={23} color={'#39534440'} style={{ marginTop: 15, marginRight: 15 }} />
						: <Image
							source={{ uri: BackBusinessImageSource.uri }}
							resizeMode='cover'
							style={styles.BACK_IMAGE_BOX}
						/>
					}
				</TouchableOpacity>
				<View style={styles.IMAGE_CONTAINER_MARGIN}>
					<TouchableOpacity
						onPress={() => selectImage('business')}
						style={[styles.IMAGE_CONTAINER, { backgroundColor: `${loginStore.getAccountColor}25` }]}
					>
						{!BusinessImageSource?.uri
							? <FontAwesome name={"camera"} size={23} color={'#39534440'} />
							: <Image
								source={{ uri: BusinessImageSource.uri }}
								resizeMode='cover'
								style={styles.IMAGE_BOX}
							/>
						}
					</TouchableOpacity>
				</View>
			</View>
			<Text style={styles.IMAGE_BOX_LABEL}>Upload profile picture</Text>
			<Text style={styles.IMAGE_BOX_VALIDATION}>(Max 200 MB / .jpeg, .jpg, .png)</Text>
			<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
				<Text style={styles.INPUT_LABEL_STYLE}>BUSINESS NAME - THIS NAME WILL BE PUBLIC*</Text>
			</View>
			<View style={[styles.INPUT_STYLE_CONTAINER, { backgroundColor: `${loginStore.getAccountColor}25` }]}>
				<TextInput
					placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
					style={styles.INPUT_STYLE}
					onChangeText={t => {
						setBusinessName(t)
					}}
					value={BusinessName}
					placeholder={'Business name'}
				/>
			</View>
			<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
				<Text style={styles.INPUT_LABEL_STYLE}>TELL US YOUR STORY (50 WORDS MAX)</Text>
			</View>
			<View style={[styles.BIG_INPUT_STYLE_CONTAINER, { backgroundColor: `${loginStore.getAccountColor}25` }]}>
				<TextInput
					placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
					style={styles.BIG_INPUT_STYLE}
					onChangeText={t => setBusinessStory(t)}
					value={BusinessStory}
					multiline
					scrollEnabled={false}
					numberOfLines={4}
					placeholder={'Tell the world about your business. What gives you joy as an entrepreneur? What do you love about the Berkshires?'}
				/>
			</View>
			<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
				<Text style={styles.INPUT_LABEL_STYLE}>BUSINESS CATEGORY</Text>
			</View>
			<View style={[styles.INPUT_STYLE_CONTAINER, { backgroundColor: `${loginStore.getAccountColor}25` }]}>
				<TextInput
					placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
					style={styles.INPUT_STYLE}
					onChangeText={t => {
						setBusinessCategory(t)
					}}
					value={BusinessCategory}
					placeholder={'business category'}
				/>
			</View>
			<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
				<Text style={styles.INPUT_LABEL_STYLE}>WEBSITE - OPCIONAL</Text>
			</View>
			<View style={[styles.INPUT_STYLE_CONTAINER, { backgroundColor: `${loginStore.getAccountColor}25` }]}>
				<TextInput
					placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
					style={styles.INPUT_STYLE}
					onChangeText={t => {
						setBusinessWebsite(t)
					}}
					value={BusinessWebsite}
					placeholder={'website - optional'}
				/>
			</View>
			<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
				<Text style={styles.INPUT_LABEL_STYLE}>ADDRESS 1</Text>
			</View>
			<View style={[styles.INPUT_STYLE_CONTAINER, { backgroundColor: `${loginStore.getAccountColor}25` }]}>
				<TextInput
					placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
					style={styles.INPUT_STYLE}
					onChangeText={t => setAddress1(t)}
					value={Address1}
					placeholder={'Street number, street name'}
				/>
			</View>
			<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
				<Text style={styles.INPUT_LABEL_STYLE}>ADDRESS 2</Text>
			</View>
			<View style={[styles.INPUT_STYLE_CONTAINER, { backgroundColor: `${loginStore.getAccountColor}25` }]}>
				<TextInput
					placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
					style={styles.INPUT_STYLE}
					onChangeText={t => setAddress2(t)}
					value={Address2}
					placeholder={'Street number, street name'}
				/>
			</View>
			<View style={styles.SELECTS_CONTAINER}>
				<View style={styles.CONTAINER}>
					<View style={[styles.INPUT_LABEL_STYLE_CONTAINER, { width: METRICS.screenWidth * 0.65 }]}>
						<Text style={styles.INPUT_LABEL_STYLE}>CITY</Text>
					</View>
					<TouchableOpacity
						style={[styles.INPUT_STYLE_CONTAINER, { width: METRICS.screenWidth * 0.65, backgroundColor: `${loginStore.getAccountColor}25`, justifyContent: 'flex-start' }]}
						onPress={() => [setSelectCityOpen(!SelectCityOpen)]}
					>
						<ModalSelector
							options={Citys}
							action={setCity}
							title={""}
							value={City}
							visible={SelectCityOpen}
							setVisible={setSelectCityOpen}
							displaySelector
							closeOnClick
							searchAction={fetchCity}
						/>
					</TouchableOpacity>
				</View>
				<View style={styles.CONTAINER}>
					<View style={[styles.INPUT_LABEL_STYLE_CONTAINER, { width: METRICS.screenWidth * 0.2 }]}>
						<Text style={styles.INPUT_LABEL_STYLE}>STATE</Text>
					</View>
						<TouchableOpacity
							style={[styles.SELECT_ICON, { width: METRICS.screenWidth * 0.25, backgroundColor: `${loginStore.getAccountColor}25` }]}
							onPress={() => [setSelectStateOpen(!SelectStateOpen)]}
						>
							<ModalSelector
								options={States}
								action={setState}
								title={""}
								value={State}
								visible={SelectStateOpen}
								setVisible={setSelectStateOpen}
								displaySelector
								closeOnClick
								searchAction={fetchState}
							/>
						</TouchableOpacity>
					
				</View>
			</View>
			<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
				<Text style={styles.INPUT_LABEL_STYLE}>POSTAL CODE</Text>
			</View>
			<View style={[styles.INPUT_STYLE_CONTAINER, { backgroundColor: `${loginStore.getAccountColor}25` }]}>
				<TextInput
					placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
					style={styles.INPUT_STYLE}
					onChangeText={t => setPostalCode(t)}
					value={PostalCode}
					placeholder={'xxxxxxxxx'}
				/>
			</View>
			<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
				<Text style={styles.INPUT_LABEL_STYLE}>PHONE NUMBER</Text>
			</View>
			<MaskInput
				value={PhoneNumber}
				mask={Masks.USA_PHONE}
				name="ssn"
				placeholder="(XXX)-XXX-XXXX"
				keyboardType="number-pad"
				onChange={(masked, unmasked) => setPhoneNumber(unmasked)}
				style={{...styles.INPUT_STYLE_CONTAINER, backgroundColor: `${loginStore.getAccountColor}25`}}
			/>
		</View>
	)

	const updateProfile = () => {
		setLoading(true)
		const pic = {
			uri:
				Platform.OS === "android"
					? imageSource?.uri
					: imageSource?.uri?.replace("file://", ""),
			type: imageSource.type,
			name: imageSource.fileName
		}
		const profPic = {
			uri:
				Platform.OS === "android"
					? BusinessImageSource?.uri
					: BusinessImageSource?.uri?.replace("file://", ""),
			type: BusinessImageSource.type,
			name: BusinessImageSource.fileName
		}
		const backPic = {
			uri:
				Platform.OS === "android"
					? BackBusinessImageSource?.uri
					: BackBusinessImageSource?.uri?.replace("file://", ""),
			type: BackBusinessImageSource.type,
			name: BackBusinessImageSource.fileName
		}
		const phoneNumber = PhoneNumber !== ''
			?  (PhoneNumber && PhoneNumber.includes('+1')) ? PhoneNumber : `+1${PhoneNumber}`
			: ''
		loginStore.getSelectedAccount === 'merchant'
			? loginStore.environment.api
				.updateProfileMerchant({
					business_name: BusinessName,
					profile_picture: profPic,
					background_picture: backPic,
					business_story: BusinessStory,
					address_1: Address1,
					address_2: Address2,
					city: City?.id,
					state: State?.id,
					zip_code: PostalCode,
					phone_number: phoneNumber,
					website: BusinessWebsite,
					industry: BusinessCategory
				})
				.then((result: any) => {
					console.log(' updateProfile ===>>> ', JSON.stringify(result, null, 2))
					console.log(' updateProfile send ===>>> ', JSON.stringify({
						business_name: BusinessName,
						profile_picture: profPic,
						background_picture: backPic,
						business_story: BusinessStory,
						address_1: Address1,
						address_2: Address2,
						city: City?.id,
						state: State?.id,
						zip_code: PostalCode,
						phone_number: phoneNumber,
						website: BusinessWebsite,
						industry: BusinessCategory
					}, null, 2))
					
					setLoading(false)
					if (result.kind === "ok") {
						runInAction(() => {
							// loginStore.setMerchantUser(result.response)
							loginStore.setSelectedAccount('merchant')
							navigation.navigate("home")
						})
					} else if (result.kind === "bad-data") {
						const key = Object.keys(result?.errors)[0]
						const msg = `${key}: ${result?.errors?.[key][0]}`
						notifyMessage(msg)
					} else {
						loginStore.reset()
						notifyMessage(null)
					}
				})
			: loginStore.environment.api
				.updateProfileConsumer({
					username: Username,
					consumer_profile: pic,
					first_name: Name,
					last_name: LastName
				})
				.then((result: any) => {
					setLoading(false)
					if (result.kind === "ok") {
						runInAction(() => {
							// loginStore.setConsumerUser(result.response)
							loginStore.setSelectedAccount('consumer')
							navigation.navigate("home")
						})
					} else if (result.kind === "bad-data") {
						const key = Object.keys(result?.errors)[0]
						const msg = `${key}: ${result?.errors?.[key][0]}`
						notifyMessage(msg)
					} else if (result.kind === "unauthorized") {
						loginStore.reset()
						navigation.navigate("login")
					} else {
						loginStore.reset()
						notifyMessage(null)
					}
				})
	}

	useEffect(() => {
		if (isFocused) {
			setImageSource({ uri: loginStore.ProfileData.profile_picture })
			setUsername(loginStore.ProfileData.username)
			setName(loginStore.ProfileData.first_name)
			setLastName(loginStore.ProfileData.last_name)
			setBusinessImageSource({ uri: loginStore.ProfileDataBusiness.profile_picture_merchant })
			setBackBusinessImageSource({ uri: loginStore.ProfileDataBusiness.background_picture })
			setBusinessName(loginStore.ProfileDataBusiness.business_name)
			setBusinessStory(loginStore.ProfileDataBusiness.business_story)
			setBusinessCategory(loginStore.ProfileDataBusiness.industry)
			setBusinessWebsite(loginStore.ProfileDataBusiness.website)
			setCity(loginStore.ProfileDataBusiness.city)
			setState(loginStore.ProfileDataBusiness.state)
			setAddress1(loginStore.ProfileDataBusiness.address_1)
			setAddress2(loginStore.ProfileDataBusiness.address_2)
			setPostalCode(loginStore.ProfileDataBusiness.zip_code)
			setPhoneNumber(loginStore.ProfileDataBusiness.phone_number)
			setEmail(loginStore.getAllData.email)

			fetchCity()
			fetchState()
		}
	}, [isFocused])

	return (
		<Screen
			showHeader
			preset="fixed"
			statusBar={'dark-content'}
			unsafe={true}
			style={styles.ROOT}
		>
			<TouchableOpacity style={styles.HEADER} onPress={() => navigation.navigate("settings")}>
				<Icon name={"arrow-back"} size={23} color={COLOR.PALETTE.black} />
				<Text style={styles.BACK_BUTON_LABEL}>{` Back`}</Text>
			</TouchableOpacity>
			<KeyboardAvoidingView enabled style={styles.ROOT}>
				<ScrollView showsVerticalScrollIndicator={false} bounces={false}>
					<View style={styles.ROOT_CONTAINER}>
						<View style={styles.CONTAINER}>
							<Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>My profile</Text>
							<View style={styles.LINE} />
							<Text style={styles.STEP_SUB_TITLE}>This information is shared publicly.</Text>
							{loginStore.getSelectedAccount === 'merchant'
								? BusinessProfile()
								: PersonalProfile()
							}
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
			<Button
				buttonStyle={{ marginVertical: 5, backgroundColor: Loading ? `${loginStore.getAccountColor}40` : loginStore.getAccountColor }}
				onPress={() => updateProfile()}
				buttonLabel={'Save changes'}
				disabled={Loading}
				loading={Loading}
			/>
		</Screen>
	)
})
