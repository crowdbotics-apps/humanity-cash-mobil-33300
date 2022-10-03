import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { TextInput, View, TouchableOpacity, Image, Modal, TouchableWithoutFeedback, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import {
	Text,
	Button,
	Screen,
	ModalSelector,
	MaskInput
} from '../../components';
import Icon from "react-native-vector-icons/MaterialIcons"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import styles from './signup-profile-style';
import { useNavigation } from "@react-navigation/native"
import { launchImageLibrary } from 'react-native-image-picker';
import { IMAGES, METRICS } from "../../theme"
import Entypo from "react-native-vector-icons/Entypo"
import { useStores } from "../../models"
import { notifyMessage } from "../../utils/helpers"
import MapView, { Marker } from 'react-native-maps'
import Geolocation from '@react-native-community/geolocation';

const randomImages = [IMAGES.avBass, IMAGES.avBee, IMAGES.avBird, IMAGES.avSalamander]
const profileTypes = [
	{
		label: 'Personal',
		value: 'personal',
		first_step: 'pic_username'
	},
	{
		label: 'Business',
		value: 'business_personal',
		first_step: 'pic_bname'
	},
]

const businessTypes = [
	'Sole Proprietorship',
	'Corporation',
	'LLC',
	'Partnership',
	'Non-profit',
]

const industryTypes = [
	'Arts & entertainment',
	'Communication & education',
	'Food & drink',
	'Health & wellness',
	'Lodging',
	'Shopping',
	'Services',
]

export const SignupProfileScreen = observer(function SignupProfileScreen(props: any) {
	const rootStore = useStores()
	const navigation = useNavigation()
	const { loginStore } = rootStore

	const [Loading, setLoading] = useState(false)

	const [Step, setStep] = useState('profile_type')
	const [ButtonDisabled, setButtonDisabled] = useState(false)
	const [ShowConfirmLogoutModal, setShowConfirmLogoutModal] = useState(false)
	const [ShowThankyouModal, setShowThankyouModal] = useState(false)

	const [ProfileType, setProfileType] = useState({})

	const [RandonPic, setRandonPic] = useState(Math.round(Math.random() * 3))

	// map
	const [ShowMapInputModal, setShowMapInputModal] = useState(false)
	const [MapInputAddress, setMapInputAddress] = useState(1)
	const [MapLocation, setMapLocation] = useState({ lat: null, lng: null })
	const [Region, setRegion] = useState({
		latitude: 37.78825,
		longitude: -122.4324,
		latitudeDelta: 0.015,
		longitudeDelta: 0.0121,
	})
	const [Latitud, setLatitud] = useState(null)
	const [Longitud, setLongitud] = useState(null)

	// personal
	const [Username, setUsername] = useState('')
	const [imageSource, setImageSource] = React.useState<any>(null);
	const [UsernameError, setUsernameError] = useState(false)
	const [UsernameErrorMsg, setUsernameErrorMsg] = useState('')
	const [Name, setName] = useState('')
	const [LastName, setLastName] = useState('')

	// business
	const [BusinessName, setBusinessName] = React.useState('');
	const [BusinessStory, setBusinessStory] = React.useState('');
	const [BusinessType, setBusinessType] = React.useState('');
	const [SelectOpen, setSelectOpen] = useState(false)
	const [BusinessExecName, setBusinessExecName] = React.useState('');
	const [BusinessExecLastName, setBusinessExecLastName] = React.useState('');
	const [BusinessImageSource, setBusinessImageSource] = React.useState<any>(null);
	const [BackBusinessImageSource, setBackBusinessImageSource] = React.useState<any>(null);

	const [BusinessRegName, setBusinessRegName] = React.useState('');
	const [BusinessIndustryType, setBusinessIndustryType] = React.useState('');
	const [SelectIndustryOpen, setSelectIndustryOpen] = useState(false)
	const [FacebookLink, setFacebookLink] = React.useState('');
	const [InstagramLink, setInstagramLink] = React.useState('');
	const [TwitterLink, setTwitterLink] = React.useState('');

	const [IndentifierType, setIndentifierType] = useState('')
	const [EmployerId, setEmployerId] = React.useState('');
	const [SocialSecurityNumber, setSocialSecurityNumber] = React.useState('');

	const [Address1, setAddress1] = React.useState('');
	const [Address2, setAddress2] = React.useState('');
	const [Citys, setCitys] = React.useState([]);
	const [City, setCity] = React.useState('');
	const [States, setStates] = React.useState([]);
	const [State, setState] = React.useState('');
	const [SelectStateOpen, setSelectStateOpen] = React.useState(false);
	const [SelectCityOpen, setSelectCityOpen] = React.useState(false);
	const [PostalCode, setPostalCode] = React.useState('');
	const [PhoneNumber, setPhoneNumber] = React.useState('');



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
			if (type === 'user_image') setImageSource(response.assets[0]);
			if (type === 'business') setBusinessImageSource(response.assets[0]);
			if (type === 'business_back') setBackBusinessImageSource(response.assets[0]);

		});
	}

	const fetchCity = (data?: string) => {
		loginStore.environment.api.getCities({ value: data })
			.then((result: any) => {
				setCitys(result.data.results.map(r => ({ id: r.city_id, title: r.city_name })))
			})
	}
	const fetchState = (data?: string) => {
		loginStore.environment.api.getStates({ value: data })
			.then((result: any) => {
				setStates(result.data.results.map(r => ({ id: r.state_id, title: r.state_code })))
			})
	}

	const setupConsumer = () => {
		setLoading(true)
		setUsernameErrorMsg("")
		setUsernameError(false)
		const pic = {
			uri:
				Platform.OS === "android"
					? imageSource?.uri
					: imageSource?.uri.replace("file://", ""),
			type: imageSource?.type,
			name: imageSource?.fileName
		}
		loginStore.environment.api.setupConsumer({
			username: Username,
			consumer_profile: pic
		}).then((result: any) => {
			setLoading(false)
			if (result.kind === "ok") {
				setStep("name")
			} else if (result.kind === "bad-data") {
				const key = Object.keys(result?.errors)[0]
				const msg = `${key}: ${result?.errors?.[key][0]}`
				if (key === 'username') {
					setUsernameError(true)
					setUsernameErrorMsg(result?.errors?.[key][0])
				}
				notifyMessage(msg)
			} else if (result.kind === "unauthorized") {
				loginStore.reset()
				navigation.navigate("login", {})
			} else {
				notifyMessage(null)
			}
		})
	}

	const setupConsumerDetail = () => {
		setLoading(true)
		loginStore.environment.api.setupConsumerDetail({
			first_name: Name,
			last_name: LastName
		}).then((result: any) => {
			setLoading(false)
			if (result.kind === "ok") {
				setShowThankyouModal(true)
			} else if (result.kind === "bad-data") {
				const key = Object.keys(result?.errors)[0]
				const msg = `${key}: ${result?.errors?.[key][0]}`
				notifyMessage(msg)
			} else if (result.kind === "unauthorized") {
				loginStore.reset()
				navigation.navigate("login", {})
			} else {
				notifyMessage(null)
			}
		})
	}

	const setupMerchant = () => {
		setLoading(true)
		const profPic = {
			uri:
				Platform.OS === "android"
					? BusinessImageSource?.uri
					: BusinessImageSource?.uri.replace("file://", ""),
			type: BusinessImageSource?.type,
			name: BusinessImageSource?.fileName
		}
		const backPic = {
			uri:
				Platform.OS === "android"
					? BackBusinessImageSource?.uri
					: BackBusinessImageSource?.uri.replace("file://", ""),
			type: BackBusinessImageSource?.type,
			name: BackBusinessImageSource?.fileName
		}
		loginStore.environment.api.setupMerchant({
			business_name: BusinessName,
			profile_picture: profPic,
			background_picture: backPic,
			business_story: BusinessStory
		})
			.then((result: any) => {
				setLoading(false)
				setStep('business_type')
				if (result.kind === "ok") {
					setStep('business_type')
				} else if (result.kind === "bad-data") {
					const key = Object.keys(result?.errors)[0]
					const msg = `${key}: ${result?.errors?.[key][0]}`
					notifyMessage(msg)
				} else if (result.kind === "unauthorized") {
					loginStore.reset()
					navigation.navigate("login", {})
				} else {
					notifyMessage(null)
				}
			})
	}

	const setupMerchantDetail = () => {
		setLoading(true)
		loginStore.environment.api.setupMerchantDetail({ type_of_business: BusinessType })
			.then((result: any) => {
				setLoading(false)
				if (result.kind === "ok") {
					setStep('business_exec')
				} else if (result.kind === "bad-data") {
					const key = Object.keys(result?.errors)[0]
					const msg = `${key}: ${result?.errors?.[key][0]}`
					notifyMessage(msg)
				} else if (result.kind === "unauthorized") {
					loginStore.reset()
					navigation.navigate("login", {})
				} else {
					notifyMessage(null)
				}
			})
	}
	const setupMerchantDetailComplete = () => {
		setLoading(true)
		loginStore.environment.api.setupMerchantDetail({
			registered_business_name: BusinessRegName,
			industry: BusinessIndustryType,
			employer_identification_number: IndentifierType === 'EIN' ? EmployerId : '',
			social_security_number: IndentifierType === 'SSN' ? SocialSecurityNumber : '',
			owner_first_name: BusinessExecName,
			owner_last_name: BusinessExecLastName,
			// city: 1988, // TODO: fetch
			// state: 28, // TODO: fetch
			address_1: Address1,
			address_2: Address2,
			zip_code: PostalCode,
			phone_number: PhoneNumber
		})
			.then((result: any) => {
				setLoading(false)
				if (result.kind === "ok") {
					setShowThankyouModal(true)
				} else if (result.kind === "bad-data") {
					const key = Object.keys(result?.errors)[0]
					const msg = `${key}: ${result?.errors?.[key][0]}`
					notifyMessage(msg)
				} else if (result.kind === "unauthorized") {
					loginStore.reset()
					navigation.navigate("login", {})
				} else {
					notifyMessage(null)
				}
			})
	}
	const renderStep = () => {
		let render
		switch (Step) {
			// consumer
			case 'pic_username':
				render = renderPicUsername()
				break;
			case 'name':
				render = renderName()
				break;
			// merchant
			case 'pic_bname':
				render = renderPicBName()
				break;
			case 'business_type':
				render = renderBusinessType()
				break;
			case 'business_exec':
				render = renderbusinessExec()
				break;
			case 'business_data':
				render = renderbusinessData()
				break;
			case 'business_addresss':
				render = renderbusinessAddresss()
				break;
			default:
				render = renderSelectBusinessType()
		}
		return render
	}
	const renderSelectBusinessType = () => (
		<View style={styles.STEP_CONTAINER}>
			<Text style={styles.STEP_TITLE}>{ProfileType.label} account</Text>
			<View style={styles.LINE} />
			<Text style={styles.SIGNUP_PROFILE_SUB_TITLE}>You do not have a business account linked. If you do have a business that accepts BerkShares you can sign up and link your business!</Text>
			{/* {profileTypes.map((t, key) => (
				<TouchableOpacity key={key + '_ptype'} style={styles.SUBMIT_BUTTON_OUTLINE} onPress={() => [setProfileType(t.value), setStep(t.first_step)]}>
					<Text style={styles.SUBMIT_BUTTON_OUTLINE_LABEL}>{t.label}</Text>
				</TouchableOpacity>
			))} */}
			{/* <TouchableOpacity style={styles.SUBMIT_BUTTON_OUTLINE} onPress={() => [setProfileType(ProfileType.value), setStep(ProfileType.first_step)]}>
					<Text style={styles.SUBMIT_BUTTON_OUTLINE_LABEL}>{ProfileType.label}</Text>
				</TouchableOpacity> */}
		</View>
	)
	const renderPicUsername = () => (
		<View style={styles.STEP_CONTAINER}>
			<Text style={styles.STEP_TITLE}>Set up your profile</Text>
			<View style={styles.LINE} />
			<Text style={styles.STEP_SUB_TITLE}>*Required fields</Text>

			<TouchableOpacity
				onPress={() => selectImage('user_image')}
				style={styles.IMAGE_CONTAINER}
			>
				{!imageSource?.uri
					? <Image
						source={randomImages[RandonPic]}
						style={styles.IMAGE_BOX}
						resizeMode='contain'
					/>
					: <Image
						source={{ uri: imageSource.uri }
						}
						style={styles.IMAGE_BOX}
					/>
				}
			</TouchableOpacity>
			<Text style={styles.IMAGE_BOX_LABEL}>Upload profile picture</Text>
			<Text style={styles.IMAGE_BOX_VALIDATION}>(Max 200 MB / .jpeg, .jpg, .png)</Text>
			<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
				<Text style={styles.INPUT_LABEL_STYLE}>USER NAME*</Text>
				<Text style={styles.INPUT_LABEL_ERROR}>{UsernameError ? UsernameErrorMsg : ''}</Text>
			</View>
			<View style={UsernameError ? styles.INPUT_STYLE_CONTAINER_ERROR : styles.INPUT_STYLE_CONTAINER}>
				<TextInput
					style={styles.INPUT_STYLE}
					onChangeText={t => setUsername(t)}
					value={Username?.charAt(0) === '@' ? Username : '@' + (Username || '')}
					placeholder={'@username'}
				/>
			</View>
		</View>
	)
	const renderName = () => (
		<View style={styles.STEP_CONTAINER}>
			<Text style={styles.STEP_TITLE}>Personal details</Text>
			<View style={styles.LINE} />
			<Text style={styles.STEP_SUB_TITLE}>We use your personal details to set up your Currents wallet. Don’t worry, this information is not shared publicy!</Text>
			<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
				<Text style={styles.INPUT_LABEL_STYLE}>FIRST NAME</Text>
			</View>
			<View style={styles.INPUT_STYLE_CONTAINER}>
				<TextInput
					style={styles.INPUT_STYLE}
					onChangeText={t => setName(t)}
					value={Name}
					placeholder={'First name'}
				/>
			</View>
			<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
				<Text style={styles.INPUT_LABEL_STYLE}>LAST NAME</Text>
			</View>
			<View style={styles.INPUT_STYLE_CONTAINER}>
				<TextInput
					style={styles.INPUT_STYLE}
					onChangeText={t => setLastName(t)}
					value={LastName}
					placeholder={'Last name'}
				/>
			</View>
		</View>
	)
	const renderPicBName = () => (
		<View style={styles.STEP_CONTAINER}>
			<Text style={styles.STEP_TITLE}>Set up your profile</Text>
			<View style={styles.LINE} />
			<Text style={styles.STEP_SUB_TITLE}>*Required fields</Text>
			<View style={styles.BUSINESS_IMAGES_CONTAINER}>
				<TouchableOpacity
					onPress={() => selectImage('business_back')}
					style={styles.BACK_IMAGE_CONTAINER}
				>
					{!BackBusinessImageSource?.uri
						? <Image
							source={randomImages[4 - RandonPic]}
							style={styles.IMAGE_BOX}
							resizeMode='contain'
						/>
						: <Image
							source={{ uri: BackBusinessImageSource.uri }
							}
							style={styles.BACK_IMAGE_BOX}
						/>
					}
				</TouchableOpacity>
				<View style={styles.IMAGE_CONTAINER_MARGIN}>
					<TouchableOpacity
						onPress={() => selectImage('business')}
						style={styles.IMAGE_CONTAINER}
					>
						{!BusinessImageSource?.uri
							? <Image
								source={randomImages[4 - RandonPic]}
								style={styles.IMAGE_BOX}
								resizeMode='contain'
							/>
							: <Image
								source={{ uri: BusinessImageSource.uri }
								}
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
			<View style={styles.INPUT_STYLE_CONTAINER}>
				<TextInput
					style={styles.INPUT_STYLE}
					onChangeText={t => {
						setBusinessName(t)
						if (t !== '') setButtonDisabled(false)
					}}
					value={BusinessName}
					placeholder={'Business name'}
				/>
			</View>

			<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
				<Text style={styles.INPUT_LABEL_STYLE}>TELL US YOUR STORY (50 WORDS MAX)</Text>
			</View>
			<View style={styles.BIG_INPUT_STYLE_CONTAINER}>
				<TextInput
					style={styles.BIG_INPUT_STYLE}
					onChangeText={t => setBusinessStory(t)}
					value={BusinessStory}
					multiline
					numberOfLines={4}
					scrollEnabled={false}
					placeholder={'Business name'}
				/>
			</View>
		</View>
	)
	const renderBusinessType = () => (
		<View style={styles.STEP_CONTAINER}>
			<Text style={styles.STEP_TITLE}>Business details</Text>
			<View style={styles.LINE} />
			<Text style={styles.STEP_SUB_TITLE}>We use your business information to set up your wallet. The type of entity determines the required information. </Text>

			<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
				<Text style={styles.INPUT_LABEL_STYLE}>TYPE OF BUSINESS</Text>
			</View>
			<View style={SelectOpen ? styles.SELECT_INPUT_STYLE_CONTAINER_OPEN : styles.SELECT_INPUT_STYLE_CONTAINER}>
				<TouchableOpacity style={styles.SELECT_ICON} onPress={() => [setSelectOpen(!SelectOpen), setBusinessType('')]}>
					<Text style={styles.SELECT_LABEL}>{BusinessType !== '' ? BusinessType : 'Select'}</Text>
					<Entypo name={SelectOpen ? "chevron-up" : "chevron-down"} size={23} color={'black'} style={{ marginRight: 20 }} />
				</TouchableOpacity>
				{SelectOpen && businessTypes.map((t, key) => (
					<TouchableOpacity key={key + 'btype'} style={styles.SELECT_ICON} onPress={() => [setSelectOpen(!SelectOpen), setBusinessType(t)]}>
						<Text style={styles.SELECT_LABEL}>{t}</Text>
					</TouchableOpacity>
				))}
			</View>

			<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
				<Text style={styles.INPUT_LABEL_STYLE}>INSTAGRAM LINK</Text>
			</View>
			<View style={styles.INPUT_STYLE_CONTAINER}>
				<TextInput
					style={styles.INPUT_STYLE}
					onChangeText={t => setInstagramLink(t)}
					value={InstagramLink}
					placeholder={'Instagram Link'}
				/>
			</View>
			<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
				<Text style={styles.INPUT_LABEL_STYLE}>FACEBOOK LINK</Text>
			</View>
			<View style={styles.INPUT_STYLE_CONTAINER}>
				<TextInput
					style={styles.INPUT_STYLE}
					onChangeText={t => setFacebookLink(t)}
					value={FacebookLink}
					placeholder={'Facebook Link'}
				/>
			</View>
			<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
				<Text style={styles.INPUT_LABEL_STYLE}>TWITTER LINK</Text>
			</View>
			<View style={styles.INPUT_STYLE_CONTAINER}>
				<TextInput
					style={styles.INPUT_STYLE}
					onChangeText={t => setTwitterLink(t)}
					value={TwitterLink}
					placeholder={'Twitter Link'}
				/>
			</View>
		</View>
	)
	const renderbusinessExec = () => (
		<View style={styles.STEP_CONTAINER}>
			<Text style={styles.STEP_TITLE}>Business owner details</Text>
			<View style={styles.LINE} />
			<Text style={styles.STEP_SUB_TITLE}>We use your personal details to set up your BerkShares wallet. Don’t worry, this information is not shared publicy!</Text>
			<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
				<Text style={styles.INPUT_LABEL_STYLE}>FIRST NAME OF THE BUSINESS OWNER OR EXECUTIVE</Text>
			</View>
			<View style={styles.INPUT_STYLE_CONTAINER}>
				<TextInput
					style={styles.INPUT_STYLE}
					onChangeText={t => setBusinessExecName(t)}
					value={BusinessExecName}
					placeholder={'First name'}
				/>
			</View>
			<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
				<Text style={styles.INPUT_LABEL_STYLE}>LAST NAME OF THE BUSINESS OWNER OR EXECUTIVE</Text>
			</View>
			<View style={styles.INPUT_STYLE_CONTAINER}>
				<TextInput
					style={styles.INPUT_STYLE}
					onChangeText={t => setBusinessExecLastName(t)}
					value={BusinessExecLastName}
					placeholder={'Last name'}
				/>
			</View>
		</View>
	)
	const renderbusinessData = () => (
		<View style={styles.STEP_CONTAINER}>
			<Text style={styles.STEP_TITLE}>Business information</Text>
			<View style={styles.LINE} />
			<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
				<Text style={styles.INPUT_LABEL_STYLE}>REGISTRED BUSINESS NAME</Text>
			</View>
			<View style={styles.INPUT_STYLE_CONTAINER}>
				<TextInput
					style={styles.INPUT_STYLE}
					onChangeText={t => setBusinessRegName(t)}
					value={BusinessRegName}
					placeholder={'Registered business name'}
				/>
			</View>
			<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
				<Text style={styles.INPUT_LABEL_STYLE}>INDUSTRY</Text>
			</View>
			<View style={SelectIndustryOpen ? styles.SELECT_INPUT_STYLE_CONTAINER_OPEN : styles.SELECT_INPUT_STYLE_CONTAINER}>
				<TouchableOpacity style={styles.SELECT_ICON} onPress={() => [setSelectIndustryOpen(!SelectIndustryOpen), setBusinessIndustryType('')]}>
					<Text style={styles.SELECT_LABEL}>{BusinessIndustryType !== '' ? BusinessIndustryType : 'Select'}</Text>
					<Entypo name={SelectIndustryOpen ? "chevron-up" : "chevron-down"} size={23} color={'black'} style={{ marginRight: 20 }} />
				</TouchableOpacity>
				{SelectIndustryOpen && industryTypes.map((t, key) => (
					<TouchableOpacity key={key + 'itype'} style={styles.SELECT_ICON} onPress={() => [setSelectIndustryOpen(!SelectIndustryOpen), setBusinessIndustryType(t)]}>
						<Text style={styles.SELECT_LABEL}>{t}</Text>
					</TouchableOpacity>
				))}
			</View>

			<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
				<Text style={styles.INPUT_LABEL_STYLE}>{`
IDENTIFICATION NUMBER (ENTER ONE)
*Choose SSN only if you do not have an EIN.*
				`}</Text>
			</View>
			<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
				<Text style={styles.INPUT_LABEL_STYLE}>{'Employer Identification Number (EIN)'}</Text>
				<TouchableOpacity style={styles.CHECK_OUTSIDE} onPress={() => setIndentifierType('EIN')}>
					{IndentifierType === 'EIN' && <View style={styles.CHECK_INSIDE} />}
				</TouchableOpacity>
			</View>
			<MaskInput
				value={EmployerId}
				mask={[/\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
				name="ein"
				placeholder="XX-XXXXXXX"
				keyboardType="number-pad"
				onChange={(masked, unmasked) => setEmployerId(unmasked)}
				style={styles.INPUT_STYLE_CONTAINER}
				editable={IndentifierType === 'EIN'}
			/>
			<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
				<Text style={styles.INPUT_LABEL_STYLE}>{'Social Security Number (SSN)'}</Text>
				<TouchableOpacity style={styles.CHECK_OUTSIDE} onPress={() => setIndentifierType('SSN')}>
					{IndentifierType === 'SSN' && <View style={styles.CHECK_INSIDE} />}
				</TouchableOpacity>
			</View>
			<MaskInput
				value={SocialSecurityNumber}
				mask={[/\d/, /\d/, /\d/, "-", /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/]}
				name="ssn"
				placeholder="XXX-XX-XXXX"
				keyboardType="number-pad"
				onChange={(masked, unmasked) => setSocialSecurityNumber(unmasked)}
				style={styles.INPUT_STYLE_CONTAINER}
				editable={IndentifierType === 'SSN'}
			/>
		</View>
	)
	const renderbusinessAddresss = () => (
		<View style={styles.STEP_CONTAINER}>
			<Text style={styles.STEP_TITLE}>Business information</Text>
			<View style={styles.LINE} />
			<Text style={styles.STEP_SUB_TITLE}>Where can customers find you?</Text>
			<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
				<Text style={styles.INPUT_LABEL_STYLE}>ADDRESS 1</Text>
			</View>
			<View style={styles.INPUT_STYLE_CONTAINER}>
				<TextInput
					style={styles.INPUT_STYLE}
					onChangeText={t => setAddress1(t)}
					value={Address1}
					placeholder={'Street number, street name'}
				/>
			</View>
			<TouchableOpacity onPress={() => [setShowMapInputModal(true), setMapInputAddress(1)]} style={styles.INPUT_LABEL_BOTTON_STYLE_CONTAINER}>
				<Text style={styles.INPUT_LABEL_LINK_STYLE}>SET ON MAP</Text>
			</TouchableOpacity>


			<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
				<Text style={styles.INPUT_LABEL_STYLE}>ADDRESS 2</Text>
			</View>
			<View style={styles.INPUT_STYLE_CONTAINER}>
				<TextInput
					style={styles.INPUT_STYLE}
					onChangeText={t => setAddress2(t)}
					value={Address2}
					placeholder={'Street number, street name'}
				/>
			</View>
			<TouchableOpacity onPress={() => [setShowMapInputModal(true), setMapInputAddress(2)]} style={styles.INPUT_LABEL_BOTTON_STYLE_CONTAINER}>
				<Text style={styles.INPUT_LABEL_LINK_STYLE}>SET ON MAP</Text>
			</TouchableOpacity>

			<View style={styles.SELECTS_CONTAINER}>
				<View style={styles.CONTAINER}>
					<View style={[styles.INPUT_LABEL_STYLE_CONTAINER, { width: METRICS.screenWidth * 0.65 }]}>
						<Text style={styles.INPUT_LABEL_STYLE}>CITY</Text>
					</View>
					<TouchableOpacity
						style={[styles.INPUT_STYLE_CONTAINER, { width: METRICS.screenWidth * 0.65, justifyContent: 'flex-end' }]}
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
					<View style={[
						styles.SELECT_INPUT_STYLE_CONTAINER,
						{ width: METRICS.screenWidth * 0.25 }
					]}>
						<TouchableOpacity
							style={[styles.SELECT_ICON, { width: METRICS.screenWidth * 0.2, justifyContent: 'flex-end' }]}
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
			</View>



			<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
				<Text style={styles.INPUT_LABEL_STYLE}>POSTAL CODE</Text>
			</View>
			<View style={styles.INPUT_STYLE_CONTAINER}>
				<TextInput
					style={styles.INPUT_STYLE}
					onChangeText={t => setPostalCode(t)}
					value={PostalCode}
					placeholderTextColor='gray'
					placeholder={'xxxxxxxxx'}
				/>
			</View>

			<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
				<Text style={styles.INPUT_LABEL_STYLE}>PHONE NUMBER</Text>
			</View>
			<View style={styles.INPUT_STYLE_CONTAINER}>
				<TextInput
					style={styles.INPUT_STYLE}
					onChangeText={t => setPhoneNumber(t)}
					value={PhoneNumber}
					placeholder={'Phone number'}
				/>
			</View>




		</View>
	)

	const mapInputModal = () => (
		<Modal visible={ShowMapInputModal}>
			<View style={styles.MAPS_CONTAINER}>
				{MapInputAddress === 1
					? <View style={styles.INPUT_STYLE_CONTAINER}>
						<TextInput
							style={styles.INPUT_STYLE}
							onChangeText={t => setAddress1(t)}
							value={Address1}
							placeholder={'Street number, street name'}
						/>
					</View>
					: <View style={styles.INPUT_STYLE_CONTAINER}>
						<TextInput
							style={styles.INPUT_STYLE}
							onChangeText={t => setAddress2(t)}
							value={Address2}
							placeholder={'Street number, street name'}
						/>
					</View>
				}
				<Button
					onPress={() => setShowMapInputModal(false)}
					buttonLabel={'Confirm Address'}
					buttonStyle={[styles.SUBMIT_BUTTON, { marginTop: 20 }]}
				/>
				<MapView
					// provider={PROVIDER_GOOGLE} // remove if not using Google Maps
					style={styles.MAP}
					showsUserLocation
					loadingEnabled
					zoomEnabled
					zoomControlEnabled
					initialRegion={Region}
				>
					<Marker
						draggable
						onDragEnd={e => {
							setLatitud(e?.nativeEvent?.coordinate?.latitude)
							setLongitud(e?.nativeEvent?.coordinate?.longitude)
							MapInputAddress === 1
								? setAddress1(`${e?.nativeEvent?.coordinate?.latitude}, ${e?.nativeEvent?.coordinate?.longitude}`)
								: setAddress2(`${e?.nativeEvent?.coordinate?.latitude}, ${e?.nativeEvent?.coordinate?.longitude}`)
						}}
						coordinate={{ latitude: Latitud, longitude: Longitud }}
					/>
				</MapView>
			</View>
		</Modal>
	)
	const confirmLogoutModal = () => (
		<Modal visible={ShowConfirmLogoutModal} transparent>
			<TouchableWithoutFeedback onPress={() => setShowConfirmLogoutModal(false)}>
				<View style={styles.ROOT_MODAL}>
					<View style={styles.MODAL_CONTENT}>
						<Text style={styles.STEP_TITLE_BLACK}>Are you sure you want to log out?</Text>
						<Text style={styles.STEP_SUB_TITLE_MODAL}>Please note that unsaved data will be lost.</Text>
						<TouchableOpacity
							style={styles.MODAL_BUTTON}
							onPress={() => [navigation.navigate("splash", {}), loginStore.setApiToken(null), setShowConfirmLogoutModal(false)]}>
							<Text style={styles.SUBMIT_BUTTON_LABEL}>Log out</Text>
						</TouchableOpacity>
					</View>

				</View>
			</TouchableWithoutFeedback>
		</Modal>
	)
	const thankyouModal = () => (
		<Modal visible={ShowThankyouModal} transparent>
			<View style={styles.THANK_MODAL}>

				<Text style={[styles.STEP_TITLE, { marginTop: 80 }]}>Thank you! Welcome to the Currents App. Now it is time to add some Currents to your wallet!</Text>
				<View style={styles.CONTAINER}>
					<Text onPress={() => [setShowThankyouModal(false), navigation.navigate("home", {})]} style={[styles.NEED_HELP_LINK, { marginBottom: 100 }]}>Skip for now</Text>
					<Button
						// onPress={() => nextButtonHandler()}
						buttonLabel={'Link my personal bank account'}
						buttonStyle={styles.SUBMIT_BUTTON}
					/>
				</View>
			</View>
		</Modal>
	)

	const backButtonHandler = () => {
		switch (Step) {
			case 'profile_type':
				navigation.navigate("home", {})
				break;
			case 'pic_username':
				setStep('profile_type')
				break;
			case 'name':
				setStep('pic_username')
				break;
			case 'pic_bname':
				setStep('profile_type')
				break;
			case 'business_type':
				setStep('pic_bname')
				break;
			case 'business_exec':
				setStep('business_type')
				break;
			case 'business_data':
				setStep('business_exec')
				break;
			case 'business_addresss':
				setStep('business_data')
				break;
		}
	}
	const nextButtonHandler = () => {
		const setupData = {
			Username,
			imageSource,
			Name,
			LastName,
			BusinessName,
			BusinessStory,
			BusinessType,
			BusinessExecName,
			BusinessExecLastName,
			BusinessImageSource,
			BackBusinessImageSource,
			BusinessRegName,
			BusinessIndustryType,
			IndentifierType,
			EmployerId,
			SocialSecurityNumber,
			Address1,
			Address2,
			City,
			State,
			PostalCode,
			PhoneNumber,
		}
		// city and state picker || map
		loginStore.setSetupData(setupData)
		switch (Step) {
			case 'profile_type':
				setStep(ProfileType.first_step)
				break;
			case 'pic_username':
				setupConsumer()
				break;
			case 'name':
				setupConsumerDetail()
				break;
			case 'pic_bname':
				setupMerchant() // TODO: uncomment 
				// setStep('business_type') // TODO: comment
				break;
			case 'business_type':
				setupMerchantDetail() // TODO: uncomment 
				// setStep('business_exec') // TODO: comment
				break;
			case 'business_exec':
				setStep('business_data')
				break;
			case 'business_data':
				setStep('business_addresss')
				break;
			case 'business_addresss':
				setupMerchantDetailComplete()
				break;

		}
	}

	useEffect(() => {
		loginStore.setRandomProfilePictureIndex(RandonPic)

		Geolocation.getCurrentPosition(
			({ coords: { latitude, longitude } }) => {
				const location = {
					latitude,
					longitude,
					latitudeDelta: 0.1,
					longitudeDelta: 0.09,
				}
				setRegion(location)
				setLatitud(location.latitude)
				setLongitud(location.longitude)
			},
			console.warn,
			{ enableHighAccuracy: true, timeout: 5000, maximumAge: 10000 }
		)

		const data = loginStore.getSetupData

		console.log(' useEffect ===>>>> ', JSON.stringify(props, null, 2), JSON.stringify(data, null, 2))
		setProfileType(props?.params?.profile_type || profileTypes[1])
		if (data?.Username) {
			setUsername(data.Username)
			setButtonDisabled(false)
		}
		if (data?.imageSource) setImageSource(data.imageSource)
		if (data?.Name) setName(data.Name)
		if (data?.LastName) setLastName(data.LastName)
		if (data?.BusinessName) {
			setBusinessName(data.BusinessName)
			setButtonDisabled(false)
		}
		if (data?.BusinessStory) setBusinessStory(data.BusinessStory)
		if (data?.BusinessType) setBusinessType(data.BusinessType)
		if (data?.BusinessExecName) setBusinessExecName(data.BusinessExecName)
		if (data?.BusinessExecLastName) setBusinessExecLastName(data.BusinessExecLastName)
		if (data?.BusinessImageSource) setBusinessImageSource(data.BusinessImageSource)
		if (data?.BackBusinessImageSource) setBackBusinessImageSource(data.BackBusinessImageSource)
		if (data?.BusinessRegName) setBusinessRegName(data.BusinessRegName)
		if (data?.BusinessIndustryType) setBusinessIndustryType(data.BusinessIndustryType)
		if (data?.IndentifierType) setIndentifierType(data.IndentifierType)
		if (data?.EmployerId) setEmployerId(data.EmployerId)
		if (data?.SocialSecurityNumber) setSocialSecurityNumber(data.SocialSecurityNumber)
		if (data?.Address1) setAddress1(data.Address1)
		if (data?.Address2) setAddress2(data.Address2)
		if (data?.City) setCity(data.City)
		if (data?.State) setState(data.State)
		if (data?.PostalCode) setPostalCode(data.PostalCode)
		if (data?.PhoneNumber) setPhoneNumber(data.PhoneNumber)

		fetchCity()
		fetchState()
	}, [])

	// useEffect(() => {
	// 	Geolocation.getCurrentPosition(
	// 		({ coords: { latitude, longitude } }) => {
	// 			const location = {
	// 				latitude,
	// 				longitude,
	// 				latitudeDelta: 0.1,
	// 				longitudeDelta: 0.09,
	// 			}
	// 			setRegion(location)
	// 			setLatitud(location.latitude)
	// 			setLongitud(location.longitude)
	// 		},
	// 		console.warn,
	// 		{ enableHighAccuracy: true, timeout: 5000, maximumAge: 10000 }
	// 	)
	// })

	return (
		<Screen
			showHeader
			preset="scroll"
			statusBar={'dark-content'}
			unsafe={true}
		>
			<View style={styles.ROOT_CONTAINER}>
				<View style={styles.CONTAINER}>
					<View style={styles.HEADER_ACTIONS}>
						<TouchableOpacity onPress={() => backButtonHandler()} style={styles.BACK_BUTON_CONTAINER}>
							<Icon name={"arrow-back"} size={23} color={'black'} />
							<Text style={styles.BACK_BUTON_LABEL}>{` Back`}</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => setShowConfirmLogoutModal(true)} style={styles.BACK_BUTON_CONTAINER}>
							<Text style={styles.BACK_BUTON_LABEL}>{`Log out`}</Text>
						</TouchableOpacity>
					</View>
					{renderStep()}
				</View>
			</View>
			{mapInputModal()}
			{confirmLogoutModal()}
			{thankyouModal()}
			<Button
				disabled={ButtonDisabled || Loading}
				onPress={() => nextButtonHandler()}
				loading={Loading}
				buttonLabel={Step === 'business_exec'
					? 'Confirm'
					: Step === 'profile_type'
						? 'Sign up your business'
						: 'Next'
				}
				buttonStyle={(ButtonDisabled || Loading) ? styles.SUBMIT_BUTTON_DISABLED : styles.SUBMIT_BUTTON}
			/>
		</Screen>
	)
})
