import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { TextInput, View, TouchableOpacity, ScrollView } from 'react-native';
import {
	Text,
	Button,
	Screen,
	Checkbox
} from '../../components';
import Icon from "react-native-vector-icons/MaterialIcons"
import Entypo from "react-native-vector-icons/Entypo"
import Ionicons from "react-native-vector-icons/Ionicons"
import styles from './setup-profile-style';
import { COLOR, TYPOGRAPHY } from '../../theme';
import { StackActions, useNavigation } from "@react-navigation/native"

const steps_user = ['pic_username', 'name', 'address']
const steps_business = ['business_type', 'business_exec', 'business_data', 'business_addresss']
const profile_types = [
	{
		label: 'Personal',
		value: 'personal'
	},
	{
		label: 'Business and personal',
		value: 'business_personal'
	},
]

export const SetupProfileScreen = observer(function SetupProfileScreen() {
	const navigation = useNavigation()

	const [Step, setStep] = useState('profile_type')
	const [ButtonDisabled, setButtonDisabled] = useState(true)

	const [ProfileType, setProfileType] = useState('personal')



	const renderStep = () => {
		let render
		switch (Step) {
			case 'pic_username':
				render = renderPicUsername()
				break;
 			case 'name':
				 render = renderName()
				 break;
 			case 'address':
				 render = renderAddress()
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
				<TouchableOpacity key={key + '_ptype'} style={styles.SUBMIT_BUTTON_OUTLINE}>
						<Text style={styles.SUBMIT_BUTTON_OUTLINE_LABEL}>{t.label}</Text>
				</TouchableOpacity>
			))}
		</View>
	)
	const renderPicUsername = () => (
		<View style={styles.STEP_CONTAINER}>
			<Text style={styles.STEP_TITLE}>TITLE</Text>
			<View style={styles.LINE} />
			<Text style={styles.STEP_SUB_TITLE}>SubTitle</Text>
		</View>
	)
	const renderName = () => (
		<View style={styles.STEP_CONTAINER}>
			<Text style={styles.STEP_TITLE}>TITLE</Text>
			<View style={styles.LINE} />
			<Text style={styles.STEP_SUB_TITLE}>SubTitle</Text>
		</View>
	)
	const renderAddress = () => (
		<View style={styles.STEP_CONTAINER}>
			<Text style={styles.STEP_TITLE}>TITLE</Text>
			<View style={styles.LINE} />
			<Text style={styles.STEP_SUB_TITLE}>SubTitle</Text>
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

	const backButtonHandler = () => {
		switch (Step) {
			case 'email':
				navigation.navigate("splash", {})
				break;
			case 'legal':
				setStep('email')
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
			case 'email':
				setStep('verify_email')
				break;
			case 'verify_email':
				if (Code1 && Code2 && Code3 && Code4 && Code5 && Code6) setStep('email_confirmed')
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
					<TouchableOpacity onPress={() => backButtonHandler()} style={styles.BACK_BUTON_CONTAINER}>
						<Icon name={"arrow-back"} size={23} color={'black'} />
						<Text style={styles.BACK_BUTON_LABEL}>{` Back`}</Text>
					</TouchableOpacity>
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
		</Screen>
	)
})
