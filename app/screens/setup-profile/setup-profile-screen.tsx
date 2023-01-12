//290 238 243 169
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
	TextInput,
	View,
	TouchableOpacity,
	Image,
	Modal,
	TouchableWithoutFeedback,
	Platform,
	KeyboardAvoidingView,
	ScrollView
} from 'react-native';
import {
	Text,
	Button,
	Screen,
	ModalSelector,
	MaskInput
} from '../../components';
import Icon from "react-native-vector-icons/MaterialIcons"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import styles from './setup-profile-style';
import { useIsFocused, useNavigation } from "@react-navigation/native"
import { launchImageLibrary } from 'react-native-image-picker';
import { IMAGES, METRICS, COLOR } from "../../theme"
import Entypo from "react-native-vector-icons/Entypo"
import { useStores } from "../../models"
import {Masks} from "react-native-mask-input";
import { getErrorMessage, getImageFileFromSource, notifyMessage } from "../../utils/helpers"


// const steps_user = ['pic_username', 'name']
// const steps_business = ['pic_bname', 'business_type', 'business_exec', 'business_data', 'business_addresss']
const randomImages = [IMAGES.avBass, IMAGES.avBee, IMAGES.avBird, IMAGES.avSalamander]
const profileTypes = [
	{
		label: 'Personal',
		value: 'personal',
		first_step: 'pic_username'
	},
	{
		label: 'Business and personal',
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

export const SetupProfileScreen = observer(function SetupProfileScreen() {
	const rootStore = useStores()
	const navigation = useNavigation()
	const { loginStore } = rootStore
	const isFocused = useIsFocused();
	const [Loading, setLoading] = useState(false)

	const [Step, setStep] = useState('profile_type')
	const [ButtonDisabled, setButtonDisabled] = useState(false)
	const [ShowConfirmLogoutModal, setShowConfirmLogoutModal] = useState(false)
	const [ShowThankyouModal, setShowThankyouModal] = useState(false)

	const [ProfileType, setProfileType] = useState('personal')
	const [RandonPic, setRandonPic] = useState(Math.round(Math.random() * 3))

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
	// const [Citys, setCitys] = React.useState([]);
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

	// const fetchCity = (data?: string) => {
	// 	loginStore.environment.api.getCities({ value: data })
	// 		.then((result: any) => {
	// 			result?.data?.results && setCitys(result.data.results.map(r => ({ id: r.city_id, title: r.city_name })))
	// 		})
	// }
	const fetchState = (data?: string) => {
		loginStore.environment.api.getStates({ value: data })
			.then((result: any) => {
				result?.data?.results && setStates(result.data.results.map(r => ({ id: r.state_id, title: r.state_name })))
			})
	}

	const setupConsumer = () => {
		setLoading(true)
		setUsernameErrorMsg("")
		setUsernameError(false)
		const pic = getImageFileFromSource(imageSource)
		const keys = imageSource === null ? [] : ["consumer_profile"]
		const data = imageSource === null ? { username: Username } : { username: Username, consumer_profile: pic }
		loginStore.environment.api.setupConsumerFirstStep(data, keys).then((result: any) => {
			setLoading(false)
			if (result.kind === "ok") {
				setUsername('')
				setImageSource(null)
				setName('')
				setLastName('')
				setStep("name")
			} else if (result.kind === "bad-data") {
				const errors = result?.errors
				if (errors?.username) {
					setUsernameError(true)
					setUsernameErrorMsg(errors?.username)
				}
				notifyMessage(getErrorMessage(errors))
			} else if (result.kind === "unauthorized") {
				loginStore.reset()
				navigation.navigate("login")
			} else {
				notifyMessage(null)
			}
		}).catch((error) => {
			console.log(error)
			notifyMessage(null)
		})
	}
	const setupConsumerDetail = () => {
		setLoading(true)
		loginStore.environment.api.setupConsumerSecondStep({
			first_name: Name,
			last_name: LastName
		}).then((result: any) => {
			setLoading(false)
			if (result.kind === "ok") {
				setShowThankyouModal(true);
				setStep('profile_type');
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
	const setupMerchant = () => {
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
		const data = {
			business_name: BusinessName,
			profile_picture: BusinessImageSource?.uri ? profPic : null,
			background_picture: BackBusinessImageSource?.uri ? backPic : null,
			business_story: BusinessStory
		}
		const keys = BusinessImageSource?.uri === null ? [] : ["profile_picture"]
		if (BackBusinessImageSource?.uri !== null) keys.push("background_picture")
		setLoading(true)
		loginStore.environment.api.setupMerchant(data, keys)
			.then((result: any) => {
				if (result.kind === "ok") {
					setBusinessName('')
					setBusinessStory('')
					setStep('business_type')
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
			}).finally(() => 	setLoading(false))
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
					navigation.navigate("login")
				} else {
					notifyMessage(null)
				}
			})
	}
	const setupMerchantDetailComplete = () => {
		const phoneNumber = PhoneNumber !== '' ? `+1${PhoneNumber}` : ''
		setLoading(true)
		loginStore.environment.api.setupMerchantDetail({
			registered_business_name: BusinessRegName,
			industry: BusinessIndustryType,
			employer_identification_number: IndentifierType === 'EIN' ? EmployerId : '',
			social_security_number: IndentifierType === 'SSN' ? SocialSecurityNumber : '',
			owner_first_name: BusinessExecName,
			owner_last_name: BusinessExecLastName,
			address_1: Address1,
			address_2: Address2,
			city: City,
			instagram: InstagramLink,
			facebook: FacebookLink,
			twitter: TwitterLink,
			zip_code: PostalCode,
			phone_number: phoneNumber
		})
			.then((result: any) => {
				setLoading(false)
				if (result.kind === "ok") {
					loginStore.setSelectedAccount('merchant')
					setShowThankyouModal(true)
					loginStore.setSetupData({});
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

	const renderStep = () => {
		let render
		switch (Step) {
			// consumer
			case 'profile_type':
				render = renderSelectBusinessType()
				break
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
				break;
		}
		return render
	}

	const renderSelectBusinessType = () => (
		<View style={styles.STEP_CONTAINER}>
			<Text style={styles.STEP_TITLE}>Hi</Text>
			<View style={styles.LINE} />
			<Text style={styles.STEP_SUB_TITLE}>Select the profile you’d like to create. If you’re a business owner, you can automatically set up a personal profile. You can have one account login with two profiles.</Text>
			{profileTypes.map((t, key) => {
				return (loginStore.ProfileDataBusiness.business_name !== '' && loginStore.ProfileDataBusiness.business_name !== null && t.value === 'business_personal')
					? null
					: <TouchableOpacity key={key + '_ptype'} style={styles.SUBMIT_BUTTON_OUTLINE} onPress={() => [setProfileType(t.value), setStep(t.first_step)]}>
						<Text style={styles.SUBMIT_BUTTON_OUTLINE_LABEL}>{t.label}</Text>
					</TouchableOpacity>
			})}
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
					placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
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
			<View style={styles.INPUT_STYLE_CONTAINER}>
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
					placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
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
					placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
					style={styles.BIG_INPUT_STYLE}
					onChangeText={t => setBusinessStory(t)}
					value={BusinessStory}
					multiline
					scrollEnabled={false}
					numberOfLines={4}
					placeholder={'Tell the world about your business. What gives you joy as an entrepreneur?'}
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
					placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
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
					placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
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
					placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
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
					placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
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
					placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
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
					placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
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
			<View style={styles.INPUT_STYLE_CONTAINER}>
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
					<View
						style={[styles.INPUT_STYLE_CONTAINER, { width: METRICS.screenWidth * 0.65 }]}
					>
							<TextInput
							placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
							style={[styles.INPUT_STYLE, { width: METRICS.screenWidth * 0.60 }]}
							onChangeText={t => setCity(t)}
							value={City}
							placeholder={'City'}
						/>
						{/* <ModalSelector
							options={Citys}
							action={setCity}
							title={""}
							value={City}
							visible={SelectCityOpen}
							setVisible={setSelectCityOpen}
							displaySelector
							closeOnClick
							searchAction={fetchCity}
						/> */}
					</View>
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
							style={[styles.SELECT_ICON, { width: METRICS.screenWidth * 0.2 }]}
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
				style={styles.INPUT_STYLE_CONTAINER}
			/>
		</View>
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
							onPress={() => [navigation.navigate("splash"), loginStore.setApiToken(null), setShowConfirmLogoutModal(false)]}>
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
					<Text onPress={() => [setShowThankyouModal(false), navigation.navigate("home")]} style={[styles.NEED_HELP_LINK, { marginBottom: 100 }]}>Skip for now</Text>
					<Button
						// onPress={() => nextButtonHandler()}
						buttonLabel={`Link my ${loginStore.getSelectedAccount === 'consumer' ? 'personal' : 'business'} bank account`}
						buttonStyle={styles.SUBMIT_BUTTON}
					/>
				</View>
			</View>
		</Modal>
	)

	const backButtonHandler = () => {
		switch (Step) {
			case 'profile_type':
				if (loginStore.isLoggedIn) {
					navigation.navigate("home")
				} else {
					navigation.navigate("login")
				}
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
			case 'pic_username':
				setupConsumer()
				// setStep('name')
				break;
			case 'name':
				setupConsumerDetail()
				break;
			case 'pic_bname':
				setupMerchant()
				break;
			case 'business_type':
				setupMerchantDetail()
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
		if (isFocused) {
			loginStore.setRandomProfilePictureIndex(RandonPic)

			const data = loginStore.getSetupData
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

			// fetchCity()
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
			<View style={styles.HEADER_ACTIONS}>
				{Step !== 'profile_type'
					? <TouchableOpacity onPress={() => backButtonHandler()} style={styles.BACK_BUTON_CONTAINER}>
						<Icon name={"arrow-back"} size={23} color={'black'} />
						<Text style={styles.BACK_BUTON_LABEL}>{` Back`}</Text>
					</TouchableOpacity>
					: <View style={styles.BACK_BUTON_CONTAINER} />
				}
				<TouchableOpacity onPress={() => setShowConfirmLogoutModal(true)} style={styles.BACK_BUTON_CONTAINER}>
					<Text style={styles.BACK_BUTON_LABEL}>{`Log out`}</Text>
				</TouchableOpacity>
			</View>
			<KeyboardAvoidingView enabled style={styles.ROOT}>
				<ScrollView showsVerticalScrollIndicator={false} bounces={false}>
					<View style={styles.ROOT_CONTAINER}>
						<View style={styles.CONTAINER}>
							{renderStep()}
						</View>
					</View>
					{confirmLogoutModal()}
					{thankyouModal()}
				</ScrollView>
			</KeyboardAvoidingView>
			{Step !== 'profile_type' &&
				<Button
					disabled={ButtonDisabled || Loading}
					onPress={() => nextButtonHandler()}
					loading={Loading}
					buttonLabel={Step === 'business_exec' ? 'Confirm' : 'Next'}
					buttonStyle={(ButtonDisabled || Loading) ? styles.SUBMIT_BUTTON_DISABLED : styles.SUBMIT_BUTTON}
				/>
			}
		</Screen>
	)
})
