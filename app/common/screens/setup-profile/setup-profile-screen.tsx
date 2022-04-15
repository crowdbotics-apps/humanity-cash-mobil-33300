import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { TextInput, View, TouchableOpacity, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import {
	Text,
	Button,
	Screen,
	Checkbox
} from '../../components';
import Icon from "react-native-vector-icons/MaterialIcons"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import styles from './setup-profile-style';
import { COLOR, TYPOGRAPHY } from '../../theme';
import { StackActions, useNavigation } from "@react-navigation/native"
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { IMAGES } from "../../theme"

const steps_user = ['pic_username', 'name']
const steps_business = ['pic_bname', 'business_type', 'business_exec', 'business_data', 'business_addresss']
const profile_types = [
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

export const SetupProfileScreen = observer(function SetupProfileScreen() {
	const navigation = useNavigation()

	const [Step, setStep] = useState('profile_type')
	const [ButtonDisabled, setButtonDisabled] = useState(true)
	const [ShowConfirmLogoutModal, setShowConfirmLogoutModal] = useState(false)
	const [ShowThankyouModal, setShowThankyouModal] = useState(false)

	const [ProfileType, setProfileType] = useState('personal')

	// personal
	const [Username, setUsername] = useState('')
	const [imageSource, setImageSource] = React.useState<any>(null);
	const [UsernameError, setUsernameError] = useState(false)
	const [Name, setName] = useState('')
	const [LastName, setLastName] = useState('')

	function selectImage() {
		let options = {
			mediaType: 'photo',
			maxWidth: 300,
			maxHeight: 550,
			quality: 1,
			includeBase64: true,
		};

		launchImageLibrary(options, (response: any) => {
			if (response.didCancel) {
				return;
			} else if (response.errorCode == 'camera_unavailable') {
				return;
			} else if (response.errorCode == 'permission') {
				return;
			} else if (response.errorCode == 'others') {
				return;
			}
			setImageSource(response.assets[0]);
		});
	}

	const renderStep = () => {
		let render
		switch (Step) {
			case 'pic_username':
				render = renderPicUsername()
				break;
			case 'name':
				render = renderName()
				break;
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
			<Text style={styles.STEP_TITLE}>Hi XXX</Text>
			<View style={styles.LINE} />
			<Text style={styles.STEP_SUB_TITLE}>Select the profile you’d like to create. If you’re a business owner, you can automatically set up a personal profile. You can have one account login with two profiles.</Text>
			{profile_types.map((t, key) => (
				<TouchableOpacity key={key + '_ptype'} style={styles.SUBMIT_BUTTON_OUTLINE} onPress={() => [setProfileType(t.value), setStep(t.first_step)]}>
					<Text style={styles.SUBMIT_BUTTON_OUTLINE_LABEL}>{t.label}</Text>
				</TouchableOpacity>
			))}
		</View>
	)
	const renderPicUsername = () => (
		<View style={styles.STEP_CONTAINER}>
			<Text style={styles.STEP_TITLE}>Set up your profile</Text>
			<View style={styles.LINE} />
			<Text style={styles.STEP_SUB_TITLE}>*Required fields</Text>

			<TouchableOpacity
				onPress={selectImage}
				style={styles.IMAGE_CONTAINER}
			>
				{!imageSource?.uri
					? <FontAwesome name={"camera"} size={23} color={'#39534440'} />
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
				<Text style={styles.INPUT_LABEL_ERROR}>{UsernameError ? 'SORRY, THAT NAME IS ALREADY TAKEN' : ''}</Text>
      </View>
			<View style={UsernameError ? styles.INPUT_STYLE_CONTAINER_ERROR : styles.INPUT_STYLE_CONTAINER}>
				<TextInput
					style={styles.INPUT_STYLE}
					onChangeText={t => {
						setUsername(t)
						if (t === '@rafa') {
							setUsernameError(true)
							setButtonDisabled(true)
						}
						else {
							setUsernameError(false)
							if (t.length > 1) setButtonDisabled(false)
							else setButtonDisabled(true)
						}
					}}
					value={Username.charAt(0) == '@' ? Username : '@' + Username}
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
				<Text style={styles.INPUT_LABEL_ERROR}>{UsernameError ? 'SORRY, THAT NAME IS ALREADY TAKEN' : ''}</Text>
      </View>
			<View style={UsernameError ? styles.INPUT_STYLE_CONTAINER_ERROR : styles.INPUT_STYLE_CONTAINER}>
				<TextInput
					style={styles.INPUT_STYLE}
					onChangeText={t => setName(t)}
					value={Name}
					placeholder={'First name'}
				/>
			</View>
			<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
        <Text style={styles.INPUT_LABEL_STYLE}>LAST NAME</Text>
				<Text style={styles.INPUT_LABEL_ERROR}>{UsernameError ? 'SORRY, THAT NAME IS ALREADY TAKEN' : ''}</Text>
      </View>
			<View style={UsernameError ? styles.INPUT_STYLE_CONTAINER_ERROR : styles.INPUT_STYLE_CONTAINER}>
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

			<TouchableOpacity
				onPress={selectImage}
				style={styles.IMAGE_CONTAINER}
			>
				{!imageSource?.uri
					? <FontAwesome name={"camera"} size={23} color={'#39534440'} />
					: <Image
						source={{ uri: imageSource.uri }
						}
						style={styles.IMAGE_BOX}
					/>
				}
			</TouchableOpacity>

			
		</View>
	)
	const renderBusinessType = () => (
		<View style={styles.STEP_CONTAINER}>
			<Text style={styles.STEP_TITLE}>TITLE</Text>
			<View style={styles.LINE} />
			<Text style={styles.STEP_SUB_TITLE}>SubTitle</Text>
		</View>
	)
	const renderbusinessExec = () => (
		<View style={styles.STEP_CONTAINER}>
			<Text style={styles.STEP_TITLE}>TITLE</Text>
			<View style={styles.LINE} />
			<Text style={styles.STEP_SUB_TITLE}>SubTitle</Text>
		</View>
	)
	const renderbusinessData = () => (
		<View style={styles.STEP_CONTAINER}>
			<Text style={styles.STEP_TITLE}>TITLE</Text>
			<View style={styles.LINE} />
			<Text style={styles.STEP_SUB_TITLE}>SubTitle</Text>
		</View>
	)
	const renderbusinessAddresss = () => (
		<View style={styles.STEP_CONTAINER}>
			<Text style={styles.STEP_TITLE}>TITLE</Text>
			<View style={styles.LINE} />
			<Text style={styles.STEP_SUB_TITLE}>SubTitle</Text>
		</View>
	)
	const confirmLogoutModal = () => (
		<Modal visible={ShowConfirmLogoutModal} transparent>
			<TouchableWithoutFeedback onPress={() => setShowConfirmLogoutModal(false)}>
				<View style={styles.ROOT_MODAL}>
					<View style={styles.MODAL_CONTENT}>
						<Text style={styles.STEP_TITLE_BLACK}>Are you sure you want to log out?</Text>
						<Text style={styles.STEP_SUB_TITLE_MODAL}>Please note that unsaved data will be lost.</Text>
						<TouchableOpacity style={styles.MODAL_BUTTON}>
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
				
						<Text style={[styles.STEP_TITLE, {marginTop: 80}]}>Thank you! Welcome to the Currents App. Now it is time to add some Currents to your wallet!</Text>
						<View>
						<Text onPress={() => [setShowThankyouModal(false), setStep('profile_type')]} style={styles.NEED_HELP_LINK}>Skip for now</Text>
							<TouchableOpacity style={styles.SUBMIT_BUTTON}>
								<Text style={styles.SUBMIT_BUTTON_LABEL}>Log out</Text>
							</TouchableOpacity>
						</View>
				</View>
		</Modal>
	)

	const backButtonHandler = () => {
		console.log('step')
		switch (Step) {
			case 'pic_username':
				setStep('profile_type')
				break;
			case 'name':
				setStep('pic_username')
				break;
			case 'verify_email':
				setStep('email')
				break;
			case 'help':
				setStep('verify_email')
				break;
			case 'email_confirmed':
				setStep('verify_email')
				break;
			case 'email_confirmed':
				setStep('verify_email')
				break;
			case 'touch_id':
				setStep('create_password')
				break;
		}
	}

	const nextButtonHandler = () => {
		switch (Step) {
			case 'pic_username':
				setStep('name')
				break;
			case 'name':
				setShowThankyouModal(true)
				break;
			case 'email_confirmed':
				setStep('create_password')
				break;
			case 'create_password':
				if (Pass !== PassConfirm) setMatchPassword(false)
				else { setMatchPassword(true), console.log('touch id'), navigation.navigate("setupProfile", {}) }
				// setStep('touch_id')
				break;
		}
	}

	return (
		<Screen
			// preset='scroll'
			preset="fixed"
			statusBar={'dark-content'}
			unsafe={true}
		>
			<View style={styles.ROOT}>
				<View>
					<View style={styles.HEADER_ACTIONS}>
						<TouchableOpacity onPress={() => backButtonHandler()} style={styles.BACK_BUTON_CONTAINER}>
							<Icon name={"arrow-back"} size={23} color={'#8B9555'} />
							<Text style={styles.BACK_BUTON_LABEL}>{` Back`}</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => setShowConfirmLogoutModal(true)} style={styles.BACK_BUTON_CONTAINER}>
							<Text style={styles.BACK_BUTON_LABEL}>{`Log out`}</Text>
						</TouchableOpacity>
					</View>
					{renderStep()}
				</View>


				<View>
					{Step !== 'profile_type' &&
						<TouchableOpacity
							disabled={ButtonDisabled}
							onPress={() => nextButtonHandler()}
							style={ButtonDisabled ? styles.SUBMIT_BUTTON_DISABLED : styles.SUBMIT_BUTTON}
						>

							<Text style={styles.SUBMIT_BUTTON_LABEL}>Next</Text>
						</TouchableOpacity>
					}
				</View>
			</View>
			{confirmLogoutModal()}
			{thankyouModal()}
		</Screen>
	)
})
